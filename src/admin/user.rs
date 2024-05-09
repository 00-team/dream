use actix_web::web::{Data, Json, Path, Query};
use actix_web::{get, patch, Scope};
use serde::Deserialize;
use utoipa::{OpenApi, ToSchema};

use crate::docs::UpdatePaths;
use crate::models::{Admin, ListInput, Response, Transaction, User};
use crate::utils::CutOff;
use crate::AppState;

#[derive(OpenApi)]
#[openapi(
    tags((name = "admin::user")),
    paths(user_list, user_get, user_update, user_transactions_list),
    components(schemas(User, AdminUserUpdateBody)),
    servers((url = "/users")),
    modifiers(&UpdatePaths)
)]
pub struct Doc;

#[utoipa::path(
    get,
    params(("page" = u32, Query, example = 0)),
    responses(
        (status = 200, body = Vec<User>)
    )
)]
/// User List
#[get("/")]
async fn user_list(
    _: Admin, query: Query<ListInput>, state: Data<AppState>,
) -> Response<Vec<User>> {
    let offset = i64::from(query.page) * 30;

    let users = sqlx::query_as! {
        User,
        "select * from users limit 30 offset ?",
        offset
    }
    .fetch_all(&state.sql)
    .await?;

    Ok(Json(users))
}

#[utoipa::path(
    get,
    params(("id" = i64, Path,)),
    responses(
        (status = 200, body = User)
    )
)]
/// User Get
#[get("/{id}/")]
async fn user_get(
    _: Admin, path: Path<(i64,)>, state: Data<AppState>,
) -> Response<User> {
    let (id,) = path.into_inner();

    let user = sqlx::query_as! {
        User,
        "select * from users where id = ?",
        id
    }
    .fetch_one(&state.sql)
    .await?;

    Ok(Json(user))
}

#[derive(Deserialize, ToSchema)]
struct AdminUserUpdateBody {
    banned: Option<bool>,
    name: Option<String>,
}

#[utoipa::path(
    patch,
    params(("id" = i64, Path,)),
    request_body = AdminUserUpdateBody,
    responses(
        (status = 200, body = User)
    )
)]
/// User Update
#[patch("/{id}/")]
async fn user_update(
    admin: Admin, path: Path<(i64,)>, body: Json<AdminUserUpdateBody>,
    state: Data<AppState>,
) -> Response<User> {
    let (id,) = path.into_inner();
    let mut change = false;

    let mut user = sqlx::query_as! {
        User,
        "select * from users where id = ?",
        id
    }
    .fetch_one(&state.sql)
    .await?;

    if let Some(v) = &body.name {
        change = true;
        user.name = Some(v.clone());
    };

    if let Some(v) = &body.banned {
        if !user.admin && admin.id != user.id {
            change = true;
            user.banned = *v;
        }
    };

    if change {
        user.name.cut_off(100);

        sqlx::query_as! {
            User,
            "update users set name = ?, banned = ? where id = ?",
            user.name, user.banned, user.id
        }
        .execute(&state.sql)
        .await?;
    }

    Ok(Json(user))
}

#[utoipa::path(
    get,
    params(("page" = u32, Query, example = 0)),
    responses(
        (status = 200, body = Vec<Transaction>)
    ),
)]
/// Transaction List
#[get("/{id}/transactions/")]
async fn user_transactions_list(
    _: Admin, path: Path<(i64,)>, query: Query<ListInput>,
    state: Data<AppState>,
) -> Response<Vec<Transaction>> {
    let offset = query.page * 30;
    let transactions = sqlx::query_as! {
        Transaction,
        "select * from transactions where user = ? limit 30 offset ?",
        path.0, offset
    }
    .fetch_all(&state.sql)
    .await?;

    Ok(Json(transactions))
}

pub fn router() -> Scope {
    Scope::new("/users")
        .service(user_list)
        .service(user_get)
        .service(user_update)
        .service(user_transactions_list)
}
