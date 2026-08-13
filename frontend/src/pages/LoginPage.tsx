import React, { useState } from 'react';
import { Key, ShieldAlert, HeartHandshake, ChevronDown, CheckCircle2 } from 'lucide-react';
import { NeoCard } from '../components/common/NeoCard';
import { NeoButton } from '../components/common/NeoButton';
import { api } from '../api/api';

interface LoginPageProps {
  onLoginSuccess: (role: 'CITIZEN' | 'OFFICER' | 'ADMIN', username: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [role, setRole] = useState<'CITIZEN' | 'OFFICER'>('OFFICER');
  const [username, setUsername] = useState('Officer Sharma');
  const [token, setToken] = useState('');

  const handleOfficerQuickLogin = () => {
    api.setToken('demo_officer_token_nagardrishti', 'OFFICER', 'Demo Municipal Officer');
    onLoginSuccess('OFFICER', 'Demo Municipal Officer');
  };

  const handleCitizenQuickLogin = () => {
    api.setToken('demo_citizen_token_nagardrishti', 'CITIZEN', 'Demo Citizen User');
    onLoginSuccess('CITIZEN', 'Demo Citizen User');
  };

  const handleSubmitCustom = (e: React.FormEvent) => {
    e.preventDefault();
    const finalToken = token.trim() || 'demo_jwt_token_nagardrishti';
    api.setToken(finalToken, role, username);
    onLoginSuccess(role, username);
  };

  return (
    <div style={{ maxWidth: '520px', margin: '3rem auto 0 auto' }}>
      <NeoCard variant="cyan">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', borderBottom: '3px solid var(--border-color)', paddingBottom: '1rem' }}>
          <ShieldAlert size={28} style={{ color: 'var(--accent-ai)' }} />
          <div>
            <h2 style={{ fontSize: '1.3rem' }}>NAGARDRISHTI AUTHENTICATION</h2>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              1-CLICK EVALUATOR DEMO PORTAL
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
          <NeoButton 
            variant="primary" 
            onClick={handleOfficerQuickLogin}
            style={{ padding: '0.85rem', justifyContent: 'center', fontSize: '1rem' }}
          >
            <ShieldAlert size={20} /> 1-CLICK OFFICER COMMAND DEMO
          </NeoButton>

          <NeoButton 
            variant="ai" 
            onClick={handleCitizenQuickLogin}
            style={{ padding: '0.85rem', justifyContent: 'center', fontSize: '1rem' }}
          >
            <HeartHandshake size={20} /> 1-CLICK CITIZEN INTAKE DEMO
          </NeoButton>
        </div>

        <details style={{ background: 'var(--bg-dark)', border: '2px solid var(--border-color)', padding: '0.75rem 1rem' }}>
          <summary style={{ cursor: 'pointer', fontWeight: 700, fontSize: '0.85rem', fontFamily: 'var(--font-mono)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Key size={14} style={{ color: 'var(--accent-citizen)' }} /> ADVANCED DEVELOPER JWT INJECTION
            </span>
            <ChevronDown size={14} />
          </summary>

          <form onSubmit={handleSubmitCustom} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
            <div>
              <label className="neo-stat-label">SELECT USER ROLE</label>
              <select
                className="neo-select"
                value={role}
                onChange={(e) => setRole(e.target.value as 'CITIZEN' | 'OFFICER')}
              >
                <option value="OFFICER">OFFICER / ADMIN</option>
                <option value="CITIZEN">CITIZEN</option>
              </select>
            </div>

            <div>
              <label className="neo-stat-label">USER NAME / IDENTIFIER</label>
              <input
                type="text"
                className="neo-input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. Officer Sharma"
                required
              />
            </div>

            <div>
              <label className="neo-stat-label">JWT BEARER TOKEN</label>
              <textarea
                className="neo-textarea font-mono"
                style={{ minHeight: '70px', fontSize: '0.85rem' }}
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Paste Bearer JWT token..."
              />
            </div>

            <NeoButton variant="primary" type="submit" style={{ justifyContent: 'center' }}>
              <CheckCircle2 size={16} /> Authenticate Token
            </NeoButton>
          </form>
        </details>
      </NeoCard>
    </div>
  );
};

export default LoginPage;
