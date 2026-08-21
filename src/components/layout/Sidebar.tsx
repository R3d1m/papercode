import React from 'react';
import { useApp } from '../../context/AppContext';
import { PillButton } from '../common/PillButton';
import { 
  Home, 
  BookOpen, 
  Sparkles, 
  Users, 
  Award, 
  Flame, 
  KeyRound, 
  Layers, 
  Compass, 
  FileCode, 
  BarChart3, 
  GraduationCap, 
  ShieldCheck, 
  Building2, 
  X, 
  LogOut, 
  Trees,
  LogIn,
  UserPlus
} from 'lucide-react';

interface SidebarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onOpenJoinModal: () => void;
  onOpenAuth: (tab: 'login' | 'signup') => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  setCurrentView,
  isOpen,
  setIsOpen,
  onOpenJoinModal,
  onOpenAuth
}) => {
  const { activeMode, setActiveMode, switchRole, logout, currentUser, studentXp, studentStreak } = useApp();

  const handleRoleChange = (role: 'marketing' | 'student' | 'teacher' | 'moderator' | 'admin') => {
    if (role === 'marketing') {
      setActiveMode('marketing');
      setCurrentView('hero');
    } else {
      switchRole(role);
      if (role === 'student') setCurrentView('student_dashboard');
      if (role === 'teacher') setCurrentView('teacher_builder');
      if (role === 'moderator') setCurrentView('admin_cms');
      if (role === 'admin') setCurrentView('admin_vitals');
    }
  };

  const scrollToSection = (id: string) => {
    setIsOpen(false);
    if (activeMode !== 'marketing') {
      setActiveMode('marketing');
    }
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 bg-ink/60 backdrop-blur-sm lg:hidden animate-fadeIn"
        />
      )}

      {/* Sidebar Container */}
      <aside className={'fixed top-0 bottom-0 left-0 z-50 w-72 bg-paper-card border-r-2 border-ink p-6 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 shadow-solid-md ' + (isOpen ? 'translate-x-0' : '-translate-x-full')}>
        
        <div className="space-y-5 overflow-y-auto pr-1">
          
          {/* Top Brand Logo */}
          <div className="flex items-center justify-between pb-3 border-b-2 border-ink/15">
            <div 
              onClick={() => handleRoleChange('marketing')}
              className="flex items-center space-x-3 cursor-pointer select-none group"
            >
              <div className="w-10 h-10 rounded-2xl bg-highlighter border-2 border-ink flex items-center justify-center font-extrabold text-ink shadow-solid-sm group-hover:rotate-12 transition-transform">
                ✏️
              </div>
              <div>
                <span className="font-extrabold text-xl tracking-tight text-ink block leading-none">PaperCode</span>
                <span className="text-[10px] font-mono text-stamp font-extrabold uppercase">Bangladesh 🇧🇩</span>
              </div>
            </div>

            <button 
              onClick={() => setIsOpen(false)}
              className="lg:hidden p-1.5 rounded-full border border-ink/30 hover:bg-paper-muted text-ink"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* GUEST MARKETING MODE: PROMINENT SIGN IN & SIGN UP CTAS */}
          {activeMode === 'marketing' && (
            <div className="p-3.5 bg-paper-muted border-2 border-ink/30 rounded-2xl space-y-2.5 shadow-solid-xs">
              <span className="text-[10px] font-mono font-extrabold text-stamp uppercase block text-center">
                Welcome to PaperCode
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => { onOpenAuth('signup'); setIsOpen(false); }}
                  className="w-full py-2 px-2.5 bg-highlighter hover:bg-highlighter-hover text-ink border-2 border-ink rounded-xl text-xs font-extrabold shadow-solid-xs flex items-center justify-center gap-1 btn-bounce"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Sign Up</span>
                </button>

                <button
                  type="button"
                  onClick={() => { onOpenAuth('login'); setIsOpen(false); }}
                  className="w-full py-2 px-2.5 bg-white hover:bg-paper-light text-ink border-2 border-ink rounded-xl text-xs font-extrabold shadow-solid-xs flex items-center justify-center gap-1 btn-bounce"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </button>
              </div>
            </div>
          )}

          {/* Mode / Role Switcher */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-mono font-bold text-graphite uppercase tracking-wider block px-1">
              Select Workspace
            </span>

            <div className="grid grid-cols-2 gap-1.5 p-1 bg-paper-muted border-2 border-ink/30 rounded-2xl text-xs font-extrabold">
              <button
                onClick={() => handleRoleChange('marketing')}
                className={'py-2 px-2 rounded-xl transition-all text-center flex items-center justify-center gap-1 ' + (activeMode === 'marketing' ? 'bg-highlighter text-ink border border-ink shadow-solid-xs font-extrabold' : 'text-graphite hover:text-ink')}
              >
                <span>🌐 Public</span>
              </button>

              <button
                onClick={() => handleRoleChange('student')}
                className={'py-2 px-2 rounded-xl transition-all text-center flex items-center justify-center gap-1 ' + (activeMode === 'student' ? 'bg-highlighter text-ink border border-ink shadow-solid-xs font-extrabold' : 'text-graphite hover:text-ink')}
              >
                <span>🎒 Student</span>
              </button>

              <button
                onClick={() => handleRoleChange('teacher')}
                className={'py-2 px-2 rounded-xl transition-all text-center flex items-center justify-center gap-1 ' + (activeMode === 'teacher' ? 'bg-highlighter text-ink border border-ink shadow-solid-xs font-extrabold' : 'text-graphite hover:text-ink')}
              >
                <span>👩‍🏫 Teacher</span>
              </button>

              <button
                onClick={() => handleRoleChange('admin')}
                className={'py-2 px-2 rounded-xl transition-all text-center flex items-center justify-center gap-1 ' + (activeMode === 'admin' || activeMode === 'moderator' ? 'bg-highlighter text-ink border border-ink shadow-solid-xs font-extrabold' : 'text-graphite hover:text-ink')}
              >
                <span>⚡ Admin HQ</span>
              </button>
            </div>
          </div>

          {/* Active User Quick Card (if logged in) */}
          {activeMode !== 'marketing' && (
            <div className="p-3.5 bg-paper-light border-2 border-ink/20 rounded-2xl flex items-center space-x-3">
              <img src={currentUser.avatar} alt={currentUser.name} className="w-10 h-10 rounded-full border-2 border-ink object-cover" />
              <div className="overflow-hidden">
                <strong className="text-xs text-ink font-extrabold truncate block">{currentUser.name}</strong>
                {activeMode === 'student' ? (
                  <div className="flex items-center space-x-2 text-[10px] font-mono font-bold text-stamp">
                    <span>🔥 {studentStreak}d Streak</span>
                    <span>💎 {studentXp} XP</span>
                  </div>
                ) : (
                  <span className="text-[10px] text-graphite font-bold uppercase truncate block">{currentUser.school || 'CUET ICT Hub'}</span>
                )}
              </div>
            </div>
          )}

          {/* Navigation Links per Role */}
          <nav className="space-y-1">
            <span className="text-[10px] font-mono font-bold text-graphite uppercase tracking-wider block px-1 pb-1">
              {activeMode === 'student' && 'Student Navigation'}
              {activeMode === 'teacher' && 'Teacher Tools'}
              {activeMode === 'moderator' && 'Curriculum Moderator'}
              {activeMode === 'admin' && 'Admin Governance'}
              {activeMode === 'marketing' && 'Explore Landing Page'}
            </span>

            {/* 1. STUDENT NAVIGATION */}
            {activeMode === 'student' && (
              <div className="space-y-1.5">
                <button
                  onClick={() => { setCurrentView('student_dashboard'); setIsOpen(false); }}
                  className={'w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl font-extrabold text-xs transition-all btn-bounce ' + (currentView === 'student_dashboard' ? 'bg-highlighter text-ink border-2 border-ink shadow-solid-sm' : 'text-ink hover:bg-paper-muted border border-transparent')}
                >
                  <Home className="w-4 h-4" />
                  <span>Quest Dashboard</span>
                </button>

                <button
                  onClick={() => { setCurrentView('student_classrooms'); setIsOpen(false); }}
                  className={'w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl font-extrabold text-xs transition-all btn-bounce ' + (currentView === 'student_classrooms' || currentView === 'student_classroom_detail' ? 'bg-highlighter text-ink border-2 border-ink shadow-solid-sm' : 'text-ink hover:bg-paper-muted border border-transparent')}
                >
                  <Users className="w-4 h-4" />
                  <span>My Classrooms</span>
                </button>

                <button
                  onClick={() => { setCurrentView('student_roadmaps'); setIsOpen(false); }}
                  className={'w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl font-extrabold text-xs transition-all btn-bounce ' + (currentView === 'student_roadmaps' ? 'bg-highlighter text-ink border-2 border-ink shadow-solid-sm' : 'text-ink hover:bg-paper-muted border border-transparent')}
                >
                  <Compass className="w-4 h-4" />
                  <span>Public Roadmaps</span>
                </button>
              </div>
            )}

            {/* 2. TEACHER NAVIGATION */}
            {activeMode === 'teacher' && (
              <div className="space-y-1.5">
                <button
                  onClick={() => { setCurrentView('teacher_builder'); setIsOpen(false); }}
                  className={'w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl font-extrabold text-xs transition-all btn-bounce ' + (currentView === 'teacher_builder' ? 'bg-stamp text-white border-2 border-ink shadow-solid-sm' : 'text-ink hover:bg-paper-muted border border-transparent')}
                >
                  <Sparkles className="w-4 h-4" />
                  <span>✨ Create Lessons & Exercises</span>
                </button>

                <button
                  onClick={() => { setCurrentView('teacher_gradebook'); setIsOpen(false); }}
                  className={'w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl font-extrabold text-xs transition-all btn-bounce ' + (currentView === 'teacher_gradebook' ? 'bg-highlighter text-ink border-2 border-ink shadow-solid-sm' : 'text-ink hover:bg-paper-muted border border-transparent')}
                >
                  <Award className="w-4 h-4" />
                  <span>Batch Gradebook</span>
                </button>

                <button
                  onClick={() => { setCurrentView('teacher_classrooms'); setIsOpen(false); }}
                  className={'w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl font-extrabold text-xs transition-all btn-bounce ' + (currentView === 'teacher_classrooms' ? 'bg-highlighter text-ink border-2 border-ink shadow-solid-sm' : 'text-ink hover:bg-paper-muted border border-transparent')}
                >
                  <Users className="w-4 h-4" />
                  <span>Classrooms & Join Codes</span>
                </button>

                <button
                  onClick={() => { setCurrentView('teacher_analytics'); setIsOpen(false); }}
                  className={'w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl font-extrabold text-xs transition-all btn-bounce ' + (currentView === 'teacher_analytics' ? 'bg-highlighter text-ink border-2 border-ink shadow-solid-sm' : 'text-ink hover:bg-paper-muted border border-transparent')}
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>Error Analytics</span>
                </button>
              </div>
            )}

            {/* 3. MODERATOR NAVIGATION */}
            {activeMode === 'moderator' && (
              <div className="space-y-1.5">
                <button
                  onClick={() => { setCurrentView('admin_cms'); setIsOpen(false); }}
                  className={'w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl font-extrabold text-xs transition-all btn-bounce ' + (currentView === 'admin_cms' ? 'bg-highlighter text-ink border-2 border-ink shadow-solid-sm' : 'text-ink hover:bg-paper-muted border border-transparent')}
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Master Curriculum & Roadmaps</span>
                </button>

                <button
                  onClick={() => { setCurrentView('teacher_builder'); setIsOpen(false); }}
                  className={'w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl font-extrabold text-xs transition-all btn-bounce ' + (currentView === 'teacher_builder' ? 'bg-stamp text-white border-2 border-ink shadow-solid-sm' : 'text-ink hover:bg-paper-muted border border-transparent')}
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Author Courses & Lessons</span>
                </button>
              </div>
            )}

            {/* 4. ADMIN NAVIGATION */}
            {activeMode === 'admin' && (
              <div className="space-y-1.5">
                <button
                  onClick={() => { setCurrentView('admin_vitals'); setIsOpen(false); }}
                  className={'w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl font-extrabold text-xs transition-all btn-bounce ' + (currentView === 'admin_vitals' ? 'bg-highlighter text-ink border-2 border-ink shadow-solid-sm' : 'text-ink hover:bg-paper-muted border border-transparent')}
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Platform Vitals & OCR</span>
                </button>

                <button
                  onClick={() => { setCurrentView('admin_cms'); setIsOpen(false); }}
                  className={'w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl font-extrabold text-xs transition-all btn-bounce ' + (currentView === 'admin_cms' ? 'bg-highlighter text-ink border-2 border-ink shadow-solid-sm' : 'text-ink hover:bg-paper-muted border border-transparent')}
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Curriculum CMS & Roadmaps</span>
                </button>

                <button
                  onClick={() => { setCurrentView('admin_moderators'); setIsOpen(false); }}
                  className={'w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl font-extrabold text-xs transition-all btn-bounce ' + (currentView === 'admin_moderators' ? 'bg-highlighter text-ink border-2 border-ink shadow-solid-sm' : 'text-ink hover:bg-paper-muted border border-transparent')}
                >
                  <Users className="w-4 h-4 text-stamp" />
                  <span>Moderator Team</span>
                </button>

                <button
                  onClick={() => { setCurrentView('admin_institutions'); setIsOpen(false); }}
                  className={'w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl font-extrabold text-xs transition-all btn-bounce ' + (currentView === 'admin_institutions' ? 'bg-highlighter text-ink border-2 border-ink shadow-solid-sm' : 'text-ink hover:bg-paper-muted border border-transparent')}
                >
                  <Building2 className="w-4 h-4" />
                  <span>BRAC & UNESCO Outreach</span>
                </button>
              </div>
            )}

            {/* 5. PUBLIC MARKETING SINGLE-PAGE SCROLL NAVIGATION */}
            {activeMode === 'marketing' && (
              <div className="space-y-1.5">
                <button
                  onClick={() => scrollToSection('hero')}
                  className="w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl font-extrabold text-xs text-ink hover:bg-paper-muted border border-transparent transition-all"
                >
                  <Sparkles className="w-4 h-4 text-stamp" />
                  <span>✨ Magic Notebook</span>
                </button>

                <button
                  onClick={() => scrollToSection('digital-divide')}
                  className="w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl font-extrabold text-xs text-ink hover:bg-paper-muted border border-transparent transition-all"
                >
                  <Trees className="w-4 h-4 text-green-700" />
                  <span>🌲 Digital Divide</span>
                </button>

                <button
                  onClick={() => scrollToSection('how-it-works')}
                  className="w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl font-extrabold text-xs text-ink hover:bg-paper-muted border border-transparent transition-all"
                >
                  <Layers className="w-4 h-4 text-blue-700" />
                  <span>🔄 3-Step Physical Loop</span>
                </button>

                <button
                  onClick={() => scrollToSection('cost-calculator')}
                  className="w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl font-extrabold text-xs text-ink hover:bg-paper-muted border border-transparent transition-all"
                >
                  <BarChart3 className="w-4 h-4 text-stamp" />
                  <span>📊 School ROI Calculator</span>
                </button>

                <button
                  onClick={() => scrollToSection('team-heritage')}
                  className="w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl font-extrabold text-xs text-ink hover:bg-paper-muted border border-transparent transition-all"
                >
                  <Users className="w-4 h-4 text-purple-700" />
                  <span>👥 Team & Mission</span>
                </button>
              </div>
            )}
          </nav>

        </div>

        {/* Sidebar Bottom Actions */}
        <div className="pt-4 border-t-2 border-ink/15 space-y-2">
          {activeMode === 'student' && (
            <PillButton
              variant="highlighter"
              size="md"
              onClick={onOpenJoinModal}
              className="w-full btn-bounce"
              icon={<KeyRound className="w-4 h-4" />}
            >
              Enter Class Code
            </PillButton>
          )}

          {activeMode !== 'marketing' ? (
            <button
              onClick={() => { logout(); setCurrentView('hero'); }}
              className="w-full py-1.5 px-3 text-xs font-mono font-bold text-graphite hover:text-red-600 flex items-center justify-center gap-1.5 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          ) : (
            <PillButton
              variant="primary"
              size="md"
              onClick={() => onOpenAuth('signup')}
              className="w-full btn-bounce shadow-solid-xs"
              icon={<Sparkles className="w-4 h-4" />}
            >
              Get Started Free ➔
            </PillButton>
          )}

          <div className="text-[10px] text-graphite font-mono font-bold text-center">
            CUET EdTech Lab • Bangladesh
          </div>
        </div>

      </aside>
    </>
  );
};
