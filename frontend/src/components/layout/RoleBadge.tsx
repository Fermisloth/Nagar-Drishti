import React from 'react';
import { ShieldCheck, User, Compass, ShieldAlert } from 'lucide-react';
import type { UserRole } from '../../api/api';

interface RoleBadgeProps {
  role: UserRole;
}

export const RoleBadge: React.FC<RoleBadgeProps> = ({ role }) => {
  const isEvaluator = role === 'EVALUATOR';
  const isAdmin = role === 'ADMIN';
  const isOfficer = role === 'OFFICER';

  const badgeVariant = 
    isEvaluator ? 'purple' :
    isAdmin ? 'lime' :
    isOfficer ? 'rose' : 'yellow';

  const icon = 
    isEvaluator ? <Compass size={14} /> :
    isAdmin ? <ShieldAlert size={14} /> :
    isOfficer ? <ShieldCheck size={14} /> : <User size={14} />;

  return (
    <div className={`neo-badge neo-badge-${badgeVariant}`}>
      {icon}
      <span>ROLE: {role}</span>
    </div>
  );
};
