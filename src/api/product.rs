use actix_web::web::Json;
use actix_web::{get, Scope};
use utoipa::OpenApi;

use crate::config::{config, Product};
use crate::docs::UpdatePaths;
use crate::models::Response;

#[derive(OpenApi)]
#[openapi(
    tags((name = "api::product")),
    paths(products),
    components(schemas(Product)),
    servers((url = "/products")),
    modifiers(&UpdatePaths)
)]
pub struct ApiDoc;

#[utoipa::path(
    get,
    responses(
        (status = 200, body = Vec<Product>)
    )
)]
/// Product List
#[get("/")]
async fn products() -> Response<Vec<Product>> {
    Ok(Json(config().products.clone()))
}

pub fn router() -> Scope {
    Scope::new("/products").service(products)
}
