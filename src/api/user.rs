use actix_multipart::form::MultipartForm;
use actix_web::cookie::time::Duration;
use actix_web::cookie::{Cookie, SameSite};
use actix_web::web::{Data, Json, Query};
use actix_web::{
    delete, get, patch, post, put, HttpResponse, Responder, Scope,
};
use awc::http::header;
use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha512};
use utoipa::{IntoParams, OpenApi, ToSchema};

use crate::api::verification;
use crate::config::{config, Config};
use crate::docs::UpdatePaths;
use crate::models::transaction::{
    Transaction, TransactionKind, TransactionStatus, TransactionVendor,
};
use crate::models::user::{UpdatePhoto, User};
use crate::models::{AppErr, AppErrBadRequest, ListInput, Response};
use crate::utils::{
    self, get_random_bytes, get_random_string, remove_photo, save_photo, CutOff,
};
use crate::AppState;

#[derive(OpenApi)]
#[openapi(
    tags((name = "api::user")),
    paths(
        user_login, user_logout, user_get, user_update,
        user_update_photo, user_delete_photo,
        user_wallet_add, user_wallet_cb, user_transactions_list
    ),
    components(schemas(
        User, LoginBody, UserUpdateBody, UpdatePhoto,
        Transaction, TransactionStatus, TransactionVendor, TransactionKind
    )),
    servers((url = "/user")),
    modifiers(&UpdatePaths)
)]
pub struct ApiDoc;

#[derive(Debug, Deserialize, ToSchema)]
struct LoginBody {
    phone: String,
    code: String,
}

#[utoipa::path(
    post,
    request_body = LoginBody,
    responses((status = 200, body = User))
)]
/// Login
#[post("/login/")]
async fn user_login(
    body: Json<LoginBody>, state: Data<AppState>,
) -> Result<HttpResponse, AppErr> {
    verification::verify(&body.phone, &body.code, verification::Action::Login)
        .await?;

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

    let cook = Cookie::build("Authorization", format!("Bearer {}", user.token))
        .path("/")
        .secure(true)
        .same_site(SameSite::Strict)
        .http_only(true)
        .max_age(Duration::weeks(12))
        .finish();

    Ok(HttpResponse::Ok().cookie(cook).json(user))
}

#[utoipa::path(post, responses((status = 200)))]
#[post("/logout/")]
/// Logout
async fn user_logout(user: User, state: Data<AppState>) -> HttpResponse {
    let _ = sqlx::query! {
        "update users set token = 'X' where id = ?",
        user.id
    }
    .execute(&state.sql)
    .await;

    let cook = Cookie::build("Authorization", "XXX")
        .path("/")
        .secure(true)
        .same_site(SameSite::Strict)
        .http_only(true)
        .max_age(Duration::seconds(1))
        .finish();

    HttpResponse::Ok().cookie(cook).finish()
}

#[utoipa::path(get, responses((status = 200, body = User)))]
#[get("/")]
/// Get
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
/// Update
#[patch("/")]
async fn user_update(
    user: User, body: Json<UserUpdateBody>, state: Data<AppState>,
) -> Json<User> {
    let mut user = user;
    let mut change = false;
    if let Some(n) = &body.name {
        change = true;
        user.name = Some(n.clone());
    };

    if change {
        user.name.cut_off(256);

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
    user: User, form: MultipartForm<UpdatePhoto>, state: Data<AppState>,
) -> Response<User> {
    let mut user = user;

    let salt = if let Some(p) = &user.photo {
        p.clone()
    } else {
        let s = get_random_bytes(8);
        user.photo = Some(s.clone());
        s
    };

    let filename = format!("{}:{salt}", user.id);

    save_photo(form.photo.file.path(), &filename)?;

    sqlx::query_as! {
        User,
        "update users set photo = ? where id = ?",
        user.photo, user.id
    }
    .execute(&state.sql)
    .await?;

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
async fn user_delete_photo(
    user: User, state: Data<AppState>,
) -> impl Responder {
    let mut user = user;

    if user.photo.is_none() {
        return HttpResponse::Ok();
    }

    remove_photo(&format!("{}:{}", user.id, user.photo.unwrap()));
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

#[derive(Deserialize, Debug)]
struct ZarinpalResponse<T> {
    data: T,
}

#[derive(Deserialize)]
struct AddWalletQuery {
    amount: u32,
}

#[utoipa::path(
    post,
    params(("amount" = u32, Query, example = 10000)),
    responses(
        (status = 200, body = String)
    )
)]
/// Wallet Add
#[post("/wallet-add/")]
async fn user_wallet_add(
    user: User, q: Query<AddWalletQuery>, state: Data<AppState>,
) -> Response<String> {
    let now = utils::now();
    if cfg!(debug_assertions) {
        sqlx::query! {
            "insert into transactions(user, amount, timestamp, vendor, vendor_order_id)
            values(?, ?, ?, ?, ?)",
            user.id, q.amount, now, TransactionVendor::Zarinpal, "debug"
        }
        .execute(&state.sql)
        .await?;

        return Ok(Json(
            "/api/user/wallet-cb/?authority=debug&status=OK".to_string(),
        ));
    }

    let client = awc::Client::new();
    let request =
        client.post("https://api.zarinpal.com/pg/v4/payment/request.json");

    #[derive(Serialize, Debug)]
    struct Data {
        merchant_id: String,
        amount: u64,
        description: String,
        callback_url: String,
    }

    let mut result = request
        .send_json(&Data {
            merchant_id: config().zarinpal_merchant_id.clone(),
            amount: q.amount as u64,
            description: "Adding to Wallet".to_string(),
            callback_url: "https://dreampay.org/api/user/wallet-cb/"
                .to_string(),
        })
        .await?;

    #[derive(Debug, Deserialize)]
    struct RsData {
        code: i64,
        authority: String,
    }

    let data = result.json::<ZarinpalResponse<RsData>>().await?.data;
    if data.code != 100 {
        log::error!("payment failed: {:?}", result.body().await?);
        return Err(AppErrBadRequest("payment request failed"));
    }

    sqlx::query! {
        "insert into transactions(user, amount, timestamp, vendor, vendor_order_id)
        values(?, ?, ?, ?, ?)",
        user.id, q.amount, now, TransactionVendor::Zarinpal, data.authority
    }
    .execute(&state.sql)
    .await?;

    Ok(Json(format!("https://www.zarinpal.com/pg/StartPay/{}", data.authority)))
}

#[derive(Deserialize, IntoParams)]
struct WalletCbQuery {
    authority: String,
    status: String,
}

#[utoipa::path(get, params(WalletCbQuery))]
/// Wallet Callback
#[get("/wallet-cb/")]
async fn user_wallet_cb(
    user: User, q: Query<WalletCbQuery>, state: Data<AppState>,
) -> HttpResponse {
    let response =
        HttpResponse::Found().insert_header((header::LOCATION, "/")).finish();

    let transaction = sqlx::query_as! {
        Transaction,
        "select * from transactions where
        vendor_order_id = ? and user = ? and vendor = ? and status = ?",
        q.authority, user.id,
        TransactionVendor::Zarinpal, TransactionStatus::InProgress
    }
    .fetch_one(&state.sql)
    .await;

    let is_ok = q.status.to_lowercase() == "ok";
    if !is_ok || transaction.is_err() {
        return response;
    }
    let transaction = transaction.unwrap();
    let wallet = user.wallet + transaction.amount;

    if cfg!(debug_assertions) {
        let result = sqlx::query! {
            "update users set wallet = ? where id = ?",
            wallet, user.id
        }
        .execute(&state.sql)
        .await;

        if result.is_err() {
            return response;
        }

        let _ = sqlx::query! {
            "update transactions set status = ? where id = ?",
            TransactionStatus::Success, transaction.id
        }
        .execute(&state.sql)
        .await;

        return response;
    }

    #[derive(Serialize)]
    struct Data {
        merchant_id: String,
        amount: i64,
        authority: String,
    }

    let client = awc::Client::new();
    let result = client
        .post("https://api.zarinpal.com/pg/v4/payment/verify.json")
        .send_json(&Data {
            merchant_id: config().zarinpal_merchant_id.clone(),
            amount: transaction.amount,
            authority: q.authority.clone(),
        })
        .await;

    if result.is_err() {
        return response;
    }

    #[derive(Deserialize)]
    struct RsData {
        code: i64,
        ref_id: i64,
        card_pan: String,
        card_hash: String,
    }

    let data = result.unwrap().json::<ZarinpalResponse<RsData>>().await;
    if data.is_err() {
        return response;
    }
    let data = data.unwrap().data;
    if data.code != 100 {
        return response;
    }

    let result = sqlx::query! {
        "update users set wallet = ? where id = ?",
        wallet, user.id
    }
    .execute(&state.sql)
    .await;

    if result.is_err() {
        return response;
    }

    let _ = sqlx::query! {
        "update transactions set
        status = ?, vendor_track_id = ?, card = ?, hashed_card = ?
        where id = ?",
        TransactionStatus::Success, data.ref_id, data.card_pan, data.card_hash,
        transaction.id
    }
    .execute(&state.sql)
    .await;

    response
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
    user: User, query: Query<ListInput>, state: Data<AppState>,
) -> Response<Vec<Transaction>> {
    let offset = query.page * 32;
    let result = sqlx::query_as! {
        Transaction,
        "select * from transactions where user = ?
         order by id desc limit 32 offset ?",
        user.id, offset
    }
    .fetch_all(&state.sql)
    .await?;

    Ok(Json(result))
}

pub fn router() -> Scope {
    Scope::new("/user")
        .service(user_login)
        .service(user_logout)
        .service(user_get)
        .service(user_update)
        .service(user_update_photo)
        .service(user_delete_photo)
        .service(user_wallet_add)
        .service(user_wallet_cb)
        .service(user_transactions_list)
}
