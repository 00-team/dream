use actix_web::web::{Data, Json, Query};
use actix_web::{get, post, HttpResponse, Scope};
use serde::Deserialize;
use utoipa::{OpenApi, ToSchema};

use crate::docs::UpdatePaths;
use crate::models::order::{Order, OrderStatus};
use crate::models::user::{Admin, User};
use crate::models::{AppErr, AppErrBadRequest, ListInput, Response};
use crate::AppState;

#[derive(OpenApi)]
#[openapi(
    tags((name = "admin::order")),
    paths(order_list, order_get, order_update),
    components(schemas(UpdateOrder)),
    servers((url = "/orders")),
    modifiers(&UpdatePaths)
)]
pub struct ApiDoc;

#[utoipa::path(
    get,
    params(("page" = u32, Query, example = 0)),
    responses((status = 200, body = Vec<Order>))
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
    responses((status = 200, body = Order))
)]
/// Get
#[get("/{id}/")]
async fn order_get(_: Admin, order: Order) -> Response<Order> {
    Ok(Json(order))
}

#[derive(Deserialize, ToSchema)]
struct UpdateOrder {
    status: OrderStatus,
}

#[utoipa::path(
    post,
    request_body = UpdateOrder,
    params(("id" = i64, Path, example = 1)),
    responses((status = 200))
)]
/// Update
#[post("/{id}/")]
async fn order_update(
    _: Admin, order: Order, body: Json<UpdateOrder>, state: Data<AppState>,
) -> Result<HttpResponse, AppErr> {
    if order.status != OrderStatus::Wating {
        return Err(AppErrBadRequest("cannot change this order's status"));
    }

    if body.status == OrderStatus::Wating {
        return Err(AppErrBadRequest("no change"));
    }

    if body.status == OrderStatus::Refunded {
        let user = sqlx::query_as! {
            User,
            "select * from users where id = ?",
            order.user
        }
        .fetch_one(&state.sql)
        .await?;

        let wallet = user.wallet + order.price;

        sqlx::query! {
            "update users set wallet = ? where id = ?",
            wallet, order.user
        }
        .execute(&state.sql)
        .await?;
    }

    sqlx::query! {
        "update orders set status = ? where id = ?",
        body.status, order.id
    }
    .execute(&state.sql)
    .await?;

    Ok(HttpResponse::Ok().finish())
}

pub fn router() -> Scope {
    Scope::new("/orders")
        .service(order_list)
        .service(order_get)
        .service(order_update)
}
