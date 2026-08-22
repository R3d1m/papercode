import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Course } from '../../types';
import { BentoCard } from '../common/BentoCard';
import { PillButton } from '../common/PillButton';
import { 
  BookOpen, 
  Clock, 
  Layers, 
  Sparkles, 
  Award, 
  CheckCircle2, 
  User,
  GraduationCap,
  Search
} from 'lucide-react';

interface PublicCoursesPageProps {
  onOpenAuth: (tab: 'login' | 'signup') => void;
  onOpenCourseDetail?: (course: Course) => void;
}

export const PublicCoursesPage: React.FC<PublicCoursesPageProps> = ({ onOpenAuth, onOpenCourseDetail }) => {
  const { courses } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCourses = courses.filter(c => 
    (c?.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c?.subtitle || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c?.category || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-12 animate-fadeIn pb-16">
      
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto pt-4">
        <div className="doodle-badge bg-paper-muted text-ink">
          <BookOpen className="w-4 h-4 text-stamp" />
          <span>Courses Catalog</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-ink tracking-tight">
          Explore Existing Courses
        </h1>
        <p className="text-graphite text-base sm:text-lg">
          Interactive handwritten programming modules with theory notes, quizzes, and automated test-case grading.
        </p>

        {/* Search */}
        <div className="max-w-md mx-auto pt-2">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-graphite absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search courses (e.g. Python, C, Algorithms)..."
              className="w-full pl-10 pr-4 py-3 rounded-2xl border-2 border-ink bg-paper-card text-sm font-bold shadow-solid-xs focus:outline-none focus:ring-2 focus:ring-highlighter"
            />
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {filteredCourses.map((course) => (
          <BentoCard 
            key={course.id} 
            variant="white" 
            onClick={() => onOpenCourseDetail ? onOpenCourseDetail(course) : onOpenAuth('signup')}
            className="p-6 sm:p-8 border-2 border-ink flex flex-col justify-between space-y-6 hover:shadow-solid-lg transition-all cursor-pointer"
          >
            <div className="space-y-4">
              
              {/* Category & Level Pills */}
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 bg-highlighter border border-ink rounded-full text-xs font-extrabold text-ink">
                  {course.category}
                </span>
                <span className="text-xs font-mono font-bold text-graphite">
                  {course.level}
                </span>
              </div>

              {/* Course Title */}
              <div className="space-y-1">
                <h2 className="text-2xl font-extrabold text-ink leading-snug">
                  {course.title}
                </h2>
                {course.subtitle && course.subtitle.trim() !== course.description?.trim() && (
                  <p className="text-xs text-stamp font-bold">
                    {course.subtitle}
                  </p>
                )}
              </div>

              {course.description && (
                <p className="text-xs text-graphite leading-relaxed">
                  {course.description}
                </p>
              )}

              {/* Course Stats */}
              <div className="grid grid-cols-2 gap-2 text-xs font-mono font-bold text-ink">
                <div className="p-2.5 bg-paper-muted rounded-xl border border-ink/20 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-stamp" />
                  <span>{course.estimatedHours} Hours</span>
                </div>
                <div className="p-2.5 bg-paper-muted rounded-xl border border-ink/20 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-ink" />
                  <span>{course.modules?.length || 1} Modules</span>
                </div>
              </div>

              {/* Module Previews */}
              <div className="space-y-2 pt-2">
                <span className="text-[11px] font-mono font-extrabold text-graphite uppercase block">
                  Course Modules & Lessons:
                </span>
                <div className="space-y-1.5">
                  {(course.modules || []).map((mod, i) => (
                    <div key={i} className="p-2.5 bg-paper-light rounded-xl border border-ink/20 text-xs font-bold text-ink flex items-center justify-between">
                      <div className="flex items-center space-x-2 truncate">
                        <span className="w-5 h-5 rounded-full bg-highlighter border border-ink flex items-center justify-center text-[10px]">
                          {i + 1}
                        </span>
                        <span className="truncate">{mod.title}</span>
                      </div>
                      <span className="text-[10px] font-mono text-graphite flex-shrink-0 pl-2">
                        {mod.lessons?.length || 0} lessons
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Author */}
              <div className="pt-2 flex items-center space-x-2 text-xs text-graphite font-bold">
                <User className="w-3.5 h-3.5 text-stamp" />
                <span>Curated by {course.authorName}</span>
              </div>

            </div>

            {/* Action CTA */}
            <div className="pt-4 border-t border-ink/15 space-y-2">
              <PillButton
                variant="stamp"
                size="md"
                onClick={() => onOpenAuth('signup')}
                className="w-full justify-center btn-bounce shadow-solid-xs"
                icon={<GraduationCap className="w-4 h-4" />}
              >
                Start Learning Free ➔
              </PillButton>
              <span className="text-[10px] font-mono text-center block text-graphite">
                Includes full cloud compiler sandbox
              </span>
            </div>

          </BentoCard>
        ))}
      </div>

    </div>
  );
};
