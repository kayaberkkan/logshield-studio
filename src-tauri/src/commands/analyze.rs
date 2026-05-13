use std::path::Path;
use crate::models::public::{AnalysisResult, PreviewData};
use crate::models::settings::RedactionSettings;
use crate::engine::{run_analysis, generate_preview};
use crate::engine::detector::{compile_rules, detect_line};

#[tauri::command]
pub async fn analyze_file(path: String, settings: RedactionSettings) -> Result<AnalysisResult, String> {
    let p = Path::new(&path);
    if !p.exists() {
        return Err("File not found".into());
    }
    let ext = p.extension().and_then(|e| e.to_str()).unwrap_or("");
    if ext != "txt" && ext != "log" {
        return Err("Unsupported file type. Only .txt and .log supported".into());
    }

    let file_size = std::fs::metadata(p).map_err(|e| e.to_string())?.len();
    let content = std::fs::read_to_string(p).map_err(|e| e.to_string())?;
    let file_name = p.file_name().unwrap_or_default().to_string_lossy();

    let result = run_analysis(&content, &file_name, file_size, &settings);
    Ok(result)
}

#[tauri::command]
pub async fn get_sanitized_preview(path: String, settings: RedactionSettings) -> Result<PreviewData, String> {
    let p = Path::new(&path);
    if !p.exists() {
        return Err("File not found".into());
    }
    
    let content = std::fs::read_to_string(p).map_err(|e| e.to_string())?;
    let lines: Vec<&str> = content.lines().take(1000).collect();
    
    let compiled_rules = compile_rules();
    let all_categories: Vec<String> = crate::rules::builtin::BUILTIN_RULES
        .iter()
        .map(|r| r.id.to_string())
        .collect();
        
    let mut all_findings = Vec::new();
    for (i, line) in lines.iter().enumerate() {
        let findings = detect_line(line, i + 1, &compiled_rules, &all_categories);
        all_findings.extend(findings);
    }
    
    let preview = generate_preview(&lines, &all_findings, &settings);
    Ok(preview)
}
