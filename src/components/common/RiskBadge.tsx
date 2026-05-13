import type { RiskScore } from '../../types';
import { useSettingsStore } from '../../stores/settingsStore';
import { t } from '../../i18n';

interface Props {
  score: RiskScore;
  showIcon?: boolean;
}

export function RiskBadge({ score, showIcon = true }: Props) {
  const language = useSettingsStore(s => s.language);
  const scoreKey = score.toUpperCase();
  
  const label = t[`risk${scoreKey}`]?.[language] || 
                t[`risk${score.charAt(0).toUpperCase()}${score.slice(1).toLowerCase()}`]?.[language] || 
                scoreKey;

  return (
    <span className={`risk-badge risk-badge--${scoreKey}`}>
      {showIcon && <div className={`severity-dot severity-dot--${scoreKey}`} />}
      {label}
    </span>
  );
}
