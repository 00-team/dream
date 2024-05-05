use actix_web::web::{Data, Json, Query};
use actix_web::{get, post, Scope};
use serde::Deserialize;
use utoipa::{OpenApi, ToSchema};

use crate::config::Config;
use crate::docs::UpdatePaths;
use crate::general::{general_get, general_set};
use crate::models::{ListInput, Offer, Product, Response, User};
use crate::utils::sql_unwrap;
use crate::AppState;

#[derive(OpenApi)]
#[openapi(
    tags((name = "api::product")),
    paths(product_list, product_get, offer_list, offer_add),
    components(schemas(Offer, OfferAddBody)),
    servers((url = "/products")),
    modifiers(&UpdatePaths)
)]
pub struct Doc;

#[utoipa::path(
    get,
    params(("page" = u32, Query, example = 0)),
    responses(
        (status = 200, body = Vec<Product>)
    )
)]
/// Product List
#[get("/")]
async fn product_list(
    query: Query<ListInput>, state: Data<AppState>,
) -> Response<Vec<Product>> {
    let offset = i64::from(query.page) * 30;

    let products = sql_unwrap(
        sqlx::query_as! {
            Product,
            "select * from products limit 30 offset ?",
            offset
        }
        .fetch_all(&state.sql)
        .await,
    )?;

    Ok(Json(products))
}

#[utoipa::path(
    get,
    params(("id" = i64, Path,)),
    responses(
        (status = 200, body = Product)
    )
)]
/// Product Get
#[get("/{id}/")]
async fn product_get(_: User, product: Product) -> Json<Product> {
    Json(product)
}

#[utoipa::path(
    get,
    params(
        ("id" = i64, Path,),
        ("page" = u32, Query,),
    ),
    responses(
        (status = 200, body = Vec<Offer>)
    )
)]
/// Product Offers List
#[get("/{id}/offers/")]
async fn offer_list(
    _: User, product: Product, query: Query<ListInput>, state: Data<AppState>,
) -> Response<Vec<Offer>> {
    let offset = i64::from(query.page) * 30;

    let offers = sql_unwrap(
        sqlx::query_as! {
            Offer,
            "select * from offers where product = ? limit 30 offset ?",
            product.id, offset
        }
        .fetch_all(&state.sql)
        .await,
    )?;

    Ok(Json(offers))
}

#[derive(Deserialize, ToSchema)]
struct OfferAddBody {
    amount: u32,
}

#[utoipa::path(
    post,
    params(("id" = i64, Path,)),
    responses(
        (status = 200, body = Offer)
    )
)]
/// Product Add Offer
#[post("/{id}/offers/")]
async fn offer_add(
    user: User, product: Product, body: Json<OfferAddBody>,
    state: Data<AppState>,
) -> Response<Offer> {
    let now = crate::utils::now();
    let amount: i64 = i64::from(body.amount);

    let offer_tax = ((body.amount as f32 / 100.0) * Config::OFFER_TAX)
        .max(Config::OFFER_TAX_MAX);

    let mut general = general_get(&state.sql).await?;
    general.available_money += offer_tax as i64;
    general_set(&state.sql, &general).await?;

    // give back the last offer money aka unhold it.
    // then take the offer_tax and put amount to hold
    // if amount + offer_tax is not in users wallet
    // then make the user pay that amount
    // wallet - (amount + offer_tax)

    let result = sql_unwrap(
        sqlx::query_as! {
            Offer,
            "insert into offers(product, user, amount, timestamp)
            values(?, ?, ?, ?)",
            product.id, user.id, amount, now
        }
        .execute(&state.sql)
        .await,
    )?;

    Ok(Json(Offer {
        id: result.last_insert_rowid(),
        product: product.id,
        user: Some(user.id),
        amount,
        timestamp: now,
    }))
}

pub fn router() -> Scope {
    Scope::new("/products")
        .service(product_list)
        .service(product_get)
        .service(offer_list)
        .service(offer_add)
}
