import React, { useState, useEffect } from 'react';
import { apiClient } from '../../services/apiClient';
import { useApp } from '../../context/AppContext';
import { BentoCard } from '../common/BentoCard';
import { PillButton } from '../common/PillButton';
import { UserAvatar, getInitialChar } from '../common/UserAvatar';
import { 
  User as UserIcon, 
  School, 
  MapPin, 
  Mail, 
  Lock, 
  KeyRound, 
  ShieldCheck, 
  Sparkles, 
  Flame, 
  Award, 
  BookOpen, 
  CheckCircle2, 
  Camera, 
  ArrowLeft,
  GraduationCap,
  Save,
  Check
} from 'lucide-react';

interface ProfileViewProps {
  onBack?: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ onBack }) => {
  const { 
    currentUser, 
    updateUserProfile, 
    activeMode, 
    studentXp, 
    studentStreak, 
    classrooms, 
    roadmaps, 
    courses,
    completedLessonIds 
  } = useApp();

  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [school, setSchool] = useState(currentUser.school || '');
  const [division, setDivision] = useState(currentUser.division || 'Chittagong');
  const [avatar, setAvatar] = useState(currentUser.avatar);

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || '');
      setEmail(currentUser.email || '');
      setSchool(currentUser.school || '');
      setDivision(currentUser.division || 'Chittagong');
      setAvatar(currentUser.avatar || '');
    }
  }, [currentUser.id, currentUser.name, currentUser.school, currentUser.division, currentUser.avatar]);
  
  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  // Save feedback state
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name,
      email,
      school,
      division,
      avatar
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess(false);

    if (!currentPassword) {
      setPasswordError('Please enter your current password.');
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    setIsUpdatingPassword(true);
    try {
      const res = await apiClient.changePassword({
        userId: currentUser.id,
        currentPassword,
        newPassword
      });

      if (res.success) {
        setPasswordSuccess(true);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setTimeout(() => setPasswordSuccess(false), 4000);
      } else {
        setPasswordError(res.message || 'Failed to update password. Please check your current password.');
      }
    } catch (err: any) {
      setPasswordError(err.message || 'Error communicating with server.');
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const divisionsList = [
    'Dhaka',
    'Chittagong',
    'Rajshahi',
    'Khulna',
    'Barisal',
    'Sylhet',
    'Rangpur',
    'Mymensingh'
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fadeIn pb-16">
      
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          {onBack && (
            <button
              onClick={onBack}
              className="text-xs font-bold text-graphite hover:text-ink flex items-center gap-1 mb-1 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Workspace</span>
            </button>
          )}
          <h1 className="text-3xl sm:text-4xl font-extrabold text-ink tracking-tight flex items-center gap-2.5">
            <span>Account Profile & Settings</span>
            <span className="text-xs font-mono font-extrabold uppercase px-3 py-1 bg-highlighter border-2 border-ink rounded-full shadow-solid-xs">
              {(currentUser?.role || 'student').toUpperCase()}
            </span>
          </h1>
          <p className="text-sm text-graphite">
            Manage your personal profile details, school affiliation, and account security.
          </p>
        </div>

        {saveSuccess && (
          <div className="px-4 py-2 bg-green-100 border-2 border-green-700 text-green-900 rounded-xl font-bold text-xs flex items-center gap-2 animate-bounce shadow-solid-xs">
            <CheckCircle2 className="w-4 h-4 text-green-700" />
            <span>Profile changes saved successfully!</span>
          </div>
        )}
      </div>

      {/* Main Profile Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: Identity & Quick Stats Card */}
        <div className="space-y-6">
          
          <BentoCard variant="white" className="space-y-5 p-6 border-2 border-ink text-center">
            
            {/* Avatar Preview with Badge */}
            <div className="relative inline-block mx-auto">
              <UserAvatar
                name={name}
                avatar={avatar}
                size="3xl"
                className="w-28 h-28 text-4xl shadow-solid-sm mx-auto"
              />
              <div className="absolute bottom-0 right-0 p-1.5 bg-highlighter border-2 border-ink rounded-full text-ink shadow-solid-xs">
                <Sparkles className="w-4 h-4 text-stamp" />
              </div>
            </div>

            <div>
              <h2 className="text-xl font-extrabold text-ink">{name}</h2>
              <p className="text-xs text-graphite font-mono mt-0.5">{email}</p>
              <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 bg-paper-muted border border-ink/20 rounded-full text-xs font-bold text-ink">
                <School className="w-3.5 h-3.5 text-stamp" />
                <span className="truncate max-w-[180px]">{school || 'Bangladesh ICT Academy'}</span>
              </div>
            </div>

            {/* Google Style Initial Avatar Info */}
            <div className="p-3 bg-paper-muted rounded-xl border border-ink/15 text-xs text-graphite text-left space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-ink text-[11px] uppercase font-mono">
                <span>Google Account Initial Avatar</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                Your profile picture is dynamically styled with your initial character <strong className="text-ink font-bold font-mono">({getInitialChar(name)})</strong> matching Google Workspace standards.
              </p>
            </div>

            {/* Gamification Stats (Student) */}
            {currentUser.role === 'student' && (
              <div className="pt-3 border-t border-ink/15 grid grid-cols-2 gap-2 text-left">
                <div className="p-2.5 bg-paper-muted rounded-xl border border-ink/20">
                  <span className="text-[10px] font-mono text-graphite uppercase block">Streak</span>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Flame className="w-4 h-4 text-stamp animate-bounce" />
                    <strong className="text-base font-extrabold text-ink font-mono">{studentStreak} Days</strong>
                  </div>
                </div>

                <div className="p-2.5 bg-highlighter/30 rounded-xl border border-ink/20">
                  <span className="text-[10px] font-mono text-graphite uppercase block">Total XP</span>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Award className="w-4 h-4 text-ink" />
                    <strong className="text-base font-extrabold text-ink font-mono">{(studentXp ?? 0).toLocaleString()}</strong>
                  </div>
                </div>
              </div>
            )}

            {/* Teacher Stats */}
            {currentUser.role === 'teacher' && (
              <div className="pt-3 border-t border-ink/15 grid grid-cols-2 gap-2 text-left">
                <div className="p-2.5 bg-paper-muted rounded-xl border border-ink/20">
                  <span className="text-[10px] font-mono text-graphite uppercase block">Classrooms</span>
                  <strong className="text-base font-extrabold text-ink font-mono">{classrooms.length} Active</strong>
                </div>

                <div className="p-2.5 bg-highlighter/30 rounded-xl border border-ink/20">
                  <span className="text-[10px] font-mono text-graphite uppercase block">Courses</span>
                  <strong className="text-base font-extrabold text-ink font-mono">{courses.length} Published</strong>
                </div>
              </div>
            )}

          </BentoCard>

          {/* Verification Badge Bento */}
          <BentoCard variant="kraft" className="p-5 border-2 border-ink space-y-3">
            <div className="flex items-center space-x-2 text-ink font-extrabold text-sm">
              <ShieldCheck className="w-5 h-5 text-green-700" />
              <span>National ID & Verification</span>
            </div>
            <p className="text-xs text-graphite leading-relaxed">
              Account is registered under the <strong>Bangladesh Secondary & Higher Secondary ICT Initiative</strong>.
            </p>
            <div className="text-[11px] font-mono font-bold text-ink bg-white/80 p-2.5 rounded-lg border border-ink/20">
              UID: {currentUser.id}
            </div>
          </BentoCard>

        </div>

        {/* RIGHT COLUMN: Edit Information & Security Forms */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* 1. General Profile Info Form */}
          <BentoCard variant="white" className="p-6 sm:p-8 border-2 border-ink space-y-6">
            <div className="flex items-center justify-between border-b-2 border-ink/15 pb-4">
              <div>
                <h3 className="text-lg font-extrabold text-ink">Personal & Institution Details</h3>
                <p className="text-xs text-graphite mt-0.5">Keep your official school registration updated for report cards.</p>
              </div>
              <UserIcon className="w-5 h-5 text-stamp" />
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-extrabold uppercase text-ink block">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border-2 border-ink text-sm font-bold bg-white focus:outline-none focus:ring-2 focus:ring-highlighter"
                    placeholder="e.g. Redwan Ahmed"
                  />
                </div>

                {/* Email Address */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-extrabold uppercase text-ink block">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border-2 border-ink text-sm font-bold bg-white focus:outline-none focus:ring-2 focus:ring-highlighter"
                    placeholder="e.g. redwan@cuet.ac.bd"
                  />
                </div>

              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* School / Institution */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-extrabold uppercase text-ink block">
                    School / College / Institution *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={school}
                      onChange={e => setSchool(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-ink text-sm font-bold bg-white focus:outline-none focus:ring-2 focus:ring-highlighter"
                      placeholder="e.g. Chittagong Collegiate School"
                    />
                    <School className="w-4 h-4 text-graphite absolute left-3.5 top-3.5" />
                  </div>
                </div>

                {/* Division / District */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-extrabold uppercase text-ink block">
                    Administrative Division *
                  </label>
                  <div className="relative">
                    <select
                      value={division}
                      onChange={e => setDivision(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-ink text-sm font-bold bg-white focus:outline-none focus:ring-2 focus:ring-highlighter appearance-none"
                    >
                      {divisionsList.map(div => (
                        <option key={div} value={div}>{div} Division</option>
                      ))}
                    </select>
                    <MapPin className="w-4 h-4 text-graphite absolute left-3.5 top-3.5 pointer-events-none" />
                  </div>
                </div>

              </div>

              {/* Custom Avatar URL */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-extrabold uppercase text-ink block">
                  Custom Avatar Image Link (Optional)
                </label>
                <div className="relative">
                  <input
                    type="url"
                    value={avatar}
                    onChange={e => setAvatar(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-ink text-xs font-mono bg-white focus:outline-none focus:ring-2 focus:ring-highlighter"
                    placeholder="https://..."
                  />
                  <Camera className="w-4 h-4 text-graphite absolute left-3.5 top-3.5" />
                </div>
              </div>

              {/* Save Button */}
              <div className="pt-2 flex justify-end">
                <PillButton
                  type="submit"
                  variant="primary"
                  size="md"
                  icon={<Save className="w-4 h-4" />}
                  className="btn-bounce shadow-solid-sm"
                >
                  Save Profile Changes
                </PillButton>
              </div>

            </form>
          </BentoCard>

          {/* 2. Security & Password Update Form */}
          <BentoCard variant="white" className="p-6 sm:p-8 border-2 border-ink space-y-6">
            <div className="flex items-center justify-between border-b-2 border-ink/15 pb-4">
              <div>
                <h3 className="text-lg font-extrabold text-ink">Change Password</h3>
                <p className="text-xs text-graphite mt-0.5">Ensure your account uses a secure password with at least 6 characters.</p>
              </div>
              <Lock className="w-5 h-5 text-stamp" />
            </div>

            {passwordSuccess && (
              <div className="p-3 bg-green-50 border-2 border-green-600 text-green-900 rounded-xl font-bold text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-700 flex-shrink-0" />
                <span>Your password has been changed successfully!</span>
              </div>
            )}

            {passwordError && (
              <div className="p-3 bg-red-50 border-2 border-red-600 text-red-900 rounded-xl font-bold text-xs">
                ⚠️ {passwordError}
              </div>
            )}

            <form onSubmit={handleUpdatePassword} className="space-y-4">
              
              {/* Current Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-extrabold uppercase text-ink block">
                  Current Password *
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={currentPassword}
                    onChange={e => setCurrentPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-ink text-sm font-bold bg-white focus:outline-none focus:ring-2 focus:ring-highlighter"
                    placeholder="Enter current password"
                  />
                  <KeyRound className="w-4 h-4 text-graphite absolute left-3.5 top-3.5" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* New Password */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-extrabold uppercase text-ink block">
                    New Password *
                  </label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border-2 border-ink text-sm font-bold bg-white focus:outline-none focus:ring-2 focus:ring-highlighter"
                    placeholder="Min. 6 characters"
                  />
                </div>

                {/* Confirm New Password */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-extrabold uppercase text-ink block">
                    Confirm New Password *
                  </label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border-2 border-ink text-sm font-bold bg-white focus:outline-none focus:ring-2 focus:ring-highlighter"
                    placeholder="Re-enter new password"
                  />
                </div>

              </div>

              {/* Submit Password Button */}
              <div className="pt-2 flex justify-end">
                <PillButton
                  type="submit"
                  variant="secondary"
                  size="md"
                  icon={<Lock className="w-4 h-4" />}
                  className="btn-bounce shadow-solid-xs"
                >
                  Update Password
                </PillButton>
              </div>

            </form>
          </BentoCard>

        </div>

      </div>

    </div>
  );
};
