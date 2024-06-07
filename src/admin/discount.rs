use actix_web::web::{Data, Json, Query};
use actix_web::{get, post, Scope};
use serde::Deserialize;
use utoipa::{OpenApi, ToSchema};

use crate::config::config;
use crate::docs::UpdatePaths;
use crate::models::discount::Discount;
use crate::models::user::Admin;
use crate::models::{AppErrBadRequest, ListInput, Response};
use crate::utils;
use crate::AppState;

#[derive(OpenApi)]
#[openapi(
    tags((name = "admin::discount")),
    paths(discount_list, discount_new),
    components(schemas(Discount, NewDiscountBody)),
    servers((url = "/discounts")),
    modifiers(&UpdatePaths)
)]
pub struct ApiDoc;

#[utoipa::path(
    get,
    params(ListInput),
    responses((status = 200, body = Vec<User>))
)]
/// List
#[get("/")]
async fn discount_list(
    _: Admin, query: Query<ListInput>, state: Data<AppState>,
) -> Response<Vec<Discount>> {
    let offset = i64::from(query.page) * 32;

    let result = sqlx::query_as! {
        Discount, "select * from discounts limit 32 offset ?", offset
    }
    .fetch_all(&state.sql)
    .await?;

    Ok(Json(result))
}

#[derive(Deserialize, ToSchema)]
struct NewDiscountBody {
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
    request_body = NewDiscountBody,
    responses((status = 200, body = User))
)]
/// New
#[post("/")]
async fn discount_new(
    _: Admin, body: Json<NewDiscountBody>, state: Data<AppState>,
) -> Response<Discount> {
    if body.amount > 100 {
        return Err(AppErrBadRequest("invalid amount"));
    }

    if body.code.len() > 255 {
        return Err(AppErrBadRequest("code is too long"));
    }

    let now = utils::now();
    let expires = body.expires.map(|e| now + e as i64);

    if body.plan.is_some() && body.kind.is_none() {
        return Err(AppErrBadRequest("could not set a plan without a product"));
    }

    if let Some(kind) = &body.kind {
        let product = config()
            .products
            .get(kind)
            .ok_or(AppErrBadRequest("product not found"))?;

        if let Some(plan) = &body.plan {
            if product.plans.get(plan).is_none() {
                return Err(AppErrBadRequest("product plan not found"));
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

pub fn router() -> Scope {
    Scope::new("/discounts").service(discount_list).service(discount_new)
}
