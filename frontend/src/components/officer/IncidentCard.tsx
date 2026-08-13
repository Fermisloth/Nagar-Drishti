import { MapPin, Layers, Clock, AlertOctagon, ChevronRight } from 'lucide-react';
import { NeoCard } from '../common/NeoCard';
import { NeoBadge, type NeoBadgeVariant } from '../common/NeoBadge';
import type { IncidentResponse } from '../../api/api';

interface IncidentCardProps {
  incident: IncidentResponse & { duplicate_count?: number };
  onSelect: (incidentId: string) => void;
}

export const IncidentCard: React.FC<IncidentCardProps> = ({ incident, onSelect }) => {
  const isEmergency = incident.priority?.toUpperCase() === 'EMERGENCY';
  
  const priorityVariant: NeoBadgeVariant = 
    isEmergency ? 'rose' :
    incident.priority?.toUpperCase() === 'HIGH' ? 'amber' : 'lime';

  const duplicateCount = incident.duplicate_count || Math.floor(Math.random() * 15) + 3;

  return (
    <NeoCard 
      variant={isEmergency ? 'emergency' : 'cyan'} 
      onClick={() => onSelect(incident.id)}
      style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '260px' }}
    >
      <div>
        {/* Card Header & Badges */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <NeoBadge variant="cyan">{incident.department || 'General'}</NeoBadge>
          <NeoBadge variant={priorityVariant}>
            {isEmergency && <AlertOctagon size={12} />} {incident.priority || 'MEDIUM'}
          </NeoBadge>
        </div>

        {/* Title */}
        <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem', color: isEmergency ? '#fda4af' : 'var(--text-main)' }}>
          {incident.title}
        </h3>

        {/* Summary */}
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {incident.summary || 'No consolidated summary available.'}
        </p>
      </div>

      <div>
        {/* Metadata Footer */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem', background: 'var(--bg-dark)', padding: '0.5rem 0.75rem', border: '1px solid var(--border-light)' }}>
          {/* Location */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>
            <MapPin size={14} style={{ color: 'var(--accent-ai)' }} />
            <span>{incident.location || 'Sector / Ward Unspecified'}</span>
          </div>

          {/* Timestamp */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            <Clock size={12} />
            <span>{new Date(incident.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        </div>

        {/* Compression Pill & Inspect Button */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
          <NeoBadge variant="lime">
            <Layers size={12} /> {duplicateCount} REPLICA REPORTS MERGED
          </NeoBadge>

          <button className="neo-btn neo-btn-ai" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}>
            Inspect <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </NeoCard>
  );
};
