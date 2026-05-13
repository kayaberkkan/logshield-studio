use crate::models::public::ExportResult;
use crate::models::settings::RedactionSettings;
use crate::engine::validate_export_paths;
use crate::engine::redactor::redact_content;
use crate::engine::detector::{compile_rules, detect_line};

#[tauri::command]
pub async fn export_file(
    source_path: String,
    dest_path: String,
    settings: RedactionSettings,
) -> Result<ExportResult, String> {
    
    let (src, dst) = validate_export_paths(&source_path, &dest_path)
        .map_err(|e| e.to_string())?;

    let content = std::fs::read_to_string(&src).map_err(|e| e.to_string())?;
    let lines: Vec<&str> = content.lines().collect();

    let compiled_rules = compile_rules();
    let mut findings_by_line = vec![vec![]; lines.len()];
    
    let categories_to_detect = settings.enabled_categories.clone();

    for (i, line) in lines.iter().enumerate() {
        let findings = detect_line(line, i + 1, &compiled_rules, &categories_to_detect);
        findings_by_line[i] = findings;
    }

    let (sanitized_lines, _) = redact_content(&lines, findings_by_line, &settings);

    let sanitized_content = sanitized_lines.join("\n");
    std::fs::write(&dst, &sanitized_content).map_err(|e| e.to_string())?;

    Ok(ExportResult {
        success: true,
        output_path: dst.to_string_lossy().to_string(),
        total_lines_written: sanitized_lines.len(),
    })
}
