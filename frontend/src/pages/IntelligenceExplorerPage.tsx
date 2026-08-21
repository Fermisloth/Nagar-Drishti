import React, { useState } from 'react';
import { Cpu, Play, Search, Database } from 'lucide-react';

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
      <div className="banner">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Cpu size={20} />
          <span>System Analytics & Deduplication Engine</span>
        </div>
        <span>Administrative Workspace</span>
      </div>

      <div className="card" style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Search style={{ color: 'var(--primary)' }} size={24} />
            <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Incident Deduplication Logic</h2>
          </div>
          <span className="badge badge-primary">System Analytics</span>
        </div>

        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '20px' }}>
          Test the deduplication logic by selecting a sample complaint or entering custom text. This demonstrates how incoming complaints are matched and merged into master incidents.
        </p>

        {/* Preset Sample Selectors */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', marginRight: '8px' }}>SAMPLES:</span>
          {PRESET_SAMPLES.map((sample, idx) => (
            <button
              key={idx}
              onClick={() => {
                setSelectedSample(sample);
                setCustomText(sample.text);
              }}
              className={`btn ${selectedSample.text === sample.text ? 'btn-primary' : 'btn-secondary'}`}
              style={{ fontSize: '12px', padding: '6px 12px' }}
            >
              Scenario #{idx + 1}: {sample.dept}
            </button>
          ))}
        </div>

        {/* Input Box */}
        <div style={{ marginBottom: '20px' }}>
          <textarea
            className="form-textarea"
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            placeholder="Type a municipal complaint..."
          />
        </div>

        <button
          className="btn btn-primary"
          onClick={handleRunSimulation}
          disabled={isSimulating}
          style={{ width: '100%', justifyContent: 'center', fontSize: '16px', padding: '12px' }}
        >
          <Play size={18} />
          {isSimulating ? 'Processing...' : 'Test Deduplication Flow'}
        </button>
      </div>

      <div className="card" style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Database size={20} style={{ color: 'var(--primary)' }} />
            <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Similarity Results</h3>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '16px', background: 'var(--bg-secondary)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <strong>COMP-901A</strong>
              <span className="badge badge-success">Match Score: {selectedSample.score}</span>
            </div>
            <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-secondary)' }}>Water main burst near Sector 15 market entrance. Flooding street.</p>
          </div>

          <div style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '16px', background: 'var(--bg-secondary)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <strong>COMP-901B</strong>
              <span className="badge badge-success">Match Score: {(selectedSample.score - 0.03).toFixed(2)}</span>
            </div>
            <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-secondary)' }}>Heavy water leak outside shop 42 in Sector 15. Vehicles getting stuck.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntelligenceExplorerPage;

