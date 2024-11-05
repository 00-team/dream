use crate::config::Config;
use crate::docs::{doc_add_prefix, ApiDoc};
use actix_files as af;
use actix_web::web::ServiceConfig;
use actix_web::{
    get,
    http::header::ContentType,
    middleware,
    web::{scope, Data},
    App, HttpResponse, HttpServer, Responder,
};
use sqlx::sqlite::{SqliteConnectOptions, SqliteJournalMode};
use sqlx::{Pool, Sqlite, SqlitePool};
use std::str::FromStr;
use utoipa::OpenApi;

mod admin;
mod api;
mod config;
mod docs;
mod general;
mod models;
mod utils;
mod web;

pub struct AppState {
    pub sql: Pool<Sqlite>,
}

#[get("/openapi.json")]
async fn openapi() -> impl Responder {
    let mut doc = ApiDoc::openapi();
    doc.merge(api::user::ApiDoc::openapi());
    doc.merge(api::verification::ApiDoc::openapi());
    doc.merge(api::product::ApiDoc::openapi());
    doc.merge(api::order::ApiDoc::openapi());

    let mut admin_doc = ApiDoc::openapi();
    admin_doc.merge(admin::order::ApiDoc::openapi());
    admin_doc.merge(admin::user::ApiDoc::openapi());
    admin_doc.merge(admin::discount::ApiDoc::openapi());

    doc_add_prefix(&mut admin_doc, "/admin", false);

    doc.merge(admin_doc);

    doc_add_prefix(&mut doc, "/api", false);

    HttpResponse::Ok().json(doc)
}

#[get("/rapidoc")]
async fn rapidoc() -> impl Responder {
    HttpResponse::Ok().content_type(ContentType::html()).body(
        r###"<!doctype html>
    <html><head><meta charset="utf-8"><style>rapi-doc {
    --green: #00dc7d; --blue: #5199ff; --orange: #ff6b00;
    --red: #ec0f0f; --yellow: #ffd600; --purple: #782fef; }</style>
    <script type="module" src="/static/rapidoc.js"></script></head><body> <rapi-doc spec-url="/openapi.json" persist-auth="true"
    bg-color="#040404" text-color="#f2f2f2"
    header-color="#040404" primary-color="#ec0f0f"
    nav-text-color="#eee" font-size="largest"
    allow-spec-url-load="false" allow-spec-file-load="false"
    show-method-in-nav-bar="as-colored-block" response-area-height="500px"
    show-header="false" schema-expand-level="1" /></body> </html>"###,
    )
}

// #[actix_web::main]
// async fn main() -> std::io::Result<()> {
//     dotenvy::from_path(".env").expect("could not read .secrets.env");
//     pretty_env_logger::init();
//
//     let _ = std::fs::create_dir(Config::RECORD_DIR);
//
//     let pool = SqlitePool::connect(
//         &env::var("DATABASE_URL").expect("DATABASE_URL was not found in env"),
//     )
//     .await
//     .expect("sqlite pool initialization failed");
//
//     // sqlx::migrate!().run(&pool).await.expect("migration failed");
//
//     let server = HttpServer::new(move || {
//         App::new()
//             .wrap(middleware::Logger::new("%s %r %Ts"))
//             .app_data(Data::new(AppState { sql: pool.clone() }))
//             .configure(config_static)
//             .service(openapi)
//             .service(rapidoc)
//             .service(
//                 scope("/api")
//                     .service(api::user::router())
//                     .service(api::product::router())
//                     .service(api::order::router())
//                     .service(api::verification::verification)
//                     .service(
//                         scope("/admin")
//                             .service(admin::order::router())
//                             .service(admin::user::router())
//                             .service(admin::discount::router()),
//                     ),
//             )
//             .service(web::router())
//     });
//
//     let server = if cfg!(debug_assertions) {
//         server.bind(("127.0.0.1", 7000)).unwrap()
//     } else {
//         const PATH: &'static str = "/usr/share/nginx/sockets/dream.sock";
//         let s = server.bind_uds(PATH).expect("could not bind the server");
//         std::fs::set_permissions(PATH, std::fs::Permissions::from_mode(0o777))?;
//         s
//     };
//
//     server.run().await
// }

fn config_app(app: &mut ServiceConfig) {
    if cfg!(debug_assertions) {
        app.service(af::Files::new("/static", "static"));
        app.service(af::Files::new("/app-assets", "app/dist/app-assets"));
        app.service(af::Files::new("/admin-assets", "admin/dist/admin-assets"));
        app.service(af::Files::new("/record", Config::RECORD_DIR));
    }

    app.service(openapi).service(rapidoc);
    app.service(
        scope("/api")
            .service(api::user::router())
            .service(api::product::router())
            .service(api::order::router())
            .service(api::verification::verification)
            .service(
                scope("/admin")
                    .service(admin::order::router())
                    .service(admin::user::router())
                    .service(admin::discount::router()),
            ),
    );

    app.service(web::router());
}

async fn init() -> Data<AppState> {
    dotenvy::from_path(".env").expect("could not read .env file");
    pretty_env_logger::init();

    let _ = std::fs::create_dir(Config::RECORD_DIR);
    let cpt = SqliteConnectOptions::from_str("sqlite://main.db")
        .expect("could not init sqlite connection options")
        .journal_mode(SqliteJournalMode::Off);

    let pool = SqlitePool::connect_with(cpt).await.expect("sqlite connection");
    Data::new(AppState { sql: pool })
}

#[cfg(unix)]
#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let data = init().await;

    let server = HttpServer::new(move || {
        App::new()
            .wrap(middleware::Logger::new("%s %r %Ts"))
            .app_data(data.clone())
            .configure(config_app)
    });

    let server = if cfg!(debug_assertions) {
        server.bind(("127.0.0.1", 7000)).unwrap()
    } else {
        use std::os::unix::fs::PermissionsExt;
        const PATH: &'static str = "/usr/share/nginx/socks/dream.sock";
        let server = server.bind_uds(PATH).unwrap();
        std::fs::set_permissions(PATH, std::fs::Permissions::from_mode(0o777))?;
        server
    };

    server.run().await
}

#[cfg(windows)]
#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let data = init().await;

    HttpServer::new(move || {
        App::new()
            .wrap(middleware::Logger::new("%s %r %Ts"))
            .app_data(data.clone())
            .configure(config_app)
    })
    .bind(("127.0.0.1", 7000))
    .expect("server bind")
    .run()
    .await
}
