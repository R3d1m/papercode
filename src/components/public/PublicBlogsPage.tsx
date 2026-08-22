import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BlogPost, BlogComment } from '../../types';
import { BentoCard } from '../common/BentoCard';
import { PillButton } from '../common/PillButton';
import { UserAvatar } from '../common/UserAvatar';
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
  Bookmark,
  Trash2,
  Edit3,
  Flame,
  Lightbulb,
  Send,
  ShieldCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';

export type { BlogPost };

interface PublicBlogsPageProps {
  onOpenAuth: (tab: 'login' | 'signup') => void;
}

export const PublicBlogsPage: React.FC<PublicBlogsPageProps> = ({ onOpenAuth }) => {
  const { 
    blogs, 
    addBlog, 
    updateBlog, 
    deleteBlog, 
    clapBlog, 
    reactToBlog, 
    addBlogComment, 
    deleteBlogComment, 
    currentUser, 
    activeMode 
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [writeModalOpen, setWriteModalOpen] = useState<boolean>(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);

  // Form State for Submitting / Editing Article
  const [newTitle, setNewTitle] = useState('');
  const [newSubtitle, setNewSubtitle] = useState('');
  const [newCategory, setNewCategory] = useState<'Field Story' | 'Teaching Guide' | 'Olympiad Prep' | 'Engineering' | 'Curriculum'>('Field Story');
  const [newAuthorName, setNewAuthorName] = useState('');
  const [newAffiliation, setNewAffiliation] = useState('');
  const [newCoverImage, setNewCoverImage] = useState('https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&auto=format&fit=crop&q=80');
  const [newContent, setNewContent] = useState('');
  const [newTags, setNewTags] = useState('');

  // Comment input state
  const [commentText, setCommentText] = useState('');

  const categories = ['All', 'Field Story', 'Teaching Guide', 'Olympiad Prep', 'Engineering', 'Curriculum'];

  const coverPresets = [
    { label: 'Rural School', url: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&auto=format&fit=crop&q=80' },
    { label: 'Olympiad Prep', url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80' },
    { label: 'Code & Screen', url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80' },
    { label: 'Teacher Classroom', url: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&auto=format&fit=crop&q=80' },
    { label: 'Notebook & Pen', url: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&auto=format&fit=crop&q=80' }
  ];

  const filteredPosts = (blogs || []).filter(post => {
    if (post.isPublished === false && currentUser?.role !== 'admin') return false;
    const matchesCat = selectedCategory === 'All' || post.category === selectedCategory;
    const matchesSearch = 
      (post?.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (post?.subtitle || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (post?.author?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (post.tags || []).some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const canManagePost = (post: BlogPost): boolean => {
    if (!currentUser) return false;
    if (currentUser.role === 'admin' || currentUser.role === 'moderator') return true;
    if (post.authorId && post.authorId === currentUser.id) return true;
    if (post.authorEmail && post.authorEmail === currentUser.email) return true;
    if (post.author?.name && post.author.name.toLowerCase() === currentUser.name.toLowerCase()) return true;
    return false;
  };

  const handleOpenWrite = () => {
    setEditingPost(null);
    setNewTitle('');
    setNewSubtitle('');
    setNewCategory('Field Story');
    setNewAuthorName(currentUser?.name || '');
    setNewAffiliation(currentUser?.school || 'PaperCode Community Member');
    setNewCoverImage('https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&auto=format&fit=crop&q=80');
    setNewContent('');
    setNewTags('');
    setWriteModalOpen(true);
  };

  const handleOpenEdit = (post: BlogPost, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEditingPost(post);
    setNewTitle(post.title);
    setNewSubtitle(post.subtitle || '');
    setNewCategory((post.category as any) || 'Field Story');
    setNewAuthorName(post.author?.name || currentUser?.name || '');
    setNewAffiliation(post.author?.affiliation || currentUser?.school || '');
    setNewCoverImage(post.coverImage || 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&auto=format&fit=crop&q=80');
    setNewContent(Array.isArray(post.content) ? post.content.join('\n\n') : (post.content || ''));
    setNewTags((post.tags || []).join(', '));
    setWriteModalOpen(true);
  };

  const handleDeletePost = (postId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      deleteBlog(postId);
      if (selectedPost && selectedPost.id === postId) {
        setSelectedPost(null);
      }
    }
  };

  const handleSavePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const contentParagraphs = newContent.split('\n\n').filter(p => p.trim().length > 0);
    const tagsArray = newTags ? newTags.split(',').map(t => t.trim().replace(/^#/, '')).filter(Boolean) : ['PaperCode', 'Community'];
    const readTimeCalc = Math.max(2, Math.ceil(newContent.split(/\s+/).length / 150)) + ' min read';

    if (editingPost) {
      const updatedData: Partial<BlogPost> = {
        title: newTitle.trim(),
        subtitle: newSubtitle.trim(),
        category: newCategory,
        coverImage: newCoverImage,
        author: {
          name: newAuthorName.trim() || currentUser?.name || 'Author',
          role: editingPost.author?.role || (currentUser.role === 'teacher' ? 'Educator' : (currentUser.role === 'admin' ? 'Editorial Lead' : 'Student Contributor')),
          avatar: editingPost.author?.avatar || currentUser?.avatar || undefined,
          affiliation: newAffiliation.trim() || currentUser.school || 'PaperCode'
        },
        readTime: readTimeCalc,
        tags: tagsArray,
        content: contentParagraphs
      };

      updateBlog(editingPost.id, updatedData);
      setWriteModalOpen(false);
      setEditingPost(null);
      if (selectedPost && selectedPost.id === editingPost.id) {
        setSelectedPost({ ...selectedPost, ...updatedData });
      }
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    } else {
      const newPostData = {
        title: newTitle.trim(),
        subtitle: newSubtitle.trim() || 'A community article shared on PaperCode Bangladesh.',
        category: newCategory,
        coverImage: newCoverImage,
        authorId: currentUser?.id,
        authorEmail: currentUser?.email,
        author: {
          name: newAuthorName.trim() || currentUser?.name || 'Community Author',
          role: currentUser.role === 'teacher' ? 'Teacher & Contributor' : (currentUser.role === 'admin' ? 'Platform Editorial' : 'Student Developer'),
          avatar: currentUser?.avatar || null,
          affiliation: newAffiliation.trim() || currentUser?.school || 'PaperCode Community'
        },
        readTime: readTimeCalc,
        tags: tagsArray,
        content: contentParagraphs,
        isPublished: true,
        reactions: { applaud: 0, heart: 0, fire: 0, idea: 0 },
        comments: []
      };

      const created = addBlog(newPostData as any);
      setWriteModalOpen(false);
      setSelectedPost(created);
      confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
    }
  };

  const handleReact = (postId: string, reaction: 'applaud' | 'heart' | 'fire' | 'idea', e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    reactToBlog(postId, reaction);
    if (selectedPost && selectedPost.id === postId) {
      const curr = selectedPost.reactions || { applaud: selectedPost.claps || 0, heart: 0, fire: 0, idea: 0 };
      setSelectedPost({
        ...selectedPost,
        claps: reaction === 'applaud' ? (selectedPost.claps || 0) + 1 : selectedPost.claps,
        reactions: { ...curr, [reaction]: (curr[reaction] || 0) + 1 }
      });
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPost || !commentText.trim()) return;

    addBlogComment(selectedPost.id, commentText.trim());
    
    // Also update local selected post view immediately
    const newCmt: BlogComment = {
      id: 'cmt-' + Date.now(),
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorAvatar: currentUser.avatar || undefined,
      authorRole: currentUser.role === 'teacher' ? 'Teacher' : (currentUser.role === 'admin' ? 'Admin' : 'Student'),
      text: commentText.trim(),
      createdAt: 'Just now'
    };

    setSelectedPost(prev => prev ? {
      ...prev,
      comments: [newCmt, ...(prev.comments || [])]
    } : null);

    setCommentText('');
  };

  const handleDeleteComment = (commentId: string) => {
    if (!selectedPost) return;
    deleteBlogComment(selectedPost.id, commentId);
    setSelectedPost(prev => prev ? {
      ...prev,
      comments: (prev.comments || []).filter(c => c.id !== commentId)
    } : null);
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
            Community perspectives on bridging the rural digital divide, Olympiad training blueprints, teacher guides, and compiler engineering.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <PillButton
            variant="primary"
            size="md"
            onClick={handleOpenWrite}
            className="btn-bounce shadow-solid-sm flex-shrink-0"
            icon={<PenTool className="w-4 h-4" />}
          >
            + Write an Article
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
              onClick={() => setSelectedCategory(cat)}
              className={'px-4 py-1.5 rounded-full font-mono text-xs font-bold transition-all whitespace-nowrap ' + 
                (selectedCategory === cat 
                  ? 'bg-ink text-white shadow-solid-xs' 
                  : 'bg-paper-card border border-ink/30 text-graphite hover:border-ink hover:text-ink'
                )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-graphite" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search articles, tags, authors..."
            className="w-full pl-9 pr-4 py-2 bg-paper-card border-2 border-ink rounded-full text-xs font-bold placeholder:text-graphite focus:outline-none focus:ring-2 focus:ring-highlighter shadow-solid-xs"
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-graphite hover:text-ink text-xs font-bold"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* ARTICLES GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredPosts.map((post) => {
          const isOwnerOrAdmin = canManagePost(post);
          const reactions = post.reactions || { applaud: post.claps || 0, heart: 0, fire: 0, idea: 0 };

          return (
            <BentoCard
              key={post.id}
              variant="white"
              onClick={() => setSelectedPost(post)}
              className="p-6 border-2 border-ink shadow-solid-md hover:shadow-solid-lg transition-all space-y-4 flex flex-col justify-between cursor-pointer group relative"
            >
              <div className="space-y-3">
                {/* Cover Image */}
                <div className="rounded-xl overflow-hidden border border-ink/30 aspect-video relative">
                  <img
                    src={post.coverImage || 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&auto=format&fit=crop&q=80'}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 left-2">
                    <span className="px-2.5 py-0.5 bg-paper/90 backdrop-blur-sm border border-ink rounded-full text-[10px] font-mono font-extrabold text-ink shadow-solid-xs">
                      {post.category}
                    </span>
                  </div>

                  {/* Owner Action Buttons (Top Right) */}
                  {isOwnerOrAdmin && (
                    <div className="absolute top-2 right-2 flex items-center gap-1.5 bg-paper/95 backdrop-blur-sm border border-ink rounded-lg p-1 shadow-solid-xs">
                      <button
                        type="button"
                        onClick={(e) => handleOpenEdit(post, e)}
                        className="p-1 rounded hover:bg-highlighter text-ink transition-colors"
                        title="Edit Article"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => handleDeletePost(post.id, e)}
                        className="p-1 rounded hover:bg-red-100 text-red-600 transition-colors"
                        title="Delete Article"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Read Time & Date */}
                <div className="flex items-center justify-between text-[11px] font-mono text-graphite">
                  <span>{post.readTime}</span>
                  <span>{post.publishedAt}</span>
                </div>

                {/* Title & Subtitle */}
                <div>
                  <h3 className="text-lg font-extrabold text-ink group-hover:text-stamp transition-colors line-clamp-2 leading-tight">
                    {post.title}
                  </h3>
                  {post.subtitle && (
                    <p className="text-xs text-graphite mt-1.5 line-clamp-2 leading-relaxed font-medium">
                      {post.subtitle}
                    </p>
                  )}
                </div>
              </div>

              {/* Author Info & Reaction Bar */}
              <div className="pt-3 border-t border-ink/15 flex items-center justify-between gap-2">
                <div className="flex items-center space-x-2 min-w-0">
                  <UserAvatar
                    name={post.author?.name || 'Author'}
                    avatar={post.author?.avatar}
                    size="xs"
                    className="w-7 h-7 flex-shrink-0 text-[10px]"
                  />
                  <div className="overflow-hidden">
                    <strong className="text-ink text-xs block leading-none truncate max-w-[110px]">{post.author?.name}</strong>
                    <span className="text-[9px] text-graphite font-mono truncate block">{post.author?.role || 'Author'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={(e) => handleReact(post.id, 'applaud', e)}
                    className="flex items-center gap-1 px-2 py-0.5 rounded-full border border-ink/20 hover:bg-highlighter text-ink font-mono text-xs font-bold transition-colors"
                    title="Applaud"
                  >
                    <span>👏</span>
                    <span>{reactions.applaud || post.claps || 0}</span>
                  </button>

                  <div className="flex items-center gap-1 text-[11px] font-mono font-bold text-graphite">
                    <MessageSquare className="w-3.5 h-3.5 text-stamp" />
                    <span>{post.comments?.length || 0}</span>
                  </div>
                </div>
              </div>

            </BentoCard>
          );
        })}
      </div>

      {/* CLEAN EMPTY STATE */}
      {filteredPosts.length === 0 && (
        <div className="p-12 sm:p-16 bg-paper-card border-2 border-ink rounded-[24px] text-center space-y-4 shadow-solid-md max-w-2xl mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-highlighter border-2 border-ink flex items-center justify-center text-ink mx-auto shadow-solid-xs text-3xl">
            ✍️
          </div>
          <div className="space-y-1.5">
            <h3 className="text-xl sm:text-2xl font-extrabold text-ink">No articles found in this section</h3>
            <p className="text-xs sm:text-sm text-graphite font-medium max-w-md mx-auto">
              Share your insights, classroom teaching stories, or Olympiad tips with learners and educators across Bangladesh.
            </p>
          </div>
          <div className="pt-2">
            <PillButton
              variant="primary"
              size="md"
              onClick={handleOpenWrite}
              className="btn-bounce shadow-solid-xs"
              icon={<PenTool className="w-4 h-4" />}
            >
              + Write the First Article
            </PillButton>
          </div>
        </div>
      )}

      {/* FULL ARTICLE READER & DISCUSSION MODAL */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-3xl bg-paper-card border-3 border-ink rounded-[28px] p-6 sm:p-10 shadow-solid-xl space-y-6 max-h-[90vh] overflow-y-auto">
            
            {/* Header, Categories & Actions */}
            <div className="flex items-start justify-between gap-4 border-b-2 border-ink/15 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-highlighter border border-ink rounded-full text-xs font-extrabold text-ink">
                    {selectedPost.category}
                  </span>
                  <span className="text-xs font-mono text-graphite">
                    {selectedPost.readTime} • {selectedPost.publishedAt}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {canManagePost(selectedPost) && (
                  <>
                    <button
                      onClick={() => handleOpenEdit(selectedPost)}
                      className="px-3 py-1.5 rounded-lg border-2 border-ink bg-white hover:bg-highlighter text-ink text-xs font-extrabold flex items-center gap-1 transition-colors shadow-solid-xs"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDeletePost(selectedPost.id)}
                      className="px-3 py-1.5 rounded-lg border-2 border-ink bg-white hover:bg-red-100 text-red-600 text-xs font-extrabold flex items-center gap-1 transition-colors shadow-solid-xs"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </>
                )}

                <button
                  onClick={() => setSelectedPost(null)}
                  className="p-2 rounded-full border-2 border-ink bg-paper-muted hover:bg-red-100 text-ink transition-colors flex-shrink-0"
                  aria-label="Close article"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Title & Subtitle */}
            <div className="space-y-3">
              <h2 className="text-2xl sm:text-4xl font-extrabold text-ink leading-tight">
                {selectedPost.title}
              </h2>
              {selectedPost.subtitle && (
                <p className="text-sm sm:text-base text-graphite font-medium leading-relaxed">
                  {selectedPost.subtitle}
                </p>
              )}
            </div>

            {/* Author Profile Card & Multi-Emoji Reaction Toolbar */}
            <div className="p-4 bg-paper-muted rounded-2xl border-2 border-ink/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center space-x-3">
                <UserAvatar
                  name={selectedPost.author?.name || 'Author'}
                  avatar={selectedPost.author?.avatar}
                  size="lg"
                  className="w-12 h-12 text-lg"
                />
                <div>
                  <strong className="text-sm text-ink block">{selectedPost.author?.name}</strong>
                  <span className="text-xs text-stamp font-bold block">{selectedPost.author?.role}</span>
                  <span className="text-[11px] font-mono text-graphite">{selectedPost.author?.affiliation}</span>
                </div>
              </div>

              {/* Reactions Bar */}
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => handleReact(selectedPost.id, 'applaud')}
                  className="px-3 py-1.5 bg-white hover:bg-highlighter border-2 border-ink rounded-full text-xs font-extrabold text-ink flex items-center gap-1.5 shadow-solid-xs btn-bounce"
                >
                  <span>👏</span>
                  <span>{selectedPost.reactions?.applaud ?? selectedPost.claps ?? 0}</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleReact(selectedPost.id, 'heart')}
                  className="px-3 py-1.5 bg-white hover:bg-red-50 border-2 border-ink rounded-full text-xs font-extrabold text-ink flex items-center gap-1.5 shadow-solid-xs btn-bounce"
                >
                  <span>❤️</span>
                  <span>{selectedPost.reactions?.heart ?? 0}</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleReact(selectedPost.id, 'fire')}
                  className="px-3 py-1.5 bg-white hover:bg-orange-50 border-2 border-ink rounded-full text-xs font-extrabold text-ink flex items-center gap-1.5 shadow-solid-xs btn-bounce"
                >
                  <span>🔥</span>
                  <span>{selectedPost.reactions?.fire ?? 0}</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleReact(selectedPost.id, 'idea')}
                  className="px-3 py-1.5 bg-white hover:bg-yellow-50 border-2 border-ink rounded-full text-xs font-extrabold text-ink flex items-center gap-1.5 shadow-solid-xs btn-bounce"
                >
                  <span>💡</span>
                  <span>{selectedPost.reactions?.idea ?? 0}</span>
                </button>
              </div>
            </div>

            {/* Cover Image */}
            {selectedPost.coverImage && (
              <div className="rounded-2xl overflow-hidden border-2 border-ink aspect-video max-h-80 w-full">
                <img
                  src={selectedPost.coverImage}
                  alt={selectedPost.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

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
              {(selectedPost.tags || []).map((tag, i) => (
                <span key={i} className="px-3 py-1 bg-paper-muted border border-ink/20 rounded-full text-xs font-mono font-bold text-ink">
                  #{tag}
                </span>
              ))}
            </div>

            {/* INTERACTIVE COMMENTS SECTION */}
            <div className="pt-6 border-t-2 border-ink/15 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-extrabold text-ink flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-stamp" />
                  <span>Discussion & Comments ({selectedPost.comments?.length || 0})</span>
                </h3>
              </div>

              {/* Add Comment Form */}
              <form onSubmit={handleAddComment} className="space-y-3 p-4 bg-paper-light border-2 border-ink rounded-2xl">
                <div className="flex items-center space-x-2">
                  <UserAvatar
                    name={currentUser?.name || 'Guest'}
                    avatar={currentUser?.avatar}
                    size="xs"
                    className="w-7 h-7 flex-shrink-0 text-[10px]"
                  />
                  <span className="text-xs font-bold text-ink">{currentUser?.name || 'Guest'}</span>
                  <span className="text-[10px] font-mono text-stamp font-extrabold uppercase">({currentUser?.role || 'Student'})</span>
                </div>
                <textarea
                  rows={2}
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Join the discussion... share your experience or ask a question"
                  className="w-full p-3 rounded-xl border-2 border-ink text-xs font-medium bg-white focus:outline-none focus:ring-2 focus:ring-highlighter"
                  required
                />
                <div className="flex justify-end">
                  <PillButton
                    variant="primary"
                    size="sm"
                    className="btn-bounce shadow-solid-xs"
                    icon={<Send className="w-3.5 h-3.5" />}
                  >
                    Post Comment
                  </PillButton>
                </div>
              </form>

              {/* List of Comments */}
              <div className="space-y-3">
                {(selectedPost.comments || []).length === 0 ? (
                  <p className="text-xs text-graphite font-medium italic text-center py-4">
                    No comments yet. Be the first to leave a thought!
                  </p>
                ) : (
                  (selectedPost.comments || []).map((cmt) => (
                    <div key={cmt.id} className="p-3.5 bg-white border border-ink/30 rounded-xl space-y-1.5 relative group">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <UserAvatar
                            name={cmt.authorName || 'Member'}
                            avatar={cmt.authorAvatar}
                            size="xs"
                            className="w-6 h-6 flex-shrink-0 text-[9px]"
                          />
                          <span className="text-xs font-extrabold text-ink">{cmt.authorName}</span>
                          <span className="px-2 py-0.2 bg-highlighter/50 border border-ink/30 rounded-full text-[9px] font-mono font-bold text-ink">
                            {cmt.authorRole || 'Member'}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-[10px] font-mono text-graphite">{cmt.createdAt}</span>
                          {(cmt.authorId === currentUser?.id || currentUser?.role === 'admin') && (
                            <button
                              onClick={() => handleDeleteComment(cmt.id)}
                              className="text-red-500 hover:text-red-700 text-xs p-1"
                              title="Delete Comment"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-ink leading-relaxed pl-8 font-sans">
                        {cmt.text}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* WRITE / EDIT ARTICLE MODAL */}
      {writeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-2xl bg-paper-card border-3 border-ink rounded-[28px] p-6 sm:p-8 shadow-solid-xl space-y-6 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b-2 border-ink/15 pb-4">
              <div className="space-y-0.5">
                <div className="doodle-badge bg-highlighter text-ink">
                  <span>{editingPost ? '✏️ Editing Post' : '✍️ Community Contributor'}</span>
                </div>
                <h3 className="text-2xl font-extrabold text-ink pt-1">
                  {editingPost ? 'Edit Blog Post' : 'Write & Publish an Article'}
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

            <form onSubmit={handleSavePost} className="space-y-4">
              
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
                    className="w-full px-3 py-2.5 rounded-xl border-2 border-ink text-xs font-bold bg-white focus:outline-none focus:ring-2 focus:ring-highlighter"
                  >
                    <option value="Field Story">Field Story (Rural Schools)</option>
                    <option value="Teaching Guide">Teaching Guide (Pedagogy)</option>
                    <option value="Olympiad Prep">Olympiad Prep (BdOI & CP)</option>
                    <option value="Engineering">Engineering (Compilers & OCR)</option>
                    <option value="Curriculum">Curriculum (NCTB Guidelines)</option>
                  </select>
                </div>

                {/* Author Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-extrabold uppercase text-ink block">
                    Author Name
                  </label>
                  <input
                    type="text"
                    value={newAuthorName}
                    onChange={e => setNewAuthorName(e.target.value)}
                    placeholder="Your Full Name"
                    className="w-full px-4 py-2.5 rounded-xl border-2 border-ink text-xs font-bold bg-white focus:outline-none focus:ring-2 focus:ring-highlighter"
                  />
                </div>

              </div>

              {/* Cover Photo Presets */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-extrabold uppercase text-ink block">
                  Select Cover Image
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {coverPresets.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setNewCoverImage(preset.url)}
                      className={'rounded-lg overflow-hidden border-2 transition-all aspect-video ' + 
                        (newCoverImage === preset.url ? 'border-stamp ring-2 ring-stamp scale-105' : 'border-ink/40 opacity-70 hover:opacity-100')}
                    >
                      <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Body Content */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono font-extrabold uppercase text-ink block">
                    Article Content (Paragraphs) *
                  </label>
                  <span className="text-[10px] font-mono text-graphite">Separate paragraphs with double Enter</span>
                </div>
                <textarea
                  rows={6}
                  required
                  value={newContent}
                  onChange={e => setNewContent(e.target.value)}
                  placeholder="Share your story, insights, or coding tutorial here..."
                  className="w-full px-4 py-3 rounded-xl border-2 border-ink text-xs font-normal bg-white focus:outline-none focus:ring-2 focus:ring-highlighter font-sans"
                />
              </div>

              {/* Tags */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-extrabold uppercase text-ink block">
                  Tags (Comma separated)
                </label>
                <input
                  type="text"
                  value={newTags}
                  onChange={e => setNewTags(e.target.value)}
                  placeholder="e.g. Python, DigitalDivide, NCTB, HaorRegion"
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-ink text-xs font-medium bg-white focus:outline-none focus:ring-2 focus:ring-highlighter"
                />
              </div>

              {/* Buttons */}
              <div className="pt-4 border-t-2 border-ink/15 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setWriteModalOpen(false)}
                  className="px-5 py-2 rounded-full border-2 border-ink bg-paper-muted font-bold text-xs hover:bg-paper-light text-ink"
                >
                  Cancel
                </button>
                <PillButton
                  variant="primary"
                  size="md"
                  className="btn-bounce shadow-solid-xs"
                >
                  {editingPost ? 'Save Changes ➔' : 'Publish Article ➔'}
                </PillButton>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
