// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use tauri::Manager;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

// the payload type must implement `Serialize` and `Clone`.
#[derive(Clone, serde::Serialize)]
struct Payload {
  path: String,
}

use tauri::{command, State, Window};

#[derive(Debug, serde::Deserialize)]
struct DropFilesArgs {
    files: Vec<String>,
}

#[tauri::command]
async fn droprun(files: Vec<String>) -> String {
//async fn droprun(window: Window, state: State<'_,DropFilesArgs>) -> Result<(), String> {
    for file_path in files.iter() {
        println!("Dropped file: {}", file_path);
    }

    "".to_string()
}



fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet, droprun])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
