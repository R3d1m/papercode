import { Router, Request, Response } from 'express';
import { pool } from '../db';

const router = Router();

// In-memory assignment store fallback & database integration
let assignmentsStore: Record<string, any[]> = {};

// GET all classrooms with live enrolled student rosters from PostgreSQL
router.get('/', async (req: Request, res: Response) => {
  try {
    const classRes = await pool.query('SELECT * FROM classrooms ORDER BY created_at DESC');
    
    // Fetch all enrollments joined with user profile data
    let enrollmentsRes;
    try {
      enrollmentsRes = await pool.query(`
        SELECT ce.classroom_id, u.id as student_id, u.name, u.email, u.avatar_url, u.school, u.division, u.xp_points
        FROM classroom_enrollments ce
        JOIN users u ON ce.student_id = u.id
        ORDER BY ce.enrolled_at DESC;
      `);
    } catch {
      enrollmentsRes = { rows: [] };
    }

    const rosterByClass: Record<string, any[]> = {};
    for (const enr of enrollmentsRes.rows) {
      if (!rosterByClass[enr.classroom_id]) rosterByClass[enr.classroom_id] = [];
      rosterByClass[enr.classroom_id].push({
        studentId: enr.student_id,
        name: enr.name,
        email: enr.email,
        avatar: enr.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        school: enr.school || 'Student',
        division: enr.division || 'Dhaka',
        completedAssignmentsCount: 0,
        averageScore: 100,
        lastActive: 'Active today'
      });
    }

    // Fetch all assignments from PostgreSQL
    let assignmentsRes;
    try {
      assignmentsRes = await pool.query('SELECT * FROM assignments ORDER BY created_at DESC');
    } catch {
      assignmentsRes = { rows: [] };
    }

    const assignmentsByClass: Record<string, any[]> = {};
    for (const a of assignmentsRes.rows) {
      if (!assignmentsByClass[a.classroom_id]) assignmentsByClass[a.classroom_id] = [];
      assignmentsByClass[a.classroom_id].push({
        id: a.id,
        title: a.title,
        description: a.description,
        dueDate: a.due_date,
        maxScore: a.max_score,
        assignedDate: a.assigned_date,
        courseTitle: a.course_title,
        status: 'active',
        totalSubmissions: 0,
        totalStudents: rosterByClass[a.classroom_id]?.length || 0
      });
    }

    const classrooms = classRes.rows.map(r => ({
      id: r.id,
      name: r.name,
      gradeLevel: r.grade || 'Class 9',
      subject: r.subject || 'ICT',
      teacherId: r.teacher_id,
      teacherName: 'Teacher',
      joinCode: r.join_code || 'PC-1000',
      code: r.join_code || 'PC-1000',
      archived: false,
      roster: rosterByClass[r.id] || [],
      assignments: assignmentsByClass[r.id] || [],
      courseIds: Array.isArray(r.course_ids) ? r.course_ids : (r.course_ids ? [r.course_ids] : ['crs-py-101'])
    }));

    return res.json({ success: true, classrooms });
  } catch (err: any) {
    console.error('Error fetching classrooms:', err.message);
    return res.json({ success: true, classrooms: [] });
  }
});

// POST: Create a new Classroom in PostgreSQL
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, subject, grade, teacherId = 'usr-tch-001', courseIds = ['crs-py-101'], joinCode: requestedJoinCode } = req.body;
    const id = 'cls-' + Date.now();
    const joinCode = (requestedJoinCode || ('PC-' + Math.floor(1000 + Math.random() * 9000))).trim().toUpperCase();

    // Verify teacherId in users table
    let validTeacherId = teacherId;
    if (validTeacherId) {
      const tchCheck = await pool.query('SELECT id FROM users WHERE id = $1', [validTeacherId]);
      if (tchCheck.rows.length === 0) {
        const fallbackUser = await pool.query("SELECT id FROM users WHERE role IN ('teacher', 'admin') LIMIT 1");
        validTeacherId = fallbackUser.rows[0]?.id || null;
      }
    }

    const query = `
      INSERT INTO classrooms (id, teacher_id, name, subject, grade, join_code, course_ids, created_at) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, NOW()) 
      RETURNING *;
    `;
    const result = await pool.query(query, [id, validTeacherId, name, subject, grade, joinCode, courseIds]);
    const r = result.rows[0];

    const classroom = {
      id: r.id,
      name: r.name,
      gradeLevel: r.grade || grade,
      subject: r.subject || subject,
      teacherId: r.teacher_id,
      teacherName: 'Teacher',
      joinCode: r.join_code,
      code: r.join_code,
      archived: false,
      roster: [],
      assignments: [],
      courseIds: Array.isArray(r.course_ids) ? r.course_ids : courseIds
    };
    return res.status(201).json({ success: true, classroom });
  } catch (err: any) {
    console.error('Error creating classroom:', err.message);
    return res.status(500).json({ success: false, message: err.message });
  }
});

// PUT: Update Classroom Attached Courses
router.put('/:id/courses', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { courseIds } = req.body;
    await pool.query('UPDATE classrooms SET course_ids = $1 WHERE id = $2', [courseIds || [], id]);
    return res.json({ success: true, message: 'Classroom courses updated successfully.', courseIds });
  } catch (err: any) {
    console.error('Error updating classroom courses:', err.message);
    return res.status(500).json({ success: false, message: err.message });
  }
});

// POST: Student Enrolls in Classroom via Join Code
router.post('/join', async (req: Request, res: Response) => {
  try {
    const { code, studentId } = req.body;
    if (!code) return res.status(400).json({ success: false, message: 'Class Join Code is required.' });

    const formattedCode = code.trim().toUpperCase();
    const result = await pool.query('SELECT * FROM classrooms WHERE UPPER(join_code) = $1', [formattedCode]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Invalid or expired class join code (' + formattedCode + ').' });
    }

    const cls = result.rows[0];
    const targetStudentId = studentId || 'usr-student-1';
    const enrollId = 'enr-' + Date.now();

    try {
      await pool.query(
        'INSERT INTO classroom_enrollments (id, classroom_id, student_id, enrolled_at) VALUES ($1, $2, $3, NOW()) ON CONFLICT DO NOTHING',
        [enrollId, cls.id, targetStudentId]
      );
    } catch (e: any) {
      console.warn('Enrollment insert note:', e.message);
    }

    // Fetch student info
    let studentInfo: any = null;
    try {
      const uRes = await pool.query('SELECT id, name, email, avatar_url, school, division FROM users WHERE id = $1', [targetStudentId]);
      if (uRes.rows.length > 0) studentInfo = uRes.rows[0];
    } catch {}

    return res.json({
      success: true,
      message: 'Successfully enrolled in ' + cls.name + '!',
      classroom: {
        id: cls.id,
        name: cls.name,
        gradeLevel: cls.grade,
        subject: cls.subject,
        teacherId: cls.teacher_id,
        joinCode: cls.join_code,
        student: studentInfo
      }
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE: Remove student from classroom
router.delete('/:id/students/:studentId', async (req: Request, res: Response) => {
  try {
    const { id, studentId } = req.params;
    await pool.query('DELETE FROM classroom_enrollments WHERE classroom_id = $1 AND student_id = $2', [id, studentId]);
    return res.json({ success: true, message: 'Student removed from classroom.' });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// POST: Add Assignment to Classroom
router.post('/:id/assignments', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { id: reqId, title, dueDate, maxScore = 100, description, assignedDate, courseTitle } = req.body;
    const asgId = reqId || ('asg-' + Date.now());
    const effectiveAssignedDate = assignedDate || new Date().toISOString().slice(0, 10);
    const effectiveDueDate = dueDate || new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10);

    const query = `
      INSERT INTO assignments (id, classroom_id, title, description, due_date, max_score, assigned_date, course_title, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
      ON CONFLICT (id) DO UPDATE SET
        title = EXCLUDED.title,
        description = EXCLUDED.description,
        due_date = EXCLUDED.due_date,
        max_score = EXCLUDED.max_score,
        assigned_date = EXCLUDED.assigned_date,
        course_title = EXCLUDED.course_title
      RETURNING *;
    `;
    const result = await pool.query(query, [
      asgId,
      id,
      title || 'New Assignment',
      description || 'Complete the assigned exercises.',
      effectiveDueDate,
      maxScore,
      effectiveAssignedDate,
      courseTitle || 'Python 3 Foundations'
    ]);

    const r = result.rows[0];
    const newAssignment = {
      id: r.id,
      title: r.title,
      description: r.description,
      dueDate: r.due_date,
      maxScore: r.max_score,
      assignedDate: r.assigned_date,
      courseTitle: r.course_title,
      totalSubmissions: 0,
      totalStudents: 0,
      status: 'active'
    };

    return res.status(201).json({ success: true, assignment: newAssignment });
  } catch (err: any) {
    console.error('Error saving assignment in DB:', err.message);
    return res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE: Delete Assignment from Classroom
router.delete('/:id/assignments/:assignmentId', async (req: Request, res: Response) => {
  try {
    const { assignmentId } = req.params;
    await pool.query('DELETE FROM assignments WHERE id = $1', [assignmentId]);
    return res.json({ success: true, message: 'Assignment deleted.' });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE: Delete Classroom
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM classroom_enrollments WHERE classroom_id = $1', [id]);
    await pool.query('DELETE FROM classrooms WHERE id = $1', [id]);
    return res.json({ success: true, message: 'Classroom deleted.' });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
