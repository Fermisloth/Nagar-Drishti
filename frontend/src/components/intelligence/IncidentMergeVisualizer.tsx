import React from 'react';
import { Layers, ArrowRightLeft } from 'lucide-react';
import { NeoCard } from '../common/NeoCard';
import { NeoBadge } from '../common/NeoBadge';

export const IncidentMergeVisualizer: React.FC = () => {
  return (
    <NeoCard variant="cyan" style={{ marginTop: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', borderBottom: '2px solid var(--border-color)', paddingBottom: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ArrowRightLeft style={{ color: 'var(--accent-ai)' }} size={22} />
          <h3>SIDE-BY-SIDE REPLICA COMPARISON & DEDUPLICATION PROOF</h3>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <NeoBadge variant="demo">DECISION ENGINE DEMO TRACE</NeoBadge>
          <NeoBadge variant="cyan">EXPLAINABLE AI ENGINE</NeoBadge>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
        {/* Report A */}
        <div className="neo-card" style={{ background: 'var(--bg-dark)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <NeoBadge variant="yellow">COMPLAINT #COMP-341</NeoBadge>
            <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>Citizen Input (Hindi/Eng)</span>
          </div>
          <p style={{ fontSize: '0.9rem', fontStyle: 'italic', marginBottom: '0.75rem' }}>
            "Sector 15 main road par water pipeline burst ho gayi hai, fast water leak everywhere."
          </p>
          <div style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', background: 'var(--bg-surface)', padding: '0.5rem' }}>
            <div>Extracted Dept: <strong>Water Supply</strong></div>
            <div>Geo-Vector: <strong>[28.6139, 77.2090]</strong></div>
          </div>
        </div>

        {/* Report B */}
        <div className="neo-card" style={{ background: 'var(--bg-dark)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <NeoBadge variant="cyan">COMPLAINT #COMP-348</NeoBadge>
            <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>Citizen Input (English)</span>
          </div>
          <p style={{ fontSize: '0.9rem', fontStyle: 'italic', marginBottom: '0.75rem' }}>
            "Severe water logging outside Sector 15 market entrance due to broken underground pipe."
          </p>
          <div style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', background: 'var(--bg-surface)', padding: '0.5rem' }}>
            <div>Extracted Dept: <strong>Water Supply</strong></div>
            <div>Geo-Vector: <strong>[28.6141, 77.2092]</strong></div>
          </div>
        </div>
      </div>

      {/* Merge Result Output */}
      <div style={{ marginTop: '1.25rem', background: '#1c2e14', padding: '1rem', border: '2px solid var(--accent-success)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-success)', fontWeight: 800 }}>
            <Layers size={18} />
            <span>SEMANTIC SIMILARITY SCORE: 0.94 (COSINE MATCH)</span>
          </div>
          <p style={{ fontSize: '0.85rem', color: '#d9f99d', marginTop: '0.25rem' }}>
            Decision Engine automatically linked both reports into <strong>Master Incident #INC-42</strong>. Ticket clutter reduced by 50%.
          </p>
        </div>

        <NeoBadge variant="lime" style={{ fontSize: '0.85rem' }}>
          7.47x CITY COMPRESSION ACHIEVED
        </NeoBadge>
      </div>
    </NeoCard>
  );
};
