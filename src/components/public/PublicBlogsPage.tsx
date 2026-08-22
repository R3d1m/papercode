import React, { useState } from 'react';
import { BentoCard } from '../common/BentoCard';
import { PillButton } from '../common/PillButton';
import { 
  BookOpen, 
  PenTool, 
  Sparkles, 
  Clock, 
  Calendar, 
  User, 
  Tag, 
  Heart, 
  Share2, 
  ArrowRight, 
  Search, 
  X, 
  CheckCircle2,
  GraduationCap,
  MessageSquare,
  Bookmark
} from 'lucide-react';

export interface BlogPost {
  id: string;
  title: string;
  subtitle: string;
  category: 'Field Story' | 'Teaching Guide' | 'Olympiad Prep' | 'Engineering' | 'Curriculum';
  coverImage: string;
  author: {
    name: string;
    role: string;
    avatar: string;
    affiliation: string;
  };
  publishedAt: string;
  readTime: string;
  claps: number;
  content: string[];
  tags: string[];
}

interface PublicBlogsPageProps {
  onOpenAuth: (tab: 'login' | 'signup') => void;
}

export const PublicBlogsPage: React.FC<PublicBlogsPageProps> = ({ onOpenAuth }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [writeModalOpen, setWriteModalOpen] = useState<boolean>(false);
  const [clappedPosts, setClappedPosts] = useState<Record<string, number>>({});

  // Seed Blog Articles
  const [posts, setPosts] = useState<BlogPost[]>([
    {
      id: 'blog-01',
      title: 'The Chalk & Paper Revolution: Why 90% of Bangladesh’s Future Coders Don’t Need Laptops to Start',
      subtitle: 'How handwriting syntax on paper khata bridges the digital divide faster than building expensive computer labs.',
      category: 'Field Story',
      coverImage: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&auto=format&fit=crop&q=80',
      author: {
        name: 'Engr. Nusrat Jahan',
        role: 'Curriculum Lead',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
        affiliation: 'CUET EdTech Research Lab'
      },
      publishedAt: 'Aug 18, 2026',
      readTime: '6 min read',
      claps: 142,
      tags: ['DigitalDivide', 'RuralEdTech', 'NCTB', 'Python'],
      content: [
        'When we first visited government high schools in Sunamganj haor region, we discovered a stark reality: 45 students shared two broken desktop computers with missing keyboard keys. During frequent monsoon power cuts, the computer room remained completely locked.',
        'Yet, every single student had a notebook, a ballpoint pen, and a thirst to learn. That was when we realized: coding is not about mechanical keyboards—coding is about logical thinking, algorithmic precision, and structured problem solving.',
        'By allowing students to handwrite clean Python and C code on regular ruled paper, we eliminated the multi-thousand dollar hardware bottleneck. A single teacher with a budget smartphone can scan an entire classroom’s homework in 2 minutes, running automated unit tests on our cloud sandboxes.',
        'The results have been astonishing: students in rural schools are now solving loop and array problems with higher conceptual retention than urban students who rely on copy-pasting code on PCs.'
      ]
    },
    {
      id: 'blog-02',
      title: 'How to Train for the Bangladesh Olympiad in Informatics (BdOI) on Pen & Paper',
      subtitle: 'A step-by-step training blueprint for high schoolers without full-time computer lab access.',
      category: 'Olympiad Prep',
      coverImage: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80',
      author: {
        name: 'Tanvir Hossain',
        role: 'BdOI Finalist & Student',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        affiliation: 'Chittagong Collegiate School'
      },
      publishedAt: 'Aug 12, 2026',
      readTime: '8 min read',
      claps: 238,
      tags: ['CompetitiveProgramming', 'BdOI', 'C++', 'Algorithms'],
      content: [
        'Many beginners believe you need dual monitors and fancy mechanical keyboards to practice competitive programming. I qualified for the National Olympiad in Informatics preliminary round by doing 80% of my practice on 50-Taka exercise khatas.',
        'When you write code on paper, you cannot rely on IDE auto-complete or endless trial-and-error runs. You are forced to dry-run loops in your head, track variable states in margin tables, and calculate time complexity before pen touches paper.',
        'Here is my daily 3-step routine: 1) Read the algorithm problem statement; 2) Handwrite the C++ STL logic and dry-run with test values; 3) Scan the page with PaperCode to instantly verify if it passes edge cases.',
        'Paper coding built my algorithmic muscle memory far better than typing ever did.'
      ]
    },
    {
      id: 'blog-03',
      title: 'Under the Hood of PaperCode: How Our AST Engine Reads Smudged Bangla & Pencil Handwriting',
      subtitle: 'The machine learning and lexical parsing architecture that achieves 98.4% OCR accuracy on low-end Androids.',
      category: 'Engineering',
      coverImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
      author: {
        name: 'Redwan Ahmed',
        role: 'Lead Architect',
        avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
        affiliation: 'CUET CSE Alum'
      },
      publishedAt: 'Aug 05, 2026',
      readTime: '10 min read',
      claps: 310,
      tags: ['MachineLearning', 'OCR', 'Compilers', 'CloudSandbox'],
      content: [
        'Transcribing handwritten computer code is fundamentally different from scanning handwritten prose. In standard literature, a missing comma or quotation mark is a typo; in Python or C++, a missing colon or unmatched parenthesis crashes the compiler entirely.',
        'Our optical pipeline utilizes a 2-stage architecture: Stage 1 performs perspective rectification and line segmentation using adaptive binarization that filters out background notebook grid lines and haor humidity smudges.',
        'Stage 2 passes candidate tokens through an Abstract Syntax Tree (AST) grammar repair model. If a student writes "for i in range(5)" and leaves out the trailing colon, the parser detects the loop structure and suggests syntax correction with confidence metrics.',
        'The sanitized code is then dispatched to secure micro-sandboxes, executing test cases in under 0.028 seconds and streaming stdout directly back to the mobile web interface.'
      ]
    },
    {
      id: 'blog-04',
      title: 'A Teacher’s Field Report: Grading 120 Handwritten C Programs in 10 Minutes',
      subtitle: 'Eliminating teacher burnout and manual paper grading in high school ICT practical exams.',
      category: 'Teaching Guide',
      coverImage: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&auto=format&fit=crop&q=80',
      author: {
        name: 'Dr. Rafiqul Islam',
        role: 'Senior Academic Advisor',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        affiliation: 'CUET & Curriculum Committee'
      },
      publishedAt: 'Jul 29, 2026',
      readTime: '5 min read',
      claps: 185,
      tags: ['TeacherTools', 'BatchGrading', 'HSC_ICT', 'EducationReform'],
      content: [
        'For decades, Bangladeshi ICT teachers faced an impossible dilemma during practical exams: either spend 6 hours manually reading handwriting on paper, or watch 80 students crowd around 4 working lab PCs.',
        'With PaperCode’s batch grading workflow, teachers simply take continuous photos of student answer scripts. The AI automatically groups submissions by assignment ID, runs test cases against the official rubric, and flags edge case errors with visual diffs.',
        'Teachers maintain complete control to apply class-wide curves, adjust partial points, and export certified grade sheets to Excel with a single click.',
        'This gives teachers their evenings back and provides students with instantaneous feedback while the concepts are still fresh in their minds.'
      ]
    },
    {
      id: 'blog-05',
      title: 'Mastering NCTB Class 9-10 ICT Chapter 5: Key Flowcharts and Algorithms on Paper',
      subtitle: 'The must-know programs for secondary board exams: Prime numbers, Fibonacci, and Factorials.',
      category: 'Curriculum',
      coverImage: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop&q=80',
      author: {
        name: 'Dr. Sumaiya Parveen',
        role: 'Senior Moderator',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
        affiliation: 'National Curriculum Board'
      },
      publishedAt: 'Jul 20, 2026',
      readTime: '7 min read',
      claps: 195,
      tags: ['Class9_10', 'Chapter5', 'Flowcharts', 'SSC_ICT'],
      content: [
        'Chapter 5 of the National Secondary ICT textbook is where students transition from computer literacy to computational thinking. Yet, many students struggle with abstract syntax when taught only on whiteboards.',
        'In this guide, we break down the 5 cornerstone algorithms required for the SSC practical exam: 1) Determining Prime Numbers with modulo loops; 2) Generating the Fibonacci series; 3) Calculating Factorials; 4) Checking Leap Years; and 5) Finding the Greatest Common Divisor (GCD).',
        'By drafting the flowchart on the left page of your khata and the corresponding Python code on the right page, you develop an unbreakable link between logic flow and syntax rules.'
      ]
    }
  ]);

  // Form State for Submitting New Article
  const [newTitle, setNewTitle] = useState('');
  const [newSubtitle, setNewSubtitle] = useState('');
  const [newCategory, setNewCategory] = useState<'Field Story' | 'Teaching Guide' | 'Olympiad Prep' | 'Engineering' | 'Curriculum'>('Field Story');
  const [newAuthorName, setNewAuthorName] = useState('');
  const [newAffiliation, setNewAffiliation] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newTags, setNewTags] = useState('');

  const categories = ['All', 'Field Story', 'Teaching Guide', 'Olympiad Prep', 'Engineering', 'Curriculum'];

  const filteredPosts = posts.filter(post => {
    const matchesCat = selectedCategory === 'All' || post.category === selectedCategory;
    const matchesSearch = 
      (post?.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (post?.subtitle || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (post?.author?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const handleClap = (postId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setClappedPosts(prev => ({
      ...prev,
      [postId]: (prev[postId] || 0) + 1
    }));
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, claps: p.claps + 1 } : p));
    if (selectedPost && selectedPost.id === postId) {
      setSelectedPost(prev => prev ? { ...prev, claps: prev.claps + 1 } : null);
    }
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim() || !newAuthorName.trim()) return;

    const newPost: BlogPost = {
      id: 'blog-' + Date.now(),
      title: newTitle.trim(),
      subtitle: newSubtitle.trim() || 'A community article shared on PaperCode Bangladesh.',
      category: newCategory,
      coverImage: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&auto=format&fit=crop&q=80',
      author: {
        name: newAuthorName.trim(),
        role: 'Community Author',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        affiliation: newAffiliation.trim() || 'PaperCode Community Member'
      },
      publishedAt: 'Today',
      readTime: Math.max(3, Math.ceil(newContent.split(' ').length / 150)) + ' min read',
      claps: 1,
      tags: newTags ? newTags.split(',').map(t => t.trim().replace(/^#/, '')) : ['CommunityArticle', 'PaperCode'],
      content: newContent.split('\n\n').filter(Boolean)
    };

    setPosts(prev => [newPost, ...prev]);
    setWriteModalOpen(false);
    setNewTitle('');
    setNewSubtitle('');
    setNewContent('');
    setNewAuthorName('');
    setNewAffiliation('');
    setNewTags('');
    setSelectedPost(newPost);
  };

  return (
    <div className="space-y-12 animate-fadeIn pb-16">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b-2 border-ink/15 pb-8">
        <div className="space-y-3 max-w-2xl">
          <div className="doodle-badge bg-highlighter text-ink">
            <BookOpen className="w-4 h-4 text-stamp" />
            <span>Community & Editorial Articles</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-ink tracking-tight">
            PaperCode Articles & Stories
          </h1>
          <p className="text-graphite text-base sm:text-lg">
            Perspectives on bridging the rural digital divide, Olympiad training blueprints, teacher guides, and compiler engineering.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <PillButton
            variant="primary"
            size="md"
            onClick={() => setWriteModalOpen(true)}
            className="btn-bounce shadow-solid-sm flex-shrink-0"
            icon={<PenTool className="w-4 h-4" />}
          >
            Write an Article ➔
          </PillButton>
        </div>
      </div>

      {/* Category Pills & Search Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={'px-4 py-2 rounded-full text-xs font-extrabold whitespace-nowrap transition-all btn-bounce ' + (selectedCategory === cat ? 'bg-highlighter text-ink border-2 border-ink shadow-solid-xs' : 'bg-paper-card text-graphite hover:text-ink border border-ink/20')}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-72 flex items-center">
          <Search className="w-3.5 h-3.5 text-graphite absolute left-3 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search articles or authors..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border-2 border-ink bg-paper-card text-xs font-bold shadow-solid-xs focus:outline-none focus:ring-2 focus:ring-highlighter"
          />
        </div>

      </div>

      {/* FEATURED HERO ARTICLE (if available) */}
      {filteredPosts.length > 0 && selectedCategory === 'All' && !searchTerm && (
        <div 
          onClick={() => setSelectedPost(filteredPosts[0])}
          className="cursor-pointer group"
        >
          <BentoCard variant="white" className="p-0 border-2 border-ink overflow-hidden group-hover:shadow-solid-lg transition-all">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              
              <div className="relative aspect-video lg:aspect-auto overflow-hidden bg-black/10">
                <img
                  src={filteredPosts[0].coverImage}
                  alt={filteredPosts[0].title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 px-3 py-1 bg-highlighter border-2 border-ink rounded-full text-xs font-extrabold text-ink shadow-solid-xs">
                  ⭐ Featured Story
                </div>
              </div>

              <div className="p-6 sm:p-10 flex flex-col justify-between space-y-6">
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-xs font-mono font-bold text-graphite">
                    <span className="text-stamp font-extrabold uppercase">{filteredPosts[0].category}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {filteredPosts[0].readTime}</span>
                    <span>•</span>
                    <span>{filteredPosts[0].publishedAt}</span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-extrabold text-ink leading-snug group-hover:text-stamp transition-colors">
                    {filteredPosts[0].title}
                  </h2>

                  <p className="text-xs sm:text-sm text-graphite leading-relaxed line-clamp-3">
                    {filteredPosts[0].subtitle}
                  </p>
                </div>

                <div className="pt-4 border-t border-ink/15 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src={filteredPosts[0].author.avatar}
                      alt={filteredPosts[0].author.name}
                      className="w-10 h-10 rounded-full border-2 border-ink object-cover"
                    />
                    <div>
                      <strong className="text-xs text-ink block leading-none">{filteredPosts[0].author.name}</strong>
                      <span className="text-[10px] text-graphite font-medium">{filteredPosts[0].author.affiliation}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={(e) => handleClap(filteredPosts[0].id, e)}
                      className="p-2 rounded-full border border-ink/30 hover:bg-highlighter text-ink flex items-center gap-1 text-xs font-mono font-bold transition-colors"
                    >
                      <Heart className={'w-4 h-4 text-stamp ' + (clappedPosts[filteredPosts[0].id] ? 'fill-stamp' : '')} />
                      <span>{filteredPosts[0].claps}</span>
                    </button>
                    <span className="text-xs font-bold text-stamp group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                      Read ➔
                    </span>
                  </div>
                </div>

              </div>

            </div>
          </BentoCard>
        </div>
      )}

      {/* ARTICLES GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {(selectedCategory === 'All' && !searchTerm ? filteredPosts.slice(1) : filteredPosts).map((post) => (
          <BentoCard
            key={post.id}
            variant="white"
            className="p-0 border-2 border-ink overflow-hidden group hover:shadow-solid-lg transition-all flex flex-col justify-between cursor-pointer"
            onClick={() => setSelectedPost(post)}
          >
            <div className="space-y-4">
              
              {/* Cover Thumbnail */}
              <div className="relative aspect-video overflow-hidden border-b-2 border-ink bg-black/10">
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 bg-highlighter border border-ink rounded-full text-[10px] font-extrabold text-ink shadow-solid-xs">
                  {post.category}
                </div>
              </div>

              {/* Title & Excerpt */}
              <div className="p-5 space-y-2.5">
                <div className="flex items-center space-x-2 text-[11px] font-mono font-bold text-graphite">
                  <Clock className="w-3 h-3 text-stamp" />
                  <span>{post.readTime}</span>
                  <span>•</span>
                  <span>{post.publishedAt}</span>
                </div>

                <h3 className="text-lg font-extrabold text-ink leading-snug group-hover:text-stamp transition-colors">
                  {post.title}
                </h3>

                <p className="text-xs text-graphite line-clamp-3 leading-relaxed">
                  {post.subtitle}
                </p>

                {/* Tags */}
                <div className="flex items-center gap-1.5 flex-wrap pt-2">
                  {post.tags.slice(0, 3).map((tag, i) => (
                    <span key={i} className="text-[10px] font-mono font-bold text-graphite bg-paper-muted px-2 py-0.5 rounded-md border border-ink/15">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

            </div>

            {/* Author Footer */}
            <div className="p-5 pt-0 border-t border-ink/15 mt-4 pt-3 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2.5">
                <img
                  src={post.author.avatar}
                  alt={post.author.name}
                  className="w-7 h-7 rounded-full border border-ink object-cover"
                />
                <div className="overflow-hidden">
                  <strong className="text-ink text-xs block leading-none truncate max-w-[130px]">{post.author.name}</strong>
                  <span className="text-[9px] text-graphite font-mono truncate block">{post.author.role}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={(e) => handleClap(post.id, e)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-full border border-ink/20 hover:bg-highlighter text-ink font-mono text-xs font-bold transition-colors"
              >
                <Heart className={'w-3.5 h-3.5 text-stamp ' + (clappedPosts[post.id] ? 'fill-stamp' : '')} />
                <span>{post.claps}</span>
              </button>
            </div>

          </BentoCard>
        ))}
      </div>

      {filteredPosts.length === 0 && (
        <div className="p-12 bg-paper-card border-2 border-ink rounded-2xl text-center space-y-3">
          <p className="text-base font-bold text-ink">No articles found matching &quot;{searchTerm}&quot; in {selectedCategory}.</p>
          <button
            onClick={() => { setSearchTerm(''); setSelectedCategory('All'); }}
            className="text-xs font-extrabold text-stamp hover:underline"
          >
            Clear filters & view all articles ➔
          </button>
        </div>
      )}

      {/* FULL ARTICLE READER MODAL */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-3xl bg-paper-card border-3 border-ink rounded-[28px] p-6 sm:p-10 shadow-solid-xl space-y-6 max-h-[90vh] overflow-y-auto">
            
            {/* Header & Close */}
            <div className="flex items-start justify-between gap-4 border-b-2 border-ink/15 pb-4">
              <div className="space-y-1">
                <span className="px-3 py-1 bg-highlighter border border-ink rounded-full text-xs font-extrabold text-ink">
                  {selectedPost.category}
                </span>
                <span className="text-xs font-mono text-graphite pl-2">
                  {selectedPost.readTime} • {selectedPost.publishedAt}
                </span>
              </div>
              <button
                onClick={() => setSelectedPost(null)}
                className="p-2 rounded-full border-2 border-ink bg-paper-muted hover:bg-red-100 text-ink transition-colors flex-shrink-0"
                aria-label="Close article"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Title & Subtitle */}
            <div className="space-y-3">
              <h2 className="text-2xl sm:text-4xl font-extrabold text-ink leading-tight">
                {selectedPost.title}
              </h2>
              <p className="text-sm sm:text-base text-graphite font-medium leading-relaxed">
                {selectedPost.subtitle}
              </p>
            </div>

            {/* Author Profile Card */}
            <div className="p-4 bg-paper-muted rounded-2xl border-2 border-ink/20 flex items-center justify-between gap-3">
              <div className="flex items-center space-x-3">
                <img
                  src={selectedPost.author.avatar}
                  alt={selectedPost.author.name}
                  className="w-12 h-12 rounded-full border-2 border-ink object-cover"
                />
                <div>
                  <strong className="text-sm text-ink block">{selectedPost.author.name}</strong>
                  <span className="text-xs text-stamp font-bold block">{selectedPost.author.role}</span>
                  <span className="text-[11px] font-mono text-graphite">{selectedPost.author.affiliation}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={(e) => handleClap(selectedPost.id, e)}
                className="px-4 py-2 bg-highlighter hover:bg-highlighter-hover border-2 border-ink rounded-full text-xs font-extrabold text-ink flex items-center gap-1.5 shadow-solid-xs btn-bounce"
              >
                <Heart className="w-4 h-4 text-stamp fill-stamp" />
                <span>Applaud ({selectedPost.claps})</span>
              </button>
            </div>

            {/* Cover Image */}
            <div className="rounded-2xl overflow-hidden border-2 border-ink aspect-video max-h-80 w-full">
              <img
                src={selectedPost.coverImage}
                alt={selectedPost.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Article Body Paragraphs */}
            <div className="space-y-4 text-sm sm:text-base text-ink leading-relaxed font-sans pt-2">
              {selectedPost.content.map((paragraph, i) => (
                <p key={i} className="leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Tags */}
            <div className="pt-4 border-t border-ink/15 flex items-center gap-2 flex-wrap">
              <Tag className="w-4 h-4 text-stamp" />
              {selectedPost.tags.map((tag, i) => (
                <span key={i} className="px-3 py-1 bg-paper-muted border border-ink/20 rounded-full text-xs font-mono font-bold text-ink">
                  #{tag}
                </span>
              ))}
            </div>

            {/* Call to Action Banner at bottom of article */}
            <div className="p-6 bg-highlighter/20 border-2 border-ink rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
              <div>
                <strong className="text-base text-ink block font-extrabold">Ready to handwrite your first program?</strong>
                <p className="text-xs text-graphite mt-0.5">Join thousands of students and teachers coding with pen and paper in Bangladesh.</p>
              </div>
              <PillButton
                variant="primary"
                size="md"
                onClick={() => { setSelectedPost(null); onOpenAuth('signup'); }}
                className="btn-bounce shadow-solid-xs flex-shrink-0"
                icon={<GraduationCap className="w-4 h-4" />}
              >
                Sign Up Free ➔
              </PillButton>
            </div>

          </div>
        </div>
      )}

      {/* WRITE AN ARTICLE MODAL (FOR EVERYONE) */}
      {writeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-2xl bg-paper-card border-3 border-ink rounded-[28px] p-6 sm:p-8 shadow-solid-xl space-y-6 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b-2 border-ink/15 pb-4">
              <div className="space-y-0.5">
                <div className="doodle-badge bg-highlighter text-ink">
                  <span>✍️ Community Contributor</span>
                </div>
                <h3 className="text-2xl font-extrabold text-ink pt-1">
                  Write & Publish an Article
                </h3>
              </div>
              <button
                onClick={() => setWriteModalOpen(false)}
                className="p-2 rounded-full border-2 border-ink bg-paper-muted hover:bg-red-100 text-ink transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-4">
              
              {/* Title */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-extrabold uppercase text-ink block">
                  Article Title *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="e.g. My Experience Teaching Python in rural Chittagong"
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-ink text-sm font-bold bg-white focus:outline-none focus:ring-2 focus:ring-highlighter"
                />
              </div>

              {/* Subtitle */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-extrabold uppercase text-ink block">
                  Summary / Subtitle
                </label>
                <input
                  type="text"
                  value={newSubtitle}
                  onChange={e => setNewSubtitle(e.target.value)}
                  placeholder="A brief 1-2 sentence hook for readers"
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-ink text-xs font-medium bg-white focus:outline-none focus:ring-2 focus:ring-highlighter"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Category */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-extrabold uppercase text-ink block">
                    Category *
                  </label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value as any)}
                    className="w-full px-4 py-2.5 rounded-xl border-2 border-ink text-xs font-bold bg-white focus:outline-none focus:ring-2 focus:ring-highlighter"
                  >
                    <option value="Field Story">🌾 Field Story</option>
                    <option value="Teaching Guide">👩‍🏫 Teaching Guide</option>
                    <option value="Olympiad Prep">🏆 Olympiad Prep</option>
                    <option value="Engineering">⚡ Engineering & Tech</option>
                    <option value="Curriculum">📖 National Curriculum</option>
                  </select>
                </div>

                {/* Author Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-extrabold uppercase text-ink block">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newAuthorName}
                    onChange={e => setNewAuthorName(e.target.value)}
                    placeholder="e.g. Nusrat Jahan"
                    className="w-full px-4 py-2.5 rounded-xl border-2 border-ink text-xs font-bold bg-white focus:outline-none focus:ring-2 focus:ring-highlighter"
                  />
                </div>

              </div>

              {/* Affiliation & Tags */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-extrabold uppercase text-ink block">
                    School / Organization
                  </label>
                  <input
                    type="text"
                    value={newAffiliation}
                    onChange={e => setNewAffiliation(e.target.value)}
                    placeholder="e.g. Chittagong Collegiate School"
                    className="w-full px-4 py-2.5 rounded-xl border-2 border-ink text-xs font-medium bg-white focus:outline-none focus:ring-2 focus:ring-highlighter"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-extrabold uppercase text-ink block">
                    Tags (Comma-separated)
                  </label>
                  <input
                    type="text"
                    value={newTags}
                    onChange={e => setNewTags(e.target.value)}
                    placeholder="e.g. Python, NCTB, HaorRegion"
                    className="w-full px-4 py-2.5 rounded-xl border-2 border-ink text-xs font-mono bg-white focus:outline-none focus:ring-2 focus:ring-highlighter"
                  />
                </div>
              </div>

              {/* Content */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-extrabold uppercase text-ink block">
                  Article Content (Separate paragraphs with blank lines) *
                </label>
                <textarea
                  required
                  rows={6}
                  value={newContent}
                  onChange={e => setNewContent(e.target.value)}
                  placeholder="Write your article thoughts, experience, or teaching tips here..."
                  className="w-full p-4 rounded-xl border-2 border-ink text-xs font-sans leading-relaxed bg-white focus:outline-none focus:ring-2 focus:ring-highlighter"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setWriteModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-graphite hover:text-ink"
                >
                  Cancel
                </button>

                <PillButton
                  type="submit"
                  variant="primary"
                  size="md"
                  icon={<PenTool className="w-4 h-4" />}
                  className="btn-bounce shadow-solid-xs"
                >
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
