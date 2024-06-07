use serde::{Deserialize, Serialize};
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
    pub max_uses: i64,
    pub expires: i64,
}
