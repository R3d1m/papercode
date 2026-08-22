import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { TopNav } from './TopNav';
import { Footer } from '../marketing/Footer';
import { ScrollToTop } from '../../routes/ScrollToTop';
import { AuthModal } from '../auth/AuthModal';
import { JoinClassModal } from '../student/JoinClassModal';

export const MainLayout: React.FC = () => {
  const { 
    activeMode, 
    authModalOpen, 
    authInitialTab, 
    closeAuthModal, 
    openAuthModal, 
    joinModalOpen, 
    closeJoinModal, 
    openJoinModal 
  } = useApp();
  
  const location = useLocation();

  const isPublicPage = activeMode === 'marketing' || [
    '/', '/home', '/roadmaps', '/courses', '/pricing', '/blogs'
  ].includes(location.pathname) || location.pathname.startsWith('/courses/') || location.pathname.startsWith('/blogs/');

  return (
    <div className="min-h-screen bg-paper text-ink flex flex-col selection:bg-highlighter selection:text-ink">
      <ScrollToTop />
      
      {/* Universal Top Navigation Header */}
      <TopNav
        onOpenAuth={(tab) => openAuthModal(tab || 'login')}
        onOpenJoinModal={openJoinModal}
      />

      {/* Main Routed Page Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        <main className="flex-1 p-4 sm:p-8 lg:p-10 max-w-7xl w-full mx-auto space-y-12">
          <Outlet />
        </main>

        {/* Footer on Public / Marketing Pages */}
        {isPublicPage && (
          <Footer />
        )}
      </div>

      {/* Global Modals */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={closeAuthModal}
        initialTab={authInitialTab}
      />

      <JoinClassModal
        isOpen={joinModalOpen}
        onClose={closeJoinModal}
      />
    </div>
  );
};
