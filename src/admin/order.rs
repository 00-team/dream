use actix_web::web::{Data, Json, Query};
use actix_web::{get, patch, post, HttpResponse, Scope};
use itertools::Itertools;
use serde::{Deserialize, Serialize};
use utoipa::{OpenApi, ToSchema};

use crate::docs::UpdatePaths;
use crate::models::order::{Order, OrderStatus};
use crate::models::user::{Admin, User};
use crate::models::{AppErr, AppErrBadRequest, ListInput, Response};
use crate::{utils, AppState};

#[derive(OpenApi)]
#[openapi(
    tags((name = "admin::order")),
    paths(order_list, order_get, order_update, send_sms),
    components(schemas(UpdateOrder, OrderList, SendSms)),
    servers((url = "/orders")),
    modifiers(&UpdatePaths)
)]
pub struct ApiDoc;

#[derive(Serialize, ToSchema)]
struct OrderList {
    orders: Vec<Order>,
    users: Vec<User>,
}

#[utoipa::path(
    get,
    params(("page" = u32, Query, example = 0)),
    responses((status = 200, body = Vec<Order>))
)]
/// List
#[get("/")]
async fn order_list(
    _: Admin, query: Query<ListInput>, state: Data<AppState>,
) -> Response<OrderList> {
    let offset = query.page * 32;

    let orders = sqlx::query_as! {
        Order, "select * from orders order by id desc limit 32 offset ?", offset
    }
    .fetch_all(&state.sql)
    .await?;

    let user_ids = orders.iter().map(|o| o.user).unique().join(", ");

    let mut users = sqlx::query_as! {
        User, "select * from users where id in (?)", user_ids
    }
    .fetch_all(&state.sql)
    .await?;

    users.iter_mut().for_each(|user| user.token = String::new());

    Ok(Json(OrderList { orders, users }))
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
    patch,
    request_body = UpdateOrder,
    params(("id" = i64, Path, example = 1)),
    responses((status = 200))
)]
/// Update
#[patch("/{id}/")]
async fn order_update(
    _: Admin, order: Order, body: Json<UpdateOrder>, state: Data<AppState>,
) -> Result<HttpResponse, AppErr> {
    if order.status != OrderStatus::Wating {
        return Err(AppErrBadRequest("cannot change this order's status"));
    }

    if body.status == OrderStatus::Wating {
        return Err(AppErrBadRequest("no change"));
    }

    let user = sqlx::query_as! {
        User,
        "select * from users where id = ?",
        order.user
    }
    .fetch_one(&state.sql)
    .await?;

    if body.status == OrderStatus::Refunded {
        let wallet = user.wallet + order.price;

        sqlx::query! {
            "update users set wallet = ? where id = ?",
            wallet, order.user
        }
        .execute(&state.sql)
        .await?;

        utils::send_sms(&user.phone, "dreampay.org\nyour order was refunded")
            .await;
    } else {
        utils::send_sms(&user.phone, "dreampay.org\nyour order has finished")
            .await;
    }

    sqlx::query! {
        "update orders set status = ? where id = ?",
        body.status, order.id
    }
    .execute(&state.sql)
    .await?;

    Ok(HttpResponse::Ok().finish())
}

#[derive(Deserialize, ToSchema)]
struct SendSms {
    phone: String,
    text: String,
}

#[utoipa::path(
    post,
    request_body = SendSms,
    responses((status = 200))
)]
/// Send Sms
#[post("/sms/")]
async fn send_sms(
    _: Admin, body: Json<SendSms>,
) -> Result<HttpResponse, AppErr> {
    utils::phone_validator(&body.phone)?;
    utils::send_sms(&body.phone, &body.text).await;

    Ok(HttpResponse::Ok().finish())
}

pub fn router() -> Scope {
    Scope::new("/orders")
        .service(order_list)
        .service(order_get)
        .service(order_update)
        .service(send_sms)
}
