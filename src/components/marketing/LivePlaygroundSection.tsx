import React from 'react';
import { CodeIDE } from '../common/CodeIDE';
import { Sparkles, Terminal, Code, Cpu } from 'lucide-react';

export const LivePlaygroundSection: React.FC = () => {
  return (
    <section id="live-ide" className="py-20 px-4 max-w-7xl mx-auto border-t border-ink/15">
      
      <div className="text-center space-y-3 mb-12">
        <div className="inline-flex items-center space-x-2 bg-highlighter text-ink border border-ink px-4 py-1 rounded-full text-xs font-extrabold uppercase">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Interactive Playground</span>
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-ink tracking-tight">
          Try the Judge0-Powered Mobile IDE
        </h2>
        <p className="text-graphite text-base max-w-2xl mx-auto">
          Test real Python, JavaScript, or C++ code execution directly in your browser. This same engine powers every student lesson and teacher gradebook.
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        <CodeIDE
          title="PaperCode Sandbox Runner"
          showLanguageSelector={true}
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 max-w-4xl mx-auto text-xs font-mono text-center">
        <div className="p-3 bg-paper-card border border-ink/20 rounded-2xl">
          <span className="text-graphite block text-[10px]">EXECUTION TIME</span>
          <strong className="text-ink text-sm">~35ms Average</strong>
        </div>
        <div className="p-3 bg-paper-card border border-ink/20 rounded-2xl">
          <span className="text-graphite block text-[10px]">JUDGE0 INSTANCE</span>
          <strong className="text-ink text-sm">ce.judge0.com CE</strong>
        </div>
        <div className="p-3 bg-paper-card border border-ink/20 rounded-2xl">
          <span className="text-graphite block text-[10px]">LANGUAGES</span>
          <strong className="text-ink text-sm">Py 3 / JS / C++ / Java</strong>
        </div>
        <div className="p-3 bg-paper-card border border-ink/20 rounded-2xl">
          <span className="text-graphite block text-[10px]">BANDWIDTH PER RUN</span>
          <strong className="text-ink text-sm">&lt; 1.4 KB (2G Friendly)</strong>
        </div>
      </div>

    </section>
  );
};
