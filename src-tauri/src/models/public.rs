
use serde::Serialize;
use std::collections::HashMap;

#[derive(Debug, Serialize, Clone)]
pub struct PublicFinding {
    pub id: String,
    pub rule_id: String,
    pub category: String,
    pub label: String,
    pub line_number: usize,
    pub severity: String,
    pub replacement: String,
    pub low_confidence: bool,
}

#[derive(Debug, Serialize, Clone)]
pub struct PreviewLine {
    pub line_number: usize,
    pub original_display: String,
    pub sanitized: String,
    pub has_findings: bool,
    pub finding_ids: Vec<String>,
}

#[derive(Debug, Serialize)]
pub struct PreviewData {
    pub lines: Vec<PreviewLine>,
    pub total_line_count: usize,
    pub is_truncated: bool,
}

#[derive(Debug, Serialize)]
pub struct AnalysisResult {
    pub preview: PreviewData,
    pub findings: Vec<PublicFinding>,
    pub risk_score: String,
    pub category_counts: HashMap<String, usize>,
    pub file_name: String,
    pub file_size_bytes: u64,
}

#[derive(Debug, Serialize)]
pub struct ExportResult {
    pub success: bool,
    pub output_path: String,
    pub total_lines_written: usize,
}
