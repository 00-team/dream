use std::sync::OnceLock;

#[derive(Debug)]
/// Main Config
pub struct Config {
    pub discord_webhook: String,
}

impl Config {
    pub const RECORD_DIR: &'static str = "./records/";
    pub const CODE_ABC: &'static [u8] = b"0123456789";
    pub const TOKEN_ABC: &'static [u8] = b"!@#$%^&*_+abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*_+";
    pub const OFFER_TAX: f32 = 2.5;
    pub const OFFER_TAX_MAX: f32 = 50_000.0;
}

pub fn config() -> &'static Config {
    static STATE: OnceLock<Config> = OnceLock::new();
    STATE.get_or_init(|| Config {
        discord_webhook: std::env::var("DISCORD_WEBHOOK").unwrap(),
    })
}
