import React, { useState } from 'react';
import { HandwrittenScanner } from '../common/HandwrittenScanner';
import { CodeIDE } from '../common/CodeIDE';
import { BentoCard } from '../common/BentoCard';
import { PillButton } from '../common/PillButton';
import { 
  Sparkles, 
  Terminal, 
  Cpu, 
  Camera, 
  ArrowRight, 
  CheckCircle2, 
  BookOpen, 
  Zap,
  Layers,
  Code2,
  FileCode2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface PublicPlaygroundPageProps {
  onOpenAuth?: (tab: 'login' | 'signup') => void;
}

interface SamplePreset {
  id: string;
  title: string;
  subject: string;
  language: 'python' | 'cpp' | 'javascript';
  handwrittenPreview: string;
  code: string;
  description: string;
}

const SAMPLE_PRESETS: SamplePreset[] = [
  {
    id: 'preset-py-cipher',
    title: 'Olympiad Camp: Reverse Word Cipher',
    subject: 'Bangladesh Olympiad in Informatics',
    language: 'python',
    handwrittenPreview: `# BdOI Training: Secret String Cipher
secret = "BANGLADESH-2026"
reversed_code = secret[::-1]
print("Original:", secret)
print("Encrypted:", reversed_code)`,
    code: `# BdOI Training: String Slicing Cipher
secret = "BANGLADESH-2026"
reversed_code = secret[::-1]
print("=== BdOI Cipher Engine ===")
print("Original Text: ", secret)
print("Reversed Cipher:", reversed_code)
print("Decrypted Back :", reversed_code[::-1])`,
    description: 'String manipulation and slicing syntax commonly taught in programming contests and Olympiad camps.'
  },
  {
    id: 'preset-py-hsc',
    title: 'HSC ICT Chapter 5: GPA Calculator',
    subject: 'NCTB Curriculum (Class 11-12)',
    language: 'python',
    handwrittenPreview: `# HSC ICT Chapter 5: Python Conditionals
def get_grade(marks):
    if marks >= 80:
        return "A+ (GPA 5.0)"
    elif marks >= 70:
        return "A (GPA 4.0)"
    elif marks >= 60:
        return "A- (GPA 3.5)"
    else:
        return "Passed"

marks_list = [85, 92, 64, 78]
for m in marks_list:
    print(f"Marks: {m} -> Grade: {get_grade(m)}")`,
    code: `# Scanned from Class 11 ICT Khata (Ruled Paper)
def get_grade(marks):
    if marks >= 80:
        return "A+ (GPA 5.0)"
    elif marks >= 70:
        return "A (GPA 4.0)"
    elif marks >= 60:
        return "A- (GPA 3.5)"
    else:
        return "Passed"

marks_list = [85, 92, 64, 78]
print("=== PaperCode Live Neural Execution ===")
for m in marks_list:
    print(f"Student Marks: {m} -> {get_grade(m)}")`,
    description: 'Calculates board exam GPA using Python conditional branches written on standard ruled notebook khata.'
  },
  {
    id: 'preset-cpp-loops',
    title: 'Class 9-10: C/C++ Loop Summation',
    subject: 'Secondary ICT Curriculum',
    language: 'cpp',
    handwrittenPreview: `// Class 9 ICT: Sum of first N numbers
#include <iostream>
using namespace std;

int main() {
    int n = 10;
    int sum = 0;
    for (int i = 1; i <= n; i++) {
        sum += i;
    }
    cout << "Sum of first " << n << " numbers = " << sum << endl;
    return 0;
}`,
    code: `// Scanned from SSC ICT Notebook
#include <iostream>
using namespace std;

int main() {
    int n = 10;
    int sum = 0;
    for (int i = 1; i <= n; i++) {
        sum += i;
    }
    cout << "=== PaperCode C++ Execution ===" << endl;
    cout << "Sum of first " << n << " numbers = " << sum << endl;
    return 0;
}`,
    description: 'Computes arithmetic series using structured loop syntax.'
  },
  {
    id: 'preset-js-web',
    title: 'Web Logic: Array Filter & Transform',
    subject: 'Modern Scripting',
    language: 'javascript',
    handwrittenPreview: `// JavaScript Data Processing
const students = ["Rahim", "Karim", "Fatima", "Ayesha"];
const greeting = students.map(name => "Hello " + name + "!");
greeting.forEach(msg => console.log(msg));`,
    code: `// Scanned from JavaScript Notebook Page
const students = ["Rahim", "Karim", "Fatima", "Ayesha"];
console.log("=== PaperCode JS Engine ===");
const greetings = students.map((name, i) => \`\${i + 1}. Welcome \${name} to PaperCode Bangladesh!\`);
greetings.forEach(msg => console.log(msg));`,
    description: 'Array functional mapping and arrow functions executed in Node.js environment.'
  }
];

export const PublicPlaygroundPage: React.FC<PublicPlaygroundPageProps> = ({ onOpenAuth }) => {
  const [selectedPreset, setSelectedPreset] = useState<SamplePreset>(SAMPLE_PRESETS[0]);
  const [activeCode, setActiveCode] = useState<string>(SAMPLE_PRESETS[0].code);
  const [activeLang, setActiveLang] = useState<'python' | 'cpp' | 'javascript'>('python');
  const [isPresetsExpanded, setIsPresetsExpanded] = useState<boolean>(false);

  const handleSelectPreset = (preset: SamplePreset) => {
    setSelectedPreset(preset);
    setActiveCode(preset.code);
    setActiveLang(preset.language);
    confetti({ particleCount: 40, spread: 50, origin: { y: 0.6 } });
  };

  const handleScanComplete = (scannedText: string, detectedLang?: 'python' | 'cpp' | 'javascript') => {
    setActiveCode(scannedText);
    if (detectedLang) {
      setActiveLang(detectedLang);
    }
    confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto py-8 px-4 animate-fadeIn">
      
      {/* 2. Interactive Preset Khata Selectors (Expandable / Collapsible) */}
      <div className="space-y-3 bg-paper-card border-2 border-ink rounded-2xl p-4 shadow-solid-xs">
        <div 
          onClick={() => setIsPresetsExpanded(!isPresetsExpanded)}
          className="flex items-center justify-between cursor-pointer select-none gap-2 flex-wrap"
        >
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-paper-muted border border-ink/40 rounded-lg text-stamp">
              <BookOpen className="w-4 h-4" />
            </span>
            <div>
              <span className="text-xs font-mono font-extrabold text-ink uppercase tracking-wider block">
                Sample Handwritten Codes
              </span>
              <span className="text-[11px] font-mono text-graphite font-bold">
                Active: <span className="text-stamp">{selectedPreset.title}</span> ({selectedPreset.language.toUpperCase()})
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-mono text-stamp font-bold hidden sm:inline">
              ★ Instant 1-Click Load
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsPresetsExpanded(!isPresetsExpanded);
              }}
              className="px-3 py-1 bg-white hover:bg-paper-light border-2 border-ink rounded-full text-xs font-mono font-extrabold text-ink flex items-center gap-1.5 shadow-solid-xs btn-bounce"
            >
              <span>{isPresetsExpanded ? 'Collapse Presets' : 'Expand 4 Presets'}</span>
              {isPresetsExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {isPresetsExpanded && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-3 border-t border-ink/15 animate-fadeIn">
            {SAMPLE_PRESETS.map((preset) => {
              const isSelected = selectedPreset.id === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleSelectPreset(preset)}
                  className={'p-4 rounded-2xl border-2 text-left transition-all flex flex-col justify-between space-y-2 btn-bounce ' + (
                    isSelected 
                      ? 'bg-highlighter border-ink shadow-solid-sm ring-2 ring-ink ring-offset-2' 
                      : 'bg-white border-ink/30 hover:border-ink hover:bg-paper-light'
                  )}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="px-2 py-0.5 bg-paper-muted border border-ink/40 rounded font-mono text-[9px] font-extrabold uppercase text-ink">
                        {preset.language.toUpperCase()}
                      </span>
                      {isSelected && (
                        <span className="text-[10px] font-mono font-extrabold text-stamp">
                          ● Active
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm font-extrabold text-ink leading-snug">{preset.title}</h3>
                    <p className="text-[11px] text-graphite font-medium line-clamp-2 mt-1">{preset.description}</p>
                  </div>

                  <div className="pt-2 border-t border-ink/10 text-[10px] font-mono font-bold text-ink/70 flex items-center justify-between">
                    <span>{preset.subject}</span>
                    <span className="font-bold text-stamp">Load ➔</span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 3. Side-by-Side Playground: Scanner Khata (Left) + Judge0 IDE Runner (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        
        {/* LEFT COLUMN: HANDWRITTEN SCANNER */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-extrabold text-ink flex items-center gap-2">
              <Camera className="w-5 h-5 text-stamp" />
              <span>1. Handwritten Code</span>
            </h2>
          </div>

          <HandwrittenScanner
            initialHandwrittenCode={selectedPreset.handwrittenPreview}
            onScanComplete={handleScanComplete}
          />

          <div className="p-4 bg-paper-light border-2 border-ink rounded-2xl text-xs space-y-2">
            <strong className="text-ink flex items-center gap-1.5 font-extrabold">
              <Sparkles className="w-4 h-4 text-stamp" />
              <span>How to test your own notebook:</span>
            </strong>
            <ol className="list-decimal list-inside space-y-1 text-graphite font-medium leading-relaxed">
              <li>Write 2-4 lines of simple code on paper khata with pen or pencil.</li>
              <li>Click <strong>&quot;Upload Photo / Camera&quot;</strong> on the scanner canvas above.</li>
              <li>The neural vision parser extracts the syntax tokens directly into the IDE editor on the right!</li>
            </ol>
          </div>
        </div>

        {/* RIGHT COLUMN: JUDGE0 CLOUD IDE */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-extrabold text-ink flex items-center gap-2">
              <Terminal className="w-5 h-5 text-stamp" />
              <span>2. Cloud Sandbox IDE & Runner</span>
            </h2>
            <span className="text-xs font-mono font-bold text-stamp">
              ● 0.03s Average Sandbox Runtime
            </span>
          </div>

          <CodeIDE
            initialCode={activeCode}
            initialLanguage={activeLang}
            title="PaperCode Public Sandbox"
            showLanguageSelector={true}
            onCodeChange={(newCode) => setActiveCode(newCode)}
          />

          <div className="p-4 bg-paper-card border-2 border-ink rounded-2xl flex items-center justify-between gap-3 text-xs font-mono text-ink">
            <div className="space-y-0.5">
              <span className="font-extrabold block">Sandboxed Judge0 CE Runner</span>
              <span className="text-[11px] text-graphite">Supports standard inputs (stdin) and multiple test cases.</span>
            </div>
            <span className="px-2.5 py-1 bg-green-100 border border-green-700 text-green-900 font-extrabold rounded-lg text-[10px]">
              Active & Live
            </span>
          </div>
        </div>

      </div>

      {/* 4. Why This Matters / Pedagogy Bento Grid */}
      {/* <div className="space-y-6 pt-6 border-t-2 border-ink/10">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-ink">
            Why Millions of Students Learn Faster on Paper
          </h2>
          <p className="text-xs sm:text-sm text-graphite font-bold">
            PaperCode solves the computer lab bottleneck across all 64 districts in Bangladesh.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <BentoCard variant="white" className="p-6 border-2 border-ink shadow-solid-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-highlighter border border-ink flex items-center justify-center text-ink shadow-solid-xs">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-extrabold text-ink">Zero Hardware Cost</h3>
            <p className="text-xs text-graphite font-medium leading-relaxed">
              No need for expensive laptops, desktop monitors, or air-conditioned labs. A standard paper notebook and a family phone camera are all students need.
            </p>
          </BentoCard>

          <BentoCard variant="white" className="p-6 border-2 border-ink shadow-solid-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-paper-muted border border-ink flex items-center justify-center text-stamp shadow-solid-xs">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-extrabold text-ink">4x Retention & Syntax Mastery</h3>
            <p className="text-xs text-graphite font-medium leading-relaxed">
              Handwriting forces conscious algorithmic thinking and eliminates mindless copy-pasting, producing higher national board exam scores.
            </p>
          </BentoCard>

          <BentoCard variant="white" className="p-6 border-2 border-ink shadow-solid-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-stamp text-white border border-ink flex items-center justify-center shadow-solid-xs">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-extrabold text-ink">Ultra-Low 2G Bandwidth</h3>
            <p className="text-xs text-graphite font-medium leading-relaxed">
              Code execution packets average under 1.4 KB per run, allowing fast performance even in rural areas with intermittent cellular reception.
            </p>
          </BentoCard>
        </div>
      </div> */}

      {/* 5. Bottom Conversion Banner */}
      {/* {onOpenAuth && (
        <div className="p-8 bg-highlighter border-2 border-ink rounded-bento shadow-solid-md flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="space-y-1 max-w-xl">
            <span className="px-3 py-0.5 bg-ink text-highlighter font-mono text-[10px] font-extrabold uppercase rounded-full">
              Full Platform Access
            </span>
            <h3 className="text-2xl font-extrabold text-ink">Ready to begin your structured coding journey?</h3>
            <p className="text-xs sm:text-sm text-ink/80 font-bold">
              Join classrooms, submit handwritten assignments to your school teacher, and climb the national leaderboard.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <PillButton
              variant="primary"
              size="lg"
              onClick={() => onOpenAuth('signup')}
              className="btn-bounce shadow-solid-sm"
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Sign Up as Student (Free) ➔
            </PillButton>

            <PillButton
              variant="secondary"
              size="lg"
              onClick={() => onOpenAuth('login')}
              className="btn-bounce"
            >
              Sign In
            </PillButton>
          </div>
        </div>
      )} */}

    </div>
  );
};
