import React from 'react';
import { BentoCard } from '../common/BentoCard';
import { BarcodeStub } from '../common/BarcodeStub';
import { BarChart3, TrendingUp, AlertTriangle, CheckCircle2 } from 'lucide-react';

export const TeacherAnalyticsView: React.FC = () => {
  return (
    <div className="space-y-8 max-w-7xl mx-auto py-2">
      
      {/* Top Header */}
      <div>
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-highlighter border border-ink text-ink font-mono text-xs font-extrabold mb-1">
          <span>Student Performance & OCR Diagnostics</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-ink">Class Error & Syntax Analytics</h1>
        <p className="text-xs sm:text-sm text-graphite mt-1">
          Aggregated handwriting accuracy patterns, common syntax slips, and concept mastery metrics.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <BentoCard variant="white" className="space-y-3 p-6 border-2 border-ink shadow-solid-sm">
          <div className="flex items-center space-x-2 text-stamp font-extrabold text-sm">
            <AlertTriangle className="w-4 h-4" />
            <span>Most Common OCR Corrections</span>
          </div>
          <ul className="text-xs text-graphite space-y-2 pt-1">
            <li className="p-3 bg-paper-light rounded-xl border border-ink/10">
              <strong className="text-ink block">Indentation Tab Alignment:</strong>
              58% of handwritten loops required 4-space auto-indent formatting.
            </li>
            <li className="p-3 bg-paper-light rounded-xl border border-ink/10">
              <strong className="text-ink block">Colon on def/if statements:</strong>
              32% of students occasionally omit trailing colons in Bengali script handwriting.
            </li>
          </ul>
        </BentoCard>

        <BentoCard variant="kraft" className="space-y-3 p-6 border-2 border-ink shadow-solid-sm">
          <div className="flex items-center space-x-2 text-green-800 font-extrabold text-sm">
            <TrendingUp className="w-4 h-4" />
            <span>MCQ Concept Mastery</span>
          </div>
          <div className="space-y-3 text-xs pt-1">
            <div>
              <div className="flex justify-between font-bold mb-1">
                <span>Variables & Data Types</span>
                <span className="text-green-700 font-extrabold">96% Pass</span>
              </div>
              <div className="w-full h-2.5 bg-paper-dark rounded-full overflow-hidden">
                <div className="h-full bg-green-600 w-[96%]"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between font-bold mb-1">
                <span>For Loops & Series</span>
                <span className="text-amber-700 font-extrabold">78% Pass</span>
              </div>
              <div className="w-full h-2.5 bg-paper-dark rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 w-[78%]"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between font-bold mb-1">
                <span>String Slicing & Indexes</span>
                <span className="text-green-700 font-extrabold">88% Pass</span>
              </div>
              <div className="w-full h-2.5 bg-paper-dark rounded-full overflow-hidden">
                <div className="h-full bg-green-600 w-[88%]"></div>
              </div>
            </div>
          </div>
        </BentoCard>

        <BentoCard variant="white" className="space-y-3 p-6 border-2 border-ink shadow-solid-sm flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-ink font-extrabold text-sm">
              <BarChart3 className="w-4 h-4 text-stamp" />
              <span>Submission Time Patterns</span>
            </div>
            <p className="text-xs text-graphite leading-relaxed">
              74% of handwritten photos are submitted between 6:00 PM and 9:00 PM after power restoration in rural haor zones.
            </p>
          </div>
          <BarcodeStub label="POWER-CYCLE" time="EVENING" />
        </BentoCard>
      </div>

    </div>
  );
};
