use actix_web::{
    body::BoxBody, error::PayloadError, http::{header::ToStrError, StatusCode}, HttpResponse,
    ResponseError,
};
use awc::error::{JsonPayloadError, SendRequestError};
use serde::Serialize;
use std::{
    fmt,
    num::{ParseFloatError, ParseIntError},
    string::FromUtf8Error,
};
use tokio::io;
use utoipa::ToSchema;

#[derive(Clone, Serialize, Debug, ToSchema)]
pub struct AppErr {
    status: u16,
    subject: String,
    content: Option<String>,
}

impl AppErr {
    pub fn new(status: u16, subject: &str) -> Self {
        Self { status, subject: subject.to_string(), content: None }
    }

    pub fn default() -> Self {
        Self {
            status: 500, subject: "خطای سیستم".to_string(), content: None
        }
    }

    pub fn content(mut self, content: &str) -> Self {
        self.content = Some(content.to_string());
        self
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
            sqlx::Error::RowNotFound => Self {
                status: 404,
                subject: "یافت نشد".to_string(),
                content: None,
            },
            sqlx::Error::Database(e) => match e.code() {
                Some(c) if c == "2067" => Self {
                    status: 400,
                    subject: "مورد مشابهی پیدا شد".to_string(),
                    content: None,
                },
                _ => Self::default(),
            },
            _ => Self::default(),
        }
    }
}

impl From<actix_web::error::Error> for AppErr {
    fn from(value: actix_web::error::Error) -> Self {
        let r = value.error_response();
        Self {
            status: r.status().as_u16(),
            subject: "خطا".to_string(),
            content: Some(value.to_string()),
        }
    }
}

macro_rules! impl_from_err {
    ($ty:path) => {
        impl From<$ty> for AppErr {
            fn from(value: $ty) -> Self {
                let value = value.to_string();
                log::error!("err 500: {}", value);
                Self {
                    status: 500,
                    subject: stringify!($ty).to_string(),
                    content: Some(value),
                }
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
impl_from_err!(ToStrError);

macro_rules! error_helper {
    ($name:ident, $status:ident, $subject:literal) => {
        macro_rules! $name {
            () => {
                crate::models::AppErr::new(
                    actix_web::http::StatusCode::$status.as_u16(),
                    $subject,
                )
            };
            ($content:literal) => {
                crate::models::AppErr::new(
                    actix_web::http::StatusCode::$status.as_u16(),
                    $subject,
                )
                .content($content)
            };
            ($content:expr) => {
                crate::models::AppErr::new(
                    actix_web::http::StatusCode::$status.as_u16(),
                    $subject,
                )
                .content(&($content))
            };
        }
        pub(crate) use $name;
    };
}

error_helper!(bad_request, BAD_REQUEST, "درخواست بد");
error_helper!(forbidden, FORBIDDEN, "ممنوع");
error_helper!(bad_auth, FORBIDDEN, "احراز هویت نامعتبر");
error_helper!(not_found, NOT_FOUND, "پیدا نشد");
