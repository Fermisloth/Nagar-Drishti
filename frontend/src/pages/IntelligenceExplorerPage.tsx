import React, { useState } from 'react';
import { Cpu, Play, Sparkles, Database } from 'lucide-react';
import { NeoCard } from '../components/common/NeoCard';
import { NeoButton } from '../components/common/NeoButton';
import { NeoBadge } from '../components/common/NeoBadge';
import { PipelineDecisionFlow } from '../components/intelligence/PipelineDecisionFlow';
import { SimilarityResultCard } from '../components/intelligence/SimilarityResultCard';
import { IncidentMergeVisualizer } from '../components/intelligence/IncidentMergeVisualizer';

const PRESET_SAMPLES = [
  {
    text: "Water pipe burst near Sector 15 main market, street is flooding quickly!",
    dept: "Water Supply & Sewerage",
    priority: "EMERGENCY",
    incidentId: "INC-901",
    score: 0.94
  },
  {
    text: "Pothole on main road causing heavy traffic delay outside Sector 15 entrance.",
    dept: "Roads & Traffic",
    priority: "HIGH",
    incidentId: "INC-902",
    score: 0.91
  },
  {
    text: "Garbage containers overflowing in Ward 8 residential lane for 2 days.",
    dept: "Sanitation & Waste",
    priority: "MEDIUM",
    incidentId: "INC-903",
    score: 0.88
  }
];

export const IntelligenceExplorerPage: React.FC = () => {
  const [selectedSample, setSelectedSample] = useState(PRESET_SAMPLES[0]);
  const [customText, setCustomText] = useState(PRESET_SAMPLES[0].text);
  const [isSimulating, setIsSimulating] = useState(false);

  const handleRunSimulation = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
    }, 500);
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      {/* Top Marquee Banner */}
      <div className="neo-banner" style={{ background: 'var(--accent-purple)', color: '#000' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <NeoBadge variant="simulated">EXPLAINABILITY ARCHITECTURE MODEL</NeoBadge>
          <span>SIGNATURE AI EXPLAINABILITY & PIPELINE TRACER</span>
        </div>
        <span>NO HIDDEN AI BLACK BOXES // REASONING TRACEABILITY</span>
      </div>

      <NeoCard variant="cyan" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '2px solid var(--border-color)', paddingBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Cpu style={{ color: 'var(--accent-ai)' }} size={24} />
            <h2 style={{ fontSize: '1.4rem' }}>EXPLAINABLE AI PIPELINE ARCHITECTURE</h2>
          </div>
          <NeoBadge variant="purple">GEMINI 1.5 + QDRANT 768-D</NeoBadge>
        </div>

        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
          This visualizer demonstrates the <strong>NagarDrishti 5-Stage Decision Architecture</strong>. Select a sample scenario or enter custom text to see how our pipeline normalizes inputs, extracts metadata, generates 768-D embeddings, evaluates Qdrant Cosine distance, and executes deduplication rules.
        </p>

        {/* Preset Sample Selectors */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
          <span className="neo-stat-label" style={{ display: 'flex', alignItems: 'center', marginBottom: 0 }}>PRESET SCENARIOS:</span>
          {PRESET_SAMPLES.map((sample, idx) => (
            <button
              key={idx}
              onClick={() => {
                setSelectedSample(sample);
                setCustomText(sample.text);
              }}
              className={`neo-btn ${selectedSample.text === sample.text ? 'neo-btn-ai' : ''}`}
              style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem' }}
            >
              Scenario #{idx + 1}: {sample.dept}
            </button>
          ))}
        </div>

        {/* Input Box */}
        <div style={{ marginBottom: '1.25rem' }}>
          <textarea
            className="neo-textarea"
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            placeholder="Type a municipal complaint string to run through the AI pipeline architecture..."
          />
        </div>

        <NeoButton
          variant="ai"
          onClick={handleRunSimulation}
          disabled={isSimulating}
          style={{ width: '100%', justifyContent: 'center', fontSize: '1rem', padding: '0.75rem' }}
        >
          <Play size={18} />
          {isSimulating ? 'SIMULATING PIPELINE REASONING FLOW...' : 'RUN PIPELINE REASONING SIMULATION'}
        </NeoButton>
      </NeoCard>

      {/* Interactive Pipeline Decision Flow Chart */}
      <NeoCard style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '2px solid var(--border-color)', paddingBottom: '0.75rem' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={20} style={{ color: 'var(--accent-ai)' }} />
              DECISION ENGINE ARCHITECTURE MODEL
            </h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              Detailed stage breakdown: Input Source ➔ Processing Method ➔ Output Produced
            </span>
          </div>
          <NeoBadge variant="simulated">ILLUSTRATIVE MODEL</NeoBadge>
        </div>

        <PipelineDecisionFlow
          rawText={customText}
          extractedDepartment={selectedSample.dept}
          extractedPriority={selectedSample.priority}
          matchedIncidentId={selectedSample.incidentId}
          similarityScore={selectedSample.score}
        />
      </NeoCard>

      {/* Vector Similarity Search Breakdown Cards */}
      <NeoCard variant="yellow" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '2px solid var(--border-color)', paddingBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Database size={20} style={{ color: 'var(--accent-citizen)' }} />
            <h3>ILLUSTRATIVE QDRANT SIMILARITY MATRIX</h3>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <NeoBadge variant="demo">DEMO MATRIX</NeoBadge>
            <NeoBadge variant="lime">COSINE CUTOFF THRESHOLD = 0.82</NeoBadge>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <SimilarityResultCard
            id="COMP-901A"
            rawText="Water main burst near Sector 15 market entrance. Flooding street."
            score={selectedSample.score}
            threshold={0.82}
          />

          <SimilarityResultCard
            id="COMP-901B"
            rawText="Heavy water leak outside shop 42 in Sector 15. Vehicles getting stuck."
            score={selectedSample.score - 0.03}
            threshold={0.82}
          />

          <SimilarityResultCard
            id="COMP-704 (Different Ward)"
            rawText="Water pressure low in Sector 22 residential apartments."
            score={0.48}
            threshold={0.82}
          />
        </div>
      </NeoCard>

      {/* Side-by-side Deduplication Visualizer */}
      <IncidentMergeVisualizer />
    </div>
  );
};

export default IntelligenceExplorerPage;
