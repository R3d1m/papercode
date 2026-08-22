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
    const avatar = null;

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

    // Query Neon PostgreSQL users table
    let result = await pool.query('SELECT * FROM users WHERE LOWER(email) = $1', [normalizedEmail]);
    
    // Auto-seed admin if logging in as admin for first time
    if (result.rows.length === 0 && (normalizedEmail === 'admin@papercode.edu.bd' || normalizedEmail === 'admin@papercode.org')) {
      await pool.query(`
        INSERT INTO users (id, name, email, password_hash, role, school, division, avatar_url, xp_points, streak_days)
        VALUES ('usr-admin-hq-01', 'Dr. Rafiqul Islam (Admin HQ)', $1, 'Admin@PaperCode2026', 'admin', 'PaperCode Central Operations & CUET Lab', 'Chittagong', NULL, 35000, 120)
        ON CONFLICT (email) DO NOTHING
      `, [normalizedEmail]);
      result = await pool.query('SELECT * FROM users WHERE LOWER(email) = $1', [normalizedEmail]);
    }
    
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

    // Retrieve real completed lessons from DB
    const progRes = await pool.query('SELECT DISTINCT lesson_id FROM lesson_progress WHERE user_id = $1', [u.id]);
    const completedLessonIds = Array.from(new Set([
      ...(progRes.rows.map(r => r.lesson_id)),
      ...(u.completed_lessons || [])
    ]));

    const authenticatedUser = {
      id: u.id,
      name: u.name,
      email: u.email,
      role: userRole,
      school: u.school || (userRole === 'teacher' ? 'Educator' : 'Student'),
      division: u.division || 'Dhaka',
      avatar: u.avatar_url || null,
      xp: u.xp_points || 0,
      streak: u.streak_days || 0,
      enrolledCourseIds: [],
      enrolledClassroomIds: [],
      completedLessons: completedLessonIds,
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

router.post('/google', async (req: Request, res: Response) => {
  try {
    const { credential, accessToken, role = 'student', school, division = 'Chittagong', profile } = req.body;

    let googleEmail = '';
    let googleName = '';
    let googleId = '';
    let googleAvatar = '';

    // 1. Verify via ID Token / JWT Credential from Google GSI
    if (credential) {
      try {
        const verifyRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${credential}`);
        if (verifyRes.ok) {
          const payload = await verifyRes.json();
          googleEmail = payload.email || '';
          googleName = payload.name || '';
          googleId = payload.sub || '';
          googleAvatar = payload.picture || '';
        }
      } catch (err: any) {
        console.warn('Google tokeninfo verification error:', err.message);
      }
    }

    // 2. Verify via Access Token
    if (!googleEmail && accessToken) {
      try {
        const userinfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        if (userinfoRes.ok) {
          const info = await userinfoRes.json();
          googleEmail = info.email || '';
          googleName = info.name || '';
          googleId = info.sub || '';
          googleAvatar = info.picture || '';
        }
      } catch (err: any) {
        console.warn('Google userinfo fetch error:', err.message);
      }
    }

    // 3. Fallback to passed profile if direct Google token verification was filtered/offline
    if (!googleEmail && profile && profile.email) {
      googleEmail = profile.email;
      googleName = profile.name || profile.email.split('@')[0];
      googleId = profile.id || profile.sub || ('g-' + Date.now());
      googleAvatar = profile.picture || profile.avatar || '';
    }

    if (!googleEmail) {
      return res.status(400).json({
        success: false,
        message: 'Google authentication failed: Could not verify Google identity.'
      });
    }

    const normalizedEmail = googleEmail.trim().toLowerCase();

    // Check if System Admin email
    if (normalizedEmail === ADMIN_CREDENTIALS.email.toLowerCase() || normalizedEmail === 'admin@papercode.org') {
      const adminUser = {
        id: 'usr-admin-hq-01',
        name: ADMIN_CREDENTIALS.name,
        email: ADMIN_CREDENTIALS.email,
        role: 'admin',
        school: ADMIN_CREDENTIALS.school,
        division: ADMIN_CREDENTIALS.division,
        avatar: googleAvatar || null,
        xp: 35000,
        streak: 120,
        permissions: ['all_access', 'manage_moderators', 'edit_roadmaps', 'create_courses', 'manage_lessons'],
        token: 'jwt_admin_token_' + Date.now()
      };
      return res.json({ success: true, message: 'Welcome to Admin HQ!', user: adminUser });
    }

    // Query Neon PostgreSQL users table
    const existing = await pool.query('SELECT * FROM users WHERE LOWER(email) = $1', [normalizedEmail]);

    if (existing.rows.length > 0) {
      const u = existing.rows[0];

      // Update google_id and avatar if missing
      if (!u.google_id || !u.avatar_url) {
        await pool.query(
          'UPDATE users SET google_id = COALESCE(google_id, $1), avatar_url = COALESCE(avatar_url, $2), updated_at = CURRENT_TIMESTAMP WHERE id = $3',
          [googleId || null, googleAvatar || u.avatar_url, u.id]
        );
      }

      const userRole = u.role || 'student';

      // Retrieve real completed lessons from DB
      const progRes = await pool.query('SELECT DISTINCT lesson_id FROM lesson_progress WHERE user_id = $1', [u.id]);
      const completedLessonIds = Array.from(new Set([
        ...(progRes.rows.map(r => r.lesson_id)),
        ...(u.completed_lessons || [])
      ]));

      const authenticatedUser = {
        id: u.id,
        name: u.name,
        email: u.email,
        role: userRole,
        school: u.school || (userRole === 'teacher' ? 'Educator' : 'Student'),
        division: u.division || 'Dhaka',
        avatar: googleAvatar || u.avatar_url || null,
        xp: u.xp_points || 0,
        streak: u.streak_days || 0,
        enrolledCourseIds: [],
        enrolledClassroomIds: [],
        completedLessons: completedLessonIds,
        token: 'jwt_google_token_' + Date.now()
      };

      return res.json({
        success: true,
        message: `Welcome back, ${u.name}!`,
        user: authenticatedUser
      });
    }

    // New User: Auto-register into PostgreSQL
    const userId = 'usr-' + Date.now();
    const effectiveRole = (role === 'teacher' || role === 'student') ? role : 'student';
    const effectiveAvatar = googleAvatar || null;
    const effectiveSchool = school?.trim() || (effectiveRole === 'teacher' ? 'Independent Educator / School' : 'Independent Learner');
    const effectiveDivision = division || 'Chittagong';

    const insertQuery = `
      INSERT INTO users (id, name, email, password_hash, role, school, division, avatar_url, google_id, xp_points, streak_days)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 0, 0)
      RETURNING *;
    `;

    const result = await pool.query(insertQuery, [
      userId,
      googleName.trim() || 'PaperCode Learner',
      normalizedEmail,
      'google_oauth_verified',
      effectiveRole,
      effectiveSchool,
      effectiveDivision,
      effectiveAvatar,
      googleId || null
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
      token: 'jwt_google_token_' + Date.now()
    };

    return res.status(201).json({
      success: true,
      message: `Account created successfully with Google! Welcome to PaperCode, ${newUser.name}.`,
      user: newUser
    });
  } catch (err: any) {
    console.error('Google login route error:', err.message);
    return res.status(500).json({ success: false, message: 'Database error processing Google login: ' + err.message });
  }
});

// PUT: Update User Profile (Name, School, Division, Avatar)
router.put('/profile', async (req: Request, res: Response) => {
  try {
    const { userId, email, role, name, school, division, avatar } = req.body;
    if (!userId && !email) {
      return res.status(400).json({ success: false, message: 'User ID or email is required.' });
    }

    // 1. Try updating by ID
    let result = await pool.query(`
      UPDATE users 
      SET 
        name = COALESCE($1, name),
        school = COALESCE($2, school),
        division = COALESCE($3, division),
        avatar_url = COALESCE($4, avatar_url),
        role = COALESCE($5, role),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $6
      RETURNING *;
    `, [
      name ? name.trim() : null,
      school ? school.trim() : null,
      division ? division.trim() : null,
      avatar || null,
      role || null,
      userId
    ]);

    // 2. If not found by ID, try updating by email
    if (result.rows.length === 0 && email) {
      result = await pool.query(`
        UPDATE users 
        SET 
          name = COALESCE($1, name),
          school = COALESCE($2, school),
          division = COALESCE($3, division),
          avatar_url = COALESCE($4, avatar_url),
          role = COALESCE($5, role),
          updated_at = CURRENT_TIMESTAMP
        WHERE LOWER(email) = LOWER($6)
        RETURNING *;
      `, [
        name ? name.trim() : null,
        school ? school.trim() : null,
        division ? division.trim() : null,
        avatar || null,
        role || null,
        email.trim()
      ]);
    }

    // 3. If user record is completely missing from DB, insert it now
    if (result.rows.length === 0) {
      const effectiveId = userId || ('usr-' + Date.now());
      const effectiveEmail = email ? email.trim().toLowerCase() : `${effectiveId}@papercode.edu.bd`;
      const userRole = role || (userId?.includes('adm') ? 'admin' : (userId?.includes('tch') ? 'teacher' : 'student'));
      result = await pool.query(`
        INSERT INTO users (id, name, email, role, school, division, avatar_url, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP)
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          role = CASE WHEN users.role = 'admin' THEN 'admin' ELSE EXCLUDED.role END,
          school = EXCLUDED.school,
          division = EXCLUDED.division,
          avatar_url = EXCLUDED.avatar_url,
          updated_at = CURRENT_TIMESTAMP
        RETURNING *;
      `, [
        effectiveId,
        name ? name.trim() : 'PaperCode User',
        effectiveEmail,
        userRole,
        school ? school.trim() : 'Independent Learner',
        division ? division.trim() : 'Chittagong',
        avatar || null
      ]);
    }

    const u = result.rows[0];
    const updatedUser = {
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      school: u.school,
      division: u.division,
      avatar: u.avatar_url,
      xp: u.xp_points || 0,
      streak: u.streak_days || 0
    };

    return res.json({
      success: true,
      message: 'Profile updated successfully!',
      user: updatedUser
    });
  } catch (err: any) {
    console.error('Profile update error:', err.message);
    return res.status(500).json({ success: false, message: 'Failed to update profile: ' + err.message });
  }
});

// POST: Change Password
router.post('/change-password', async (req: Request, res: Response) => {
  try {
    const { userId, email, currentPassword, newPassword } = req.body;
    if ((!userId && !email) || !currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'User identifier, current password, and new password are required.' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'New password must be at least 6 characters.' });
    }

    let userRes = await pool.query('SELECT id, password_hash FROM users WHERE id = $1', [userId]);
    if (userRes.rows.length === 0 && email) {
      userRes = await pool.query('SELECT id, password_hash FROM users WHERE LOWER(email) = LOWER($1)', [email.trim()]);
    }

    if (userRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found in system.' });
    }

    const targetUserId = userRes.rows[0].id;
    const currentHash = userRes.rows[0].password_hash;
    if (currentHash && currentHash !== currentPassword && currentHash !== 'default_pass_123') {
      return res.status(401).json({ success: false, message: 'Incorrect current password. Please try again.' });
    }

    await pool.query('UPDATE users SET password_hash = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2', [newPassword, targetUserId]);

    return res.json({
      success: true,
      message: 'Password updated successfully!'
    });
  } catch (err: any) {
    console.error('Change password error:', err.message);
    return res.status(500).json({ success: false, message: 'Failed to change password: ' + err.message });
  }
});

export default router;
