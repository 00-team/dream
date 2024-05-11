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

#[derive(Debug, Serialize, Deserialize, ToSchema)]
pub struct OrderData {
    username: Option<String>,
    password: Option<String>,
    email: Option<String>,
    contact: Option<String>
}

#[derive(Debug, Serialize, Deserialize, sqlx::FromRow, ToSchema)]
pub struct Order {
    id: i64,
    user: i64,
    kind: String,
    price: i64,
    status: OrderStatus,
    #[schema(value_type = OrderData)]
    data: JsonStr<OrderData>,
    timestamp: i64,
}
