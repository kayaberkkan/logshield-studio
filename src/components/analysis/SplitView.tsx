import { useState, useRef, useEffect } from 'react';
import { useAnalysisStore } from '../../stores/analysisStore';
import { useSettingsStore } from '../../stores/settingsStore';
import { t } from '../../i18n';

export function SplitView() {
  const analysisResult = useAnalysisStore((s) => s.analysisResult);
  const { language } = useSettingsStore();

  const [leftWidth, setLeftWidth] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const newWidth = ((e.clientX - rect.left) / rect.width) * 100;
      
      if (newWidth > 10 && newWidth < 90) {
        setLeftWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.body.style.cursor = 'default';
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    document.body.style.cursor = 'col-resize';

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'default';
    };
  }, [isDragging]);

  if (!analysisResult) return null;

  const { preview } = analysisResult;

  return (
    <div className="split-view" ref={containerRef}>
      
      <div className="split-view__pane" style={{ flex: `0 0 ${leftWidth}%` }}>
        <div className="split-view__header">
          <h3>{t.original[language]}</h3>
          <span className="split-view__badge">{t.raw[language]}</span>
        </div>
        <div className="split-view__content">
          <div className="code-block">
            {preview.lines.map((line) => (
              <div key={`orig-${line.line_number}`} className="code-line">
                <span className="code-line__num">{line.line_number}</span>
                <span className={`code-line__text ${line.has_findings ? 'has-finding' : ''}`}>
                  {line.original_display}
                </span>
              </div>
            ))}
            {preview.is_truncated && (
              <div className="code-line is-truncated">
                <span className="code-line__num">...</span>
                <span className="code-line__text">{t.previewWarning[language]}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div 
        className={`split-view__resizer ${isDragging ? 'is-dragging' : ''}`}
        onMouseDown={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
      />

      <div className="split-view__pane split-view__pane--safe" style={{ flex: 1, borderRight: 'none' }}>
        <div className="split-view__header">
          <h3>{t.sanitized[language]}</h3>
          <span className="split-view__badge split-view__badge--safe">{t.masked[language]}</span>
        </div>
        <div className="split-view__content">
          <div className="code-block">
            {preview.lines.map((line) => {
              
              const maskRegex = /(\[REDACTED_[A-Z0-9_]+\]|\[[A-Z0-9_]+_\d+\])/g;
              const parts = line.sanitized.split(maskRegex);
              
              return (
                <div key={`san-${line.line_number}`} className="code-line">
                  <span className="code-line__num">{line.line_number}</span>
                  <span className="code-line__text">
                    {parts.map((part, i) => {
                      
                      if (part.match(/^(\[REDACTED_[A-Z0-9_]+\]|\[[A-Z0-9_]+_\d+\])$/)) {
                        return <mark key={i} className="mask-highlight-green">{part}</mark>;
                      }
                      return <span key={i}>{part}</span>;
                    })}
                  </span>
                </div>
              );
            })}
            {preview.is_truncated && (
              <div className="code-line is-truncated">
                <span className="code-line__num">...</span>
                <span className="code-line__text">{t.previewWarning[language]}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
