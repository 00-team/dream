use super::{auth::Authorization, forbidden, AppErr};
use crate::AppState;
use actix_multipart::form::{tempfile::TempFile, MultipartForm};
use actix_web::{dev::Payload, web::Data, FromRequest, HttpRequest};
use serde::{Deserialize, Serialize};
use std::{future::Future, pin::Pin};
use utoipa::ToSchema;

#[derive(Debug, Serialize, Deserialize, sqlx::FromRow, ToSchema, Default)]
pub struct User {
    pub id: i64,
    pub name: Option<String>,
    pub phone: String,
    pub wallet: i64,
    pub in_hold: i64,
    pub token: Option<String>,
    pub photo: Option<String>,
    pub admin: bool,
    pub banned: bool,
}

#[derive(Debug, MultipartForm, ToSchema)]
pub struct UpdatePhoto {
    #[schema(value_type = String, format = Binary)]
    #[multipart(limit = "8 MiB")]
    pub photo: TempFile,
}

pub struct Admin(pub User);

impl FromRequest for User {
    type Error = AppErr;
    type Future = Pin<Box<dyn Future<Output = Result<Self, Self::Error>>>>;

    fn from_request(req: &HttpRequest, _pl: &mut Payload) -> Self::Future {
        let state = req.app_data::<Data<AppState>>().unwrap();
        let pool = state.sql.clone();
        let auth = Authorization::try_from(req);
        // let token = BearerAuth::from_request(req, pl);

        Box::pin(async move {
            let user = match auth? {
                Authorization::User { id, token } => {
                    sqlx::query_as! {
                        User,
                        "select * from users where id = ? and token = ?",
                        id, token
                    }
                    .fetch_one(&pool)
                    .await?
                }
            };

            if user.banned {
                return Err(forbidden!("banned"));
            }

            Ok(user)
        })
    }
}

impl FromRequest for Admin {
    type Error = AppErr;
    type Future = Pin<Box<dyn Future<Output = Result<Self, Self::Error>>>>;

    fn from_request(req: &HttpRequest, payload: &mut Payload) -> Self::Future {
        let user = User::from_request(req, payload);
        Box::pin(async {
            let user = user.await?;
            if !user.admin {
                return Err(forbidden!());
            }

            Ok(Admin(user))
        })
    }
}
