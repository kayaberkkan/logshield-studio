use serde::Deserialize;

#[derive(Debug, Deserialize, Clone, PartialEq)]
pub enum MaskMode {
    FullRedaction,
    StableAlias,
}

#[derive(Debug, Deserialize, Clone)]
pub struct RedactionSettings {
    pub enabled_categories: Vec<String>,
    pub mask_mode: MaskMode,
}
