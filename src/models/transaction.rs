use serde::{Deserialize, Serialize};
use utoipa::ToSchema;

use super::sql_enum;

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

sql_enum! {
    pub enum TransactionVendor {
        Zarinpal,
        Zibal,
    }
}

#[derive(Debug, Serialize, Deserialize, sqlx::FromRow, ToSchema)]
pub struct Transaction {
    pub id: i64,
    pub user: i64,
    pub kind: TransactionKind,
    pub status: TransactionStatus,
    pub vendor: TransactionVendor,
    pub amount: i64,
    pub timestamp: i64,
    pub vendor_order_id: Option<String>,
    pub vendor_track_id: Option<i64>,
    pub card: Option<String>,
    pub hashed_card: Option<String>,
    pub date: Option<i64>,
    pub bank_track_id: Option<i64>,
}
