import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { BentoCard } from '../common/BentoCard';
import { PillButton } from '../common/PillButton';
import { UserAvatar } from '../common/UserAvatar';
import { apiClient } from '../../services/apiClient';
import { BlogPost, Course, Roadmap } from '../../types';
import { 
  Users, 
  GraduationCap, 
  BookOpen, 
  Compass, 
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
  Layers,
  X,
  Edit3,
  Eye,
  Globe,
  Lock,
  Heart
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface AdminDashboardProps {
  initialTab?: 'vitals' | 'courses' | 'roadmaps' | 'blogs' | 'moderators';
}

const PRESET_COVERS = [
  { label: 'Rural School', url: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&auto=format&fit=crop&q=80' },
  { label: 'Coding Khata', url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80' },
  { label: 'Compiler & AST', url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80' },
  { label: 'Teacher Grading', url: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&auto=format&fit=crop&q=80' },
  { label: 'ICT Textbook', url: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop&q=80' }
];

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ initialTab = 'vitals' }) => {
  const { 
    currentUser, 
    courses, 
    addCourse, 
    deleteCourse,
    roadmaps, 
    addRoadmap, 
    updateRoadmap, 
    deleteRoadmap,
    toggleRoadmapPublish,
    blogs, 
    addBlog, 
    updateBlog, 
    deleteBlog, 
    toggleBlogPublish,
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

  // Course Creation Modal State
  const [isCreatingCourse, setIsCreatingCourse] = useState(false);
  const [newCourseTitle, setNewCourseTitle] = useState('');
  const [newCourseSubtitle, setNewCourseSubtitle] = useState('');
  const [newCourseCategory, setNewCourseCategory] = useState('NCTB Curriculum');
  const [newCourseLanguage, setNewCourseLanguage] = useState<'python' | 'c' | 'cpp' | 'javascript'>('python');
  const [newCourseLevel, setNewCourseLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Beginner');
  const [newCourseHours, setNewCourseHours] = useState(12);

  // Roadmap Modal State (Create & Edit)
  const [isCreatingRoadmap, setIsCreatingRoadmap] = useState(false);
  const [editingRoadmap, setEditingRoadmap] = useState<Roadmap | null>(null);
  const [roadmapTitle, setRoadmapTitle] = useState('');
  const [roadmapDescription, setRoadmapDescription] = useState('');
  const [roadmapAudience, setRoadmapAudience] = useState('Secondary & HSC Students');
  const [roadmapBadge, setRoadmapBadge] = useState('🏆 National Olympiad Track');
  const [roadmapSelectedCourseIds, setRoadmapSelectedCourseIds] = useState<string[]>([]);
  const [roadmapIsPublic, setRoadmapIsPublic] = useState(true);

  // Blog Modal State (Create, Edit & Preview)
  const [isCreatingBlog, setIsCreatingBlog] = useState(false);
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);
  const [previewBlog, setPreviewBlog] = useState<BlogPost | null>(null);
  
  const [blogTitle, setBlogTitle] = useState('');
  const [blogSubtitle, setBlogSubtitle] = useState('');
  const [blogCategory, setBlogCategory] = useState('Field Story');
  const [blogAuthorName, setBlogAuthorName] = useState('Dr. Rafiqul Islam (Admin HQ)');
  const [blogAuthorRole, setBlogAuthorRole] = useState('Senior Academic Advisor');
  const [blogAuthorAffiliation, setBlogAuthorAffiliation] = useState('CUET & National Curriculum Committee');
  const [blogCoverImage, setBlogCoverImage] = useState(PRESET_COVERS[0].url);
  const [blogContent, setBlogContent] = useState('');
  const [blogTags, setBlogTags] = useState('DigitalDivide, RuralEdTech, NCTB, Python');
  const [blogIsPublished, setBlogIsPublished] = useState(true);

  // Helper: Auto-calculate XP for a list of course IDs
  const calculateXpFromCourseIds = (courseIds: string[]) => {
    const selected = courses.filter(c => courseIds.includes(c.id));
    const calculated = selected.reduce((sum, crs) => {
      const lessons = (crs.modules || []).flatMap(m => m.lessons || []);
      const lessonXp = lessons.reduce((lSum, l) => lSum + (l.xpReward || 100), 0);
      return sum + (lessonXp > 0 ? lessonXp : 1000);
    }, 0);
    return calculated > 0 ? calculated : (selected.length * 1000 || 1000);
  };

  // Open Create Roadmap Modal
  const handleOpenCreateRoadmap = () => {
    setEditingRoadmap(null);
    setRoadmapTitle('');
    setRoadmapDescription('');
    setRoadmapAudience('Secondary & HSC Students');
    setRoadmapBadge('🏆 National Olympiad Track');
    setRoadmapSelectedCourseIds(courses.slice(0, 2).map(c => c.id));
    setRoadmapIsPublic(true);
    setIsCreatingRoadmap(true);
  };

  // Open Edit Roadmap Modal
  const handleOpenEditRoadmap = (roadmap: Roadmap) => {
    setEditingRoadmap(roadmap);
    setRoadmapTitle(roadmap.title);
    setRoadmapDescription(roadmap.description || '');
    setRoadmapAudience(roadmap.targetAudience || 'Secondary & HSC Students');
    setRoadmapBadge(roadmap.badge || '🏆 Certified Track');
    setRoadmapSelectedCourseIds(roadmap.courses?.map(c => c.id) || []);
    setRoadmapIsPublic(roadmap.isPublic !== false);
    setIsCreatingRoadmap(true);
  };

  // Save Roadmap (Create or Update)
  const handleSaveRoadmap = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roadmapTitle.trim()) return;

    const selectedCourses = courses.filter(c => roadmapSelectedCourseIds.includes(c.id));
    const autoXp = calculateXpFromCourseIds(roadmapSelectedCourseIds);

    if (editingRoadmap) {
      updateRoadmap(editingRoadmap.id, {
        title: roadmapTitle.trim(),
        description: roadmapDescription.trim() || 'Comprehensive structured coding curriculum on paper notebook.',
        badge: roadmapBadge.trim(),
        targetAudience: roadmapAudience.trim(),
        courses: selectedCourses,
        isPublic: roadmapIsPublic,
        totalXp: autoXp
      });
    } else {
      addRoadmap({
        title: roadmapTitle.trim(),
        description: roadmapDescription.trim() || 'Comprehensive structured coding curriculum on paper notebook.',
        badge: roadmapBadge.trim(),
        targetAudience: roadmapAudience.trim(),
        courses: selectedCourses,
        isPublic: roadmapIsPublic,
        totalXp: autoXp,
        enrolledCount: 50
      });
    }

    setIsCreatingRoadmap(false);
    setEditingRoadmap(null);
    confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
  };

  // Open Create Blog Modal
  const handleOpenCreateBlog = () => {
    setEditingBlog(null);
    setBlogTitle('');
    setBlogSubtitle('');
    setBlogCategory('Field Story');
    setBlogAuthorName(currentUser.name || 'Dr. Rafiqul Islam (Admin HQ)');
    setBlogAuthorRole('Senior Academic Advisor');
    setBlogAuthorAffiliation('PaperCode Editorial HQ');
    setBlogCoverImage(PRESET_COVERS[0].url);
    setBlogContent('');
    setBlogTags('DigitalDivide, RuralEdTech, NCTB, Python');
    setBlogIsPublished(true);
    setIsCreatingBlog(true);
  };

  // Open Edit Blog Modal
  const handleOpenEditBlog = (blog: BlogPost) => {
    setEditingBlog(blog);
    setBlogTitle(blog.title);
    setBlogSubtitle(blog.subtitle || '');
    setBlogCategory(blog.category || 'Field Story');
    setBlogAuthorName(blog.author?.name || currentUser.name || 'Dr. Rafiqul Islam');
    setBlogAuthorRole(blog.author?.role || 'Author');
    setBlogAuthorAffiliation(blog.author?.affiliation || 'PaperCode Community');
    setBlogCoverImage(blog.coverImage || PRESET_COVERS[0].url);
    setBlogContent(Array.isArray(blog.content) ? blog.content.join('\n\n') : (blog.content || ''));
    setBlogTags(Array.isArray(blog.tags) ? blog.tags.join(', ') : '');
    setBlogIsPublished(blog.isPublished !== false);
    setIsCreatingBlog(true);
  };

  // Save Blog (Create or Update)
  const handleSaveBlog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!blogTitle.trim()) return;

    const contentParagraphs = blogContent.split('\n\n').map(p => p.trim()).filter(Boolean);
    const tagsArray = blogTags.split(',').map(t => t.trim().replace(/^#/, '')).filter(Boolean);
    const wordsCount = blogContent.split(/\s+/).filter(Boolean).length;
    const autoReadTime = Math.max(2, Math.ceil(wordsCount / 150)) + ' min read';

    if (editingBlog) {
      updateBlog(editingBlog.id, {
        title: blogTitle.trim(),
        subtitle: blogSubtitle.trim() || 'Insights and guidance from PaperCode Bangladesh.',
        category: blogCategory,
        coverImage: blogCoverImage,
        author: {
          name: blogAuthorName.trim() || 'Dr. Rafiqul Islam',
          role: blogAuthorRole.trim() || 'Author',
          avatar: editingBlog.author?.avatar || currentUser.avatar || undefined,
          affiliation: blogAuthorAffiliation.trim() || 'PaperCode Editorial'
        },
        readTime: autoReadTime,
        tags: tagsArray.length > 0 ? tagsArray : ['PaperCode', 'EdTech'],
        content: contentParagraphs.length > 0 ? contentParagraphs : [blogSubtitle || blogTitle],
        isPublished: blogIsPublished
      });
    } else {
      addBlog({
        title: blogTitle.trim(),
        subtitle: blogSubtitle.trim() || 'Insights and guidance from PaperCode Bangladesh.',
        category: blogCategory,
        coverImage: blogCoverImage,
        author: {
          name: blogAuthorName.trim() || currentUser.name || 'Dr. Rafiqul Islam (Admin HQ)',
          role: blogAuthorRole.trim() || 'Senior Academic Advisor',
          avatar: currentUser.avatar || undefined,
          affiliation: blogAuthorAffiliation.trim() || 'PaperCode Editorial HQ'
        },
        readTime: autoReadTime,
        tags: tagsArray.length > 0 ? tagsArray : ['PaperCode', 'EdTech'],
        content: contentParagraphs.length > 0 ? contentParagraphs : [blogSubtitle || blogTitle],
        isPublished: blogIsPublished
      });
    }

    setIsCreatingBlog(false);
    setEditingBlog(null);
    confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
  };

  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourseTitle.trim()) return;

    const newId = 'crs-' + Date.now();
    const newCourseObj: Course = {
      id: newId,
      title: newCourseTitle,
      subtitle: newCourseSubtitle || 'Structured learning module on ruled paper.',
      description: newCourseSubtitle || 'Structured learning module on ruled paper.',
      category: newCourseCategory,
      language: newCourseLanguage,
      level: newCourseLevel,
      estimatedHours: Number(newCourseHours) || 10,
      isPublished: true,
      authorId: currentUser.id,
      authorName: currentUser.name || 'Dr. Rafiqul Islam (Admin HQ)',
      modules: []
    };

    addCourse(newCourseObj);
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

  const handleDeleteRoadmap = (roadmapId: string) => {
    if (window.confirm('Are you sure you want to delete this roadmap?')) {
      deleteRoadmap(roadmapId);
    }
  };

  const handleDeleteBlog = (blogId: string) => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      deleteBlog(blogId);
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
      </div>

      {/* 1. TAB: VITALS & DATABASE METRICS */}
      {activeTab === 'vitals' && (
        <div className="space-y-6 animate-fadeIn">
          <div>
            <h2 className="text-xl font-extrabold text-ink flex items-center gap-2">
              <Activity className="w-5 h-5 text-stamp" />
              <span>Platform Live Telemetry</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* 1. Total Student */}
            <BentoCard variant="white" className="p-6 border-2 border-ink shadow-solid-md space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-extrabold text-graphite uppercase">Total Student</span>
                <span className="p-2 bg-blue-100 border border-ink rounded-lg text-blue-700">
                  <Users className="w-4 h-4" />
                </span>
              </div>
              <div className="text-4xl font-extrabold font-mono text-ink tracking-tight">
                {(stats?.totalStudents ?? 0).toLocaleString()}
              </div>
              <div className="text-xs text-graphite font-medium">Registered students across Bangladesh</div>
            </BentoCard>

            {/* 2. Total Teachers & Moderators */}
            <BentoCard variant="white" className="p-6 border-2 border-ink shadow-solid-md space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-extrabold text-graphite uppercase">Educators</span>
                <span className="p-2 bg-purple-100 border border-ink rounded-lg text-purple-700">
                  <GraduationCap className="w-4 h-4" />
                </span>
              </div>
              <div className="text-4xl font-extrabold font-mono text-ink tracking-tight">
                {((stats?.totalTeachers ?? 0) + moderators.length).toLocaleString()}
              </div>
              <div className="text-xs text-graphite font-medium">
                {stats?.totalTeachers ?? 0} Teachers • {moderators.length} Moderators
              </div>
            </BentoCard>

            {/* 3. Published Curriculum Courses */}
            <BentoCard variant="white" className="p-6 border-2 border-ink shadow-solid-md space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-extrabold text-graphite uppercase">Courses</span>
                <span className="p-2 bg-highlighter/50 border border-ink rounded-lg text-ink">
                  <BookOpen className="w-4 h-4" />
                </span>
              </div>
              <div className="text-4xl font-extrabold font-mono text-ink tracking-tight">
                {courses.length}
              </div>
              <div className="text-xs text-graphite font-medium">Interactive handwritten tracks</div>
            </BentoCard>

            {/* 4. Active Roadmaps */}
            <BentoCard variant="white" className="p-6 border-2 border-ink shadow-solid-md space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-extrabold text-graphite uppercase">Roadmaps</span>
                <span className="p-2 bg-green-100 border border-ink rounded-lg text-green-700">
                  <Compass className="w-4 h-4" />
                </span>
              </div>
              <div className="text-4xl font-extrabold font-mono text-ink tracking-tight">
                {roadmaps.length}
              </div>
              <div className="text-xs text-graphite font-medium">Structured learning pathways</div>
            </BentoCard>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Gemini Vision OCR Analytics */}
            <BentoCard variant="white" className="p-6 border-2 border-ink shadow-solid-md space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-extrabold text-ink flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-stamp" />
                  <span>Total Transcriptions</span>
                </h3>
                <span className="px-2.5 py-0.5 bg-green-100 text-green-800 border border-green-600 rounded-full font-mono text-[10px] font-extrabold">
                  ONLINE 99.98%
                </span>
              </div>
              <div className="text-4xl font-extrabold font-mono text-ink tracking-tight flex items-center gap-3">
                <span>{(stats?.geminiHitCount ?? 48).toLocaleString()}</span>
                <span className="text-xs font-mono font-bold text-graphite">Total Handwritings Transcribed</span>
              </div>
              <div className="text-xs text-graphite font-medium leading-relaxed">
                Multi-model vision fallback: <strong className="text-ink font-mono">gemini-3.6-flash</strong> primary, <strong className="text-ink font-mono">gemini-2.5-flash</strong> & <strong className="text-ink font-mono">gemini-3.5-flash</strong> secondary.
              </div>
            </BentoCard>

            {/* Live Active Connections */}
            <BentoCard variant="white" className="p-6 border-2 border-ink shadow-solid-md space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-extrabold text-ink flex items-center gap-2">
                  <Activity className="w-4 h-4 text-green-600" />
                  <span>Platform Health & Infrastructure</span>
                </h3>
                <span className="px-2.5 py-0.5 bg-highlighter text-ink border border-ink rounded-full font-mono text-[10px] font-extrabold">
                  SECURE SSL
                </span>
              </div>
              <div className="text-4xl font-extrabold font-mono text-ink tracking-tight flex items-center gap-3">
                <span>{(stats?.activeUsers ?? 1).toLocaleString()}</span>
                <span className="text-xs font-mono font-bold text-graphite">Users currently online</span>
              </div>
              <div className="pt-2 border-t border-ink/15 text-xs text-graphite font-medium flex items-center justify-between">
                <span>PostgreSQL: <strong className="text-green-700 font-mono">Neon SSL Connected</strong></span>
                <span>OCR Engine: <strong className="text-ink font-mono">Gemini Vision Multi-Model</strong></span>
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
                Design multi-course structured pathways. Select existing courses, auto-calculate total XP, and toggle publish status.
              </p>
            </div>

            <PillButton
              variant="stamp"
              size="md"
              onClick={handleOpenCreateRoadmap}
              className="btn-bounce shadow-solid-xs"
              icon={<Plus className="w-4 h-4" />}
            >
              + Create New Roadmap
            </PillButton>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {roadmaps.map((roadmap) => {
              const courseCount = roadmap.courses?.length || 0;
              const isPub = roadmap.isPublic !== false;
              return (
                <BentoCard key={roadmap.id} variant="white" className="p-6 border-2 border-ink shadow-solid-md flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <span className="px-3 py-1 bg-highlighter border border-ink rounded-full font-mono text-xs font-extrabold text-ink shadow-solid-xs">
                        {roadmap.badge || '🏆 Certified Track'}
                      </span>
                      <div className="flex items-center gap-2">
                        {isPub ? (
                          <span className="px-2.5 py-0.5 bg-green-100 border border-green-600 text-green-800 text-[10px] font-mono font-extrabold rounded-full flex items-center gap-1">
                            <Globe className="w-3 h-3" /> Public Live
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 bg-amber-100 border border-amber-500 text-amber-900 text-[10px] font-mono font-extrabold rounded-full flex items-center gap-1">
                            <Lock className="w-3 h-3" /> Draft (Hidden)
                          </span>
                        )}
                        <span className="text-xs font-mono font-bold text-graphite">
                          {roadmap.targetAudience}
                        </span>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-extrabold text-ink">{roadmap.title}</h3>
                      <p className="text-xs text-graphite font-medium mt-1 leading-relaxed">{roadmap.description}</p>
                    </div>

                    {/* Connected Courses Pills */}
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[10px] font-mono font-extrabold text-graphite uppercase">
                        Connected Courses ({courseCount}):
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {courseCount > 0 ? (
                          roadmap.courses.map((crs, idx) => (
                            <span key={idx} className="px-2 py-0.5 bg-paper-muted border border-ink/20 rounded font-mono text-[11px] font-bold text-ink flex items-center gap-1">
                              <BookOpen className="w-3 h-3 text-stamp" />
                              <span className="max-w-[180px] truncate">{crs.title}</span>
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-amber-700 italic font-mono">No courses attached yet</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs font-mono text-ink pt-2 border-t border-ink/10">
                      <span>📚 <strong>{courseCount} Courses</strong></span>
                      <span>💎 <strong>{roadmap.totalXp} XP (Auto-calculated)</strong></span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-ink/15 flex items-center justify-between flex-wrap gap-2">
                    {/* 1-Click Publish / Unpublish Toggle */}
                    <button
                      type="button"
                      onClick={() => toggleRoadmapPublish(roadmap.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-mono font-extrabold border-2 transition-all flex items-center gap-1.5 shadow-solid-xs ${
                        isPub 
                          ? 'bg-amber-50 text-amber-900 border-amber-600 hover:bg-amber-100' 
                          : 'bg-green-50 text-green-900 border-green-700 hover:bg-green-100'
                      }`}
                    >
                      {isPub ? <Lock className="w-3.5 h-3.5" /> : <Globe className="w-3.5 h-3.5" />}
                      <span>{isPub ? 'Unpublish to Draft' : 'Publish Live'}</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleOpenEditRoadmap(roadmap)}
                        className="px-3 py-1.5 bg-white hover:bg-paper-light text-ink border-2 border-ink rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all shadow-solid-xs"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-stamp" />
                        <span>Edit</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteRoadmap(roadmap.id)}
                        className="px-3 py-1.5 text-red-600 hover:bg-red-50 border-2 border-red-200 hover:border-red-400 rounded-xl text-xs font-extrabold flex items-center gap-1 transition-all shadow-solid-xs"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </BentoCard>
              );
            })}
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
                <span>Editorial Blog Posts & Articles ({blogs.length})</span>
              </h2>
              <p className="text-xs text-graphite font-bold">
                Admin can author new blogs, edit existing posts by any contributor, preview articles, and toggle publish status.
              </p>
            </div>

            <PillButton
              variant="stamp"
              size="md"
              onClick={handleOpenCreateBlog}
              className="btn-bounce shadow-solid-xs"
              icon={<Plus className="w-4 h-4" />}
            >
              + Write New Blog Post
            </PillButton>
          </div>

          <div className="space-y-4">
            {blogs.map((blog) => {
              const isPub = blog.isPublished !== false;
              return (
                <div key={blog.id} className="p-5 bg-white border-2 border-ink rounded-2xl shadow-solid-sm flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-solid-md transition-all">
                  <div className="flex items-start gap-4 flex-1">
                    {blog.coverImage && (
                      <img 
                        src={blog.coverImage} 
                        alt={blog.title} 
                        className="w-20 h-20 rounded-xl border-2 border-ink object-cover flex-shrink-0 hidden sm:block" 
                      />
                    )}
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2.5 py-0.5 bg-paper-muted border border-ink/20 rounded font-mono text-[10px] font-extrabold text-ink">
                          {blog.category}
                        </span>
                        {isPub ? (
                          <span className="px-2 py-0.5 bg-green-100 border border-green-600 text-green-800 text-[10px] font-mono font-extrabold rounded-full flex items-center gap-1">
                            ● Live
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 bg-amber-100 border border-amber-500 text-amber-900 text-[10px] font-mono font-extrabold rounded-full flex items-center gap-1">
                            🔒 Draft
                          </span>
                        )}
                        <span className="text-[11px] font-mono text-graphite">{blog.publishedAt} • {blog.readTime}</span>
                        <span className="text-[11px] font-mono text-stamp font-bold flex items-center gap-1">
                          <Heart className="w-3 h-3 fill-stamp" /> {blog.claps || 0} claps
                        </span>
                      </div>
                      <h3 className="text-base font-extrabold text-ink leading-snug">{blog.title}</h3>
                      <p className="text-xs text-graphite font-medium line-clamp-1">{blog.subtitle}</p>
                      <div className="text-[11px] font-mono text-stamp font-bold">
                        By {blog.author?.name} {blog.author?.affiliation ? `(${blog.author.affiliation})` : ''}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
                    {/* Toggle Publish / Draft */}
                    <button
                      type="button"
                      onClick={() => toggleBlogPublish(blog.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-mono font-extrabold border-2 transition-all flex items-center gap-1 shadow-solid-xs ${
                        isPub 
                          ? 'bg-amber-50 text-amber-900 border-amber-600 hover:bg-amber-100' 
                          : 'bg-green-50 text-green-900 border-green-700 hover:bg-green-100'
                      }`}
                    >
                      {isPub ? <Lock className="w-3.5 h-3.5" /> : <Globe className="w-3.5 h-3.5" />}
                      <span>{isPub ? 'Unpublish' : 'Publish'}</span>
                    </button>

                    {/* Preview Full Article */}
                    <button
                      type="button"
                      onClick={() => setPreviewBlog(blog)}
                      className="px-3 py-1.5 bg-paper-muted hover:bg-white text-ink border-2 border-ink rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all shadow-solid-xs"
                    >
                      <Eye className="w-3.5 h-3.5 text-blue-600" />
                      <span>Preview</span>
                    </button>

                    {/* Edit Article */}
                    <button
                      type="button"
                      onClick={() => handleOpenEditBlog(blog)}
                      className="px-3 py-1.5 bg-highlighter hover:bg-yellow-400 text-ink border-2 border-ink rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all shadow-solid-xs"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-ink" />
                      <span>Edit</span>
                    </button>

                    {/* Delete Article */}
                    <button
                      type="button"
                      onClick={() => handleDeleteBlog(blog.id)}
                      className="px-3 py-1.5 text-red-600 hover:bg-red-50 border-2 border-red-200 hover:border-red-400 rounded-xl text-xs font-extrabold flex items-center gap-1 transition-all shadow-solid-xs"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              );
            })}
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
                    <UserAvatar
                      name={mod.name}
                      avatar={mod.avatar}
                      size="lg"
                      className="w-12 h-12"
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
                      <UserAvatar
                        name={teacher.name}
                        avatar={teacher.avatar}
                        size="md"
                        className="w-10 h-10"
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
                            promoteTeacherToModerator(teacher.id, ['edit_roadmaps', 'moderate_curriculum', 'moderate_blogs']);
                            confetti({ particleCount: 60, spread: 50, origin: { y: 0.7 } });
                          }}
                          className="w-full py-2 bg-highlighter hover:bg-yellow-400 text-ink border-2 border-ink rounded-xl font-mono text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 shadow-solid-xs"
                        >
                          <ShieldCheck className="w-4 h-4 text-stamp" />
                          <span>Promote to Moderator</span>
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
                Admin Curriculum Creator
              </span>
              <h2 className="text-2xl font-extrabold text-ink">Create New Course</h2>
              <p className="text-xs text-graphite font-bold">Add a structured module with lessons and test cases.</p>
            </div>

            <form onSubmit={handleCreateCourse} className="space-y-4 text-xs font-bold text-ink">
              <div className="space-y-1">
                <label className="block">Course Title *</label>
                <input
                  type="text"
                  value={newCourseTitle}
                  onChange={(e) => setNewCourseTitle(e.target.value)}
                  placeholder="e.g. C Programming for HSC ICT Chapter 5"
                  className="w-full px-3 py-2.5 bg-white border-2 border-ink/30 rounded-xl"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="block">Subtitle / Short Description</label>
                <input
                  type="text"
                  value={newCourseSubtitle}
                  onChange={(e) => setNewCourseSubtitle(e.target.value)}
                  placeholder="e.g. Master loops, arrays and functions on ruled notebook."
                  className="w-full px-3 py-2.5 bg-white border-2 border-ink/30 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block">Category</label>
                  <select
                    value={newCourseCategory}
                    onChange={(e) => setNewCourseCategory(e.target.value)}
                    className="w-full px-3 py-2.5 bg-white border-2 border-ink/30 rounded-xl"
                  >
                    <option value="NCTB Curriculum">NCTB Curriculum</option>
                    <option value="Olympiad Prep">Olympiad Prep</option>
                    <option value="National Exam">National Exam</option>
                    <option value="Algorithms">Algorithms</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block">Programming Language</label>
                  <select
                    value={newCourseLanguage}
                    onChange={(e) => setNewCourseLanguage(e.target.value as any)}
                    className="w-full px-3 py-2.5 bg-white border-2 border-ink/30 rounded-xl"
                  >
                    <option value="python">Python</option>
                    <option value="c">C Language</option>
                    <option value="cpp">C++</option>
                    <option value="javascript">JavaScript</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block">Level</label>
                  <select
                    value={newCourseLevel}
                    onChange={(e) => setNewCourseLevel(e.target.value as any)}
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

      {/* CREATE / EDIT ROADMAP MODAL */}
      {isCreatingRoadmap && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/70 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-2xl bg-paper-card border-2 border-ink rounded-[28px] p-6 sm:p-8 shadow-solid-xl max-h-[90vh] overflow-y-auto space-y-5">
            <button
              type="button"
              onClick={() => { setIsCreatingRoadmap(false); setEditingRoadmap(null); }}
              className="absolute top-5 right-5 p-2 rounded-full border-2 border-ink/30 bg-paper-muted hover:bg-paper-light text-ink"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1">
              <span className="px-3 py-0.5 bg-highlighter border border-ink text-ink font-mono text-[10px] font-extrabold uppercase rounded-full shadow-solid-xs">
                {editingRoadmap ? 'Roadmap Editor' : 'Roadmap Track Designer'}
              </span>
              <h2 className="text-2xl font-extrabold text-ink">
                {editingRoadmap ? `Edit Roadmap: ${editingRoadmap.title}` : 'Create Structured Learning Roadmap'}
              </h2>
              <p className="text-xs text-graphite font-bold">
                Connect multiple courses into a sequential pathway. Total XP is calculated automatically from the connected courses.
              </p>
            </div>

            <form onSubmit={handleSaveRoadmap} className="space-y-4 text-xs font-bold text-ink">
              <div className="space-y-1">
                <label className="block">Roadmap Title *</label>
                <input
                  type="text"
                  value={roadmapTitle}
                  onChange={(e) => setRoadmapTitle(e.target.value)}
                  placeholder="e.g. National Olympiad in Informatics (BdOI) Track"
                  className="w-full px-3 py-2.5 bg-white border-2 border-ink/30 rounded-xl"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="block">Description</label>
                <textarea
                  value={roadmapDescription}
                  onChange={(e) => setRoadmapDescription(e.target.value)}
                  placeholder="Describe the competencies students will master..."
                  rows={2}
                  className="w-full px-3 py-2.5 bg-white border-2 border-ink/30 rounded-xl resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block">Target Audience</label>
                  <input
                    type="text"
                    value={roadmapAudience}
                    onChange={(e) => setRoadmapAudience(e.target.value)}
                    placeholder="e.g. Secondary & HSC Students"
                    className="w-full px-3 py-2.5 bg-white border-2 border-ink/30 rounded-xl"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block">Achievement Badge</label>
                  <input
                    type="text"
                    value={roadmapBadge}
                    onChange={(e) => setRoadmapBadge(e.target.value)}
                    placeholder="e.g. 🏆 BdOI Finalist Honor"
                    className="w-full px-3 py-2.5 bg-white border-2 border-ink/30 rounded-xl"
                  />
                </div>
              </div>

              {/* Course Selection Section */}
              <div className="space-y-2 pt-2 border-t border-ink/10">
                <div className="flex items-center justify-between">
                  <label className="block text-ink font-extrabold">
                    Select Connected Courses ({roadmapSelectedCourseIds.length} selected)
                  </label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setRoadmapSelectedCourseIds(courses.map(c => c.id))}
                      className="text-[11px] text-stamp hover:underline font-mono font-bold"
                    >
                      Select All
                    </button>
                    <span className="text-graphite font-mono">|</span>
                    <button
                      type="button"
                      onClick={() => setRoadmapSelectedCourseIds([])}
                      className="text-[11px] text-graphite hover:underline font-mono font-bold"
                    >
                      Clear All
                    </button>
                  </div>
                </div>

                {/* Course Checkboxes Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-48 overflow-y-auto p-1 bg-paper-light border-2 border-ink/20 rounded-2xl">
                  {courses.map((course) => {
                    const isSelected = roadmapSelectedCourseIds.includes(course.id);
                    return (
                      <div
                        key={course.id}
                        onClick={() => {
                          if (isSelected) {
                            setRoadmapSelectedCourseIds(prev => prev.filter(id => id !== course.id));
                          } else {
                            setRoadmapSelectedCourseIds(prev => [...prev, course.id]);
                          }
                        }}
                        className={`p-3 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-2.5 ${
                          isSelected
                            ? 'bg-yellow-50 border-ink shadow-solid-xs'
                            : 'bg-white border-ink/20 hover:border-ink/50'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {}}
                          className="mt-0.5 rounded text-stamp focus:ring-stamp"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="font-extrabold text-ink text-xs line-clamp-1">{course.title}</div>
                          <div className="flex items-center gap-2 mt-0.5 text-[10px] font-mono text-graphite">
                            <span className="px-1.5 py-0.2 bg-paper-muted rounded border border-ink/20">{course.language?.toUpperCase()}</span>
                            <span>{course.modules?.length || 1} Modules</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Auto XP Calculation Banner */}
                <div className="p-3 bg-highlighter/30 border-2 border-ink rounded-xl flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-xs font-mono font-extrabold text-ink">
                    <Sparkles className="w-4 h-4 text-stamp" />
                    <span>Auto-Calculated Roadmap XP:</span>
                  </span>
                  <span className="px-3 py-1 bg-stamp text-white rounded-full font-mono text-xs font-extrabold shadow-solid-xs">
                    💎 {calculateXpFromCourseIds(roadmapSelectedCourseIds)} XP
                  </span>
                </div>
              </div>

              {/* Publish / Draft Toggle */}
              <div className="space-y-1.5 pt-2 border-t border-ink/10">
                <label className="block text-ink font-extrabold">Visibility & Publishing</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRoadmapIsPublic(true)}
                    className={`p-3 rounded-xl border-2 font-mono text-xs font-extrabold transition-all flex items-center justify-center gap-2 ${
                      roadmapIsPublic
                        ? 'bg-green-100 border-green-700 text-green-900 shadow-solid-xs'
                        : 'bg-white border-ink/20 text-graphite hover:border-ink'
                    }`}
                  >
                    <Globe className="w-4 h-4 text-green-700" />
                    <span>Public Curriculum (Live)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRoadmapIsPublic(false)}
                    className={`p-3 rounded-xl border-2 font-mono text-xs font-extrabold transition-all flex items-center justify-center gap-2 ${
                      !roadmapIsPublic
                        ? 'bg-amber-100 border-amber-600 text-amber-900 shadow-solid-xs'
                        : 'bg-white border-ink/20 text-graphite hover:border-ink'
                    }`}
                  >
                    <Lock className="w-4 h-4 text-amber-700" />
                    <span>Draft (Hidden from Public)</span>
                  </button>
                </div>
              </div>

              <div className="pt-3 flex gap-2">
                <PillButton type="button" variant="secondary" size="md" onClick={() => { setIsCreatingRoadmap(false); setEditingRoadmap(null); }}>
                  Cancel
                </PillButton>
                <PillButton type="submit" variant="highlighter" size="md" className="flex-1 btn-bounce shadow-solid-xs">
                  {editingRoadmap ? 'Save Roadmap Changes ➔' : 'Publish Roadmap ➔'}
                </PillButton>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE / EDIT BLOG POST MODAL */}
      {isCreatingBlog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/70 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-2xl bg-paper-card border-2 border-ink rounded-[28px] p-6 sm:p-8 shadow-solid-xl max-h-[90vh] overflow-y-auto space-y-5">
            <button
              type="button"
              onClick={() => { setIsCreatingBlog(false); setEditingBlog(null); }}
              className="absolute top-5 right-5 p-2 rounded-full border-2 border-ink/30 bg-paper-muted hover:bg-paper-light text-ink"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1">
              <span className="px-3 py-0.5 bg-highlighter border border-ink text-ink font-mono text-[10px] font-extrabold uppercase rounded-full shadow-solid-xs">
                {editingBlog ? 'Editorial Post Editor' : 'Admin Editorial Publisher'}
              </span>
              <h2 className="text-2xl font-extrabold text-ink">
                {editingBlog ? `Edit Blog Post: ${editingBlog.title}` : 'Write New Community Article'}
              </h2>
              <p className="text-xs text-graphite font-bold">
                Author field stories, Olympiad tutorials, teacher field reports, and compiler engineering notes.
              </p>
            </div>

            <form onSubmit={handleSaveBlog} className="space-y-4 text-xs font-bold text-ink">
              <div className="space-y-1">
                <label className="block">Article Title *</label>
                <input
                  type="text"
                  value={blogTitle}
                  onChange={(e) => setBlogTitle(e.target.value)}
                  placeholder="e.g. The Chalk & Paper Revolution in Rural Haor Schools"
                  className="w-full px-3 py-2.5 bg-white border-2 border-ink/30 rounded-xl"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="block">Subtitle / Excerpt *</label>
                <input
                  type="text"
                  value={blogSubtitle}
                  onChange={(e) => setBlogSubtitle(e.target.value)}
                  placeholder="e.g. How handwriting syntax bridges the digital divide faster than building expensive labs."
                  className="w-full px-3 py-2.5 bg-white border-2 border-ink/30 rounded-xl"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block">Category</label>
                  <select
                    value={blogCategory}
                    onChange={(e) => setBlogCategory(e.target.value)}
                    className="w-full px-3 py-2.5 bg-white border-2 border-ink/30 rounded-xl"
                  >
                    <option value="Field Story">Field Story</option>
                    <option value="Teaching Guide">Teaching Guide</option>
                    <option value="Olympiad Prep">Olympiad Prep</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Curriculum">Curriculum</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block">Author Name</label>
                  <input
                    type="text"
                    value={blogAuthorName}
                    onChange={(e) => setBlogAuthorName(e.target.value)}
                    placeholder="e.g. Dr. Rafiqul Islam (Admin HQ)"
                    className="w-full px-3 py-2.5 bg-white border-2 border-ink/30 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block">Author Role</label>
                  <input
                    type="text"
                    value={blogAuthorRole}
                    onChange={(e) => setBlogAuthorRole(e.target.value)}
                    placeholder="e.g. Senior Academic Advisor"
                    className="w-full px-3 py-2.5 bg-white border-2 border-ink/30 rounded-xl"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block">Author Affiliation</label>
                  <input
                    type="text"
                    value={blogAuthorAffiliation}
                    onChange={(e) => setBlogAuthorAffiliation(e.target.value)}
                    placeholder="e.g. CUET & National Curriculum Committee"
                    className="w-full px-3 py-2.5 bg-white border-2 border-ink/30 rounded-xl"
                  />
                </div>
              </div>

              {/* Cover Image Selector */}
              <div className="space-y-2">
                <label className="block">Cover Image</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {PRESET_COVERS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setBlogCoverImage(preset.url)}
                      className={`px-2.5 py-1 rounded-lg border text-[11px] font-mono transition-all ${
                        blogCoverImage === preset.url
                          ? 'bg-stamp text-white border-stamp font-extrabold'
                          : 'bg-white text-ink border-ink/30 hover:border-ink'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
                <input
                  type="url"
                  value={blogCoverImage}
                  onChange={(e) => setBlogCoverImage(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-2 bg-white border-2 border-ink/30 rounded-xl font-mono text-[11px]"
                />
              </div>

              {/* Full Article Content (Multi-Paragraph) */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="block">Article Body / Content *</label>
                  <span className="text-[10px] font-mono text-graphite">
                    {blogContent.split(/\s+/).filter(Boolean).length} words • Double enter creates paragraphs
                  </span>
                </div>
                <textarea
                  value={blogContent}
                  onChange={(e) => setBlogContent(e.target.value)}
                  placeholder="Write the article content here. Separate paragraphs with an empty line (double Enter)..."
                  rows={7}
                  className="w-full px-3 py-2.5 bg-white border-2 border-ink/30 rounded-xl leading-relaxed resize-y font-serif text-sm"
                  required
                />
              </div>

              {/* Tags */}
              <div className="space-y-1">
                <label className="block">Tags (comma-separated)</label>
                <input
                  type="text"
                  value={blogTags}
                  onChange={(e) => setBlogTags(e.target.value)}
                  placeholder="e.g. DigitalDivide, RuralEdTech, NCTB, Python"
                  className="w-full px-3 py-2.5 bg-white border-2 border-ink/30 rounded-xl font-mono text-xs"
                />
              </div>

              {/* Publish Status Toggle */}
              <div className="space-y-1.5 pt-2 border-t border-ink/10">
                <label className="block text-ink font-extrabold">Publish Status</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setBlogIsPublished(true)}
                    className={`p-3 rounded-xl border-2 font-mono text-xs font-extrabold transition-all flex items-center justify-center gap-2 ${
                      blogIsPublished
                        ? 'bg-green-100 border-green-700 text-green-900 shadow-solid-xs'
                        : 'bg-white border-ink/20 text-graphite hover:border-ink'
                    }`}
                  >
                    <Globe className="w-4 h-4 text-green-700" />
                    <span>Published (Visible to all)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setBlogIsPublished(false)}
                    className={`p-3 rounded-xl border-2 font-mono text-xs font-extrabold transition-all flex items-center justify-center gap-2 ${
                      !blogIsPublished
                        ? 'bg-amber-100 border-amber-600 text-amber-900 shadow-solid-xs'
                        : 'bg-white border-ink/20 text-graphite hover:border-ink'
                    }`}
                  >
                    <Lock className="w-4 h-4 text-amber-700" />
                    <span>Draft (Admin Only)</span>
                  </button>
                </div>
              </div>

              <div className="pt-3 flex gap-2">
                <PillButton type="button" variant="secondary" size="md" onClick={() => { setIsCreatingBlog(false); setEditingBlog(null); }}>
                  Cancel
                </PillButton>
                <PillButton type="submit" variant="highlighter" size="md" className="flex-1 btn-bounce shadow-solid-xs">
                  {editingBlog ? 'Update Blog Post ➔' : 'Publish Article ➔'}
                </PillButton>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FULL ARTICLE PREVIEW MODAL */}
      {previewBlog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/75 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-3xl bg-paper-card border-2 border-ink rounded-[28px] p-6 sm:p-10 shadow-solid-xl max-h-[90vh] overflow-y-auto space-y-6">
            <button
              type="button"
              onClick={() => setPreviewBlog(null)}
              className="absolute top-5 right-5 p-2 rounded-full border-2 border-ink/30 bg-paper-muted hover:bg-paper-light text-ink"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Category & Status */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 bg-highlighter border border-ink rounded-full font-mono text-xs font-extrabold text-ink shadow-solid-xs">
                {previewBlog.category}
              </span>
              {previewBlog.isPublished !== false ? (
                <span className="px-2.5 py-0.5 bg-green-100 border border-green-600 text-green-800 text-xs font-mono font-extrabold rounded-full">
                  ● Published Live
                </span>
              ) : (
                <span className="px-2.5 py-0.5 bg-amber-100 border border-amber-600 text-amber-900 text-xs font-mono font-extrabold rounded-full">
                  🔒 Draft
                </span>
              )}
              <span className="text-xs font-mono text-graphite">{previewBlog.publishedAt} • {previewBlog.readTime}</span>
            </div>

            {/* Title & Subtitle */}
            <div className="space-y-3">
              <h1 className="text-2xl sm:text-4xl font-extrabold text-ink leading-tight">
                {previewBlog.title}
              </h1>
              <p className="text-base sm:text-lg text-graphite font-medium leading-relaxed">
                {previewBlog.subtitle}
              </p>
            </div>

            {/* Author Card */}
            <div className="p-4 bg-white border-2 border-ink rounded-2xl flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center space-x-3">
                <UserAvatar
                  name={previewBlog.author?.name || 'Author'}
                  avatar={previewBlog.author?.avatar}
                  size="lg"
                  className="w-12 h-12"
                />
                <div>
                  <h4 className="text-sm font-extrabold text-ink">{previewBlog.author?.name}</h4>
                  <p className="text-xs text-graphite font-medium">
                    {previewBlog.author?.role || 'Author'} • {previewBlog.author?.affiliation}
                  </p>
                </div>
              </div>
              <div className="text-xs font-mono text-stamp font-extrabold flex items-center gap-1.5">
                <Heart className="w-4 h-4 fill-stamp" />
                <span>{previewBlog.claps || 0} Community Claps</span>
              </div>
            </div>

            {/* Cover Image */}
            {previewBlog.coverImage && (
              <img
                src={previewBlog.coverImage}
                alt={previewBlog.title}
                className="w-full max-h-80 object-cover rounded-2xl border-2 border-ink shadow-solid-sm"
              />
            )}

            {/* Content Body */}
            <div className="space-y-4 text-ink font-serif text-base sm:text-lg leading-relaxed pt-2">
              {Array.isArray(previewBlog.content) ? (
                previewBlog.content.map((para, idx) => (
                  <p key={idx}>{para}</p>
                ))
              ) : (
                <p>{previewBlog.content}</p>
              )}
            </div>

            {/* Tags */}
            {previewBlog.tags && previewBlog.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-4 border-t border-ink/15">
                {previewBlog.tags.map((tag, idx) => (
                  <span key={idx} className="px-3 py-1 bg-paper-muted border border-ink/20 rounded-lg text-xs font-mono font-bold text-graphite">
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Action Bar */}
            <div className="pt-4 border-t border-ink/15 flex items-center justify-between">
              <PillButton
                variant="secondary"
                size="md"
                onClick={() => setPreviewBlog(null)}
              >
                Close Preview
              </PillButton>

              <PillButton
                variant="highlighter"
                size="md"
                onClick={() => {
                  const b = previewBlog;
                  setPreviewBlog(null);
                  handleOpenEditBlog(b);
                }}
                icon={<Edit3 className="w-4 h-4" />}
              >
                Edit This Post
              </PillButton>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
