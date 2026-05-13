use regex::Regex;
use std::collections::HashMap;
use uuid::Uuid;
use crate::models::internal::InternalFinding;
use crate::rules::builtin::BUILTIN_RULES;

pub fn detect_line(
    line: &str,
    line_number: usize,
    compiled: &[(String, Regex, &'static crate::rules::builtin::Rule)],
    enabled_categories: &[String],
) -> Vec<InternalFinding> {
    let mut findings = Vec::new();

    for (_id, re, rule) in compiled {
        if !enabled_categories.contains(&rule.category.to_string()) {
            continue;
        }
        for caps in re.captures_iter(line) {
            
            if rule.category == "ipv4" {
                let full_match = caps.get(0).unwrap();
                let start = full_match.start();
                let context_start = start.saturating_sub(20);
                let context = &line[context_start..start].to_lowercase();
                if context.contains("version") {
                    continue; 
                }
            }

            let m = caps.name("secret").unwrap_or_else(|| caps.get(0).unwrap());
            let m_lower = m.as_str().to_lowercase();

            if rule.id == "bearer_token" {
                let invalid_words = ["authentication", "method", "enabled", "token", "type", "bearer", "auth", "oauth", "oauth2"];
                if invalid_words.iter().any(|&w| m_lower.contains(w)) {
                    continue;
                }
            }

            if rule.id == "sdp_api_key" {
                let invalid_words = ["sdp_mode", "sdp_status", "sdp_config", "sdp_env", "sdp_id", "sdp_release_candidate_alpha", "sdp_api_key_format"];
                if invalid_words.iter().any(|&w| m_lower.contains(w)) {
                    continue;
                }
                
                let body = if m_lower.starts_with("sdp_") { &m_lower[4..] } else { &m_lower };
                let body_underscore_count = body.chars().filter(|&c| c == '_').count();
                if body_underscore_count > 3 {
                    let start = caps.get(0).unwrap().start();
                    let context_start = start.saturating_sub(50);
                    let context = &line[context_start..start].to_lowercase();
                    if !context.contains("api_key") && !context.contains("token") && !context.contains("access_key") && !context.contains("client_secret") {
                        continue;
                    }
                }
            }

            if rule.id == "db_mssql_connection" {
                let full_match = caps.get(0).unwrap().as_str().to_lowercase();
                let has_server = full_match.contains("server=") || full_match.contains("data source=");
                let has_password = full_match.contains("password=") || full_match.contains("pwd=");
                if !(has_server && has_password) {
                    continue;
                }
            }

            findings.push(InternalFinding {
                id: Uuid::new_v4().to_string(),
                rule_id: rule.id.to_string(),
                category: rule.category.to_string(),
                label: rule.label.to_string(),
                value: m.as_str().to_string(),
                line_number,
                start_byte: m.start(),
                end_byte: m.end(),
                severity: rule.severity.to_string(),
                low_confidence: rule.low_confidence,
                replacement: String::new(), 
            });
        }
    }

    findings
}

pub fn compile_rules() -> Vec<(String, Regex, &'static crate::rules::builtin::Rule)> {
    BUILTIN_RULES
        .iter()
        .filter_map(|rule| {
            match Regex::new(rule.pattern) {
                Ok(re) => Some((rule.id.to_string(), re, rule)),
                Err(e) => {
                    eprintln!("Failed to compile regex for rule '{}': {}", rule.id, e);
                    None
                }
            }
        })
        .collect()
}

pub fn count_by_category(findings: &[InternalFinding]) -> HashMap<String, usize> {
    let mut counts: HashMap<String, usize> = HashMap::new();
    for f in findings {
        *counts.entry(f.category.clone()).or_insert(0) += 1;
    }
    counts
}
