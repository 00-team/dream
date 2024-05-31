use actix_web::web::Json;
use actix_web::{get, Scope};
use utoipa::OpenApi;

use crate::config::{config, Product, Products};
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
        (status = 200, body = HashMap<String, Product>, example = json!({
            "spotify": {
                "name": "اسپاتیفای",
                "logo": "/static/image/logo/spotify.png",
                "data": ["username", "password"],
                "color": "#1db954",
                "image": "/static/image/banner/spotify.png",
                "plans": {
                    "family.1": [1200000, "خانواده ۱ ماهه"],
                    "family.3": [3200000, "خانواده ۳ ماهه"],
                    "family.6": [6200000, "خانواده ۶ ماهه"],
                    "single.1": [6200000, "۱ ماهه"],
                    "single.3": [6200000, "۳ ماهه"],
                    "single.6": [6200000, "۶ ماهه"]
                }
            }
        }))
    )
)]
/// Product List
#[get("/")]
async fn products() -> Response<Products> {
    Ok(Json(config().products.clone()))
}

pub fn router() -> Scope {
    Scope::new("/products").service(products)
}
