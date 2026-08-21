import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PillButton } from './PillButton';
import { Sparkles, KeyRound, Menu, X } from 'lucide-react';

interface NavbarProps {
  onOpenAuth?: (initialTab?: 'login' | 'signup' | 'join') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAuth }) => {
  const { activeMode, setActiveMode, switchRole } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-4 z-50 w-full px-4 max-w-7xl mx-auto">
      <nav className="bg-paper-card border-[2px] border-ink rounded-full px-5 sm:px-8 py-3.5 shadow-solid flex items-center justify-between">
        
        {/* Brand Logo with Pencil Motif */}
        <div 
          onClick={() => setActiveMode('marketing')}
          className="flex items-center space-x-3 cursor-pointer select-none group"
        >
          <div className="w-10 h-10 rounded-2xl bg-highlighter border-2 border-ink flex items-center justify-center font-extrabold text-ink shadow-solid-sm group-hover:rotate-12 transition-transform">
            ✏️
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-extrabold text-2xl tracking-tight text-ink">PaperCode</span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-ink text-highlighter rounded-full font-bold">
                BD 🇧🇩
              </span>
            </div>
          </div>
        </div>

        {/* Center Marketing Navigation Links */}
        <div className="hidden lg:flex items-center space-x-8 text-xs uppercase tracking-wider font-extrabold text-ink/80">
          <a href="#the-problem" className="hover:text-ink transition-colors">Our Story</a>
          <a href="#write-scan-run" className="hover:text-ink transition-colors">How It Works</a>
          <a href="#magic-notebook" className="hover:text-ink transition-colors text-stamp font-extrabold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-stamp" />
            Magic Notebook
          </a>
          <a href="#schools" className="hover:text-ink transition-colors">Schools & NGOs</a>
          <a href="#founders" className="hover:text-ink transition-colors">CUET Story</a>
        </div>

        {/* Right Role Fast-Switcher & Join Classroom Pill */}
        <div className="flex items-center space-x-3">
          
          {/* Quick Role Mode Switcher Tabs */}
          <div className="hidden sm:flex items-center bg-paper-muted border border-ink/40 p-1 rounded-full text-xs font-bold">
            <button
              onClick={() => setActiveMode('marketing')}
              className={`px-3 py-1.5 rounded-full transition-all ${activeMode === 'marketing' ? 'bg-ink text-paper-card shadow-sm' : 'text-ink/70 hover:text-ink'}`}
            >
              Public
            </button>
            <button
              onClick={() => switchRole('student')}
              className={`px-3 py-1.5 rounded-full transition-all ${activeMode === 'student' ? 'bg-ink text-paper-card shadow-sm' : 'text-ink/70 hover:text-ink'}`}
            >
              🎒 Student
            </button>
            <button
              onClick={() => switchRole('teacher')}
              className={`px-3 py-1.5 rounded-full transition-all ${activeMode === 'teacher' ? 'bg-ink text-paper-card shadow-sm' : 'text-ink/70 hover:text-ink'}`}
            >
              👩‍🏫 Teacher
            </button>
            <button
              onClick={() => switchRole('admin')}
              className={`px-3 py-1.5 rounded-full transition-all ${activeMode === 'admin' ? 'bg-ink text-paper-card shadow-sm' : 'text-ink/70 hover:text-ink'}`}
            >
              ⚡ Admin
            </button>
          </div>

          {/* Join Classroom / Login Pill Action */}
          <PillButton
            variant="highlighter"
            size="md"
            onClick={() => onOpenAuth && onOpenAuth('join')}
            icon={<KeyRound className="w-4 h-4" />}
            className="hidden md:inline-flex btn-bounce"
          >
            🔑 Class Code
          </PillButton>

          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-full border border-ink/30 bg-paper-muted text-ink"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-3 bg-paper-card border-[2px] border-ink rounded-3xl p-6 shadow-solid-md space-y-4">
          <div className="grid grid-cols-2 gap-2.5 text-xs font-extrabold">
            <button
              onClick={() => { setActiveMode('marketing'); setMobileMenuOpen(false); }}
              className={`p-3 rounded-2xl border border-ink text-center ${activeMode === 'marketing' ? 'bg-ink text-paper-card' : 'bg-paper-light'}`}
            >
              🌐 Public Site
            </button>
            <button
              onClick={() => { switchRole('student'); setMobileMenuOpen(false); }}
              className={`p-3 rounded-2xl border border-ink text-center ${activeMode === 'student' ? 'bg-ink text-paper-card' : 'bg-paper-light'}`}
            >
              🎒 Student App
            </button>
            <button
              onClick={() => { switchRole('teacher'); setMobileMenuOpen(false); }}
              className={`p-3 rounded-2xl border border-ink text-center ${activeMode === 'teacher' ? 'bg-ink text-paper-card' : 'bg-paper-light'}`}
            >
              👩‍🏫 Teacher Portal
            </button>
            <button
              onClick={() => { switchRole('admin'); setMobileMenuOpen(false); }}
              className={`p-3 rounded-2xl border border-ink text-center ${activeMode === 'admin' ? 'bg-ink text-paper-card' : 'bg-paper-light'}`}
            >
              ⚡ Admin HQ
            </button>
          </div>

          <div className="pt-2 border-t border-ink/20">
            <PillButton
              variant="highlighter"
              size="lg"
              onClick={() => { onOpenAuth && onOpenAuth('join'); setMobileMenuOpen(false); }}
              icon={<KeyRound className="w-4 h-4" />}
              className="w-full btn-bounce"
            >
              Enter Classroom Join Code
            </PillButton>
          </div>
        </div>
      )}
    </header>
  );
};
