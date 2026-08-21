import React from 'react';
import { BentoCard } from '../common/BentoCard';
import { XCircle, CheckCircle2, Monitor, Keyboard, ZapOff, WifiOff } from 'lucide-react';

export const WhyOthersFail: React.FC = () => {
  return (
    <section className="py-16 px-4 max-w-7xl mx-auto border-t border-ink/15">
      
      <div className="max-w-3xl mb-12">
        <span className="text-xs font-mono uppercase tracking-wider text-stamp font-bold block mb-2">
          Root Cause Analysis
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-ink tracking-tight">
          Why Scratch, Khan Academy & Sololearn fail in Bangladesh.
        </h2>
        <p className="text-graphite text-base mt-2">
          They were designed for Silicon Valley and urban private schools with fast Wi-Fi and desktop monitors.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Legacy Competitor Pitfalls */}
        <BentoCard variant="kraft" className="space-y-4 border-2 border-dashed border-ink/40">
          <div className="flex items-center space-x-2 text-stamp font-extrabold text-sm uppercase">
            <XCircle className="w-4 h-4" />
            <span>Legacy Platforms (Scratch, Khan Academy, Replit)</span>
          </div>

          <div className="space-y-3 text-xs text-graphite">
            <div className="flex items-start space-x-3 p-3 bg-white/70 rounded-xl border border-ink/20">
              <Monitor className="w-4 h-4 text-stamp flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-ink block">Mandatory PC & Wide Screen:</strong>
                Block-based Scratch and multi-pane IDEs crash or become unusable on 5.5-inch smartphone screens.
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3 bg-white/70 rounded-xl border border-ink/20">
              <Keyboard className="w-4 h-4 text-stamp flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-ink block">Virtual Keyboard Fatigue:</strong>
                Typing semicolons, curly braces, and indents on touchscreens is 5x slower than handwriting.
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3 bg-white/70 rounded-xl border border-ink/20">
              <WifiOff className="w-4 h-4 text-stamp flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-ink block">Requires Constant High-Speed Internet:</strong>
                Fails immediately during rural 3G throttling or load shedding.
              </div>
            </div>
          </div>
        </BentoCard>

        {/* PaperCode Advantage */}
        <BentoCard variant="white" className="space-y-4 border-[2px] border-ink bg-highlighter/10">
          <div className="flex items-center space-x-2 text-ink font-extrabold text-sm uppercase">
            <CheckCircle2 className="w-4 h-4 text-green-700" />
            <span>The PaperCode Paradigm</span>
          </div>

          <div className="space-y-3 text-xs text-ink/90">
            <div className="flex items-start space-x-3 p-3 bg-white rounded-xl border border-ink/20 shadow-sm">
              <div className="w-6 h-6 rounded-full bg-highlighter border border-ink flex items-center justify-center font-bold text-xs">
                ✍️
              </div>
              <div>
                <strong className="text-ink block">Zero Keyboard Friction:</strong>
                Students write algorithms on paper at natural pen speed without wrestling with mobile keyboards.
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3 bg-white rounded-xl border border-ink/20 shadow-sm">
              <div className="w-6 h-6 rounded-full bg-highlighter border border-ink flex items-center justify-center font-bold text-xs">
                ⚡
              </div>
              <div>
                <strong className="text-ink block">Write Offline, Scan in Seconds:</strong>
                Students write full homework during power outages, then take a 1-second photo when power/mobile data returns.
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3 bg-white rounded-xl border border-ink/20 shadow-sm">
              <div className="w-6 h-6 rounded-full bg-highlighter border border-ink flex items-center justify-center font-bold text-xs">
                🤖
              </div>
              <div>
                <strong className="text-ink block">AI Syntax Tolerant OCR:</strong>
                Proprietary correction automatically rectifies smudged colons, indentation alignment, and bracket pairs.
              </div>
            </div>
          </div>
        </BentoCard>

      </div>

    </section>
  );
};
