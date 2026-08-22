import { pool } from './index';

export async function seedDatabase() {
  try {
    // 1. Create Tables if they don't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
          id VARCHAR(64) PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          password_hash VARCHAR(255),
          role VARCHAR(32) NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'teacher', 'moderator', 'admin')),
          school VARCHAR(255) DEFAULT 'Independent Learner',
          division VARCHAR(64) DEFAULT 'Chittagong',
          avatar_url TEXT,
          google_id VARCHAR(255),
          xp_points INTEGER DEFAULT 0,
          streak_days INTEGER DEFAULT 1,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS courses (
          id VARCHAR(64) PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          description TEXT,
          language VARCHAR(32) NOT NULL,
          level VARCHAR(32) NOT NULL DEFAULT 'Beginner',
          author_id VARCHAR(64) REFERENCES users(id) ON DELETE SET NULL,
          author_name VARCHAR(255),
          is_published BOOLEAN DEFAULT true,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS modules (
          id VARCHAR(64) PRIMARY KEY,
          course_id VARCHAR(64) REFERENCES courses(id) ON DELETE CASCADE,
          title VARCHAR(255) NOT NULL,
          description TEXT,
          sort_order INTEGER DEFAULT 1,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS lessons (
          id VARCHAR(64) PRIMARY KEY,
          module_id VARCHAR(64) REFERENCES modules(id) ON DELETE CASCADE,
          title VARCHAR(255) NOT NULL,
          subtitle TEXT,
          xp_reward INTEGER DEFAULT 150,
          duration_minutes INTEGER DEFAULT 20,
          sort_order INTEGER DEFAULT 1,
          theory_html TEXT,
          mcq_data JSONB,
          exercise_data JSONB,
          blocks_data JSONB,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      ALTER TABLE lessons ADD COLUMN IF NOT EXISTS blocks_data JSONB;
      ALTER TABLE lessons ADD COLUMN IF NOT EXISTS duration_minutes INTEGER DEFAULT 20;

      CREATE TABLE IF NOT EXISTS classrooms (
          id VARCHAR(64) PRIMARY KEY,
          teacher_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
          name VARCHAR(255) NOT NULL,
          subject VARCHAR(255) NOT NULL,
          grade VARCHAR(64) NOT NULL,
          join_code VARCHAR(16) UNIQUE NOT NULL,
          course_ids TEXT[] DEFAULT ARRAY[]::TEXT[],
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      ALTER TABLE classrooms ADD COLUMN IF NOT EXISTS course_ids TEXT[] DEFAULT ARRAY[]::TEXT[];

      CREATE TABLE IF NOT EXISTS classroom_enrollments (
          id VARCHAR(64) PRIMARY KEY,
          classroom_id VARCHAR(64) REFERENCES classrooms(id) ON DELETE CASCADE,
          student_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
          enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          UNIQUE(classroom_id, student_id)
      );

      CREATE TABLE IF NOT EXISTS assignments (
          id VARCHAR(64) PRIMARY KEY,
          classroom_id VARCHAR(64) REFERENCES classrooms(id) ON DELETE CASCADE,
          title VARCHAR(255) NOT NULL,
          description TEXT,
          due_date VARCHAR(64),
          max_score INTEGER DEFAULT 100,
          assigned_date VARCHAR(64),
          course_title VARCHAR(255),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS submissions (
          id VARCHAR(64) PRIMARY KEY,
          exercise_id VARCHAR(64) NOT NULL,
          exercise_title VARCHAR(255) NOT NULL,
          student_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
          classroom_id VARCHAR(64) REFERENCES classrooms(id) ON DELETE SET NULL,
          submission_type VARCHAR(32) DEFAULT 'photo',
          image_url TEXT,
          code_text TEXT NOT NULL,
          language VARCHAR(32) NOT NULL DEFAULT 'python',
          stdout TEXT,
          stderr TEXT,
          exit_code INTEGER DEFAULT 0,
          execution_time VARCHAR(32),
          score INTEGER DEFAULT 10,
          max_score INTEGER DEFAULT 10,
          status VARCHAR(32) DEFAULT 'auto_graded',
          feedback TEXT,
          submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS lesson_progress (
          id VARCHAR(64) PRIMARY KEY,
          user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
          lesson_id VARCHAR(64) NOT NULL,
          course_id VARCHAR(64),
          xp_earned INTEGER DEFAULT 150,
          completed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          UNIQUE(user_id, lesson_id)
      );

      ALTER TABLE users ADD COLUMN IF NOT EXISTS completed_lessons TEXT[] DEFAULT ARRAY[]::TEXT[];
    `);

    // 2. Clear any unsplash URLs from existing users in DB
    await pool.query("UPDATE users SET avatar_url = NULL WHERE avatar_url LIKE '%unsplash.com%'");

    // 3. Seed Admin User in PostgreSQL
    const adminEmail = 'admin@papercode.edu.bd';
    const adminCheck = await pool.query('SELECT id FROM users WHERE email = $1', [adminEmail]);
    if (adminCheck.rows.length === 0) {
      await pool.query(`
        INSERT INTO users (id, name, email, password_hash, role, school, division, avatar_url, xp_points, streak_days)
        VALUES (
          'usr-admin-hq-01',
          'Dr. Rafiqul Islam (Admin HQ)',
          $1,
          'Admin@PaperCode2026',
          'admin',
          'PaperCode Central Operations & CUET Lab',
          'Chittagong',
          NULL,
          35000,
          120
        );
      `, [adminEmail]);
      console.log('✅ Admin user seeded in PostgreSQL:', adminEmail);
    } else {
      // Ensure role is admin
      await pool.query("UPDATE users SET role = 'admin', password_hash = 'Admin@PaperCode2026', avatar_url = NULL WHERE email = $1 AND avatar_url LIKE '%unsplash%'", [adminEmail]);
    }

    // 4. Seed Default Teacher in PostgreSQL
    const teacherEmail = 'nusrat.jahan@cuet.ac.bd';
    const teacherCheck = await pool.query('SELECT id FROM users WHERE email = $1', [teacherEmail]);
    if (teacherCheck.rows.length === 0) {
      await pool.query(`
        INSERT INTO users (id, name, email, password_hash, role, school, division, avatar_url, xp_points, streak_days)
        VALUES (
          'usr-tch-001',
          'Engr. Nusrat Jahan',
          $1,
          'Teacher@PaperCode2026',
          'teacher',
          'CUET EdTech Lab & ICT Mentor',
          'Chittagong',
          NULL,
          12400,
          42
        );
      `, [teacherEmail]);
      console.log('✅ Teacher user seeded in PostgreSQL:', teacherEmail);
    }

    // 5. Seed Default Student in PostgreSQL
    const studentEmail = 'tanvir@collegiate.edu.bd';
    const studentCheck = await pool.query('SELECT id FROM users WHERE email = $1', [studentEmail]);
    if (studentCheck.rows.length === 0) {
      await pool.query(`
        INSERT INTO users (id, name, email, password_hash, role, school, division, avatar_url, xp_points, streak_days)
        VALUES (
          'usr-std-001',
          'Tanvir Hossain',
          $1,
          'Student@PaperCode2026',
          'student',
          'Chittagong Collegiate School',
          'Chittagong',
          NULL,
          2850,
          14
        );
      `, [studentEmail]);
      console.log('✅ Student user seeded in PostgreSQL:', studentEmail);
    }

  } catch (err) {
    console.error('Error seeding database:', err.message);
  }
}
