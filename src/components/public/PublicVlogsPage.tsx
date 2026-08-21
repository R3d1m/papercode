import React from 'react';
import { VlogsSection } from '../marketing/VlogsSection';

interface PublicVlogsPageProps {
  onOpenAuth: (tab: 'login' | 'signup') => void;
}

export const PublicVlogsPage: React.FC<PublicVlogsPageProps> = ({ onOpenAuth }) => {
  return (
    <div className="space-y-12 animate-fadeIn pb-16">
      <VlogsSection onOpenAuth={onOpenAuth} />
    </div>
  );
};
