import React from 'react';
import { NeoBadge, type NeoBadgeVariant } from './NeoBadge';

interface NeoStatBoxProps {
  label: string;
  value: string | number;
  subtext?: string;
  badgeText?: string;
  badgeVariant?: NeoBadgeVariant;
  accentColor?: string;
}

export const NeoStatBox: React.FC<NeoStatBoxProps> = ({
  label,
  value,
  subtext,
  badgeText,
  badgeVariant = 'cyan',
  accentColor
}) => {
  return (
    <div className="neo-stat-box" style={{ borderColor: accentColor || 'var(--border-color)' }}>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <span className="neo-stat-label">{label}</span>
          {badgeText && <NeoBadge variant={badgeVariant}>{badgeText}</NeoBadge>}
        </div>
        <div className="neo-stat-value" style={{ color: accentColor || 'var(--text-main)' }}>
          {value}
        </div>
      </div>
      {subtext && (
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.75rem', fontFamily: 'var(--font-mono)' }}>
          {subtext}
        </div>
      )}
    </div>
  );
};
