use core::fmt;
use std::{
    future::Future,
    io,
    num::{ParseFloatError, ParseIntError},
    ops,
    pin::Pin,
    string::FromUtf8Error,
};

use actix_web::{
    body::BoxBody,
    dev::Payload,
    error::{self, PayloadError},
    http::{
        header::{self, AUTHORIZATION},
        StatusCode,
    },
    web::{Data, Json},
    FromRequest, HttpRequest, HttpResponse, ResponseError,
};
use awc::error::{JsonPayloadError, SendRequestError};
use serde::{de::DeserializeOwned, Deserialize, Serialize};
use sha2::Digest;
use sqlx::{
    encode::IsNull,
    sqlite::{SqliteArgumentValue, SqliteTypeInfo},
    Sqlite,
};
use utoipa::ToSchema;

use crate::{utils::CutOff, AppState};

#[derive(Deserialize)]
pub struct ListInput {
    pub page: u32,
}

#[derive(Debug, Serialize, Deserialize, sqlx::FromRow, ToSchema, Default)]
pub struct User {
    pub id: i64,
    pub name: Option<String>,
    pub phone: String,
    pub wallet: i64,
    pub in_hold: i64,
    pub token: String,
    pub photo: Option<String>,
    pub admin: bool,
    pub banned: bool
}

pub struct Admin(pub User);

pub type Response<T> = Result<Json<T>, AppErr>;

impl ops::Deref for Admin {
    type Target = User;

    fn deref(&self) -> &User {
        &self.0
    }
}

impl ops::DerefMut for Admin {
    fn deref_mut(&mut self) -> &mut User {
        &mut self.0
    }
}

fn parse_token(token: &str) -> Option<(i64, String)> {
    let mut token = token.splitn(2, ':');
    let id = match token.next() {
        Some(s) => match s.parse::<i64>() {
            Ok(v) => v,
            Err(_) => return None,
        },
        None => return None,
    };

    let token = match token.next() {
        Some(s) => s.to_string(),
        None => return None,
    };

    Some((id, token))
}

fn extract_token(request: &HttpRequest) -> Option<String> {
    let mut bearer_token: Option<String> = None;
    if let Some(value) = request.headers().get(AUTHORIZATION) {
        bearer_token = value.to_str().map_or(None, |v| Some(v.to_string()));
    }

    if bearer_token.is_none() {
        for hdr in request.headers().get_all(header::COOKIE) {
            for cookie in hdr.as_bytes().split(|v| *v == b';') {
                let mut s = cookie.splitn(2, |v| *v == b'=');

                let key = s.next();
                let val = s.next();
                if key.is_none() || val.is_none() {
                    continue;
                }

                let key = key.unwrap();
                let val = val.unwrap();

                if let Ok(key) = String::from_utf8(key.into()) {
                    if key.trim().to_lowercase() == "authorization" {
                        if let Ok(v) = String::from_utf8(val.into()) {
                            bearer_token = Some(v);
                            break;
                        }
                    }
                }
            }
        }
    }

    let bearer_token = if let Some(v) = bearer_token {
        v
    } else {
        return None;
    };

    let mut tokens = bearer_token.splitn(2, ' ');
    let key = tokens.next();
    let token = tokens.next();
    if key.is_none() || token.is_none() {
        return None;
    }

    if key.unwrap().to_lowercase() != "bearer" {
        return None;
    }

    Some(token.unwrap().to_string())
}

impl FromRequest for User {
    type Error = error::Error;
    type Future = Pin<Box<dyn Future<Output = Result<Self, Self::Error>>>>;

    fn from_request(req: &HttpRequest, _pl: &mut Payload) -> Self::Future {
        let state = req.app_data::<Data<AppState>>().unwrap();
        let pool = state.sql.clone();
        let token = extract_token(req);
        // let token = BearerAuth::from_request(req, pl);

        Box::pin(async move {
            if token.is_none() {
                return Err(error::ErrorForbidden("token was not found"));
            }

            let (id, token) = match parse_token(&token.unwrap()) {
                Some(t) => t,
                None => return Err(error::ErrorForbidden("invalid token")),
            };

            let token = hex::encode(sha2::Sha512::digest(&token));

            let result = sqlx::query_as! {
                User,
                "select * from users where id = ? and token = ?",
                id, token
            }
            .fetch_one(&pool)
            .await;

            match result {
                Ok(mut user) => {
                    if user.banned {
                        return Err(error::ErrorForbidden("banned"));
                    }

                    user.token.cut_off(32);
                    Ok(user)
                }
                Err(_) => Err(error::ErrorForbidden("user not found")),
            }
        })
    }
}

impl FromRequest for Admin {
    type Error = error::Error;
    type Future = Pin<Box<dyn Future<Output = Result<Self, Self::Error>>>>;

    fn from_request(req: &HttpRequest, payload: &mut Payload) -> Self::Future {
        let user = User::from_request(req, payload);
        Box::pin(async {
            let user = user.await?;
            if !user.admin {
                return Err(error::ErrorForbidden("invalid admin"));
            }

            Ok(Admin(user))
        })
    }
}

macro_rules! sql_enum {
    ($vis:vis enum $name:ident { $($member:ident,)* }) => {
        #[derive(Default, Clone, Debug, Serialize, Deserialize, ToSchema)]
        #[serde(rename_all = "snake_case")]
        $vis enum $name {
            #[default]
            $($member,)*
        }

        impl From<i64> for $name {
            fn from(value: i64) -> Self {
                match value {
                    $(x if x == $name::$member as i64 => $name::$member,)*
                    _ => $name::default()
                }
            }
        }

        impl sqlx::Type<Sqlite> for $name {
            fn type_info() -> SqliteTypeInfo {
                <i64 as sqlx::Type<Sqlite>>::type_info()
            }
        }

        impl<'q> sqlx::Encode<'q, Sqlite> for $name {
            fn encode_by_ref(
                &self,
                buf: &mut <Sqlite as sqlx::database::HasArguments<'q>>::ArgumentBuffer,
            ) -> IsNull {
                buf.push(SqliteArgumentValue::Int(self.clone() as i32));
                IsNull::No
            }
        }
    };
}

sql_enum! {
    pub enum TransactionStatus {
        InProgress,
        Failed,
        Success,
    }
}

sql_enum! {
    pub enum TransactionKind {
        In,
        Out,
    }
}

#[derive(Debug, Serialize, Deserialize, sqlx::FromRow, ToSchema)]
pub struct Transaction {
    pub id: i64,
    pub user: i64,
    pub kind: TransactionKind, // in OR out | withdrawl OR deposit
    pub status: TransactionStatus, // success | failed | in progress
    pub amount: i64,
    pub vendor_order_id: Option<String>,
    pub vendor_track_id: Option<i64>,
    pub card_number: Option<String>,
    pub hashed_card_number: Option<String>,
    pub date: Option<i64>,
    pub bank_track_id: Option<i64>,
}

#[derive(Debug, Deserialize, Default)]
pub struct JsonStr<T>(pub T);

// impl<T> JsonStr<T> {
//     pub fn into_inner(self) -> T {
//         self.0
//     }
// }

impl<T> ops::Deref for JsonStr<T> {
    type Target = T;

    fn deref(&self) -> &T {
        &self.0
    }
}

impl<T> ops::DerefMut for JsonStr<T> {
    fn deref_mut(&mut self) -> &mut T {
        &mut self.0
    }
}

impl<T: Serialize> Serialize for JsonStr<T> {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        self.0.serialize(serializer)
    }
}

impl<'q, T: Serialize> sqlx::Encode<'q, Sqlite> for JsonStr<T> {
    fn encode_by_ref(
        &self,
        buf: &mut <Sqlite as sqlx::database::HasArguments<'q>>::ArgumentBuffer,
    ) -> IsNull {
        let result = serde_json::to_string(&self.0).unwrap_or("{}".to_string());
        buf.push(SqliteArgumentValue::Text(result.into()));

        IsNull::No
    }
}

impl<T> sqlx::Type<Sqlite> for JsonStr<T> {
    fn type_info() -> SqliteTypeInfo {
        <&str as sqlx::Type<Sqlite>>::type_info()
    }
}

impl<T: DeserializeOwned + Default> From<String> for JsonStr<T> {
    fn from(value: String) -> Self {
        Self(serde_json::from_str::<T>(&value).unwrap_or(T::default()))
    }
}

#[derive(Clone, Serialize, Debug, ToSchema)]
pub struct AppErr {
    status: u16,
    message: String,
}

impl AppErr {
    pub fn new(status: u16, message: &str) -> Self {
        Self { status, message: message.to_string() }
    }

    pub fn default() -> Self {
        Self { status: 500, message: "Internal Server Error".to_string() }
    }
}

impl fmt::Display for AppErr {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "{:?}", self)
    }
}

impl ResponseError for AppErr {
    fn status_code(&self) -> StatusCode {
        StatusCode::from_u16(self.status)
            .unwrap_or(StatusCode::INTERNAL_SERVER_ERROR)
    }

    fn error_response(&self) -> HttpResponse<BoxBody> {
        HttpResponse::build(self.status_code()).json(self)
    }
}

impl From<sqlx::Error> for AppErr {
    fn from(value: sqlx::Error) -> Self {
        match value {
            sqlx::Error::RowNotFound => {
                Self { status: 404, message: "not found".to_string() }
            }
            _ => Self { status: 500, message: "database error".to_string() },
        }
    }
}

impl From<error::Error> for AppErr {
    fn from(value: error::Error) -> Self {
        let r = value.error_response();
        Self { status: r.status().as_u16(), message: value.to_string() }
    }
}

macro_rules! impl_from_err {
    ($ty:path) => {
        impl From<$ty> for AppErr {
            fn from(value: $ty) -> Self {
                let value = value.to_string();
                log::error!("{}", value);
                Self { status: 500, message: value }
            }
        }
    };
}

impl_from_err!(io::Error);
impl_from_err!(PayloadError);
impl_from_err!(ParseFloatError);
impl_from_err!(ParseIntError);
impl_from_err!(JsonPayloadError);
impl_from_err!(SendRequestError);
impl_from_err!(FromUtf8Error);
impl_from_err!(serde_json::Error);

macro_rules! error_helper {
    ($name:ident, $status:ident) => {
        #[doc = concat!("Helper function that wraps any error and generates a `", stringify!($status), "` response.")]
        #[allow(non_snake_case)]
        pub fn $name(err: &str) -> AppErr {
            AppErr {
                status: StatusCode::$status.as_u16(),
                message: err.to_string()
            }
        }
    };
}

error_helper!(AppErrBadRequest, BAD_REQUEST);
error_helper!(AppErrForbidden, FORBIDDEN);
