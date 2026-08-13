import { useState } from 'react';
import { CitizenPortal } from './pages/CitizenPortal';
import { OfficerDashboard } from './pages/OfficerDashboard';
import { HealthMonitor } from './pages/HealthMonitor';
import { Brain, HeartHandshake, ShieldAlert, Cpu } from 'lucide-react';

type Page = 'citizen' | 'officer' | 'health';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('citizen');

  return (
    <div className="app-container">
      {/* Navbar Section */}
      <nav className="navbar">
        <div className="navbar-inner">
          <a href="#" onClick={() => setCurrentPage('citizen')} className="brand">
            <Brain size={24} style={{ color: '#6366f1' }} />
            <span>Nagar<span className="brand-accent">Drishti</span></span>
          </a>

          <div className="nav-links">
            <button 
              onClick={() => setCurrentPage('citizen')} 
              className={`nav-link btn-secondary ${currentPage === 'citizen' ? 'active' : ''}`}
              style={{ border: 'none', background: 'none', cursor: 'pointer' }}
            >
              <HeartHandshake size={16} />
              <span>Citizen Portal</span>
            </button>
            <button 
              onClick={() => setCurrentPage('officer')} 
              className={`nav-link btn-secondary ${currentPage === 'officer' ? 'active' : ''}`}
              style={{ border: 'none', background: 'none', cursor: 'pointer' }}
            >
              <ShieldAlert size={16} />
              <span>Officer Console</span>
            </button>
            <button 
              onClick={() => setCurrentPage('health')} 
              className={`nav-link btn-secondary ${currentPage === 'health' ? 'active' : ''}`}
              style={{ border: 'none', background: 'none', cursor: 'pointer' }}
            >
              <Cpu size={16} />
              <span>System Health</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main content body */}
      <main className="main-content">
        {currentPage === 'citizen' && <CitizenPortal />}
        {currentPage === 'officer' && <OfficerDashboard />}
        {currentPage === 'health' && <HealthMonitor />}
      </main>
    </div>
  );
}

export default App;
