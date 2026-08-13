import React from 'react';
import { Brain, HeartHandshake, ShieldAlert, Cpu, Activity, Key, Sliders, ShieldCheck } from 'lucide-react';
import { RoleBadge } from './RoleBadge';
import type { UserRole } from '../../api/api';

export type ActivePage = 'citizen' | 'officer' | 'intelligence' | 'health';

const ROLE_PERMISSIONS: Record<UserRole, ActivePage[]> = {
  CITIZEN: ['citizen'],
  OFFICER: ['officer', 'intelligence'],
  ADMIN: ['citizen', 'officer', 'intelligence', 'health'],
  EVALUATOR: ['citizen', 'officer', 'intelligence', 'health']
};

interface BrutalistNavbarProps {
  currentPage: ActivePage;
  onPageChange: (page: ActivePage) => void;
  userRole: UserRole;
  username: string;
  isEvaluatorMode: boolean;
  onToggleEvaluatorMode: () => void;
  onOpenLoginModal: () => void;
}

export const BrutalistNavbar: React.FC<BrutalistNavbarProps> = ({
  currentPage,
  onPageChange,
  userRole,
  isEvaluatorMode,
  onToggleEvaluatorMode,
  onOpenLoginModal,
}) => {
  const allowedPages = isEvaluatorMode 
    ? ['citizen', 'officer', 'intelligence', 'health'] as ActivePage[]
    : ROLE_PERMISSIONS[userRole] || ['citizen'];

  return (
    <nav className="neo-navbar">
      <div className="neo-navbar-inner">
        {/* Brand */}
        <a href="#" onClick={(e) => { e.preventDefault(); onPageChange(allowedPages[0] || 'citizen'); }} className="neo-brand">
          <Brain size={26} style={{ color: 'var(--accent-ai)' }} />
          <span>Nagar<span style={{ color: 'var(--accent-citizen)' }}>Drishti</span></span>
        </a>

        {/* View Switcher Buttons (Filtered strictly by RBAC unless Evaluator Mode override is active) */}
        <div className="neo-nav-links">
          {allowedPages.includes('citizen') && (
            <button 
              onClick={() => onPageChange('citizen')}
              className={`neo-btn ${currentPage === 'citizen' ? 'neo-btn-active' : ''}`}
            >
              <HeartHandshake size={16} />
              <span>Citizen Intake</span>
            </button>
          )}

          {allowedPages.includes('officer') && (
            <button 
              onClick={() => onPageChange('officer')}
              className={`neo-btn ${currentPage === 'officer' ? 'neo-btn-active' : ''}`}
            >
              <ShieldAlert size={16} />
              <span>Officer Console</span>
            </button>
          )}

          {allowedPages.includes('intelligence') && (
            <button 
              onClick={() => onPageChange('intelligence')}
              className={`neo-btn ${currentPage === 'intelligence' ? 'neo-btn-active' : ''}`}
            >
              <Cpu size={16} style={{ color: currentPage === 'intelligence' ? '#000' : 'var(--accent-ai)' }} />
              <span>Intelligence Explorer</span>
            </button>
          )}

          {allowedPages.includes('health') && (
            <button 
              onClick={() => onPageChange('health')}
              className={`neo-btn ${currentPage === 'health' ? 'neo-btn-active' : ''}`}
            >
              <Activity size={16} />
              <span>System Health</span>
            </button>
          )}
        </div>

        {/* Status Indicators & Auth Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {/* Active Role Badge */}
          <RoleBadge role={userRole} />

          {/* Mode Status Indicator Button */}
          <button
            onClick={onToggleEvaluatorMode}
            className="neo-btn"
            style={{
              padding: '0.35rem 0.65rem',
              fontSize: '0.75rem',
              background: isEvaluatorMode ? 'var(--accent-purple)' : 'var(--bg-surface)',
              color: isEvaluatorMode ? '#000' : 'var(--text-main)',
              borderColor: 'var(--border-color)'
            }}
            title={isEvaluatorMode ? "MODE: EVALUATOR active (Manual override showing all workspaces for SIH judging)" : "MODE: STRICT RBAC active (Default government role-restricted navigation)"}
          >
            {isEvaluatorMode ? <Sliders size={12} /> : <ShieldCheck size={12} style={{ color: 'var(--accent-success)' }} />}
            <span>MODE: {isEvaluatorMode ? 'EVALUATOR' : 'STRICT RBAC'}</span>
          </button>
          
          <button 
            onClick={onOpenLoginModal} 
            className="neo-btn neo-btn-ai"
            style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
            title="Switch User Role / Manage Auth"
          >
            <Key size={12} />
            <span>Auth Port</span>
          </button>
        </div>
      </div>
    </nav>
  );
};
