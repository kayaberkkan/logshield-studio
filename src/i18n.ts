export type Language = 'en' | 'tr';

interface Translations {
  [key: string]: { en: string; tr: string };
}

export const t: Translations = {
  
  slogan: {
    en: 'Share logs safely. Leave no secrets',
    tr: 'Share logs safely. Leave no secrets',
  },

  dropTitle: {
    en: 'Drop a log file to scan for secrets',
    tr: 'Log dosyalarını taramak için buraya sürükleyin',
  },
  dropSubtitle: {
    en: 'or click anywhere to browse your files',
    tr: 'veya dosyalarınıza göz atmak için tıklayın',
  },
  analyzing: {
    en: 'Analyzing…',
    tr: 'Analiz ediliyor…',
  },
  scanning: {
    en: 'Scanning for sensitive data…',
    tr: 'Hassas veriler taranıyor…',
  },
  supportedFiles: {
    en: 'Supported files:',
    tr: 'Desteklenen dosyalar:',
  },
  selectLogFile: {
    en: 'Select Log File',
    tr: 'Log Dosyası Seç',
  },
  featureLocal: {
    en: '100% Local Processing',
    tr: '100% Yerel İşleme',
  },
  featureContext: {
    en: 'Context-Aware Detection',
    tr: 'Akıllı Bağlam Analizi',
  },

  closeFile: {
    en: '← Close File',
    tr: '← Dosyayı Kapat',
  },
  previewWarning: {
    en: 'Preview shows the first 1000 lines. Export will process the full file.',
    tr: 'Önizleme ilk 1000 satırı gösterir. Dışa aktarma tüm dosyayı işler.',
  },
  newFile: {
    en: '＋ New File',
    tr: '＋ Yeni Dosya',
  },

  riskAssessment: {
    en: 'Risk Assessment',
    tr: 'Risk Değerlendirmesi',
  },
  fileRiskLevel: {
    en: 'File Risk Level',
    tr: 'Dosya Risk Seviyesi',
  },
  foundItems: {
    en: 'sensitive items',
    tr: 'hassas bulgu',
  },
  across: {
    en: 'across',
    tr: 'farklı',
  },
  categories: {
    en: 'categories',
    tr: 'kategori',
  },
  detectedDataTypes: {
    en: 'Detected Data Types',
    tr: 'Tespit Edilen Veri Türleri',
  },
  noSensitiveData: {
    en: 'No sensitive data detected.',
    tr: 'Hassas veri tespit edilmedi.',
  },
  maskingMode: {
    en: 'Masking Mode',
    tr: 'Maskeleme Modu',
  },
  fullRedaction: {
    en: 'Full Redaction',
    tr: 'Tam Redaksiyon',
  },
  stableAlias: {
    en: 'Stable Alias',
    tr: 'Sabit Alias (Maskeleme)',
  },
  exportSecureLog: {
    en: 'Export Secure Log',
    tr: 'Güvenli Dosyayı Kaydet',
  },
  exporting: {
    en: 'Exporting...',
    tr: 'Dışa aktarılıyor...',
  },
  securityNote: {
    en: '🔒 All operations are performed locally. Your logs are never uploaded to the cloud.',
    tr: '🔒 Tüm işlemler yerel olarak yapılır. Loglarınız asla buluta yüklenmez.',
  },
  noFileSelected: {
    en: 'No file selected.',
    tr: 'Dosya seçilmedi.',
  },
  exportSuccess: {
    en: 'Export completed successfully.',
    tr: 'Dışa aktarma başarılı.',
  },
  maskedItems: {
    en: 'Masked items',
    tr: 'Maskelenen bulgu',
  },
  riskScore: {
    en: 'Risk score',
    tr: 'Risk skoru',
  },
  outputPath: {
    en: 'Output path',
    tr: 'Çıktı yolu',
  },
  cannotOverwrite: {
    en: 'Original file cannot be overwritten.',
    tr: 'Orijinal dosyanın üzerine yazılamaz.',
  },
  invalidPath: {
    en: 'Export path is invalid.',
    tr: 'Dışa aktarma yolu geçersiz.',
  },
  exportFailed: {
    en: 'Export failed. Please try again.',
    tr: 'Dışa aktarma başarısız. Lütfen tekrar deneyin.',
  },

  riskCritical: {
    en: 'Credentials or database connection strings detected.',
    tr: 'Kritik kimlik bilgileri veya veritabanı bağlantıları saptandı.',
  },
  riskHigh: {
    en: 'Tokens or authorization data detected.',
    tr: 'Erişim anahtarları veya yetkilendirme verileri saptandı.',
  },
  riskMedium: {
    en: 'Personal identifiers detected.',
    tr: 'Kişisel tanımlayıcılar tespit edildi.',
  },
  riskLow: {
    en: 'Network identifiers detected.',
    tr: 'Ağ tanımlayıcıları tespit edildi.',
  },
  riskNone: {
    en: 'No significant risk detected.',
    tr: 'Önemli risk tespit edilmedi.',
  },

  analysisSuccess: {
    en: 'findings',
    tr: 'bulgu saptandı',
  },
  analysisFailed: {
    en: 'Analysis failed',
    tr: 'Analiz başarısız',
  },
  previewFailed: {
    en: 'Failed to update preview',
    tr: 'Önizleme güncellenemedi',
  },
  onlySupported: {
    en: 'Only .txt and .log files are supported.',
    tr: 'Yalnızca .txt ve .log dosyaları desteklenir.',
  },

  riskLOW: { en: 'LOW', tr: 'DÜŞÜK' },
  riskMEDIUM: { en: 'MEDIUM', tr: 'ORTA' },
  riskHIGH: { en: 'HIGH', tr: 'YÜKSEK' },
  riskCRITICAL: { en: 'CRITICAL', tr: 'KRİTİK' },

  original: {
    en: 'Original',
    tr: 'Orijinal',
  },
  raw: {
    en: 'Raw',
    tr: 'Ham Veri',
  },
  sanitized: {
    en: 'Sanitized Preview',
    tr: 'Temizlenmiş Önizleme',
  },
  masked: {
    en: 'Masked',
    tr: 'Maskelendi',
  },

  catEmail: { en: 'Email Addresses', tr: 'E-posta Adresleri' },
  catIpv4: { en: 'IPv4 Addresses', tr: 'IPv4 Adresleri' },
  catIpv6: { en: 'IPv6 Addresses', tr: 'IPv6 Adresleri' },
  catJwt: { en: 'JWT Tokens', tr: 'JWT Tokenları' },
  catAuthHeader: { en: 'Authorization Headers', tr: 'Yetkilendirme Başlıkları' },
  catBearerToken: { en: 'Bearer Tokens', tr: 'Bearer Tokenları' },
  catPasswordField: { en: 'Password / Secret Fields', tr: 'Şifre / Gizli Alanlar' },
  catApiKeyLike: { en: 'API Key-like Values', tr: 'API Anahtarı Benzeri Değerler' },
  catUrlSensitiveParam: { en: 'URL Sensitive Parameters', tr: 'URL Hassas Parametreleri' },
  catDbConnection: { en: 'Database Connection Strings', tr: 'Veritabanı Bağlantı Dizileri' },
};

const CATEGORY_KEYS: Record<string, string> = {
  'email': 'catEmail',
  'ipv4': 'catIpv4',
  'ipv6': 'catIpv6',
  'jwt': 'catJwt',
  'auth_header': 'catAuthHeader',
  'bearer_token': 'catBearerToken',
  'password_field': 'catPasswordField',
  'api_key_like': 'catApiKeyLike',
  'url_sensitive_param': 'catUrlSensitiveParam',
  'db_connection': 'catDbConnection',
};

export function getCategoryLabel(catId: string, lang: Language): string {
  const key = CATEGORY_KEYS[catId];
  if (key && t[key]) return t[key][lang];
  
  return catId.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}
