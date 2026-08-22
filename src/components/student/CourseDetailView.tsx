import React from 'react';
import { useApp } from '../../context/AppContext';
import { Course, Lesson } from '../../types';
import { BentoCard } from '../common/BentoCard';
import { PillButton } from '../common/PillButton';
import { 
  ArrowLeft, 
  Play, 
  CheckCircle2, 
  BookOpen, 
  Clock, 
  Layers, 
  Award, 
  Sparkles,
  ChevronRight
} from 'lucide-react';

interface CourseDetailViewProps {
  course: Course;
  onBack: () => void;
  onOpenLesson: (lesson?: Lesson) => void;
}

export const CourseDetailView: React.FC<CourseDetailViewProps> = ({
  course,
  onBack,
  onOpenLesson
}) => {
  const { completedLessonIds, setActiveLesson, enrollInCourse } = useApp();

  const allCourseLessons: Lesson[] = (course.modules || []).flatMap(m => m.lessons || []);
  const totalLessons = allCourseLessons.length;
  const completedCount = allCourseLessons.filter(l => completedLessonIds.includes(l.id)).length;
  const percent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  // Find first incomplete lesson or default to first lesson
  const nextLessonToPlay = allCourseLessons.find(l => !completedLessonIds.includes(l.id)) || allCourseLessons[0];

  const handleResumeOrStart = () => {
    if (!nextLessonToPlay) return;
    enrollInCourse(course.id);
    setActiveLesson(nextLessonToPlay);
    onOpenLesson(nextLessonToPlay);
  };

  const handlePlaySpecificLesson = (lesson: Lesson) => {
    enrollInCourse(course.id);
    setActiveLesson(lesson);
    onOpenLesson(lesson);
  };

  return (
    <div className="space-y-8 py-2 max-w-5xl mx-auto w-full animate-fadeIn pb-16">
      
      {/* Back Button */}
      <div>
        <button
          onClick={onBack}
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-full border-2 border-ink bg-paper-card text-ink font-mono text-xs font-extrabold hover:bg-paper-muted transition-colors shadow-solid-xs btn-bounce cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-stamp stroke-[2.5]" />
          <span>Back to All Courses</span>
        </button>
      </div>

      {/* TOP HERO HEADER */}
      <div className="p-6 sm:p-10 bg-paper-card border-2 border-ink rounded-[28px] shadow-solid-md space-y-6">
        
        {/* Pills: Language • Level • Estimated Hours */}
        <div className="flex items-center gap-2 flex-wrap text-xs font-mono font-extrabold">
          <span className="px-3 py-1 bg-paper-muted border border-ink/40 rounded-full text-ink">
            {(course.language || 'Python').toUpperCase()} Programming
          </span>
          <span className="px-3 py-1 bg-paper-muted border border-ink/40 rounded-full text-ink">
            {course.level || 'Beginner'}
          </span>
          <span className="px-3 py-1 bg-paper-muted border border-ink/40 rounded-full text-graphite flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-stamp" />
            <span>{course.estimatedHours || 12} Hours</span>
          </span>
          <span className="px-3 py-1 bg-green-100 border border-green-600 rounded-full text-green-900 font-bold">
            ✓ 100% Free Forever
          </span>
        </div>

        {/* Title, Description & Action Button */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-ink tracking-tight leading-tight">
              {course.title}
            </h1>
            <p className="text-sm sm:text-base text-graphite font-medium leading-relaxed">
              {course.description || course.subtitle || 'Master coding fundamentals with hands-on handwriting exercises, automated test cases, and instant feedback.'}
            </p>
          </div>

          <div className="flex-shrink-0">
            <PillButton
              variant="highlighter"
              size="lg"
              onClick={handleResumeOrStart}
              className="btn-bounce shadow-solid-md text-base"
              icon={<Play className="w-4 h-4 fill-ink" />}
            >
              {completedCount > 0 ? 'Resume Course ➔' : 'Start Course ➔'}
            </PillButton>
          </div>
        </div>

        {/* Course Completion Progress Bar */}
        <div className="pt-6 border-t-2 border-ink/15 space-y-2">
          <div className="flex items-center justify-between text-xs sm:text-sm font-mono font-extrabold text-ink">
            <span className="uppercase tracking-wider">Course Completion</span>
            <span className="text-stamp">
              {completedCount} of {totalLessons} Lessons ({percent}%)
            </span>
          </div>

          <div className="w-full h-3.5 bg-paper-muted rounded-full overflow-hidden border-2 border-ink">
            <div
              className="h-full bg-highlighter border-r-2 border-ink transition-all duration-500"
              style={{ width: percent + '%' }}
            />
          </div>
        </div>

      </div>

      {/* COURSE MODULES & STEP-BY-STEP LESSONS */}
      <div className="space-y-6">
        <h2 className="font-mono text-xs font-extrabold uppercase text-ink tracking-widest pl-1">
          COURSE MODULES &amp; STEP-BY-STEP LESSONS:
        </h2>

        {(course.modules || []).map((module, mIdx) => (
          <div
            key={module.id}
            className="p-6 sm:p-8 bg-paper-card border-2 border-ink rounded-[24px] shadow-solid-md space-y-6"
          >
            {/* Module Title */}
            <div className="flex items-center justify-between border-b-2 border-ink/15 pb-4">
              <div>
                <h3 className="text-lg sm:text-xl font-extrabold text-ink">
                  Module {mIdx + 1}: {module.title}
                </h3>
                {module.description && (
                  <p className="text-xs text-graphite mt-0.5 font-medium">
                    {module.description}
                  </p>
                )}
              </div>
              <span className="px-3 py-1 bg-paper-muted border border-ink/30 rounded-full font-mono text-xs font-extrabold text-graphite">
                {module.lessons?.length || 0} Lessons
              </span>
            </div>

            {/* Lessons List inside this module */}
            <div className="space-y-3">
              {(module.lessons || []).map((lesson, lIdx) => {
                const isCompleted = completedLessonIds.includes(lesson.id);

                return (
                  <div
                    key={lesson.id}
                    className={'p-4 sm:p-5 rounded-2xl border-2 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ' +
                      (isCompleted 
                        ? 'bg-paper-light border-ink/30 hover:border-ink shadow-solid-xs' 
                        : 'bg-white border-ink shadow-solid-xs hover:shadow-solid-sm')}
                  >
                    {/* Left: Number or Checkmark + Title & Subtitle */}
                    <div className="flex items-start space-x-3.5">
                      <div className="pt-0.5">
                        {isCompleted ? (
                          <div className="w-8 h-8 rounded-full bg-green-100 border-2 border-green-700 flex items-center justify-center text-green-700 shadow-solid-xs">
                            <CheckCircle2 className="w-4 h-4 stroke-[3]" />
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-paper-muted border-2 border-ink flex items-center justify-center font-mono font-extrabold text-xs text-ink shadow-solid-xs">
                            {lIdx + 1}
                          </div>
                        )}
                      </div>

                      <div className="space-y-0.5">
                        <h4 className="text-sm sm:text-base font-extrabold text-ink leading-snug">
                          {lesson.title}
                        </h4>
                        <p className="text-xs text-graphite font-medium">
                          {lesson.conceptNotes?.[0] || 'Lesson subtitle and interactive handwriting exercises.'}
                        </p>
                      </div>
                    </div>

                    {/* Right: Review / Play Button */}
                    <div className="flex items-center space-x-2 flex-shrink-0 self-end sm:self-auto">
                      <button
                        onClick={() => handlePlaySpecificLesson(lesson)}
                        className={'px-4 py-2 rounded-xl font-mono text-xs font-extrabold border-2 border-ink flex items-center gap-1.5 transition-all btn-bounce shadow-solid-xs cursor-pointer ' +
                          (isCompleted 
                            ? 'bg-highlighter hover:bg-highlighter-hover text-ink' 
                            : 'bg-highlighter hover:bg-highlighter-hover text-ink')}
                      >
                        <Play className="w-3.5 h-3.5 fill-ink" />
                        <span>{isCompleted ? 'Review' : 'Play'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
