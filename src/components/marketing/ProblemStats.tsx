import React from 'react';
import { BentoCard } from '../common/BentoCard';
import { BarcodeStub } from '../common/BarcodeStub';
import { Smartphone, MonitorOff, Trees, AlertTriangle, Users, Heart } from 'lucide-react';

export const ProblemStats: React.FC = () => {
  return (
    <section id="the-problem" className="py-20 px-4 max-w-7xl mx-auto border-t border-ink/15 space-y-12">
      
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="doodle-badge bg-paper-muted text-ink">
          <span>🌾 Real Stories from Bangladesh</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-ink tracking-tight">
          In a classroom of 10 students...
        </h2>
        <p className="text-graphite text-base sm:text-lg">
          Traditional coding platforms require laptops and fast broadband. Here is the reality on the ground:
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Stat 1 */}
        <BentoCard variant="white" className="space-y-4 p-8 border-2 border-ink">
          <div className="flex items-center justify-between">
            <span className="text-5xl font-extrabold font-mono text-stamp">1 in 10</span>
            <div className="w-12 h-12 rounded-2xl bg-red-100 border border-ink flex items-center justify-center text-stamp">
              <MonitorOff className="w-6 h-6" />
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-extrabold text-ink">Has a Computer (9%)</h3>
            <p className="text-sm text-graphite mt-2 leading-relaxed">
              91% of kids don&apos;t have a desktop or laptop at home. Traditional coding tools leave 9 out of 10 students behind.
            </p>
          </div>

          <div className="p-3 bg-red-50 rounded-xl border border-red-200 text-xs font-bold text-red-800">
            ❌ Scratch & Khan Academy fail here
          </div>
        </BentoCard>

        {/* Stat 2 */}
        <BentoCard variant="highlighter" className="space-y-4 p-8 border-2 border-ink">
          <div className="flex items-center justify-between">
            <span className="text-5xl font-extrabold font-mono text-ink">9 in 10</span>
            <div className="w-12 h-12 rounded-2xl bg-ink text-highlighter flex items-center justify-center">
              <Smartphone className="w-6 h-6" />
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-extrabold text-ink">Have a Smartphone (90%)</h3>
            <p className="text-sm text-ink/90 mt-2 leading-relaxed">
              Almost every student has a family phone with a camera. PaperCode uses this camera to turn handwriting into real code!
            </p>
          </div>

          <div className="p-3 bg-white rounded-xl border border-ink text-xs font-bold text-ink">
            ✅ PaperCode works on any phone
          </div>
        </BentoCard>

        {/* Stat 3 */}
        <BentoCard variant="white" className="space-y-4 p-8 border-2 border-ink">
          <div className="flex items-center justify-between">
            <span className="text-5xl font-extrabold font-mono text-emerald-700">7 in 10</span>
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 border border-ink flex items-center justify-center text-emerald-800">
              <Trees className="w-6 h-6" />
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-extrabold text-ink">Live in Rural Areas (70%)</h3>
            <p className="text-sm text-graphite mt-2 leading-relaxed">
              Students in village and haor schools face load shedding. Writing on paper is 100% electricity-independent.
            </p>
          </div>

          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs font-bold text-emerald-800">
            ✅ Write by lantern, scan when power returns
          </div>
        </BentoCard>

      </div>

    </section>
  );
};
