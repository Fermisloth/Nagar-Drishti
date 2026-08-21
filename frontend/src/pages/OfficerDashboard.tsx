import React, { useState, useEffect } from 'react';
import { NeoStatBox } from '../components/common/NeoStatBox';
import { FilterToolbar } from '../components/officer/FilterToolbar';
import { IncidentGrid } from '../components/officer/IncidentGrid';
import { IncidentInspector } from '../components/officer/IncidentInspector';
import { api, type IncidentResponse } from '../api/api';
import { AlertCircle, RefreshCw, BarChart3 } from 'lucide-react';

export const OfficerDashboard: React.FC = () => {
  console.time('OfficerDashboard render');
  const [incidents, setIncidents] = useState<IncidentResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState('ALL');
  const [selectedPriority, setSelectedPriority] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeIncidentId, setActiveIncidentId] = useState<string | null>(null);

  useEffect(() => {
  // Initial fetch is deferred to manual refresh to avoid premature auth errors.
}, [selectedDepartment, selectedPriority]);

  // Log when component has finished mounting
  useEffect(() => {
    console.timeEnd('OfficerDashboard render');
  }, []);

  const fetchIncidents = async () => {
    setLoading(true);
    setError(null);
    try {
      const params: any = {};
      if (selectedDepartment !== 'ALL') params.department = selectedDepartment;
      if (selectedPriority !== 'ALL') params.priority = selectedPriority;
      
      const data = await api.listIncidents(params);
      setIncidents(data);
    } catch (err: any) {
      console.error('Backend endpoint unreachable:', err);
      setError('Unable to reach the server to fetch incidents. Please try again later.');
      setIncidents([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter by search query
  const filteredIncidents = incidents.filter(inc => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return inc.title.toLowerCase().includes(q) || 
           (inc.summary && inc.summary.toLowerCase().includes(q)) ||
           (inc.location && inc.location.toLowerCase().includes(q));
  });

  const totalEmergency = incidents.filter(i => i.priority?.toUpperCase() === 'EMERGENCY').length;
  const totalHigh = incidents.filter(i => i.priority?.toUpperCase() === 'HIGH').length;

  return (
    <div>
      <h1 style={{ margin: 0, padding: 0, fontSize: '2rem' }}>Officer Dashboard</h1>
      <div className="banner">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <BarChart3 size={20} />
          <span>Officer Dashboard</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button onClick={fetchIncidents} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '12px' }}>
            <RefreshCw size={14} /> Refresh Data
          </button>
        </div>
      </div>

      {error && (
        <div style={{ background: 'var(--danger-light)', border: '1px solid var(--danger)', color: 'var(--danger)', padding: '12px 16px', borderRadius: 'var(--radius-md)', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {/* KPI Metrics Row */}
      <div className="grid-cols-3" style={{ marginBottom: '24px' }}>
        <NeoStatBox
          label="Total Active Incidents"
          value={incidents.length}
          badgeText="Live"
          badgeVariant="primary"
          subtext="Total consolidated civic issues"
        />

        <NeoStatBox
          label="Emergency Priority"
          value={totalEmergency}
          badgeText="Critical"
          badgeVariant="danger"
          subtext="Requires immediate attention"
          accentColor="var(--danger)"
        />

        <NeoStatBox
          label="High Priority"
          value={totalHigh}
          badgeText="Urgent"
          badgeVariant="warning"
          subtext="Requires swift resolution"
          accentColor="var(--warning)"
        />
      </div>

      {/* Filter Toolbar */}
      <FilterToolbar
        selectedDepartment={selectedDepartment}
        onSelectDepartment={setSelectedDepartment}
        selectedPriority={selectedPriority}
        onSelectPriority={setSelectedPriority}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Incident Grid */}
      <IncidentGrid
        incidents={filteredIncidents}
        loading={loading}
        onSelectIncident={(id) => setActiveIncidentId(id)}
      />

      {/* Slide-over Inspector */}
      <IncidentInspector
        incidentId={activeIncidentId}
        onClose={() => setActiveIncidentId(null)}
      />
    </div>
  );
};

export default OfficerDashboard;

