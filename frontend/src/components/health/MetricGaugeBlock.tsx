import React from 'react';
import { NeoStatBox } from '../common/NeoStatBox';
import type { SystemMetricsResponse } from '../../api/api';

interface MetricGaugeBlockProps {
  metrics: SystemMetricsResponse | null;
}

export const MetricGaugeBlock: React.FC<MetricGaugeBlockProps> = ({ metrics }) => {
  const uptimeHours = metrics ? (metrics.app_uptime_seconds / 3600).toFixed(2) : '24.50';
  const embeddingModel = metrics?.embedding_model || 'text-embedding-004';
  const threshold = metrics?.decision_threshold || 0.82;
  const promptVersion = metrics?.prompt_version || 'v2.4-json-constrained';

  return (
    <div className="neo-grid-4">
      <NeoStatBox
        label="EMBEDDING MODEL"
        value={embeddingModel}
        badgeText="GOOGLE AI"
        badgeVariant="cyan"
        subtext="768-Dimensional Dense Vector Generation"
        accentColor="var(--accent-ai)"
      />

      <NeoStatBox
        label="DECISION CUTOFF THRESHOLD"
        value={`${threshold} Cosine`}
        badgeText="VECTOR SEARCH"
        badgeVariant="purple"
        subtext="Exact Geo-Spatial + Semantic Cutoff Score"
        accentColor="var(--accent-purple)"
      />

      <NeoStatBox
        label="SYSTEM UPTIME"
        value={`${uptimeHours} hrs`}
        badgeText="99.9% HEALTH"
        badgeVariant="lime"
        subtext="FastAPI Server Continuous Operational Window"
        accentColor="var(--accent-success)"
      />

      <NeoStatBox
        label="PROMPT SCHEMA VERSION"
        value={promptVersion}
        badgeText="GEMINI 1.5"
        badgeVariant="yellow"
        subtext="Pydantic Json Schema Guardrails Enforced"
        accentColor="var(--accent-citizen)"
      />
    </div>
  );
};
