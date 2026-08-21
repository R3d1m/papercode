import { Router, Request, Response } from 'express';
import { pool } from '../db';

const router = Router();

const ADMIN_CREDENTIALS = {
  email: 'admin@papercode.edu.bd',
  password: 'Admin@PaperCode2026',
  name: 'Dr. Rafiqul Islam (Admin HQ)',
  role: 'admin',
  school: 'PaperCode Central Operations & CUET Lab',
  division: 'Chittagong'
};

router.post('/signup', async (req: Request, res: Response) => {
  try {
    const { name, email, password, role = 'student', school = 'Independent Learner', division = 'Chittagong' } = req.body;
    if (!name || !email) {
      return res.status(400).json({ success: false, message: 'Name and email are required.' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const userId = 'usr-' + Date.now();
    const avatar = role === 'teacher'
      ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150'
      : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150';

    try {
      const existing = await pool.query('SELECT * FROM users WHERE email = $1', [normalizedEmail]);
      if (existing.rows.length > 0) {
        return res.status(400).json({ success: false, message: 'An account with this email already exists. Please sign in.' });
      }

      const insertQuery = 'INSERT INTO users (id, name, email, password_hash, role, school, division, avatar_url, xp_points, streak_days) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 0, 0) RETURNING *;';
      const result = await pool.query(insertQuery, [
        userId,
        name.trim(),
        normalizedEmail,
        password || 'default_pass_123',
        role,
        school.trim() || (role === 'teacher' ? 'Independent Educator' : 'Independent Learner'),
        division,
        avatar
      ]);

      const dbUser = result.rows[0];
      const newUser = {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        role: dbUser.role,
        school: dbUser.school,
        division: dbUser.division,
        avatar: dbUser.avatar_url,
        xp: 0,
        streak: 0,
        enrolledCourseIds: [],
        enrolledClassroomIds: [],
        completedLessons: [],
        token: 'jwt_token_' + Date.now()
      };

      return res.status(201).json({
        success: true,
        message: 'Account created successfully! Welcome to PaperCode.',
        user: newUser
      });
    } catch (dbErr: any) {
      console.error('DB Signup error:', dbErr.message);
      return res.status(500).json({ success: false, message: 'Database error creating account: ' + dbErr.message });
    }
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password, role } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email address is required.' });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // 1. Check System Admin login with password
    if (normalizedEmail === ADMIN_CREDENTIALS.email.toLowerCase() || normalizedEmail === 'admin@papercode.org') {
      if (password && password !== ADMIN_CREDENTIALS.password) {
        return res.status(401).json({ success: false, message: 'Invalid Admin password. Access denied.' });
      }

      const adminUser = {
        id: 'usr-admin-hq-01',
        name: ADMIN_CREDENTIALS.name,
        email: ADMIN_CREDENTIALS.email,
        role: 'admin',
        school: ADMIN_CREDENTIALS.school,
        division: ADMIN_CREDENTIALS.division,
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        xp: 35000,
        streak: 120,
        permissions: ['all_access', 'manage_moderators', 'edit_roadmaps', 'create_courses', 'manage_lessons'],
        token: 'jwt_admin_token_' + Date.now()
      };
      return res.json({ success: true, message: 'Welcome to Admin HQ!', user: adminUser });
    }

    // 2. Query Neon PostgreSQL users table
    const result = await pool.query('SELECT * FROM users WHERE LOWER(email) = $1', [normalizedEmail]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'No account found with this email (' + normalizedEmail + '). Please click "Sign Up" to register.' 
      });
    }

    const u = result.rows[0];

    // Verify Password if stored
    if (u.password_hash && password) {
      if (u.password_hash !== password && u.password_hash !== 'default_pass_123') {
        return res.status(401).json({ success: false, message: 'Incorrect password. Please try again.' });
      }
    }

    // STRICT ROLE ENFORCEMENT: Enforce the role registered in PostgreSQL
    const userRole = u.role || 'student';

    const authenticatedUser = {
      id: u.id,
      name: u.name,
      email: u.email,
      role: userRole,
      school: u.school || (userRole === 'teacher' ? 'Educator' : 'Student'),
      division: u.division || 'Dhaka',
      avatar: u.avatar_url || (userRole === 'teacher' 
        ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150' 
        : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'),
      xp: u.xp_points || 0,
      streak: u.streak_days || 0,
      enrolledCourseIds: [],
      enrolledClassroomIds: [],
      completedLessons: [],
      token: 'jwt_token_' + Date.now()
    };

    return res.json({ 
      success: true, 
      message: 'Welcome back, ' + u.name + ' (' + userRole.toUpperCase() + ')!', 
      user: authenticatedUser 
    });
  } catch (err: any) {
    console.error('Login error:', err.message);
    return res.status(500).json({ success: false, message: 'Server authentication error: ' + err.message });
  }
});

export default router;
