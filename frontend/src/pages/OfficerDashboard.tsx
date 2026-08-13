import React, { useEffect, useState } from 'react';
import { api } from '../api/api';
import type { IncidentResponse, IncidentDetailResponse } from '../api/api';
import { 
  Building2, 
  ShieldAlert, 
  Activity, 
  Filter, 
  Calendar, 
  MapPin, 
  Layers, 
  ExternalLink,
  ChevronRight,
  LogOut,
  Lock,
  Loader2,
  FileText,
  AlertCircle
} from 'lucide-react';

export const OfficerDashboard: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('nagardrishti_token'));
  const [jwtInput, setJwtInput] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  
  const [incidents, setIncidents] = useState<IncidentResponse[]>([]);
  const [selectedIncident, setSelectedIncident] = useState<IncidentDetailResponse | null>(null);
  const [loadingList, setLoadingList] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('');

  const fetchIncidents = async () => {
    setLoadingList(true);
    setError(null);
    try {
      const data = await api.listIncidents({
        department: selectedDept || undefined,
        priority: selectedPriority || undefined,
      });
      setIncidents(data);
    } catch (err: any) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        setIsAuthenticated(false);
        localStorage.removeItem('nagardrishti_token');
        setAuthError('Authentication session expired or invalid permissions.');
      } else {
        setError('Failed to retrieve incidents from the backend.');
      }
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchIncidents();
    }
  }, [isAuthenticated, selectedDept, selectedPriority]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jwtInput.trim()) return;
    
    setAuthError(null);
    localStorage.setItem('nagardrishti_token', jwtInput.trim());
    
    try {
      // Validate by attempting a list call
      await api.listIncidents({ limit: 1 });
      setIsAuthenticated(true);
    } catch (err: any) {
      localStorage.removeItem('nagardrishti_token');
      setAuthError(err.response?.data?.detail || 'Invalid token. Please check your credentials and database status.');
    }
  };

  const handleSelectIncident = async (id: string) => {
    setLoadingDetail(true);
    try {
      const data = await api.getIncidentDetail(id);
      setSelectedIncident(data);
    } catch (err) {
      console.error('Failed to load incident detail', err);
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('nagardrishti_token');
    setIsAuthenticated(false);
    setIncidents([]);
    setSelectedIncident(null);
  };

  // Derive metrics safely from available incident response
  const totalIncidents = incidents.length;
  const highPriorityCount = incidents.filter(i => i.priority?.toLowerCase() === 'high').length;
  const deptBreakdown = incidents.reduce((acc, curr) => {
    acc[curr.department] = (acc[curr.department] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const getPriorityBadgeClass = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case 'high': return 'badge-danger';
      case 'medium': return 'badge-warning';
      default: return 'badge-teal';
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="fade-in" style={{ maxWidth: '480px', margin: '64px auto 0' }}>
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ display: 'inline-flex', padding: '12px', borderRadius: '50%', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', marginBottom: '16px' }}>
              <Lock size={32} />
            </div>
            <h2 style={{ fontSize: '24px', marginBottom: '8px' }}>Officer Gateway</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
              Authentication is required to view NagarDrishti municipal dashboards.
            </p>
          </div>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {authError && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--danger-light)', color: 'var(--danger)', fontSize: '13px', fontWeight: 500 }}>
                <AlertCircle size={16} />
                <span>{authError}</span>
              </div>
            )}
            
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Developer Access Token (JWT)</label>
              <textarea
                className="form-textarea"
                placeholder="Paste the output of create_dev_token.py here..."
                value={jwtInput}
                onChange={(e) => setJwtInput(e.target.value)}
                style={{ minHeight: '80px', fontSize: '13px', fontFamily: 'monospace' }}
                required
              />
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '6px', display: 'block' }}>
                Note: Since there is no live /auth/login REST endpoint, use the Python utility <code>python create_dev_token.py</code> to generate a valid token.
              </span>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              Verify & Enter Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '28px', marginBottom: '4px' }}>Incident Intelligence Console</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
            Real-time municipal threat classification and automatic duplicate grouping.
          </p>
        </div>
        <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '14px' }}>
          <LogOut size={16} />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Metrics Row (legitimately derived) */}
      <div className="grid-cols-3">
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '20px' }}>
          <div style={{ padding: '12px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--primary-light)', color: 'var(--primary)' }}>
            <Layers size={24} />
          </div>
          <div>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>Active Clustered Incidents</span>
            <h2 style={{ fontSize: '28px', marginTop: '2px' }}>{totalIncidents}</h2>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '20px' }}>
          <div style={{ padding: '12px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--danger-light)', color: 'var(--danger)' }}>
            <ShieldAlert size={24} />
          </div>
          <div>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>High Priority Groups</span>
            <h2 style={{ fontSize: '28px', marginTop: '2px' }}>{highPriorityCount}</h2>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '20px' }}>
          <div style={{ padding: '12px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--accent-teal-light)', color: 'var(--accent-teal)' }}>
            <Activity size={24} />
          </div>
          <div>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>Unique Departments Active</span>
            <h2 style={{ fontSize: '28px', marginTop: '2px' }}>{Object.keys(deptBreakdown).length}</h2>
          </div>
        </div>
      </div>

      {/* Sidebar Filter and Main Content */}
      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '24px', alignItems: 'start' }}>
        {/* Left column: Filters & Listings */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="card" style={{ padding: '18px' }}>
            <h3 style={{ fontSize: '16px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Filter size={16} />
              <span>Filters</span>
            </h3>

            <div className="form-group">
              <label className="form-label">Department</label>
              <select 
                className="form-input" 
                value={selectedDept} 
                onChange={(e) => { setSelectedDept(e.target.value); setSelectedIncident(null); }}
                style={{ backgroundColor: 'var(--bg-primary)' }}
              >
                <option value="">All Departments</option>
                <option value="WATER">Water</option>
                <option value="ROADS">Roads</option>
                <option value="ELECTRICITY">Electricity</option>
                <option value="SANITATION">Sanitation</option>
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Priority</label>
              <select 
                className="form-input" 
                value={selectedPriority} 
                onChange={(e) => { setSelectedPriority(e.target.value); setSelectedIncident(null); }}
                style={{ backgroundColor: 'var(--bg-primary)' }}
              >
                <option value="">All Priorities</option>
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
              </select>
            </div>
          </div>

          {/* Incident List */}
          <div className="card" style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '12px', minHeight: '300px' }}>
            <h3 style={{ fontSize: '16px' }}>Incident Registry</h3>
            
            {loadingList ? (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                <Loader2 className="animate-spin" size={24} style={{ animation: 'spin 1s linear infinite', color: 'var(--text-secondary)' }} />
              </div>
            ) : error ? (
              <p style={{ color: 'var(--danger)', fontSize: '13px' }}>{error}</p>
            ) : incidents.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '13px', textAlign: 'center', marginTop: '32px' }}>
                No incidents match the active filters.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', overflowY: 'auto', maxHeight: '450px' }}>
                {incidents.map((incident) => (
                  <div
                    key={incident.id}
                    onClick={() => handleSelectIncident(incident.id)}
                    style={{
                      padding: '12px',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: selectedIncident?.id === incident.id ? 'var(--primary-light)' : 'var(--bg-primary)',
                      border: `1px solid ${selectedIncident?.id === incident.id ? 'var(--primary-border)' : 'var(--border-color)'}`,
                      cursor: 'pointer',
                      transition: 'var(--transition-fast)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div style={{ minWidth: 0, flex: 1, paddingRight: '8px' }}>
                      <h4 style={{ fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {incident.title}
                      </h4>
                      <div style={{ display: 'flex', gap: '6px', marginTop: '6px', alignItems: 'center' }}>
                        <span className={`badge ${getPriorityBadgeClass(incident.priority)}`} style={{ fontSize: '10px', padding: '2px 6px' }}>
                          {incident.priority}
                        </span>
                        <span className="badge badge-teal" style={{ fontSize: '10px', padding: '2px 6px' }}>
                          {incident.department}
                        </span>
                      </div>
                    </div>
                    <ChevronRight size={16} style={{ color: 'var(--text-muted)' }} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right column: Incident Details */}
        <div className="card" style={{ minHeight: '520px', display: 'flex', flexDirection: 'column' }}>
          {loadingDetail ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
              <Loader2 className="animate-spin" size={36} style={{ animation: 'spin 1s linear infinite', color: 'var(--primary)' }} />
            </div>
          ) : selectedIncident ? (
            <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <span className={`badge ${getPriorityBadgeClass(selectedIncident.priority)}`} style={{ marginBottom: '8px' }}>
                  {selectedIncident.priority} Priority
                </span>
                <h2 style={{ fontSize: '22px', marginBottom: '8px' }}>{selectedIncident.title}</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                  {selectedIncident.summary || 'No summary generated.'}
                </p>
              </div>

              <div className="grid-cols-2" style={{ backgroundColor: 'var(--bg-primary)', padding: '16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                <div>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600, display: 'block' }}>Department Assignment</span>
                  <span style={{ fontSize: '14px', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                    <Building2 size={16} style={{ color: '#6366f1' }} />
                    <span>{selectedIncident.department}</span>
                  </span>
                </div>
                <div>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600, display: 'block' }}>Registered Location</span>
                  <span style={{ fontSize: '14px', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                    <MapPin size={16} style={{ color: 'var(--accent-teal)' }} />
                    <span>{selectedIncident.location || 'Undetermined'}</span>
                  </span>
                </div>
              </div>

              {/* Grouped Citizen complaints list */}
              <div>
                <h3 style={{ fontSize: '16px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Layers size={16} style={{ color: 'var(--primary)' }} />
                  <span>Clustered Duplicate Complaints ({selectedIncident.duplicate_count})</span>
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {selectedIncident.complaints.map((comp) => (
                    <div 
                      key={comp.id} 
                      style={{ 
                        padding: '14px', 
                        borderRadius: 'var(--radius-sm)', 
                        backgroundColor: 'var(--bg-primary)', 
                        border: '1px solid var(--border-color)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-secondary)' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Calendar size={12} />
                          <span>{new Date(comp.created_at).toLocaleDateString()}</span>
                        </span>
                        {comp.location && (
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <MapPin size={12} />
                            <span>{comp.location}</span>
                          </span>
                        )}
                      </div>
                      
                      <p style={{ fontSize: '13px', color: 'var(--text-primary)' }}>
                        "{comp.raw_text}"
                      </p>

                      {comp.image_url && (
                        <div style={{ marginTop: '4px' }}>
                          <a 
                            href={comp.image_url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            style={{ 
                              display: 'inline-flex', 
                              alignItems: 'center', 
                              gap: '4px', 
                              fontSize: '12px', 
                              color: 'var(--primary)', 
                              textDecoration: 'none' 
                            }}
                          >
                            <FileText size={12} />
                            <span>View Attachment</span>
                            <ExternalLink size={10} />
                          </a>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, color: 'var(--text-muted)', gap: '12px' }}>
              <Layers size={48} />
              <p style={{ fontSize: '15px' }}>Select an incident from the registry to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default OfficerDashboard;
