import React, { useState } from 'react';
import { Key, X, ShieldAlert, ChevronDown, CheckCircle2 } from 'lucide-react';
import { api, type UserRole } from '../../api/api';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (role: UserRole, username: string) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [tokenInput, setTokenInput] = useState('');
  const [roleSelect, setRoleSelect] = useState<UserRole>('EVALUATOR');
  const [usernameInput, setUsernameInput] = useState('SIH Evaluator');

  if (!isOpen) return null;

  const handleCustomTokenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tokenInput.trim()) {
      alert('Please enter a valid JWT token string.');
      return;
    }

    api.setToken(tokenInput.trim(), roleSelect, usernameInput.trim());
    onLoginSuccess(roleSelect, usernameInput.trim());
    onClose();
  };

  return (
    <div className="neo-modal-backdrop" onClick={onClose}>
      <div className="neo-modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldAlert style={{ color: 'var(--accent-ai)' }} size={24} />
            <h2 style={{ fontSize: '1.2rem' }}>RBAC & PORTAL AUTHENTICATION</h2>
          </div>
          <button onClick={onClose} className="neo-btn" style={{ padding: '0.2rem 0.5rem' }}>
            <X size={18} />
          </button>
        </div>

        <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '1.25rem' }}>
          Select 1-click access role for evaluator preview or test strict government RBAC navigation.
        </p>

        {/* 1-Click Action Buttons removed for security audit */}

        {/* Advanced Developer Mode Accordion */}
        <details style={{ background: 'var(--bg-dark)', border: '2px solid var(--border-color)', padding: '0.75rem 1rem' }}>
          <summary style={{ cursor: 'pointer', fontWeight: 700, fontSize: '0.85rem', fontFamily: 'var(--font-mono)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Key size={14} style={{ color: 'var(--accent-citizen)' }} /> ADVANCED / DEVELOPER JWT ENTRY
            </span>
            <ChevronDown size={14} />
          </summary>

          <form onSubmit={handleCustomTokenSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
            <div>
              <label className="neo-stat-label">USER ROLE</label>
              <select 
                value={roleSelect} 
                onChange={(e) => setRoleSelect(e.target.value as UserRole)}
                className="neo-select"
              >
                <option value="EVALUATOR">EVALUATOR (Full System Access)</option>
                <option value="ADMIN">ADMIN (All Workspaces)</option>
                <option value="OFFICER">OFFICER (Console & Explorer)</option>
                <option value="CITIZEN">CITIZEN (Intake Only)</option>
              </select>
            </div>

            <div>
              <label className="neo-stat-label">USER IDENTIFIER</label>
              <input 
                type="text" 
                className="neo-input" 
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                placeholder="e.g. Officer Sharma"
              />
            </div>

            <div>
              <label className="neo-stat-label">RAW JWT BEARER TOKEN</label>
              <textarea 
                className="neo-textarea font-mono"
                style={{ minHeight: '60px', fontSize: '0.8rem' }}
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                placeholder="Paste Bearer eyJhbGciOi..."
              />
            </div>

            <button type="submit" className="neo-btn neo-btn-ai" style={{ justifyContent: 'center' }}>
              <CheckCircle2 size={16} /> Inject Custom Token
            </button>
          </form>
        </details>
      </div>
    </div>
  );
};
