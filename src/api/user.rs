use actix_multipart::form::MultipartForm;
use actix_web::cookie::time::Duration;
use actix_web::cookie::{Cookie, SameSite};
use actix_web::web::{Data, Json, Query};
use actix_web::{delete, get, patch, post, put, HttpResponse, Responder, Scope};
use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha512};
use utoipa::{OpenApi, ToSchema};

use crate::api::verification;
use crate::config::Config;
use crate::docs::UpdatePaths;
use crate::models::transactions::Transaction;
use crate::models::user::{UpdatePhoto, User};
use crate::models::{AppErr, ListInput, Response};
use crate::utils::{
    get_random_bytes, get_random_string, remove_photo, save_photo, sql_unwrap, CutOff,
};
use crate::AppState;

#[derive(OpenApi)]
#[openapi(
    tags((name = "api::user")),
    paths(
        login, user_get, user_update, user_update_photo,
        user_delete_photo, user_wallet_test, user_transactions_list
    ),
    components(schemas(
        User, LoginBody, UserUpdateBody, UpdatePhoto, Transaction
    )),
    servers((url = "/user")),
    modifiers(&UpdatePaths)
)]
pub struct ApiUserDoc;

#[derive(Debug, Deserialize, ToSchema)]
struct LoginBody {
    phone: String,
    code: String,
}

#[utoipa::path(
    post,
    request_body = LoginBody,
    responses(
        (status = 200, body = User),
        (status = 400, body = String)
    )
)]
/// Login
#[post("/login/")]
async fn login(body: Json<LoginBody>, state: Data<AppState>) -> Result<HttpResponse, AppErr> {
    verification::verify(&body.phone, &body.code, verification::Action::Login).await?;

    let token = get_random_string(Config::TOKEN_ABC, 69);
    let token_hashed = hex::encode(Sha512::digest(&token));

    let result = sqlx::query_as! {
        User,
        "select * from users where phone = ?",
        body.phone
    }
    .fetch_one(&state.sql)
    .await;

    let mut user: User = match result {
        Ok(mut v) => {
            v.token = token;

            let _ = sqlx::query_as! {
                User,
                "update users set token = ? where id = ?",
                token_hashed, v.id
            }
            .execute(&state.sql)
            .await;

            v
        }
        Err(_) => {
            let result = sqlx::query_as! {
                User,
                "insert into users (phone, token) values(?, ?)",
                body.phone, token_hashed
            }
            .execute(&state.sql)
            .await;

            User {
                phone: body.phone.clone(),
                token,
                id: result.unwrap().last_insert_rowid(),
                ..Default::default()
            }
        }
    };

    user.token = format!("{}:{}", user.id, user.token);

    let cookie = Cookie::build("Authorization", format!("Bearer {}", user.token))
        .path("/")
        .secure(true)
        .same_site(SameSite::Strict)
        .http_only(true)
        .max_age(Duration::weeks(12))
        .finish();

    Ok(HttpResponse::Ok().cookie(cookie).json(user))
}

#[utoipa::path(
    get,
    responses(
        (status = 200, body = User)
    )
)]
/// Get User
#[get("/")]
async fn user_get(user: User) -> Json<User> {
    Json(user)
}

#[derive(Deserialize, ToSchema)]
struct UserUpdateBody {
    name: Option<String>,
}

#[utoipa::path(
    patch,
    request_body = UserUpdateBody,
    responses(
        (status = 200, body = User)
    )
)]
/// Update User
#[patch("/")]
async fn user_update(user: User, body: Json<UserUpdateBody>, state: Data<AppState>) -> Json<User> {
    let mut user = user;
    let mut change = false;
    if let Some(n) = &body.name {
        change = true;
        user.name = Some(n.clone());
    };

    if change {
        user.name.cut_off(100);

        let _ = sqlx::query_as! {
            User,
            "update users set name = ? where id = ?",
            user.name, user.id
        }
        .execute(&state.sql)
        .await;
    }

    Json(user)
}

#[utoipa::path(
    put,
    request_body(content = UpdatePhoto, content_type = "multipart/form-data"),
    responses(
        (status = 200, body = User)
    )
)]
/// Update Photo
#[put("/photo/")]
async fn user_update_photo(
    user: User,
    form: MultipartForm<UpdatePhoto>,
    state: Data<AppState>,
) -> Response<User> {
    let mut user = user;

    let salt = if let Some(p) = &user.photo {
        p.clone()
    } else {
        let s = get_random_bytes(8);
        user.photo = Some(s.clone());
        s
    };

    let filename = format!("{}-{salt}", user.id);

    save_photo(form.photo.file.path(), &filename)?;

    sql_unwrap(
        sqlx::query_as! {
            User,
            "update users set photo = ? where id = ?",
            user.photo, user.id
        }
        .execute(&state.sql)
        .await,
    )?;

    Ok(Json(user))
}

#[utoipa::path(
    delete,
    responses(
        (status = 200)
    )
)]
/// Delete Photo
#[delete("/photo/")]
async fn user_delete_photo(user: User, state: Data<AppState>) -> impl Responder {
    let mut user = user;

    if user.photo.is_none() {
        return HttpResponse::Ok();
    }

    remove_photo(&format!("{}-{}", user.id, user.photo.unwrap()));
    user.photo = None;

    let _ = sqlx::query_as! {
        User,
        "update users set photo = ? where id = ?",
        user.photo, user.id
    }
    .execute(&state.sql)
    .await;

    HttpResponse::Ok()
}

#[utoipa::path(
    post,
    responses(
        (status = 200)
    )
)]
/// Add Wallet
#[post("/wallet/")]
async fn user_wallet_test(user: User, _state: Data<AppState>) -> impl Responder {
    let client = awc::Client::new();
    let request = client
        .post("https://api.idpay.ir/v1.1/payment")
        .insert_header(("X-SANDBOX", "1"))
        .insert_header(("X-API-KEY", "..."));

    #[derive(Serialize, Debug)]
    struct Data {
        order_id: String,
        amount: u64,
        name: Option<String>,
        phone: String,
        desc: String,
        callback: String,
    }

    let result = request
        .send_json(&Data {
            order_id: "12".to_string(),
            amount: 12002,
            name: None,
            phone: user.phone,
            desc: "Adding to Wallet".to_string(),
            callback: "http://127.0.0.1:7200/user/wallet/cb/".to_string(),
        })
        .await;

    match result {
        Ok(mut v) => {
            println!("status: {}", v.status());
            let body = v.json::<serde_json::Value>().await;
            println!("{:?} {:?}", v, body);
        }
        Err(e) => {
            log::error!("{}", e);
            return HttpResponse::InternalServerError();
        }
    }

    HttpResponse::Ok()
}

#[utoipa::path(
    get,
    params(("page" = u32, Query, example = 0)),
    responses(
        (status = 200, body = Vec<Transaction>)
    )
)]
/// Transaction List
#[get("/transactions/")]
async fn user_transactions_list(
    user: User,
    query: Query<ListInput>,
    state: Data<AppState>,
) -> Response<Vec<Transaction>> {
    let offset = query.page * 30;
    let result = sql_unwrap(
        sqlx::query_as! {
            Transaction,
            "select * from transactions where user = ? limit 30 offset ?",
            user.id, offset
        }
        .fetch_all(&state.sql)
        .await,
    )?;

    Ok(Json(result))
}

pub fn router() -> Scope {
    Scope::new("/user")
        .service(login)
        .service(user_get)
        .service(user_update)
        .service(user_update_photo)
        .service(user_delete_photo)
        .service(user_wallet_test)
        .service(user_transactions_list)
}
