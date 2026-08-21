import React from 'react';
import { useApp } from '../../context/AppContext';
import { BentoCard } from '../common/BentoCard';
import { PillButton } from '../common/PillButton';
import { Course, Lesson } from '../../types';
import { BookOpen, KeyRound, Award, ArrowRight, Play, Sparkles } from 'lucide-react';

interface StudentDashboardProps {
  onOpenLesson: (lesson?: Lesson) => void;
  onOpenJoinModal: () => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  onOpenLesson,
  onOpenJoinModal
}) => {
  const { courses, completedLessonIds, setActiveLesson, enrollInCourse } = useApp();

  const getCourseResumeLesson = (course: Course): Lesson | null => {
    if (!course.modules || course.modules.length === 0) return null;
    const allCourseLessons: Lesson[] = course.modules.flatMap(m => m.lessons || []);
    if (allCourseLessons.length === 0) return null;
    const incomplete = allCourseLessons.find(l => !completedLessonIds.includes(l.id));
    return incomplete || allCourseLessons[0];
  };

  const getCourseProgress = (course: Course) => {
    if (!course.modules || course.modules.length === 0) return { completed: 0, total: 0, percent: 0 };
    const allCourseLessons: Lesson[] = course.modules.flatMap(m => m.lessons || []);
    const total = allCourseLessons.length;
    if (total === 0) return { completed: 0, total: 0, percent: 0 };
    const completed = allCourseLessons.filter(l => completedLessonIds.includes(l.id)).length;
    const percent = Math.round((completed / total) * 100);
    return { completed, total, percent };
  };

  const handleStartCourse = (course: Course) => {
    enrollInCourse(course.id);
    const resumeLesson = getCourseResumeLesson(course);
    if (resumeLesson) {
      setActiveLesson(resumeLesson);
      onOpenLesson(resumeLesson);
    }
  };

  return (
    <div className="space-y-8 py-2 max-w-7xl mx-auto">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-ink/15 pb-6">
        <div className="space-y-1">
          <div className="doodle-badge bg-highlighter text-ink">
            <Sparkles className="w-3.5 h-3.5 text-stamp" />
            <span>Student Learning Hub</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-ink">
            Free Coding Curriculum & Quests
          </h1>
          <p className="text-xs sm:text-sm text-graphite font-medium">
            All courses on PaperCode are 100% Free for every student in Bangladesh. Handwrite code on paper, scan with your phone, and earn XP.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <PillButton
            variant="secondary"
            size="md"
            onClick={onOpenJoinModal}
            className="btn-bounce shadow-solid-xs"
            icon={<KeyRound className="w-4 h-4 text-stamp" />}
          >
            + Join Class with Code
          </PillButton>
        </div>
      </div>

      {/* Courses Catalog (100% Free for Everyone) */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="font-mono text-xs font-extrabold uppercase text-ink tracking-wider">
            Available Free Courses ({courses.length})
          </div>
          <span className="text-xs font-mono font-bold text-green-700 bg-green-100 px-3 py-0.5 rounded-full border border-green-600">
            ✓ 100% Free Forever
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => {
            const { completed, total, percent } = getCourseProgress(course);
            const isStarted = completed > 0;

            return (
              <BentoCard
                key={course.id}
                variant="white"
                className="space-y-5 p-7 border-2 border-ink shadow-solid-md hover:shadow-solid-lg transition-all flex flex-col justify-between"
              >
                <div className="space-y-4">
                  
                  {/* Top tags */}
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 bg-paper-muted border border-ink/30 rounded-full font-mono text-[11px] font-bold text-ink">
                      {course.category} • {course.level}
                    </span>
                    <span className="font-mono text-xs font-extrabold text-green-700 bg-green-50 px-2 py-0.5 rounded border border-green-300">
                      ৳0 Free
                    </span>
                  </div>

                  {/* Course info */}
                  <div>
                    <h3 className="text-xl font-extrabold text-ink leading-snug">{course.title}</h3>
                    <p className="text-xs text-graphite mt-1.5 leading-relaxed line-clamp-2">
                      {course.description}
                    </p>
                  </div>

                  {/* Progress or Lesson Count */}
                  {isStarted ? (
                    <div className="space-y-1.5 pt-1">
                      <div className="flex justify-between text-xs font-bold font-mono text-ink">
                        <span>Progress</span>
                        <span className="text-stamp font-extrabold">{percent}% ({completed}/{total})</span>
                      </div>
                      <div className="w-full h-2.5 bg-paper-muted rounded-full overflow-hidden border border-ink/30">
                        <div 
                          className="h-full bg-highlighter border-r border-ink transition-all duration-500"
                          style={{ width: percent + '%' }}
                        ></div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 bg-paper-light border border-ink/20 rounded-xl flex items-center justify-between text-xs font-mono font-bold text-graphite">
                      <span>{(course.modules?.[0]?.lessons?.length || 1)} Lessons • Free</span>
                      <span className="text-stamp font-extrabold">💎 +150 XP</span>
                    </div>
                  )}

                </div>

                {/* Start / Resume Action Button */}
                <div className="pt-4 border-t border-ink/15 flex items-center justify-between">
                  <span className="text-[11px] font-mono font-bold text-graphite">
                    {(course?.language || 'python').toUpperCase()} Track
                  </span>

                  <PillButton
                    variant={isStarted ? "highlighter" : "primary"}
                    size="md"
                    onClick={() => handleStartCourse(course)}
                    className="btn-bounce shadow-solid-xs"
                    icon={<Play className="w-3.5 h-3.5 fill-current" />}
                  >
                    {isStarted ? 'Resume Course ➔' : 'Start Learning Free ➔'}
                  </PillButton>
                </div>

              </BentoCard>
            );
          })}
        </div>
      </div>

    </div>
  );
};
