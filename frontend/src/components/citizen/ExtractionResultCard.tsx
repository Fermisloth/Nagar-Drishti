import React from 'react';
import { Sparkles, MapPin, Tag, AlertTriangle, FileText, CheckCircle2 } from 'lucide-react';
import { NeoCard } from '../common/NeoCard';
import { NeoBadge } from '../common/NeoBadge';

interface ExtractionMetadata {
  department?: string;
  issue_type?: string;
  priority?: string;
  location?: string;
  summary?: string;
}

interface ExtractionResultCardProps {
  metadata: ExtractionMetadata;
  rawText: string;
}

export const ExtractionResultCard: React.FC<ExtractionResultCardProps> = ({ metadata, rawText }) => {
  const priorityVariant = 
    metadata.priority?.toLowerCase() === 'emergency' ? 'rose' :
    metadata.priority?.toLowerCase() === 'high' ? 'amber' : 'lime';

  return (
    <NeoCard variant="cyan" style={{ marginTop: '1.5rem', background: '#121e28' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '2px solid var(--accent-ai)', paddingBottom: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Sparkles style={{ color: 'var(--accent-ai)' }} size={20} />
          <h3 style={{ color: 'var(--accent-ai)', fontSize: '1.1rem' }}>GEMINI 1.5 FLASH EXTRACTION RESULT</h3>
        </div>
        <NeoBadge variant="lime">
          <CheckCircle2 size={12} /> PARSED & VALIDATED
        </NeoBadge>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
        <div>
          <span className="neo-stat-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Tag size={12} /> DEPARTMENT
          </span>
          <NeoBadge variant="cyan">{metadata.department || 'General Municipal'}</NeoBadge>
        </div>

        <div>
          <span className="neo-stat-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Tag size={12} /> ISSUE TYPE
          </span>
          <NeoBadge variant="purple">{metadata.issue_type || 'Unclassified'}</NeoBadge>
        </div>

        <div>
          <span className="neo-stat-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <AlertTriangle size={12} /> PRIORITY LEVEL
          </span>
          <NeoBadge variant={priorityVariant}>{metadata.priority || 'MEDIUM'}</NeoBadge>
        </div>

        <div>
          <span className="neo-stat-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <MapPin size={12} /> EXTRACTED LOCATION
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
            {metadata.location || 'Location Not Specified'}
          </span>
        </div>
      </div>

      {metadata.summary && (
        <div style={{ background: 'var(--bg-dark)', padding: '0.75rem 1rem', border: '2px solid var(--border-color)', marginBottom: '1rem' }}>
          <span className="neo-stat-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <FileText size={12} /> AI GENERATED EXECUTIVE SUMMARY
          </span>
          <p style={{ fontSize: '0.9rem', color: '#e4e4e7', fontStyle: 'italic' }}>
            "{metadata.summary}"
          </p>
        </div>
      )}

      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
        Raw Citizen Text: "{rawText}"
      </div>
    </NeoCard>
  );
};
