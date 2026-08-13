import React from 'react';
import { ArrowDown, Sparkles, Database, CheckSquare, Layers, FileText } from 'lucide-react';
import { NeoBadge } from '../common/NeoBadge';

interface PipelineDecisionFlowProps {
  rawText: string;
  extractedDepartment: string;
  extractedPriority: string;
  matchedIncidentId: string;
  similarityScore: number;
}

export const PipelineDecisionFlow: React.FC<PipelineDecisionFlowProps> = ({
  rawText,
  extractedDepartment,
  extractedPriority,
  matchedIncidentId,
  similarityScore
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.85rem', maxWidth: '850px', margin: '0 auto' }}>
      {/* Node 1: Citizen Complaint */}
      <div className="neo-card neo-card-yellow" style={{ width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.35rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FileText size={16} style={{ color: 'var(--accent-citizen)' }} />
            <span style={{ fontWeight: 800 }}>STAGE 1: CITIZEN INGESTION</span>
          </div>
          <NeoBadge variant="live">LIVE INGESTION</NeoBadge>
        </div>
        <p style={{ fontWeight: 700, fontStyle: 'italic', fontSize: '0.92rem', marginBottom: '0.75rem' }}>"{rawText}"</p>
        
        {/* Explainability Metadata */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.5rem', background: 'var(--bg-dark)', padding: '0.5rem 0.75rem', border: '1px solid var(--border-light)', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>
          <div><span style={{ color: 'var(--text-muted)' }}>INPUT SOURCE:</span> Citizen Portal / API</div>
          <div><span style={{ color: 'var(--text-muted)' }}>PROCESSING:</span> Raw Text Normalization</div>
          <div><span style={{ color: 'var(--text-muted)' }}>OUTPUT:</span> Clean Complaint Payload</div>
        </div>
      </div>

      <ArrowDown size={22} style={{ color: 'var(--accent-citizen)' }} />

      {/* Node 2: Gemini 1.5 Flash Extraction */}
      <div className="neo-card neo-card-cyan" style={{ width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.35rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={16} style={{ color: 'var(--accent-ai)' }} />
            <span style={{ fontWeight: 800 }}>STAGE 2: GEMINI 1.5 FLASH EXTRACTION</span>
          </div>
          <NeoBadge variant="simulated">DEMO REASONING TRACE</NeoBadge>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', background: 'var(--bg-dark)', padding: '0.5rem', border: '1px solid var(--border-light)', marginBottom: '0.75rem' }}>
          <div>DEPT: <strong style={{ color: 'var(--accent-ai)' }}>{extractedDepartment}</strong></div>
          <div>URGENCY: <strong style={{ color: 'var(--accent-warning)' }}>{extractedPriority}</strong></div>
          <div>SCHEMA: <strong style={{ color: 'var(--accent-success)' }}>VALIDATED</strong></div>
        </div>

        {/* Explainability Metadata */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.5rem', background: 'var(--bg-dark)', padding: '0.5rem 0.75rem', border: '1px solid var(--border-light)', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>
          <div><span style={{ color: 'var(--text-muted)' }}>INPUT SOURCE:</span> Raw Complaint Text</div>
          <div><span style={{ color: 'var(--text-muted)' }}>PROCESSING:</span> Pydantic JSON Prompt Constraints</div>
          <div><span style={{ color: 'var(--text-muted)' }}>OUTPUT:</span> Structured JSON Entity Tags</div>
        </div>
      </div>

      <ArrowDown size={22} style={{ color: 'var(--accent-ai)' }} />

      {/* Node 3: Vector Embedding & Qdrant Search */}
      <div className="neo-card" style={{ width: '100%', borderColor: 'var(--accent-purple)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.35rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Database size={16} style={{ color: 'var(--accent-purple)' }} />
            <span style={{ fontWeight: 800 }}>STAGE 3: QDRANT VECTOR MATCHING</span>
          </div>
          <NeoBadge variant="purple">MODEL: text-embedding-004 (768-D)</NeoBadge>
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', background: 'var(--bg-dark)', padding: '0.5rem', border: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <span>COSINE SIMILARITY SCORE:</span>
          <strong style={{ color: 'var(--accent-success)' }}>{(similarityScore * 100).toFixed(1)}% ({similarityScore.toFixed(2)}) &gt; 0.82 THRESHOLD</strong>
        </div>

        {/* Explainability Metadata */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.5rem', background: 'var(--bg-dark)', padding: '0.5rem 0.75rem', border: '1px solid var(--border-light)', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>
          <div><span style={{ color: 'var(--text-muted)' }}>INPUT SOURCE:</span> Text Embedding Vector</div>
          <div><span style={{ color: 'var(--text-muted)' }}>PROCESSING:</span> HNSW Cosine Distance Index</div>
          <div><span style={{ color: 'var(--text-muted)' }}>OUTPUT:</span> Nearest Neighbor Incident Candidates</div>
        </div>
      </div>

      <ArrowDown size={22} style={{ color: 'var(--accent-purple)' }} />

      {/* Node 4: Decision Engine Checks */}
      <div className="neo-card" style={{ width: '100%', background: '#182413', border: '2px solid var(--accent-success)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.35rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckSquare size={16} style={{ color: 'var(--accent-success)' }} />
            <span style={{ fontWeight: 800, color: 'var(--accent-success)' }}>STAGE 4: CLUSTER DECISION ENGINE</span>
          </div>
          <NeoBadge variant="lime">3 RULE FILTERS MATCHED</NeoBadge>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: '#d9f99d', marginBottom: '0.75rem' }}>
          <div>✓ Dept Match</div>
          <div>✓ Geo-Proximity Match</div>
          <div>✓ Recency Window Match</div>
        </div>

        {/* Explainability Metadata */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.5rem', background: 'var(--bg-dark)', padding: '0.5rem 0.75rem', border: '1px solid var(--border-light)', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>
          <div><span style={{ color: 'var(--text-muted)' }}>INPUT SOURCE:</span> Candidate Matches & Geo-Data</div>
          <div><span style={{ color: 'var(--text-muted)' }}>PROCESSING:</span> Threshold & Spatial Rule Audit</div>
          <div><span style={{ color: 'var(--text-muted)' }}>OUTPUT:</span> Aggregation vs. Split Decision</div>
        </div>
      </div>

      <ArrowDown size={22} style={{ color: 'var(--accent-success)' }} />

      {/* Node 5: Master Incident Assignment */}
      <div className="neo-card" style={{ width: '100%', background: 'var(--accent-success)', color: '#000', textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
          <Layers size={22} />
          <h3 style={{ color: '#000', fontSize: '1.15rem' }}>RESULT: MERGED INTO MASTER INCIDENT {matchedIncidentId}</h3>
        </div>
      </div>
    </div>
  );
};
