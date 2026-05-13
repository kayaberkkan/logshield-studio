
#[derive(Debug, Clone)]
pub struct InternalFinding {
    pub id: String,
    pub rule_id: String,
    pub category: String,
    pub label: String,
    
    pub value: String,
    pub line_number: usize,
    pub start_byte: usize,
    pub end_byte: usize,
    pub severity: String,
    pub low_confidence: bool,
    
    pub replacement: String,
}
