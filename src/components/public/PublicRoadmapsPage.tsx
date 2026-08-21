import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BentoCard } from '../common/BentoCard';
import { PillButton } from '../common/PillButton';
import { 
  Map, 
  BookOpen, 
  Award, 
  Users, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2,
  Clock,
  Layers,
  GraduationCap,
  Search
} from 'lucide-react';

interface PublicRoadmapsPageProps {
  onOpenAuth: (tab: 'login' | 'signup') => void;
}

export const PublicRoadmapsPage: React.FC<PublicRoadmapsPageProps> = ({ onOpenAuth }) => {
  const { roadmaps } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRoadmaps = roadmaps.filter(r => 
    (r?.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (r?.description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (r?.targetAudience || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-12 animate-fadeIn pb-16">
      
      {/* Header Banner */}
      <div className="text-center space-y-4 max-w-3xl mx-auto pt-4">
        <div className="doodle-badge bg-highlighter text-ink">
          <Map className="w-4 h-4 text-stamp" />
          <span>Curriculum Roadmaps</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-ink tracking-tight">
          Explore Learning Roadmaps
        </h1>
        <p className="text-graphite text-base sm:text-lg">
          Zero computer lab needed. Pick a structured track aligned with Bangladesh national textbooks, board exams, and Olympiads.
        </p>

        {/* Search Input */}
        <div className="max-w-md mx-auto relative pt-2">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search roadmaps by keyword (e.g. ICT, C++, SSC)..."
            className="w-full pl-10 pr-4 py-3 rounded-2xl border-2 border-ink bg-paper-card text-sm font-bold shadow-solid-xs focus:outline-none focus:ring-2 focus:ring-highlighter"
          />
          <Search className="w-4 h-4 text-graphite absolute left-3.5 top-5.5" />
        </div>
      </div>

      {/* Roadmaps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {filteredRoadmaps.map((roadmap) => (
          <BentoCard 
            key={roadmap.id} 
            variant="white" 
            className="p-6 sm:p-8 border-2 border-ink flex flex-col justify-between space-y-6 hover:shadow-solid-lg transition-all"
          >
            <div className="space-y-4">
              
              {/* Badge */}
              <div className="p-3 bg-highlighter/30 border-2 border-ink rounded-2xl flex items-center justify-between">
                <span className="font-mono text-xs font-extrabold text-ink">{roadmap.badge}</span>
                <Sparkles className="w-4 h-4 text-stamp" />
              </div>

              {/* Title & Target */}
              <div className="space-y-1.5">
                <h2 className="text-2xl font-extrabold text-ink leading-snug">
                  {roadmap.title}
                </h2>
                <span className="text-xs font-bold text-stamp block">
                  🎯 {roadmap.targetAudience}
                </span>
              </div>

              <p className="text-xs text-graphite leading-relaxed">
                {roadmap.description}
              </p>

              {/* Metrics */}
              <div className="grid grid-cols-3 gap-2 pt-2 text-center text-xs font-mono font-bold text-ink">
                <div className="p-2 bg-paper-muted rounded-xl border border-ink/20">
                  <span className="text-[10px] text-graphite block uppercase">Courses</span>
                  <strong>{roadmap.courses.length}</strong>
                </div>
                <div className="p-2 bg-paper-muted rounded-xl border border-ink/20">
                  <span className="text-[10px] text-graphite block uppercase">Total XP</span>
                  <strong>{roadmap.totalXp}</strong>
                </div>
                <div className="p-2 bg-paper-muted rounded-xl border border-ink/20">
                  <span className="text-[10px] text-graphite block uppercase">Students</span>
                  <strong>{(roadmap?.enrolledCount ?? 0).toLocaleString()}</strong>
                </div>
              </div>

              {/* Courses included */}
              <div className="pt-2 space-y-2">
                <span className="text-[11px] font-mono font-extrabold text-graphite uppercase block">
                  Syllabus Tracks Included:
                </span>
                <div className="space-y-1.5">
                  {roadmap.courses.map((crs, i) => (
                    <div key={i} className="flex items-center space-x-2 text-xs font-bold text-ink bg-paper-light p-2.5 rounded-xl border border-ink/20">
                      <BookOpen className="w-4 h-4 text-stamp flex-shrink-0" />
                      <span className="truncate">{crs.title}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Enroll CTA */}
            <div className="pt-4 border-t border-ink/15 space-y-2">
              <PillButton
                variant="primary"
                size="md"
                onClick={() => onOpenAuth('signup')}
                className="w-full justify-center btn-bounce shadow-solid-xs"
                icon={<GraduationCap className="w-4 h-4" />}
              >
                Sign Up & Enroll Free ➔
              </PillButton>
              <span className="text-[10px] font-mono text-center block text-graphite">
                Free for all students in Bangladesh
              </span>
            </div>

          </BentoCard>
        ))}
      </div>

    </div>
  );
};
