import React from 'react';

interface UserAvatarProps {
  name?: string;
  avatar?: string | null;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  className?: string;
  border?: boolean;
}

const COLOR_PALETTE = [
  { bg: 'bg-[#1a73e8]', text: 'text-white' }, // Google Blue
  { bg: 'bg-[#d93025]', text: 'text-white' }, // Google Red
  { bg: 'bg-[#188038]', text: 'text-white' }, // Google Green
  { bg: 'bg-[#f29900]', text: 'text-white' }, // Google Yellow/Amber
  { bg: 'bg-[#9334e6]', text: 'text-white' }, // Google Purple
  { bg: 'bg-[#e52592]', text: 'text-white' }, // Google Pink
  { bg: 'bg-[#00897b]', text: 'text-white' }, // Google Teal
  { bg: 'bg-[#3949ab]', text: 'text-white' }, // Google Indigo
  { bg: 'bg-[#f97316]', text: 'text-white' }, // Google Orange
  { bg: 'bg-[#0284c7]', text: 'text-white' }  // Google Sky
];

export function getInitialChar(name?: string): string {
  if (!name || !name.trim()) return '?';
  const clean = name.trim().replace(/^(Dr\.|Engr\.|Prof\.|Mr\.|Mrs\.|Ms\.)\s*/i, '');
  const parts = clean.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  return parts[0].charAt(0).toUpperCase();
}

export function getGoogleAvatarColor(name?: string) {
  if (!name) return COLOR_PALETTE[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % COLOR_PALETTE.length;
  return COLOR_PALETTE[index];
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
  name = 'User',
  avatar,
  size = 'md',
  className = '',
  border = true
}) => {
  const initial = getInitialChar(name);
  const color = getGoogleAvatarColor(name);

  const sizeClasses = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-xl',
    '2xl': 'w-20 h-20 text-2xl',
    '3xl': 'w-24 h-24 text-3xl'
  }[size];

  // If avatar is an actual user-uploaded image or google profile photo (not an unsplash placeholder)
  const isCustomPhoto = avatar && 
    !avatar.includes('unsplash.com') && 
    (avatar.startsWith('data:image/') || avatar.includes('googleusercontent.com') || avatar.startsWith('blob:'));

  if (isCustomPhoto) {
    return (
      <img
        src={avatar}
        alt={name}
        className={`${sizeClasses} rounded-full object-cover select-none ${border ? 'border-2 border-ink shadow-solid-xs' : ''} ${className}`}
      />
    );
  }

  return (
    <div
      className={`${sizeClasses} ${color.bg} ${color.text} rounded-full flex items-center justify-center font-extrabold select-none uppercase tracking-wide flex-shrink-0 ${border ? 'border-2 border-ink shadow-solid-xs' : ''} ${className}`}
      title={name}
      aria-label={name}
    >
      <span>{initial}</span>
    </div>
  );
};
