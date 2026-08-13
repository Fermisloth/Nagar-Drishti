import React, { useEffect, useState } from 'react';
import { PipelineStatusMap } from '../components/health/PipelineStatusMap';
import { MetricGaugeBlock } from '../components/health/MetricGaugeBlock';
import { SystemRiskPanel } from '../components/health/SystemRiskPanel';
import { api, type SystemReadyResponse, type SystemMetricsResponse } from '../api/api';

export const HealthMonitor: React.FC = () => {
  const [readyStatus, setReadyStatus] = useState<SystemReadyResponse | null>(null);
  const [metrics, setMetrics] = useState<SystemMetricsResponse | null>(null);

  useEffect(() => {
    fetchHealthData();
  }, []);

  const fetchHealthData = async () => {
    try {
      const [readyData, metricsData] = await Promise.all([
        api.getSystemReady().catch(() => null),
        api.getSystemMetrics().catch(() => null)
      ]);

      if (readyData) setReadyStatus(readyData);
      if (metricsData) setMetrics(metricsData);
    } catch (err) {
      console.error('Error fetching health endpoints:', err);
    }
  };

  return (
    <div>
      {/* Top Marquee Banner */}
      <div className="neo-banner" style={{ background: 'var(--accent-ai)', color: '#000' }}>
        <span>SYSTEM HEALTH & PIPELINE TELEMETRY</span>
        <span>FASTAPI // QDRANT VECTOR DB // GEMINI 1.5 FLASH // POSTGRESQL</span>
      </div>

      {/* Node Status Map */}
      <PipelineStatusMap readyStatus={readyStatus} />

      {/* System Metrics Telemetry */}
      <MetricGaugeBlock metrics={metrics} />

      {/* System Risk Panel */}
      <SystemRiskPanel />
    </div>
  );
};

export default HealthMonitor;
