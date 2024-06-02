use std::{collections::HashMap, future::Future, pin::Pin};

use actix_web::dev::Payload;
use actix_web::{
    web::{Data, Path},
    FromRequest, HttpRequest,
};
use serde::{Deserialize, Serialize};
use utoipa::ToSchema;

use crate::AppState;

use super::{sql_enum, AppErr, JsonStr};

sql_enum! {
    pub enum OrderStatus {
        Wating,
        Refunded,
        Done,
    }
}

#[derive(Debug, Serialize, Deserialize, sqlx::FromRow, ToSchema)]
pub struct Order {
    pub id: i64,
    pub user: i64,
    pub kind: String,
    pub price: i64,
    pub status: OrderStatus,
    #[schema(value_type = HashMap<String, String>)]
    pub data: JsonStr<HashMap<String, String>>,
    pub timestamp: i64,
}

impl FromRequest for Order {
    type Error = AppErr;
    type Future = Pin<Box<dyn Future<Output = Result<Self, Self::Error>>>>;

    fn from_request(req: &HttpRequest, _: &mut Payload) -> Self::Future {
        let path = Path::<(i64,)>::extract(req);
        let state = req.app_data::<Data<AppState>>().unwrap();
        let pool = state.sql.clone();

        Box::pin(async move {
            let path = path.await?;
            let order = sqlx::query_as! {
                Order,
                "select * from orders where id = ?",
                path.0
            }
            .fetch_one(&pool)
            .await?;

            Ok(order)
        })
    }
}
