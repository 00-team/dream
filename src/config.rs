use std::collections::HashMap;
use std::env::var as evar;
use std::{fs::read_to_string, sync::OnceLock};

use serde::{Deserialize, Serialize};
use utoipa::ToSchema;

#[derive(Clone, Debug, Deserialize, Serialize, ToSchema)]
pub struct Product {
    pub name: String,
    pub logo: String,
    pub data: Vec<String>,
    pub color: String,
    pub image: String,
    pub plans: HashMap<String, (u64, String)>,
}

pub type Products = HashMap<String, Product>;

#[derive(Debug)]
/// Main Config
pub struct Config {
    pub discord_webhook: String,
    pub products: Products,
    pub zarinpal_merchant_id: String,
    pub bot_token: String,
    pub group_id: String,
}

impl Config {
    pub const RECORD_DIR: &'static str = "./record/";
    pub const CODE_ABC: &'static [u8] = b"0123456789";
    pub const TOKEN_ABC: &'static [u8] =
        b"!@#$%^&*_+abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*_+";
    pub const TT_ORDER_NEW: i64 = 20;
    pub const TT_ORDER_UPDATE: i64 = 21;
    pub const TT_WALLET: i64 = 23;
    pub const TT_VERIFICATION: i64 = 24;
}

pub fn config() -> &'static Config {
    static STATE: OnceLock<Config> = OnceLock::new();

    let products = serde_json::from_str::<Products>(
        &read_to_string("./products.json").expect("fail to read products.json"),
    )
    .expect("invalid products.json");

    STATE.get_or_init(|| Config {
        discord_webhook: evar("DISCORD_WEBHOOK").expect("no DISCORD_WEBHOOK"),
        zarinpal_merchant_id: evar("ZARINPAL_MERCHANT_ID").expect("zarin mid"),
        bot_token: evar("TELOXIDE_TOKEN").expect("no TELOXIDE_TOKEN"),
        group_id: evar("TELOXIDE_GROUP_ID").expect("no TELOXIDE_GROUP_ID"),
        products,
    })
}
