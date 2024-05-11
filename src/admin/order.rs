use actix_web::web::{Data, Json, Path, Query};
use actix_web::{get, Scope};
use utoipa::OpenApi;

use crate::docs::UpdatePaths;
use crate::models::order::Order;
use crate::models::user::Admin;
use crate::models::{ListInput, Response};
use crate::AppState;

#[derive(OpenApi)]
#[openapi(
    tags((name = "admin::order")),
    paths(
        order_list, order_get
    ),
    components(schemas()),
    servers((url = "/orders")),
    modifiers(&UpdatePaths)
)]
pub struct ApiDoc;

#[utoipa::path(
    get,
    params(("page" = u32, Query, example = 0)),
    responses(
        (status = 200, body = Vec<Order>)
    )
)]
/// List
#[get("/")]
async fn order_list(
    _: Admin, query: Query<ListInput>, state: Data<AppState>,
) -> Response<Vec<Order>> {
    let offset = query.page * 32;

    let orders = sqlx::query_as! {
        Order, "select * from orders limit 32 offset ?", offset
    }
    .fetch_all(&state.sql)
    .await?;

    Ok(Json(orders))
}

#[utoipa::path(
    get,
    params(("id" = i64, Path, example = 1)),
    responses(
        (status = 200, body = Order)
    )
)]
/// Get
#[get("/{id}/")]
async fn order_get(
    _: Admin, path: Path<(i64,)>, state: Data<AppState>,
) -> Response<Order> {
    let order = sqlx::query_as! {
        Order, "select * from orders where id = ?", path.0
    }
    .fetch_one(&state.sql)
    .await?;

    Ok(Json(order))
}

pub fn router() -> Scope {
    Scope::new("/orders").service(order_list).service(order_get)
}
