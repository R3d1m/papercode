import React from 'react';
import { useApp } from '../../context/AppContext';
import { BentoCard } from '../common/BentoCard';
import { PillButton } from '../common/PillButton';
import { Course, Lesson } from '../../types';
import { BookOpen, Users, Clock, Layers, Play, ShieldCheck, ArrowRight, Award } from 'lucide-react';
import confetti from 'canvas-confetti';

interface StudentRoadmapsViewProps {
  onOpenLesson: (lesson?: Lesson) => void;
}

export const StudentRoadmapsView: React.FC<StudentRoadmapsViewProps> = ({ onOpenLesson }) => {
  const { roadmaps, courses, completedLessonIds, setActiveLesson } = useApp();

  const handleStartRoadmapCourse = (course: Course) => {
    const allLessons: Lesson[] = (course.modules || []).flatMap(m => m.lessons || []);
    const resumeLesson = allLessons.find(l => !completedLessonIds.includes(l.id)) || allLessons[0];

    if (resumeLesson) {
      setActiveLesson(resumeLesson);
      onOpenLesson(resumeLesson);
      confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
    }
  };

  return (
    <div className="space-y-10 py-4 max-w-7xl mx-auto">
      
      {/* Header Banner */}
      <div className="p-8 bg-paper-card border-[2px] border-ink rounded-bento shadow-solid-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-highlighter border border-ink text-ink font-mono text-xs font-extrabold mb-2">
            <span>Verified Learning Tracks</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-ink">
            Public Roadmaps & Certifications
          </h1>
          <p className="text-xs sm:text-sm text-graphite mt-1">
            Structured career and exam tracks aligned with the Bangladesh National ICT Curriculum and National Olympiad standards.
          </p>
        </div>

        <div className="p-4 bg-paper-muted border border-ink/30 rounded-2xl flex items-center space-x-3">
          <Award className="w-6 h-6 text-stamp" />
          <div>
            <span className="text-[10px] text-graphite uppercase font-mono font-bold block">Available Tracks</span>
            <strong className="text-base font-extrabold text-ink">{roadmaps.length} Verified Tracks</strong>
          </div>
        </div>
      </div>

      {/* Roadmaps Grid */}
      <div className="space-y-10">
        {roadmaps.map((rdm) => {
          const containedCourses: Course[] = (rdm.courses && rdm.courses.length > 0) ? rdm.courses : courses.slice(0, 2);

          return (
            <BentoCard
              key={rdm.id}
              variant="white"
              className="space-y-6 p-8 sm:p-10 border-2 border-ink shadow-solid-md"
            >
              {/* Top Meta info */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-ink/15">
                <div className="flex items-center space-x-3">
                  <span className="px-3.5 py-1 bg-highlighter border border-ink text-ink rounded-full font-mono text-xs font-extrabold shadow-solid-xs">
                    {rdm.badge}
                  </span>
                  <span className="text-xs text-graphite font-bold">
                    Target: <strong className="text-ink">{rdm.targetAudience}</strong>
                  </span>
                </div>

                <div className="flex items-center space-x-4">
                  <span className="font-mono text-xs font-bold text-graphite flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-stamp" />
                    <span>{rdm.enrolledCount.toLocaleString()} Students Enrolled</span>
                  </span>
                  <span className="font-mono text-xs font-extrabold text-stamp">
                    💎 {rdm.totalXp.toLocaleString()} XP
                  </span>
                </div>
              </div>

              {/* Title & Description */}
              <div className="space-y-2">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-ink">{rdm.title}</h2>
                <p className="text-sm text-graphite leading-relaxed max-w-4xl">
                  {rdm.description}
                </p>
              </div>

              {/* CONTAINED COURSES SECTION */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-base sm:text-lg font-extrabold text-ink flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-stamp" />
                    <span>Courses Contained in this Roadmap ({containedCourses.length}):</span>
                  </h3>
                  <span className="text-xs font-mono text-graphite font-bold">Sequential Track</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {containedCourses.map((course, idx) => {
                    const totalLessons = (course.modules || []).flatMap(m => m.lessons || []).length;
                    const totalModules = (course.modules || []).length;

                    return (
                      <div
                        key={course.id}
                        className="p-5 bg-paper-light border-2 border-ink/30 rounded-2xl flex flex-col justify-between space-y-4 hover:border-ink transition-all shadow-solid-xs"
                      >
                        <div className="space-y-2.5">
                          <div className="flex items-center justify-between">
                            <span className="px-2.5 py-0.5 bg-paper-card border border-ink/30 rounded-full font-mono text-[10px] font-bold text-ink">
                              Course {idx + 1} • {course.category}
                            </span>
                            <span className="font-mono text-[11px] font-extrabold text-graphite">
                              {course.level}
                            </span>
                          </div>

                          <div>
                            <h4 className="text-base sm:text-lg font-extrabold text-ink">{course.title}</h4>
                            <p className="text-xs text-graphite mt-1 line-clamp-2 leading-relaxed">
                              {course.description}
                            </p>
                          </div>

                          <div className="flex items-center space-x-3 text-[11px] font-mono text-graphite pt-1">
                            <span className="flex items-center gap-1">
                              <Layers className="w-3.5 h-3.5 text-stamp" />
                              <span>{totalModules} Modules</span>
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <BookOpen className="w-3.5 h-3.5 text-ink" />
                              <span>{totalLessons} Lessons</span>
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-gray-500" />
                              <span>{course.estimatedHours} hrs</span>
                            </span>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-ink/15 flex items-center justify-between">
                          <span className="text-[10px] font-mono font-bold text-stamp">
                            Smartphone OCR + Judge0
                          </span>

                          <button
                            type="button"
                            onClick={() => handleStartRoadmapCourse(course)}
                            className="px-3.5 py-1.5 bg-highlighter hover:bg-highlighter-hover text-ink border border-ink rounded-full text-xs font-extrabold flex items-center gap-1.5 shadow-solid-xs btn-bounce"
                          >
                            <Play className="w-3 h-3 fill-ink" />
                            <span>Start Course ➔</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Certificate */}
              <div className="p-4 bg-paper-muted border border-ink/20 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
                <div className="flex items-center space-x-3">
                  <ShieldCheck className="w-6 h-6 text-green-700 flex-shrink-0" />
                  <div>
                    <strong className="text-ink block">Verified CUET EdTech Foundation Certificate</strong>
                    <span className="text-graphite">Awarded upon completing all handwritten exercises in this roadmap.</span>
                  </div>
                </div>

                <PillButton
                  variant="stamp"
                  size="md"
                  onClick={() => handleStartRoadmapCourse(containedCourses[0])}
                  className="btn-bounce flex-shrink-0"
                  icon={<ArrowRight className="w-4 h-4" />}
                >
                  Start Entire Roadmap ➔
                </PillButton>
              </div>

            </BentoCard>
          );
        })}
      </div>

    </div>
  );
};
