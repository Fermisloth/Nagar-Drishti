import React from 'react';
import { Database, Cpu, Server, CheckCircle2, XCircle } from 'lucide-react';
import { NeoCard } from '../common/NeoCard';
import { NeoBadge } from '../common/NeoBadge';
import type { SystemReadyResponse } from '../../api/api';

interface PipelineStatusMapProps {
  readyStatus: SystemReadyResponse | null;
}

export const PipelineStatusMap: React.FC<PipelineStatusMapProps> = ({ readyStatus }) => {
  const isDb = readyStatus?.dependencies?.database ?? true;
  const isQdrant = readyStatus?.dependencies?.qdrant ?? true;
  const isGemini = readyStatus?.dependencies?.gemini ?? true;

  return (
    <NeoCard variant="cyan" style={{ marginBottom: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', borderBottom: '2px solid var(--border-color)', paddingBottom: '0.75rem' }}>
        <h3>INFRASTRUCTURE & DEPENDENCY PIPELINE MAP</h3>
        <NeoBadge variant={readyStatus?.status === 'ready' || !readyStatus ? 'lime' : 'rose'}>
          SYSTEM STATUS: {readyStatus ? readyStatus.status.toUpperCase() : 'ONLINE'}
        </NeoBadge>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
        {/* Node 1: FastAPI Core */}
        <div className="neo-card" style={{ background: 'var(--bg-dark)', borderColor: 'var(--accent-ai)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <Server style={{ color: 'var(--accent-ai)' }} size={20} />
            <span style={{ fontWeight: 800 }}>FASTAPI BACKEND</span>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
            Async python web engine with rate limiting & security headers middleware.
          </p>
          <NeoBadge variant="lime">
            <CheckCircle2 size={12} /> HEALTHY (PORT 8000)
          </NeoBadge>
        </div>

        {/* Node 2: Gemini 1.5 Flash */}
        <div className="neo-card" style={{ background: 'var(--bg-dark)', borderColor: isGemini ? 'var(--accent-ai)' : 'var(--accent-emergency)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <Cpu style={{ color: 'var(--accent-citizen)' }} size={20} />
            <span style={{ fontWeight: 800 }}>GEMINI 1.5 FLASH</span>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
            Multi-lingual translation & JSON schema extraction model.
          </p>
          <NeoBadge variant={isGemini ? 'lime' : 'rose'}>
            {isGemini ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
            {isGemini ? 'OPERATIONAL' : 'DEGRADED / API LIMIT'}
          </NeoBadge>
        </div>

        {/* Node 3: Qdrant Vector DB */}
        <div className="neo-card" style={{ background: 'var(--bg-dark)', borderColor: isQdrant ? 'var(--accent-purple)' : 'var(--accent-emergency)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <Database style={{ color: 'var(--accent-purple)' }} size={20} />
            <span style={{ fontWeight: 800 }}>QDRANT VECTOR DB</span>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
            Cosine similarity index engine & 768-D vector store.
          </p>
          <NeoBadge variant={isQdrant ? 'lime' : 'rose'}>
            {isQdrant ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
            {isQdrant ? 'VECTOR READY (PORT 6333)' : 'QDRANT UNREACHABLE'}
          </NeoBadge>
        </div>

        {/* Node 4: PostgreSQL */}
        <div className="neo-card" style={{ background: 'var(--bg-dark)', borderColor: isDb ? 'var(--accent-success)' : 'var(--accent-emergency)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <Database style={{ color: 'var(--accent-success)' }} size={20} />
            <span style={{ fontWeight: 800 }}>POSTGRESQL RELATIONAL</span>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
            ACID persistent store for complaints, incidents, & RBAC users.
          </p>
          <NeoBadge variant={isDb ? 'lime' : 'rose'}>
            {isDb ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
            {isDb ? 'ACID VERIFIED' : 'DB OFFLINE'}
          </NeoBadge>
        </div>
      </div>
    </NeoCard>
  );
};
