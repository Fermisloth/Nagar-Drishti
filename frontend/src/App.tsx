import { useState, useEffect } from 'react';
import './assets/styles/brutalism.css';
import './assets/styles/components.css';
import { BrutalistNavbar, type ActivePage } from './components/layout/BrutalistNavbar';
import { LoginModal } from './components/layout/LoginModal';
import CitizenPortal from './pages/CitizenPortal';
import OfficerDashboard from './pages/OfficerDashboard';
import IntelligenceExplorerPage from './pages/IntelligenceExplorerPage';
import HealthMonitor from './pages/HealthMonitor';
import { api, type UserRole } from './api/api';

const ROLE_PERMISSIONS: Record<UserRole, ActivePage[]> = {
  CITIZEN: ['citizen'],
  OFFICER: ['officer', 'intelligence'],
  ADMIN: ['citizen', 'officer', 'intelligence', 'health'],
  EVALUATOR: ['citizen', 'officer', 'intelligence', 'health']
};

function App() {
  const [currentPage, setCurrentPage] = useState<ActivePage>('officer');
  const [userRole, setUserRole] = useState<UserRole>('OFFICER');
  const [username, setUsername] = useState('Municipal Officer');
  // Default is Evaluator Mode OFF -> STRICT RBAC BY DEFAULT
  const [isEvaluatorMode, setIsEvaluatorMode] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    // Check if session exists in localStorage
    const session = api.getSession();
    if (session) {
      setUserRole(session.role);
      setUsername(session.username);
      
      // Ensure initial page matches role permissions if strictly in RBAC mode
      if (!isEvaluatorMode) {
        const allowed = ROLE_PERMISSIONS[session.role] || ['citizen'];
        if (!allowed.includes(currentPage)) {
          setCurrentPage(allowed[0]);
        }
      }
    }
  }, []);

  const handleLoginSuccess = (role: UserRole, name: string) => {
    setUserRole(role);
    setUsername(name);

    // If Evaluator mode is OFF and new role cannot access current page, fallback to first allowed page
    if (!isEvaluatorMode) {
      const allowed = ROLE_PERMISSIONS[role] || ['citizen'];
      if (!allowed.includes(currentPage)) {
        setCurrentPage(allowed[0]);
      }
    }
  };

  const handleToggleEvaluatorMode = () => {
    setIsEvaluatorMode(prev => {
      const nextMode = !prev;
      // If toggling strict RBAC ON (isEvaluatorMode becomes false), ensure current page is allowed
      if (!nextMode) {
        const allowed = ROLE_PERMISSIONS[userRole] || ['citizen'];
        if (!allowed.includes(currentPage)) {
          setCurrentPage(allowed[0]);
        }
      }
      return nextMode;
    });
  };

  return (
    <div className="app-viewport">
      {/* Neo-Brutalist Navbar */}
      <BrutalistNavbar
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        userRole={userRole}
        username={username}
        isEvaluatorMode={isEvaluatorMode}
        onToggleEvaluatorMode={handleToggleEvaluatorMode}
        onOpenLoginModal={() => setIsLoginModalOpen(true)}
      />

      {/* Main Workspace Area */}
      <main className="main-workspace">
        {currentPage === 'citizen' && <CitizenPortal />}
        {currentPage === 'officer' && <OfficerDashboard />}
        {currentPage === 'intelligence' && <IntelligenceExplorerPage />}
        {currentPage === 'health' && <HealthMonitor />}
      </main>

      {/* Auth & Token Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}

export default App;
