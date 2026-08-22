import React from 'react';
import { BentoCard } from '../common/BentoCard';
import { BarcodeStub } from '../common/BarcodeStub';
import { UserAvatar } from '../common/UserAvatar';

export const TeamHeritage: React.FC = () => {
  const founders = [
    {
      name: 'Redwan Ahmed',
      role: 'Co-Founder & Tech Lead',
      affiliation: 'CUET CSE Alum',
      bio: 'Competitive programmer and researcher in low-resource OCR and AST compilation pipelines for mobile.'
    },
    {
      name: 'Nusrat Jahan',
      role: 'Co-Founder & Curriculum Lead',
      affiliation: 'CUET EEE & EdTech Researcher',
      bio: 'Specialist in Bangladesh National Curriculum (NCTB) and pedagogical design for rural classrooms.'
    },
    {
      name: 'Dr. Rafiqul Islam',
      role: 'Advisor & Research Director',
      affiliation: 'Senior Faculty, CUET',
      bio: '20+ years researching ICT education accessibility and decentralized digital divide solutions.'
    }
  ];

  return (
    <section id="founders" className="py-16 px-4 max-w-7xl mx-auto border-t border-ink/15">
      
      <div className="text-center space-y-3 mb-12">
        <span className="text-xs font-mono uppercase tracking-wider text-stamp font-bold">
          Origin & Heritage
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-ink tracking-tight">
          Built with pride at CUET, Chittagong.
        </h2>
        <p className="text-graphite text-base max-w-2xl mx-auto">
          Born out of university tutoring camps where we witnessed brilliant students with notebooks who had never touched a computer keyboard.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {founders.map((f, i) => (
          <BentoCard key={i} variant="white" className="space-y-4">
            <div className="flex items-center space-x-3">
              <UserAvatar name={f.name} size="lg" className="w-14 h-14 text-xl" />
              <div>
                <h3 className="font-extrabold text-lg text-ink">{f.name}</h3>
                <span className="text-xs font-bold text-stamp block">{f.role}</span>
                <span className="text-[11px] font-mono text-graphite">{f.affiliation}</span>
              </div>
            </div>
            <p className="text-xs text-graphite leading-relaxed">
              {f.bio}
            </p>
            <BarcodeStub label="CUET-ENG" time="CHITTAGONG" />
          </BentoCard>
        ))}
      </div>

    </section>
  );
};
