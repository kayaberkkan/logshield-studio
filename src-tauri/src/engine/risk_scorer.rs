use std::collections::HashMap;

pub fn calculate_risk(category_counts: &HashMap<String, usize>) -> &'static str {
    let has = |cat: &str| category_counts.get(cat).copied().unwrap_or(0) > 0;

    if has("db_connection") || has("jwt") {
        return "CRITICAL";
    }
    
    if has("auth_header") || has("bearer_token") || has("password_field") {
        return "HIGH";
    }
    
    if has("email") {
        return "MEDIUM";
    }
    
    if has("ipv4") || has("api_key_like") {
        return "LOW";
    }

    "LOW"
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_critical_jwt() {
        let mut counts = HashMap::new();
        counts.insert("jwt".to_string(), 2);
        counts.insert("email".to_string(), 3);
        assert_eq!(calculate_risk(&counts), "CRITICAL");
    }

    #[test]
    fn test_high_password() {
        let mut counts = HashMap::new();
        counts.insert("password_field".to_string(), 1);
        assert_eq!(calculate_risk(&counts), "HIGH");
    }

    #[test]
    fn test_medium_email_only() {
        let mut counts = HashMap::new();
        counts.insert("email".to_string(), 5);
        assert_eq!(calculate_risk(&counts), "MEDIUM");
    }

    #[test]
    fn test_low_ipv4_only() {
        let mut counts = HashMap::new();
        counts.insert("ipv4".to_string(), 10);
        assert_eq!(calculate_risk(&counts), "LOW");
    }
}
