use super::AppErr;
use crate::AppState;
use actix_web::dev::Payload;
use actix_web::{
    web::{Data, Path},
    FromRequest, HttpRequest,
};
use serde::{Deserialize, Serialize};
use std::{future::Future, pin::Pin};
use utoipa::ToSchema;

#[derive(Debug, Serialize, Deserialize, sqlx::FromRow, ToSchema)]
pub struct Discount {
    pub id: i64,
    pub code: String,
    pub amount: i64,
    pub uses: i64,
    pub disabled: bool,
    pub kind: Option<String>,
    pub plan: Option<String>,
    pub max_uses: Option<i64>,
    pub expires: Option<i64>,
}

impl FromRequest for Discount {
    type Error = AppErr;
    type Future = Pin<Box<dyn Future<Output = Result<Self, Self::Error>>>>;

    fn from_request(req: &HttpRequest, _: &mut Payload) -> Self::Future {
        let path = Path::<(i64,)>::extract(req);
        let state = req.app_data::<Data<AppState>>().unwrap();
        let pool = state.sql.clone();

        Box::pin(async move {
            let path = path.await?;
            let result = sqlx::query_as! {
                Discount,
                "select * from discounts where id = ?",
                path.0
            }
            .fetch_one(&pool)
            .await?;

            Ok(result)
        })
    }
}
