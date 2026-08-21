import React from 'react';

export type NeoBadgeVariant = 'cyan' | 'yellow' | 'lime' | 'rose' | 'amber' | 'purple' | 'dark' | 'live' | 'simulated' | 'demo' | 'primary' | 'danger' | 'warning' | 'success';

interface NeoBadgeProps {
  children: React.ReactNode;
  variant?: NeoBadgeVariant;
  className?: string;
  style?: React.CSSProperties;
}

export const NeoBadge: React.FC<NeoBadgeProps> = ({ 
  children, 
  variant = 'cyan',
  className = '',
  style
}) => {
  const variantClass = 
    variant === 'live' ? 'neo-badge-lime' :
    variant === 'simulated' ? 'neo-badge-purple' :
    variant === 'demo' ? 'neo-badge-amber' :
    `neo-badge-${variant}`;

  return (
    <span className={`neo-badge ${variantClass} ${className}`} style={style}>
      {children}
    </span>
  );
};
