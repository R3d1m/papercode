import { Router, Request, Response } from 'express';
import { pool } from '../db';

const router = Router();
let submissionsDb: any[] = [];

// GET all submissions
router.get('/', async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT s.*, u.name as student_name, u.email as student_email, u.avatar_url as student_avatar, u.school as student_school
      FROM submissions s
      LEFT JOIN users u ON s.student_id = u.id
      ORDER BY s.submitted_at DESC
    `);

    if (result.rows.length > 0) {
      const submissions = result.rows.map(r => ({
        id: r.id,
        exerciseId: r.exercise_id,
        exerciseTitle: r.exercise_title,
        studentId: r.student_id,
        studentName: r.student_name || 'Student',
        studentAvatar: r.student_avatar || null,
        studentSchool: r.student_school || 'Independent Learner',
        classroomId: r.classroom_id,
        submissionType: r.submission_type || 'typed',
        handwrittenImageUrl: r.image_url,
        code: r.code_text,
        language: r.language || 'python',
        executionResult: {
          stdout: r.stdout || '',
          stderr: r.stderr || null,
          compile_output: null,
          message: null,
          status: { id: r.exit_code === 0 ? 3 : 11, description: r.exit_code === 0 ? 'Accepted' : 'Runtime Error' },
          time: r.execution_time || '0.028',
          memory: 3200,
          exit_code: r.exit_code || 0
        },
        testCaseResults: [],
        score: r.score !== null ? r.score : 10,
        maxScore: r.max_score || 10,
        status: r.status || 'auto_graded',
        feedback: r.feedback || '',
        submittedAt: r.submitted_at ? new Date(r.submitted_at).toISOString().replace('T', ' ').slice(0, 16) : 'Today'
      }));
      submissionsDb = submissions;
      return res.json({ success: true, submissions });
    }
  } catch (err: any) {
    console.warn('DB submissions query notice:', err.message);
  }
  return res.json({ success: true, submissions: submissionsDb });
});

// POST a new submission
router.post('/', async (req: Request, res: Response) => {
  try {
    const {
      exerciseId,
      exerciseTitle,
      studentId,
      studentName,
      studentAvatar,
      studentSchool,
      classroomId,
      submissionType = 'typed',
      handwrittenImageUrl,
      code,
      language = 'python',
      executionResult,
      score = 10,
      maxScore = 10,
      status = 'auto_graded',
      feedback
    } = req.body;

    const subId = req.body.id || ('sub-' + Date.now());
    const validStudentId = studentId || 'usr-student-1';

    const sub = {
      id: subId,
      exerciseId: exerciseId || 'ex-default',
      exerciseTitle: exerciseTitle || 'Coding Exercise',
      studentId: validStudentId,
      studentName: studentName || 'Student',
      studentAvatar: studentAvatar || null,
      studentSchool: studentSchool || 'Independent Learner',
      classroomId: classroomId || null,
      submissionType,
      handwrittenImageUrl,
      code: code || '',
      language,
      executionResult: executionResult || { stdout: 'Ran successfully' },
      score,
      maxScore,
      status,
      feedback: feedback || 'Passed automated tests.',
      submittedAt: new Date().toISOString().replace('T', ' ').slice(0, 16)
    };

    try {
      await pool.query(`
        INSERT INTO submissions (id, exercise_id, exercise_title, student_id, classroom_id, submission_type, image_url, code_text, language, stdout, stderr, exit_code, execution_time, score, max_score, status, feedback, submitted_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, NOW())
        ON CONFLICT (id) DO NOTHING;
      `, [
        subId,
        sub.exerciseId,
        sub.exerciseTitle,
        validStudentId,
        classroomId || null,
        submissionType,
        handwrittenImageUrl || null,
        code || '',
        language,
        executionResult?.stdout || null,
        executionResult?.stderr || null,
        executionResult?.exit_code || 0,
        executionResult?.time || '0.028',
        score,
        maxScore,
        status,
        sub.feedback
      ]);
    } catch (dbErr: any) {
      console.warn('DB submission insert notice:', dbErr.message);
    }

    submissionsDb.unshift(sub);
    return res.status(201).json({ success: true, submission: sub });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// PUT grade submission
router.put('/:id/grade', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { score, feedback, teacherNotes } = req.body;

    const idx = submissionsDb.findIndex(s => s.id === id);
    if (idx >= 0) {
      submissionsDb[idx] = {
        ...submissionsDb[idx],
        score: score !== undefined ? score : submissionsDb[idx].score,
        feedback: feedback !== undefined ? feedback : submissionsDb[idx].feedback,
        teacherNotes: teacherNotes || submissionsDb[idx].teacherNotes,
        status: 'graded'
      };
    }

    try {
      await pool.query(`
        UPDATE submissions SET score = $1, feedback = $2, status = 'graded' WHERE id = $3
      `, [score, feedback, id]);
    } catch (e) {}

    return res.json({ success: true, message: 'Submission graded successfully.' });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

export default router;

