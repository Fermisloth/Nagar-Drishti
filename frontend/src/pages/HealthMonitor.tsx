import React, { useEffect, useState } from 'react';
import { api } from '../api/api';
import type { SystemReadyResponse, SystemMetricsResponse } from '../api/api';
import { Database, Cpu, Brain, Activity, Clock, Sliders, RefreshCw, Loader2, CheckCircle2, XCircle } from 'lucide-react';

export const HealthMonitor: React.FC = () => {
  const [health, setHealth] = useState<SystemReadyResponse | null>(null);
  const [metrics, setMetrics] = useState<SystemMetricsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHealthData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [healthData, metricsData] = await Promise.all([
        api.getSystemReady(),
        api.getSystemMetrics()
      ]);
      setHealth(healthData);
      setMetrics(metricsData);
    } catch (err) {
      setError('Unable to reach backend monitoring services.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealthData();
  }, []);

  const formatUptime = (seconds?: number) => {
    if (seconds === undefined) return 'N/A';
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${hrs}h ${mins}m ${secs}s`;
  };

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '28px', marginBottom: '4px' }}>System Infrastructure Node Status</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
            Real-time liveness indicators, vector database connectivity, and engine thresholds.
          </p>
        </div>
        <button onClick={fetchHealthData} className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '14px' }} disabled={loading}>
          {loading ? (
            <Loader2 className="animate-spin" size={16} style={{ animation: 'spin 1s linear infinite' }} />
          ) : (
            <RefreshCw size={16} />
          )}
          <span>Refresh Console</span>
        </button>
      </div>

      {error && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--danger-light)', color: 'var(--danger)', fontSize: '14px', fontWeight: 500 }}>
          <XCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px', alignItems: 'start' }}>
        {/* Core Status Card */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '20px', textAlign: 'center', padding: '32px 24px' }}>
          <h3 style={{ fontSize: '18px', color: 'var(--text-secondary)' }}>Overall Engine State</h3>
          
          <div style={{ display: 'flex', justifyContent: 'center', margin: '8px 0' }}>
            {health?.status === 'ready' ? (
              <div style={{ color: 'var(--success)' }}>
                <CheckCircle2 size={72} />
              </div>
            ) : (
              <div style={{ color: health ? 'var(--warning)' : 'var(--danger)' }}>
                <Activity size={72} className={loading ? 'animate-pulse' : ''} style={{ animation: loading ? 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' : 'none' }} />
              </div>
            )}
          </div>

          <div>
            <span className={`badge ${health?.status === 'ready' ? 'badge-success' : 'badge-danger'}`} style={{ fontSize: '16px', padding: '6px 16px' }}>
              {health ? health.status.toUpperCase() : 'OFFLINE'}
            </span>
          </div>

          <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            {health?.status === 'ready' 
              ? 'All core storage nodes, vector collections, and AI gateway connections are functional.' 
              : 'One or more system node dependencies are degraded or unreachable.'}
          </p>
        </div>

        {/* Details and metrics */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Dependency Connections */}
          <div className="card">
            <h3 style={{ fontSize: '16px', marginBottom: '18px' }}>Internal Dependency Nodes</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* PostgreSQL */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Database size={20} style={{ color: 'var(--primary)' }} />
                  <div>
                    <h4 style={{ fontSize: '14px' }}>PostgreSQL Database</h4>
                    <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Metadata & transactional storage</p>
                  </div>
                </div>
                <span className={`badge ${health?.dependencies.database ? 'badge-success' : 'badge-danger'}`}>
                  {health?.dependencies.database ? 'connected' : 'degraded'}
                </span>
              </div>

              {/* Qdrant */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Cpu size={20} style={{ color: 'var(--accent-teal)' }} />
                  <div>
                    <h4 style={{ fontSize: '14px' }}>Qdrant Vector Database</h4>
                    <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>High-dimensional complaint embeddings</p>
                  </div>
                </div>
                <span className={`badge ${health?.dependencies.qdrant ? 'badge-success' : 'badge-danger'}`}>
                  {health?.dependencies.qdrant ? 'connected' : 'degraded'}
                </span>
              </div>

              {/* Gemini */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Brain size={20} style={{ color: '#ec4899' }} />
                  <div>
                    <h4 style={{ fontSize: '14px' }}>Gemini AI Service</h4>
                    <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Semantic metadata dispatching gateway</p>
                  </div>
                </div>
                <span className={`badge ${health?.dependencies.gemini ? 'badge-success' : 'badge-danger'}`}>
                  {health?.dependencies.gemini ? 'connected' : 'degraded'}
                </span>
              </div>
            </div>
          </div>

          {/* Engine Parameters */}
          <div className="card">
            <h3 style={{ fontSize: '16px', marginBottom: '18px' }}>Decision Engine Parameters & Telemetry</h3>
            
            <div className="grid-cols-2">
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <Clock size={18} style={{ color: 'var(--text-secondary)', marginTop: '2px' }} />
                <div>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>System Uptime</span>
                  <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginTop: '2px' }}>
                    {formatUptime(metrics?.app_uptime_seconds)}
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <Sliders size={18} style={{ color: 'var(--text-secondary)', marginTop: '2px' }} />
                <div>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Semantic Cluster Threshold</span>
                  <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginTop: '2px' }}>
                    {metrics ? `${(metrics.decision_threshold * 100).toFixed(0)}% cosine match` : 'N/A'}
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <Sliders size={18} style={{ color: 'var(--text-secondary)', marginTop: '2px' }} />
                <div>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Embedding Model</span>
                  <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginTop: '2px' }}>
                    {metrics?.embedding_model || 'N/A'}
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <Sliders size={18} style={{ color: 'var(--text-secondary)', marginTop: '2px' }} />
                <div>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Prompt Dispatch Version</span>
                  <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginTop: '2px' }}>
                    {metrics?.prompt_version || 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default HealthMonitor;
