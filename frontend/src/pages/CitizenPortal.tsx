import React, { useState } from 'react';
import { api } from '../api/api';
import type { ComplaintResponse } from '../api/api';
import { FileText, MapPin, Image, AlertCircle, CheckCircle, Brain, ArrowRight, Loader2 } from 'lucide-react';

export const CitizenPortal: React.FC = () => {
  const [rawText, setRawText] = useState('');
  const [location, setLocation] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ComplaintResponse | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rawText.trim().length < 5) {
      setError('Description must be at least 5 characters long.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await api.submitComplaint({
        raw_text: rawText,
        location: location.trim() || undefined,
        image_url: imageUrl.trim() || undefined,
      });
      setResult(response);
      // Reset form
      setRawText('');
      setLocation('');
      setImageUrl('');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'An error occurred while submitting the complaint.');
    } finally {
      setLoading(false);
    }
  };

  const getPriorityClass = (priority?: string) => {
    switch (priority?.toLowerCase()) {
      case 'high': return 'badge-danger';
      case 'medium': return 'badge-warning';
      default: return 'badge-primary';
    }
  };

  return (
    <div className="fade-in" style={{ maxWidth: '680px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div style={{ display: 'inline-flex', padding: '12px', borderRadius: '50%', backgroundColor: 'rgba(99, 102, 241, 0.1)', color: '#6366f1', marginBottom: '16px' }}>
          <Brain size={36} />
        </div>
        <h1 style={{ fontSize: '32px', marginBottom: '8px' }}>AI Municipal Ingestion</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Submit your complaint. Our Incident Decision Engine will analyze, classify, and cluster your report automatically.
        </p>
      </div>

      {!result ? (
        <form onSubmit={handleSubmit} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {error && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--danger-light)', color: 'var(--danger)', fontSize: '14px', fontWeight: 500 }}>
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FileText size={16} />
              <span>Complaint Details <span style={{ color: 'var(--danger)' }}>*</span></span>
            </label>
            <textarea
              className="form-textarea"
              placeholder="Describe the issue in detail (e.g. water leakage, pothole size, street light off)..."
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              required
              disabled={loading}
            />
            <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
              Minimum 5 characters. Be as descriptive as possible for accurate AI dispatching.
            </span>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <MapPin size={16} />
              <span>Location (Optional)</span>
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Sector 5, Block B, near Central Park"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Image size={16} />
              <span>Image URL (Optional)</span>
            </label>
            <input
              type="url"
              className="form-input"
              placeholder="e.g. https://example.com/pothole.jpg"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              disabled={loading}
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading || !rawText.trim()}>
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
                <span>Processing AI Categorization...</span>
              </>
            ) : (
              <>
                <span>Submit Complaint</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>
      ) : (
        <div className="card fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ color: 'var(--success)', display: 'flex' }}>
              <CheckCircle size={28} />
            </div>
            <div>
              <h3 style={{ fontSize: '20px' }}>Complaint Submitted Successfully</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>ID: {result.id}</p>
            </div>
          </div>

          <hr style={{ borderColor: 'var(--border-color)' }} />

          <div>
            <h4 style={{ fontSize: '15px', color: 'var(--text-secondary)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Brain size={16} style={{ color: '#6366f1' }} />
              <span>AI Extraction & Classification Insights</span>
            </h4>
            
            {result.extracted_metadata ? (
              <div style={{ backgroundColor: 'var(--bg-primary)', padding: '16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Summary</span>
                  <p style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)', marginTop: '2px' }}>
                    {result.extracted_metadata.summary}
                  </p>
                </div>
                
                <div className="grid-cols-3" style={{ gap: '12px' }}>
                  <div>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600, display: 'block' }}>Department</span>
                    <span className="badge badge-teal" style={{ marginTop: '4px' }}>
                      {result.extracted_metadata.department}
                    </span>
                  </div>
                  <div>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600, display: 'block' }}>Priority</span>
                    <span className={`badge ${getPriorityClass(result.extracted_metadata.priority)}`} style={{ marginTop: '4px' }}>
                      {result.extracted_metadata.priority}
                    </span>
                  </div>
                  <div>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600, display: 'block' }}>Issue Type</span>
                    <span className="badge badge-primary" style={{ marginTop: '4px' }}>
                      {result.extracted_metadata.issue_type}
                    </span>
                  </div>
                </div>

                {result.extracted_metadata.location && (
                  <div>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Extracted Location</span>
                    <p style={{ fontSize: '13px', color: 'var(--text-primary)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MapPin size={12} style={{ color: 'var(--text-muted)' }} />
                      <span>{result.extracted_metadata.location}</span>
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <p style={{ fontSize: '14px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                AI engine meta-extraction skipped.
              </p>
            )}
          </div>

          {result.incident_id && (
            <div style={{ padding: '12px 16px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--primary-light)', border: '1px solid var(--primary-border)', fontSize: '13px', color: 'var(--text-primary)' }}>
              <strong>Decision Engine Action:</strong> Clustered under active incident group ID <code>{result.incident_id.substring(0, 8)}...</code> based on high semantic similarity.
            </div>
          )}

          <button onClick={() => setResult(null)} className="btn btn-secondary">
            Submit Another Complaint
          </button>
        </div>
      )}
      
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
export default CitizenPortal;
