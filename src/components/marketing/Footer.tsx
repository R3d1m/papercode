import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, MapPin, Mail, School, ShieldCheck } from 'lucide-react';

interface FooterProps {
  onNavigate?: (view: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const navigate = useNavigate();

  const handleNav = (path: string) => {
    if (onNavigate) onNavigate(path);
    navigate(path);
  };

  return (
    <footer className="w-full bg-paper-card border-t-2 border-ink py-12 px-4 sm:px-8 mt-16">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Main Footer Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-xs">
          
          {/* Brand & Mission Column */}
          <div className="md:col-span-1 space-y-3">
            <div 
              onClick={() => handleNav('/')}
              className="flex items-center space-x-2.5 cursor-pointer group inline-flex"
            >
              <div className="w-8 h-8 rounded-xl bg-highlighter border-2 border-ink flex items-center justify-center font-extrabold text-sm text-ink shadow-solid-xs group-hover:rotate-12 transition-transform">
                ✏️
              </div>
              <span className="font-extrabold text-lg text-ink tracking-tight">PaperCode</span>
            </div>
            <p className="text-graphite font-medium leading-relaxed">
              Bridging the digital divide in Bangladesh with pen-and-paper code execution and neural handwriting OCR.
            </p>
            <div className="flex items-center space-x-1.5 text-[11px] font-mono text-stamp font-extrabold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>National Curriculum Aligned</span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="space-y-2.5">
            <div className="font-mono text-xs font-extrabold text-ink uppercase tracking-wider">
              Explore
            </div>
            <ul className="space-y-2 text-graphite font-bold">
              <li>
                <button 
                  onClick={() => handleNav('/roadmaps')}
                  className="hover:text-stamp transition-colors text-left"
                >
                  Learning Roadmaps
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNav('/courses')}
                  className="hover:text-stamp transition-colors text-left"
                >
                  Interactive Courses
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNav('/pricing')}
                  className="hover:text-stamp transition-colors text-left"
                >
                  Pricing & School ROI
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNav('/blogs')}
                  className="hover:text-stamp transition-colors text-left"
                >
                  Community Articles & Blogs
                </button>
              </li>
            </ul>
          </div>

          {/* Curriculum Tracks */}
          <div className="space-y-2.5">
            <div className="font-mono text-xs font-extrabold text-ink uppercase tracking-wider">
              Curriculum
            </div>
            <ul className="space-y-2 text-graphite font-medium">
              <li className="flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-stamp"></span>
                <span>Class 9–10 ICT (Python 3)</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-highlighter border border-ink"></span>
                <span>HSC ICT Chapter 5 (C Language)</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                <span>BdOI Olympiad Training (C++ STL)</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                <span>NCTB Flowchart & Algorithm Logic</span>
              </li>
            </ul>
          </div>

          {/* Contact & Affiliation */}
          <div className="space-y-2.5">
            <div className="font-mono text-xs font-extrabold text-ink uppercase tracking-wider">
              Affiliation
            </div>
            <div className="space-y-2 text-graphite font-medium">
              {/* <div className="flex items-start space-x-2">
                <School className="w-4 h-4 text-stamp flex-shrink-0 mt-0.5" />
                <span>CUET EdTech Research Lab, Chittagong, Bangladesh</span>
              </div> */}
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-stamp flex-shrink-0" />
                <span className="font-mono text-[11px]">contact@papercode.edu.bd</span>
              </div>
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-green-700 flex-shrink-0" />
                <span>Open Educational Resource (OER)</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Copyright Strip */}
        <div className="pt-6 border-t border-ink/15 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] font-mono text-graphite">
          <div>
            {'© ' + new Date().getFullYear() + ' PaperCode Bangladesh. Handwrite. Scan. Execute.'}
          </div>
          {/* <div className="flex items-center space-x-4">
            <span>Built for 64 Districts</span>
            <span>•</span>
            <span>Zero Computer Lab Bottlenecks</span>
          </div> */}
        </div>

      </div>
    </footer>
  );
};
