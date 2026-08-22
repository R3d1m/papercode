import React, { useState } from 'react';
import { HandwrittenScanner } from '../common/HandwrittenScanner';
import { CodeIDE } from '../common/CodeIDE';
import { Sparkles, Terminal, Camera } from 'lucide-react';
import confetti from 'canvas-confetti';

const SAMPLE_KHATA_CODE = `# BdOI Training: Secret String Cipher
secret = "BANGLADESH-2026"
reversed_code = secret[::-1]
print("Original:", secret)
print("Encrypted:", reversed_code)`;

export const LivePlaygroundSection: React.FC = () => {
  const [activeCode, setActiveCode] = useState<string>(SAMPLE_KHATA_CODE);
  const [activeLang, setActiveLang] = useState<'python' | 'cpp' | 'javascript'>('python');

  const handleScanComplete = (scannedText: string, detectedLang?: 'python' | 'cpp' | 'javascript') => {
    setActiveCode(scannedText);
    if (detectedLang) {
      setActiveLang(detectedLang);
    }
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
  };

  return (
    <section id="live-ide" className="py-12 px-4 max-w-7xl mx-auto border-t-2 border-ink/10 space-y-8">
      
      {/* Clean Section Header */}
      <div className="text-center space-y-2 max-w-3xl mx-auto">
        <div className="inline-flex items-center space-x-2 bg-highlighter text-ink border-2 border-ink px-4 py-1 rounded-full text-xs font-mono font-extrabold uppercase shadow-solid-xs">
          <Sparkles className="w-3.5 h-3.5 text-stamp" />
          <span>Interactive Playground • No Login Required</span>
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-ink tracking-tight">
          Try the Live OCR Scanner & Cloud IDE
        </h2>
      </div>

      {/* Side-by-Side Live Experience */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        
        {/* Left: Handwritten Scanner */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-ink flex items-center gap-2">
              <Camera className="w-4 h-4 text-stamp" />
              <span>1. Handwritten Code</span>
            </h3>
          </div>

          <HandwrittenScanner
            initialHandwrittenCode={SAMPLE_KHATA_CODE}
            language={activeLang}
            onScanComplete={handleScanComplete}
          />
        </div>

        {/* Right: Code IDE & Runner */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-ink flex items-center gap-2">
              <Terminal className="w-4 h-4 text-stamp" />
              <span>2. Cloud Sandbox IDE & Execution</span>
            </h3>
            <span className="text-[11px] font-mono font-bold text-stamp">
              ● Judge0 Cloud Runner
            </span>
          </div>

          <CodeIDE
            initialCode={activeCode}
            initialLanguage={activeLang}
            title="PaperCode Sandbox Runner"
            showLanguageSelector={true}
            onCodeChange={(newCode) => setActiveCode(newCode)}
          />
        </div>

      </div>

      {/* Telemetry Footer
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto text-xs font-mono text-center">
        <div className="p-3 bg-paper-card border-2 border-ink rounded-2xl shadow-solid-xs">
          <span className="text-graphite block text-[10px] uppercase font-bold">Execution Time</span>
          <strong className="text-ink text-sm font-extrabold">~32ms Average</strong>
        </div>
        <div className="p-3 bg-paper-card border-2 border-ink rounded-2xl shadow-solid-xs">
          <span className="text-graphite block text-[10px] uppercase font-bold">Languages</span>
          <strong className="text-ink text-sm font-extrabold">Python, C, C++, JS</strong>
        </div>
        <div className="p-3 bg-paper-card border-2 border-ink rounded-2xl shadow-solid-xs">
          <span className="text-graphite block text-[10px] uppercase font-bold">Bandwidth Per Run</span>
          <strong className="text-ink text-sm font-extrabold">&lt; 1.4 KB (2G Safe)</strong>
        </div>
      </div> */}

    </section>
  );
};
