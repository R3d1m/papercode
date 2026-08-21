import React from 'react';

interface BentoCardProps {
  children: React.ReactNode;
  variant?: 'white' | 'kraft' | 'ink' | 'highlighter';
  className?: string;
  withBorder?: boolean;
  shadow?: 'none' | 'sm' | 'md' | 'lg';
}

export const BentoCard: React.FC<BentoCardProps> = ({
  children,
  variant = 'white',
  className = '',
  withBorder = true,
  shadow = 'md'
}) => {
  const bgStyles = {
    white: 'bg-white text-ink',
    kraft: 'bg-paper-muted text-ink',
    ink: 'bg-ink text-white',
    highlighter: 'bg-highlighter text-ink'
  };

  const shadowStyles = {
    none: '',
    sm: 'shadow-solid-sm',
    md: 'shadow-solid-md',
    lg: 'shadow-solid-lg'
  };

  return (
    <div
      className={`${bgStyles[variant]} ${withBorder ? 'border-[2px] border-ink' : ''} rounded-bento p-6 sm:p-8 ${shadowStyles[shadow]} transition-all duration-200 ${className}`}
    >
      {children}
    </div>
  );
};
