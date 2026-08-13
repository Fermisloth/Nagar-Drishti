import React from 'react';

interface NeoButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ai' | 'emergency' | 'secondary';
  icon?: React.ReactNode;
}

export const NeoButton: React.FC<NeoButtonProps> = ({
  children,
  variant = 'secondary',
  icon,
  className = '',
  ...props
}) => {
  const variantClass = 
    variant === 'primary' ? 'neo-btn-primary' :
    variant === 'ai' ? 'neo-btn-ai' :
    variant === 'emergency' ? 'neo-btn-emergency' : '';

  return (
    <button className={`neo-btn ${variantClass} ${className}`} {...props}>
      {icon && <span>{icon}</span>}
      {children}
    </button>
  );
};
