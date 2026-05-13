
pub struct Rule {
    pub id: &'static str,
    pub category: &'static str,
    pub label: &'static str,
    pub pattern: &'static str,
    pub severity: &'static str,
    pub default_enabled: bool,
    pub low_confidence: bool,
}

pub const BUILTIN_RULES: &[Rule] = &[

    Rule {
        id: "db_uri_connection",
        category: "db_connection",
        label: "Database URI",
        pattern: r#"(?i)\b(?:postgres(?:ql)?|mysql|mongodb(?:\+srv)?|redis)://[^\s<>"']+"#,
        severity: "CRITICAL",
        default_enabled: true,
        low_confidence: false,
    },
    Rule {
        id: "db_jdbc_connection",
        category: "db_connection",
        label: "JDBC Connection String",
        pattern: r#"(?i)\bjdbc:[a-z]+://[^\s<>"']+"#,
        severity: "CRITICAL",
        default_enabled: true,
        low_confidence: false,
    },
    Rule {
        id: "db_mssql_connection",
        category: "db_connection",
        label: "MSSQL Connection String",
        pattern: r#"(?i)\b(?:Server|Data Source|Database|Initial Catalog|User Id|User ID|Uid|Password|Pwd|Provider|Network Library)\s*=[^;\n"']+;?(?:\s*[a-zA-Z\s]+=[^;\n"']+;?)*"#,
        severity: "CRITICAL",
        default_enabled: true,
        low_confidence: false,
    },
    Rule {
        id: "jwt",
        category: "jwt",
        label: "JWT Token",
        pattern: r#"eyJ[A-Za-z0-9\-_]+\.[A-Za-z0-9\-_]+\.[A-Za-z0-9\-_]+"#,
        severity: "CRITICAL",
        default_enabled: true,
        low_confidence: false,
    },
    
    Rule {
        id: "auth_header",
        category: "auth_header",
        label: "Authorization Header",
        pattern: r#"(?i)Authorization:\s*\S.*"#,
        severity: "HIGH",
        default_enabled: true,
        low_confidence: false,
    },
    Rule {
        id: "bearer_token",
        category: "bearer_token",
        label: "Bearer Token",
        pattern: r#"(?i)Bearer\s+(?P<secret>[A-Za-z0-9\-._~+/]{16,}=*)"#,
        severity: "HIGH",
        default_enabled: true,
        low_confidence: false,
    },
    Rule {
        id: "password_field",
        category: "password_field",
        label: "Password / Secret Field",
        pattern: r#"(?i)\b(?:password|passwd|pwd|secret|token|pass)\b\s*[:=]\s*["']?(?P<secret>[^"'\s,;&}]+)["']?"#,
        severity: "HIGH",
        default_enabled: true,
        low_confidence: false,
    },
    Rule {
        id: "json_secret",
        category: "password_field",
        label: "JSON Secret Field",
        pattern: r#"(?i)"(?:password|passwd|pwd|secret|token|pass)"\s*:\s*"(?P<secret>[^"]+)""#,
        severity: "HIGH",
        default_enabled: true,
        low_confidence: false,
    },
    Rule {
        id: "url_sensitive_param",
        category: "url_sensitive_param",
        label: "URL Sensitive Param",
        pattern: r#"(?i)[?&](?:token|api_key|apikey|key|secret|password|client_secret|access_key)=(?P<secret>[^&\s]+)"#,
        severity: "HIGH",
        default_enabled: true,
        low_confidence: false,
    },
    
    Rule {
        id: "email",
        category: "email",
        label: "Email Address",
        pattern: r#"(?i)\b[A-Z0-9._%+\-]+@(?:[A-Z0-9\-]+\.)+[A-Z]{2,}\b"#,
        severity: "MEDIUM",
        default_enabled: true,
        low_confidence: false,
    },
    
    Rule {
        id: "api_key_like",
        category: "api_key_like",
        label: "API Key-like Field",
        pattern: r#"(?i)\b(?:api_key|apikey|access_key|secret_key|client_secret)\b\s*[=:]\s*["']?(?P<secret>[^"'\s,;&}]+)["']?"#,
        severity: "LOW",
        default_enabled: true, 
        low_confidence: false,
    },
    Rule {
        id: "json_api_key",
        category: "api_key_like",
        label: "JSON API Key Field",
        pattern: r#"(?i)"(?:api_key|apikey|access_key|secret_key|client_secret)"\s*:\s*"(?P<secret>[^"]+)""#,
        severity: "LOW",
        default_enabled: true,
        low_confidence: false,
    },
    Rule {
        id: "sdp_api_key",
        category: "api_key_like",
        label: "SymDev Token",
        pattern: r#"\b(?P<secret>sdp_[A-Za-z0-9_-]{20,})\b"#,
        severity: "LOW",
        default_enabled: true,
        low_confidence: false,
    },
    Rule {
        id: "ipv4",
        category: "ipv4",
        label: "IPv4 Address",
        pattern: r#"\b(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\b"#,
        severity: "LOW",
        default_enabled: true,
        low_confidence: false,
    },
    Rule {
        id: "ipv6",
        category: "ipv6",
        label: "IPv6 Address",
        pattern: r#"(?i)(?:[a-f0-9]{1,4}:){7}[a-f0-9]{1,4}(?:%[a-z0-9]+)?|(?:[a-f0-9]{1,4}:){1,7}:(?:[a-f0-9]{1,4}:){0,6}[a-f0-9]{1,4}(?:%[a-z0-9]+)?|::(?:[a-f0-9]{1,4}:){0,6}[a-f0-9]{1,4}(?:%[a-z0-9]+)?"#,
        severity: "LOW",
        default_enabled: true,
        low_confidence: false,
    },
];

pub fn priority_of(rule_id: &str) -> usize {
    let base_id = if rule_id.starts_with("db_") {
        "db_connection"
    } else {
        rule_id
    };

    const ORDER: &[&str] = &[
        "db_connection",
        "url_sensitive_param",
        "auth_header",
        "bearer_token",
        "jwt",
        "json_api_key",
        "json_secret",
        "sdp_api_key",
        "api_key_like",
        "password_field",
        "email",
        "ipv4",
        "ipv6",
    ];
    ORDER.iter().position(|&c| c == base_id).unwrap_or(usize::MAX)
}

pub fn full_redaction_label(category: &str) -> &'static str {
    match category {
        "email"               => "[REDACTED_EMAIL]",
        "ipv4"                => "[REDACTED_IPV4]",
        "ipv6"                => "[REDACTED_IPV6]",
        "jwt"                 => "[REDACTED_JWT]",
        "bearer_token"        => "[REDACTED_BEARER_TOKEN]",
        "auth_header"         => "[REDACTED_AUTH_HEADER]",
        "password_field"      => "[REDACTED_PASSWORD_FIELD]",
        "api_key_like"        => "[REDACTED_API_KEY]",
        "db_connection"       => "[REDACTED_DB_CONNECTION]",
        "url_sensitive_param" => "[REDACTED_URL_PARAM]",
        _                     => "[REDACTED]",
    }
}
