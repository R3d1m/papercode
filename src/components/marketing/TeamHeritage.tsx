import React from 'react';
import { BentoCard } from '../common/BentoCard';
import { BarcodeStub } from '../common/BarcodeStub';

export const TeamHeritage: React.FC = () => {
  const founders = [
    {
      name: 'Redwan Ahmed',
      role: 'Co-Founder & Tech Lead',
      affiliation: 'CUET CSE Alum',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
      bio: 'Competitive programmer and researcher in low-resource OCR and AST compilation pipelines for mobile.'
    },
    {
      name: 'Nusrat Jahan',
      role: 'Co-Founder & Curriculum Lead',
      affiliation: 'CUET EEE & EdTech Researcher',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200',
      bio: 'Specialist in Bangladesh National Curriculum (NCTB) and pedagogical design for rural classrooms.'
    },
    {
      name: 'Dr. Rafiqul Islam',
      role: 'Advisor & Research Director',
      affiliation: 'Senior Faculty, CUET',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
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
              <img src={f.avatar} alt={f.name} className="w-14 h-14 rounded-full border border-ink object-cover" />
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
