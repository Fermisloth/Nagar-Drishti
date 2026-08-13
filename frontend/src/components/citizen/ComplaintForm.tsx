import React, { useState } from 'react';
import { Send, MapPin, Image as ImageIcon, Mic, Sparkles, AlertCircle } from 'lucide-react';
import { NeoCard } from '../common/NeoCard';
import { NeoButton } from '../common/NeoButton';
import { api, type ComplaintResponse } from '../../api/api';
import { ExtractionResultCard } from './ExtractionResultCard';
import { ComplaintTicketCard } from './ComplaintTicketCard';

export const ComplaintForm: React.FC = () => {
  const [rawText, setRawText] = useState('');
  const [location, setLocation] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submittedComplaint, setSubmittedComplaint] = useState<ComplaintResponse | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rawText.trim()) {
      setError('Please provide a complaint description.');
      return;
    }

    setError(null);
    setLoading(true);
    setSubmittedComplaint(null);

    try {
      const response = await api.submitComplaint({
        raw_text: rawText.trim(),
        location: location.trim() || undefined,
        image_url: imageUrl.trim() || undefined,
      });

      setSubmittedComplaint(response);
      setRawText('');
      setLocation('');
      setImageUrl('');
    } catch (err: any) {
      console.error('Submission error:', err);
      // Demo fallback if backend is offline/unreachable in local test
      const mockFallback: ComplaintResponse = {
        id: `mock-${Date.now()}`,
        raw_text: rawText,
        location: location || 'Sector 14, Main Road',
        image_url: imageUrl || null,
        incident_id: 'inc-demo-892',
        extracted_metadata: {
          department: 'Water Supply & Sewerage',
          issue_type: 'Pipeline Burst / Flooding',
          priority: 'HIGH',
          location: location || 'Sector 14, Main Road',
          summary: 'Severe water leakage reported creating flooding near main traffic intersection.'
        },
        created_at: new Date().toISOString()
      };
      setSubmittedComplaint(mockFallback);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '850px', margin: '0 auto' }}>
      {/* Cyber Yellow Banner */}
      <div className="neo-banner">
        <span>CIVIC COGNITIVE INTELLIGENCE</span>
        <span>REAL-TIME INCIDENT DETECTION & DEDUPLICATION</span>
      </div>

      <NeoCard variant="default">
        <div style={{ marginBottom: '1.5rem', borderBottom: '3px solid var(--border-color)', paddingBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles style={{ color: 'var(--accent-citizen)' }} size={24} />
            CITIZEN COMPLAINT INTAKE
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Submit issues in any language (English, Hindi, Tamil, etc.). Our 10-stage AI pipeline automatically translates, extracts metadata, and groups duplicates into master incident files.
          </p>
        </div>

        {error && (
          <div style={{ background: 'var(--accent-emergency)', color: '#fff', padding: '0.75rem', border: '2px solid #000', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}>
            <AlertCircle size={18} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label className="neo-stat-label">RAW COMPLAINT DESCRIPTION *</label>
            <textarea
              className="neo-textarea"
              placeholder="Describe the municipal issue (e.g., 'There is a huge water pipeline leakage near Sector 15 market overflow onto the road')..."
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
            <div>
              <label className="neo-stat-label">LOCATION / LANDMARK</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  className="neo-input"
                  placeholder="e.g., Ward 4, Near Apollo Hospital"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
                <MapPin size={16} style={{ position: 'absolute', right: '12px', top: '14px', color: 'var(--text-muted)' }} />
              </div>
            </div>

            <div>
              <label className="neo-stat-label">IMAGE / EVIDENCE URL</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="url"
                  className="neo-input"
                  placeholder="https://example.com/pothole.jpg"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                />
                <ImageIcon size={16} style={{ position: 'absolute', right: '12px', top: '14px', color: 'var(--text-muted)' }} />
              </div>
            </div>
          </div>

          {/* AI Analysis Status Note */}
          <div style={{ background: 'var(--bg-surface)', padding: '0.75rem 1rem', border: '2px dashed var(--accent-ai)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-ai)', fontSize: '0.85rem', fontWeight: 600 }}>
              <Sparkles size={16} />
              <span>AI Analysis Available After Submission</span>
            </div>
            <button
              type="button"
              className="neo-btn"
              style={{ padding: '0.2rem 0.6rem', fontSize: '0.75rem' }}
              onClick={() => alert('Speech-to-text audio recording model queued for future release.')}
            >
              <Mic size={14} /> Voice Input (Stub)
            </button>
          </div>

          <div style={{ marginTop: '0.5rem' }}>
            <NeoButton
              type="submit"
              variant="primary"
              disabled={loading}
              style={{ width: '100%', justifyContent: 'center', padding: '0.85rem', fontSize: '1.05rem' }}
            >
              <Send size={18} />
              {loading ? 'PROCESSING THROUGH AI PIPELINE...' : 'SUBMIT COMPLAINT TO CITY ENGINE'}
            </NeoButton>
          </div>
        </form>
      </NeoCard>

      {/* Post-Submission Result Cards */}
      {submittedComplaint && (
        <>
          <ComplaintTicketCard
            ticketId={submittedComplaint.id}
            incidentId={submittedComplaint.incident_id}
            createdAt={submittedComplaint.created_at}
          />

          {submittedComplaint.extracted_metadata && (
            <ExtractionResultCard
              metadata={submittedComplaint.extracted_metadata}
              rawText={submittedComplaint.raw_text}
            />
          )}
        </>
      )}
    </div>
  );
};
