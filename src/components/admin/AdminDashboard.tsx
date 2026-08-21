import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BentoCard } from '../common/BentoCard';
import { PillButton } from '../common/PillButton';
import { BarcodeStub } from '../common/BarcodeStub';
import { SEED_INSTITUTIONAL_ACCOUNTS } from '../../data/seedData';
import { Roadmap, Course, User } from '../../types';
import { 
  ShieldCheck, 
  Cpu, 
  Database, 
  Users, 
  Building, 
  Plus, 
  CheckCircle2, 
  FileCode, 
  Globe, 
  Compass, 
  BookOpen, 
  Trash2, 
  UserPlus, 
  UserMinus,
  Sparkles,
  Edit3,
  Check,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface AdminDashboardProps {
  initialTab?: 'vitals' | 'cms' | 'moderators' | 'institutions';
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ initialTab = 'vitals' }) => {
  const { 
    currentUser, 
    courses, 
    roadmaps, 
    publishRoadmap, 
    updateRoadmap, 
    addRoadmap, 
    deleteRoadmap,
    addCourseToRoadmap,
    removeCourseFromRoadmap,
    moderators,
    addModerator,
    removeModerator,
    users,
    promoteTeacherToModerator,
    demoteModerator
  } = useApp();

  const [activeTab, setActiveTab] = useState<'vitals' | 'cms' | 'moderators' | 'institutions'>(initialTab);
  
  // Add Moderator State
  const [isAddingModerator, setIsAddingModerator] = useState(false);
  const [newModName, setNewModName] = useState('');
  const [newModEmail, setNewModEmail] = useState('');
  const [newModSchool, setNewModSchool] = useState('National Curriculum Editorial Board');
  
  // Add Roadmap State
  const [isCreatingRoadmap, setIsCreatingRoadmap] = useState(false);
  const [newRoadmapTitle, setNewRoadmapTitle] = useState('');
  const [newRoadmapDescription, setNewRoadmapDescription] = useState('');
  const [newRoadmapBadge, setNewRoadmapBadge] = useState('🏆 National ICT Achievement');
  const [newRoadmapAudience, setNewRoadmapAudience] = useState('Secondary School Students');
  const [newRoadmapCourseId, setNewRoadmapCourseId] = useState(courses[0]?.id || 'crs-py-basics');

  const handleSaveModerator = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newModName.trim() || !newModEmail.trim()) return;

    addModerator({
      name: newModName,
      email: newModEmail,
      school: newModSchool,
      permissions: ['edit_roadmaps', 'create_courses', 'manage_lessons']
    });

    setNewModName('');
    setNewModEmail('');
    setIsAddingModerator(false);
    confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
  };

  const handleCreateRoadmap = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoadmapTitle.trim()) return;

    const matchedCourse = courses.find(c => c.id === newRoadmapCourseId) || courses[0];

    addRoadmap({
      title: newRoadmapTitle,
      description: newRoadmapDescription || 'Master coding curriculum on ruled notebook paper.',
      badge: newRoadmapBadge,
      targetAudience: newRoadmapAudience,
      courses: matchedCourse ? [matchedCourse] : [],
      isPublic: true,
      totalXp: 4000,
      enrolledCount: 100
    });

    setNewRoadmapTitle('');
    setNewRoadmapDescription('');
    setIsCreatingRoadmap(false);
    confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
  };

  return (
    <div className="space-y-8 py-4 max-w-7xl mx-auto">
      
      {/* Admin Top Header */}
      <div className="p-6 sm:p-8 bg-paper-card border-2 border-ink rounded-bento shadow-solid-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-16 h-16 rounded-full border-2 border-ink object-cover shadow-solid-sm"
          />
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-ink">{currentUser.name}</h1>
              <span className="px-3 py-0.5 bg-highlighter text-ink border border-ink font-mono text-xs font-extrabold rounded-full shadow-solid-xs">
                {currentUser.role === 'admin' ? 'Admin HQ' : 'Curriculum Moderator'}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-graphite font-bold mt-1">
              National Infrastructure & Content Governance • CUET EdTech Hub
            </p>
          </div>
        </div>

        <div className="p-3.5 bg-highlighter border-2 border-ink rounded-2xl text-xs font-mono shadow-solid-xs">
          <span className="text-ink block text-[10px] uppercase font-extrabold">Platform Status</span>
          <strong className="text-ink text-sm font-extrabold">All 64 Districts Operational</strong>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-paper-muted border-2 border-ink/30 rounded-2xl w-fit text-xs font-extrabold">
        <button
          onClick={() => setActiveTab('vitals')}
          className={'px-4 py-2 rounded-xl transition-all ' + (activeTab === 'vitals' ? 'bg-highlighter text-ink border-2 border-ink shadow-solid-xs font-extrabold' : 'text-graphite hover:text-ink')}
        >
          ⚡ Platform Vitals & OCR Health
        </button>
        <button
          onClick={() => setActiveTab('cms')}
          className={'px-4 py-2 rounded-xl transition-all ' + (activeTab === 'cms' ? 'bg-highlighter text-ink border-2 border-ink shadow-solid-xs font-extrabold' : 'text-graphite hover:text-ink')}
        >
          📚 Master Curriculum CMS & Roadmaps
        </button>
        <button
          onClick={() => setActiveTab('moderators')}
          className={'px-4 py-2 rounded-xl transition-all ' + (activeTab === 'moderators' ? 'bg-highlighter text-ink border-2 border-ink shadow-solid-xs font-extrabold' : 'text-graphite hover:text-ink')}
        >
          🛡️ Moderator Team ({moderators.length})
        </button>
        <button
          onClick={() => setActiveTab('institutions')}
          className={'px-4 py-2 rounded-xl transition-all ' + (activeTab === 'institutions' ? 'bg-highlighter text-ink border-2 border-ink shadow-solid-xs font-extrabold' : 'text-graphite hover:text-ink')}
        >
          🏛️ Institutional Partnerships
        </button>
      </div>

      {/* TAB 1: PLATFORM VITALS */}
      {activeTab === 'vitals' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <BentoCard variant="white" className="space-y-1">
              <span className="text-[11px] font-mono font-bold text-graphite uppercase">Total Active Students</span>
              <div className="text-3xl font-extrabold font-mono text-ink">14,280</div>
              <span className="text-[10px] text-green-700 font-bold">+18% this month</span>
            </BentoCard>

            <BentoCard variant="highlighter" className="space-y-1 border-2 border-ink">
              <span className="text-[11px] font-mono font-extrabold text-ink uppercase">Rural Students</span>
              <div className="text-3xl font-extrabold font-mono text-ink">71.4%</div>
              <span className="text-[10px] text-ink font-bold">Haor & Upazila Schools</span>
            </BentoCard>

            <BentoCard variant="white" className="space-y-1">
              <span className="text-[11px] font-mono font-bold text-graphite uppercase">Judge0 Runs (30d)</span>
              <div className="text-3xl font-extrabold font-mono text-ink">48,920</div>
              <span className="text-[10px] text-graphite font-mono">0.038s Avg Latency</span>
            </BentoCard>

            <BentoCard variant="kraft" className="space-y-1">
              <span className="text-[11px] font-mono font-bold text-graphite uppercase">OCR Accuracy</span>
              <div className="text-3xl font-extrabold font-mono text-stamp">96.8%</div>
              <span className="text-[10px] text-graphite font-bold">AST Indentation Filter</span>
            </BentoCard>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <BentoCard variant="white" className="space-y-4">
              <h3 className="font-extrabold text-lg text-ink">Division-Wise Student Enrollment</h3>
              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between font-bold mb-1 text-ink">
                    <span>Chittagong Division</span>
                    <span className="font-mono">5,420 (38%)</span>
                  </div>
                  <div className="w-full h-2.5 bg-paper-muted rounded-full overflow-hidden border border-ink/20">
                    <div className="h-full bg-stamp w-[38%]"></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-bold mb-1 text-ink">
                    <span>Sylhet Division (Haor Pilot)</span>
                    <span className="font-mono">3,890 (27%)</span>
                  </div>
                  <div className="w-full h-2.5 bg-paper-muted rounded-full overflow-hidden border border-ink/20">
                    <div className="h-full bg-highlighter w-[27%]"></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-bold mb-1 text-ink">
                    <span>Dhaka Division</span>
                    <span className="font-mono">2,650 (19%)</span>
                  </div>
                  <div className="w-full h-2.5 bg-paper-muted rounded-full overflow-hidden border border-ink/20">
                    <div className="h-full bg-ink w-[19%]"></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-bold mb-1 text-ink">
                    <span>Rajshahi & Rangpur</span>
                    <span className="font-mono">2,320 (16%)</span>
                  </div>
                  <div className="w-full h-2.5 bg-paper-muted rounded-full overflow-hidden border border-ink/20">
                    <div className="h-full bg-green-600 w-[16%]"></div>
                  </div>
                </div>
              </div>
              <BarcodeStub label="DISTRIBUTION" time="64-DISTRICTS" />
            </BentoCard>

            <BentoCard variant="kraft" className="space-y-4">
              <h3 className="font-extrabold text-lg text-ink">Judge0 Infrastructure & Sandbox Health</h3>
              <ul className="text-xs text-graphite space-y-2 font-mono">
                <li className="p-2.5 bg-white rounded-xl border border-ink/20 flex justify-between items-center text-ink font-bold">
                  <span>Python 3.8.1+ Worker (ID 71)</span>
                  <span className="text-green-700">● Healthy (22ms)</span>
                </li>
                <li className="p-2.5 bg-white rounded-xl border border-ink/20 flex justify-between items-center text-ink font-bold">
                  <span>Node.js 12.14+ Worker (ID 63)</span>
                  <span className="text-green-700">● Healthy (18ms)</span>
                </li>
                <li className="p-2.5 bg-white rounded-xl border border-ink/20 flex justify-between items-center text-ink font-bold">
                  <span>GCC C++ 9.2.0 (ID 54)</span>
                  <span className="text-green-700">● Healthy (12ms)</span>
                </li>
                <li className="p-2.5 bg-white rounded-xl border border-ink/20 flex justify-between items-center text-ink font-bold">
                  <span>AST Binarization Pipeline</span>
                  <span className="text-green-700">● 99.98% Uptime</span>
                </li>
              </ul>
              <BarcodeStub label="INFRASTRUCTURE" time="JUDGE0-CE" />
            </BentoCard>
          </div>
        </div>
      )}

      {/* TAB 2: MASTER CURRICULUM CMS & ROADMAPS (EDITABLE BY ADMIN & MODERATORS) */}
      {activeTab === 'cms' && (
        <div className="space-y-8">
          
          {/* Section A: Public Roadmaps Management */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-2xl font-extrabold text-ink flex items-center gap-2">
                  <Compass className="w-6 h-6 text-stamp" />
                  <span>Public Learning Roadmaps ({roadmaps.length})</span>
                </h2>
                <p className="text-xs text-graphite font-bold">
                  Admin & Moderators can publish, edit, or add courses to public tracks.
                </p>
              </div>

              <PillButton
                variant="stamp"
                size="md"
                onClick={() => setIsCreatingRoadmap(true)}
                className="btn-bounce"
                icon={<Plus className="w-4 h-4" />}
              >
                + Create New Roadmap
              </PillButton>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {roadmaps.map((rdm) => (
                <BentoCard key={rdm.id} variant="white" className="space-y-4 p-6 border-2 border-ink shadow-solid-md flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-0.5 bg-paper-muted border border-ink/30 rounded-full font-mono text-xs font-extrabold text-ink">
                        {rdm.targetAudience}
                      </span>
                      <span className={'px-2.5 py-0.5 rounded-full font-mono text-[10px] font-extrabold ' + (rdm.isPublic ? 'bg-green-100 text-green-900 border border-green-700' : 'bg-amber-100 text-amber-900 border border-amber-700')}>
                        {rdm.isPublic ? '🌐 Live Public' : 'Draft'}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-xl font-extrabold text-ink">{rdm.title}</h3>
                      <p className="text-xs text-graphite font-medium mt-1 leading-relaxed">{rdm.description}</p>
                    </div>

                    <div className="pt-2 border-t border-ink/15 space-y-1.5">
                      <strong className="text-xs font-extrabold text-ink block">Included Courses ({rdm.courses.length}):</strong>
                      <div className="flex flex-wrap gap-1.5">
                        {rdm.courses.map(c => (
                          <span key={c.id} className="px-2 py-0.5 bg-paper-light border border-ink/20 rounded-lg text-xs font-bold text-ink">
                            {c.title}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-ink/15 flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-stamp">{rdm.enrolledCount.toLocaleString()} Students Enrolled</span>
                    
                    <div className="flex items-center space-x-2">
                      {!rdm.isPublic && (
                        <button
                          onClick={() => publishRoadmap(rdm.id)}
                          className="px-3 py-1 bg-highlighter text-ink border border-ink rounded-lg text-xs font-extrabold"
                        >
                          Publish Track
                        </button>
                      )}
                      <button
                        onClick={() => deleteRoadmap(rdm.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg"
                        title="Delete Roadmap"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </BentoCard>
              ))}
            </div>
          </div>

          {/* Section B: All Curriculum Courses */}
          <div className="space-y-4 pt-4 border-t-2 border-ink/20">
            <h2 className="text-2xl font-extrabold text-ink flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-stamp" />
              <span>Curriculum Courses ({courses.length})</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {courses.map((crs) => (
                <BentoCard key={crs.id} variant="white" className="space-y-4 p-6 border-2 border-ink shadow-solid-md">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold px-2.5 py-0.5 bg-paper-muted rounded-full text-ink border border-ink/20">
                      {crs.category} • {crs.level}
                    </span>
                    <span className="text-xs font-mono text-graphite font-bold">⏱ {crs.estimatedHours} Hours</span>
                  </div>

                  <div>
                    <h3 className="text-xl font-extrabold text-ink">{crs.title}</h3>
                    <p className="text-xs text-graphite mt-1 leading-relaxed font-medium">{crs.description}</p>
                  </div>

                  <div className="pt-2 border-t border-ink/15 text-xs text-graphite flex justify-between items-center">
                    <span>Author: <strong className="text-ink">{crs.authorName}</strong></span>
                    <span className="text-stamp font-bold">{crs.modules.length} Modules ({(crs.modules || []).flatMap(m => m.lessons || []).length} Lessons)</span>
                  </div>
                </BentoCard>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* TAB 3: MODERATOR TEAM MANAGEMENT (ADMIN FEATURE) */}
      {activeTab === 'moderators' && (
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b-2 border-ink/15 pb-4">
            <div>
              <h2 className="text-2xl font-extrabold text-ink flex items-center gap-2">
                <Users className="w-6 h-6 text-stamp" />
                <span>Curriculum Moderators & Roadmap Editors ({moderators.length})</span>
              </h2>
              <p className="text-xs sm:text-sm text-graphite font-medium mt-1">
                Selected from verified teachers across Bangladesh. Moderators have privileged access to build and edit Roadmaps, approve courses, and curate community content.
              </p>
            </div>

            <PillButton
              variant="stamp"
              size="md"
              onClick={() => setIsAddingModerator(true)}
              className="btn-bounce shadow-solid-xs"
              icon={<UserPlus className="w-4 h-4" />}
            >
              + Add Custom Moderator
            </PillButton>
          </div>

          {/* SECTION 1: PROMOTE REGISTERED TEACHERS TO MODERATOR */}
          <div className="p-6 bg-paper-light border-2 border-ink rounded-[24px] shadow-solid-md space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <h3 className="text-base sm:text-lg font-extrabold text-ink flex items-center gap-2">
                  <span>👩‍🏫 Promote Teachers to Curriculum Moderator</span>
                  <span className="px-2 py-0.5 bg-highlighter border border-ink rounded-full text-[10px] font-mono font-extrabold">
                    {users.filter(u => u.role === 'teacher').length} Available
                  </span>
                </h3>
                <p className="text-xs text-graphite font-medium">
                  Select any registered teacher to grant them full access to the Roadmap Editor, Course Authoring CMS, and Community Moderation.
                </p>
              </div>
            </div>

            {users.filter(u => u.role === 'teacher').length === 0 ? (
              <p className="text-xs text-graphite font-bold italic p-4 bg-white/70 rounded-xl border border-ink/20 text-center">
                All registered teachers are already promoted to moderators or no teacher accounts exist yet.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-1">
                {users.filter(u => u.role === 'teacher').map(teacher => (
                  <div key={teacher.id} className="p-4 bg-white border-2 border-ink rounded-2xl shadow-solid-xs flex flex-col justify-between space-y-3">
                    <div className="flex items-start space-x-3">
                      <img src={teacher.avatar} alt={teacher.name} className="w-10 h-10 rounded-full border-2 border-ink object-cover flex-shrink-0" />
                      <div className="overflow-hidden">
                        <strong className="text-sm font-extrabold text-ink truncate block">{teacher.name}</strong>
                        <span className="text-[11px] text-graphite font-medium truncate block">{teacher.email}</span>
                        <span className="text-[10px] font-mono font-bold text-stamp truncate block">{teacher.school || 'Verified Educator'}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        promoteTeacherToModerator(teacher.id);
                        confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
                      }}
                      className="w-full py-2 px-3 bg-highlighter hover:bg-highlighter-hover border-2 border-ink rounded-xl text-xs font-extrabold text-ink shadow-solid-xs btn-bounce flex items-center justify-center gap-1.5 transition-all"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-stamp" />
                      <span>Promote to Moderator ➔</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SECTION 2: ACTIVE MODERATORS ROSTER */}
          <div className="space-y-4">
            <h3 className="text-lg font-extrabold text-ink flex items-center gap-2">
              <span>🛡️ Active Moderator Team & Roadmap Masters ({moderators.length})</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {moderators.map((mod) => (
                <BentoCard key={mod.id} variant="white" className="space-y-4 p-6 border-2 border-ink shadow-solid-md flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-0.5 bg-stamp text-white border border-ink font-mono text-[10px] font-extrabold rounded-full shadow-solid-xs flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-highlighter" />
                        <span>Curriculum Moderator</span>
                      </span>
                      <span className="text-[10px] font-mono text-graphite font-bold">
                        Joined: {mod.joinedAt || '2026'}
                      </span>
                    </div>

                    <div className="flex items-center space-x-3.5">
                      <img src={mod.avatar} alt={mod.name} className="w-12 h-12 rounded-full border-2 border-ink object-cover" />
                      <div>
                        <strong className="text-base font-extrabold text-ink block">{mod.name}</strong>
                        <span className="text-xs text-graphite font-bold block">{mod.email}</span>
                        <span className="text-[11px] text-stamp font-mono font-bold block">{mod.school}</span>
                      </div>
                    </div>

                    {/* Permissions Badges */}
                    <div className="pt-2 border-t border-ink/15 space-y-1.5">
                      <span className="text-[10px] font-mono font-extrabold text-graphite uppercase block">Active Moderator Privileges:</span>
                      <div className="flex flex-wrap gap-1.5">
                        <span className="px-2 py-0.5 bg-yellow-50 border border-ink/20 rounded-lg text-[10px] font-extrabold text-ink flex items-center gap-1">
                          <Check className="w-3 h-3 text-green-700 stroke-[3]" />
                          <span>🗺️ Edit & Create Roadmaps</span>
                        </span>
                        <span className="px-2 py-0.5 bg-blue-50 border border-ink/20 rounded-lg text-[10px] font-extrabold text-ink flex items-center gap-1">
                          <Check className="w-3 h-3 text-green-700 stroke-[3]" />
                          <span>📚 Course Curriculum Approval</span>
                        </span>
                        <span className="px-2 py-0.5 bg-green-50 border border-ink/20 rounded-lg text-[10px] font-extrabold text-ink flex items-center gap-1">
                          <Check className="w-3 h-3 text-green-700 stroke-[3]" />
                          <span>✍️ Article & Community Moderation</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-ink/15 flex justify-end">
                    <button
                      type="button"
                      onClick={() => demoteModerator(mod.id)}
                      className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <UserMinus className="w-3.5 h-3.5" />
                      <span>Revoke Moderator Status</span>
                    </button>
                  </div>
                </BentoCard>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: INSTITUTIONAL PARTNERSHIPS */}
      {activeTab === 'institutions' && (
        <div className="space-y-6">
          <h2 className="text-2xl font-extrabold text-ink">Institutional Licenses & NGO Outreach</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {SEED_INSTITUTIONAL_ACCOUNTS.map((inst) => (
              <BentoCard key={inst.id} variant="white" className="space-y-4 p-6 border-2 border-ink shadow-solid-md">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 bg-stamp text-white rounded-full">
                    {inst.type}
                  </span>
                  <span className="text-xs font-mono text-green-700 font-bold">{inst.status}</span>
                </div>

                <div>
                  <h3 className="text-lg font-extrabold text-ink">{inst.name}</h3>
                  <span className="text-xs text-graphite font-bold">{inst.district}</span>
                </div>

                <div className="space-y-1 text-xs font-mono pt-2 border-t border-ink/15">
                  <div className="flex justify-between">
                    <span className="text-graphite">Total Students:</span>
                    <strong className="text-ink">{inst.totalStudents.toLocaleString()}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-graphite">Lead:</span>
                    <span className="text-ink font-bold">{inst.contactPerson}</span>
                  </div>
                </div>

                <BarcodeStub label="LICENSE-KEY" code={inst.id} />
              </BentoCard>
            ))}
          </div>
        </div>
      )}

      {/* MODAL 1: ADD NEW MODERATOR */}
      {isAddingModerator && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/70 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg bg-paper-card border-2 border-ink rounded-[28px] p-6 sm:p-8 shadow-solid-xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-ink/15">
              <h3 className="text-xl font-extrabold text-ink">Add Editorial Moderator</h3>
              <button onClick={() => setIsAddingModerator(false)} className="text-gray-400 hover:text-ink">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveModerator} className="space-y-4 text-xs">
              <div>
                <label className="font-extrabold text-ink block mb-1">Moderator Full Name:</label>
                <input
                  type="text"
                  placeholder="e.g. Dr. Sumaiya Parveen"
                  value={newModName}
                  onChange={(e) => setNewModName(e.target.value)}
                  className="w-full p-2.5 bg-white border-2 border-ink/40 rounded-xl font-bold text-ink"
                  required
                />
              </div>

              <div>
                <label className="font-extrabold text-ink block mb-1">Email Address:</label>
                <input
                  type="email"
                  placeholder="e.g. sumaiya@buet.ac.bd"
                  value={newModEmail}
                  onChange={(e) => setNewModEmail(e.target.value)}
                  className="w-full p-2.5 bg-white border-2 border-ink/40 rounded-xl font-bold text-ink"
                  required
                />
              </div>

              <div>
                <label className="font-extrabold text-ink block mb-1">Affiliation / Institution:</label>
                <input
                  type="text"
                  value={newModSchool}
                  onChange={(e) => setNewModSchool(e.target.value)}
                  className="w-full p-2.5 bg-white border-2 border-ink/40 rounded-xl font-bold text-ink"
                />
              </div>

              <div className="p-3 bg-paper-light border border-ink/20 rounded-xl space-y-1.5 text-xs font-bold text-ink">
                <span className="text-stamp block uppercase font-mono text-[10px]">Granted Privileges:</span>
                <div className="space-y-1 text-graphite">
                  <div className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-green-700" /> <span>Edit & publish national roadmaps</span></div>
                  <div className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-green-700" /> <span>Create, edit, and organize courses & modules</span></div>
                  <div className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-green-700" /> <span>Author lessons, theory notes, MCQs & exercises</span></div>
                </div>
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <PillButton variant="secondary" size="sm" onClick={() => setIsAddingModerator(false)}>
                  Cancel
                </PillButton>
                <PillButton variant="highlighter" size="sm" className="btn-bounce">
                  Add Moderator & Grant Access ➔
                </PillButton>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: CREATE NEW ROADMAP */}
      {isCreatingRoadmap && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/70 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg bg-paper-card border-2 border-ink rounded-[28px] p-6 sm:p-8 shadow-solid-xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-ink/15">
              <h3 className="text-xl font-extrabold text-ink">Create Public Learning Roadmap</h3>
              <button onClick={() => setIsCreatingRoadmap(false)} className="text-gray-400 hover:text-ink">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRoadmap} className="space-y-4 text-xs">
              <div>
                <label className="font-extrabold text-ink block mb-1">Roadmap Title:</label>
                <input
                  type="text"
                  placeholder="e.g. Class 11-12 Higher Secondary ICT Track"
                  value={newRoadmapTitle}
                  onChange={(e) => setNewRoadmapTitle(e.target.value)}
                  className="w-full p-2.5 bg-white border-2 border-ink/40 rounded-xl font-bold text-ink"
                  required
                />
              </div>

              <div>
                <label className="font-extrabold text-ink block mb-1">Description:</label>
                <textarea
                  rows={2}
                  value={newRoadmapDescription}
                  onChange={(e) => setNewRoadmapDescription(e.target.value)}
                  placeholder="Summary of what students will achieve in this track..."
                  className="w-full p-2.5 bg-white border-2 border-ink/40 rounded-xl font-medium text-ink"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-extrabold text-ink block mb-1">Target Audience:</label>
                  <input
                    type="text"
                    value={newRoadmapAudience}
                    onChange={(e) => setNewRoadmapAudience(e.target.value)}
                    className="w-full p-2.5 bg-white border-2 border-ink/40 rounded-xl font-bold text-ink"
                  />
                </div>

                <div>
                  <label className="font-extrabold text-ink block mb-1">Achievement Badge:</label>
                  <input
                    type="text"
                    value={newRoadmapBadge}
                    onChange={(e) => setNewRoadmapBadge(e.target.value)}
                    className="w-full p-2.5 bg-white border-2 border-ink/40 rounded-xl font-bold text-ink"
                  />
                </div>
              </div>

              <div>
                <label className="font-extrabold text-ink block mb-1">Starting Course:</label>
                <select
                  value={newRoadmapCourseId}
                  onChange={(e) => setNewRoadmapCourseId(e.target.value)}
                  className="w-full p-2.5 bg-white border-2 border-ink/40 rounded-xl font-bold text-ink"
                >
                  {courses.map(c => (
                    <option key={c.id} value={c.id}>{c.title}</option>
                  ))}
                </select>
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <PillButton variant="secondary" size="sm" onClick={() => setIsCreatingRoadmap(false)}>
                  Cancel
                </PillButton>
                <PillButton variant="stamp" size="sm" className="btn-bounce">
                  Publish Roadmap ➔
                </PillButton>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
