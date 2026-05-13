pub mod commands;
pub mod engine;
pub mod models;
pub mod rules;

use tauri::menu::{AboutMetadata, Menu, MenuItem, PredefinedMenuItem, Submenu};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_log::Builder::new().build())
        .setup(|app| {
            let handle = app.handle();
            
            let metadata = AboutMetadata {
                name: Some("LogShield Studio".to_string()),
                version: Some("0.1.0".to_string()),
                copyright: Some("Copyright © 2026 Berkkan Kaya. All rights reserved.".to_string()),
                ..Default::default()
            };

            let app_menu = Submenu::with_items(
                handle,
                "LogShield Studio",
                true,
                &[
                    &PredefinedMenuItem::about(handle, None, Some(metadata))?,
                    &PredefinedMenuItem::separator(handle)?,
                    &PredefinedMenuItem::services(handle, None)?,
                    &PredefinedMenuItem::separator(handle)?,
                    &PredefinedMenuItem::hide(handle, None)?,
                    &PredefinedMenuItem::hide_others(handle, None)?,
                    &PredefinedMenuItem::show_all(handle, None)?,
                    &PredefinedMenuItem::separator(handle)?,
                    &PredefinedMenuItem::quit(handle, None)?,
                ],
            )?;

            let edit_menu = Submenu::with_items(
                handle,
                "Edit",
                true,
                &[
                    &PredefinedMenuItem::undo(handle, None)?,
                    &PredefinedMenuItem::redo(handle, None)?,
                    &PredefinedMenuItem::separator(handle)?,
                    &PredefinedMenuItem::cut(handle, None)?,
                    &PredefinedMenuItem::copy(handle, None)?,
                    &PredefinedMenuItem::paste(handle, None)?,
                    &PredefinedMenuItem::select_all(handle, None)?,
                ],
            )?;

            let view_menu = Submenu::with_items(
                handle,
                "View",
                true,
                &[
                    &PredefinedMenuItem::fullscreen(handle, None)?,
                ],
            )?;

            let window_menu = Submenu::with_items(
                handle,
                "Window",
                true,
                &[
                    &PredefinedMenuItem::minimize(handle, None)?,
                    &PredefinedMenuItem::separator(handle)?,
                    &PredefinedMenuItem::close_window(handle, None)?,
                ],
            )?;

            let help_menu = Submenu::with_items(
                handle,
                "Help",
                true,
                &[
                    &MenuItem::with_id(handle, "github", "Visit GitHub", true, None::<&str>)?,
                ],
            )?;

            let menu = Menu::with_items(
                handle,
                &[&app_menu, &edit_menu, &view_menu, &window_menu, &help_menu],
            )?;

            app.set_menu(menu)?;

            app.on_menu_event(move |_app_handle, event| {
                if event.id() == "github" {
                    let _ = tauri_plugin_opener::open_url("https://github.com/kayaberkkan", None::<&str>);
                }
            });

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            commands::analyze::analyze_file,
            commands::analyze::get_sanitized_preview,
            commands::export::export_file
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
