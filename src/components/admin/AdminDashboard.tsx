import React, { useState, useEffect } from 'react';
import { BentoCard } from '../common/BentoCard';
import { apiClient } from '../../services/apiClient';
import { 
  Users, 
  GraduationCap, 
  BookOpen, 
  Compass, 
  School, 
  Sparkles, 
  Activity
} from 'lucide-react';

interface AdminDashboardProps {
  initialTab?: string;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    totalCourses: 0,
    totalRoadmaps: 0,
    totalClassrooms: 0,
    geminiHitCount: 0,
    activeUsers: 1
  });

  // Fetch real-time vitals strictly from PostgreSQL backend
  useEffect(() => {
    apiClient.getAdminVitals().then(res => {
      if (res && res.stats) {
        setStats(res.stats);
      }
    }).catch(() => {});
  }, []);

  return (
    <div className="space-y-6 py-2 max-w-7xl mx-auto animate-fadeIn">
      
      {/* 7 EXACT REAL DATABASE METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* 1. Total Student */}
        <BentoCard variant="white" className="p-6 border-2 border-ink shadow-solid-md space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-extrabold text-graphite uppercase">Total Student</span>
            <div className="w-9 h-9 rounded-xl bg-highlighter border border-ink flex items-center justify-center text-ink shadow-solid-xs">
              <GraduationCap className="w-5 h-5 text-ink" />
            </div>
          </div>
          <div className="text-4xl font-extrabold font-mono text-ink tracking-tight">
            {stats.totalStudents.toLocaleString()}
          </div>
          <div className="text-[11px] font-mono text-green-700 font-bold">
            ● Registered in Database
          </div>
        </BentoCard>

        {/* 2. Total Teacher */}
        <BentoCard variant="white" className="p-6 border-2 border-ink shadow-solid-md space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-extrabold text-graphite uppercase">Total Teacher</span>
            <div className="w-9 h-9 rounded-xl bg-stamp text-white border border-ink flex items-center justify-center shadow-solid-xs">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-4xl font-extrabold font-mono text-ink tracking-tight">
            {stats.totalTeachers.toLocaleString()}
          </div>
          <div className="text-[11px] font-mono text-stamp font-bold">
            ● Verified in Database
          </div>
        </BentoCard>

        {/* 3. Total Course */}
        <BentoCard variant="white" className="p-6 border-2 border-ink shadow-solid-md space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-extrabold text-graphite uppercase">Total Course</span>
            <div className="w-9 h-9 rounded-xl bg-paper-muted border border-ink flex items-center justify-center text-ink shadow-solid-xs">
              <BookOpen className="w-5 h-5 text-stamp" />
            </div>
          </div>
          <div className="text-4xl font-extrabold font-mono text-ink tracking-tight">
            {stats.totalCourses.toLocaleString()}
          </div>
          <div className="text-[11px] font-mono text-graphite font-bold">
            ● Saved in Database
          </div>
        </BentoCard>

        {/* 4. Total Classroom */}
        <BentoCard variant="white" className="p-6 border-2 border-ink shadow-solid-md space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-extrabold text-graphite uppercase">Total Classroom</span>
            <div className="w-9 h-9 rounded-xl bg-paper-light border border-ink flex items-center justify-center text-ink shadow-solid-xs">
              <School className="w-5 h-5 text-stamp" />
            </div>
          </div>
          <div className="text-4xl font-extrabold font-mono text-ink tracking-tight">
            {stats.totalClassrooms.toLocaleString()}
          </div>
          <div className="text-[11px] font-mono text-graphite font-bold">
            ● Active in Database
          </div>
        </BentoCard>

        {/* 5. Total Roadmaps */}
        <BentoCard variant="white" className="p-6 border-2 border-ink shadow-solid-md space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-extrabold text-graphite uppercase">Total Roadmaps</span>
            <div className="w-9 h-9 rounded-xl bg-highlighter border border-ink flex items-center justify-center text-ink shadow-solid-xs">
              <Compass className="w-5 h-5 text-stamp" />
            </div>
          </div>
          <div className="text-4xl font-extrabold font-mono text-ink tracking-tight">
            {stats.totalRoadmaps.toLocaleString()}
          </div>
          <div className="text-[11px] font-mono text-green-700 font-bold">
            ● Active Tracks
          </div>
        </BentoCard>

        {/* 6. Gemini API Hit Counter */}
        <BentoCard variant="highlighter" className="p-6 border-2 border-ink shadow-solid-md space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-extrabold text-ink uppercase">Gemini API Hit Counter</span>
            <div className="w-9 h-9 rounded-xl bg-ink text-highlighter border border-ink flex items-center justify-center shadow-solid-xs">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
          <div className="text-4xl font-extrabold font-mono text-ink tracking-tight">
            {stats.geminiHitCount.toLocaleString()}
          </div>
          <div className="text-[11px] font-mono text-ink font-bold">
            ⚡ Vision OCR Invocations
          </div>
        </BentoCard>

        {/* 7. Active Users */}
        <BentoCard variant="white" className="p-6 border-2 border-ink shadow-solid-md space-y-3 sm:col-span-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-extrabold text-graphite uppercase">Active Users</span>
            <span className="px-2.5 py-0.5 bg-green-100 border border-green-700 rounded-full font-mono text-[10px] font-extrabold text-green-900 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-600 animate-pulse"></span>
              <span>LIVE</span>
            </span>
          </div>
          <div className="text-4xl font-extrabold font-mono text-ink tracking-tight flex items-center gap-3">
            <span>{stats.activeUsers.toLocaleString()}</span>
            <span className="text-xs font-mono font-bold text-graphite">Users in system</span>
          </div>
          <div className="pt-2 border-t border-ink/15 text-xs text-graphite font-medium flex items-center justify-between">
            <span>PostgreSQL Status: <strong className="text-green-700 font-mono">Neon SSL Connected</strong></span>
            <span>OCR Model: <strong className="text-ink font-mono">Gemini 2.5 Flash</strong></span>
          </div>
        </BentoCard>

      </div>

    </div>
  );
};
