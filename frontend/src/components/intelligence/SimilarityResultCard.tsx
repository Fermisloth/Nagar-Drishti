import React from 'react';
import { NeoBadge } from '../common/NeoBadge';

interface SimilarityResultCardProps {
  id: string;
  rawText: string;
  score: number; // e.g. 0.94
  threshold: number; // e.g. 0.82
}

export const SimilarityResultCard: React.FC<SimilarityResultCardProps> = ({
  id,
  rawText,
  score,
  threshold
}) => {
  const percentage = Math.round(score * 100);
  const exceedsThreshold = score >= threshold;

  return (
    <div className="neo-card" style={{ padding: '0.85rem 1rem', background: 'var(--bg-dark)', borderLeft: exceedsThreshold ? '4px solid var(--accent-success)' : '4px solid var(--border-light)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            REPORT #{id}
          </span>
          <NeoBadge variant="demo">ILLUSTRATIVE DEMO DATA</NeoBadge>
        </div>
        
        <NeoBadge variant={exceedsThreshold ? 'lime' : 'dark'}>
          COSINE: {score.toFixed(2)} ({percentage}%)
        </NeoBadge>
      </div>

      <p style={{ fontSize: '0.85rem', color: '#e4e4e7', marginBottom: '0.5rem', fontStyle: 'italic' }}>
        "{rawText}"
      </p>

      {/* Score Progress Bar */}
      <div style={{ background: 'var(--bg-surface)', height: '6px', border: '1px solid var(--border-color)', position: 'relative' }}>
        <div 
          style={{ 
            width: `${percentage}%`, 
            height: '100%', 
            background: exceedsThreshold ? 'var(--accent-success)' : 'var(--accent-ai)',
            transition: 'width 0.5s ease'
          }} 
        />
        {/* Cutoff Threshold marker line */}
        <div 
          style={{ 
            position: 'absolute', 
            left: `${threshold * 100}%`, 
            top: '-2px', 
            bottom: '-2px', 
            width: '2px', 
            background: 'var(--accent-emergency)' 
          }} 
          title={`Cosine Cutoff Threshold: ${threshold}`}
        />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
        <span>0.0</span>
        <span style={{ color: 'var(--accent-emergency)' }}>Cutoff: {threshold}</span>
        <span>1.0</span>
      </div>
    </div>
  );
};
