use crate::docs::UpdatePaths;
use crate::models::user::{Admin, User};
use crate::models::{ListInput, Response};
use crate::AppState;

use actix_web::web::{Data, Json, Path, Query};
use actix_web::{get, Scope};
use utoipa::OpenApi;

#[derive(OpenApi)]
#[openapi(
    tags((name = "admin::user")),
    paths(user_list, user_get),
    components(schemas(User)),
    servers((url = "/users")),
    modifiers(&UpdatePaths)
)]
pub struct ApiDoc;

#[utoipa::path(
    get,
    params(ListInput),
    responses((status = 200, body = Vec<User>))
)]
/// List
#[get("/")]
async fn user_list(
    _: Admin, query: Query<ListInput>, state: Data<AppState>,
) -> Response<Vec<User>> {
    let offset = i64::from(query.page) * 32;

    let users = sqlx::query_as! {
        User, "select * from users limit 32 offset ?", offset
    }
    .fetch_all(&state.sql)
    .await?;

    Ok(Json(users))
}

#[utoipa::path(
    get,
    params(("id" = i64, Path,)),
    responses((status = 200, body = User))
)]
/// Get
#[get("/{id}/")]
async fn user_get(
    _: Admin, path: Path<(i64,)>, state: Data<AppState>,
) -> Response<User> {
    let (id,) = path.into_inner();

    let user = sqlx::query_as! {
        User, "select * from users where id = ?", id
    }
    .fetch_one(&state.sql)
    .await?;

    Ok(Json(user))
}

pub fn router() -> Scope {
    Scope::new("/users").service(user_list).service(user_get)
}
