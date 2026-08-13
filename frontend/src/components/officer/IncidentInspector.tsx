import React, { useState, useEffect } from 'react';
import { X, Layers, MapPin, Calendar, CheckCircle2, UserCheck, HelpCircle, Compass, ShieldCheck } from 'lucide-react';
import { NeoBadge } from '../common/NeoBadge';
import { api, type IncidentDetailResponse } from '../../api/api';

interface IncidentInspectorProps {
  incidentId: string | null;
  onClose: () => void;
}

export const IncidentInspector: React.FC<IncidentInspectorProps> = ({ incidentId, onClose }) => {
  const [detail, setDetail] = useState<IncidentDetailResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [isLiveApi, setIsLiveApi] = useState(false);
  const [status, setStatus] = useState<'OPEN' | 'IN_PROGRESS' | 'RESOLVED'>('OPEN');

  useEffect(() => {
    if (!incidentId) return;

    setLoading(true);
    setIsLiveApi(false);
    api.getIncidentDetail(incidentId)
      .then((data) => {
        setDetail(data);
        setIsLiveApi(true);
      })
      .catch((err) => {
        console.warn('Error fetching incident details from backend, displaying fallback data:', err);
        setIsLiveApi(false);
        // Fallback mock detail for offline/demo mode
        setDetail({
          id: incidentId,
          title: 'Critical Main Sewerage Overflow & Road Inundation',
          department: 'Water Supply & Sewerage',
          issue_type: 'Pipeline Burst',
          priority: 'EMERGENCY',
          location: 'Sector 15 Market, Main Arterial Road',
          summary: 'Consolidated report from 14 citizens regarding a major 24-inch water main breach flooding traffic lanes and nearby shops.',
          created_at: new Date().toISOString(),
          duplicate_count: 14,
          complaints: [
            {
              id: 'comp-101',
              raw_text: 'The water pipe exploded near sector 15 main market. Water is filling the road fast!',
              location: 'Sector 15 Main Market',
              image_url: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0',
              incident_id: incidentId,
              extracted_metadata: { priority: 'EMERGENCY', department: 'Water Supply & Sewerage' },
              created_at: new Date(Date.now() - 3600000).toISOString()
            },
            {
              id: 'comp-102',
              raw_text: 'Huge water leakage outside shop #42 in sector 15. Vehicles getting stuck.',
              location: 'Sector 15, Shop #42',
              image_url: null,
              incident_id: incidentId,
              extracted_metadata: { priority: 'HIGH', department: 'Water Supply & Sewerage' },
              created_at: new Date(Date.now() - 7200000).toISOString()
            },
            {
              id: 'comp-103',
              raw_text: 'Sewage/water flooding road in sector 15 near market area.',
              location: 'Sector 15',
              image_url: null,
              incident_id: incidentId,
              extracted_metadata: { priority: 'HIGH', department: 'Water Supply & Sewerage' },
              created_at: new Date(Date.now() - 10800000).toISOString()
            }
          ]
        });
      })
      .finally(() => setLoading(false));
  }, [incidentId]);

  if (!incidentId) return null;

  return (
    <div className="neo-drawer">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', borderBottom: '3px solid var(--border-color)', paddingBottom: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
            <NeoBadge variant="rose">INCIDENT #{incidentId.substring(0, 8)}</NeoBadge>
            {detail && <NeoBadge variant="cyan">{detail.department}</NeoBadge>}
            <NeoBadge variant={isLiveApi ? 'live' : 'demo'}>
              {isLiveApi ? 'LIVE API DATA' : 'DEMO FALLBACK DATA'}
            </NeoBadge>
          </div>
          <h2 style={{ fontSize: '1.4rem' }}>{detail ? detail.title : 'Loading Incident...'}</h2>
        </div>

        <button onClick={onClose} className="neo-btn" style={{ padding: '0.3rem 0.6rem' }}>
          <X size={20} />
        </button>
      </div>

      {loading && (
        <div style={{ padding: '2rem', textAlign: 'center', fontFamily: 'var(--font-mono)' }}>
          FETCHING CLUSTER DATA FROM QDRANT & POSTGRES...
        </div>
      )}

      {detail && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Action Workflow Controls */}
          <div className="neo-card" style={{ background: '#121921', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span className="neo-stat-label">INCIDENT WORKFLOW STATUS</span>
              <div style={{ fontWeight: 800, color: status === 'RESOLVED' ? 'var(--accent-success)' : status === 'IN_PROGRESS' ? 'var(--accent-warning)' : 'var(--accent-emergency)' }}>
                STATUS: {status}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button 
                onClick={() => setStatus('IN_PROGRESS')}
                className={`neo-btn ${status === 'IN_PROGRESS' ? 'neo-btn-primary' : ''}`}
                style={{ fontSize: '0.75rem', padding: '0.4rem 0.75rem' }}
              >
                <UserCheck size={14} /> Assign Team
              </button>

              <button 
                onClick={() => setStatus('RESOLVED')}
                className={`neo-btn ${status === 'RESOLVED' ? 'neo-btn-ai' : ''}`}
                style={{ fontSize: '0.75rem', padding: '0.4rem 0.75rem' }}
              >
                <CheckCircle2 size={14} /> Mark Resolved
              </button>
            </div>
          </div>

          {/* AI Consolidated Executive Summary */}
          <div className="neo-card neo-card-cyan">
            <span className="neo-stat-label" style={{ color: 'var(--accent-ai)' }}>AI CONSOLIDATED INCIDENT SUMMARY</span>
            <p style={{ fontSize: '0.95rem', color: '#f4f4f5', marginTop: '0.5rem' }}>
              {detail.summary}
            </p>
            <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-light)', fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>
              <div>
                <MapPin size={12} style={{ display: 'inline', marginRight: '4px', color: 'var(--accent-ai)' }} />
                <span>{detail.location || 'Location Unspecified'}</span>
              </div>
              <div>
                <Calendar size={12} style={{ display: 'inline', marginRight: '4px', color: 'var(--accent-citizen)' }} />
                <span>{new Date(detail.created_at).toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* "WHY WAS THIS MERGED?" EXPLAINABILITY PANEL */}
          <div className="neo-card" style={{ background: '#17202a', border: '2px solid var(--accent-purple)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <HelpCircle style={{ color: 'var(--accent-purple)' }} size={18} />
                <h3 style={{ fontSize: '1rem', color: 'var(--accent-purple)' }}>WHY WAS THIS MERGED?</h3>
              </div>
              <NeoBadge variant="simulated">EXPLAINABILITY DEMONSTRATION</NeoBadge>
            </div>

            <p style={{ fontSize: '0.85rem', color: '#e4e4e7', marginBottom: '0.75rem' }}>
              Illustrative rationale based on <strong style={{ color: 'var(--accent-ai)' }}>IncidentDecisionEngine</strong> evaluation logic (Composite threshold &ge; 0.80 + Department guardrail):
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem', fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>
              <div style={{ background: 'var(--bg-dark)', padding: '0.5rem 0.75rem', border: '1px solid var(--border-light)' }}>
                <div style={{ color: 'var(--text-muted)' }}>COSINE SCORE</div>
                <div style={{ color: 'var(--accent-success)', fontWeight: 700 }}><ShieldCheck size={12} style={{ display: 'inline' }} /> 0.94 &gt; 0.82 Cutoff</div>
              </div>

              <div style={{ background: 'var(--bg-dark)', padding: '0.5rem 0.75rem', border: '1px solid var(--border-light)' }}>
                <div style={{ color: 'var(--text-muted)' }}>SPATIAL PROXIMITY</div>
                <div style={{ color: 'var(--accent-ai)', fontWeight: 700 }}><Compass size={12} style={{ display: 'inline' }} /> &lt; 120m Radius</div>
              </div>

              <div style={{ background: 'var(--bg-dark)', padding: '0.5rem 0.75rem', border: '1px solid var(--border-light)' }}>
                <div style={{ color: 'var(--text-muted)' }}>RECENCY WINDOW</div>
                <div style={{ color: 'var(--accent-citizen)', fontWeight: 700 }}><Calendar size={12} style={{ display: 'inline' }} /> &lt; 3.5 Hours Apart</div>
              </div>
            </div>
          </div>

          {/* Aggregated Child Complaints */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <h3 style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Layers size={18} style={{ color: 'var(--accent-success)' }} />
                AGGREGATED CITIZEN COMPLAINTS ({detail.complaints ? detail.complaints.length : detail.duplicate_count})
              </h3>
              <NeoBadge variant="lime">QDRANT VECTOR MATCHED</NeoBadge>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {detail.complaints && detail.complaints.length > 0 ? (
                detail.complaints.map((comp: any, idx: number) => (
                  <div key={comp.id || idx} className="neo-card" style={{ padding: '1rem', background: 'var(--bg-dark)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <NeoBadge variant="dark">REPLICA REPORT #{idx + 1}</NeoBadge>
                      <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                        {new Date(comp.created_at).toLocaleTimeString()}
                      </span>
                    </div>

                    <p style={{ fontSize: '0.88rem', color: '#e4e4e7', marginBottom: '0.5rem' }}>
                      "{comp.raw_text}"
                    </p>

                    {comp.location && (
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                        📍 {comp.location}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  No child complaints returned for this incident cluster.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
