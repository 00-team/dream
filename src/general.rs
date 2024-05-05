use actix_web::error;
use sqlx::{Pool, Sqlite};

use crate::utils::sql_unwrap;

#[derive(sqlx::FromRow)]
pub struct General {
    pub available_money: i64,
    pub total_money: i64,
}

pub async fn general_get(pool: &Pool<Sqlite>) -> Result<General, error::Error> {
    let result = sql_unwrap(
        sqlx::query_as! {
            General,
            "select * from general"
        }
        .fetch_optional(pool)
        .await,
    )?;

    match result {
        Some(v) => Ok(v),
        None => {
            let _ = sqlx::query! {
                "insert into general default values"
            }
            .execute(pool)
            .await;

            Ok(General { available_money: 0, total_money: 0 })
        }
    }
}

pub async fn general_set(
    pool: &Pool<Sqlite>, general: &General,
) -> Result<(), error::Error> {
    let result = sql_unwrap(
        sqlx::query_as! {
            General,
            "select * from general"
        }
        .fetch_optional(pool)
        .await,
    )?;

    match result {
        Some(_) => {
            sql_unwrap(
                sqlx::query! {
                    "update general set available_money = ?, total_money = ?",
                    general.available_money, general.total_money
                }
                .execute(pool)
                .await,
            )?;

            Ok(())
        }
        None => {
            sql_unwrap(
                sqlx::query! {
                    "insert into general(available_money, total_money)
                    values(?, ?)",
                    general.available_money, general.total_money
                }
                .execute(pool)
                .await,
            )?;

            Ok(())
        }
    }
}
