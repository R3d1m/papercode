import React, { useState } from 'react';
import { BentoCard } from '../common/BentoCard';
import { PillButton } from '../common/PillButton';
import { 
  Play, 
  Video, 
  Sparkles, 
  Eye, 
  Clock, 
  User, 
  MapPin, 
  ExternalLink,
  X,
  GraduationCap
} from 'lucide-react';

interface VlogsSectionProps {
  onOpenAuth: (tab: 'login' | 'signup') => void;
}

interface VlogItem {
  id: string;
  title: string;
  category: 'Field Demo' | 'Tutorial' | 'Student Story' | 'Teacher Guide' | 'Tech Deep Dive';
  thumbnail: string;
  duration: string;
  views: string;
  speaker: string;
  location: string;
  summary: string;
  highlights: string[];
}

export const VlogsSection: React.FC<VlogsSectionProps> = ({ onOpenAuth }) => {
  const [selectedVlog, setSelectedVlog] = useState<VlogItem | null>(null);

  const vlogs: VlogItem[] = [
    {
      id: 'vlog-01',
      title: 'Haor Region Pilot: 100 Rural Students Coding Python on Paper during Load Shedding',
      category: 'Field Demo',
      thumbnail: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=600&auto=format&fit=crop&q=80',
      duration: '8:45',
      views: '14.2K views',
      speaker: 'Kazi Farhan (Field Director)',
      location: 'Sunamganj Haor, Sylhet',
      summary: 'Watch how students at a remote school with zero computer facilities handwrote nested loops by kerosene lanterns and scanned their homework via one mobile phone.',
      highlights: [
        'Zero laptop dependency in rural haor villages',
        '98.4% OCR recognition on ruled khata paper',
        'Student reactions executing their first Python code'
      ]
    },
    {
      id: 'vlog-02',
      title: 'Teacher Guide: How to Scan & Grade 50 Student Notebooks in Under 2 Minutes',
      category: 'Teacher Guide',
      thumbnail: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&auto=format&fit=crop&q=80',
      duration: '6:20',
      views: '9.8K views',
      speaker: 'Engr. Nusrat Jahan (CUET)',
      location: 'Chittagong Collegiate School',
      summary: 'A complete walkthrough showing teachers how PaperCodes batch scanner transcribes handwritten code, runs automated test suites, and exports grades to spreadsheets.',
      highlights: [
        'Batch camera capture workflow',
        'Instant test-case evaluation & grading rubric',
        'Applying class-wide grading curves with 1-click'
      ]
    },
    {
      id: 'vlog-03',
      title: 'From Ruled Khata to National Informatics Olympiad (BdOI) Finalist',
      category: 'Student Story',
      thumbnail: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&auto=format&fit=crop&q=80',
      duration: '11:15',
      views: '22.5K views',
      speaker: 'Tanvir Hossain (Class 9 Student)',
      location: 'Chittagong, Bangladesh',
      summary: 'Tanvir had no computer at home. Discover how practicing algorithms on paper notebooks helped him qualify for the Bangladesh National Olympiad in Informatics.',
      highlights: [
        'Daily paper practice regimen for C++ STL',
        'Developing algorithm tracing intuition by hand',
        'Advice for village students dreaming of tech careers'
      ]
    },
    {
      id: 'vlog-04',
      title: 'Tech Deep Dive: How our AI AST Engine Reads Smudged Bangla & Pencil Handwriting',
      category: 'Tech Deep Dive',
      thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80',
      duration: '9:30',
      views: '18.1K views',
      speaker: 'Redwan Ahmed (Lead Architect)',
      location: 'CUET CSE Lab, Chittagong',
      summary: 'An engineering overview of our lightweight syntax-tolerant OCR pipeline designed to rectify smudged quotes, indentation tabs, and bracket balance on mobile CPUs.',
      highlights: [
        'Abstract Syntax Tree (AST) error-correction heuristics',
        'Running 0.028-second compiler pipelines in cloud sandboxes',
        'Optimizing for cheap 2GB RAM Android smartphones'
      ]
    },
    {
      id: 'vlog-05',
      title: 'Class 9 SSC ICT Chapter 5: Complete Practical Board Exam on Paper',
      category: 'Tutorial',
      thumbnail: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&auto=format&fit=crop&q=80',
      duration: '14:10',
      views: '31.4K views',
      speaker: 'Dr. Rafiqul Islam (Senior Faculty)',
      location: 'Dhaka Board Curriculum Center',
      summary: 'Master all standard algorithms in the National Secondary ICT textbook including Prime Numbers, Factorials, Fibonacci, and Leap Years using PaperCode.',
      highlights: [
        '100% NCTB Chapter 5 alignment',
        'Flowcharts and handwriting best practices',
        'Common syntax pitfalls to avoid in board exams'
      ]
    },
    {
      id: 'vlog-06',
      title: 'UNESCO & a2i Digital Khata Initiative: Scaling PaperCode Across 500 Village Schools',
      category: 'Field Demo',
      thumbnail: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=80',
      duration: '7:50',
      views: '12.0K views',
      speaker: 'Mehnaz Chowdhury (a2i Deputy Director)',
      location: 'Kurigram & Chittagong Hill Tracts',
      summary: 'Government and NGO partners share insights on how paper-first coding bridges the socio-economic digital divide across remote Bangladeshi schools.',
      highlights: [
        'Cost savings compared to $20,000 computer labs',
        'Empowering female students in rural communities',
        'Roadmap to 50,000 students by 2027'
      ]
    }
  ];

  return (
    <section id="vlogs" className="py-16 px-4 max-w-7xl mx-auto border-t border-ink/15 space-y-12">
      
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="doodle-badge bg-highlighter text-ink">
          <Video className="w-4 h-4 text-stamp" />
          <span>Field Stories & Video Vlogs</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-ink tracking-tight">
          Watch PaperCode in Action Across Bangladesh
        </h2>
        <p className="text-graphite text-base sm:text-lg">
          Documentary field tests, teacher tutorials, and student inspiring journeys from village classrooms to national competitions.
        </p>
      </div>

      {/* Vlogs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {vlogs.map((vlog) => (
          <BentoCard 
            key={vlog.id} 
            variant="white" 
            className="p-0 border-2 border-ink overflow-hidden group hover:shadow-solid-lg transition-all flex flex-col justify-between"
          >
            {/* Thumbnail */}
            <div className="relative aspect-video overflow-hidden border-b-2 border-ink bg-black/10">
              <img 
                src={vlog.thumbnail} 
                alt={vlog.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-ink/30 group-hover:bg-ink/10 transition-colors flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => setSelectedVlog(vlog)}
                  className="w-12 h-12 rounded-full bg-highlighter border-2 border-ink flex items-center justify-center text-ink shadow-solid-md transform group-hover:scale-110 transition-transform btn-bounce"
                  aria-label="Play video"
                >
                  <Play className="w-5 h-5 fill-ink text-ink ml-0.5" />
                </button>
              </div>

              {/* Duration pill */}
              <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 bg-ink/80 text-white rounded-md font-mono text-[10px] font-bold">
                {vlog.duration}
              </div>

              {/* Category pill */}
              <div className="absolute top-2.5 left-2.5 px-2.5 py-1 bg-highlighter border border-ink text-ink rounded-full text-[10px] font-extrabold shadow-solid-xs">
                {vlog.category}
              </div>
            </div>

            {/* Content */}
            <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
              
              <div className="space-y-2">
                <h3 
                  onClick={() => setSelectedVlog(vlog)}
                  className="font-extrabold text-base text-ink leading-snug hover:text-stamp cursor-pointer transition-colors"
                >
                  {vlog.title}
                </h3>
                <p className="text-xs text-graphite line-clamp-2 leading-relaxed">
                  {vlog.summary}
                </p>
              </div>

              {/* Meta tags */}
              <div className="pt-3 border-t border-ink/15 space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono text-graphite">
                  <span className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-stamp" />
                    <strong className="text-ink">{vlog.speaker}</strong>
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5 text-graphite" />
                    {vlog.views}
                  </span>
                </div>

                <div className="flex items-center gap-1 text-[11px] text-graphite font-bold">
                  <MapPin className="w-3.5 h-3.5 text-stamp flex-shrink-0" />
                  <span className="truncate">{vlog.location}</span>
                </div>
              </div>

            </div>

            {/* Card Action */}
            <div className="p-4 pt-0">
              <button
                type="button"
                onClick={() => setSelectedVlog(vlog)}
                className="w-full py-2 bg-paper-muted hover:bg-highlighter text-ink border-2 border-ink rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-colors btn-bounce"
              >
                <Play className="w-3.5 h-3.5 fill-ink" />
                <span>Watch Video Summary</span>
              </button>
            </div>

          </BentoCard>
        ))}
      </div>

      {/* VIDEO PREVIEW MODAL */}
      {selectedVlog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-2xl bg-paper-card border-3 border-ink rounded-[28px] p-6 sm:p-8 shadow-solid-xl space-y-6 max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <span className="px-3 py-1 bg-highlighter border border-ink rounded-full text-xs font-extrabold text-ink">
                  {selectedVlog.category}
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-ink leading-snug pt-1">
                  {selectedVlog.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedVlog(null)}
                className="p-2 rounded-full border-2 border-ink bg-paper-muted hover:bg-red-100 text-ink transition-colors flex-shrink-0"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Player Placeholder */}
            <div className="relative aspect-video rounded-2xl overflow-hidden border-2 border-ink bg-black/90 flex flex-col items-center justify-center text-white p-6 text-center space-y-3 shadow-solid-sm">
              <div className="w-16 h-16 rounded-full bg-highlighter border-2 border-ink flex items-center justify-center text-ink shadow-solid-md animate-pulse">
                <Play className="w-8 h-8 fill-ink text-ink ml-1" />
              </div>
              <strong className="text-sm sm:text-base font-extrabold text-white">
                PaperCode Field Documentary Stream
              </strong>
              <span className="text-xs text-graphite font-mono">
                Duration: {selectedVlog.duration} • 1080p Full HD
              </span>
            </div>

            {/* Speaker & Location info */}
            <div className="p-4 bg-paper-muted rounded-2xl border-2 border-ink/20 flex flex-wrap items-center justify-between gap-3 text-xs font-bold text-ink">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-stamp" />
                <span>Speaker: <strong>{selectedVlog.speaker}</strong></span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-stamp" />
                <span>{selectedVlog.location}</span>
              </div>
            </div>

            {/* Summary & Key Takeaways */}
            <div className="space-y-3 text-xs leading-relaxed">
              <p className="text-graphite text-sm">
                {selectedVlog.summary}
              </p>

              <div className="p-4 bg-highlighter/20 border-2 border-ink rounded-2xl space-y-2">
                <strong className="text-ink font-mono uppercase block text-[11px]">
                  Key Episode Highlights:
                </strong>
                <ul className="space-y-1.5 text-ink">
                  {selectedVlog.highlights.map((h, i) => (
                    <li key={i} className="flex items-center space-x-2 font-bold">
                      <CheckCircle2 className="w-4 h-4 text-green-700 flex-shrink-0" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Modal CTAs */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={() => setSelectedVlog(null)}
                className="px-5 py-2.5 border-2 border-ink rounded-full text-xs font-extrabold text-ink bg-paper-muted hover:bg-paper-light"
              >
                Close Preview
              </button>

              <PillButton
                variant="primary"
                size="md"
                onClick={() => { setSelectedVlog(null); onOpenAuth('signup'); }}
                className="btn-bounce shadow-solid-xs"
                icon={<GraduationCap className="w-4 h-4" />}
              >
                Join PaperCode Free ➔
              </PillButton>
            </div>

          </div>
        </div>
      )}

    </section>
  );
};
