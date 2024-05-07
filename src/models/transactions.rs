
use crate::models::sql_enum;

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
    pub kind: TransactionKind,     // in OR out | withdrawl OR deposit
    pub status: TransactionStatus, // success | failed | in progress
    pub amount: i64,
    pub vendor_order_id: Option<String>,
    pub vendor_track_id: Option<i64>,
    pub card_number: Option<String>,
    pub hashed_card_number: Option<String>,
    pub date: Option<i64>,
    pub bank_track_id: Option<i64>,
}
