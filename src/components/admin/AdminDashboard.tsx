import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { BentoCard } from '../common/BentoCard';
import { PillButton } from '../common/PillButton';
import { apiClient } from '../../services/apiClient';
import { 
  Users, 
  GraduationCap, 
  BookOpen, 
  Compass, 
  School, 
  Sparkles, 
  Activity,
  Plus,
  Trash2,
  ShieldCheck,
  Award,
  UserCheck,
  CheckCircle2,
  FileText,
  Clock,
  Tag,
  Layers,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface AdminDashboardProps {
  initialTab?: 'vitals' | 'courses' | 'roadmaps' | 'blogs' | 'moderators';
}

export interface AdminBlogPost {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  author: string;
  readTime: string;
  publishedAt: string;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ initialTab = 'vitals' }) => {
  const { 
    currentUser, 
    courses, 
    addCourse, 
    deleteCourse,
    roadmaps, 
    addRoadmap, 
    deleteRoadmap,
    users, 
    moderators,
    promoteTeacherToModerator,
    demoteModerator
  } = useApp();

  const [activeTab, setActiveTab] = useState<'vitals' | 'courses' | 'roadmaps' | 'blogs' | 'moderators'>(initialTab);
  
  // Real Database Stats
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
  }, [courses.length, roadmaps.length]);

  // Sync activeTab when top navigation buttons change
  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  // Blog State
  const [blogs, setBlogs] = useState<AdminBlogPost[]>([
    {
      id: 'blog-01',
      title: 'The Chalk & Paper Revolution: Why 90% of Bangladesh’s Future Coders Don’t Need Laptops to Start',
      subtitle: 'How handwriting syntax on paper khata bridges the digital divide faster than building expensive computer labs.',
      category: 'Field Story',
      author: 'Dr. Rafiqul Islam (Admin HQ)',
      readTime: '6 min read',
      publishedAt: '2026-08-15'
    },
    {
      id: 'blog-02',
      title: 'From Paper Ruled Lines to Python: Designing the National Secondary Computer Curriculum',
      subtitle: 'A step-by-step pedagogical breakdown for teachers grading handwriting with Gemini 2.5 Flash Vision OCR.',
      category: 'Teaching Guide',
      author: 'Engr. Nusrat Jahan',
      readTime: '8 min read',
      publishedAt: '2026-08-18'
    },
    {
      id: 'blog-03',
      title: 'How Bangladeshi High Schoolers Trained for National Olympiad on Ruled Exercise Books',
      subtitle: 'PaperCode algorithms track test cases, recursion tracing, and complexity notes in offline classrooms.',
      category: 'Olympiad Prep',
      author: 'Tamim Al-Fahim (BdOI)',
      readTime: '5 min read',
      publishedAt: '2026-08-20'
    }
  ]);

  // Modals State
  const [isCreatingCourse, setIsCreatingCourse] = useState(false);
  const [newCourseTitle, setNewCourseTitle] = useState('');
  const [newCourseSubtitle, setNewCourseSubtitle] = useState('');
  const [newCourseCategory, setNewCourseCategory] = useState('NCTB Curriculum');
  const [newCourseLanguage, setNewCourseLanguage] = useState<'python' | 'c' | 'cpp' | 'javascript'>('python');
  const [newCourseLevel, setNewCourseLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Beginner');
  const [newCourseHours, setNewCourseHours] = useState(12);

  const [isCreatingRoadmap, setIsCreatingRoadmap] = useState(false);
  const [newRoadmapTitle, setNewRoadmapTitle] = useState('');
  const [newRoadmapDescription, setNewRoadmapDescription] = useState('');
  const [newRoadmapAudience, setNewRoadmapAudience] = useState('Secondary & HSC Students');
  const [newRoadmapBadge, setNewRoadmapBadge] = useState('🏆 National Olympiad Track');

  const [isCreatingBlog, setIsCreatingBlog] = useState(false);
  const [newBlogTitle, setNewBlogTitle] = useState('');
  const [newBlogSubtitle, setNewBlogSubtitle] = useState('');
  const [newBlogCategory, setNewBlogCategory] = useState('Curriculum');
  const [newBlogAuthor, setNewBlogAuthor] = useState('PaperCode Editorial');
  const [newBlogReadTime, setNewBlogReadTime] = useState('5 min read');

  // Handlers
  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourseTitle.trim()) return;

    const newId = 'crs-' + Date.now();
    const newCourseObj = {
      id: newId,
      title: newCourseTitle,
      subtitle: newCourseSubtitle || 'Structured learning module on ruled paper.',
      category: newCourseCategory,
      language: newCourseLanguage,
      level: newCourseLevel,
      estimatedHours: Number(newCourseHours) || 10,
      totalModules: 1,
      totalXp: 1500,
      enrolledCount: 0,
      isPublished: true,
      thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80',
      modules: [
        {
          id: 'mod-' + Date.now(),
          title: 'Module 1: Foundations & Core Concepts',
          description: 'Introduction to fundamentals with handwritten exercise problems.',
          sortOrder: 1,
          lessons: [
            {
              id: 'les-' + Date.now(),
              title: 'Lesson 1.1: Syntax & Variables on Paper',
              duration: '20 min',
              points: 100,
              initialCode: newCourseLanguage === 'c' 
                ? '#include <stdio.h>\n\nint main() {\n    printf("Hello PaperCode!\\n");\n    return 0;\n}'
                : 'print("Hello from PaperCode Bangladesh!")',
              expectedOutput: 'Hello PaperCode!',
              theoryContent: 'Write the program cleanly on ruled paper notebook and scan with PaperCode OCR.',
              instructions: 'Write the code in your notebook, take a photo, and click Run Code.'
            }
          ]
        }
      ]
    };

    addCourse(newCourseObj as any);
    apiClient.createCourse(newCourseObj).catch(() => {});

    setNewCourseTitle('');
    setNewCourseSubtitle('');
    setIsCreatingCourse(false);
    confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
  };

  const handleDeleteCourse = (courseId: string) => {
    if (window.confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      deleteCourse(courseId);
      apiClient.deleteCourse(courseId).catch(() => {});
    }
  };

  const handleCreateRoadmap = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoadmapTitle.trim()) return;

    addRoadmap({
      title: newRoadmapTitle,
      description: newRoadmapDescription || 'Comprehensive structured coding curriculum on paper notebook.',
      badge: newRoadmapBadge,
      targetAudience: newRoadmapAudience,
      courses: courses.slice(0, 2),
      isPublic: true,
      totalXp: 4000,
      enrolledCount: 50
    });

    setNewRoadmapTitle('');
    setNewRoadmapDescription('');
    setIsCreatingRoadmap(false);
    confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
  };

  const handleDeleteRoadmap = (roadmapId: string) => {
    if (window.confirm('Are you sure you want to delete this roadmap?')) {
      deleteRoadmap(roadmapId);
    }
  };

  const handleCreateBlog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBlogTitle.trim()) return;

    const newBlogItem: AdminBlogPost = {
      id: 'blog-' + Date.now(),
      title: newBlogTitle,
      subtitle: newBlogSubtitle || 'Insights and guidance from PaperCode Bangladesh.',
      category: newBlogCategory,
      author: newBlogAuthor,
      readTime: newBlogReadTime,
      publishedAt: new Date().toISOString().split('T')[0]
    };

    setBlogs([newBlogItem, ...blogs]);
    setNewBlogTitle('');
    setNewBlogSubtitle('');
    setIsCreatingBlog(false);
    confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
  };

  const handleDeleteBlog = (blogId: string) => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      setBlogs(blogs.filter(b => b.id !== blogId));
    }
  };

  // Teachers eligible for moderator promotion
  const teachersList = users.filter(u => u.role === 'teacher');

  return (
    <div className="space-y-6 py-2 max-w-7xl mx-auto animate-fadeIn pb-16">
      
      {/* Admin Dashboard Heading & Navigation Bar */}
      <div className="space-y-4 pb-4 border-b-2 border-ink/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-stamp text-white flex items-center justify-center text-xl shadow-solid-xs border-2 border-ink flex-shrink-0">
              🛡️
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
                Admin Dashboard & Control Center
              </h1>
              {/* <p className="text-xs text-graphite font-bold">
                Platform vitals, course management, roadmap tracks, blogs, and moderator controls
              </p> */}
            </div>
          </div>

          <div className="flex items-center gap-2 px-3.5 py-1.5 bg-green-100 border-2 border-green-700 rounded-xl text-xs font-mono font-extrabold text-green-900 shadow-solid-xs w-fit">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-600"></span>
            </span>
            <span>{(stats?.activeUsers ?? 1)} Active Users Live</span>
          </div>
        </div>

        {/* Tab Switcher */}
        {/*
        <div className="flex flex-wrap items-center gap-2 p-1.5 bg-paper-muted border-2 border-ink/20 rounded-2xl w-fit text-xs font-extrabold">
          <button
            type="button"
            onClick={() => setActiveTab('vitals')}
            className={'px-4 py-2 rounded-xl transition-all ' + (activeTab === 'vitals' ? 'bg-highlighter text-ink border-2 border-ink shadow-solid-xs font-extrabold' : 'text-graphite hover:text-ink')}
          >
            📊 Live Metrics
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('courses')}
            className={'px-4 py-2 rounded-xl transition-all ' + (activeTab === 'courses' ? 'bg-highlighter text-ink border-2 border-ink shadow-solid-xs font-extrabold' : 'text-graphite hover:text-ink')}
          >
            📚 Courses ({courses.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('roadmaps')}
            className={'px-4 py-2 rounded-xl transition-all ' + (activeTab === 'roadmaps' ? 'bg-highlighter text-ink border-2 border-ink shadow-solid-xs font-extrabold' : 'text-graphite hover:text-ink')}
          >
            🗺️ Roadmaps ({roadmaps.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('blogs')}
            className={'px-4 py-2 rounded-xl transition-all ' + (activeTab === 'blogs' ? 'bg-highlighter text-ink border-2 border-ink shadow-solid-xs font-extrabold' : 'text-graphite hover:text-ink')}
          >
            ✍️ Blogs ({blogs.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('moderators')}
            className={'px-4 py-2 rounded-xl transition-all ' + (activeTab === 'moderators' ? 'bg-highlighter text-ink border-2 border-ink shadow-solid-xs font-extrabold' : 'text-graphite hover:text-ink')}
          >
            👩‍🏫 Moderator Promotion ({moderators.length})
          </button>
        </div>
        */}
      </div>
      

      {/* 1. TAB: VITALS & DATABASE METRICS */}
      {activeTab === 'vitals' && (
        <div className="space-y-6 animate-fadeIn">
          <div>
            <h2 className="text-xl font-extrabold text-ink flex items-center gap-2">
              <Activity className="w-5 h-5 text-stamp" />
              <span>Platform Live Telemetry</span>
            </h2>
            {/* <p className="text-xs text-graphite font-bold">
              Real-time counts queried directly from PostgreSQL database and vision runner.
            </p> */}
          </div>

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
                {(stats?.totalStudents ?? 0).toLocaleString()}
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
                {(stats?.totalTeachers ?? 0).toLocaleString()}
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
                {(stats?.totalCourses ?? courses.length).toLocaleString()}
              </div>
              <div className="text-[11px] font-mono text-graphite font-bold">
                ● Active Courses
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
                {(stats?.totalClassrooms ?? 0).toLocaleString()}
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
                {(stats?.totalRoadmaps ?? roadmaps.length).toLocaleString()}
              </div>
              <div className="text-[11px] font-mono text-green-700 font-bold">
                ● Active Learning Tracks
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
                {(stats?.geminiHitCount ?? 0).toLocaleString()}
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
                <span>{(stats?.activeUsers ?? 1).toLocaleString()}</span>
                <span className="text-xs font-mono font-bold text-graphite">Users currently online</span>
              </div>
              <div className="pt-2 border-t border-ink/15 text-xs text-graphite font-medium flex items-center justify-between">
                <span>PostgreSQL: <strong className="text-green-700 font-mono">Neon SSL Connected</strong></span>
                <span>OCR Engine: <strong className="text-ink font-mono">Gemini 2.5 Flash</strong></span>
              </div>
            </BentoCard>

          </div>
        </div>
      )}

      {/* 2. TAB: COURSES MANAGEMENT */}
      {activeTab === 'courses' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-extrabold text-ink flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-stamp" />
                <span>Course Catalog & Curriculum ({courses.length})</span>
              </h2>
              <p className="text-xs text-graphite font-bold">
                Admin can add new handwritten programming modules or remove outdated courses.
              </p>
            </div>

            <PillButton
              variant="stamp"
              size="md"
              onClick={() => setIsCreatingCourse(true)}
              className="btn-bounce shadow-solid-xs"
              icon={<Plus className="w-4 h-4" />}
            >
              + Create New Course
            </PillButton>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <BentoCard key={course.id} variant="white" className="p-6 border-2 border-ink shadow-solid-md flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 bg-highlighter border border-ink rounded font-mono text-[10px] font-extrabold uppercase text-ink">
                      {course.category || 'Curriculum'}
                    </span>
                    <span className="px-2 py-0.5 bg-paper-muted border border-ink/30 rounded font-mono text-[10px] font-bold text-ink">
                      {course.language?.toUpperCase() || 'PYTHON'}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-extrabold text-ink line-clamp-1">{course.title}</h3>
                    <p className="text-xs text-graphite font-medium line-clamp-2 mt-1">{course.subtitle || course.description}</p>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-mono text-graphite pt-2 border-t border-ink/10">
                    <span className="flex items-center gap-1">
                      <Layers className="w-3.5 h-3.5 text-stamp" />
                      <strong>{course.modules?.length || 1} Modules</strong>
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-graphite" />
                      <strong>{course.estimatedHours || 10}h</strong>
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-ink/15 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-green-700 font-extrabold">● Published Live</span>
                  <button
                    type="button"
                    onClick={() => handleDeleteCourse(course.id)}
                    className="p-2 text-red-600 hover:bg-red-50 border border-transparent hover:border-red-300 rounded-lg text-xs font-extrabold flex items-center gap-1 transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </BentoCard>
            ))}
          </div>
        </div>
      )}

      {/* 3. TAB: ROADMAPS MANAGEMENT */}
      {activeTab === 'roadmaps' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-extrabold text-ink flex items-center gap-2">
                <Compass className="w-5 h-5 text-stamp" />
                <span>Learning Roadmaps ({roadmaps.length})</span>
              </h2>
              <p className="text-xs text-graphite font-bold">
                Admin can design multi-course structured pathways for national exams and competitions.
              </p>
            </div>

            <PillButton
              variant="stamp"
              size="md"
              onClick={() => setIsCreatingRoadmap(true)}
              className="btn-bounce shadow-solid-xs"
              icon={<Plus className="w-4 h-4" />}
            >
              + Create New Roadmap
            </PillButton>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {roadmaps.map((roadmap) => (
              <BentoCard key={roadmap.id} variant="white" className="p-6 border-2 border-ink shadow-solid-md flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 bg-highlighter border border-ink rounded-full font-mono text-xs font-extrabold text-ink shadow-solid-xs">
                      {roadmap.badge || '🏆 Certified Track'}
                    </span>
                    <span className="text-xs font-mono font-bold text-graphite">
                      {roadmap.targetAudience}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl font-extrabold text-ink">{roadmap.title}</h3>
                    <p className="text-xs text-graphite font-medium mt-1 leading-relaxed">{roadmap.description}</p>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-mono text-ink pt-2 border-t border-ink/10">
                    <span>📚 <strong>{roadmap.courses?.length || 2} Connected Courses</strong></span>
                    <span>💎 <strong>{roadmap.totalXp || 4000} XP</strong></span>
                  </div>
                </div>

                <div className="pt-3 border-t border-ink/15 flex items-center justify-between">
                  <span className="text-xs font-mono text-green-700 font-bold">● Public Curriculum</span>
                  <button
                    type="button"
                    onClick={() => handleDeleteRoadmap(roadmap.id)}
                    className="p-2 text-red-600 hover:bg-red-50 border border-transparent hover:border-red-300 rounded-lg text-xs font-extrabold flex items-center gap-1 transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Roadmap</span>
                  </button>
                </div>
              </BentoCard>
            ))}
          </div>
        </div>
      )}

      {/* 4. TAB: BLOGS MANAGEMENT */}
      {activeTab === 'blogs' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-extrabold text-ink flex items-center gap-2">
                <FileText className="w-5 h-5 text-stamp" />
                <span>Editorial Blog Posts ({blogs.length})</span>
              </h2>
              <p className="text-xs text-graphite font-bold">
                Publish articles, teaching guides, and Olympiad field stories for the community.
              </p>
            </div>

            <PillButton
              variant="stamp"
              size="md"
              onClick={() => setIsCreatingBlog(true)}
              className="btn-bounce shadow-solid-xs"
              icon={<Plus className="w-4 h-4" />}
            >
              + Write New Blog
            </PillButton>
          </div>

          <div className="space-y-4">
            {blogs.map((blog) => (
              <div key={blog.id} className="p-5 bg-white border-2 border-ink rounded-2xl shadow-solid-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 bg-paper-muted border border-ink/20 rounded font-mono text-[10px] font-extrabold text-ink">
                      {blog.category}
                    </span>
                    <span className="text-[11px] font-mono text-graphite">{blog.publishedAt} • {blog.readTime}</span>
                  </div>
                  <h3 className="text-base font-extrabold text-ink">{blog.title}</h3>
                  <p className="text-xs text-graphite font-medium">{blog.subtitle}</p>
                  <div className="text-[11px] font-mono text-stamp font-bold">By {blog.author}</div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => handleDeleteBlog(blog.id)}
                    className="px-3 py-2 text-red-600 hover:bg-red-50 border border-red-200 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all shadow-solid-xs"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. TAB: MODERATOR PROMOTION (PROMOTE TEACHERS TO MODERATOR) */}
      {activeTab === 'moderators' && (
        <div className="space-y-8 animate-fadeIn">
          <div>
            <h2 className="text-xl font-extrabold text-ink flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-stamp" />
              <span>Moderator Governance & Teacher Promotion</span>
            </h2>
            <p className="text-xs text-graphite font-bold">
              Admin can promote verified educators to Moderators to help build courses and grade student paper submissions.
            </p>
          </div>

          {/* Section 1: Active Moderators */}
          <div className="space-y-4">
            <h3 className="text-base font-extrabold text-ink flex items-center gap-2">
              <Award className="w-4 h-4 text-highlighter" />
              <span>Current Platform Moderators ({moderators.length})</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {moderators.map((mod) => (
                <div key={mod.id} className="p-4 bg-yellow-50/70 border-2 border-ink rounded-2xl shadow-solid-sm flex items-center justify-between gap-4">
                  <div className="flex items-center space-x-3">
                    <img
                      src={mod.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                      alt={mod.name}
                      className="w-12 h-12 rounded-full border-2 border-ink object-cover"
                    />
                    <div>
                      <h4 className="text-sm font-extrabold text-ink">{mod.name}</h4>
                      <p className="text-[11px] text-graphite font-mono">{mod.email}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 bg-stamp text-white text-[10px] font-mono font-bold rounded">
                        🛡️ Moderator (Full CMS & Grading)
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm(`Demote ${mod.name} back to regular teacher?`)) {
                        demoteModerator(mod.id);
                      }
                    }}
                    className="px-2.5 py-1.5 text-graphite hover:text-red-700 bg-white border border-ink/30 hover:border-red-400 rounded-lg text-[11px] font-extrabold transition-all"
                  >
                    Demote
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Promote Existing Teachers */}
          <div className="space-y-4 pt-4 border-t border-ink/10">
            <div>
              <h3 className="text-base font-extrabold text-ink flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-stamp" />
                <span>Existing Verified Teachers Available for Promotion ({teachersList.length})</span>
              </h3>
              <p className="text-xs text-graphite font-medium">
                Click "Promote to Moderator" to grant an educator course creation and paper grading permissions.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {teachersList.map((teacher) => {
                const isAlreadyMod = moderators.some(m => m.email === teacher.email || m.id === teacher.id);
                return (
                  <div key={teacher.id} className="p-4 bg-white border-2 border-ink rounded-2xl shadow-solid-sm flex flex-col justify-between space-y-3">
                    <div className="flex items-center space-x-3">
                      <img
                        src={teacher.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150'}
                        alt={teacher.name}
                        className="w-10 h-10 rounded-full border-2 border-ink object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <h4 className="text-sm font-extrabold text-ink truncate">{teacher.name}</h4>
                        <p className="text-[11px] text-graphite font-mono truncate">{teacher.email}</p>
                        <span className="text-[10px] text-graphite font-bold">{teacher.school || 'Verified Educator'}</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-ink/10">
                      {isAlreadyMod ? (
                        <div className="text-[11px] font-mono font-extrabold text-green-800 bg-green-100 px-3 py-1.5 rounded-lg border border-green-600 flex items-center justify-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-green-700" />
                          <span>Active Moderator</span>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            promoteTeacherToModerator(teacher.id);
                            confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
                          }}
                          className="w-full py-2 bg-highlighter hover:bg-yellow-300 text-ink border-2 border-ink rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-solid-xs btn-bounce transition-all"
                        >
                          <ShieldCheck className="w-4 h-4 text-stamp" />
                          <span>⭐ Promote to Moderator</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {/* CREATE COURSE MODAL */}
      {isCreatingCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/70 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-lg bg-paper-card border-2 border-ink rounded-[28px] p-6 sm:p-8 shadow-solid-xl max-h-[90vh] overflow-y-auto space-y-5">
            <button
              type="button"
              onClick={() => setIsCreatingCourse(false)}
              className="absolute top-5 right-5 p-2 rounded-full border-2 border-ink/30 bg-paper-muted hover:bg-paper-light text-ink"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1">
              <span className="px-3 py-0.5 bg-highlighter border border-ink text-ink font-mono text-[10px] font-extrabold uppercase rounded-full shadow-solid-xs">
                Admin Course Creator
              </span>
              <h2 className="text-2xl font-extrabold text-ink">Create New Course</h2>
              <p className="text-xs text-graphite font-bold">Add a structured handwritten course to the platform catalog.</p>
            </div>

            <form onSubmit={handleCreateCourse} className="space-y-3.5 text-xs font-bold text-ink">
              <div className="space-y-1">
                <label className="block">Course Title *</label>
                <input
                  type="text"
                  value={newCourseTitle}
                  onChange={(e) => setNewCourseTitle(e.target.value)}
                  placeholder="e.g. C Programming for HSC ICT Board Exam"
                  className="w-full px-3 py-2.5 bg-white border-2 border-ink/30 rounded-xl"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="block">Subtitle / Description</label>
                <input
                  type="text"
                  value={newCourseSubtitle}
                  onChange={(e) => setNewCourseSubtitle(e.target.value)}
                  placeholder="e.g. Master loops, arrays and pointer syntax on paper."
                  className="w-full px-3 py-2.5 bg-white border-2 border-ink/30 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block">Programming Language</label>
                  <select
                    value={newCourseLanguage}
                    onChange={(e: any) => setNewCourseLanguage(e.target.value)}
                    className="w-full px-3 py-2.5 bg-white border-2 border-ink/30 rounded-xl"
                  >
                    <option value="python">Python</option>
                    <option value="c">C Language</option>
                    <option value="cpp">C++</option>
                    <option value="javascript">JavaScript</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block">Category</label>
                  <select
                    value={newCourseCategory}
                    onChange={(e) => setNewCourseCategory(e.target.value)}
                    className="w-full px-3 py-2.5 bg-white border-2 border-ink/30 rounded-xl"
                  >
                    <option value="NCTB Curriculum">NCTB Curriculum</option>
                    <option value="Olympiad Prep">Olympiad Prep</option>
                    <option value="Competitive Programming">Competitive Programming</option>
                    <option value="University CS">University CS</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block">Difficulty Level</label>
                  <select
                    value={newCourseLevel}
                    onChange={(e: any) => setNewCourseLevel(e.target.value)}
                    className="w-full px-3 py-2.5 bg-white border-2 border-ink/30 rounded-xl"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block">Estimated Hours</label>
                  <input
                    type="number"
                    value={newCourseHours}
                    onChange={(e) => setNewCourseHours(Number(e.target.value))}
                    min={1}
                    max={100}
                    className="w-full px-3 py-2.5 bg-white border-2 border-ink/30 rounded-xl"
                  />
                </div>
              </div>

              <div className="pt-3 flex gap-2">
                <PillButton type="button" variant="secondary" size="md" onClick={() => setIsCreatingCourse(false)}>
                  Cancel
                </PillButton>
                <PillButton type="submit" variant="highlighter" size="md" className="flex-1 btn-bounce shadow-solid-xs">
                  Create Course ➔
                </PillButton>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE ROADMAP MODAL */}
      {isCreatingRoadmap && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/70 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-lg bg-paper-card border-2 border-ink rounded-[28px] p-6 sm:p-8 shadow-solid-xl max-h-[90vh] overflow-y-auto space-y-5">
            <button
              type="button"
              onClick={() => setIsCreatingRoadmap(false)}
              className="absolute top-5 right-5 p-2 rounded-full border-2 border-ink/30 bg-paper-muted hover:bg-paper-light text-ink"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1">
              <span className="px-3 py-0.5 bg-highlighter border border-ink text-ink font-mono text-[10px] font-extrabold uppercase rounded-full shadow-solid-xs">
                Admin Roadmap Builder
              </span>
              <h2 className="text-2xl font-extrabold text-ink">Create New Roadmap</h2>
              <p className="text-xs text-graphite font-bold">Publish a guided learning pathway for national exams.</p>
            </div>

            <form onSubmit={handleCreateRoadmap} className="space-y-3.5 text-xs font-bold text-ink">
              <div className="space-y-1">
                <label className="block">Roadmap Title *</label>
                <input
                  type="text"
                  value={newRoadmapTitle}
                  onChange={(e) => setNewRoadmapTitle(e.target.value)}
                  placeholder="e.g. National Olympiad in Informatics (BdOI) Track"
                  className="w-full px-3 py-2.5 bg-white border-2 border-ink/30 rounded-xl"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="block">Description</label>
                <textarea
                  value={newRoadmapDescription}
                  onChange={(e) => setNewRoadmapDescription(e.target.value)}
                  placeholder="Describe what students will achieve in this track..."
                  rows={3}
                  className="w-full px-3 py-2.5 bg-white border-2 border-ink/30 rounded-xl resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block">Target Audience</label>
                  <input
                    type="text"
                    value={newRoadmapAudience}
                    onChange={(e) => setNewRoadmapAudience(e.target.value)}
                    placeholder="e.g. HSC & High School Students"
                    className="w-full px-3 py-2.5 bg-white border-2 border-ink/30 rounded-xl"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block">Achievement Badge</label>
                  <input
                    type="text"
                    value={newRoadmapBadge}
                    onChange={(e) => setNewRoadmapBadge(e.target.value)}
                    placeholder="e.g. 🏆 Olympiad Medalist"
                    className="w-full px-3 py-2.5 bg-white border-2 border-ink/30 rounded-xl"
                  />
                </div>
              </div>

              <div className="pt-3 flex gap-2">
                <PillButton type="button" variant="secondary" size="md" onClick={() => setIsCreatingRoadmap(false)}>
                  Cancel
                </PillButton>
                <PillButton type="submit" variant="highlighter" size="md" className="flex-1 btn-bounce shadow-solid-xs">
                  Publish Roadmap ➔
                </PillButton>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE BLOG MODAL */}
      {isCreatingBlog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/70 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-lg bg-paper-card border-2 border-ink rounded-[28px] p-6 sm:p-8 shadow-solid-xl max-h-[90vh] overflow-y-auto space-y-5">
            <button
              type="button"
              onClick={() => setIsCreatingBlog(false)}
              className="absolute top-5 right-5 p-2 rounded-full border-2 border-ink/30 bg-paper-muted hover:bg-paper-light text-ink"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1">
              <span className="px-3 py-0.5 bg-highlighter border border-ink text-ink font-mono text-[10px] font-extrabold uppercase rounded-full shadow-solid-xs">
                Admin Editorial Publisher
              </span>
              <h2 className="text-2xl font-extrabold text-ink">Publish Blog Post</h2>
              <p className="text-xs text-graphite font-bold">Write a pedagogical story or curriculum release notice.</p>
            </div>

            <form onSubmit={handleCreateBlog} className="space-y-3.5 text-xs font-bold text-ink">
              <div className="space-y-1">
                <label className="block">Article Title *</label>
                <input
                  type="text"
                  value={newBlogTitle}
                  onChange={(e) => setNewBlogTitle(e.target.value)}
                  placeholder="e.g. How to run PaperCode in rural schools without WiFi"
                  className="w-full px-3 py-2.5 bg-white border-2 border-ink/30 rounded-xl"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="block">Subtitle / Summary</label>
                <input
                  type="text"
                  value={newBlogSubtitle}
                  onChange={(e) => setNewBlogSubtitle(e.target.value)}
                  placeholder="e.g. Practical classroom setup for ICT teachers across Bangladesh."
                  className="w-full px-3 py-2.5 bg-white border-2 border-ink/30 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block">Category</label>
                  <select
                    value={newBlogCategory}
                    onChange={(e) => setNewBlogCategory(e.target.value)}
                    className="w-full px-3 py-2.5 bg-white border-2 border-ink/30 rounded-xl"
                  >
                    <option value="Field Story">Field Story</option>
                    <option value="Teaching Guide">Teaching Guide</option>
                    <option value="Olympiad Prep">Olympiad Prep</option>
                    <option value="Curriculum">Curriculum</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block">Author Name</label>
                  <input
                    type="text"
                    value={newBlogAuthor}
                    onChange={(e) => setNewBlogAuthor(e.target.value)}
                    placeholder="e.g. PaperCode Editorial"
                    className="w-full px-3 py-2.5 bg-white border-2 border-ink/30 rounded-xl"
                  />
                </div>
              </div>

              <div className="pt-3 flex gap-2">
                <PillButton type="button" variant="secondary" size="md" onClick={() => setIsCreatingBlog(false)}>
                  Cancel
                </PillButton>
                <PillButton type="submit" variant="highlighter" size="md" className="flex-1 btn-bounce shadow-solid-xs">
                  Publish Article ➔
                </PillButton>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
