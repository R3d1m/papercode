import React, { useState, useEffect } from 'react';
import { Submission } from '../../types';
import { PillButton } from '../common/PillButton';
import { UserAvatar } from '../common/UserAvatar';
import { X, CheckCircle2, AlertCircle, FileText, Image as ImageIcon, Sparkles, Save, Terminal, Camera, Check } from 'lucide-react';

interface SubmissionReviewModalProps {
  submission: Submission | null;
  onClose: () => void;
  onSaveGrade: (submissionId: string, score: number, feedback: string, teacherNotes?: string) => void;
}

export const SubmissionReviewModal: React.FC<SubmissionReviewModalProps> = ({
  submission,
  onClose,
  onSaveGrade
}) => {
  if (!submission) return null;

  const [score, setScore] = useState<number>(submission.score);
  const [feedback, setFeedback] = useState<string>(submission.feedback);
  const [teacherNotes, setTeacherNotes] = useState<string>(submission.teacherNotes || '');
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  // Sync state if submission changes
  useEffect(() => {
    setScore(submission.score);
    setFeedback(submission.feedback);
    setTeacherNotes(submission.teacherNotes || '');
  }, [submission]);

  const handleSave = () => {
    onSaveGrade(submission.id, score, feedback, teacherNotes);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 800);
  };

  const isPhoto = submission.submissionType === 'photo';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/70 backdrop-blur-sm animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-paper-card border-2 border-ink rounded-[28px] p-6 sm:p-8 shadow-solid-xl max-h-[92vh] flex flex-col justify-between overflow-y-auto">
        
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between pb-4 border-b-2 border-ink/20">
          <div className="flex items-center space-x-3">
            <UserAvatar name={submission.studentName} avatar={submission.studentAvatar} size="md" className="w-10 h-10" />
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-extrabold text-lg text-ink">{submission.studentName}</h3>
                <span className={`text-[10px] font-mono font-extrabold px-2.5 py-0.5 rounded-full border ${isPhoto ? 'bg-amber-100 text-amber-950 border-amber-500' : 'bg-blue-100 text-blue-950 border-blue-500'}`}>
                  {isPhoto ? '📷 Handwritten Photo' : '⌨️ Typed Code'}
                </span>
                <span className="text-[10px] font-mono font-bold bg-paper-muted border border-ink/30 px-2 py-0.5 rounded-full text-ink">
                  {submission.studentSchool}
                </span>
              </div>
              <span className="text-xs text-graphite font-bold">{submission.exerciseTitle} • Submitted {submission.submittedAt}</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full border-2 border-ink bg-paper-muted hover:bg-paper-light transition-colors text-ink shadow-solid-xs"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Dynamic Review Canvas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
          
          {/* LEFT PANEL: PHOTO OR TYPED CODE EXPLANATION */}
          <div className="space-y-3">
            {isPhoto ? (
              <>
                <div className="flex items-center justify-between text-xs font-mono font-extrabold text-ink">
                  <span className="flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-stamp" />
                    Original Handwritten Notebook Page
                  </span>
                  <span className="text-stamp">OCR: {submission.ocrConfidence || 98}%</span>
                </div>

                <div className="border-2 border-ink rounded-2xl overflow-hidden bg-paper-dark p-2 min-h-[280px] flex items-center justify-center shadow-solid-xs">
                  {submission.handwrittenImageUrl ? (
                    <img
                      src={submission.handwrittenImageUrl}
                      alt="Student handwritten code"
                      className="w-full h-auto max-h-[340px] object-cover rounded-xl border border-ink/30"
                    />
                  ) : (
                    <div className="p-8 text-center text-xs text-graphite font-mono font-bold">
                      Handwritten photo archive loaded.
                    </div>
                  )}
                </div>

                <p className="text-[11px] text-graphite italic font-medium">
                  Verify student handwriting against the OCR transcribed code on the right before assigning final score.
                </p>
              </>
            ) : (
              <>
                <div className="flex items-center justify-between text-xs font-mono font-extrabold text-ink">
                  <span className="flex items-center gap-1.5">
                    <Terminal className="w-4 h-4 text-blue-700" />
                    Typed Code Source (Mobile Code IDE)
                  </span>
                  <span className="text-blue-700">Typed Submission</span>
                </div>

                <div className="border-2 border-ink rounded-2xl bg-[#0F172A] p-4 min-h-[280px] flex flex-col justify-between shadow-solid-xs">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-700 text-xs font-mono text-slate-300 font-bold">
                      <span>Language: {(submission?.language || 'python').toUpperCase()}</span>
                      <span className="text-green-400">● Clean Indentation</span>
                    </div>

                    <pre className="font-mono text-xs text-green-300 whitespace-pre-wrap leading-relaxed">
                      {submission.code}
                    </pre>
                  </div>

                  <div className="pt-2 border-t border-slate-700 text-[10px] font-mono text-slate-400">
                    Student entered and tested this solution directly in the PaperCode interactive browser sandbox.
                  </div>
                </div>

                <p className="text-[11px] text-graphite font-medium">
                  Student submitted directly through the mobile in-browser editor without paper scanning.
                </p>
              </>
            )}
          </div>

          {/* RIGHT PANEL: EXECUTABLE CODE, TEST CASE RESULTS & GRADING */}
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs font-mono font-extrabold text-ink">
              <span className="flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-green-700" />
                {isPhoto ? 'Transcribed Executable Code' : 'Sandbox Verification Output'}
              </span>
              <span className="text-green-700 font-extrabold">Judge0: {submission.executionResult.status.description}</span>
            </div>

            {/* Code snippet if photo, or terminal log if typed */}
            {isPhoto ? (
              <div className="p-3 bg-[#0F172A] rounded-2xl border-2 border-ink font-mono text-xs text-slate-100 overflow-x-auto max-h-[140px] shadow-solid-xs">
                <pre className="text-green-300">{submission.code}</pre>
              </div>
            ) : null}

            <div className="p-3.5 bg-paper-muted rounded-2xl border-2 border-ink/30 text-xs space-y-1.5 shadow-solid-xs">
              <span className="font-mono font-extrabold text-ink block text-[11px] uppercase">
                Judge0 Sandbox Output:
              </span>
              <div className="font-mono text-ink font-extrabold bg-white p-2.5 rounded-xl border border-ink/20">
                {submission.executionResult.stdout || 'No output'}
              </div>
            </div>

            {/* Rubric Score & Marks Controls */}
            <div className="p-4 bg-paper-light border-2 border-ink/20 rounded-2xl space-y-3 shadow-solid-xs">
              <div className="flex items-center justify-between">
                <label className="text-xs font-extrabold text-ink">Assign Score (Max: {submission.maxScore})</label>
                <input
                  type="number"
                  min="0"
                  max={submission.maxScore}
                  step="0.5"
                  value={score}
                  onChange={(e) => setScore(Number(e.target.value))}
                  className="w-20 font-mono text-base font-extrabold text-center bg-white border-2 border-ink rounded-lg py-1 text-ink"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-ink mb-1">Teacher Feedback for Student:</label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  rows={2}
                  className="w-full p-2.5 bg-white border-2 border-ink/30 rounded-xl text-xs text-ink focus:outline-none focus:border-ink font-medium"
                  placeholder="Leave encouraging comments or handwriting pointers..."
                />
              </div>
            </div>

          </div>

        </div>

        {/* Modal Bottom Actions */}
        <div className="pt-4 border-t-2 border-ink/20 flex items-center justify-between">
          <div className="text-xs text-graphite font-mono font-bold">
            {savedSuccess ? (
              <span className="text-green-700 font-extrabold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Marks updated in Gradebook!
              </span>
            ) : (
              <span>Reviewing submission ID: {submission.id}</span>
            )}
          </div>

          <div className="flex items-center space-x-3">
            <PillButton variant="secondary" size="md" onClick={onClose} className="btn-bounce">
              Cancel
            </PillButton>
            <PillButton variant="highlighter" size="md" onClick={handleSave} className="btn-bounce" icon={<Save className="w-4 h-4" />}>
              Save Grade & Feedback
            </PillButton>
          </div>
        </div>

      </div>
    </div>
  );
};
