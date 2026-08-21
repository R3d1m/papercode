import React from 'react';
import { CostCalculator } from '../marketing/CostCalculator';
import { BentoCard } from '../common/BentoCard';
import { PillButton } from '../common/PillButton';
import { CheckCircle2, Calculator, ShieldCheck, Sparkles, Building2, GraduationCap } from 'lucide-react';

interface PublicPricingPageProps {
  onOpenAuth: (tab: 'login' | 'signup') => void;
}

export const PublicPricingPage: React.FC<PublicPricingPageProps> = ({ onOpenAuth }) => {
  return (
    <div className="space-y-12 animate-fadeIn pb-16">
      
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto pt-4">
        <div className="doodle-badge bg-highlighter text-ink">
          <Calculator className="w-4 h-4 text-stamp" />
          <span>Pricing & School ROI</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-ink tracking-tight">
          100% Free for Students. 90% Cheaper for Schools.
        </h1>
        <p className="text-graphite text-base sm:text-lg">
          Instead of building a ৳20 Lakh computer lab with recurring electricity and repair costs, empower your school with PaperCode.
        </p>
      </div>

      {/* Main Pricing Calculator Component */}
      <CostCalculator onOpenAuth={onOpenAuth} />

      {/* Plan Comparison Bento */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Student Tier */}
        <BentoCard variant="white" className="p-8 border-2 border-ink space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="inline-block px-3 py-1 bg-highlighter border border-ink rounded-full text-xs font-extrabold text-ink">
              STUDENT TIER
            </div>
            <h3 className="text-3xl font-extrabold text-ink">৳0 <span className="text-xs font-mono text-graphite font-normal">/ forever</span></h3>
            <p className="text-xs text-graphite leading-relaxed">
              For any school or college student in Bangladesh learning to code with pen and paper.
            </p>
            <ul className="space-y-2 text-xs font-bold text-ink">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-700" />
                <span>Unlimited paper handwritten scans</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-700" />
                <span>All NCTB & Olympiad Roadmaps</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-700" />
                <span>Cloud Code Execution & Sandboxes</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-700" />
                <span>Gamified XP & Streak Badges</span>
              </li>
            </ul>
          </div>

          <PillButton
            variant="primary"
            size="md"
            onClick={() => onOpenAuth('signup')}
            className="w-full justify-center btn-bounce shadow-solid-xs"
            icon={<GraduationCap className="w-4 h-4" />}
          >
            Sign Up as Student (Free) ➔
          </PillButton>
        </BentoCard>

        {/* Teacher & Classroom Tier */}
        <BentoCard variant="white" className="p-8 border-2 border-ink space-y-6 flex flex-col justify-between bg-highlighter/10">
          <div className="space-y-4">
            <div className="inline-block px-3 py-1 bg-stamp text-white rounded-full text-xs font-extrabold">
              TEACHER TIER
            </div>
            <h3 className="text-3xl font-extrabold text-ink">৳0 <span className="text-xs font-mono text-graphite font-normal">/ free pilot</span></h3>
            <p className="text-xs text-graphite leading-relaxed">
              For ICT teachers and computer instructors managing classroom homework and exam grading.
            </p>
            <ul className="space-y-2 text-xs font-bold text-ink">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-700" />
                <span>Create unlimited classrooms & join codes</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-700" />
                <span>Batch OCR paper grading suite</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-700" />
                <span>Course Builder & Custom Rubrics</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-700" />
                <span>Excel gradebook & analytics export</span>
              </li>
            </ul>
          </div>

          <PillButton
            variant="stamp"
            size="md"
            onClick={() => onOpenAuth('signup')}
            className="w-full justify-center btn-bounce shadow-solid-xs"
            icon={<Building2 className="w-4 h-4" />}
          >
            Sign Up as Teacher ➔
          </PillButton>
        </BentoCard>

        {/* Institutional & NGO Tier */}
        <BentoCard variant="kraft" className="p-8 border-2 border-ink space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="inline-block px-3 py-1 bg-paper-card border border-ink rounded-full text-xs font-extrabold text-ink">
              INSTITUTIONAL & NGO
            </div>
            <h3 className="text-3xl font-extrabold text-ink">৳15 <span className="text-xs font-mono text-graphite font-normal">/ student / month</span></h3>
            <p className="text-xs text-graphite leading-relaxed">
              For district education offices, BRAC, UNESCO, and multi-branch school networks.
            </p>
            <ul className="space-y-2 text-xs font-bold text-ink">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-700" />
                <span>Multi-school district admin portal</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-700" />
                <span>Custom NCTB syllabus curation & moderation</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-700" />
                <span>Dedicated on-site teacher training by CUET team</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-700" />
                <span>Offline local cache servers for remote areas</span>
              </li>
            </ul>
          </div>

          <PillButton
            variant="secondary"
            size="md"
            onClick={() => onOpenAuth('signup')}
            className="w-full justify-center btn-bounce shadow-solid-xs"
          >
            Contact for School Pilot ➔
          </PillButton>
        </BentoCard>

      </div>

    </div>
  );
};
