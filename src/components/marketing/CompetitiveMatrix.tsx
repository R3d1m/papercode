import React from 'react';
import { BentoCard } from '../common/BentoCard';
import { Check, X, Minus } from 'lucide-react';

export const CompetitiveMatrix: React.FC = () => {
  const comparisons = [
    { feature: 'Hardware Requirement', papercode: 'Smartphone + Pen & Paper', scratch: 'PC / Laptop / Tablet', khan: 'PC / Laptop', sololearn: 'Smartphone (Typing)' },
    { feature: 'Code Input Method', papercode: 'Handwritten Photo OCR & Mobile IDE', scratch: 'Drag-and-Drop Blocks', khan: 'Full Keyboard Typing', sololearn: 'Virtual Keyboard Typing' },
    { feature: 'Works during Power Outages', papercode: 'Yes (Write Offline)', scratch: 'No', khan: 'No', sololearn: 'Partial' },
    { feature: 'NCTB & HSC ICT Alignment', papercode: '100% Chapter 5 Aligned', scratch: 'None (US Elementary)', khan: 'None (US AP CS)', sololearn: 'Generic' },
    { feature: 'Real Code Execution (Judge0)', papercode: 'Yes (Python/C++/JS)', scratch: 'Blocks only', khan: 'JavaScript only', sololearn: 'Yes (Cloud)' },
    { feature: 'Batch Teacher Grading Suite', papercode: 'Yes (Spreadsheet + OCR Diff)', scratch: 'No', khan: 'Basic Roster', sololearn: 'No (Self-paced only)' }
  ];

  return (
    <section className="py-16 px-4 max-w-7xl mx-auto border-t border-ink/15">
      
      <div className="text-center space-y-3 mb-12">
        <span className="text-xs font-mono uppercase tracking-wider text-stamp font-bold">
          Competitive Matrix
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-ink tracking-tight">
          How PaperCode compares with global platforms.
        </h2>
      </div>

      <div className="border-[1.5px] border-ink bg-paper-card rounded-bento overflow-x-auto shadow-solid-md">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead>
            <tr className="bg-paper-muted border-b border-ink">
              <th className="p-4 sm:p-5 font-extrabold text-ink">Feature / Dimension</th>
              <th className="p-4 sm:p-5 font-extrabold text-ink bg-highlighter/60 border-x border-ink">
                PaperCode (Bangladesh)
              </th>
              <th className="p-4 sm:p-5 font-bold text-graphite">Scratch (MIT)</th>
              <th className="p-4 sm:p-5 font-bold text-graphite">Khan Academy</th>
              <th className="p-4 sm:p-5 font-bold text-graphite">Sololearn</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/15">
            {comparisons.map((row, i) => (
              <tr key={i} className="hover:bg-paper-light/50 transition-colors">
                <td className="p-4 sm:p-5 font-bold text-ink">{row.feature}</td>
                <td className="p-4 sm:p-5 font-extrabold text-ink bg-highlighter/20 border-x border-ink">
                  {row.papercode}
                </td>
                <td className="p-4 sm:p-5 text-graphite">{row.scratch}</td>
                <td className="p-4 sm:p-5 text-graphite">{row.khan}</td>
                <td className="p-4 sm:p-5 text-graphite">{row.sololearn}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </section>
  );
};
