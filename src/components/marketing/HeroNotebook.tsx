import React from 'react';
import { PillButton } from '../common/PillButton';
import { GraduationCap, Users, LogIn, Sparkles, CheckCircle2 } from 'lucide-react';

interface HeroNotebookProps {
  onOpenAuth: (tab: 'login' | 'signup') => void;
}

export const HeroNotebook: React.FC<HeroNotebookProps> = ({ onOpenAuth }) => {
  return (
    <div className="space-y-10 text-center max-w-6xl mx-auto py-8 px-4">
      <div className="inline-flex items-center space-x-2 px-4 py-1.5 bg-highlighter border-2 border-ink rounded-full text-xs font-extrabold text-ink shadow-solid-sm">
        <Sparkles className="w-3.5 h-3.5 text-stamp" />
        <span>Bangladesh National ICT Curriculum & Olympiad Aligned</span>
      </div>

      <div className="space-y-4 max-w-4xl mx-auto">
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-ink tracking-tight leading-[1.1]">
          No Computer Lab? <br />
          <span className="bg-highlighter text-ink px-4 py-1.5 border-2 border-ink rounded-2xl inline-block shadow-solid-md transform -rotate-1 mt-2">
            Just Pen & Paper.
          </span>
        </h1>
        <p className="text-base sm:text-xl text-graphite font-bold leading-relaxed max-w-2xl mx-auto">
          Handwrite code on your paper khata. Scan with any cheap Android phone camera. Execute on cloud sandboxes in under 0.03 seconds.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <PillButton
          variant="primary"
          size="lg"
          onClick={() => onOpenAuth('signup')}
          className="btn-bounce shadow-solid-md"
          icon={<GraduationCap className="w-5 h-5" />}
        >
          Sign Up as Student (Free) ➔
        </PillButton>

        <PillButton
          variant="stamp"
          size="lg"
          onClick={() => onOpenAuth('signup')}
          className="btn-bounce shadow-solid-md"
          icon={<Users className="w-5 h-5" />}
        >
          Sign Up as Teacher ➔
        </PillButton>

        <PillButton
          variant="secondary"
          size="lg"
          onClick={() => onOpenAuth('login')}
          className="btn-bounce shadow-solid-xs"
          icon={<LogIn className="w-4 h-4" />}
        >
          Sign In
        </PillButton>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-6 pt-3 text-xs font-mono font-extrabold text-graphite">
        <div className="flex items-center space-x-1.5">
          <CheckCircle2 className="w-4 h-4 text-green-700" />
          <span>Works on Low-Cost Androids</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <CheckCircle2 className="w-4 h-4 text-green-700" />
          <span>Zero Expensive PC Labs Required</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <CheckCircle2 className="w-4 h-4 text-green-700" />
          <span>Python 3, C++ & JavaScript</span>
        </div>
      </div>
    </div>
  );
};