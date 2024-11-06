use std::collections::HashMap;

use actix_web::web::{Data, Json, Path, Query};
use actix_web::{get, post, Scope};
use serde::Deserialize;
use sqlx::SqlitePool;
use utoipa::{OpenApi, ToSchema};

use crate::config::{config, Config};
use crate::docs::UpdatePaths;
use crate::models::discount::Discount;
use crate::models::order::{Order, OrderStatus};
use crate::models::user::User;
use crate::models::{
    bad_request, not_found, AppErr, JsonStr, ListInput, Response,
};
use crate::utils;
use crate::AppState;

#[derive(OpenApi)]
#[openapi(
    tags((name = "api::orders")),
    paths(order_list, order_new, discount_get),
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
    discount: Option<String>,
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
        .ok_or(not_found!("product not found"))?;

    let plan =
        product.plans.get(&body.plan).ok_or(not_found!("plan not found"))?;

    let now = utils::now();
    let mut price = plan.0 as i64;
    let mut discount_id = None;

    let discount_str = if let Some(code) = &body.discount {
        let discount = get_discount(user.id, code, &state.sql).await?;
        if matches!(&discount.kind, Some(k) if k != &body.kind) {
            return Err(bad_request!("discount is not for this product"));
        }
        if matches!(&discount.plan, Some(p) if p != &body.plan) {
            return Err(bad_request!("discount is not for this product"));
        }

        sqlx::query! {
            "insert into discount_user(user, discount) values(?, ?)",
            user.id, discount.id
        }
        .execute(&state.sql)
        .await?;

        let uses = discount.uses + 1;
        let disabled = matches!(discount.max_uses, Some(x) if x <= uses);

        sqlx::query! {
            "update discounts set uses = ?, disabled = ? where id = ?",
            uses, disabled, discount.id
        }
        .execute(&state.sql)
        .await?;

        price = (price / 100) * (100 - discount.amount);
        discount_id = Some(discount.id);
        let mut out = format!(
            r##"Discount: {}:`{}` \| {} \- {}%"##,
            discount.id, discount.code, plan.0, discount.amount
        );
        out.insert(0, '\n');
        out
    } else {
        String::new()
    };

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
        "insert into orders(user, price, timestamp, kind, data, discount) values(?,?,?,?,?,?)",
        user.id, price, now, kind, data, discount_id
    }.execute(&state.sql).await?;

    utils::send_message(
        Config::TT_ORDER_NEW,
        &format! {
            "User: `{}`:{}\nprice: {}\nkind: `{}`{}\ndata: ```json\n{}\n```",
            user.id, utils::escape(&user.name.unwrap_or(user.phone)), price, kind, discount_str,
            utils::escape_code(&serde_json::to_string_pretty(&data).unwrap_or(String::new()))
        },
    ).await;

    let order = Order {
        user: user.id,
        id: result.last_insert_rowid(),
        price,
        timestamp: now,
        kind,
        data,
        status: OrderStatus::Wating,
        admin: None,
        discount: None,
    };

    Ok(Json(order))
}

async fn get_discount(
    user_id: i64, code: &str, pool: &SqlitePool,
) -> Result<Discount, AppErr> {
    let now = utils::now();
    sqlx::query! {
        "update discounts set disabled = true where expires <= ? OR uses >= max_uses",
        now
    }
    .execute(pool)
    .await?;

    let Some(discount) = sqlx::query_as! {
        Discount,
        "select * from discounts where code = ?",
        code
    }
    .fetch_optional(pool)
    .await?
    else {
        return Err(not_found!("کد تخفیف یافت نشد"));
    };

    if discount.disabled {
        return Err(not_found!("کد تخفیف یافت نشد"));
    }

    let result = sqlx::query! {
        "select id from discount_user where user = ? and discount = ?",
        user_id, discount.id
    }
    .fetch_optional(pool)
    .await?;

    if result.is_some() {
        return Err(bad_request!("این کد تخفیف قبلا استفاده شده"));
    }

    return Ok(discount);
}

#[utoipa::path(
    get,
    params(("code" = String, Path,)),
    responses((status = 200, body = Discount))
)]
/// Discount Get
#[get("/discount/{code}/")]
async fn discount_get(
    user: User, path: Path<(String,)>, state: Data<AppState>,
) -> Response<Discount> {
    Ok(Json(get_discount(user.id, &path.0, &state.sql).await?))
}

pub fn router() -> Scope {
    Scope::new("/orders")
        .service(order_list)
        .service(order_new)
        .service(discount_get)
}
