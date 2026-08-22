import { Router, Request, Response } from 'express';
import { pool } from '../db';

const router = Router();

// GET all courses with nested modules and lessons from PostgreSQL
router.get('/', async (req: Request, res: Response) => {
  try {
    const coursesRes = await pool.query('SELECT * FROM courses ORDER BY created_at ASC');
    const modulesRes = await pool.query('SELECT * FROM modules ORDER BY sort_order ASC, created_at ASC');
    const lessonsRes = await pool.query('SELECT * FROM lessons ORDER BY sort_order ASC, created_at ASC');

    const modulesByCourse: Record<string, any[]> = {};
    for (const m of modulesRes.rows) {
      if (!modulesByCourse[m.course_id]) modulesByCourse[m.course_id] = [];
      modulesByCourse[m.course_id].push({
        id: m.id,
        courseId: m.course_id,
        title: m.title,
        description: m.description,
        sortOrder: m.sort_order,
        lessons: []
      });
    }

    const lessonsByModule: Record<string, any[]> = {};
    for (const l of lessonsRes.rows) {
      if (!lessonsByModule[l.module_id]) lessonsByModule[l.module_id] = [];
      
      const mcqObj = l.mcq_data && typeof l.mcq_data === 'object' && l.mcq_data.question ? l.mcq_data : {
        id: 'mcq-' + l.id,
        question: 'What is the primary function of this concept?',
        options: [
          { id: 'opt-1', text: 'Executes standard procedural statement', isCorrect: true },
          { id: 'opt-2', text: 'Stops compilation immediately', isCorrect: false }
        ],
        correctOptionIds: ['opt-1'],
        correctOptionId: 'opt-1',
        explanation: 'Executes standard procedural code instructions.'
      };

      const exerciseObj = l.exercise_data && typeof l.exercise_data === 'object' && l.exercise_data.starterCode ? l.exercise_data : {
        id: 'ex-' + l.id,
        title: l.title || 'Coding Challenge',
        prompt: l.subtitle || 'Complete this coding challenge on paper or in the IDE.',
        language: 'python',
        languageId: 71,
        starterCode: 'print("Hello from PaperCode Bangladesh!")',
        solutionSnippet: 'print("Hello from PaperCode Bangladesh!")',
        testCases: [{ id: 'tc-1', input: '', expectedOutput: 'Hello from PaperCode Bangladesh!', description: 'Validate standard output' }],
        rubric: [{ id: 'rb-1', title: 'Syntax Accuracy', maxPoints: 10, description: 'Matches required output' }]
      };

      const blocksObj = Array.isArray(l.blocks_data) && l.blocks_data.length > 0 ? l.blocks_data : [
        {
          id: 'blk-th-' + l.id,
          type: 'theory',
          title: 'Lesson Concept & Syntax Rules',
          htmlContent: l.theory_html || `<h3>${l.title}</h3><p>${l.subtitle || ''}</p>`
        },
        {
          id: mcqObj.id || ('blk-mcq-' + l.id),
          type: 'mcq',
          question: mcqObj.question,
          options: mcqObj.options || [],
          correctOptionIds: mcqObj.correctOptionIds || (mcqObj.correctOptionId ? [mcqObj.correctOptionId] : ['opt-1']),
          explanation: mcqObj.explanation || ''
        },
        {
          id: exerciseObj.id || ('blk-ex-' + l.id),
          type: 'exercise',
          title: exerciseObj.title || l.title,
          prompt: exerciseObj.prompt || l.subtitle || 'Complete challenge',
          language: exerciseObj.language || 'python',
          languageId: exerciseObj.languageId || 71,
          starterCode: exerciseObj.starterCode || 'print("Hello from PaperCode Bangladesh!")',
          solutionSnippet: exerciseObj.solutionSnippet || '',
          testCases: exerciseObj.testCases || [],
          rubric: exerciseObj.rubric || []
        }
      ];

      lessonsByModule[l.module_id].push({
        id: l.id,
        moduleId: l.module_id,
        title: l.title,
        subtitle: l.subtitle || 'Lesson Overview',
        durationMinutes: l.duration_minutes || 20,
        xpReward: l.xp_reward || 100,
        conceptNotes: [l.subtitle || 'Learn core syntax and logic.'],
        codeSnippet: exerciseObj.starterCode || 'print("Hello from PaperCode Bangladesh!")',
        theoryContent: l.theory_html || `<h3>${l.title}</h3><p>${l.subtitle || ''}</p>`,
        theoryHtml: l.theory_html || `<h3>${l.title}</h3><p>${l.subtitle || ''}</p>`,
        mcq: mcqObj,
        exercise: exerciseObj,
        blocks: blocksObj,
        sortOrder: l.sort_order
      });
    }

    // Attach lessons to modules
    for (const cId in modulesByCourse) {
      for (const mod of modulesByCourse[cId]) {
        mod.lessons = lessonsByModule[mod.id] || [];
      }
    }

    const courses = coursesRes.rows.map(c => ({
      id: c.id,
      title: c.title,
      subtitle: c.subtitle || '',
      description: c.description || '',
      category: c.language ? (c.language.toUpperCase() + ' Programming') : 'ICT Curriculum',
      language: c.language || 'python',
      level: c.level || 'Beginner',
      estimatedHours: 12,
      publishedBy: 'teacher',
      authorId: c.author_id,
      authorName: c.author_name || 'Verified Educator',
      isPublished: Boolean(c.is_published),
      modules: modulesByCourse[c.id] || []
    }));

    return res.json({ success: true, courses });
  } catch (err: any) {
    console.error('Error fetching courses:', err.message);
    return res.json({ success: true, courses: [] });
  }
});

// POST: Create a new Course in PostgreSQL
router.post('/', async (req: Request, res: Response) => {
  try {
    const { id, title, description, language = 'python', level = 'Beginner', authorId, authorName } = req.body;
    const courseId = id || ('crs-' + Date.now());

    // Safely verify authorId in users table
    let validAuthorId: string | null = null;
    let validAuthorName = authorName || 'Educator';

    if (authorId) {
      const userCheck = await pool.query('SELECT id, name FROM users WHERE id = $1', [authorId]);
      if (userCheck.rows.length > 0) {
        validAuthorId = userCheck.rows[0].id;
        validAuthorName = authorName || userCheck.rows[0].name;
      }
    }

    // Fallback: Pick admin/teacher from users if ID not found
    if (!validAuthorId) {
      const fallbackUser = await pool.query("SELECT id, name FROM users WHERE role IN ('admin', 'teacher') ORDER BY created_at ASC LIMIT 1");
      if (fallbackUser.rows.length > 0) {
        validAuthorId = fallbackUser.rows[0].id;
        validAuthorName = authorName || fallbackUser.rows[0].name;
      }
    }

    const upsertQuery = `
      INSERT INTO courses (id, title, description, language, level, author_id, author_name, is_published, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, true, NOW())
      ON CONFLICT (id) DO UPDATE SET
        title = EXCLUDED.title,
        description = EXCLUDED.description,
        language = EXCLUDED.language,
        level = EXCLUDED.level,
        author_name = EXCLUDED.author_name
      RETURNING *;
    `;
    const result = await pool.query(upsertQuery, [
      courseId,
      title || 'New Course',
      description || 'Curriculum course description',
      language,
      level,
      validAuthorId,
      validAuthorName
    ]);

    const r = result.rows[0];
    const newCourse = {
      id: r.id,
      title: r.title,
      description: r.description,
      language: r.language,
      level: r.level,
      authorId: r.author_id,
      authorName: r.author_name,
      isPublished: true,
      modules: []
    };

    return res.status(201).json({ success: true, course: newCourse });
  } catch (err: any) {
    console.error('Error creating course:', err.message);
    return res.status(500).json({ success: false, message: err.message });
  }
});

// POST: Add or Update a Module in PostgreSQL
router.post('/:courseId/modules', async (req: Request, res: Response) => {
  try {
    const { courseId } = req.params;
    const { id, title, description, sortOrder = 1 } = req.body;
    const moduleId = id || ('mod-' + Date.now());

    // Ensure course exists in courses table
    const courseCheck = await pool.query('SELECT id FROM courses WHERE id = $1', [courseId]);
    if (courseCheck.rows.length === 0) {
      await pool.query(`
        INSERT INTO courses (id, title, description, language, level, author_name, is_published, created_at)
        VALUES ($1, $2, 'Teacher Course', 'python', 'Beginner', 'Educator', true, NOW())
        ON CONFLICT (id) DO NOTHING;
      `, [courseId, 'Course ' + courseId]);
    }

    const upsertQuery = `
      INSERT INTO modules (id, course_id, title, description, sort_order, created_at)
      VALUES ($1, $2, $3, $4, $5, NOW())
      ON CONFLICT (id) DO UPDATE SET
        title = EXCLUDED.title,
        description = EXCLUDED.description,
        sort_order = EXCLUDED.sort_order
      RETURNING *;
    `;
    const result = await pool.query(upsertQuery, [
      moduleId,
      courseId,
      title || 'New Module',
      description || 'Module details',
      sortOrder
    ]);

    const r = result.rows[0];
    const newModule = {
      id: r.id,
      courseId: r.course_id,
      title: r.title,
      description: r.description,
      sortOrder: r.sort_order,
      lessons: []
    };

    return res.status(201).json({ success: true, module: newModule });
  } catch (err: any) {
    console.error('Error creating module:', err.message);
    return res.status(500).json({ success: false, message: err.message });
  }
});

// POST: Add or Update a Lesson in PostgreSQL
router.post('/:courseId/modules/:moduleId/lessons', async (req: Request, res: Response) => {
  try {
    const { courseId, moduleId } = req.params;
    const { id, title, subtitle, theoryHtml, exercise, mcq, blocks, durationMinutes = 20, xpReward = 100, sortOrder = 1 } = req.body;
    const lessonId = id || ('lsn-' + Date.now());

    // Ensure course exists
    const courseCheck = await pool.query('SELECT id FROM courses WHERE id = $1', [courseId]);
    if (courseCheck.rows.length === 0) {
      await pool.query(`
        INSERT INTO courses (id, title, description, language, level, author_name, is_published, created_at)
        VALUES ($1, $2, 'Teacher Course', 'python', 'Beginner', 'Educator', true, NOW())
        ON CONFLICT (id) DO NOTHING;
      `, [courseId, 'Course ' + courseId]);
    }

    // Ensure module exists
    const modCheck = await pool.query('SELECT id FROM modules WHERE id = $1', [moduleId]);
    if (modCheck.rows.length === 0) {
      await pool.query(`
        INSERT INTO modules (id, course_id, title, description, sort_order, created_at)
        VALUES ($1, $2, 'Module 1: General Lessons', 'Core lessons', 1, NOW())
        ON CONFLICT (id) DO NOTHING;
      `, [moduleId, courseId]);
    }

    const effectiveTheoryHtml = theoryHtml || (blocks?.find((b: any) => b.type === 'theory')?.htmlContent) || '<h3>Concept Overview</h3>';
    const effectiveExercise = exercise || (blocks?.find((b: any) => b.type === 'exercise')) || {};
    const effectiveMcq = mcq || (blocks?.find((b: any) => b.type === 'mcq')) || {};

    const upsertQuery = `
      INSERT INTO lessons (id, module_id, title, subtitle, theory_html, exercise_data, mcq_data, blocks_data, xp_reward, duration_minutes, sort_order, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW())
      ON CONFLICT (id) DO UPDATE SET
        module_id = EXCLUDED.module_id,
        title = EXCLUDED.title,
        subtitle = EXCLUDED.subtitle,
        theory_html = EXCLUDED.theory_html,
        exercise_data = EXCLUDED.exercise_data,
        mcq_data = EXCLUDED.mcq_data,
        blocks_data = EXCLUDED.blocks_data,
        xp_reward = EXCLUDED.xp_reward,
        duration_minutes = EXCLUDED.duration_minutes,
        sort_order = EXCLUDED.sort_order
      RETURNING *;
    `;
    const result = await pool.query(upsertQuery, [
      lessonId,
      moduleId,
      title || 'New Lesson',
      subtitle || 'Lesson concept overview',
      effectiveTheoryHtml,
      JSON.stringify(effectiveExercise),
      JSON.stringify(effectiveMcq),
      JSON.stringify(blocks || []),
      xpReward,
      durationMinutes,
      sortOrder
    ]);

    const r = result.rows[0];
    const newLesson = {
      id: r.id,
      moduleId: r.module_id,
      title: r.title,
      subtitle: r.subtitle,
      theoryHtml: r.theory_html,
      exercise: r.exercise_data,
      mcq: r.mcq_data,
      blocks: r.blocks_data,
      durationMinutes: r.duration_minutes,
      xpReward: r.xp_reward,
      sortOrder: r.sort_order
    };

    return res.status(201).json({ success: true, lesson: newLesson });
  } catch (err: any) {
    console.error('Error saving lesson in PostgreSQL:', err.message);
    return res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE: Delete a Lesson from Module
router.delete('/:courseId/modules/:moduleId/lessons/:lessonId', async (req: Request, res: Response) => {
  try {
    const { lessonId } = req.params;
    await pool.query('DELETE FROM lessons WHERE id = $1', [lessonId]);
    return res.json({ success: true, message: 'Lesson deleted.' });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE: Delete a Module from Course
router.delete('/:courseId/modules/:moduleId', async (req: Request, res: Response) => {
  try {
    const { moduleId } = req.params;
    await pool.query('DELETE FROM lessons WHERE module_id = $1', [moduleId]);
    await pool.query('DELETE FROM modules WHERE id = $1', [moduleId]);
    return res.json({ success: true, message: 'Module deleted.' });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE: Delete a Course
router.delete('/:courseId', async (req: Request, res: Response) => {
  try {
    const { courseId } = req.params;
    await pool.query('DELETE FROM courses WHERE id = $1', [courseId]);
    return res.json({ success: true, message: 'Course deleted.' });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// POST: Save / Update Lesson Progress for a Student
router.post('/progress', async (req: Request, res: Response) => {
  try {
    const { userId, lessonId, courseId, xpEarned = 150 } = req.body;
    if (!userId || !lessonId) {
      return res.status(400).json({ success: false, message: 'userId and lessonId are required.' });
    }

    const progressId = 'prog-' + Date.now() + '-' + Math.floor(Math.random() * 10000);

    // 1. Insert or update lesson_progress record
    await pool.query(`
      INSERT INTO lesson_progress (id, user_id, lesson_id, course_id, xp_earned)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (user_id, lesson_id) DO UPDATE 
      SET completed_at = CURRENT_TIMESTAMP
    `, [progressId, userId, lessonId, courseId || null, xpEarned]);

    // 2. Append to users table completed_lessons & add XP if user exists
    await pool.query(`
      UPDATE users 
      SET completed_lessons = ARRAY(
        SELECT DISTINCT unnest(array_append(COALESCE(completed_lessons, ARRAY[]::TEXT[]), $1))
      ),
      xp_points = COALESCE(xp_points, 0) + $2,
      updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
    `, [lessonId, xpEarned, userId]);

    // 3. Return all completed lessons for this user
    const progRes = await pool.query(
      'SELECT DISTINCT lesson_id FROM lesson_progress WHERE user_id = $1',
      [userId]
    );
    const completedLessons = progRes.rows.map(r => r.lesson_id);

    return res.json({
      success: true,
      message: 'Lesson progress recorded and synced successfully in database.',
      completedLessons
    });
  } catch (err: any) {
    console.error('Error saving lesson progress in DB:', err.message);
    return res.status(500).json({ success: false, message: err.message });
  }
});

// GET: Fetch all Completed Lessons for a Student
router.get('/progress/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const progRes = await pool.query(
      'SELECT DISTINCT lesson_id FROM lesson_progress WHERE user_id = $1',
      [userId]
    );
    
    const userRes = await pool.query(
      'SELECT completed_lessons FROM users WHERE id = $1',
      [userId]
    );

    const fromProgress = progRes.rows.map(r => r.lesson_id);
    const fromUser = userRes.rows[0]?.completed_lessons || [];
    const allCompleted = Array.from(new Set([...fromProgress, ...fromUser]));

    return res.json({
      success: true,
      completedLessons: allCompleted
    });
  } catch (err: any) {
    console.error('Error fetching lesson progress from DB:', err.message);
    return res.status(500).json({ success: false, message: err.message, completedLessons: [] });
  }
});

export default router;
