import { Router, Request, Response } from 'express';
import { pool } from '../db';

const router = Router();

let blogsDb: any[] = [];

// GET all blogs
router.get('/', async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM blogs ORDER BY published_at DESC');
    if (result.rows.length > 0) {
      const blogs = result.rows.map(r => ({
        id: r.id,
        title: r.title,
        subtitle: r.subtitle || '',
        category: r.category,
        coverImage: r.cover_image,
        authorId: r.author_id,
        author: {
          name: r.author_name,
          role: r.author_role || 'Author',
          avatar: r.author_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
          affiliation: r.author_affiliation || 'PaperCode'
        },
        publishedAt: r.published_at ? new Date(r.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Today',
        readTime: r.read_time || '5 min read',
        claps: r.claps || 0,
        reactions: r.reactions || { applaud: r.claps || 0, heart: 0, fire: 0, idea: 0 },
        comments: r.comments || [],
        tags: Array.isArray(r.tags) ? r.tags : ['PaperCode'],
        content: Array.isArray(r.content) ? r.content : [r.content || ''],
        isPublished: r.is_published !== false
      }));
      blogsDb = blogs;
      return res.json({ success: true, blogs });
    }
  } catch (err: any) {
    console.warn('DB blogs fetch notice:', err.message);
  }
  return res.json({ success: true, blogs: blogsDb });
});

// CREATE a new blog post
router.post('/', async (req: Request, res: Response) => {
  try {
    const { title, subtitle, category, author, authorId, coverImage, content, tags, isPublished } = req.body;
    const id = 'blog-' + Date.now();
    const cleanContent = Array.isArray(content) ? content : [content || ''];
    const wordsCount = cleanContent.join(' ').split(/\s+/).filter(Boolean).length;
    const readTime = Math.max(2, Math.ceil(wordsCount / 150)) + ' min read';
    const authorName = author?.name || 'PaperCode Contributor';
    const authorRole = author?.role || 'Community Member';
    const authorAffiliation = author?.affiliation || 'PaperCode Community';
    const authorAvatar = author?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150';
    const cleanTags = Array.isArray(tags) ? tags : ['PaperCode'];

    const newBlog = {
      id,
      title: title || 'Untitled Post',
      subtitle: subtitle || '',
      category: category || 'Field Story',
      coverImage: coverImage || 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&auto=format&fit=crop&q=80',
      authorId: authorId || null,
      author: {
        name: authorName,
        role: authorRole,
        avatar: authorAvatar,
        affiliation: authorAffiliation
      },
      publishedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      readTime,
      claps: 0,
      reactions: { applaud: 0, heart: 0, fire: 0, idea: 0 },
      comments: [],
      tags: cleanTags,
      isPublished: isPublished !== undefined ? isPublished : true,
      content: cleanContent
    };

    try {
      await pool.query(`
        INSERT INTO blogs (id, title, subtitle, category, cover_image, author_id, author_name, author_role, author_affiliation, author_avatar, read_time, claps, tags, content, is_published, published_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, NOW())
      `, [
        id, newBlog.title, newBlog.subtitle, newBlog.category, newBlog.coverImage,
        authorId || null, authorName, authorRole, authorAffiliation, authorAvatar,
        readTime, 0, cleanTags, cleanContent, newBlog.isPublished
      ]);
    } catch (dbErr: any) {
      console.warn('DB blog insert notice:', dbErr.message);
    }

    blogsDb.unshift(newBlog);
    return res.status(201).json({ success: true, blog: newBlog });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// UPDATE an existing blog post (Title, subtitle, content, cover, tags, publish state)
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, subtitle, category, coverImage, content, tags, isPublished, author } = req.body;

    const index = blogsDb.findIndex(b => b.id === id);
    if (index >= 0) {
      blogsDb[index] = {
        ...blogsDb[index],
        ...req.body,
        content: content ? (Array.isArray(content) ? content : [content]) : blogsDb[index].content,
        tags: tags ? (Array.isArray(tags) ? tags : [tags]) : blogsDb[index].tags
      };
    }

    try {
      await pool.query(`
        UPDATE blogs SET
          title = COALESCE($1, title),
          subtitle = COALESCE($2, subtitle),
          category = COALESCE($3, category),
          cover_image = COALESCE($4, cover_image),
          content = COALESCE($5, content),
          tags = COALESCE($6, tags),
          is_published = COALESCE($7, is_published)
        WHERE id = $8
      `, [title, subtitle, category, coverImage, content ? (Array.isArray(content) ? content : [content]) : null, tags, isPublished, id]);
    } catch (e: any) {
      console.warn('DB blog update notice:', e.message);
    }

    const updatedBlog = blogsDb.find(b => b.id === id) || { id, ...req.body };
    return res.json({ success: true, blog: updatedBlog });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE a blog post
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    blogsDb = blogsDb.filter(b => b.id !== id);

    try {
      await pool.query('DELETE FROM blogs WHERE id = $1', [id]);
    } catch (e: any) {
      console.warn('DB blog delete notice:', e.message);
    }

    return res.json({ success: true, message: 'Blog deleted successfully.' });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// REACT TO BLOG (Applaud, Heart, Fire, Idea)
router.post('/:id/react', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { reaction = 'applaud' } = req.body; // 'applaud' | 'heart' | 'fire' | 'idea'

    const b = blogsDb.find(x => x.id === id);
    if (b) {
      if (!b.reactions) b.reactions = { applaud: b.claps || 0, heart: 0, fire: 0, idea: 0 };
      if (reaction in b.reactions) {
        b.reactions[reaction] = (b.reactions[reaction] || 0) + 1;
      }
      if (reaction === 'applaud') {
        b.claps = (b.claps || 0) + 1;
      }
      return res.json({ success: true, reactions: b.reactions, claps: b.claps });
    }

    try {
      const q = reaction === 'applaud' 
        ? 'UPDATE blogs SET claps = claps + 1 WHERE id = $1 RETURNING claps'
        : 'SELECT claps FROM blogs WHERE id = $1';
      const r = await pool.query(q, [id]);
      if (r.rows.length > 0) {
        return res.json({ success: true, claps: r.rows[0].claps, reactions: { applaud: r.rows[0].claps, heart: 1, fire: 0, idea: 0 } });
      }
    } catch (e) {}

    return res.status(404).json({ success: false, message: 'Blog not found' });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// ADD COMMENT TO BLOG
router.post('/:id/comments', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { authorId, authorName, authorAvatar, authorRole, text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ success: false, message: 'Comment text is required.' });
    }

    const newComment = {
      id: 'cmt-' + Date.now(),
      authorId: authorId || 'usr-guest',
      authorName: authorName || 'PaperCode Learner',
      authorAvatar: authorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      authorRole: authorRole || 'Student',
      text: text.trim(),
      createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    };

    const b = blogsDb.find(x => x.id === id);
    if (b) {
      if (!b.comments) b.comments = [];
      b.comments.push(newComment);
    }

    return res.status(201).json({ success: true, comment: newComment });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE COMMENT FROM BLOG
router.delete('/:id/comments/:commentId', async (req: Request, res: Response) => {
  try {
    const { id, commentId } = req.params;
    const b = blogsDb.find(x => x.id === id);
    if (b && b.comments) {
      b.comments = b.comments.filter((c: any) => c.id !== commentId);
    }
    return res.json({ success: true, message: 'Comment deleted.' });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// TOGGLE PUBLISH STATUS
router.post('/:id/toggle-publish', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const b = blogsDb.find(x => x.id === id);
    let newPub = true;
    if (b) {
      b.isPublished = b.isPublished === false ? true : false;
      newPub = b.isPublished;
    }

    try {
      await pool.query('UPDATE blogs SET is_published = NOT is_published WHERE id = $1', [id]);
    } catch (e) {}

    return res.json({ success: true, isPublished: newPub });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// CLAP
router.post('/:id/clap', async (req: Request, res: Response) => {
  const b = blogsDb.find(x => x.id === req.params.id);
  if (b) {
    b.claps = (b.claps || 0) + 1;
    return res.json({ success: true, claps: b.claps });
  }
  return res.status(404).json({ success: false, message: 'Blog not found' });
});

export default router;


