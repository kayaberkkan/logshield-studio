import { useCallback, useState } from 'react';
import { open } from '@tauri-apps/plugin-dialog';
import { analyzeFile } from '../../hooks/useTauri';
import { useAnalysisStore } from '../../stores/analysisStore';
import { useToastStore } from '../common/Toast';
import { useSettingsStore } from '../../stores/settingsStore';
import { t } from '../../i18n';

const ShieldIcon = ({ size = 72, animate = false }: { size?: number; animate?: boolean }) => (
  <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={animate ? 'shield-spin' : ''}>
    <defs>
      <linearGradient id="shieldGradMain" x1="40" y1="4" x2="40" y2="76" gradientUnits="userSpaceOnUse">
        <stop stopColor="#60A5FA" />
        <stop offset="0.5" stopColor="#818CF8" />
        <stop offset="1" stopColor="#A78BFA" />
      </linearGradient>
      <linearGradient id="shieldGradInner" x1="40" y1="14" x2="40" y2="68" gradientUnits="userSpaceOnUse">
        <stop stopColor="#3B82F6" />
        <stop offset="1" stopColor="#6366F1" />
      </linearGradient>
      <filter id="shieldGlow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="6" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
    
    <circle cx="40" cy="40" r="38" fill="none" stroke="url(#shieldGradMain)" strokeWidth="1" opacity="0.3" />
    
    <path d="M40 8L12 18V38C12 56 24 70 40 74C56 70 68 56 68 38V18L40 8Z" fill="url(#shieldGradMain)" filter="url(#shieldGlow)" />
    
    <path d="M40 14L18 22V38C18 52.5 28 64.5 40 68C52 64.5 62 52.5 62 38V22L40 14Z" fill="url(#shieldGradInner)" />
    
    <path d="M40 14V68C52 64.5 62 52.5 62 38V22L40 14Z" fill="white" fillOpacity="0.08" />
    
    <rect x="33" y="36" width="14" height="12" rx="2" fill="white" fillOpacity="0.9" />
    <path d="M36 36V32C36 29.8 37.8 28 40 28C42.2 28 44 29.8 44 32V36" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.9" />
    <circle cx="40" cy="42" r="1.5" fill="#6366F1" />
  </svg>
);

const FeatureItem = ({ icon, text }: { icon: string; text: string }) => (
  <div className="dropzone-feature">
    <span className="dropzone-feature__icon">{icon}</span>
    <span className="dropzone-feature__text">{text}</span>
  </div>
);

import { useEffect } from 'react';
import { getCurrentWindow } from '@tauri-apps/api/window';

export function DropZone() {
  const [isDragOver, setIsDragOver] = useState(false);
  const { language } = useSettingsStore();
  const { isAnalyzing, setIsAnalyzing, setFilePath, setAnalysisResult, setError } =
    useAnalysisStore();
  const toast = useToastStore();

  const handleFile = useCallback(
    async (path: string) => {
      const ext = path.split('.').pop()?.toLowerCase();
      if (ext !== 'txt' && ext !== 'log') {
        toast.add('error', t.onlySupported[language]);
        return;
      }

      setIsAnalyzing(true);
      setError(null);
      setFilePath(path);

      try {
        const settings = useSettingsStore.getState().getSettingsForRust();
        const result = await analyzeFile(path, settings);
        setAnalysisResult(result);
        toast.add('success', `${result.file_name} — ${result.findings.length} ${t.analysisSuccess[language]}`);
      } catch (err) {
        const msg = String(err);
        setError(msg);
        toast.add('error', `${t.analysisFailed[language]}: ${msg}`);
      } finally {
        setIsAnalyzing(false);
      }
    },
    [setIsAnalyzing, setFilePath, setAnalysisResult, setError, toast, language],
  );

  useEffect(() => {
    let unlisten: (() => void) | undefined;
    async function setupListener() {
      unlisten = await getCurrentWindow().onDragDropEvent((event) => {
        if (event.payload.type === 'enter' || event.payload.type === 'over') {
          setIsDragOver(true);
        } else if (event.payload.type === 'drop') {
          setIsDragOver(false);
          const paths = event.payload.paths;
          if (paths && paths.length > 0) handleFile(paths[0]);
        } else if (event.payload.type === 'leave') {
          setIsDragOver(false);
        }
      });
    }
    setupListener();
    return () => {
      if (unlisten) unlisten();
    };
  }, [handleFile]);

  const handleBrowse = async () => {
    const selected = await open({
      filters: [{ name: 'Log Files', extensions: ['log', 'txt'] }],
      multiple: false,
    });
    if (typeof selected === 'string') {
      handleFile(selected);
    }
  };

  return (
    <div className="dropzone-page">
      <div
        className={`dropzone${isDragOver ? ' dropzone--active' : ''}${isAnalyzing ? ' dropzone--analyzing' : ''}`}
        onClick={!isAnalyzing ? handleBrowse : undefined}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && !isAnalyzing && handleBrowse()}
        aria-label="Drop log file or click to browse"
      >
        
        <div className="dropzone__rings">
          <div className="dropzone__ring dropzone__ring--1" />
          <div className="dropzone__ring dropzone__ring--2" />
          <div className="dropzone__ring dropzone__ring--3" />
        </div>

        <div className="dropzone__icon-wrap">
          <ShieldIcon size={72} animate={isAnalyzing} />
        </div>

        <div className="dropzone__title">
          {isAnalyzing ? t.analyzing[language] : t.dropTitle[language]}
        </div>

        <div className="dropzone__subtitle">
          {isAnalyzing
            ? t.scanning[language]
            : t.dropSubtitle[language]}
        </div>

        <div className="dropzone__formats">
          <span className="dropzone__formats-label">{t.supportedFiles[language]}</span>
          {['.log', '.txt'].map((f) => (
            <span key={f} className="format-badge">{f}</span>
          ))}
        </div>

        {!isAnalyzing && (
          <button
            className="btn btn-primary dropzone__btn"
            onClick={(e) => { e.stopPropagation(); handleBrowse(); }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ marginRight: 6 }}>
              <path d="M2 10V13C2 13.55 2.45 14 3 14H13C13.55 14 14 13.55 14 13V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M8 2V10M8 2L5 5M8 2L11 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {t.selectLogFile[language]}
          </button>
        )}
      </div>

      <div className="dropzone-features">
        <FeatureItem icon="🔒" text={t.featureLocal[language]} />
        <FeatureItem icon="🛡" text={t.featureContext[language]} />
      </div>
    </div>
  );
}
