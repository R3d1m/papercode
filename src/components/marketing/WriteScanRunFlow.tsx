import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { PillButton } from '../common/PillButton';
import { BentoCard } from '../common/BentoCard';
import { PenTool, Camera, Cpu, ArrowRight, CheckCircle2, Play } from 'lucide-react';

interface WriteScanRunFlowProps {
  onOpenAuth?: (tab: 'login' | 'signup') => void;
}

export const WriteScanRunFlow: React.FC<WriteScanRunFlowProps> = ({ onOpenAuth }) => {
  const { currentUser, activeMode } = useApp();
  const navigate = useNavigate();

  const isAuthenticated = currentUser && currentUser.id !== 'usr-guest' && activeMode !== 'marketing' && Boolean(currentUser.email);

  const steps = [
    {
      num: '01',
      icon: <PenTool className="w-6 h-6 text-ink" />,
      title: 'Write on Paper',
      subtitle: 'Regular Ruled or Plain Notebook',
      desc: 'Students write code using simple pen/pencil conventions. Indentations and colons are naturally preserved with line guidance.'
    },
    {
      num: '02',
      icon: <Camera className="w-6 h-6 text-stamp" />,
      title: 'Snap with Phone Camera',
      subtitle: 'Any mobile or computer Devices Supported',
      desc: 'Our specialized neural OCR runs on mobile, correcting distortion, lighting shadows, and handwriting slant instantly.'
    },
    {
      num: '03',
      icon: <Cpu className="w-6 h-6 text-blue-700" />,
      title: 'Sandboxed Cloud Execution',
      subtitle: '0.03s Instant Execution & Feedback',
      desc: 'Isolated backend sandboxes run the script against automated unit tests, returning stdout or syntax suggestions immediately.'
    }
  ];

  return (
    <section className="space-y-10 max-w-6xl mx-auto py-8 px-4">
      
      <div className="text-center space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 bg-paper-muted border border-ink/30 rounded-full font-mono text-xs font-extrabold text-ink uppercase">
          <span>The Physical-to-Digital Loop</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-ink tracking-tight">
          How PaperCode Works in 3 Steps
        </h2>
        <p className="text-sm sm:text-base text-graphite font-bold max-w-xl mx-auto">
          No electricity grid dependence during class. Students write comfortably on paper and scan when ready.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {steps.map((s, idx) => (
          <BentoCard key={idx} variant="white" className="p-8 border-2 border-ink shadow-solid-md space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-3xl font-extrabold text-highlighter bg-ink px-3 py-1 rounded-xl shadow-solid-xs">
                  {s.num}
                </span>
                <div className="p-3 bg-paper-light border-2 border-ink/20 rounded-2xl">
                  {s.icon}
                </div>
              </div>

              <h3 className="text-xl font-extrabold text-ink">{s.title}</h3>
              <span className="text-[11px] font-mono font-bold text-stamp uppercase block">{s.subtitle}</span>
              <p className="text-xs sm:text-sm text-graphite font-medium leading-relaxed">{s.desc}</p>
            </div>
          </BentoCard>
        ))}
      </div>

      {/* Mid-Page Conversion CTA */}
      <div className="p-6 bg-highlighter border-2 border-ink rounded-2xl shadow-solid-md flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div>
          <h4 className="text-lg font-extrabold text-ink">Ready to try your first handwritten scan?</h4>
          <p className="text-xs text-ink/80 font-bold">Jump into interactive lesson 1.1 right away.</p>
        </div>
        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <PillButton
              variant="primary"
              size="md"
              onClick={() => navigate(currentUser.role === 'teacher' ? '/teacher/courses' : '/student/dashboard')}
              className="btn-bounce shadow-solid-xs"
              icon={<Play className="w-4 h-4" />}
            >
              Open {currentUser.role === 'teacher' ? 'Curriculum' : 'Dashboard'} ➔
            </PillButton>
          ) : (
            onOpenAuth && (
              <>
                <PillButton
                  variant="primary"
                  size="md"
                  onClick={() => onOpenAuth('signup')}
                  className="btn-bounce shadow-solid-xs"
                  icon={<ArrowRight className="w-4 h-4" />}
                >
                  Sign Up Free ➔
                </PillButton>
                <PillButton
                  variant="secondary"
                  size="md"
                  onClick={() => onOpenAuth('login')}
                  className="btn-bounce"
                >
                  Sign In
                </PillButton>
              </>
            )
          )}
        </div>
      </div>

    </section>
  );
};
