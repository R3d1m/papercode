import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { PillButton } from '../common/PillButton';
import { UserAvatar } from '../common/UserAvatar';
import { Role } from '../../types';
import { 
  Flame, 
  Award, 
  ChevronDown, 
  LogOut, 
  KeyRound, 
  Settings, 
  User as UserIcon, 
  ShieldCheck, 
  Sparkles, 
  LogIn, 
  UserPlus,
  GraduationCap,
  Users,
  Menu,
  X
} from 'lucide-react';

interface TopNavProps {
  onOpenAuth: (tab: 'login' | 'signup') => void;
  onOpenJoinModal: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  onOpenAuth,
  onOpenJoinModal
}) => {
  const { 
    activeMode, 
    setActiveMode, 
    switchRole, 
    logout, 
    currentUser, 
    studentXp, 
    studentStreak 
  } = useApp();

  const navigate = useNavigate();
  const location = useLocation();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleRoleChange = (role: 'marketing' | 'student' | 'teacher' | 'moderator' | 'admin') => {
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    if (role === 'marketing') {
      setActiveMode('marketing');
      navigate('/');
    } else {
      switchRole(role);
      if (role === 'student') navigate('/student/dashboard');
      if (role === 'teacher') navigate('/teacher/courses');
      if (role === 'moderator') navigate('/moderator/roadmaps');
      if (role === 'admin') navigate('/admin/vitals');
    }
  };

  const handleOpenProfile = () => {
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    navigate('/profile');
  };

  // Define ONE-WORD navigation links per role (Roadmaps, Courses, Pricing, Blogs)
  const getNavLinks = () => {
    const currentPath = location.pathname;

    if (activeMode === 'marketing') {
      return [
        { label: 'Roadmaps', path: '/roadmaps', active: currentPath === '/roadmaps' },
        { label: 'Courses', path: '/courses', active: currentPath.startsWith('/courses') },
        { label: 'Pricing', path: '/pricing', active: currentPath === '/pricing' },
        { label: 'Blogs', path: '/blogs', active: currentPath.startsWith('/blogs') },
      ];
    }

    if (activeMode === 'student') {
      return [
        { label: 'Dashboard', path: '/student/dashboard', active: currentPath === '/student' || currentPath === '/student/dashboard' },
        { label: 'Classrooms', path: '/student/classrooms', active: currentPath.startsWith('/student/classrooms') },
        { label: 'Roadmaps', path: '/student/roadmaps', active: currentPath === '/student/roadmaps' },
        { label: 'Code Runner', path: '/playground', active: currentPath === '/playground' },
        { label: 'Blogs', path: '/blogs', active: currentPath.startsWith('/blogs') },
      ];
    }

    if (activeMode === 'teacher') {
      return [
        { label: 'Curriculum', path: '/teacher/courses', active: currentPath.startsWith('/teacher/courses') || currentPath === '/teacher' },
        { label: 'Gradebook', path: '/teacher/grading', active: currentPath.startsWith('/teacher/grading') || currentPath.startsWith('/teacher/gradebook') },
        { label: 'Classrooms', path: '/teacher/classrooms', active: currentPath.startsWith('/teacher/classrooms') },
        { label: 'Analytics', path: '/teacher/analytics', active: currentPath === '/teacher/analytics' },
        { label: 'Code Runner', path: '/playground', active: currentPath === '/playground' },
        { label: 'Blogs', path: '/blogs', active: currentPath.startsWith('/blogs') },
      ];
    }

    if (activeMode === 'moderator') {
      return [
        { label: 'Roadmaps & CMS', path: '/moderator/roadmaps', active: currentPath.startsWith('/moderator') },
        { label: 'Curriculum', path: '/teacher/courses', active: currentPath.startsWith('/teacher/courses') },
        { label: 'Gradebook', path: '/teacher/grading', active: currentPath.startsWith('/teacher/grading') },
        { label: 'Classrooms', path: '/teacher/classrooms', active: currentPath.startsWith('/teacher/classrooms') },
        { label: 'Code Runner', path: '/playground', active: currentPath === '/playground' },
        { label: 'Blogs', path: '/blogs', active: currentPath.startsWith('/blogs') },
      ];
    }

    if (activeMode === 'admin') {
      return [
        { label: 'Platform Vitals', path: '/admin/vitals', active: currentPath === '/admin' || currentPath === '/admin/vitals' },
        { label: 'Courses CMS', path: '/admin/courses', active: currentPath === '/admin/courses' },
        { label: 'Roadmaps CMS', path: '/admin/roadmaps', active: currentPath === '/admin/roadmaps' },
        { label: 'Blogs CMS', path: '/admin/blogs', active: currentPath === '/admin/blogs' },
        { label: 'Moderators', path: '/admin/moderators', active: currentPath === '/admin/moderators' },
      ];
    }

    return [];
  };

  const navLinks = getNavLinks();

  return (
    <header className="sticky top-0 z-40 bg-paper/95 backdrop-blur-md border-b-2 border-ink shadow-solid-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* LEFT: BRAND LOGO (CLICK TO RETURN TO DASHBOARD/CURRICULUM/VITALS OR HOME) */}
        <div 
          onClick={() => {
            if (activeMode === 'student') {
              navigate('/student/dashboard');
            } else if (activeMode === 'teacher') {
              navigate('/teacher/courses');
            } else if (activeMode === 'admin') {
              navigate('/admin/vitals');
            } else if (activeMode === 'moderator') {
              navigate('/moderator/roadmaps');
            } else {
              navigate('/');
            }
          }}
          className="flex items-center space-x-2.5 cursor-pointer select-none group flex-shrink-0"
        >
          <div className="w-9 h-9 rounded-xl bg-highlighter border-2 border-ink flex items-center justify-center font-extrabold text-ink shadow-solid-xs group-hover:rotate-12 transition-transform">
            ✏️
          </div>
          <div>
            <span className="font-extrabold text-lg sm:text-xl tracking-tight text-ink block leading-none">PaperCode</span>
            <span className="text-[9px] font-mono text-stamp font-extrabold uppercase hidden sm:block">Bangladesh</span>
          </div>
        </div>

        {/* CENTER: DESKTOP HORIZONTAL MENU */}
        <nav className="hidden md:flex items-center space-x-1.5 lg:space-x-2.5">
          {navLinks.map((link, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => navigate(link.path)}
              className={'px-4 py-1.5 rounded-full text-xs font-extrabold transition-all btn-bounce ' + (link.active ? 'bg-highlighter text-ink border-2 border-ink shadow-solid-xs' : 'text-ink hover:bg-paper-muted border border-transparent')}
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* RIGHT: METRICS, CTAS & USER ACCOUNT DROPDOWN */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          
          {/* Guest Marketing CTAs */}
          {activeMode === 'marketing' ? (
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => onOpenAuth('login')}
                className="px-3.5 py-1.5 bg-paper-card hover:bg-paper-light text-ink border-2 border-ink rounded-full text-xs font-extrabold flex items-center gap-1.5 shadow-solid-xs btn-bounce"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>

              <button
                type="button"
                onClick={() => onOpenAuth('signup')}
                className="px-3.5 py-1.5 bg-highlighter hover:bg-highlighter-hover text-ink border-2 border-ink rounded-full text-xs font-extrabold flex items-center gap-1.5 shadow-solid-xs btn-bounce"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Sign Up</span>
              </button>
            </div>
          ) : (
            <>
              {/* Student Metrics Badges */}
              {activeMode === 'student' && (
                <div className="hidden sm:flex items-center space-x-2">
                  <div className="flex items-center space-x-1.5 px-2.5 py-1 bg-paper-muted border-2 border-ink/30 rounded-full font-mono text-xs font-extrabold text-ink shadow-solid-xs">
                    <Flame className="w-3.5 h-3.5 text-stamp animate-bounce" />
                    <span>{studentStreak}d</span>
                  </div>

                  <div className="flex items-center space-x-1.5 px-2.5 py-1 bg-highlighter border-2 border-ink text-ink font-mono text-xs font-extrabold rounded-full shadow-solid-xs">
                    <Award className="w-3.5 h-3.5 text-ink" />
                    <span>{(studentXp ?? 0).toLocaleString()} XP</span>
                  </div>
                </div>
              )}

              {/* USER AVATAR & DROPDOWN TRIGGER */}
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className={'flex items-center space-x-2 p-1 pl-2 bg-paper-card hover:bg-paper-light border-2 border-ink rounded-full shadow-solid-xs transition-all btn-bounce ' + (location.pathname === '/profile' ? 'ring-2 ring-stamp bg-highlighter/20' : '')}
                >
                  <div className="text-left hidden lg:block pr-1">
                    <strong className="text-xs text-ink block leading-none">{currentUser.name}</strong>
                    <span className="text-[9px] font-mono font-extrabold text-stamp uppercase">
                      {activeMode === 'student' ? 'Lvl 4 Coder' : (activeMode === 'teacher' ? 'Teacher' : (activeMode || 'student').toUpperCase())}
                    </span>
                  </div>

                  <UserAvatar
                    name={currentUser.name}
                    avatar={currentUser.avatar}
                    size="sm"
                    className="w-7 h-7 sm:w-8 sm:h-8"
                  />

                  <ChevronDown className={'w-3.5 h-3.5 text-ink transition-transform pr-0.5 ' + (dropdownOpen ? 'rotate-180' : '')} />
                </button>

                {/* USER DROPDOWN MENU */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-paper-card border-2 border-ink rounded-2xl p-4 shadow-solid-xl space-y-3 z-50 animate-fadeIn text-xs">
                    
                    {/* User Header Profile */}
                    <div className="flex items-center space-x-3 pb-3 border-b-2 border-ink/15">
                      <UserAvatar
                        name={currentUser.name}
                        avatar={currentUser.avatar}
                        size="md"
                        className="w-10 h-10"
                      />
                      <div className="overflow-hidden">
                        <strong className="text-sm text-ink font-extrabold truncate block">{currentUser.name}</strong>
                        <span className="text-[10px] text-graphite font-medium truncate block">{currentUser.email}</span>
                        <span className="text-[9px] font-mono font-extrabold text-stamp uppercase block pt-0.5">
                          {currentUser.school || 'CUET EdTech Lab'}
                        </span>
                      </div>
                    </div>

                    {/* DIRECT PROFILE & SETTINGS BUTTON */}
                    <button
                      type="button"
                      onClick={handleOpenProfile}
                      className="w-full p-2.5 bg-paper-light hover:bg-highlighter text-ink border-2 border-ink rounded-xl font-extrabold flex items-center justify-between shadow-solid-xs btn-bounce transition-colors"
                    >
                      <div className="flex items-center space-x-2">
                        <UserIcon className="w-4 h-4 text-stamp" />
                        <span>Profile & Account Settings</span>
                      </div>
                      <span className="font-mono text-[10px] uppercase font-bold">Edit ➔</span>
                    </button>

                    {/* Fast Class Join Code Action (for students) */}
                    {activeMode === 'student' && (
                      <button
                        type="button"
                        onClick={() => { setDropdownOpen(false); onOpenJoinModal(); }}
                        className="w-full p-2.5 bg-highlighter hover:bg-highlighter-hover text-ink border-2 border-ink rounded-xl font-extrabold flex items-center justify-between shadow-solid-xs btn-bounce"
                      >
                        <div className="flex items-center space-x-2">
                          <KeyRound className="w-4 h-4 text-stamp" />
                          <span>Enter Class Code</span>
                        </div>
                        <span className="font-mono text-[10px] uppercase font-bold">Join ➔</span>
                      </button>
                    )}

                    {/* Role & Privileges Status */}
                    <div className="p-2.5 bg-paper-light border border-ink/20 rounded-xl space-y-1">
                      <span className="text-[10px] font-mono text-graphite font-bold uppercase block">
                        Account Role:
                      </span>
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-ink capitalize text-xs">
                          {currentUser.role === 'admin' ? '⚡ System Administrator' : (currentUser.role === 'moderator' ? '🎖️ Curriculum Moderator' : (currentUser.role === 'teacher' ? '👩‍🏫 Teacher / Educator' : '🎒 Student'))}
                        </span>
                        <span className="text-[10px] font-mono font-extrabold text-green-700 bg-green-100 px-2 py-0.5 rounded border border-green-600">
                          Active
                        </span>
                      </div>
                    </div>

                    {/* Sign Out Action */}
                    <div className="pt-2 border-t-2 border-ink/15">
                      <button
                        type="button"
                        onClick={() => { setDropdownOpen(false); logout(); navigate('/'); }}
                        className="w-full p-2 text-left text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl flex items-center justify-between transition-colors"
                      >
                        <div className="flex items-center space-x-2">
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </div>
                        <span className="text-[10px] font-mono">End session</span>
                      </button>
                    </div>

                  </div>
                )}
              </div>
            </>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl border-2 border-ink bg-paper-card text-ink shadow-solid-xs"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

        </div>

      </div>

      {/* MOBILE COLLAPSIBLE HORIZONTAL MENU */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t-2 border-ink bg-paper-card p-4 space-y-2 animate-fadeIn shadow-solid-md">
          <div className="grid grid-cols-2 gap-2">
            {navLinks.map((link, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => { setMobileMenuOpen(false); navigate(link.path); }}
                className={'p-2.5 rounded-xl text-center text-xs font-extrabold border-2 ' + (link.active ? 'bg-highlighter text-ink border-ink shadow-solid-xs' : 'bg-paper-light text-ink border-ink/20 hover:border-ink')}
              >
                {link.label}
              </button>
            ))}
          </div>

          {activeMode !== 'marketing' && (
            <div className="pt-3 border-t border-ink/20 space-y-2 text-xs">
              <button
                onClick={() => { setMobileMenuOpen(false); navigate('/profile'); }}
                className="w-full p-2 bg-highlighter text-ink font-extrabold rounded-xl border border-ink text-center flex items-center justify-center gap-2"
              >
                <UserIcon className="w-4 h-4" />
                <span>Profile & Settings</span>
              </button>
              <div className="flex justify-between items-center pt-1">
                <div className="flex items-center space-x-2 font-mono font-bold">
                  <span>🔥 {studentStreak}d</span>
                  <span>💎 {studentXp} XP</span>
                </div>
                <button
                  onClick={() => { setMobileMenuOpen(false); logout(); navigate('/'); }}
                  className="text-red-600 font-bold hover:underline"
                >
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      )}

    </header>
  );
};
