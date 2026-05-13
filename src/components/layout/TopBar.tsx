import { useSettingsStore } from '../../stores/settingsStore';
import { useAnalysisStore } from '../../stores/analysisStore';
import { t } from '../../i18n';
import { open } from '@tauri-apps/plugin-dialog';
import { analyzeFile } from '../../hooks/useTauri';
import { useToastStore } from '../common/Toast';

export function TopBar() {
  const { theme, setTheme, language, setLanguage } = useSettingsStore();
  const {
    analysisResult,
    fileName,
    fileSizeBytes,
    setIsAnalyzing,
    setFilePath,
    setAnalysisResult,
    setError
  } = useAnalysisStore();
  const toast = useToastStore();

  const handleNewFile = async () => {
    const selected = await open({
      filters: [{ name: 'Log Files', extensions: ['log', 'txt'] }],
      multiple: false,
    });

    if (typeof selected === 'string') {
      setIsAnalyzing(true);
      setError(null);
      setFilePath(selected);

      try {
        const settings = useSettingsStore.getState().getSettingsForRust();
        const result = await analyzeFile(selected, settings);
        setAnalysisResult(result);
        toast.add('success', `${result.file_name} — ${result.findings.length} ${t.analysisSuccess[language]}`);
      } catch (err) {
        const msg = String(err);
        setError(msg);
        toast.add('error', `${t.analysisFailed[language]}: ${msg}`);
      } finally {
        setIsAnalyzing(false);
      }
    }
  };

  const nextTheme = theme === 'dark' ? 'light' : 'dark';

  const themeIcon = theme === 'dark' ? (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M14.3 9.3C13.1 12.1 10.2 14 7 13.5C3.7 13 1.2 10.1 1 6.8C0.9 4.5 1.9 2.4 3.5 1.1C3.8 0.9 4.2 1.1 4.2 1.5C4.1 1.8 4 2.1 4 2.5C4 5.3 6.2 7.5 9 7.5C10.4 7.5 11.7 6.9 12.6 5.9C12.9 5.6 13.4 5.7 13.5 6.1C13.9 7.1 14.2 8.2 14.3 9.3Z" fill="currentColor" />
    </svg>
  ) : (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 1V2.5M8 13.5V15M1 8H2.5M13.5 8H15M3.05 3.05L4.1 4.1M11.9 11.9L12.95 12.95M12.95 3.05L11.9 4.1M4.1 11.9L3.05 12.95" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );

  function formatBytes(b: number) {
    if (b < 1024) return `${b} B`;
    if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
    return `${(b / 1024 / 1024).toFixed(1)} MB`;
  }

  return (
    <header className="topbar">

      <div className="topbar__logo">
        <div className="topbar__logo-icon" style={{ background: 'transparent', width: '36px', height: '40px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="32" height="36" viewBox="0 0 24 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 0L0 4.5V13.5C0 21 5 26.5 12 28C19 26.5 24 21 24 13.5V4.5L12 0Z" fill="url(#paint0_linear)" />
            <path d="M12 3.5L3 6.875V13.5C3 19.125 6.75 23.25 12 24.375C17.25 23.25 21 19.125 21 13.5V6.875L12 3.5Z" fill="white" fillOpacity="0.1" />
            <path d="M12 1.5V26.5C18.25 25 22.5 19.5 22.5 13.5V5.5L12 1.5Z" fill="white" fillOpacity="0.2" />
            <defs>
              <linearGradient id="paint0_linear" x1="12" y1="0" x2="12" y2="28" gradientUnits="userSpaceOnUse">
                <stop stopColor="#2563EB" />
                <stop offset="1" stopColor="#60A5FA" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="topbar__title" style={{
            fontSize: '20px',
            fontWeight: 500,
            display: 'flex',
            gap: '4px',
            alignItems: 'center',
            letterSpacing: '-0.02em',
            fontFamily: "'Google Sans', 'Product Sans', 'Outfit', sans-serif"
          }}>
            <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>LogShield</span>
            <span style={{
              background: 'linear-gradient(135deg, #2563EB, #7C3AED, #DB2777)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 600,
              marginLeft: '2px'
            }}>
              Studio
            </span>
          </div>
          {!analysisResult && (
            <div className="topbar__slogan" style={{ fontWeight: 500, fontSize: '12.5px', marginTop: '-2px' }}>{t.slogan[language]}</div>
          )}
        </div>
      </div>

      {analysisResult && (
        <>
          <span className="file-bar__sep" style={{ marginLeft: 8 }}>|</span>
          <span
            className="file-bar__name"
            title={fileName ?? ''}
            style={{ marginLeft: 4, fontSize: 13 }}
          >
            {fileName}
          </span>
          {fileSizeBytes != null && (
            <span className="text-secondary text-sm">
              {formatBytes(fileSizeBytes)}
            </span>
          )}
        </>
      )}

      <div className="topbar__spacer" />

      <div className="topbar__actions">

        <button
          className="btn-icon"
          onClick={() => setLanguage(language === 'en' ? 'tr' : 'en')}
          style={{
            fontSize: '11px',
            fontWeight: 700,
            padding: '4px 8px',
            borderRadius: '4px',
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border)',
            minWidth: '32px'
          }}
          title={language === 'en' ? 'Türkçe\'ye geç' : 'Switch to English'}
        >
          {language.toUpperCase()}
        </button>

        <button
          className="btn-icon"
          title={`Switch to ${nextTheme} theme`}
          onClick={() => setTheme(nextTheme)}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          {themeIcon}
        </button>

        {analysisResult && (
          <button
            className="btn btn-ghost"
            onClick={handleNewFile}
            title={t.newFile[language]}
          >
            {t.newFile[language]}
          </button>
        )}
      </div>
    </header>
  );
}
