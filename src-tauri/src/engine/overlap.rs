use crate::models::internal::InternalFinding;
use crate::rules::builtin::priority_of;

pub fn resolve_overlaps(mut findings: Vec<InternalFinding>) -> Vec<InternalFinding> {
    
    findings.sort_by(|a, b| {
        let p_a = priority_of(&a.rule_id);
        let p_b = priority_of(&b.rule_id);
        if p_a == p_b {
            let len_a = a.end_byte - a.start_byte;
            let len_b = b.end_byte - b.start_byte;
            len_b.cmp(&len_a)
        } else {
            p_a.cmp(&p_b)
        }
    });

    let mut resolved: Vec<InternalFinding> = Vec::new();

    'outer: for candidate in findings {
        for accepted in &resolved {
            let overlaps = candidate.start_byte < accepted.end_byte
                && candidate.end_byte > accepted.start_byte;
            if overlaps {
                
                continue 'outer;
            }
        }
        resolved.push(candidate);
    }

    resolved.sort_by(|a, b| b.start_byte.cmp(&a.start_byte));
    resolved
}

#[cfg(test)]
mod tests {
    use super::*;

    fn make(id: &str, cat: &str, start: usize, end: usize) -> InternalFinding {
        InternalFinding {
            id: id.to_string(),
            rule_id: cat.to_string(),
            category: cat.to_string(),
            label: cat.to_string(),
            value: "secret".to_string(),
            line_number: 1,
            start_byte: start,
            end_byte: end,
            severity: "HIGH".to_string(),
            low_confidence: false,
            replacement: "[X]".to_string(),
        }
    }

    #[test]
    fn test_overlap_high_priority_wins() {
        
        let findings = vec![
            make("1", "jwt", 22, 35),
            make("2", "bearer_token", 15, 35),
            make("3", "auth_header", 0, 35),
        ];
        let resolved = resolve_overlaps(findings);
        assert_eq!(resolved.len(), 1);
        assert_eq!(resolved[0].category, "auth_header");
    }

    #[test]
    fn test_no_overlap_keeps_all() {
        let findings = vec![
            make("1", "email", 0, 20),
            make("2", "ipv4", 25, 40),
        ];
        let resolved = resolve_overlaps(findings);
        assert_eq!(resolved.len(), 2);
    }

    #[test]
    fn test_resolved_sorted_reverse() {
        let findings = vec![
            make("1", "email", 0, 10),
            make("2", "ipv4", 20, 30),
        ];
        let resolved = resolve_overlaps(findings);
        
        assert!(resolved[0].start_byte > resolved[1].start_byte);
    }

    #[test]
    fn test_db_connection_wins_over_password_and_url_params() {
        
        let findings = vec![
            make("1", "password_field", 51, 76),
            make("2", "db_jdbc_connection", 0, 76),
        ];
        let resolved = resolve_overlaps(findings);
        assert_eq!(resolved.len(), 1);
        assert_eq!(resolved[0].category, "db_jdbc_connection");
    }

    #[test]
    fn test_mssql_connection_wins_over_password_and_ipv4() {
        
        let findings = vec![
            make("1", "ipv4", 12, 23),
            make("2", "password_field", 63, 81),
            make("3", "db_mssql_connection", 0, 81),
        ];
        let resolved = resolve_overlaps(findings);
        assert_eq!(resolved.len(), 1);
        assert_eq!(resolved[0].category, "db_mssql_connection");
    }

    #[test]
    fn test_sdp_standalone_token_wins() {
        let findings = vec![
            make("1", "sdp_api_key", 0, 36), 
            make("2", "password_field", 0, 36), 
        ];
        let resolved = resolve_overlaps(findings);
        
        assert_eq!(resolved.len(), 1);
        assert_eq!(resolved[0].category, "sdp_api_key");
    }

    #[test]
    fn test_bearer_token_wins_over_jwt() {
        
        let findings = vec![
            make("1", "jwt", 7, 35),
            make("2", "bearer_token", 0, 35),
        ];
        let resolved = resolve_overlaps(findings);
        assert_eq!(resolved.len(), 1);
        assert_eq!(resolved[0].category, "bearer_token");
    }
}
