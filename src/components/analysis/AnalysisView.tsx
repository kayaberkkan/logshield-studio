import { SplitView } from './SplitView';
import { DetectionPanel } from './DetectionPanel';
import { useAnalysisStore } from '../../stores/analysisStore';
import { useSettingsStore } from '../../stores/settingsStore';
import { t } from '../../i18n';

export function AnalysisView() {
  const { language } = useSettingsStore();
  const { reset } = useAnalysisStore();

  const handleClose = () => {
    reset();
  };

  return (
    <div className="analysis-layout">
      
      <div className="analysis-layout__header">
        <button className="btn btn-secondary" onClick={handleClose}>
          {t.closeFile[language]}
        </button>
        <div style={{ flex: 1 }}></div>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
          {t.previewWarning[language]}
        </div>
      </div>

      <div className="analysis-layout__body">
        
        <div className="analysis-layout__main">
          <SplitView />
        </div>
        
        <div className="analysis-layout__sidebar">
          <DetectionPanel />
        </div>
      </div>
    </div>
  );
}
