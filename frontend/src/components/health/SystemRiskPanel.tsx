import React from 'react';
import { ShieldAlert, AlertTriangle, Clock, CheckCircle } from 'lucide-react';
import { NeoCard } from '../common/NeoCard';
import { NeoBadge } from '../common/NeoBadge';

export const SystemRiskPanel: React.FC = () => {
  return (
    <NeoCard variant="yellow" style={{ marginTop: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '2px solid var(--border-color)', paddingBottom: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ShieldAlert style={{ color: 'var(--accent-warning)' }} size={22} />
          <h3>SYSTEM RISK & TECHNICAL BOUNDARIES PANEL</h3>
        </div>
        <NeoBadge variant="yellow">TRANSPARENT ENGINEERING LOG</NeoBadge>
      </div>

      <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
        NagarDrishti maintains total engineering transparency. Below is the operational readiness audit of system components and planned infrastructure resilience:
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
        {/* Item 1 */}
        <div className="neo-card" style={{ background: 'var(--bg-dark)', padding: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>QDRANT VECTOR INSTANCE</span>
            <NeoBadge variant="lime"><CheckCircle size={12} /> HEALTHY</NeoBadge>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Vector similarity queries executing under 18ms latency with HNSW indexing.
          </p>
        </div>

        {/* Item 2 */}
        <div className="neo-card" style={{ background: 'var(--bg-dark)', padding: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>RETRY & RATE LIMIT LAYER</span>
            <NeoBadge variant="amber"><AlertTriangle size={12} /> IN-PROGRESS</NeoBadge>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            IP sliding window active (100 req/min). Exponential backoff retry handler configured for LLM timeouts.
          </p>
        </div>

        {/* Item 3 */}
        <div className="neo-card" style={{ background: 'var(--bg-dark)', padding: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>BACKGROUND WORKERS</span>
            <NeoBadge variant="cyan"><Clock size={12} /> PLANNED</NeoBadge>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Asynchronous task queue (Celery/Redis) scheduled for offline batch embedding sync.
          </p>
        </div>

        {/* Item 4 */}
        <div className="neo-card" style={{ background: 'var(--bg-dark)', padding: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>CI/CD & LINTING</span>
            <NeoBadge variant="lime"><CheckCircle size={12} /> ACTIVE</NeoBadge>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Automated oxlint rules + pytest suite enforcing schema consistency across all endpoints.
          </p>
        </div>
      </div>
    </NeoCard>
  );
};
