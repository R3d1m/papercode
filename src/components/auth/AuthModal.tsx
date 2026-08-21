import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PillButton } from '../common/PillButton';
import { 
  X, 
  GraduationCap, 
  Users, 
  ShieldCheck, 
  CheckCircle, 
  ArrowRight, 
  Lock, 
  Mail, 
  User as UserIcon,
  Sparkles,
  School,
  Globe
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'login' | 'signup';
}

const GoogleIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
    />
    <path
      fill="#34A853"
      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
    />
    <path
      fill="#FBBC05"
      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
    />
    <path
      fill="#EA4335"
      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
    />
  </svg>
);

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'login'
}) => {
  const { login, signup } = useApp();
  
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>(
    initialTab === 'signup' ? 'signup' : 'signin'
  );
  
  // Public role selection: strictly Student or Teacher
  const [selectedRole, setSelectedRole] = useState<'student' | 'teacher'>('student');
  
  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [school, setSchool] = useState('');
  const [division, setDivision] = useState('Chittagong');
  
  // Admin & Moderator Portal Expansion
  const [showAdminPortal, setShowAdminPortal] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');

  const [statusMessage, setStatusMessage] = useState<{ success?: boolean; message?: string } | null>(null);

  if (!isOpen) return null;

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setStatusMessage({ success: false, message: 'Verifying credentials...' });
    const res = await login(email, password, selectedRole);
    setStatusMessage(res);
    if (res.success) {
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      setTimeout(() => {
        onClose();
        setStatusMessage(null);
      }, 1000);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    setStatusMessage({ success: false, message: 'Creating account in database...' });
    const res = await signup({
      name,
      email,
      password,
      role: selectedRole,
      school: school || (selectedRole === 'teacher' ? 'Independent Educator / School' : 'Independent Learner'),
      division
    });

    setStatusMessage(res);
    if (res.success) {
      confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
      setTimeout(() => {
        onClose();
        setStatusMessage(null);
      }, 1000);
    }
  };

  const handleGoogleAuth = async () => {
    const mockEmail = selectedRole === 'teacher' ? 'teacher.demo@gmail.com' : 'student.learner@gmail.com';
    const mockName = selectedRole === 'teacher' ? 'Google Teacher User' : 'Google Student User';
    
    if (authMode === 'signin') {
      const res = await login(mockEmail, 'default_pass_123', selectedRole);
      setStatusMessage(res);
      if (res.success) {
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
        setTimeout(() => {
          onClose();
          setStatusMessage(null);
        }, 1000);
      }
    } else {
      const res = await signup({
        name: mockName,
        email: mockEmail,
        password: 'default_pass_123',
        role: selectedRole,
        school: 'Google Auth Learner',
        division: 'Dhaka'
      });
      setStatusMessage(res);
      if (res.success) {
        confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
        setTimeout(() => {
          onClose();
          setStatusMessage(null);
        }, 1000);
      }
    }
  };

  const handleAdminSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminEmail.trim()) return;

    setStatusMessage({ success: false, message: 'Authenticating with Admin HQ...' });
    const res = await login(adminEmail, adminPassword, 'admin');
    setStatusMessage(res);
    if (res.success) {
      confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
      setTimeout(() => {
        onClose();
        setStatusMessage(null);
      }, 1000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/70 backdrop-blur-sm animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-lg bg-paper-card border-2 border-ink rounded-[28px] p-6 sm:p-8 shadow-solid-xl max-h-[92vh] overflow-y-auto space-y-5">
        
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
            <span>PaperCode Bangladesh</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
            {authMode === 'signin' ? 'Welcome Back!' : 'Join PaperCode (Open to Everyone)'}
          </h2>
          <p className="text-xs text-graphite font-bold">
            {authMode === 'signin' 
              ? 'Sign in to access your coding quests, roadmaps, and classrooms.' 
              : 'Free registration for all students, independent learners, and teachers.'}
          </p>
        </div>

        {/* Top Auth Mode Switcher */}
        <div className="grid grid-cols-2 gap-1.5 p-1.5 bg-paper-muted border-2 border-ink/30 rounded-2xl text-xs font-extrabold">
          <button
            type="button"
            onClick={() => { setAuthMode('signin'); setStatusMessage(null); setShowAdminPortal(false); }}
            className={'py-2.5 px-3 rounded-xl transition-all text-center font-extrabold ' + (authMode === 'signin' && !showAdminPortal ? 'bg-highlighter text-ink border-2 border-ink shadow-solid-xs' : 'text-graphite hover:text-ink')}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setAuthMode('signup'); setStatusMessage(null); setShowAdminPortal(false); }}
            className={'py-2.5 px-3 rounded-xl transition-all text-center font-extrabold ' + (authMode === 'signup' && !showAdminPortal ? 'bg-highlighter text-ink border-2 border-ink shadow-solid-xs' : 'text-graphite hover:text-ink')}
          >
            Sign Up (Free)
          </button>
        </div>

        {/* PUBLIC ROLE SELECTOR: STRICTLY FOR SIGN UP */}
        {!showAdminPortal && authMode === 'signup' && (
          <div className="space-y-1.5">
            <span className="text-[11px] font-mono font-extrabold text-graphite uppercase tracking-wider block">
              I am registering as:
            </span>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSelectedRole('student')}
                className={'p-3 rounded-2xl border-2 transition-all flex items-center space-x-3 text-left ' + (selectedRole === 'student' ? 'bg-white border-ink shadow-solid-sm ring-2 ring-highlighter' : 'bg-paper-light border-ink/20 hover:border-ink')}
              >
                <div className="w-9 h-9 rounded-xl bg-highlighter border-2 border-ink flex items-center justify-center font-extrabold text-ink">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <strong className="text-xs text-ink block font-extrabold">Student / Learner</strong>
                  <span className="text-[10px] text-graphite font-bold">Paper Quests & OCR</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedRole('teacher')}
                className={'p-3 rounded-2xl border-2 transition-all flex items-center space-x-3 text-left ' + (selectedRole === 'teacher' ? 'bg-white border-ink shadow-solid-sm ring-2 ring-stamp' : 'bg-paper-light border-ink/20 hover:border-ink')}
              >
                <div className="w-9 h-9 rounded-xl bg-stamp text-white border-2 border-ink flex items-center justify-center font-extrabold">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <strong className="text-xs text-ink block font-extrabold">Teacher / Mentor</strong>
                  <span className="text-[10px] text-graphite font-bold">Class & Grading</span>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* SIGN IN WITH GOOGLE BUTTON */}
        {!showAdminPortal && (
          <div className="space-y-3 pt-1">
            <button
              type="button"
              onClick={handleGoogleAuth}
              className="w-full py-2.5 px-4 bg-white hover:bg-paper-light border-2 border-ink rounded-xl font-extrabold text-xs text-ink flex items-center justify-center gap-2.5 shadow-solid-xs btn-bounce transition-all"
            >
              <GoogleIcon />
              <span>Continue with Google</span>
            </button>

            <div className="flex items-center space-x-3 text-[11px] font-mono text-graphite font-bold">
              <div className="flex-1 border-t border-ink/20"></div>
              <span>OR WITH EMAIL</span>
              <div className="flex-1 border-t border-ink/20"></div>
            </div>
          </div>
        )}

        {/* FORM 1: SIGN IN FORM (AUTOMATIC ROLE DETECTION) */}
        {authMode === 'signin' && !showAdminPortal && (
          <form onSubmit={handleSignIn} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="font-extrabold text-ink block">Email Address:</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-graphite absolute left-3 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-9 pr-3 py-2.5 bg-white border-2 border-ink/30 rounded-xl focus:outline-none focus:border-ink font-bold text-ink"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-extrabold text-ink block">Password:</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-graphite absolute left-3 top-3" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 bg-white border-2 border-ink/30 rounded-xl focus:outline-none focus:border-ink font-bold text-ink"
                  required
                />
              </div>
            </div>

            <PillButton
              type="submit"
              variant="highlighter"
              size="lg"
              className="w-full btn-bounce shadow-solid-xs"
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Sign In to PaperCode ➔
            </PillButton>
          </form>
        )}

        {/* FORM 2: SIGN UP FORM (OPEN TO EVERYONE - NO RESTRICTIONS) */}
        {authMode === 'signup' && !showAdminPortal && (
          <form onSubmit={handleSignUp} className="space-y-3.5 text-xs">
            <div className="space-y-1">
              <label className="font-extrabold text-ink block">Full Name *</label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-graphite absolute left-3 top-3" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Redwan Ahmed"
                  className="w-full pl-9 pr-3 py-2.5 bg-white border-2 border-ink/30 rounded-xl focus:outline-none focus:border-ink font-bold text-ink"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-extrabold text-ink block">Email Address (Any email allowed) *</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-graphite absolute left-3 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@gmail.com, you@school.edu.bd, etc."
                  className="w-full pl-9 pr-3 py-2.5 bg-white border-2 border-ink/30 rounded-xl focus:outline-none focus:border-ink font-bold text-ink"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div className="space-y-1">
                <label className="font-extrabold text-ink block">
                  School / Org (Optional):
                </label>
                <input
                  type="text"
                  value={school}
                  onChange={(e) => setSchool(e.target.value)}
                  placeholder="e.g. Self Learner / School"
                  className="w-full p-2.5 bg-white border-2 border-ink/30 rounded-xl font-bold text-ink text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="font-extrabold text-ink block">Division / Region:</label>
                <select
                  value={division}
                  onChange={(e) => setDivision(e.target.value)}
                  className="w-full p-2.5 bg-white border-2 border-ink/30 rounded-xl font-bold text-ink text-xs"
                >
                  <option>Chittagong</option>
                  <option>Dhaka</option>
                  <option>Sylhet</option>
                  <option>Rajshahi</option>
                  <option>Rangpur</option>
                  <option>Khulna</option>
                  <option>Barisal</option>
                  <option>Mymensingh</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-extrabold text-ink block">Create Password *</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-graphite absolute left-3 top-3" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 bg-white border-2 border-ink/30 rounded-xl focus:outline-none focus:border-ink font-bold text-ink"
                  required
                />
              </div>
            </div>

            <PillButton
              type="submit"
              variant={selectedRole === 'teacher' ? 'stamp' : 'highlighter'}
              size="lg"
              className="w-full btn-bounce"
              icon={<Sparkles className="w-4 h-4" />}
            >
              Create Free {selectedRole === 'teacher' ? 'Teacher' : 'Student'} Account ➔
            </PillButton>
          </form>
        )}

        {/* FORM 3: ADMIN & MODERATOR PORTAL LOGIN */}
        {showAdminPortal && (
          <form onSubmit={handleAdminSignIn} className="space-y-4 text-xs">
            <div className="p-3.5 bg-paper-muted border-2 border-ink/30 rounded-2xl flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-stamp text-white flex items-center justify-center flex-shrink-0 font-extrabold text-lg shadow-solid-xs">
                🛡️
              </div>
              <div>
                <strong className="text-ink block text-xs sm:text-sm font-extrabold">PaperCode Admin & Governance HQ</strong>
                <span className="text-[10px] text-graphite font-bold">Sign in with system administrator credentials</span>
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-extrabold text-ink block">Admin Email Address *</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-graphite absolute left-3 top-3" />
                <input
                  type="email"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  placeholder="admin@papercode.edu.bd"
                  className="w-full pl-9 pr-3 py-2.5 bg-white border-2 border-ink/30 rounded-xl font-bold text-ink"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-extrabold text-ink block">Admin Password *</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-graphite absolute left-3 top-3" />
                <input
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="w-full pl-9 pr-3 py-2.5 bg-white border-2 border-ink/30 rounded-xl font-bold text-ink"
                  required
                />
              </div>
            </div>

            {/* Quick Demo Helper for Admin */}
            <div className="p-3 bg-yellow-50 border border-ink/20 rounded-xl text-[11px] text-graphite space-y-1 font-mono">
              <div className="flex justify-between items-center">
                <span className="font-bold text-ink">🔑 Default Admin Credentials:</span>
                <button
                  type="button"
                  onClick={() => {
                    setAdminEmail('admin@papercode.edu.bd');
                    setAdminPassword('Admin@PaperCode2026');
                  }}
                  className="px-2 py-0.5 bg-highlighter border border-ink rounded text-[10px] font-extrabold text-ink shadow-solid-xs hover:shadow-solid-sm"
                >
                  Autofill Credentials
                </button>
              </div>
              <p className="text-[10px] text-graphite">
                <strong>Email:</strong> admin@papercode.edu.bd | <strong>Password:</strong> Admin@PaperCode2026
              </p>
            </div>

            <div className="flex gap-2 pt-1">
              <PillButton
                type="button"
                variant="secondary"
                size="md"
                onClick={() => setShowAdminPortal(false)}
              >
                Back to Public
              </PillButton>
              <PillButton
                type="submit"
                variant="highlighter"
                size="md"
                className="flex-1 btn-bounce shadow-solid-xs"
                icon={<ArrowRight className="w-4 h-4" />}
              >
                Sign In to Admin HQ ➔
              </PillButton>
            </div>
          </form>
        )}

        {/* Status Alert Banner */}
        {statusMessage && (
          <div className={'p-3 rounded-xl border-2 text-xs font-extrabold flex items-center space-x-2 ' + (statusMessage.success ? 'bg-green-100 text-green-900 border-green-700' : 'bg-red-100 text-red-900 border-red-700')}>
            {statusMessage.success ? <CheckCircle className="w-4 h-4 text-green-700 stroke-[3]" /> : <X className="w-4 h-4 text-red-700 stroke-[3]" />}
            <span>{statusMessage.message}</span>
          </div>
        )}

        {/* Discreet Admin & Moderator Access Link */}
        {!showAdminPortal && (
          <div className="pt-3 border-t border-ink/15 text-center">
            <button
              type="button"
              onClick={() => setShowAdminPortal(true)}
              className="text-[11px] font-mono text-graphite hover:text-ink font-bold hover:underline inline-flex items-center gap-1"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-stamp" />
              <span>Admin & Moderator Portal</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
