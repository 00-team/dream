use serde::{Deserialize, Serialize};
use utoipa::ToSchema;

use super::{sql_enum, JsonStr};

sql_enum! {
    pub enum OrderStatus {
        Wating,
        Refunded,
        Done,
    }
}

#[derive(Debug, Serialize, Deserialize, ToSchema, Default)]
pub struct OrderData {
    pub username: Option<String>,
    pub password: Option<String>,
    pub email: Option<String>,
    pub contact: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, sqlx::FromRow, ToSchema)]
pub struct Order {
    pub id: i64,
    pub user: i64,
    pub kind: String,
    pub price: i64,
    pub status: OrderStatus,
    #[schema(value_type = OrderData)]
    pub data: JsonStr<OrderData>,
    pub timestamp: i64,
}
