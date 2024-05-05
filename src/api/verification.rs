use actix_web::{
    error::{Error, ErrorBadRequest},
    post,
    web::{Data, Json},
};
use serde::{Deserialize, Serialize};
use sqlx::{Pool, Sqlite};
use utoipa::{OpenApi, ToSchema};

use crate::{
    config::Config,
    models,
    utils::{get_random_string, send_webhook, sql_unwrap},
};
use crate::{
    utils::{self, phone_validator},
    AppState,
};
use models::{Action, Response};

#[derive(OpenApi)]
#[openapi(
    paths(verification),
    components(schemas(VerificationData, VerificationResponse, Action))
)]
pub struct ApiVerificationDoc;

#[derive(ToSchema, Deserialize, Debug)]
struct VerificationData {
    phone: String,
    action: Action,
}

#[derive(ToSchema, Serialize, Debug)]
struct VerificationResponse {
    expires: i64,
    action: Action,
}

#[utoipa::path(
    post,
    request_body = VerificationData,
    responses(
        (status = 200, body = VerificationResponse)
    )
)]
/// Verification
#[post("/verification/")]
async fn verification(
    body: Json<VerificationData>, state: Data<AppState>,
) -> Response<VerificationResponse> {
    phone_validator(&body.phone)?;

    let result = sqlx::query_as! {
        models::Verification,
        "select * from verifications where phone = ?",
        body.phone
    }
    .fetch_one(&state.sql)
    .await;

    let now = utils::now();
    match result {
        Ok(v) => {
            let t = v.expires - now;
            if t > 0 {
                return Ok(Json(VerificationResponse {
                    expires: t,
                    action: v.action,
                }));
            }
        }
        Err(_) => {}
    }

    let _ = sqlx::query! {
        "delete from verifications where phone = ? or expires < ?",
        body.phone,
        now
    }
    .execute(&state.sql)
    .await;

    let code = get_random_string(Config::CODE_ABC, 5);
    log::info!("code: {code}");

    let action = match &body.action {
        Action::Login => "login",
        Action::Delete => "delete",
    };

    send_webhook(
        "Verificatin",
        &format!("act: {action}\nphone: ||`{}`||\ncode: `{code}`", body.phone),
        2017768,
    )
    .await;

    let expires = now + 180;
    let _ = sqlx::query_as! {
        models::Verification,
        "insert into verifications (phone, action, code, expires) values(?, ?, ?, ?)",
        body.phone, action, code, expires
    }.execute(&state.sql).await;

    Ok(Json(VerificationResponse {
        expires: 180,
        action: body.action.to_owned(),
    }))
}

pub async fn verify(
    phone: &str, code: &str, action: Action, sql: &Pool<Sqlite>,
) -> Result<(), Error> {
    let v = sql_unwrap(
        sqlx::query_as! {
            models::Verification,
            "select * from verifications where phone = ?",
            phone
        }
        .fetch_one(sql)
        .await,
    )?;

    let now = utils::now();

    let tries = v.tries + 1;
    if v.expires <= now {
        let _ = sqlx::query! {
            "delete from verifications where phone = ? or expires < ?",
            phone, now
        }
        .execute(sql)
        .await;
        return Err(ErrorBadRequest("expired"));
    }

    if v.action != action {
        return Err(ErrorBadRequest("invalid action"));
    }

    if v.code != code {
        if tries > 2 {
            return Err(ErrorBadRequest("too many tries"));
        }

        let _ = sqlx::query! {
            "update verifications set tries = ? where id = ?",
            tries, v.id
        }
        .execute(sql)
        .await;

        return Err(ErrorBadRequest("invalid code"));
    }

    let _ = sqlx::query! {
        "delete from verifications where phone = ? or expires < ?",
        phone, now
    }
    .execute(sql)
    .await;

    Ok(())
}
