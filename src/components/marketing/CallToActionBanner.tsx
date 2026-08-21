import React from 'react';
import { PillButton } from '../common/PillButton';
import { BentoCard } from '../common/BentoCard';
import { GraduationCap, Users, ArrowRight, Sparkles } from 'lucide-react';

interface CallToActionBannerProps {
  onOpenAuth: (tab: 'login' | 'signup') => void;
}

export const CallToActionBanner: React.FC<CallToActionBannerProps> = ({ onOpenAuth }) => {
  return (
    <section className="space-y-8 max-w-6xl mx-auto py-12 px-4">
      
      <div className="text-center space-y-3">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 bg-highlighter border-2 border-ink rounded-full text-xs font-extrabold text-ink shadow-solid-xs">
          <Sparkles className="w-3.5 h-3.5 text-stamp" />
          <span>Join PaperCode Bangladesh Today</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-ink tracking-tight">
          Ready to Start Coding from Any Notebook?
        </h2>
        <p className="text-sm sm:text-base text-graphite font-bold max-w-2xl mx-auto">
          Create an account in 30 seconds. 100% free for students, teachers, and schools across Bangladesh.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Student CTA Card */}
        <BentoCard variant="highlighter" className="p-8 sm:p-10 border-2 border-ink shadow-solid-md space-y-6 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-white border-2 border-ink flex items-center justify-center text-ink shadow-solid-xs">
              <GraduationCap className="w-7 h-7 text-ink" />
            </div>
            <h3 className="text-2xl font-extrabold text-ink">For Students & Coders</h3>
            <p className="text-xs sm:text-sm text-ink/80 font-bold leading-relaxed">
              Write Python and C++ code on your paper khata. Scan with your phone camera, earn XP, complete interactive quests, and join your school teacher&apos;s classroom.
            </p>
          </div>

          <div className="space-y-2 pt-4 border-t-2 border-ink/20">
            <PillButton
              variant="primary"
              size="lg"
              onClick={() => onOpenAuth('signup')}
              className="w-full btn-bounce shadow-solid-sm"
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Sign Up as Student (100% Free) ➔
            </PillButton>
            <button
              onClick={() => onOpenAuth('login')}
              className="w-full text-center text-xs font-extrabold text-ink hover:underline pt-1 block"
            >
              Already have an account? Sign In ➔
            </button>
          </div>
        </BentoCard>

        {/* Teacher CTA Card */}
        <BentoCard variant="kraft" className="p-8 sm:p-10 border-2 border-ink shadow-solid-md space-y-6 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-stamp text-white border-2 border-ink flex items-center justify-center shadow-solid-xs">
              <Users className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-extrabold text-ink">For Teachers & Schools</h3>
            <p className="text-xs sm:text-sm text-graphite font-bold leading-relaxed">
              Create digital classrooms, distribute ICT homework assignments, generate student join codes, and automate batch grading of handwritten notebook photos in seconds.
            </p>
          </div>

          <div className="space-y-2 pt-4 border-t-2 border-ink/20">
            <PillButton
              variant="stamp"
              size="lg"
              onClick={() => onOpenAuth('signup')}
              className="w-full btn-bounce shadow-solid-sm"
              icon={<ArrowRight className="w-4 h-4 text-white" />}
            >
              Sign Up as Teacher & Launch Class ➔
            </PillButton>
            <button
              onClick={() => onOpenAuth('login')}
              className="w-full text-center text-xs font-extrabold text-ink hover:underline pt-1 block"
            >
              Teacher Sign In ➔
            </button>
          </div>
        </BentoCard>

      </div>

    </section>
  );
};
