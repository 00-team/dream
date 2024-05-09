use actix_multipart::form::MultipartForm;
use actix_web::error::{Error, ErrorBadRequest};
use actix_web::web::{Data, Json, Path, Query};
use actix_web::{delete, get, patch, post, put, Scope};
use serde::Deserialize;
use utoipa::{OpenApi, ToSchema};

use crate::docs::UpdatePaths;
use crate::models::{Admin, ListInput, Photos, Product, Response, UpdatePhoto};
use crate::utils::{get_random_bytes, remove_photo, save_photo, CutOff};
use crate::AppState;

#[derive(OpenApi)]
#[openapi(
    tags((name = "admin::product")),
    paths(
        product_list, product_get, product_add, product_update,
        product_delete, product_add_photo, product_delete_photo
    ),
    components(schemas(Product, Photos, ProductAddBody, ProductUpdateBody)),
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
    _: Admin, query: Query<ListInput>, state: Data<AppState>,
) -> Response<Vec<Product>> {
    let offset = i64::from(query.page) * 30;

    let products = sqlx::query_as! {
        Product,
        "select * from products limit 30 offset ?",
        offset
    }
    .fetch_all(&state.sql)
    .await?;

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
async fn product_get(_: Admin, product: Product) -> Json<Product> {
    Json(product)
}

#[derive(Deserialize, ToSchema)]
struct ProductAddBody {
    title: String,
    end: i64,
    start: i64,
    base_price: i64,
}

#[utoipa::path(
    post,
    request_body = ProductAddBody,
    responses(
        (status = 200, body = Product)
    )
)]
/// Product Add
#[post("/")]
async fn product_add(
    _: Admin, body: Json<ProductAddBody>, state: Data<AppState>,
) -> Response<Product> {
    let mut body = body;
    body.title.cut_off(100);
    if body.end != 0 && body.start >= body.end {
        return Err(ErrorBadRequest("invalid start and end times"));
    }

    let result = sqlx::query_as! {
        Product,
        "insert into products(title, end, start, base_price) values(?, ?, ?, ?)",
        body.title, body.end, body.start, body.base_price
    }
    .execute(&state.sql)
    .await?;

    Ok(Json(Product {
        id: result.last_insert_rowid(),
        title: body.title.clone(),
        start: body.start,
        end: body.end,
        base_price: body.base_price,
        ..Default::default()
    }))
}

#[derive(Deserialize, ToSchema)]
struct ProductUpdateBody {
    title: Option<String>,
    end: Option<i64>,
    start: Option<i64>,
    base_price: Option<i64>,

    detail: Option<String>,
    buy_now_opens: Option<i64>,
    buy_now_price: Option<i64>,
}

#[utoipa::path(
    patch,
    request_body = ProductUpdateBody,
    responses(
        (status = 200, body = Product)
    )
)]
/// Product Update
#[patch("/{id}/")]
async fn product_update(
    _: Admin, product: Product, body: Json<ProductUpdateBody>,
    state: Data<AppState>,
) -> Response<Product> {
    let mut change = false;
    let mut product = product;

    if let Some(title) = &body.title {
        change = true;
        product.title = title.to_string();
    }

    if let Some(bp) = body.base_price {
        change = true;
        product.base_price = bp;
    }

    if let Some(end) = body.end {
        change = true;
        product.end = end;
    }

    if let Some(start) = body.start {
        change = true;
        product.start = start;
    }

    if product.end != 0 && product.start >= product.end {
        return Err(ErrorBadRequest("invalid timing"));
    }

    if let Some(detail) = &body.detail {
        change = true;
        product.detail = Some(detail.to_string());
    }

    if let Some(open) = body.buy_now_opens {
        change = true;
        product.buy_now_opens = if open < 0 { None } else { Some(open) };
    }

    if let Some(price) = body.buy_now_price {
        change = true;
        product.buy_now_price = if price < 0 { None } else { Some(price) };
    }

    if change {
        product.title.cut_off(100);
        product.detail.cut_off(2048);

        sqlx::query_as! {
            Product,
            "update products set
                title = ?, end = ?, start = ?, base_price = ?,
                detail = ?, buy_now_price = ?, buy_now_opens = ?
                where id = ?",
            product.title, product.end, product.start, product.base_price,
            product.detail, product.buy_now_price, product.buy_now_opens,
            product.id
        }
        .execute(&state.sql)
        .await?;
    }

    Ok(Json(product))
}

#[utoipa::path(
    delete,
    params(("id" = i64, Path,)),
    responses(
        (status = 200, body = String)
    )
)]
/// Product Delete
#[delete("/{id}/")]
async fn product_delete(
    _: Admin, path: Path<(i64,)>, state: Data<AppState>,
) -> Result<&'static str, Error> {
    sqlx::query_as! {
        Product,
        "delete from products where id = ?",
        path.0
    }
    .execute(&state.sql)
    .await?;

    Ok("ok")
}

#[utoipa::path(
    put,
    params(("id" = i64, Path,)),
    request_body(content = UpdatePhoto, content_type = "multipart/form-data"),
    responses(
        (status = 200, body = Product)
    )
)]
/// Product Add Photo
#[put("/{id}/photo/")]
async fn product_add_photo(
    _: Admin, product: Product, form: MultipartForm<UpdatePhoto>,
    state: Data<AppState>,
) -> Response<Product> {
    let mut product = product;
    let mut salt = get_random_bytes(8);
    loop {
        if !product.photos.salts.iter().any(|s| s == &salt) {
            break;
        }
        salt = get_random_bytes(8);
    }

    product.photos.salts.push(salt.clone());

    let filename = format!("{}-{}", product.id, salt);

    save_photo(form.photo.file.path(), &filename)?;

    sqlx::query_as! {
        Product,
        "update products set photos = ? where id = ?",
        product.photos, product.id
    }
    .execute(&state.sql)
    .await?;

    Ok(Json(product))
}

#[utoipa::path(
    delete,
    params(
        ("id" = i64, Path,),
        ("idx" = u8, Path,),
    ),
    responses(
        (status = 200, body = String)
    )
)]
/// Product Delete Photo
#[delete("/{id}/photo/{idx}/")]
async fn product_delete_photo(
    _: Admin, product: Product, path: Path<(i64, u8)>, state: Data<AppState>,
) -> Result<&'static str, Error> {
    let mut product = product;
    let idx: usize = path.1.into();
    if idx >= product.photos.salts.len() {
        return Err(ErrorBadRequest("photo not found"));
    }

    let salt = product.photos.salts.remove(idx);
    remove_photo(&format!("{}-{}", product.id, salt));

    sqlx::query_as! {
        Product,
        "update products set photos = ? where id = ?",
        product.photos, product.id
    }
    .execute(&state.sql)
    .await?;

    Ok("photo was removed")
}

pub fn router() -> Scope {
    Scope::new("/products")
        .service(product_list)
        .service(product_get)
        .service(product_add)
        .service(product_update)
        .service(product_delete)
        .service(product_add_photo)
        .service(product_delete_photo)
}
