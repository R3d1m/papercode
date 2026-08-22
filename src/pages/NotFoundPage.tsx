import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { BentoCard } from '../components/common/BentoCard';
import { PillButton } from '../components/common/PillButton';
import { FileQuestion, ArrowLeft, Home, LayoutDashboard, BookOpen } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  const { currentUser, activeMode } = useApp();
  const navigate = useNavigate();

  const isAuthenticated = currentUser && currentUser.id !== 'usr-guest' && activeMode !== 'marketing' && Boolean(currentUser.email);
  const effectiveRole = currentUser?.role || activeMode;

  const handleReturnHome = () => {
    if (!isAuthenticated) {
      navigate('/');
    } else if (effectiveRole === 'teacher') {
      navigate('/teacher/courses');
    } else if (effectiveRole === 'admin') {
      navigate('/admin/vitals');
    } else if (effectiveRole === 'moderator') {
      navigate('/moderator/roadmaps');
    } else {
      navigate('/student/dashboard');
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12 px-4 animate-fadeIn">
      <BentoCard variant="white" className="max-w-lg w-full p-8 sm:p-12 text-center border-2 border-ink shadow-solid-xl space-y-6">
        <div className="w-16 h-16 bg-highlighter border-2 border-ink rounded-2xl flex items-center justify-center mx-auto shadow-solid-sm text-ink">
          <FileQuestion className="w-8 h-8 text-stamp" />
        </div>

        <div className="space-y-2">
          <span className="font-mono text-xs font-extrabold text-stamp uppercase tracking-wider block">
            404 Page Not Found
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-ink">
            Oops! This Khata Page is Missing.
          </h1>
          <p className="text-xs sm:text-sm text-graphite font-bold leading-relaxed">
            The link you followed does not exist or may have been moved. Let's get you back on track!
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <PillButton
            variant="primary"
            size="md"
            onClick={handleReturnHome}
            className="w-full sm:w-auto btn-bounce shadow-solid-xs"
            icon={isAuthenticated ? <LayoutDashboard className="w-4 h-4" /> : <Home className="w-4 h-4" />}
          >
            {isAuthenticated ? 'Back to Dashboard ➔' : 'Back to Home ➔'}
          </PillButton>
          <PillButton
            variant="secondary"
            size="md"
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto btn-bounce"
            icon={<ArrowLeft className="w-4 h-4" />}
          >
            Go Back
          </PillButton>
        </div>
      </BentoCard>
    </div>
  );
};
