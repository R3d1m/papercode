import React, { useState, useEffect } from 'react';
import { executeCodeOnJudge0, LANGUAGE_IDS } from '../../services/judge0';
import { Judge0ExecutionResult } from '../../types';
import { Play, RotateCcw, Sparkles, Terminal, Copy, Check, FileCode } from 'lucide-react';

interface CodeIDEProps {
  initialCode?: string;
  initialLanguage?: 'python' | 'javascript' | 'cpp';
  title?: string;
  showLanguageSelector?: boolean;
  onCodeChange?: (newCode: string) => void;
  className?: string;
}

export const CodeIDE: React.FC<CodeIDEProps> = ({
  initialCode = `# Scanned from Class 9 ICT Notebook, Ex 4.2
def calculate_grade(marks):
    if marks >= 80:
        return "A+ (Golden GPA 5.0)"
    elif marks >= 70:
        return "A (GPA 4.0)"
    elif marks >= 60:
        return "A- (GPA 3.5)"
    else:
        return "Passed"

student_marks = [85, 92, 64, 78]
print("=== PaperCode Mobile Execution Result ===")
for m in student_marks:
    print(f"Marks: {m} -> Grade: {calculate_grade(m)}")`,
  initialLanguage = 'python',
  title = 'PaperCode Mobile IDE & Judge0 Cloud Runner',
  showLanguageSelector = true,
  onCodeChange,
  className = ''
}) => {
  const [language, setLanguage] = useState<'python' | 'javascript' | 'cpp'>(initialLanguage);
  const [code, setCode] = useState<string>(initialCode);
  const [stdin, setStdin] = useState<string>('');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [executionResult, setExecutionResult] = useState<Judge0ExecutionResult | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    if (initialCode !== undefined) {
      setCode(initialCode);
    }
  }, [initialCode]);

  const handleRun = async () => {
    setIsRunning(true);
    const langId = LANGUAGE_IDS[language];
    try {
      const result = await executeCodeOnJudge0(code, langId, stdin);
      setExecutionResult(result);
    } catch (e: any) {
      setExecutionResult({
        stdout: null,
        stderr: e.message || 'Execution failed',
        compile_output: null,
        message: null,
        status: { id: 11, description: 'Error' },
        time: '0.00',
        memory: 0,
        exit_code: 1
      });
    } finally {
      setIsRunning(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setCode(initialCode);
    if (onCodeChange) onCodeChange(initialCode);
    setExecutionResult(null);
  };

  const lineCount = code.split('\n').length;

  return (
    <div className={`border-[2px] border-ink bg-[#0F172A] rounded-2xl overflow-hidden shadow-solid-md flex flex-col ${className}`}>
      
      {/* IDE Top Bar */}
      <div className="bg-[#1E293B] border-b border-ink/40 px-4 py-2.5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5">
            <div className="w-3 h-3 rounded-full bg-[#EF4444] border border-black/30"></div>
            <div className="w-3 h-3 rounded-full bg-[#F59E0B] border border-black/30"></div>
            <div className="w-3 h-3 rounded-full bg-[#10B981] border border-black/30"></div>
          </div>

          <div className="flex items-center space-x-1.5 text-xs font-mono font-bold text-slate-200">
            <FileCode className="w-3.5 h-3.5 text-highlighter" />
            <span>{language === 'python' ? 'main.py' : language === 'javascript' ? 'index.js' : 'main.cpp'}</span>
            <span className="text-[10px] text-slate-400 font-normal">| Judge0 CE #{LANGUAGE_IDS[language]}</span>
          </div>
        </div>

        {/* Language Switcher & Controls */}
        <div className="flex items-center space-x-2">
          {showLanguageSelector && (
            <div className="flex items-center bg-black/50 border border-slate-700 rounded-full p-0.5 text-[11px] font-mono">
              <button
                onClick={() => setLanguage('python')}
                className={`px-2.5 py-0.5 rounded-full font-bold transition-all ${language === 'python' ? 'bg-highlighter text-ink' : 'text-slate-300 hover:text-white'}`}
              >
                Python
              </button>
              <button
                onClick={() => setLanguage('javascript')}
                className={`px-2.5 py-0.5 rounded-full font-bold transition-all ${language === 'javascript' ? 'bg-highlighter text-ink' : 'text-slate-300 hover:text-white'}`}
              >
                JS
              </button>
              <button
                onClick={() => setLanguage('cpp')}
                className={`px-2.5 py-0.5 rounded-full font-bold transition-all ${language === 'cpp' ? 'bg-highlighter text-ink' : 'text-slate-300 hover:text-white'}`}
              >
                C++
              </button>
            </div>
          )}

          <button
            onClick={handleCopy}
            className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            title="Copy Code"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={handleReset}
            className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            title="Reset"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleRun}
            disabled={isRunning}
            className="flex items-center space-x-1.5 bg-highlighter hover:bg-highlighter-hover text-ink px-4 py-1.5 rounded-full font-extrabold text-xs transition-all border border-ink shadow-sm active:translate-y-0.5"
          >
            {isRunning ? (
              <>
                <span className="w-3 h-3 border-2 border-ink border-t-transparent rounded-full animate-spin"></span>
                <span>Executing...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-ink" />
                <span>RUN CODE</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Code Editor Body */}
      <div className="relative flex-1 min-h-[220px] max-h-[360px] overflow-y-auto terminal-scroll bg-[#0F172A] flex font-mono text-sm">
        <div className="flex w-full">
          <div className="py-3 px-3 select-none text-right bg-[#1E293B]/50 text-slate-500 font-mono text-xs border-r border-slate-800 min-w-[40px]">
            {Array.from({ length: Math.max(lineCount, 8) }).map((_, i) => (
              <div key={i} className="leading-6">{i + 1}</div>
            ))}
          </div>

          <div className="relative flex-1 p-3">
            <textarea
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
                if (onCodeChange) onCodeChange(e.target.value);
              }}
              spellCheck={false}
              className="w-full h-full min-h-[200px] bg-transparent text-slate-100 font-mono text-sm leading-6 resize-none focus:outline-none placeholder-slate-500 selection:bg-highlighter selection:text-ink"
              placeholder="# Handwrite or type your code here..."
            />
          </div>
        </div>
      </div>

      {/* Terminal Output Panel */}
      <div className="border-t border-slate-800 bg-[#090D16] p-3 font-mono text-xs">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800/80 mb-2">
          <div className="flex items-center space-x-2 text-slate-300 font-bold">
            <Terminal className="w-3.5 h-3.5 text-highlighter" />
            <span>TERMINAL OUTPUT</span>
            {executionResult && (
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${executionResult.exit_code === 0 ? 'bg-green-900/80 text-green-300 border border-green-600' : 'bg-red-900/80 text-red-300 border border-red-600'}`}>
                {executionResult.status.description} (Exit: {executionResult.exit_code})
              </span>
            )}
          </div>

          {executionResult && (
            <div className="flex items-center space-x-3 text-[10px] text-slate-400">
              <span>Time: <strong className="text-slate-200">{executionResult.time || '0.03'}s</strong></span>
              <span>Memory: <strong className="text-slate-200">{executionResult.memory || '3200'} KB</strong></span>
            </div>
          )}
        </div>

        <div className="min-h-[70px] max-h-[140px] overflow-y-auto terminal-scroll text-slate-200 font-mono text-xs leading-relaxed whitespace-pre-wrap">
          {isRunning ? (
            <div className="text-highlighter animate-pulse flex items-center space-x-2 py-2 font-bold">
              <span className="w-2 h-2 rounded-full bg-highlighter animate-ping"></span>
              <span>[Judge0 CE Engine] Compiling & executing on sandbox worker...</span>
            </div>
          ) : executionResult ? (
            <>
              {executionResult.stdout && (
                <div className="text-green-400 font-bold">{executionResult.stdout}</div>
              )}
              {executionResult.stderr && (
                <div className="text-red-400 font-bold">{executionResult.stderr}</div>
              )}
              {executionResult.compile_output && (
                <div className="text-amber-400 font-bold">{executionResult.compile_output}</div>
              )}
            </>
          ) : (
            <div className="text-slate-400 italic">
              Click &quot;RUN CODE&quot; above to execute this handwritten Python snippet on live Judge0 compiler.
            </div>
          )}
        </div>
      </div>

    </div>
  );
};
