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

    const classrooms = classRes.rows.map(r => ({
      id: r.id,
      name: r.name,
      gradeLevel: r.grade || 'Class 9',
      subject: r.subject || 'ICT',
      teacherId: r.teacher_id,
      teacherName: 'Teacher',
      joinCode: r.join_code || 'PC-1000',
      archived: false,
      roster: rosterByClass[r.id] || [],
      assignments: assignmentsStore[r.id] || [],
      courseIds: ['crs-py-basics']
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
    const { name, subject, grade, teacherId = 'usr-teacher-1', courseIds = ['crs-py-basics'] } = req.body;
    const id = 'cls-' + Date.now();
    const joinCode = 'PC-' + Math.floor(1000 + Math.random() * 9000);

    const query = 'INSERT INTO classrooms (id, teacher_id, name, subject, grade, join_code, created_at) VALUES ($1, $2, $3, $4, $5, $6, NOW()) RETURNING *;';
    const result = await pool.query(query, [id, teacherId, name, subject, grade, joinCode]);
    const r = result.rows[0];

    const classroom = {
      id: r.id,
      name: r.name,
      gradeLevel: r.grade || grade,
      subject: r.subject || subject,
      teacherId: r.teacher_id,
      teacherName: 'Teacher',
      joinCode: r.join_code,
      archived: false,
      roster: [],
      assignments: [],
      courseIds: courseIds
    };
    return res.status(201).json({ success: true, classroom });
  } catch (err: any) {
    console.error('Error creating classroom:', err.message);
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
    const { title, dueDate, maxScore = 100, description, courseTitle } = req.body;
    
    const newAssignment = {
      id: 'asg-' + Date.now(),
      title: title || 'New Assignment',
      assignedDate: new Date().toISOString().slice(0, 10),
      dueDate: dueDate || new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10),
      totalSubmissions: 0,
      totalStudents: 0,
      status: 'active',
      description: description || 'Complete the assigned exercises.',
      courseTitle: courseTitle || 'Python 3 Foundations',
      maxScore
    };

    if (!assignmentsStore[id]) assignmentsStore[id] = [];
    assignmentsStore[id].push(newAssignment);

    return res.status(201).json({ success: true, assignment: newAssignment });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE: Delete Assignment from Classroom
router.delete('/:id/assignments/:assignmentId', async (req: Request, res: Response) => {
  try {
    const { id, assignmentId } = req.params;
    if (assignmentsStore[id]) {
      assignmentsStore[id] = assignmentsStore[id].filter(a => a.id !== assignmentId);
    }
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
