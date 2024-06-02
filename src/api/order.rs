use std::collections::HashMap;

use actix_web::web::{Data, Json, Query};
use actix_web::{get, post, Scope};
use serde::Deserialize;
use utoipa::{OpenApi, ToSchema};

use crate::config::config;
use crate::docs::UpdatePaths;
use crate::models::order::{Order, OrderStatus};
use crate::models::user::User;
use crate::models::{AppErr, JsonStr, ListInput, Response};
use crate::utils;
use crate::AppState;

#[derive(OpenApi)]
#[openapi(
    tags((name = "api::orders")),
    paths(order_list, order_new),
    components(schemas(Order, OrderStatus, NewOrder)),
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
    user: User, query: Query<ListInput>, state: Data<AppState>,
) -> Response<Vec<Order>> {
    let offset = query.page * 32;
    let result = sqlx::query_as! {
        Order,
        "select * from orders where user = ? order by id desc limit 32 offset ?",
        user.id, offset
    }
    .fetch_all(&state.sql)
    .await?;

    Ok(Json(result))
}

#[derive(Debug, Deserialize, ToSchema)]
struct NewOrder {
    kind: String,
    plan: String,
    data: HashMap<String, String>,
}

#[utoipa::path(
    post,
    request_body = NewOrder,
    responses(
        (status = 200, body = Order)
    )
)]
/// New
#[post("/")]
async fn order_new(
    user: User, body: Json<NewOrder>, state: Data<AppState>,
) -> Response<Order> {
    let product = config()
        .products
        .get(&body.kind)
        .ok_or(AppErr::new(404, "product not found"))?;

    let plan = product
        .plans
        .get(&body.plan)
        .ok_or(AppErr::new(404, "plan not found"))?;

    let now = utils::now();
    let price = plan.0 as i64;

    if user.wallet < price {
        return Err(AppErr::new(400, "Not Enough money in the wallet"));
    }

    let wallet = user.wallet - price;
    let data = JsonStr(body.data.clone());

    sqlx::query! {
        "update users set wallet = ? where id = ?",
        wallet, user.id
    }
    .execute(&state.sql)
    .await?;

    let kind = format!("{}.{}", body.kind, body.plan);

    let result = sqlx::query! {
        "insert into orders(user, price, timestamp, kind, data) values(?, ?, ?, ?, ?)",
        user.id, price, now, kind, data
    }.execute(&state.sql).await?;

    let order = Order {
        user: user.id,
        id: result.last_insert_rowid(),
        price,
        timestamp: now,
        kind,
        data,
        status: OrderStatus::Wating,
    };

    Ok(Json(order))
}

pub fn router() -> Scope {
    Scope::new("/orders").service(order_list).service(order_new)
}
