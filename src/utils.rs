use crate::config::{config, Config};
use crate::models::{AppErr, bad_request};
use image::io::Reader as ImageReader;
use image::ImageFormat;
use rand::Rng;
use serde::Serialize;
use std::io;
use std::path::Path;

pub fn phone_validator(phone: &str) -> Result<(), AppErr> {
    if phone.len() != 11 || !phone.starts_with("09") {
        return Err(bad_request!("invalid phone number"));
    }

    if phone.chars().any(|c| !c.is_ascii_digit()) {
        return Err(bad_request!("phone number must be all digits"));
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

pub async fn heimdall_message(text: &str, tag: &str) {
    let client = awc::Client::new();
    let request = client
        .post(format!("https://heimdall.00-team.org/api/sites/messages/"))
        .insert_header(("authorization", config().heimdall_token.as_str()));

    #[derive(Serialize)]
    struct Message {
        text: String,
        tag: String,
    }

    let _ = request
        .send_json(&Message { text: text.to_string(), tag: tag.to_string() })
        .await;
}

pub async fn send_message(topic: i64, text: &str) {
    if cfg!(debug_assertions) {
        log::info!("send_message: {topic}\n{text}");
        return;
    }

    let client = awc::Client::new();
    let conf = config();
    let url = format!(
        "https://api.telegram.org/bot{}/sendMessage?chat_id={}&parse_mode=MarkdownV2&message_thread_id={}",
        conf.bot_token, conf.group_id, topic
    );
    let request = client.post(&url);

    #[derive(Serialize, Debug)]
    struct Body {
        text: String,
    }

    let _ = request.send_json(&Body { text: text.to_string() }).await;
    // match result {
    //     Ok(mut v) => {
    //         log::info!("topic: {}", topic);
    //         log::info!("text: {}", text);
    //         log::info!("send message status: {:?}", v.status());
    //         log::info!("send message: {:?}", v.body().await);
    //     }
    //     Err(e) => {
    //         log::info!("send message err: {:?}", e);
    //     }
    // }
}

pub fn escape(s: &str) -> String {
    s.replace('_', r"\_")
        .replace('*', r"\*")
        .replace('[', r"\[")
        .replace(']', r"\]")
        .replace('(', r"\(")
        .replace(')', r"\)")
        .replace('~', r"\~")
        .replace('`', r"\`")
        .replace('>', r"\>")
        .replace('#', r"\#")
        .replace('+', r"\+")
        .replace('-', r"\-")
        .replace('=', r"\=")
        .replace('|', r"\|")
        .replace('{', r"\{")
        .replace('}', r"\}")
        .replace('.', r"\.")
        .replace('!', r"\!")
}

// pub fn escape_link_url(s: &str) -> String {
//     s.replace('`', r"\`").replace(')', r"\)")
// }

pub fn escape_code(s: &str) -> String {
    s.replace('\\', r"\\").replace('`', r"\`")
}

pub async fn send_sms_prefab(phone: &str, body_id: i64, args: Vec<String>) {
    log::info!("\nsending sms to {phone}:\n\n{args:?}\n");

    if cfg!(debug_assertions) {
        return;
    }

    let client = awc::Client::new();
    let request = client.post(format!(
        "https://console.melipayamak.com/api/send/shared/{}",
        config().melipayamak
    ));

    #[derive(Serialize, Debug)]
    #[serde(rename_all = "camelCase")]
    struct Body {
        body_id: i64,
        to: String,
        args: Vec<String>,
    }

    let _ =
        request.send_json(&Body { body_id, to: phone.to_string(), args }).await;
}

pub async fn send_sms(phone: &str, text: &str) {
    log::info!("\nsending sms to {phone}:\n\n{text}\n");

    if cfg!(debug_assertions) {
        return;
    }

    let client = awc::Client::new();
    let request = client.post(format!(
        "https://console.melipayamak.com/api/send/simple/{}",
        config().melipayamak
    ));

    #[derive(Serialize, Debug)]
    struct Body {
        from: String,
        to: String,
        text: String,
    }

    let _ = request
        .send_json(&Body {
            from: "50002710033613".to_string(),
            to: phone.to_string(),
            text: text.to_string(),
        })
        .await;
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
