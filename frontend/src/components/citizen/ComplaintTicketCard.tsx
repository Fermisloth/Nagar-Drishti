import React from 'react';
import { Layers, CheckCircle, Ticket, ArrowUpRight } from 'lucide-react';
import { NeoCard } from '../common/NeoCard';
import { NeoBadge } from '../common/NeoBadge';

interface ComplaintTicketCardProps {
  ticketId: string;
  incidentId: string | null;
  createdAt: string;
}

export const ComplaintTicketCard: React.FC<ComplaintTicketCardProps> = ({
  ticketId,
  incidentId,
  createdAt
}) => {
  return (
    <NeoCard variant="yellow" style={{ marginTop: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Ticket style={{ color: 'var(--accent-citizen)' }} size={22} />
          <h3>SUBMISSION RECEIPT & INCIDENT LINK</h3>
        </div>
        <NeoBadge variant="lime">
          <CheckCircle size={12} /> RECORDED IN POSTGRES
        </NeoBadge>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', background: 'var(--bg-dark)', padding: '1rem', border: '2px solid var(--border-color)' }}>
        <div>
          <span className="neo-stat-label">TICKET ID</span>
          <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, color: 'var(--accent-citizen)', fontSize: '1.1rem' }}>
            {ticketId.substring(0, 8)}...
          </div>
        </div>

        <div>
          <span className="neo-stat-label">MASTER INCIDENT ID</span>
          <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, color: 'var(--accent-ai)', fontSize: '1.1rem' }}>
            {incidentId ? `INC-${incidentId.substring(0, 6)}` : 'AUTO-CLUSTERING IN PROGRESS'}
          </div>
        </div>

        <div>
          <span className="neo-stat-label">CLUSTER STATUS</span>
          <div>
            <NeoBadge variant={incidentId ? 'lime' : 'amber'}>
              <Layers size={12} /> {incidentId ? 'MERGED INTO MASTER CLUSTER' : 'INITIALIZING CLUSTER'}
            </NeoBadge>
          </div>
        </div>

        <div>
          <span className="neo-stat-label">SUBMISSION TIMESTAMP</span>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
            {new Date(createdAt).toLocaleString()}
          </div>
        </div>
      </div>

      <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#1c2810', padding: '0.6rem 0.85rem', border: '2px solid var(--accent-success)' }}>
        <ArrowUpRight size={18} style={{ color: 'var(--accent-success)' }} />
        <span style={{ fontSize: '0.85rem', color: '#d9f99d', fontWeight: 600 }}>
          Deduplication Active: Your report is linked to Master Incident cluster. Multiple duplicate entries are automatically aggregated to reduce city clutter.
        </span>
      </div>
    </NeoCard>
  );
};
