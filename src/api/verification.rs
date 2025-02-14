use std::collections::HashMap;

use actix_web::{post, web::Json};
use lazy_static::lazy_static;
use serde::{Deserialize, Serialize};
use tokio::sync::Mutex;
use utoipa::{OpenApi, ToSchema};

use crate::{
    config::Config,
    models::{self, bad_request, AppErr},
    utils,
};
use models::Response;

#[derive(PartialEq, Debug, Clone, Deserialize, Serialize, ToSchema)]
#[serde(rename_all = "snake_case")]
pub enum Action {
    Login,
    Delete,
}

struct VerifyData {
    action: Action,
    code: String,
    expires: i64,
    tries: u8,
}

lazy_static! {
    static ref VDB: Mutex<HashMap<String, VerifyData>> =
        Mutex::new(HashMap::new());
}

#[derive(OpenApi)]
#[openapi(
    paths(verification),
    components(schemas(VerificationData, VerificationResponse, Action))
)]
pub struct ApiDoc;

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
    body: Json<VerificationData>,
) -> Response<VerificationResponse> {
    let now = utils::now();
    utils::phone_validator(&body.phone)?;

    let mut vdb = VDB.lock().await;
    let result = vdb.get(&body.phone);

    if let Some(v) = result {
        let t = v.expires - now;
        if t > 0 {
            return Ok(Json(VerificationResponse {
                expires: t,
                action: v.action.clone(),
            }));
        }
    }

    vdb.retain(|_, v| v.expires - now > 0);

    let code = utils::get_random_string(Config::CODE_ABC, 5);
    log::info!("code: {code}");

    utils::send_sms_prefab(
        &body.phone,
        229070,
        vec![body.phone.clone(), code.clone()],
    )
    .await;

    #[cfg(not(debug_assertions))]
    utils::heimdall_message(
        &format!(
            "action: {:?}\nphone: {}\ncode: {code}",
            body.action, body.phone
        ),
        "verificatin",
    )
    .await;

    utils::send_message(
        Config::TT_VERIFICATION,
        &format! {
            "action: {:?}\nphone: `{}`\ncode: `{}`",
            body.action, body.phone, code
        },
    )
    .await;

    vdb.insert(
        body.phone.clone(),
        VerifyData {
            action: body.action.clone(),
            code,
            expires: now + 180,
            tries: 0,
        },
    );

    Ok(Json(VerificationResponse {
        expires: 180,
        action: body.action.to_owned(),
    }))
}

pub async fn verify(
    phone: &str, code: &str, action: Action,
) -> Result<(), AppErr> {
    let now = utils::now();

    let mut vdb = VDB.lock().await;
    vdb.retain(|_, v| v.expires - now > 0);

    let Some(v) = vdb.get_mut(phone) else {
        return Err(bad_request!("bad verification"));
    };

    v.tries += 1;

    if v.action != action {
        return Err(bad_request!("invalid action"));
    }

    if v.code != code {
        if v.tries > 2 {
            return Err(bad_request!("too many tries"));
        }

        return Err(bad_request!("invalid code"));
    }

    vdb.remove(phone);

    Ok(())
}
