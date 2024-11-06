use crate::config::config;
use crate::docs::UpdatePaths;
use crate::models::discount::Discount;
use crate::models::user::Admin;
use crate::models::{bad_request, AppErr, ListInput, Response};
use crate::utils;
use crate::AppState;

use actix_web::web::{Data, Json, Query};
use actix_web::{delete, get, patch, post, HttpResponse, Scope};
use serde::Deserialize;
use utoipa::{OpenApi, ToSchema};

#[derive(OpenApi)]
#[openapi(
    tags((name = "admin::discount")),
    paths(discount_list, discount_new, discount_update, discount_delete),
    components(schemas(Discount, DiscountNewBody, DiscountUpdateBody)),
    servers((url = "/discounts")),
    modifiers(&UpdatePaths)
)]
pub struct ApiDoc;

#[utoipa::path(
    get,
    params(ListInput),
    responses((status = 200, body = Vec<Discount>))
)]
/// List
#[get("/")]
async fn discount_list(
    _: Admin, query: Query<ListInput>, state: Data<AppState>,
) -> Response<Vec<Discount>> {
    let now = utils::now();
    sqlx::query! {
        "update discounts set disabled = true where expires <= ? OR max_uses <= uses",
        now
    }
    .execute(&state.sql)
    .await?;

    let offset = i64::from(query.page) * 32;
    let result = sqlx::query_as! {
        Discount,
        "select * from discounts order by id desc limit 32 offset ?",
        offset
    }
    .fetch_all(&state.sql)
    .await?;

    Ok(Json(result))
}

#[derive(Deserialize, ToSchema)]
struct DiscountNewBody {
    #[schema(example = "technoblade", max_length = 255)]
    code: String,
    #[schema(maximum = 100)]
    amount: u8,
    kind: Option<String>,
    plan: Option<String>,
    max_uses: Option<u32>,
    expires: Option<u32>,
}

#[utoipa::path(
    post,
    request_body = DiscountNewBody,
    responses((status = 200, body = Discount))
)]
/// New
#[post("/")]
async fn discount_new(
    _: Admin, body: Json<DiscountNewBody>, state: Data<AppState>,
) -> Response<Discount> {
    if body.amount > 100 {
        return Err(bad_request!("max amount is 100%"));
    }

    if body.code.len() > 255 {
        return Err(bad_request!("code is too long"));
    }

    let now = utils::now();
    let expires = body.expires.map(|e| now + e as i64);

    if body.plan.is_some() && body.kind.is_none() {
        return Err(bad_request!("could not set a plan without a product"));
    }

    if let Some(kind) = &body.kind {
        let Some(product) = config().products.get(kind) else {
            return Err(bad_request!("product not found"));
        };

        if let Some(plan) = &body.plan {
            if product.plans.get(plan).is_none() {
                return Err(bad_request!("product plan not found"));
            }
        }
    }

    let result = sqlx::query! {
        "insert into discounts(code, amount, kind, plan, max_uses, expires) values(?,?,?,?,?,?)",
        body.code, body.amount, body.kind, body.plan, body.max_uses, expires
    }
    .execute(&state.sql)
    .await?;

    let discount = Discount {
        id: result.last_insert_rowid(),
        amount: body.amount as i64,
        code: body.code.clone(),
        kind: body.kind.clone(),
        plan: body.plan.clone(),
        max_uses: body.max_uses.map(|x| x as i64),
        expires,
        disabled: false,
        uses: 0,
    };

    Ok(Json(discount))
}

#[derive(Deserialize, ToSchema)]
struct DiscountUpdateBody {
    disabled: bool,
}

#[utoipa::path(
    patch,
    params(("id" = i64, Path,)),
    request_body = DiscountUpdateBody,
    responses((status = 200, body = Discount))
)]
/// Update
#[patch("/{id}/")]
async fn discount_update(
    _: Admin, discount: Discount, body: Json<DiscountUpdateBody>,
    state: Data<AppState>,
) -> Response<Discount> {
    let mut discount = discount;
    discount.disabled = body.disabled;

    sqlx::query! {
        "update discounts set disabled = ? where id = ?",
        discount.disabled, discount.id
    }
    .execute(&state.sql)
    .await?;

    Ok(Json(discount))
}

#[utoipa::path(
    delete,
    params(("id" = i64, Path,)),
    responses((status = 200))
)]
/// Delete
#[delete("/{id}/")]
async fn discount_delete(
    _: Admin, discount: Discount, state: Data<AppState>,
) -> Result<HttpResponse, AppErr> {
    sqlx::query! {
        "delete from discounts where id = ?", discount.id
    }
    .execute(&state.sql)
    .await?;

    Ok(HttpResponse::Ok().finish())
}

pub fn router() -> Scope {
    Scope::new("/discounts")
        .service(discount_list)
        .service(discount_new)
        .service(discount_update)
        .service(discount_delete)
}
