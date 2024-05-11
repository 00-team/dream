use actix_web::dev::HttpServiceFactory;
use actix_web::http::header::ContentType;
use actix_web::middleware::{NormalizePath, TrailingSlash};
use actix_web::{get, HttpResponse, Scope};
use std::fs::read_to_string;

#[get("/")]
async fn app_index() -> HttpResponse {
    let result = read_to_string("app/dist/index.html")
        .unwrap_or("err reading app index.html".to_string());
    HttpResponse::Ok().content_type(ContentType::html()).body(result)
}

#[get("/admin/")]
async fn admin_index() -> HttpResponse {
    let result = read_to_string("admin/dist/index.html")
        .unwrap_or("err reading admin index.html".to_string());
    HttpResponse::Ok().content_type(ContentType::html()).body(result)
}

pub fn router() -> impl HttpServiceFactory {
    Scope::new("")
        .wrap(NormalizePath::new(TrailingSlash::Always))
        .service(app_index)
        .service(admin_index)
}
