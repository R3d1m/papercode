import React, { useState, useEffect } from 'react';
import { executeCodeOnJudge0, LANGUAGE_IDS } from '../../services/judge0';
import { Judge0ExecutionResult } from '../../types';
import { apiClient } from '../../services/apiClient';
import { 
  Play, 
  RotateCcw, 
  Sparkles, 
  Terminal, 
  Copy, 
  Check, 
  FileCode, 
  AlertTriangle, 
  X, 
  RefreshCw,
  Bot
} from 'lucide-react';

export function normalizeOutput(str: string | null | undefined): string {
  if (str === null || str === undefined) return '';
  return str
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .split('\n')
    .map(line => line.trimEnd())
    .join('\n')
    .trim();
}

interface CodeIDEProps {
  initialCode?: string;
  initialLanguage?: 'python' | 'javascript' | 'cpp';
  title?: string;
  showLanguageSelector?: boolean;
  onCodeChange?: (newCode: string) => void;
  expectedOutput?: string;
  onExecutionResult?: (result: Judge0ExecutionResult | null, isMatching: boolean) => void;
  className?: string;
}

export const CodeIDE: React.FC<CodeIDEProps> = ({
  initialCode = `# BdOI Training: String Slicing Cipher
secret = "BANGLADESH-2026"
reversed_code = secret[::-1]
print("=== BdOI Cipher Engine ===")
print("Original Text: ", secret)
print("Reversed Cipher:", reversed_code)
print("Decrypted Back :", reversed_code[::-1])`,
  initialLanguage = 'python',
  title = 'PaperCode Mobile IDE & Judge0 Cloud Runner',
  showLanguageSelector = true,
  onCodeChange,
  expectedOutput,
  onExecutionResult,
  className = ''
}) => {
  const [language, setLanguage] = useState<'python' | 'javascript' | 'cpp'>(initialLanguage);
  const [code, setCode] = useState<string>(initialCode);
  const [stdin, setStdin] = useState<string>('');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [executionResult, setExecutionResult] = useState<Judge0ExecutionResult | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  // Gemini AI Tutor Floating State
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);
  const [aiMode, setAiMode] = useState<'explain' | 'debug' | null>(null);
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);

  useEffect(() => {
    if (initialCode !== undefined) {
      setCode(initialCode);
    }
  }, [initialCode]);

  const hasError = Boolean(
    executionResult && (
      executionResult.stderr || 
      executionResult.compile_output || 
      (executionResult.status && executionResult.status.id !== 3) ||
      executionResult.exit_code !== 0
    )
  );

  const hasExpectedOutput = typeof expectedOutput === 'string' && expectedOutput.trim().length > 0;
  const isOutputMatching = Boolean(
    executionResult && (
      hasExpectedOutput
        ? normalizeOutput(executionResult.stdout) === normalizeOutput(expectedOutput)
        : (executionResult.exit_code === 0 && Boolean(executionResult.stdout))
    )
  );

  const handleRun = async () => {
    setIsRunning(true);
    const langId = LANGUAGE_IDS[language];
    try {
      const result = await executeCodeOnJudge0(code, langId, stdin);
      setExecutionResult(result);

      const matching = hasExpectedOutput
        ? normalizeOutput(result.stdout) === normalizeOutput(expectedOutput)
        : (result.exit_code === 0 && Boolean(result.stdout));

      if (onExecutionResult) {
        onExecutionResult(result, matching);
      }
    } catch (e: any) {
      const errRes: Judge0ExecutionResult = {
        stdout: null,
        stderr: e.message || 'Execution failed',
        compile_output: null,
        message: null,
        status: { id: 11, description: 'Error' },
        time: '0.00',
        memory: 0,
        exit_code: 1
      };
      setExecutionResult(errRes);
      if (onExecutionResult) {
        onExecutionResult(errRes, false);
      }
    } finally {
      setIsRunning(false);
    }
  };

  const handleAskAi = async (mode: 'explain' | 'debug') => {
    setAiMode(mode);

    // If student clicks Explain Code:
    if (mode === 'explain') {
      // Case 1: Code has not been run yet
      if (!executionResult) {
        setIsAiLoading(false);
        setAiExplanation('আগে কোডটি রান (RUN CODE) করো, তারপর আমি এটি বুঝিয়ে দেবো।');
        return;
      }

      // Case 2: Code was run but has an error
      if (hasError) {
        setIsAiLoading(false);
        setAiExplanation('তোমার কোডে ভুল (Error) রয়েছে। আগে কোডের ভুল ঠিক করে সফলভাবে রান (RUN CODE) করো, তারপর আমি এটি বুঝিয়ে দেবো। কী ভুল হয়েছে জানতে নিচের "কী ভুল হয়েছে? (What went wrong?)" বাটনে ক্লিক করো।');
        return;
      }
    }

    // If student clicks What Went Wrong:
    if (mode === 'debug' && !executionResult) {
      setIsAiLoading(false);
      setAiExplanation('কী ভুল হয়েছে দেখতে প্রথমে তোমার কোডটি রান (RUN CODE) করো।');
      return;
    }

    setIsAiLoading(true);
    setAiExplanation(null);

    const errorDetails = executionResult?.stderr || 
      executionResult?.compile_output || 
      (executionResult?.exit_code !== 0 ? executionResult?.message : null);

    try {
      const res = await apiClient.explainCode(code, language, errorDetails, mode);
      setAiExplanation(res?.explanation || 'ব্যাখ্যা পাওয়া যায়নি।');
    } catch (err) {
      setAiExplanation(
        mode === 'debug'
          ? 'টার্মিনাল আউটপুটে নির্দেশিত লাইনের বানান বা সিনট্যাক্সটি ঠিক করে পুনরায় রান করো।'
          : 'এই প্রোগ্রামটি ভেরিয়েবল ও লজিক ব্যবহার করে ফলাফল স্ক্রিনে প্রদর্শন করছে।'
      );
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleCloseAi = () => {
    setAiExplanation(null);
    setAiMode(null);
    setIsAiLoading(false);
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
    handleCloseAi();
  };

  const lineCount = code.split('\n').length;

  return (
    <div className="flex flex-col space-y-3 w-full">
      {/* 1. Main IDE Box */}
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

      {/* Code Editor Body with Floating AI Buttons */}
      <div className="relative flex-1 min-h-[220px] max-h-[360px] overflow-y-auto terminal-scroll bg-[#0F172A] flex font-mono text-sm">
        
        {/* Floating AI Action Pills (Top Right of Editor) */}
        <div className="absolute top-2 right-4 z-20 flex items-center gap-2 pointer-events-auto">
          
          {/* Explain Code Button */}
          <button
            type="button"
            onClick={() => handleAskAi('explain')}
            disabled={isAiLoading}
            className="px-2.5 py-1 bg-slate-800/90 hover:bg-slate-700 text-highlighter hover:text-white border border-highlighter/40 hover:border-highlighter rounded-full text-[11px] font-mono font-bold flex items-center gap-1.5 shadow-md backdrop-blur transition-all active:scale-95"
            title="Ask Gemini to explain this code in 1-2 lines"
          >
            <Sparkles className="w-3.5 h-3.5 text-highlighter animate-pulse" />
            <span>Explain Code</span>
          </button>

          {/* What Went Wrong Button (shown when execution errors exist) */}
          {hasError && (
            <button
              type="button"
              onClick={() => handleAskAi('debug')}
              disabled={isAiLoading}
              className="px-2.5 py-1 bg-red-950/90 hover:bg-red-900 text-red-200 hover:text-white border border-red-500 rounded-full text-[11px] font-mono font-bold flex items-center gap-1.5 shadow-md backdrop-blur transition-all animate-bounce active:scale-95"
              title="Ask Gemini what went wrong in 1-2 lines"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
              <span>What went wrong?</span>
            </button>
          )}
        </div>

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
              className="w-full h-full min-h-[200px] bg-transparent text-slate-100 font-mono text-sm leading-6 resize-none focus:outline-none placeholder-slate-500 selection:bg-highlighter selection:text-ink pt-6"
              placeholder="# Handwrite or type your code here..."
            />
          </div>
        </div>
      </div>

      {/* Optional Expected Output Panel for Lesson Challenges */}
      {hasExpectedOutput && (
        <div className="border-t border-slate-800 bg-[#0B1120] p-3 font-mono text-xs space-y-2">
          <div className="flex items-center justify-between text-slate-300 font-bold border-b border-slate-800/80 pb-1.5 flex-wrap gap-2">
            <div className="flex items-center space-x-1.5 text-highlighter">
              <Sparkles className="w-3.5 h-3.5" />
              <span>EXPECTED CHALLENGE OUTPUT</span>
            </div>
            {executionResult && (
              <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                isOutputMatching
                  ? 'bg-green-900/90 text-green-300 border border-green-500'
                  : 'bg-red-900/90 text-red-300 border border-red-500'
              }`}>
                {isOutputMatching ? '✓ Output Matches Expected Output!' : '✗ Output Does Not Match'}
              </span>
            )}
          </div>
          
          <div className="p-2.5 bg-[#050811] rounded-xl border border-slate-800 text-slate-200 font-mono text-xs whitespace-pre-wrap leading-relaxed">
            {expectedOutput}
          </div>

          {executionResult && !isOutputMatching && (
            <div className="p-2.5 bg-red-950/60 border border-red-500/60 rounded-xl text-red-200 text-[11px] leading-relaxed flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <strong>Output Mismatch:</strong> Your program&apos;s output must match the required output above to unlock submission. Please check your logic/spelling and click <strong>RUN CODE</strong> again!
              </div>
            </div>
          )}

          {executionResult && isOutputMatching && (
            <div className="p-2.5 bg-green-950/60 border border-green-500/60 rounded-xl text-green-200 text-[11px] leading-relaxed flex items-center gap-2">
              <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
              <div>
                <strong>Challenge Passed:</strong> Your output matches perfectly! You can now submit this challenge below.
              </div>
            </div>
          )}
        </div>
      )}

      {/* Terminal Output Panel */}
      <div className="border-t border-slate-800 bg-[#090D16] p-3 font-mono text-xs">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800/80 mb-2">
          <div className="flex items-center space-x-2 text-slate-300 font-bold">
            <Terminal className="w-3.5 h-3.5 text-highlighter" />
            <span>TERMINAL OUTPUT (Your Code Output)</span>
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

    {/* 2. SEPARATE GEMINI AI REVIEW & TUTOR BOX */}
    {(isAiLoading || aiExplanation) && (
      <div className="border-2 border-ink bg-paper-card rounded-2xl p-4 sm:p-5 shadow-solid-md space-y-3 animate-fadeIn">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-ink/10 pb-3 flex-wrap gap-2">
          <div className="flex items-center space-x-2.5">
            <span className="p-1.5 bg-highlighter border-2 border-ink rounded-xl text-ink shadow-solid-xs">
              <Bot className="w-5 h-5 text-stamp" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-extrabold text-xs sm:text-sm uppercase tracking-wider text-ink">
                  {aiMode === 'debug' ? 'Error Breakdown' : 'Code Review'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {hasError && aiMode === 'explain' && (
              <button
                type="button"
                onClick={() => handleAskAi('debug')}
                className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-950 border-2 border-red-700 rounded-full text-xs font-mono font-extrabold shadow-solid-xs transition-all active:scale-95 flex items-center gap-1"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                <span>কী ভুল হয়েছে? (What went wrong?) →</span>
              </button>
            )}
            {hasError && aiMode === 'debug' && (
              <button
                type="button"
                onClick={() => handleAskAi('explain')}
                className="px-3 py-1 bg-highlighter hover:bg-highlighter-hover text-ink border-2 border-ink rounded-full text-xs font-mono font-extrabold shadow-solid-xs transition-all active:scale-95 flex items-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5 text-stamp" />
                <span>কোডটি বুঝিয়ে দাও (Explain Code) →</span>
              </button>
            )}
            <button
              type="button"
              onClick={handleCloseAi}
              className="p-1.5 text-graphite hover:text-ink hover:bg-paper-light rounded-lg border-2 border-transparent hover:border-ink transition-all"
              title="Close AI review box"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-4 bg-paper-light rounded-xl border-2 border-ink/20">
          {isAiLoading ? (
            <div className="flex items-center space-x-2 text-ink font-mono text-xs py-1">
              <RefreshCw className="w-4 h-4 text-stamp animate-spin" />
              <span className="font-bold">Getting the AI explanation...</span>
            </div>
          ) : (
            <p className="text-ink font-sans text-sm sm:text-base font-bold leading-relaxed">
              {aiExplanation}
            </p>
          )}
        </div>
      </div>
    )}

  </div>
  );
};
