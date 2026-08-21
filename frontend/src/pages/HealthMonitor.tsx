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
      {/* Top Banner */}
      <div className="banner">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>System Health & Status</span>
        </div>
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
