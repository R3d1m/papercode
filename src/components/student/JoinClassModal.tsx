import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PillButton } from '../common/PillButton';
import { X, KeyRound, ArrowRight, CheckCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface JoinClassModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const JoinClassModal: React.FC<JoinClassModalProps> = ({ isOpen, onClose }) => {
  const { joinClassroom } = useApp();
  const [joinCode, setJoinCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ success?: boolean; message?: string } | null>(null);

  if (!isOpen) return null;

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCode.trim()) return;

    setIsLoading(true);
    try {
      const res = await joinClassroom(joinCode.trim());
      setStatusMessage(res);
      if (res.success) {
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
        setTimeout(() => {
          onClose();
          setJoinCode('');
          setStatusMessage(null);
        }, 1200);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-paper-card border-2 border-ink rounded-[28px] p-6 sm:p-8 shadow-solid-xl space-y-5">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full border-2 border-ink/30 bg-paper-muted hover:bg-paper-light transition-colors text-ink shadow-solid-xs"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1 text-left">
          <div className="inline-flex items-center space-x-1.5 px-3 py-0.5 rounded-full bg-highlighter border border-ink text-ink font-mono text-[11px] font-extrabold uppercase shadow-solid-xs">
            <KeyRound className="w-3.5 h-3.5" />
            <span>Join Teacher Classroom</span>
          </div>
          <h2 className="text-2xl font-extrabold text-ink tracking-tight">
            Enter Class Code
          </h2>
          <p className="text-xs text-graphite font-bold">
            Enter the 6-character code given by your teacher to access assignments and track homework.
          </p>
        </div>

        <form onSubmit={handleJoin} className="space-y-4">
          <div className="p-4 bg-paper-light border-2 border-ink/20 rounded-2xl space-y-2">
            <label className="block text-xs font-mono font-extrabold text-graphite uppercase">
              6-Character Join Code:
            </label>
            <input
              type="text"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
              placeholder="e.g. CUET-902"
              maxLength={10}
              className="w-full text-center font-mono text-2xl font-extrabold uppercase tracking-widest bg-white border-2 border-ink rounded-xl py-3 text-ink focus:outline-none focus:ring-2 focus:ring-highlighter shadow-inner"
              autoFocus
            />
            <div className="text-[11px] text-graphite font-mono pt-1 font-bold">
              <span>Demo codes: <strong className="text-ink cursor-pointer underline" onClick={() => setJoinCode('CUET-902')}>CUET-902</strong> or <strong className="text-ink cursor-pointer underline" onClick={() => setJoinCode('RAOZ-404')}>RAOZ-404</strong></span>
            </div>
          </div>

          {statusMessage && (
            <div className={'p-3 rounded-xl border-2 text-xs font-extrabold flex items-center space-x-2 ' + (statusMessage.success ? 'bg-green-100 text-green-900 border-green-700' : 'bg-red-100 text-red-900 border-red-700')}>
              {statusMessage.success ? <CheckCircle className="w-4 h-4 text-green-700 stroke-[3]" /> : <X className="w-4 h-4 text-red-700 stroke-[3]" />}
              <span>{statusMessage.message}</span>
            </div>
          )}

          <PillButton
            variant="highlighter"
            size="lg"
            className="w-full btn-bounce"
            icon={<ArrowRight className="w-4 h-4" />}
          >
            Verify & Join Classroom ➔
          </PillButton>
        </form>

      </div>
    </div>
  );
};
