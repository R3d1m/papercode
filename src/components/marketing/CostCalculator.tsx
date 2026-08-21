import React, { useState } from 'react';
import { PillButton } from '../common/PillButton';
import { BentoCard } from '../common/BentoCard';
import { Calculator, ArrowRight, Check } from 'lucide-react';

interface CostCalculatorProps {
  onOpenAuth?: (tab: 'login' | 'signup') => void;
}

export const CostCalculator: React.FC<CostCalculatorProps> = ({ onOpenAuth }) => {
  const [studentCount, setStudentCount] = useState<number>(300);

  const traditionalLabCost = Math.round(studentCount * 140);
  const paperCodeCost = Math.round(studentCount * 3.5);

  const savings = traditionalLabCost - paperCodeCost;
  const savingsPercent = Math.round((savings / traditionalLabCost) * 100);

  return (
    <section className="space-y-10 max-w-6xl mx-auto py-8 px-4">
      
      <div className="text-center space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 bg-paper-muted border border-ink/30 rounded-full font-mono text-xs font-extrabold text-ink uppercase">
          <Calculator className="w-3.5 h-3.5 text-stamp" />
          <span>Cost & Resource Comparison</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-ink tracking-tight">
          School Budget & ROI Calculator
        </h2>
        <p className="text-sm sm:text-base text-graphite font-bold max-w-xl mx-auto">
          Compare the capital expenditure of building a 30-PC computer lab vs equipping all students with PaperCode.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        
        {/* Slider Card */}
        <BentoCard variant="white" className="p-8 border-2 border-ink shadow-solid-md space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-mono font-extrabold uppercase text-graphite">
                Total Enrolled Students:
              </label>
              <span className="font-mono text-2xl font-extrabold text-ink px-3 py-1 bg-highlighter border-2 border-ink rounded-xl shadow-solid-xs">
                {studentCount} Students
              </span>
            </div>

            <input
              type="range"
              min="50"
              max="2000"
              step="50"
              value={studentCount}
              onChange={(e) => setStudentCount(Number(e.target.value))}
              className="w-full h-3 bg-paper-muted rounded-lg appearance-none cursor-pointer accent-ink border border-ink"
            />
            <div className="flex justify-between text-[11px] font-mono text-graphite font-bold">
              <span>50 Students</span>
              <span>1,000 Students</span>
              <span>2,000 Students</span>
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-ink/15 text-xs text-graphite font-medium">
            <div className="flex items-center space-x-2 text-ink font-bold">
              <Check className="w-4 h-4 text-green-700 stroke-[3]" />
              <span>Includes complete Python & C++ curriculum alignment.</span>
            </div>
            <div className="flex items-center space-x-2 text-ink font-bold">
              <Check className="w-4 h-4 text-green-700 stroke-[3]" />
              <span>Unlimited OCR scans & automated batch grading for teachers.</span>
            </div>
          </div>
        </BentoCard>

        {/* Comparison ROI Card */}
        <BentoCard variant="kraft" className="p-8 border-2 border-ink shadow-solid-md space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-paper-light border-2 border-ink/20 rounded-2xl space-y-1">
              <span className="text-[10px] font-mono font-bold text-graphite uppercase block">Traditional PC Lab</span>
              <strong className="text-2xl font-extrabold text-red-700 font-mono block">
                {'$' + traditionalLabCost.toLocaleString()}
              </strong>
              <span className="text-[10px] text-graphite block">Hardware, AC, UPS & Maintenance</span>
            </div>

            <div className="p-4 bg-white border-2 border-ink rounded-2xl space-y-1 shadow-solid-xs">
              <span className="text-[10px] font-mono font-extrabold text-stamp uppercase block">PaperCode Cloud</span>
              <strong className="text-2xl font-extrabold text-green-800 font-mono block">
                {'$' + paperCodeCost.toLocaleString()}
              </strong>
              <span className="text-[10px] text-green-800 font-bold block">100% Student Coverage</span>
            </div>
          </div>

          <div className="p-4 bg-highlighter border-2 border-ink rounded-2xl flex items-center justify-between shadow-solid-xs">
            <div>
              <span className="text-xs font-mono font-extrabold uppercase text-ink block">Total School Savings:</span>
              <strong className="text-2xl font-extrabold text-ink font-mono">{'$' + savings.toLocaleString() + ' (' + savingsPercent + '%)'}</strong>
            </div>
            <div className="text-2xl">💰</div>
          </div>

          {onOpenAuth && (
            <PillButton
              variant="stamp"
              size="lg"
              onClick={() => onOpenAuth('signup')}
              className="w-full btn-bounce shadow-solid-xs"
              icon={<ArrowRight className="w-4 h-4 text-white" />}
            >
              Get Started with PaperCode ➔
            </PillButton>
          )}
        </BentoCard>

      </div>

    </section>
  );
};
