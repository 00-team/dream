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





