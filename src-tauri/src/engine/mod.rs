pub mod alias_map;
pub mod detector;
pub mod overlap;
pub mod redactor;
pub mod risk_scorer;

use std::path::Path;
use crate::models::public::{AnalysisResult, PreviewData, PreviewLine, PublicFinding};
use crate::models::internal::InternalFinding;
use crate::models::settings::RedactionSettings;
use detector::{compile_rules, count_by_category, detect_line};
use redactor::redact_content;
use risk_scorer::calculate_risk;

pub fn run_analysis(content: &str, file_name: &str, file_size_bytes: u64, settings: &RedactionSettings) -> AnalysisResult {
    let compiled_rules = compile_rules();
    let lines: Vec<&str> = content.lines().collect();

    let all_categories: Vec<String> = crate::rules::builtin::BUILTIN_RULES
        .iter()
        .map(|r| r.id.to_string())
        .collect();

    let mut all_findings: Vec<InternalFinding> = Vec::new();

    for (i, line) in lines.iter().enumerate() {
        let findings = detect_line(line, i + 1, &compiled_rules, &all_categories);
        all_findings.extend(findings);
    }

    let category_counts = count_by_category(&all_findings);
    let risk_score = calculate_risk(&category_counts).to_string();

    let public_findings: Vec<PublicFinding> = all_findings
        .iter()
        .map(|f| PublicFinding {
            id: f.id.clone(),
            rule_id: f.rule_id.clone(),
            category: f.category.clone(),
            label: f.label.clone(),
            line_number: f.line_number,
            severity: f.severity.clone(),
            replacement: f.replacement.clone(),
            low_confidence: f.low_confidence,
        })
        .collect();

    let preview = generate_preview(&lines, &all_findings, settings);

    AnalysisResult {
        preview,
        findings: public_findings,
        risk_score,
        category_counts,
        file_name: file_name.to_string(),
        file_size_bytes,
    }
}

pub fn generate_preview(
    lines: &[&str],
    all_findings: &[InternalFinding],
    settings: &RedactionSettings,
) -> PreviewData {
    let preview_limit = 1000;
    let is_truncated = lines.len() > preview_limit;
    let preview_lines_count = std::cmp::min(lines.len(), preview_limit);

    let mut findings_by_line: Vec<Vec<InternalFinding>> = vec![vec![]; preview_lines_count];
    for finding in all_findings {
        if finding.line_number > 0 && finding.line_number <= preview_lines_count {
            findings_by_line[finding.line_number - 1].push(finding.clone());
        }
    }

    let preview_source = &lines[..preview_lines_count];
    let (sanitized_content, used_findings) =
        redact_content(preview_source, findings_by_line.clone(), settings);

    let mut preview_lines = Vec::new();
    for (i, (original, sanitized)) in preview_source.iter().zip(sanitized_content.iter()).enumerate() {
        let line_used_findings: Vec<String> = used_findings
            .iter()
            .filter(|f| f.line_number == i + 1)
            .map(|f| f.id.clone())
            .collect();

        preview_lines.push(PreviewLine {
            line_number: i + 1,
            original_display: original.to_string(),
            sanitized: sanitized.clone(),
            has_findings: !line_used_findings.is_empty(),
            finding_ids: line_used_findings,
        });
    }

    PreviewData {
        lines: preview_lines,
        total_line_count: lines.len(),
        is_truncated,
    }
}

#[derive(Debug, thiserror::Error)]
pub enum ExportError {
    #[error("Source file not found: {0}")]
    SourceNotFound(String),
    #[error("Original file cannot be overwritten.")]
    WouldOverwriteSource,
    #[error("Invalid export extension. Use .txt or .log")]
    InvalidExtension,
    #[error("Destination directory not writable")]
    DestNotWritable,
    #[error("IO error: {0}")]
    Io(#[from] std::io::Error),
}

pub fn validate_export_paths(
    source: &str,
    dest: &str,
) -> Result<(std::path::PathBuf, std::path::PathBuf), ExportError> {
    let source_path = Path::new(source);
    let dest_path = Path::new(dest);

    if !source_path.exists() {
        return Err(ExportError::SourceNotFound(source.to_string()));
    }

    let canonical_source = source_path.canonicalize()?;
    
    let parent = dest_path.parent().unwrap_or_else(|| Path::new("."));
    if !parent.exists() {
        return Err(ExportError::DestNotWritable);
    }
    
    let canonical_dest_parent = parent.canonicalize()?;
    let canonical_dest = canonical_dest_parent.join(
        dest_path.file_name().unwrap_or_default()
    );

    if canonical_source == canonical_dest {
        return Err(ExportError::WouldOverwriteSource);
    }

    let ext = dest_path.extension().and_then(|e| e.to_str()).unwrap_or("");
    if ext != "txt" && ext != "log" {
        return Err(ExportError::InvalidExtension);
    }

    Ok((canonical_source, canonical_dest))
}
