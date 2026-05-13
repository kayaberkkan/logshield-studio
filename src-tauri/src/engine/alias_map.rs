use std::collections::HashMap;
use crate::models::internal::InternalFinding;
use crate::models::settings::MaskMode;
use crate::rules::builtin::full_redaction_label;

#[derive(Default)]
pub struct AliasMap {
    value_to_alias: HashMap<String, String>,
    category_counters: HashMap<String, usize>,
}

impl AliasMap {
    pub fn new() -> Self {
        Self::default()
    }

    pub fn apply(&mut self, finding: &InternalFinding, mode: &MaskMode) -> String {
        match mode {
            MaskMode::FullRedaction => {
                full_redaction_label(&finding.category).to_string()
            }
            MaskMode::StableAlias => {
                if let Some(alias) = self.value_to_alias.get(&finding.value) {
                    return alias.clone();
                }
                let key = finding.category.to_uppercase();
                let n = self.category_counters.entry(key.clone()).or_insert(0);
                *n += 1;
                let alias = format!("[{}_{}]", key, n);
                self.value_to_alias.insert(finding.value.clone(), alias.clone());
                alias
            }
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn make_finding(value: &str, category: &str) -> InternalFinding {
        InternalFinding {
            id: "test".into(),
            rule_id: category.into(),
            category: category.into(),
            label: category.into(),
            value: value.into(),
            line_number: 1,
            start_byte: 0,
            end_byte: value.len(),
            severity: "MEDIUM".into(),
            low_confidence: false,
            replacement: String::new(),
        }
    }

    #[test]
    fn test_stable_alias_same_value() {
        let mut map = AliasMap::new();
        let f1 = make_finding("umut@example.com", "email");
        let f2 = make_finding("umut@example.com", "email");
        let a1 = map.apply(&f1, &MaskMode::StableAlias);
        let a2 = map.apply(&f2, &MaskMode::StableAlias);
        assert_eq!(a1, a2);
        assert_eq!(a1, "[EMAIL_1]");
    }

    #[test]
    fn test_stable_alias_different_values() {
        let mut map = AliasMap::new();
        let f1 = make_finding("umut@example.com", "email");
        let f2 = make_finding("ahmet@example.com", "email");
        let a1 = map.apply(&f1, &MaskMode::StableAlias);
        let a2 = map.apply(&f2, &MaskMode::StableAlias);
        assert_eq!(a1, "[EMAIL_1]");
        assert_eq!(a2, "[EMAIL_2]");
    }

    #[test]
    fn test_full_redaction_static_label() {
        let mut map = AliasMap::new();
        let f1 = make_finding("umut@example.com", "email");
        let f2 = make_finding("ahmet@example.com", "email");
        let a1 = map.apply(&f1, &MaskMode::FullRedaction);
        let a2 = map.apply(&f2, &MaskMode::FullRedaction);
        assert_eq!(a1, "[REDACTED_EMAIL]");
        assert_eq!(a2, "[REDACTED_EMAIL]"); 
    }
}
