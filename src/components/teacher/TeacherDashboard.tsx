import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BentoCard } from '../common/BentoCard';
import { PillButton } from '../common/PillButton';
import { Classroom } from '../../types';
import { 
  Users, 
  Plus, 
  KeyRound, 
  ArrowRight, 
  School, 
  X, 
  Settings, 
  Trash2, 
  BookOpen, 
  UserMinus, 
  Calendar, 
  Award,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const TeacherDashboard: React.FC = () => {
  const { 
    classrooms, 
    courses,
    createClassroom, 
    updateClassroomCourses,
    removeStudentFromClassroom,
    addAssignmentToClassroom,
    deleteAssignmentFromClassroom,
    deleteClassroom,
    currentUser 
  } = useApp();

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [className, setClassName] = useState('');
  const [subject, setSubject] = useState('');
  const [grade, setGrade] = useState('Class 9');

  // Manage Classroom Modal State
  const [managingClassroom, setManagingClassroom] = useState<Classroom | null>(null);
  const [manageTab, setManageTab] = useState<'roster' | 'courses' | 'assignments' | 'settings'>('roster');

  // New Assignment Form State
  const [asgTitle, setAsgTitle] = useState('');
  const [asgDueDate, setAsgDueDate] = useState('');
  const [asgMaxScore, setAsgMaxScore] = useState(100);
  const [asgDesc, setAsgDesc] = useState('');

  const teacherClassrooms = classrooms.filter(c => c.teacherId === currentUser.id);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!className.trim() || !subject.trim()) return;
    createClassroom(className.trim(), grade, subject.trim());
    setCreateModalOpen(false);
    setClassName('');
    setSubject('');
    confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
  };

  const handleToggleCourse = (courseId: string) => {
    if (!managingClassroom) return;
    const currentCourses = managingClassroom.courseIds || [];
    const updated = currentCourses.includes(courseId)
      ? currentCourses.filter(id => id !== courseId)
      : [...currentCourses, courseId];
    
    updateClassroomCourses(managingClassroom.id, updated);
    setManagingClassroom({ ...managingClassroom, courseIds: updated });
  };

  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!managingClassroom || !asgTitle.trim()) return;

    addAssignmentToClassroom(managingClassroom.id, {
      title: asgTitle.trim(),
      dueDate: asgDueDate || new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10),
      maxScore: asgMaxScore,
      description: asgDesc.trim(),
      assignedDate: new Date().toISOString().slice(0, 10)
    });

    setAsgTitle('');
    setAsgDueDate('');
    setAsgDesc('');
    confetti({ particleCount: 50, spread: 50, origin: { y: 0.6 } });
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
            Classrooms & Student Management
          </h1>
          <p className="text-xs sm:text-sm text-graphite font-medium">
            Manage your school classrooms, attach courses, view student rosters, and assign homework challenges.
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
                    <span className="text-[10px] text-graphite font-mono">Enrolled Students</span>
                  </div>
                  <div className="p-2.5 bg-paper-light border border-ink/20 rounded-xl">
                    <strong className="block text-base font-extrabold text-stamp">{cls.assignments?.length || 0}</strong>
                    <span className="text-[10px] text-graphite font-mono">Assignments</span>
                  </div>
                  <div className="p-2.5 bg-paper-light border border-ink/20 rounded-xl">
                    <strong className="block text-base font-extrabold text-green-700">{cls.courseIds?.length || 1}</strong>
                    <span className="text-[10px] text-graphite font-mono">Courses Attached</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-ink/15 flex items-center justify-between gap-2">
                <span className="text-xs font-mono font-bold text-graphite">
                  Code: <strong className="text-ink text-sm">{cls.joinCode}</strong>
                </span>

                <div className="flex items-center gap-2">
                  <PillButton
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      setManagingClassroom(cls);
                      setManageTab('roster');
                    }}
                    className="btn-bounce shadow-solid-xs"
                    icon={<Settings className="w-3.5 h-3.5 text-stamp" />}
                  >
                    Manage Classroom ➔
                  </PillButton>
                </div>
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

      {/* MANAGE CLASSROOM STUDIO MODAL (EDIT COURSES, REMOVE STUDENTS, ASSIGN HOMEWORK) */}
      {managingClassroom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/75 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-3xl bg-paper-card border-3 border-ink rounded-[28px] p-6 sm:p-8 shadow-solid-xl space-y-6 max-h-[90vh] overflow-y-auto">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b-2 border-ink/15 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl sm:text-2xl font-extrabold text-ink">{managingClassroom.name}</h3>
                  <span className="px-2.5 py-0.5 bg-highlighter border border-ink rounded-full font-mono text-xs font-extrabold">
                    {managingClassroom.joinCode}
                  </span>
                </div>
                <p className="text-xs text-graphite font-medium mt-0.5">
                  Manage roster, assigned syllabus courses, and student assignments.
                </p>
              </div>

              <button
                onClick={() => setManagingClassroom(null)}
                className="p-2 rounded-full border-2 border-ink/30 hover:bg-paper-muted text-ink"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Sub-Tabs */}
            <div className="flex items-center gap-2 border-b-2 border-ink/15 pb-3 text-xs font-extrabold">
              <button
                onClick={() => setManageTab('roster')}
                className={'px-3.5 py-1.5 rounded-xl border-2 transition-all ' + (manageTab === 'roster' ? 'bg-highlighter border-ink shadow-solid-xs text-ink' : 'border-transparent text-graphite hover:text-ink')}
              >
                👥 Enrolled Students ({(classrooms.find(c => c.id === managingClassroom.id)?.roster || []).length})
              </button>
              <button
                onClick={() => setManageTab('courses')}
                className={'px-3.5 py-1.5 rounded-xl border-2 transition-all ' + (manageTab === 'courses' ? 'bg-highlighter border-ink shadow-solid-xs text-ink' : 'border-transparent text-graphite hover:text-ink')}
              >
                📚 Assigned Courses ({(managingClassroom.courseIds || []).length})
              </button>
              <button
                onClick={() => setManageTab('assignments')}
                className={'px-3.5 py-1.5 rounded-xl border-2 transition-all ' + (manageTab === 'assignments' ? 'bg-highlighter border-ink shadow-solid-xs text-ink' : 'border-transparent text-graphite hover:text-ink')}
              >
                📝 Assignments ({(classrooms.find(c => c.id === managingClassroom.id)?.assignments || []).length})
              </button>
              <button
                onClick={() => setManageTab('settings')}
                className={'px-3.5 py-1.5 rounded-xl border-2 transition-all ' + (manageTab === 'settings' ? 'bg-highlighter border-ink shadow-solid-xs text-ink' : 'border-transparent text-graphite hover:text-ink')}
              >
                ⚙️ Settings
              </button>
            </div>

            {/* TAB 1: ROSTER & REMOVE STUDENTS */}
            {manageTab === 'roster' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-extrabold text-ink">Student Roster</h4>
                  <span className="text-xs font-mono font-bold text-graphite">
                    Join Code: <strong className="text-stamp font-extrabold">{managingClassroom.joinCode}</strong>
                  </span>
                </div>

                {(() => {
                  const currentRoster = classrooms.find(c => c.id === managingClassroom.id)?.roster || [];
                  if (currentRoster.length === 0) {
                    return (
                      <div className="p-8 bg-paper-light border-2 border-dashed border-ink/30 rounded-2xl text-center space-y-2">
                        <Users className="w-8 h-8 text-graphite mx-auto" />
                        <p className="text-xs text-graphite font-bold">No students have joined this classroom yet.</p>
                        <p className="text-[11px] text-graphite">
                          Share the join code <strong className="text-ink font-mono font-extrabold">{managingClassroom.joinCode}</strong> with your students.
                        </p>
                      </div>
                    );
                  }

                  return (
                    <div className="space-y-2.5">
                      {currentRoster.map((student) => (
                        <div key={student.studentId} className="p-3.5 bg-white border-2 border-ink rounded-xl flex items-center justify-between shadow-solid-xs">
                          <div className="flex items-center space-x-3">
                            <img src={student.avatar} alt={student.name} className="w-9 h-9 rounded-full border-2 border-ink object-cover" />
                            <div>
                              <strong className="text-xs font-extrabold text-ink block">{student.name}</strong>
                              <span className="text-[10px] text-graphite font-mono block">{student.school || 'Student'} • {student.division || 'Bangladesh'}</span>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm('Remove ' + student.name + ' from this classroom?')) {
                                removeStudentFromClassroom(managingClassroom.id, student.studentId);
                              }
                            }}
                            className="px-2.5 py-1 text-red-600 hover:bg-red-50 border border-red-200 rounded-lg text-xs font-extrabold flex items-center gap-1 transition-colors"
                          >
                            <UserMinus className="w-3.5 h-3.5" />
                            <span>Remove</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>
            )}

            {/* TAB 2: ASSIGN / REMOVE COURSES */}
            {manageTab === 'courses' && (
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-extrabold text-ink">Attach Syllabus Courses</h4>
                  <p className="text-xs text-graphite font-medium">
                    Check the courses you want to assign to students in this classroom.
                  </p>
                </div>

                <div className="space-y-3">
                  {courses.map((course) => {
                    const isAttached = (managingClassroom.courseIds || []).includes(course.id);
                    return (
                      <div 
                        key={course.id} 
                        onClick={() => handleToggleCourse(course.id)}
                        className={'p-4 border-2 rounded-2xl cursor-pointer transition-all flex items-center justify-between ' + (isAttached ? 'bg-highlighter border-ink shadow-solid-xs' : 'bg-white border-ink/25 hover:border-ink')}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <strong className="text-sm font-extrabold text-ink">{course.title}</strong>
                            <span className="px-2 py-0.5 bg-paper-light border border-ink/30 rounded text-[10px] font-mono font-bold">
                              {course.category}
                            </span>
                          </div>
                          <p className="text-xs text-graphite line-clamp-1">{course.description}</p>
                        </div>

                        <div className={'w-6 h-6 rounded-lg border-2 border-ink flex items-center justify-center ' + (isAttached ? 'bg-ink text-highlighter' : 'bg-white')}>
                          {isAttached && <Check className="w-4 h-4 stroke-[3]" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 3: ASSIGNMENTS (CREATE & MANAGE) */}
            {manageTab === 'assignments' && (
              <div className="space-y-6">
                
                {/* Form to Assign New Challenge */}
                <form onSubmit={handleCreateAssignment} className="p-4 bg-paper-light border-2 border-ink rounded-2xl space-y-3 text-xs">
                  <h4 className="text-xs font-mono font-extrabold uppercase text-ink flex items-center gap-1.5">
                    <Plus className="w-3.5 h-3.5 text-stamp" />
                    <span>Assign New Homework Challenge</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-bold text-ink block">Assignment Title *</label>
                      <input
                        type="text"
                        required
                        value={asgTitle}
                        onChange={e => setAsgTitle(e.target.value)}
                        placeholder="e.g. Chapter 5: Python Loops Lab 01"
                        className="w-full p-2 bg-white border-2 border-ink rounded-xl font-bold text-ink"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-ink block">Due Date</label>
                      <input
                        type="date"
                        value={asgDueDate}
                        onChange={e => setAsgDueDate(e.target.value)}
                        className="w-full p-2 bg-white border-2 border-ink rounded-xl font-bold text-ink"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-ink block">Instructions / Description</label>
                    <input
                      type="text"
                      value={asgDesc}
                      onChange={e => setAsgDesc(e.target.value)}
                      placeholder="Write code on ruled paper, scan with your phone, and submit before deadline."
                      className="w-full p-2 bg-white border-2 border-ink rounded-xl font-medium text-ink"
                    />
                  </div>

                  <div className="pt-1 flex justify-end">
                    <PillButton
                      type="submit"
                      variant="primary"
                      size="sm"
                      icon={<Plus className="w-3.5 h-3.5" />}
                    >
                      Assign to Class
                    </PillButton>
                  </div>
                </form>

                {/* List of Active Assignments */}
                <div className="space-y-2.5">
                  <h4 className="text-xs font-mono font-extrabold uppercase text-graphite">
                    Active Class Assignments ({(classrooms.find(c => c.id === managingClassroom.id)?.assignments || []).length})
                  </h4>

                  {(() => {
                    const asgs = classrooms.find(c => c.id === managingClassroom.id)?.assignments || [];
                    if (asgs.length === 0) {
                      return <p className="text-xs text-graphite italic">No assignments created yet.</p>;
                    }

                    return asgs.map(a => (
                      <div key={a.id} className="p-3 bg-white border-2 border-ink rounded-xl flex items-center justify-between shadow-solid-xs text-xs">
                        <div className="space-y-0.5">
                          <strong className="text-sm font-extrabold text-ink block">{a.title}</strong>
                          <span className="text-graphite block text-[11px]">{a.description || 'Standard homework task'}</span>
                          <span className="font-mono text-[10px] text-stamp font-bold">Due: {a.dueDate} • Max: {a.maxScore || 100} pts</span>
                        </div>

                        <button
                          type="button"
                          onClick={() => deleteAssignmentFromClassroom(managingClassroom.id, a.id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg border border-transparent hover:border-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ));
                  })()}
                </div>

              </div>
            )}

            {/* TAB 4: SETTINGS & DELETE CLASSROOM */}
            {manageTab === 'settings' && (
              <div className="space-y-4 text-xs">
                <div className="p-4 bg-red-50 border-2 border-red-300 rounded-2xl space-y-2">
                  <h4 className="text-sm font-extrabold text-red-900">Danger Zone: Delete Classroom</h4>
                  <p className="text-xs text-red-700">
                    Deleting this classroom will remove all student enrollments and assignments from the database.
                  </p>
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm('Are you sure you want to permanently delete this classroom?')) {
                          deleteClassroom(managingClassroom.id);
                          setManagingClassroom(null);
                        }
                      }}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-extrabold shadow-solid-xs transition-colors"
                    >
                      Permanently Delete Classroom
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
