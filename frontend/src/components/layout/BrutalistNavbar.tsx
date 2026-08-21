import React from 'react';
import { ShieldCheck, HeartHandshake, ShieldAlert, Cpu, Activity, LogIn } from 'lucide-react';
import { RoleBadge } from './RoleBadge';
import type { UserRole } from '../../api/api';

export type ActivePage = 'citizen' | 'officer' | 'intelligence' | 'health';

const ROLE_PERMISSIONS: Record<UserRole, ActivePage[]> = {
  CITIZEN: ['citizen'],
  OFFICER: ['officer', 'intelligence', 'health'],
  ADMIN: ['citizen', 'officer', 'intelligence', 'health'],
  EVALUATOR: ['citizen', 'officer', 'intelligence', 'health']
};

interface NavbarProps {
  currentPage: ActivePage;
  onPageChange: (page: ActivePage) => void;
  userRole: UserRole;
  username: string;
  isEvaluatorMode: boolean;
  onOpenLoginModal: () => void;
}

export const BrutalistNavbar: React.FC<NavbarProps> = ({
  currentPage,
  onPageChange,
  userRole,
  isEvaluatorMode,
  onOpenLoginModal,
}) => {
  const allowedPages = isEvaluatorMode 
    ? (['citizen', 'officer', 'intelligence', 'health'] as ActivePage[])
    : ROLE_PERMISSIONS[userRole] || ['citizen'];

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        {/* Brand */}
        <a href="#" onClick={(e) => { e.preventDefault(); onPageChange(allowedPages[0] || 'citizen'); }} className="brand">
          <ShieldCheck size={28} />
          <span>NagarDrishti</span>
        </a>

        {/* View Switcher Buttons */}
        <div className="nav-links">
          {allowedPages.includes('citizen') && (
            <button 
              onClick={() => onPageChange('citizen')}
              className={`btn ${currentPage === 'citizen' ? 'btn-primary' : 'btn-secondary'}`}
            >
              <HeartHandshake size={16} />
              <span>Report Civic Problem</span>
            </button>
          )}

          {allowedPages.includes('officer') && (
            <button 
              onClick={() => onPageChange('officer')}
              className={`btn ${currentPage === 'officer' ? 'btn-primary' : 'btn-secondary'}`}
            >
              <ShieldAlert size={16} />
              <span>Officer Dashboard</span>
            </button>
          )}

          {allowedPages.includes('intelligence') && (
            <button 
              onClick={() => onPageChange('intelligence')}
              className={`btn ${currentPage === 'intelligence' ? 'btn-primary' : 'btn-secondary'}`}
            >
              <Cpu size={16} />
              <span>System Analytics</span>
            </button>
          )}

          {allowedPages.includes('health') && (
            <button 
              onClick={() => onPageChange('health')}
              className={`btn ${currentPage === 'health' ? 'btn-primary' : 'btn-secondary'}`}
            >
              <Activity size={16} />
              <span>System Health</span>
            </button>
          )}
        </div>

        {/* Status Indicators & Auth Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Active Role Badge */}
          <RoleBadge role={userRole} />
          
          {userRole !== 'CITIZEN' ? (
            <button 
              onClick={() => {
                localStorage.removeItem('nagardrishti_token');
                localStorage.removeItem('nagardrishti_role');
                localStorage.removeItem('nagardrishti_username');
                window.location.reload();
              }} 
              className="btn btn-secondary"
              title="Log Out"
              style={{ color: 'var(--accent-emergency)' }}
            >
              <span>Log Out</span>
            </button>
          ) : (
            <button 
              onClick={onOpenLoginModal} 
              className="btn btn-secondary"
              title="Log In"
            >
              <LogIn size={16} />
              <span>Log In</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

