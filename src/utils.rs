use crate::config::{config, Config};
use crate::models::{AppErr, AppErrBadRequest};
use image::io::Reader as ImageReader;
use image::ImageFormat;
use rand::Rng;
use serde::Serialize;
use std::io;
use std::path::Path;

pub fn phone_validator(phone: &str) -> Result<(), AppErr> {
    if phone.len() != 11 || !phone.starts_with("09") {
        return Err(AppErrBadRequest("invalid phone number"));
    }

    if phone.chars().any(|c| !c.is_ascii_digit()) {
        return Err(AppErrBadRequest("phone number must be all digits"));
    }

    Ok(())
}

pub fn now() -> i64 {
    chrono::Local::now().timestamp()
}

pub fn get_random_string(charset: &[u8], len: usize) -> String {
    let mut rng = rand::thread_rng();
    (0..len).map(|_| charset[rng.gen_range(0..charset.len())] as char).collect()
}

pub fn get_random_bytes(len: usize) -> String {
    let mut rng = rand::thread_rng();
    hex::encode((0..len).map(|_| rng.gen::<u8>()).collect::<Vec<u8>>())
}

pub fn save_photo(path: &Path, name: &str) -> io::Result<()> {
    let img = ImageReader::open(path)?
        .with_guessed_format()?
        .decode()
        .map_err(|e| io::Error::new(io::ErrorKind::Other, e))?;

    img.thumbnail(512, 512)
        .save_with_format(
            Path::new(Config::RECORD_DIR).join(name),
            ImageFormat::Png,
        )
        .map_err(|e| io::Error::new(io::ErrorKind::Other, e))?;

    Ok(())
}

pub fn remove_photo(name: &str) {
    let _ = std::fs::remove_file(Path::new(Config::RECORD_DIR).join(name));
}

pub async fn send_webhook(title: &str, desc: &str, color: u32) {
    let client = awc::Client::new();
    let request = client.post(&config().discord_webhook);

    #[derive(Serialize, Debug)]
    struct Embed {
        title: String,
        description: String,
        color: u32,
    }

    #[derive(Serialize, Debug)]
    struct Data {
        embeds: [Embed; 1],
    }

    let _ = request
        .send_json(&Data {
            embeds: [Embed {
                title: title.to_string(),
                description: desc.to_string(),
                color,
            }],
        })
        .await;
}

pub async fn send_sms(phone: &str, text: &str) {
    // let client = awc::Client::new();
    log::info!("\nsending sms to {phone}:\n\n{text}\n");
}

pub trait CutOff {
    fn cut_off(&mut self, len: usize);
}

impl CutOff for String {
    fn cut_off(&mut self, len: usize) {
        let mut idx = len;
        loop {
            if self.is_char_boundary(idx) {
                break;
            }
            idx -= 1;
        }
        self.truncate(idx)
    }
}

impl CutOff for Option<String> {
    fn cut_off(&mut self, len: usize) {
        if let Some(v) = self {
            let mut idx = len;
            loop {
                if v.is_char_boundary(idx) {
                    break;
                }
                idx -= 1;
            }
            v.truncate(idx)
        }
    }
}
