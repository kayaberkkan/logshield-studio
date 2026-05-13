import { useAnalysisStore } from '../../stores/analysisStore';
import { useSettingsStore } from '../../stores/settingsStore';
import { getSanitizedPreview, exportFile } from '../../hooks/useTauri';
import { useToastStore } from '../common/Toast';
import { save } from '@tauri-apps/plugin-dialog';
import { t, getCategoryLabel } from '../../i18n';
import { RiskBadge } from '../common/RiskBadge';
import type { Category } from '../../types';

export function DetectionPanel() {
  const { analysisResult, filePath, setAnalysisResult, isAnalyzing, setIsAnalyzing } = useAnalysisStore();
  const {
    enabledCategories,
    toggleCategory,
    maskMode,
    setMaskMode,
    getSettingsForRust,
    language
  } = useSettingsStore();
  const toast = useToastStore();

  if (!analysisResult) return null;

  const handleToggleCategory = async (category: Category) => {
    
    toggleCategory(category);

    if (!filePath) return;

    setIsAnalyzing(true);
    
    try {
      
      const updatedCategories = enabledCategories.includes(category)
        ? enabledCategories.filter(c => c !== category)
        : [...enabledCategories, category];

      const newPreview = await getSanitizedPreview(filePath, {
        enabled_categories: updatedCategories,
        mask_mode: maskMode
      });

      setAnalysisResult({
        ...analysisResult,
        preview: newPreview
      });
    } catch (err) {
      toast.add('error', `${t.previewFailed[language]}: ${err}`);
      
      toggleCategory(category);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleModeChange = async (mode: 'FullRedaction' | 'StableAlias') => {
    setMaskMode(mode);

    if (!filePath) return;

    setIsAnalyzing(true);
    try {
      const newPreview = await getSanitizedPreview(filePath, {
        enabled_categories: enabledCategories,
        mask_mode: mode
      });

      setAnalysisResult({
        ...analysisResult,
        preview: newPreview
      });
    } catch (err) {
      toast.add('error', `${t.previewFailed[language]}: ${err}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleExport = async () => {
    if (!filePath) return;

    const defaultName = filePath.replace(/(\.[\w\d_-]+)$/i, '_sanitized$1');
    const selected = await save({
      defaultPath: defaultName,
      filters: [{ name: 'Log Files', extensions: ['log', 'txt'] }]
    });

    if (!selected) {
      toast.add('error', t.noFileSelected[language]);
      return;
    }

    setIsAnalyzing(true);
    try {
      const result = await exportFile(filePath, selected, getSettingsForRust());
      if (result.success) {
        const riskLabel = t[`risk${analysisResult.risk_score.toUpperCase()}`]?.[language] || analysisResult.risk_score;
        toast.add('success', `${t.exportSuccess[language]}\n${t.maskedItems[language]}: ${analysisResult.findings.length}\n${t.riskScore[language]}: ${riskLabel}\n${t.outputPath[language]}: ${result.output_path}`);
      }
    } catch (err) {
      const msg = String(err);
      if (msg.includes("Original file cannot be overwritten")) {
        toast.add('error', t.cannotOverwrite[language]);
      } else if (msg.includes("Invalid export extension") || msg.includes("DestNotWritable")) {
        toast.add('error', t.invalidPath[language]);
      } else {
        toast.add('error', t.exportFailed[language]);
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  const categories = Object.entries(analysisResult.category_counts).map(([cat, count]) => ({
    id: cat,
    count
  })).sort((a, b) => b.count - a.count);

  const getRiskDescription = (score: string) => {
    switch (score) {
      case 'CRITICAL': return t.riskCritical[language];
      case 'HIGH': return t.riskHigh[language];
      case 'MEDIUM': return t.riskMedium[language];
      case 'LOW': return t.riskLow[language];
      default: return t.riskNone[language];
    }
  };

  return (
    <div className="detection-panel">
      <div className="panel-section">
        <h3 className="sidebar__label">{t.riskAssessment[language]}</h3>
        <div className="risk-card">
          <div className="risk-card__header">
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>{t.fileRiskLevel[language]}</span>
            <RiskBadge score={analysisResult.risk_score.toUpperCase() as any} />
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.4, marginBottom: '8px' }}>
            {language === 'en' ? 'Found' : 'Toplam'} <strong style={{ color: 'var(--text-primary)' }}>{analysisResult.findings.length}</strong> {t.foundItems[language]} {t.across[language]} <strong style={{ color: 'var(--text-primary)' }}>{categories.length}</strong> {t.categories[language]}.
          </p>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0, fontStyle: 'italic' }}>
            {getRiskDescription(analysisResult.risk_score.toUpperCase())}
          </p>
        </div>
      </div>

      <div className="panel-section">
        <h3 className="sidebar__label">{t.detectedDataTypes[language]}</h3>
        <div className="detection-list">
          {categories.map((cat) => {
            const catId = cat.id as Category;
            return (
              <label key={catId} className={`detection-item ${enabledCategories.includes(catId) ? 'is-active' : ''}`}>
                <input
                  type="checkbox"
                  className="detection-item__check"
                  checked={enabledCategories.includes(catId)}
                  onChange={() => handleToggleCategory(catId)}
                />
                <div className="detection-item__info">
                  <span className="detection-item__label">
                    {getCategoryLabel(catId, language)}
                  </span>
                </div>
                <span className="detection-item__count">{cat.count}</span>
              </label>
            );
          })}
          {categories.length === 0 && (
            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', padding: '10px', textAlign: 'center', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-sm)' }}>
              {t.noSensitiveData[language]}
            </div>
          )}
        </div>
      </div>

      <div className="panel-section">
        <h3 className="sidebar__label">{t.maskingMode[language]}</h3>
        <div className="mask-mode-toggle">
          <label className={`mask-mode-option ${maskMode === 'FullRedaction' ? 'active' : ''}`}>
            <input
              type="radio"
              name="maskMode"
              value="FullRedaction"
              checked={maskMode === 'FullRedaction'}
              onChange={() => handleModeChange('FullRedaction')}
            />
            <div className="mask-mode-info">
              <strong>{t.fullRedaction[language]}</strong>
              <span>[REDACTED_EMAIL]</span>
            </div>
          </label>
          <label className={`mask-mode-option ${maskMode === 'StableAlias' ? 'active' : ''}`}>
            <input
              type="radio"
              name="maskMode"
              value="StableAlias"
              checked={maskMode === 'StableAlias'}
              onChange={() => handleModeChange('StableAlias')}
            />
            <div className="mask-mode-info">
              <strong>{t.stableAlias[language]}</strong>
              <span>[EMAIL_1], [EMAIL_2]</span>
            </div>
          </label>
        </div>
      </div>

      <div className="panel-section" style={{ borderBottom: 'none', marginTop: 'auto', paddingBottom: '0' }}>
        <button
          className="btn btn-primary"
          style={{ width: '100%', display: 'flex', justifyContent: 'center', marginBottom: '16px' }}
          onClick={handleExport}
          disabled={isAnalyzing}
        >
          {isAnalyzing ? t.exporting[language] : t.exportSecureLog[language]}
        </button>

        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', lineHeight: 1.5 }}>
          <div style={{ marginBottom: '8px', color: 'var(--text-secondary)' }}>
            {t.securityNote[language]}
          </div>
        </div>
      </div>
    </div>
  );
}
