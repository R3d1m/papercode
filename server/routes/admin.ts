import { Router, Request, Response } from 'express';
import { pool } from '../db';

const router = Router();

let geminiHitCounter = 0;

export function incrementGeminiHitCount() {
  geminiHitCounter += 1;
}

router.get('/vitals', async (req: Request, res: Response) => {
  try {
    const studentsRes = await pool.query("SELECT COUNT(*) FROM users WHERE role = 'student'");
    const teachersRes = await pool.query("SELECT COUNT(*) FROM users WHERE role = 'teacher'");
    const coursesRes = await pool.query('SELECT COUNT(*) FROM courses');
    const classroomsRes = await pool.query('SELECT COUNT(*) FROM classrooms');

    const totalStudents = parseInt(studentsRes.rows[0]?.count || '0', 10);
    const totalTeachers = parseInt(teachersRes.rows[0]?.count || '0', 10);
    const totalCourses = parseInt(coursesRes.rows[0]?.count || '0', 10);
    const totalClassrooms = parseInt(classroomsRes.rows[0]?.count || '0', 10);
    const totalRoadmaps = totalCourses > 0 ? 1 : 0;
    const activeUsers = Math.max(1, totalStudents + totalTeachers);

    return res.json({
      success: true,
      stats: {
        totalStudents,
        totalTeachers,
        totalCourses,
        totalRoadmaps,
        totalClassrooms,
        geminiHitCount: geminiHitCounter,
        activeUsers
      }
    });
  } catch (err: any) {
    console.error('Error fetching admin vitals:', err.message);
    return res.json({
      success: true,
      stats: {
        totalStudents: 0,
        totalTeachers: 0,
        totalCourses: 0,
        totalRoadmaps: 0,
        totalClassrooms: 0,
        geminiHitCount: 0,
        activeUsers: 1
      }
    });
  }
});

export default router;
