import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BentoCard } from '../common/BentoCard';
import { PillButton } from '../common/PillButton';
import { Users, Plus, KeyRound, ArrowRight, School, X } from 'lucide-react';

export const TeacherDashboard: React.FC = () => {
  const { classrooms, createClassroom, currentUser } = useApp();
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [className, setClassName] = useState('');
  const [subject, setSubject] = useState('');
  const [grade, setGrade] = useState('Class 9');

  const teacherClassrooms = classrooms.filter(c => c.teacherId === currentUser.id);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!className.trim() || !subject.trim()) return;
    createClassroom(className.trim(), grade, subject.trim());
    setCreateModalOpen(false);
    setClassName('');
    setSubject('');
  };

  return (
    <div className="space-y-8 py-2 max-w-7xl mx-auto">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-ink/15 pb-6">
        <div className="space-y-1">
          <div className="doodle-badge bg-stamp text-white">
            <School className="w-3.5 h-3.5" />
            <span>Teacher Workspace (100% Free)</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-ink">
            Classrooms & Batch Grading
          </h1>
          <p className="text-xs sm:text-sm text-graphite font-medium">
            Manage your school classrooms, generate student join codes, and scan entire piles of paper answer sheets in minutes.
          </p>
        </div>

        <PillButton
          variant="primary"
          size="md"
          onClick={() => setCreateModalOpen(true)}
          className="btn-bounce shadow-solid-xs flex-shrink-0"
          icon={<Plus className="w-4 h-4" />}
        >
          + Create New Classroom
        </PillButton>
      </div>

      {/* ZERO CLASSROOMS EMPTY STATE */}
      {teacherClassrooms.length === 0 ? (
        <div className="p-10 sm:p-14 bg-paper-card border-2 border-ink rounded-[24px] text-center space-y-5 shadow-solid-md max-w-2xl mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-stamp text-white border-2 border-ink flex items-center justify-center mx-auto shadow-solid-xs text-2xl">
            👩‍🏫
          </div>
          <div className="space-y-1.5">
            <h3 className="text-xl sm:text-2xl font-extrabold text-ink">You haven&apos;t created any classrooms yet</h3>
            <p className="text-xs sm:text-sm text-graphite font-medium max-w-md mx-auto">
              Create a free classroom for your school to give students an automated 6-digit Join Code and start batch grading paper homework.
            </p>
          </div>
          <div className="pt-2">
            <PillButton
              variant="primary"
              size="lg"
              onClick={() => setCreateModalOpen(true)}
              className="btn-bounce shadow-solid-xs"
              icon={<Plus className="w-4 h-4" />}
            >
              Create Your First Classroom ➔
            </PillButton>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {teacherClassrooms.map((cls) => (
            <BentoCard
              key={cls.id}
              variant="white"
              className="p-7 border-2 border-ink shadow-solid-md hover:shadow-solid-lg transition-all space-y-5 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 bg-highlighter border border-ink text-ink font-mono text-xs font-extrabold rounded-full shadow-solid-xs">
                    {cls.gradeLevel || 'Class 9'}
                  </span>
                  <div className="px-3 py-1 bg-paper-muted border border-ink/30 rounded-full text-xs font-mono font-extrabold text-stamp flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>Join Code: {cls.joinCode}</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-extrabold text-ink">{cls.name}</h3>
                  <p className="text-xs text-graphite mt-0.5 font-bold">Subject: {cls.subject}</p>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2 text-center text-xs">
                  <div className="p-2.5 bg-paper-light border border-ink/20 rounded-xl">
                    <strong className="block text-base font-extrabold text-ink">{cls.roster?.length || 0}</strong>
                    <span className="text-[10px] text-graphite font-mono">Students</span>
                  </div>
                  <div className="p-2.5 bg-paper-light border border-ink/20 rounded-xl">
                    <strong className="block text-base font-extrabold text-stamp">{cls.assignments?.length || 0}</strong>
                    <span className="text-[10px] text-graphite font-mono">Assignments</span>
                  </div>
                  <div className="p-2.5 bg-paper-light border border-ink/20 rounded-xl">
                    <strong className="block text-base font-extrabold text-green-700">100%</strong>
                    <span className="text-[10px] text-graphite font-mono">Active</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-ink/15 flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-graphite">
                  Class Code: <strong className="text-ink">{cls.joinCode}</strong>
                </span>

                <PillButton
                  variant="stamp"
                  size="md"
                  className="btn-bounce shadow-solid-xs"
                  icon={<ArrowRight className="w-4 h-4" />}
                >
                  Open Gradebook ➔
                </PillButton>
              </div>
            </BentoCard>
          ))}
        </div>
      )}

      {/* CREATE CLASSROOM MODAL */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-lg bg-paper-card border-3 border-ink rounded-[28px] p-6 sm:p-8 shadow-solid-xl space-y-5">
            <div className="flex items-center justify-between border-b-2 border-ink/15 pb-4">
              <h3 className="text-xl font-extrabold text-ink">Create New Classroom</h3>
              <button
                onClick={() => setCreateModalOpen(false)}
                className="p-1.5 rounded-full border-2 border-ink/30 hover:bg-paper-muted text-ink"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-extrabold text-ink block">Classroom Name *</label>
                <input
                  type="text"
                  required
                  value={className}
                  onChange={e => setClassName(e.target.value)}
                  placeholder="e.g. Class 9 Section B (ICT)"
                  className="w-full p-2.5 bg-white border-2 border-ink rounded-xl font-bold text-ink"
                />
              </div>

              <div className="space-y-1">
                <label className="font-extrabold text-ink block">Subject / Track *</label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  placeholder="e.g. NCTB Chapter 5 Python Programming"
                  className="w-full p-2.5 bg-white border-2 border-ink rounded-xl font-bold text-ink"
                />
              </div>

              <div className="space-y-1">
                <label className="font-extrabold text-ink block">Grade Level</label>
                <select
                  value={grade}
                  onChange={e => setGrade(e.target.value)}
                  className="w-full p-2.5 bg-white border-2 border-ink rounded-xl font-bold text-ink"
                >
                  <option>Class 8</option>
                  <option>Class 9</option>
                  <option>Class 10 (SSC)</option>
                  <option>HSC 1st Year</option>
                  <option>HSC 2nd Year</option>
                  <option>Olympiad Camp</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2 font-bold text-graphite hover:text-ink"
                >
                  Cancel
                </button>
                <PillButton
                  type="submit"
                  variant="primary"
                  size="md"
                  icon={<Plus className="w-4 h-4" />}
                >
                  Create Classroom (Free)
                </PillButton>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
