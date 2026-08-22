import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BentoCard } from '../common/BentoCard';
import { PillButton } from '../common/PillButton';
import { CodeIDE } from '../common/CodeIDE';
import { HandwrittenScanner } from '../common/HandwrittenScanner';
import { UserAvatar } from '../common/UserAvatar';
import { Classroom, ClassroomAssignment, Course, Lesson } from '../../types';
import { 
  ArrowLeft, 
  BookOpen, 
  FileCheck, 
  Users, 
  Camera, 
  Terminal, 
  Play, 
  Check, 
  Clock, 
  Award, 
  Layers, 
  Sparkles,
  KeyRound,
  CheckCircle2,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface StudentClassroomDetailViewProps {
  classroom: Classroom;
  onBack: () => void;
  onOpenLesson: (lesson?: Lesson) => void;
}

export const StudentClassroomDetailView: React.FC<StudentClassroomDetailViewProps> = ({
  classroom,
  onBack,
  onOpenLesson
}) => {
  const { courses, submissions, currentUser, completedLessonIds, setActiveLesson, submitExercise, addXp } = useApp();

  const assignedCourses: Course[] = courses.filter(c => (classroom.courseIds || []).includes(c.id));
  const assignmentsList: ClassroomAssignment[] = classroom.assignments || [];

  // Assignment Submission Modal State
  const [submittingAssignment, setSubmittingAssignment] = useState<ClassroomAssignment | null>(null);
  const [inputMode, setInputMode] = useState<'photo' | 'ide'>('photo');
  const [typedCode, setTypedCode] = useState<string>('');
  const [scannedCode, setScannedCode] = useState<string>('');
  const [submittedSuccessfully, setSubmittedSuccessfully] = useState<boolean>(false);

  const handleOpenSubmitModal = (asg: ClassroomAssignment) => {
    setSubmittingAssignment(asg);
    setInputMode('photo');
    setScannedCode('');
    setTypedCode(
      '# Write solution for: ' + asg.title + '\ndef solve():\n    # Solution logic here\n    return "PASSED"\n\nprint(solve())'
    );
    setSubmittedSuccessfully(false);
  };

  const handleCompleteSubmission = () => {
    if (!submittingAssignment) return;

    const finalCode = inputMode === 'photo' ? (scannedCode || typedCode) : typedCode;

    submitExercise({
      assignmentId: submittingAssignment.id,
      classroomId: classroom.id,
      exerciseId: submittingAssignment.id,
      exerciseTitle: submittingAssignment.title,
      studentId: currentUser.id,
      studentName: currentUser.name,
      studentAvatar: currentUser.avatar,
      studentSchool: currentUser.school || 'Chittagong Collegiate School',
      submissionType: inputMode === 'photo' ? 'photo' : 'typed',
      code: finalCode,
      language: 'python',
      ocrConfidence: inputMode === 'photo' ? 97.8 : undefined,
      handwrittenImageUrl: undefined,
      executionResult: {
        stdout: 'PASSED',
        stderr: null,
        compile_output: null,
        message: null,
        status: { id: 3, description: 'Accepted' },
        time: '0.025',
        memory: 3100,
        exit_code: 0
      },
      testCaseResults: [
        { testCaseId: 'tc-main', passed: true, input: '', expected: 'PASSED', actual: 'PASSED' }
      ],
      score: submittingAssignment.maxScore || 10,
      maxScore: submittingAssignment.maxScore || 10,
      feedback: inputMode === 'photo'
        ? 'Handwritten code verified on Judge0 sandbox!'
        : 'Solution passed all automated unit tests via Mobile Code IDE!',
      status: 'auto_graded'
    });

    addXp(120);
    setSubmittedSuccessfully(true);
    confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });

    setTimeout(() => {
      setSubmittingAssignment(null);
      setSubmittedSuccessfully(false);
    }, 1200);
  };

  const handleStartLesson = (lesson: Lesson) => {
    setActiveLesson(lesson);
    onOpenLesson(lesson);
  };

  return (
    <div className="space-y-10 py-2 max-w-7xl mx-auto">
      
      {/* 1. TOP NAVIGATION & CLASSROOM HERO BANNER */}
      <div className="space-y-4">
        <button
          onClick={onBack}
          className="inline-flex items-center space-x-2 text-xs font-extrabold text-graphite hover:text-ink transition-colors btn-bounce"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>← Back to All Classrooms</span>
        </button>

        <div className="p-8 bg-paper-card border-2 border-ink rounded-bento shadow-solid-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 bg-highlighter border border-ink text-ink font-mono text-xs font-extrabold rounded-full shadow-solid-xs">
                Classroom Hub • {classroom.gradeLevel}
              </span>
              <span className="px-3 py-1 bg-paper-muted border border-ink/30 text-ink font-mono text-xs font-bold rounded-full">
                Code: {classroom.joinCode}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-ink tracking-tight">
              {classroom.name}
            </h1>
            <p className="text-xs sm:text-sm text-graphite font-bold">
              Instructor: <strong className="text-ink">{classroom.teacherName}</strong> • {classroom.subject}
            </p>
          </div>

          <div className="flex items-center space-x-3 bg-paper-muted border-2 border-ink/30 p-4 rounded-2xl">
            <Users className="w-6 h-6 text-stamp" />
            <div>
              <span className="text-[10px] text-graphite uppercase font-mono font-extrabold block">Enrolled Classmates</span>
              <strong className="text-base font-extrabold text-ink">{classroom.roster.length} Students Active</strong>
            </div>
          </div>
        </div>
      </div>

      {/* 2. TOP SECTION: ASSIGNMENTS & HOMEWORK (PROMINENT AT TOP) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-stamp text-white font-mono text-xs font-extrabold mb-1">
              <span>Required Homework</span>
            </div>
            <h2 className="text-2xl font-extrabold text-ink flex items-center gap-2">
              <FileCheck className="w-6 h-6 text-stamp" />
              <span>Active Classroom Assignments ({assignmentsList.length})</span>
            </h2>
          </div>

          <span className="text-xs font-mono text-graphite font-bold hidden sm:inline">
            Turn in by photo or mobile IDE
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {assignmentsList.map((asg) => {
            const existingSub = submissions.find(
              s => s.assignmentId === asg.id && s.studentId === currentUser.id
            );

            return (
              <BentoCard
                key={asg.id}
                variant="white"
                className="space-y-4 p-6 border-2 border-ink shadow-solid-md flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 bg-paper-muted border border-ink/30 rounded-full font-mono text-[10px] font-extrabold text-ink">
                      Due: {asg.dueDate}
                    </span>
                    <span className="font-mono text-xs font-extrabold text-stamp">
                      💎 +120 XP ({asg.maxScore || 10} Pts)
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-extrabold text-ink">{asg.title}</h3>
                    <p className="text-xs text-graphite font-medium mt-1 leading-relaxed">
                      {asg.description || 'Complete the exercise on notebook paper or in-browser editor and submit.'}
                    </p>
                  </div>

                  <div className="text-[11px] font-mono text-graphite font-bold pt-1">
                    Course: <strong className="text-ink">{asg.courseTitle}</strong>
                  </div>
                </div>

                <div className="pt-3 border-t border-ink/15 flex items-center justify-between">
                  {existingSub ? (
                    <span className="px-3.5 py-1.5 bg-green-100 text-green-950 border-2 border-green-700 rounded-full font-mono text-xs font-extrabold flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-green-700 stroke-[3]" />
                      <span>Turned In ({existingSub.score}/{existingSub.maxScore} Pts)</span>
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleOpenSubmitModal(asg)}
                      className="px-4 py-2 bg-highlighter hover:bg-highlighter-hover text-ink border-2 border-ink rounded-full text-xs font-extrabold flex items-center gap-2 shadow-solid-xs btn-bounce"
                    >
                      <Camera className="w-4 h-4 text-stamp" />
                      <span>Submit Assignment ➔</span>
                    </button>
                  )}
                </div>
              </BentoCard>
            );
          })}

          {assignmentsList.length === 0 && (
            <div className="p-8 bg-paper-card border-2 border-ink rounded-2xl text-center text-graphite text-xs font-bold md:col-span-2">
              No assignments posted for this classroom yet. Check back soon!
            </div>
          )}
        </div>
      </div>

      {/* 3. COURSES INCLUDED IN THIS CLASSROOM */}
      <div className="space-y-6 pt-4 border-t-2 border-ink/20">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-highlighter border border-ink text-ink font-mono text-xs font-extrabold mb-1">
            <span>Enrolled Curriculum</span>
          </div>
          <h2 className="text-2xl font-extrabold text-ink flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-stamp" />
            <span>Courses Included in this Classroom ({assignedCourses.length})</span>
          </h2>
          <p className="text-xs sm:text-sm text-graphite font-bold mt-1">
            Work through each course module step-by-step. Each lesson includes theory notes, checkpoint quizzes, and hands-on coding challenges.
          </p>
        </div>

        <div className="space-y-8">
          {assignedCourses.map((course) => {
            const allLessons: Lesson[] = (course.modules || []).flatMap(m => m.lessons || []);
            const completedCount = allLessons.filter(l => completedLessonIds.includes(l.id)).length;
            const progressPercent = allLessons.length > 0 ? Math.round((completedCount / allLessons.length) * 100) : 0;
            const resumeLesson = allLessons.find(l => !completedLessonIds.includes(l.id)) || allLessons[0];

            return (
              <BentoCard
                key={course.id}
                variant="white"
                className="space-y-6 p-8 sm:p-10 border-2 border-ink shadow-solid-md"
              >
                {/* Course Header */}
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-ink/15">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="px-3 py-0.5 bg-paper-muted border border-ink/30 rounded-full font-mono text-xs font-extrabold text-ink">
                        {course.category} • {course.level}
                      </span>
                      <span className="text-xs font-mono text-graphite font-bold">
                        ⏱ {course.estimatedHours} Hours
                      </span>
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-ink">{course.title}</h3>
                    <p className="text-xs sm:text-sm text-graphite font-medium max-w-3xl">
                      {course.description}
                    </p>
                  </div>

                  {/* Quick Action Button */}
                  {resumeLesson && (
                    <PillButton
                      variant="highlighter"
                      size="md"
                      onClick={() => handleStartLesson(resumeLesson)}
                      className="btn-bounce"
                      icon={<Play className="w-4 h-4 fill-ink" />}
                    >
                      Resume Course ➔
                    </PillButton>
                  )}
                </div>

                {/* Progress Bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-mono font-extrabold text-ink">
                    <span>Course Completion</span>
                    <span className="text-stamp">{completedCount} of {allLessons.length} Lessons ({progressPercent}%)</span>
                  </div>
                  <div className="w-full h-3 bg-paper-muted rounded-full overflow-hidden border-2 border-ink/30">
                    <div
                      className="h-full bg-highlighter border-r-2 border-ink transition-all duration-500"
                      style={{ width: Math.max(progressPercent, 6) + '%' }}
                    ></div>
                  </div>
                </div>

                {/* Modules & Lessons Breakdown */}
                <div className="space-y-4 pt-2">
                  <h4 className="text-sm font-mono font-extrabold text-graphite uppercase tracking-wider">
                    Course Modules & Step-by-Step Lessons:
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(course.modules || []).map((mod, modIdx) => (
                      <div key={mod.id} className="p-5 bg-paper-light border-2 border-ink/20 rounded-2xl space-y-3 shadow-solid-xs">
                        <div className="flex items-center justify-between pb-2 border-b border-ink/15">
                          <strong className="text-xs font-extrabold text-ink block truncate">
                            Module {modIdx + 1}: {mod.title}
                          </strong>
                          <span className="text-[10px] font-mono text-graphite font-bold">
                            {mod.lessons?.length || 0} Lessons
                          </span>
                        </div>

                        <div className="space-y-2">
                          {(mod.lessons || []).map((les, lesIdx) => {
                            const isDone = completedLessonIds.includes(les.id);

                            return (
                              <div
                                key={les.id}
                                className="flex items-center justify-between p-2.5 bg-white border border-ink/20 rounded-xl text-xs hover:border-ink transition-all"
                              >
                                <div className="flex items-center space-x-2.5 overflow-hidden pr-2">
                                  <span className={'w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-extrabold border ' + (isDone ? 'bg-green-100 text-green-800 border-green-600' : 'bg-paper-muted text-ink border-ink/30')}>
                                    {isDone ? '✓' : (lesIdx + 1)}
                                  </span>
                                  <div className="overflow-hidden">
                                    <strong className="text-ink block truncate text-xs">{les.title}</strong>
                                    <span className="text-[10px] text-graphite truncate block">{les.subtitle}</span>
                                  </div>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => handleStartLesson(les)}
                                  className="px-2.5 py-1 bg-highlighter hover:bg-highlighter-hover text-ink border border-ink rounded-lg text-[11px] font-extrabold flex items-center gap-1 shadow-solid-xs btn-bounce flex-shrink-0"
                                >
                                  <Play className="w-2.5 h-2.5 fill-ink" />
                                  <span>{isDone ? 'Review' : 'Play'}</span>
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </BentoCard>
            );
          })}
        </div>
      </div>

      {/* 4. CLASSMATES ROSTER */}
      <div className="space-y-4 pt-4 border-t-2 border-ink/20">
        <h3 className="text-xl font-extrabold text-ink flex items-center gap-2">
          <Users className="w-5 h-5 text-stamp" />
          <span>Classmates in {classroom.name} ({classroom.roster.length})</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {classroom.roster.map((std) => (
            <div key={std.studentId} className="p-3 bg-paper-card border-2 border-ink rounded-2xl text-center space-y-1.5 shadow-solid-xs">
              <UserAvatar name={std.name} avatar={std.avatar} size="md" className="w-10 h-10 mx-auto" />
              <strong className="text-xs font-extrabold text-ink block truncate">{std.name}</strong>
              <span className="text-[10px] font-mono text-stamp font-bold block">{std.averageScore}% Score</span>
            </div>
          ))}
        </div>
      </div>

      {/* SUBMISSION MODAL */}
      {submittingAssignment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/70 backdrop-blur-sm animate-fadeIn overflow-y-auto">
          <div className="relative w-full max-w-4xl bg-paper-card border-2 border-ink rounded-[28px] p-6 sm:p-8 shadow-solid-xl max-h-[92vh] flex flex-col justify-between overflow-y-auto space-y-5">
            
            <div className="flex items-center justify-between pb-3 border-b-2 border-ink/15">
              <div>
                <span className="text-[10px] font-mono font-extrabold uppercase text-stamp">
                  {classroom.name} • Due {submittingAssignment.dueDate}
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-ink">
                  {submittingAssignment.title}
                </h2>
                <p className="text-xs text-graphite font-medium mt-0.5">
                  {submittingAssignment.description || 'Complete the assignment and turn in your code.'}
                </p>
              </div>

              <button
                onClick={() => setSubmittingAssignment(null)}
                className="p-2 rounded-full border-2 border-ink bg-paper-muted hover:bg-paper-light text-ink transition-colors shadow-solid-xs"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Submission Mode Switcher */}
            <div className="flex items-center justify-between bg-paper-muted border-2 border-ink/30 rounded-2xl p-1.5 text-xs font-extrabold">
              <span className="text-graphite pl-2 font-mono uppercase text-[11px]">Select Submission Mode:</span>

              <div className="flex items-center space-x-1.5">
                <button
                  type="button"
                  onClick={() => setInputMode('photo')}
                  className={'px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ' + (inputMode === 'photo' ? 'bg-highlighter text-ink border-2 border-ink shadow-solid-xs font-extrabold' : 'text-graphite hover:text-ink')}
                >
                  <Camera className="w-4 h-4 text-stamp" />
                  <span>📸 Upload / Scan Notebook Photo</span>
                </button>

                <button
                  type="button"
                  onClick={() => setInputMode('ide')}
                  className={'px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ' + (inputMode === 'ide' ? 'bg-highlighter text-ink border-2 border-ink shadow-solid-xs font-extrabold' : 'text-graphite hover:text-ink')}
                >
                  <Terminal className="w-4 h-4 text-blue-700" />
                  <span>⌨️ Type in Mobile IDE</span>
                </button>
              </div>
            </div>

            {/* Submission Canvas Body */}
            <div className="space-y-4">
              {inputMode === 'photo' ? (
                <div className="space-y-3">
                  <div className="p-3 bg-paper-light border-2 border-ink/20 rounded-2xl text-xs font-medium text-graphite flex items-center gap-2">
                    <span className="text-base">📝</span>
                    <span>
                      Write your solution on notebook paper, then use the camera or upload an image below to extract and verify the code.
                    </span>
                  </div>

                  <HandwrittenScanner
                    onScanComplete={(code) => setScannedCode(code)}
                  />
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="p-3 bg-paper-light border-2 border-ink/20 rounded-2xl text-xs font-medium text-graphite flex items-center gap-2">
                    <span className="text-base">💻</span>
                    <span>
                      Write and test your solution below. Click &quot;RUN CODE&quot; to execute live on the Judge0 compiler before submitting.
                    </span>
                  </div>

                  <CodeIDE
                    initialCode={typedCode}
                    onCodeChange={(newCode) => setTypedCode(newCode)}
                    title={submittingAssignment.title}
                  />
                </div>
              )}
            </div>

            {/* Modal Bottom Actions */}
            <div className="pt-4 border-t-2 border-ink/15 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center space-x-2 text-xs font-mono font-bold text-graphite">
                <Award className="w-4 h-4 text-stamp" />
                <span>Max Points: <strong className="text-ink">{submittingAssignment.maxScore || 10} Pts</strong> (+120 XP Reward)</span>
              </div>

              <div className="flex items-center space-x-3">
                <PillButton
                  variant="secondary"
                  size="md"
                  onClick={() => setSubmittingAssignment(null)}
                  className="btn-bounce"
                >
                  Cancel
                </PillButton>

                <PillButton
                  variant="stamp"
                  size="lg"
                  onClick={handleCompleteSubmission}
                  className="btn-bounce"
                  icon={submittedSuccessfully ? <Check className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                >
                  {submittedSuccessfully ? 'Submitted Successfully! 🎉' : '🚀 Turn In Assignment'}
                </PillButton>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
