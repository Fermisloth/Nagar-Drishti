import React from 'react';

interface NeoCardProps {
  children: React.ReactNode;
  variant?: 'default' | 'cyan' | 'yellow' | 'emergency';
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

export const NeoCard: React.FC<NeoCardProps> = ({
  children,
  variant = 'default',
  className = '',
  style,
  onClick
}) => {
  const variantClass = 
    variant === 'cyan' ? 'neo-card-cyan' :
    variant === 'yellow' ? 'neo-card-yellow' :
    variant === 'emergency' ? 'neo-card-emergency' : '';

  return (
    <div 
      className={`neo-card ${variantClass} ${className}`} 
      style={{ cursor: onClick ? 'pointer' : 'default', ...style }}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
