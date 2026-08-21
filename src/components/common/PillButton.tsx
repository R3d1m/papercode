import React from 'react';

interface PillButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'highlighter' | 'stamp' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

export const PillButton: React.FC<PillButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'right',
  onClick,
  className = '',
  disabled = false
}) => {
  const baseStyles = "inline-flex items-center justify-center font-extrabold tracking-tight rounded-full transition-all duration-150 border-2 border-ink cursor-pointer select-none active:translate-y-0.5 active:shadow-none";
  
  const sizeStyles = {
    sm: "px-3.5 py-1.5 text-xs",
    md: "px-5 py-2.5 text-sm",
    lg: "px-7 py-3.5 text-base"
  };

  // Joyful high-contrast palette: Canary Yellow, Orange Stamp, Clean White (No dull full black buttons!)
  const variantStyles = {
    primary: "bg-highlighter text-ink hover:bg-highlighter-hover shadow-solid-sm font-extrabold",
    secondary: "bg-white text-ink hover:bg-paper-muted shadow-solid-sm font-bold",
    highlighter: "bg-highlighter text-ink hover:bg-highlighter-hover shadow-solid-sm font-extrabold",
    stamp: "bg-stamp text-white hover:bg-stamp-dark shadow-solid-sm font-extrabold",
    ghost: "bg-transparent text-ink border-transparent hover:bg-ink/5 font-bold"
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {icon && iconPosition === 'left' && <span className="mr-2">{icon}</span>}
      <span>{children}</span>
      {icon && iconPosition === 'right' && <span className="ml-2">{icon}</span>}
    </button>
  );
};
