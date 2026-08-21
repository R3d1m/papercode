-- =================================================================
-- PaperCode Bangladesh - PostgreSQL Database Schema
-- Run this script in PostgreSQL (psql / Supabase / Neon / pgAdmin)
-- =================================================================

-- 1. Users & Roles
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

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- 2. Courses & Tracks
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

-- 3. Modules
CREATE TABLE IF NOT EXISTS modules (
    id VARCHAR(64) PRIMARY KEY,
    course_id VARCHAR(64) REFERENCES courses(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    sort_order INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Lessons & Challenges
CREATE TABLE IF NOT EXISTS lessons (
    id VARCHAR(64) PRIMARY KEY,
    module_id VARCHAR(64) REFERENCES modules(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    subtitle TEXT,
    xp_reward INTEGER DEFAULT 150,
    sort_order INTEGER DEFAULT 1,
    theory_html TEXT,
    mcq_data JSONB,
    exercise_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Student Lesson Progress
CREATE TABLE IF NOT EXISTS lesson_progress (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
    lesson_id VARCHAR(64) REFERENCES lessons(id) ON DELETE CASCADE,
    is_completed BOOLEAN DEFAULT false,
    score INTEGER DEFAULT 0,
    completed_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(user_id, lesson_id)
);

-- 6. Classrooms & Enrolment
CREATE TABLE IF NOT EXISTS classrooms (
    id VARCHAR(64) PRIMARY KEY,
    teacher_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    grade VARCHAR(64) NOT NULL,
    join_code VARCHAR(16) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS classroom_enrollments (
    id VARCHAR(64) PRIMARY KEY,
    classroom_id VARCHAR(64) REFERENCES classrooms(id) ON DELETE CASCADE,
    student_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
    enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(classroom_id, student_id)
);

-- 7. Submissions & Code Scans
CREATE TABLE IF NOT EXISTS submissions (
    id VARCHAR(64) PRIMARY KEY,
    exercise_id VARCHAR(64) NOT NULL,
    exercise_title VARCHAR(255) NOT NULL,
    student_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
    classroom_id VARCHAR(64) REFERENCES classrooms(id) ON DELETE SET NULL,
    submission_type VARCHAR(32) DEFAULT 'photo' CHECK (submission_type IN ('photo', 'typed')),
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

CREATE INDEX IF NOT EXISTS idx_submissions_student ON submissions(student_id);
CREATE INDEX IF NOT EXISTS idx_submissions_classroom ON submissions(classroom_id);

-- 8. Community Blog Articles
CREATE TABLE IF NOT EXISTS blogs (
    id VARCHAR(64) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    subtitle TEXT,
    category VARCHAR(64) NOT NULL,
    cover_image TEXT,
    author_id VARCHAR(64) REFERENCES users(id) ON DELETE SET NULL,
    author_name VARCHAR(255) NOT NULL,
    author_role VARCHAR(255),
    author_affiliation VARCHAR(255),
    author_avatar TEXT,
    read_time VARCHAR(32) DEFAULT '5 min read',
    claps INTEGER DEFAULT 0,
    tags TEXT[],
    content TEXT[] NOT NULL,
    is_published BOOLEAN DEFAULT true,
    published_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_blogs_category ON blogs(category);
