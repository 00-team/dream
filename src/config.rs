use std::{fs::read_to_string, sync::OnceLock};
use std::env::var as evar;

use serde::{Deserialize, Serialize};
use utoipa::ToSchema;

#[derive(Clone, Debug, Deserialize, Serialize, ToSchema)]
pub struct Product {
    pub name: String,
    pub kind: String,
    pub cost: u64,
    pub color: String,
    pub image: String,
}

#[derive(Debug)]
/// Main Config
pub struct Config {
    pub discord_webhook: String,
    pub products: Vec<Product>,
    pub zarinpal_merchant_id: String,
}

impl Config {
    pub const RECORD_DIR: &'static str = "./record/";
    pub const CODE_ABC: &'static [u8] = b"0123456789";
    pub const TOKEN_ABC: &'static [u8] =
        b"!@#$%^&*_+abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*_+";
}

pub fn config() -> &'static Config {
    static STATE: OnceLock<Config> = OnceLock::new();

    let products = serde_json::from_str::<Vec<Product>>(
        &read_to_string("./products.json").expect("fail to read products.json"),
    )
    .expect("invalid products.json");

    STATE.get_or_init(|| Config {
        discord_webhook: evar("DISCORD_WEBHOOK").unwrap(),
        zarinpal_merchant_id: evar("ZARINPAL_MERCHANT_ID").unwrap(),
        products,
    })
}
