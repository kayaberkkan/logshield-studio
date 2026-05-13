
export type Severity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type RiskScore = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type MaskMode = 'FullRedaction' | 'StableAlias';

export type Category =
  | 'email'
  | 'ipv4'
  | 'jwt'
  | 'bearer_token'
  | 'auth_header'
  | 'password_field'
  | 'db_connection'
  | 'api_key_like'
  | 'ipv6'
  | 'url_sensitive_param';

export interface PublicFinding {
  id: string;
  rule_id: string;
  category: Category;
  label: string;
  line_number: number;
  severity: Severity;
  replacement: string;
  low_confidence: boolean;
}

export interface PreviewLine {
  line_number: number;
  original_display: string;
  sanitized: string;
  has_findings: boolean;
  finding_ids: string[];
}

export interface PreviewData {
  lines: PreviewLine[];
  total_line_count: number;
  is_truncated: boolean;
}

export interface AnalysisResult {
  preview: PreviewData;
  findings: PublicFinding[];
  risk_score: RiskScore;
  category_counts: Record<Category, number>;
  file_name: string;
  file_size_bytes: number;
}

export interface RedactionSettings {
  enabled_categories: Category[];
  mask_mode: MaskMode;
}

export interface ExportResult {
  success: boolean;
  output_path: string;
  total_lines_written: number;
}

export interface CategoryMeta {
  id: Category;
  label: string;
  description: string;
  severity: Severity;
  defaultEnabled: boolean;
  lowConfidence: boolean;
}

export const CATEGORY_META: CategoryMeta[] = [
  {
    id: 'db_connection',
    label: 'Database Connection String',
    description: 'MongoDB, PostgreSQL, MySQL, Redis, MSSQL',
    severity: 'CRITICAL',
    defaultEnabled: true,
    lowConfidence: false,
  },
  {
    id: 'auth_header',
    label: 'Authorization Header',
    description: 'Authorization: <scheme> <credentials>',
    severity: 'HIGH',
    defaultEnabled: true,
    lowConfidence: false,
  },
  {
    id: 'bearer_token',
    label: 'Bearer Token',
    description: 'Bearer <token>',
    severity: 'HIGH',
    defaultEnabled: true,
    lowConfidence: false,
  },
  {
    id: 'jwt',
    label: 'JWT Token',
    description: 'eyJ... three-part base64url token',
    severity: 'CRITICAL',
    defaultEnabled: true,
    lowConfidence: false,
  },
  {
    id: 'password_field',
    label: 'Password / Secret Field',
    description: 'password=, secret=, token=, pwd=, pass=',
    severity: 'HIGH',
    defaultEnabled: true,
    lowConfidence: false,
  },
  {
    id: 'api_key_like',
    label: 'API Key-like Field',
    description: 'api_key=, apikey=, access_key=, secret_key=',
    severity: 'LOW',
    defaultEnabled: false,
    lowConfidence: true,
  },
  {
    id: 'email',
    label: 'Email Address',
    description: 'user@domain.tld',
    severity: 'MEDIUM',
    defaultEnabled: true,
    lowConfidence: false,
  },
  {
    id: 'ipv4',
    label: 'IPv4 Address',
    description: '192.168.x.x, 10.x.x.x, etc.',
    severity: 'LOW',
    defaultEnabled: true,
    lowConfidence: false,
  },
];
