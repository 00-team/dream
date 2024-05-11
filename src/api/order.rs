use actix_web::web::{Data, Json, Query};
use actix_web::{get, Scope};
use utoipa::OpenApi;

use crate::docs::UpdatePaths;
use crate::models::order::{Order, OrderData, OrderStatus};
use crate::models::user::User;
use crate::models::{ListInput, Response};
use crate::AppState;

#[derive(OpenApi)]
#[openapi(
    tags((name = "api::orders")),
    paths(order_list),
    components(schemas(Order, OrderData, OrderStatus)),
    servers((url = "/orders")),
    modifiers(&UpdatePaths)
)]
pub struct ApiDoc;

#[utoipa::path(
    get,
    params(("page" = u32, Query, example = 0)),
    responses(
        (status = 200, body = Vec<Transaction>)
    )
)]
/// Order List
#[get("/")]
async fn order_list(
    user: User, query: Query<ListInput>, state: Data<AppState>,
) -> Response<Vec<Order>> {
    let offset = query.page * 32;
    let result = sqlx::query_as! {
        Order,
        "select * from orders where user = ? limit 32 offset ?",
        user.id, offset
    }
    .fetch_all(&state.sql)
    .await?;

    Ok(Json(result))
}

pub fn router() -> Scope {
    Scope::new("/orders").service(order_list)
}
