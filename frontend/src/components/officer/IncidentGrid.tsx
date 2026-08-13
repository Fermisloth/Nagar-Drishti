import React from 'react';
import { IncidentCard } from './IncidentCard';
import type { IncidentResponse } from '../../api/api';

interface IncidentGridProps {
  incidents: IncidentResponse[];
  loading: boolean;
  onSelectIncident: (id: string) => void;
}

export const IncidentGrid: React.FC<IncidentGridProps> = ({ incidents, loading, onSelectIncident }) => {
  if (loading) {
    return (
      <div className="neo-card" style={{ padding: '3rem', textAlign: 'center', fontFamily: 'var(--font-mono)' }}>
        QUERYING CLUSTERED INCIDENTS FROM POSTGRES & QDRANT VECTOR ENGINE...
      </div>
    );
  }

  if (incidents.length === 0) {
    return (
      <div className="neo-card" style={{ padding: '3rem', textAlign: 'center' }}>
        <h3 style={{ marginBottom: '0.5rem' }}>NO INCIDENTS MATCH CURRENT FILTERS</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Try clearing department or priority search filters to view active municipal incidents.
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
      {incidents.map((incident) => (
        <IncidentCard key={incident.id} incident={incident} onSelect={onSelectIncident} />
      ))}
    </div>
  );
};
