import React from 'react';
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
  GraduationCap
} from 'lucide-react';

interface PublicRoadmapsSectionProps {
  onOpenAuth: (tab: 'login' | 'signup') => void;
}

export const PublicRoadmapsSection: React.FC<PublicRoadmapsSectionProps> = ({ onOpenAuth }) => {
  const { roadmaps } = useApp();

  return (
    <section id="public-roadmaps" className="py-16 px-4 max-w-7xl mx-auto border-t border-ink/15 space-y-12">
      
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="doodle-badge bg-highlighter text-ink">
          <Map className="w-4 h-4 text-stamp" />
          <span>Curated Learning Tracks</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-ink tracking-tight">
          National Curriculum & Olympiad Roadmaps
        </h2>
        <p className="text-graphite text-base sm:text-lg">
          Zero prior computer experience required. Follow structured paper-first roadmaps designed for Bangladeshi secondary and higher secondary students.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {roadmaps.map((roadmap) => (
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
                <h3 className="text-2xl font-extrabold text-ink leading-snug">
                  {roadmap.title}
                </h3>
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
                  Included Courses:
                </span>
                <div className="space-y-1.5">
                  {roadmap.courses.map((crs, i) => (
                    <div key={i} className="flex items-center space-x-2 text-xs font-bold text-ink bg-paper-light p-2 rounded-lg border border-ink/20">
                      <BookOpen className="w-3.5 h-3.5 text-stamp flex-shrink-0" />
                      <span className="truncate">{crs.title}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Enroll CTA */}
            <div className="pt-4 border-t border-ink/15">
              <PillButton
                variant="primary"
                size="md"
                onClick={() => onOpenAuth('signup')}
                className="w-full justify-center btn-bounce shadow-solid-xs"
                icon={<GraduationCap className="w-4 h-4" />}
              >
                Sign Up & Enroll Free ➔
              </PillButton>
            </div>

          </BentoCard>
        ))}
      </div>

    </section>
  );
};
