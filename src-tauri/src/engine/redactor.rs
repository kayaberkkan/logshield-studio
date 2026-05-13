use crate::engine::alias_map::AliasMap;
use crate::engine::overlap::resolve_overlaps;
use crate::models::internal::InternalFinding;
use crate::models::settings::{MaskMode, RedactionSettings};

pub fn redact_line(
    line: &str,
    mut findings: Vec<InternalFinding>,
    alias_map: &mut AliasMap,
    mode: &MaskMode,
) -> (String, Vec<InternalFinding>) {
    
    let resolved = resolve_overlaps(findings.clone());

    if resolved.is_empty() {
        return (line.to_string(), vec![]);
    }

    let mut result = line.to_string();
    let mut used: Vec<InternalFinding> = Vec::new();

    for mut finding in resolved {
        
        let replacement = alias_map.apply(&finding, mode);
        finding.replacement = replacement.clone();

        if finding.end_byte <= result.len() {
            result.replace_range(finding.start_byte..finding.end_byte, &replacement);
        }

        used.push(finding);
    }

    let used_ids: std::collections::HashSet<String> = used.iter().map(|f| f.id.clone()).collect();
    findings.retain(|f| used_ids.contains(&f.id));

    (result, used)
}

pub fn redact_content(
    lines: &[&str],
    all_findings_by_line: Vec<Vec<InternalFinding>>,
    settings: &RedactionSettings,
) -> (Vec<String>, Vec<InternalFinding>) {
    let mut alias_map = AliasMap::new();
    let mut all_used = Vec::new();
    let mut sanitized = Vec::new();

    for (i, line) in lines.iter().enumerate() {
        let line_findings = all_findings_by_line
            .get(i)
            .cloned()
            .unwrap_or_default()
            .into_iter()
            .filter(|f| settings.enabled_categories.contains(&f.category))
            .collect();

        let (san_line, used) = redact_line(line, line_findings, &mut alias_map, &settings.mask_mode);
        sanitized.push(san_line);
        all_used.extend(used);
    }

    (sanitized, all_used)
}
