"""
SQL database setup script for Intelligent Tutor Application
Run this script after creating the database to initialize it.
"""

-- Create database if not exists
CREATE DATABASE IF NOT EXISTS intelligent_tutor_db 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE intelligent_tutor_db;

-- Create users table
CREATE TABLE IF NOT EXISTS users_user (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    password VARCHAR(128) NOT NULL,
    last_login DATETIME NULL,
    is_superuser BOOLEAN NOT NULL DEFAULT FALSE,
    email VARCHAR(254) UNIQUE NOT NULL,
    first_name VARCHAR(150) NOT NULL,
    last_name VARCHAR(150) NOT NULL,
    role VARCHAR(20) DEFAULT 'student',
    level VARCHAR(20) NULL,
    phone VARCHAR(20) BLANK,
    bio LONGTEXT BLANK,
    date_of_birth DATE NULL,
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    last_login_ip VARCHAR(45) NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    is_staff BOOLEAN NOT NULL DEFAULT FALSE,
    created_at DATETIME AUTO_INCREMENT DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_level (level)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create student profile table
CREATE TABLE IF NOT EXISTS users_studentprofile (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT UNIQUE NOT NULL,
    learning_style VARCHAR(50) BLANK,
    interests JSON DEFAULT '[]',
    learning_speed DOUBLE DEFAULT 1.0,
    total_study_hours DOUBLE DEFAULT 0,
    last_activity DATETIME NULL,
    strengths JSON DEFAULT '[]',
    weaknesses JSON DEFAULT '[]',
    created_at DATETIME AUTO_INCREMENT DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users_user(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create teacher profile table
CREATE TABLE IF NOT EXISTS users_teacherprofile (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT UNIQUE NOT NULL,
    specialization VARCHAR(100),
    qualification LONGTEXT,
    experience_years INT DEFAULT 0,
    is_verified_teacher BOOLEAN NOT NULL DEFAULT FALSE,
    created_at DATETIME AUTO_INCREMENT DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users_user(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create subjects table
CREATE TABLE IF NOT EXISTS courses_subject (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) UNIQUE NOT NULL,
    code VARCHAR(20) UNIQUE NOT NULL,
    description LONGTEXT BLANK,
    icon VARCHAR(50) BLANK,
    created_at DATETIME AUTO_INCREMENT DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_name (name),
    INDEX idx_code (code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default subjects
INSERT INTO courses_subject (name, code, description) VALUES
('Mathématiques', 'math', 'Cours de mathématiques'),
('Français', 'french', 'Cours de langue française'),
('Anglais', 'english', 'Cours de langue anglaise'),
('Sciences', 'science', 'Cours des sciences naturelles'),
('Histoire', 'history', 'Cours d''histoire'),
('Géographie', 'geography', 'Cours de géographie'),
('Arts Plastiques', 'art', 'Cours d''arts plastiques'),
('Musique', 'music', 'Cours de musique'),
('Éducation Physique', 'pe', 'Cours d''éducation physique');

-- Create courses table
CREATE TABLE IF NOT EXISTS courses_course (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description LONGTEXT,
    subject_id BIGINT NOT NULL,
    level VARCHAR(20),
    created_by_id BIGINT NULL,
    status VARCHAR(20) DEFAULT 'draft',
    order_num INT DEFAULT 0,
    duration_hours DOUBLE DEFAULT 1.0,
    difficulty_level INT DEFAULT 1,
    cover_image VARCHAR(255) BLANK,
    learning_objectives JSON DEFAULT '[]',
    created_at DATETIME AUTO_INCREMENT DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (subject_id) REFERENCES courses_subject(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by_id) REFERENCES users_user(id) ON DELETE SET NULL,
    INDEX idx_status (status),
    INDEX idx_level (level),
    INDEX idx_subject (subject_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create lessons table
CREATE TABLE IF NOT EXISTS courses_lesson (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    course_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description LONGTEXT,
    content LONGTEXT,
    order_num INT DEFAULT 0,
    duration_minutes INT DEFAULT 15,
    video_url VARCHAR(255) BLANK,
    resources JSON DEFAULT '[]',
    learning_outcomes JSON DEFAULT '[]',
    created_at DATETIME AUTO_INCREMENT DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses_course(id) ON DELETE CASCADE,
    INDEX idx_course (course_id),
    INDEX idx_order (order_num)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create exercise category table
CREATE TABLE IF NOT EXISTS exercises_exercisecategory (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description LONGTEXT BLANK,
    INDEX idx_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create exercises table
CREATE TABLE IF NOT EXISTS exercises_exercise (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    lesson_id BIGINT NOT NULL,
    category_id BIGINT NULL,
    title VARCHAR(255) NOT NULL,
    description LONGTEXT,
    question LONGTEXT NOT NULL,
    type VARCHAR(20),
    difficulty INT DEFAULT 3,
    points INT DEFAULT 10,
    estimated_time_minutes INT DEFAULT 5,
    correct_answer LONGTEXT,
    explanation LONGTEXT BLANK,
    options JSON DEFAULT '[]',
    hints JSON DEFAULT '[]',
    order_num INT DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME AUTO_INCREMENT DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (lesson_id) REFERENCES courses_lesson(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES exercises_exercisecategory(id) ON DELETE SET NULL,
    INDEX idx_lesson (lesson_id),
    INDEX idx_difficulty (difficulty)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create exercise attempts table
CREATE TABLE IF NOT EXISTS exercises_exerciseattempt (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    student_id BIGINT NOT NULL,
    exercise_id BIGINT NOT NULL,
    status VARCHAR(20) DEFAULT 'in_progress',
    student_answer LONGTEXT,
    is_correct BOOLEAN NULL,
    score INT NULL,
    time_spent_seconds INT DEFAULT 0,
    hints_used INT DEFAULT 0,
    feedback LONGTEXT BLANK,
    graded_by_id BIGINT NULL,
    started_at DATETIME AUTO_INCREMENT DEFAULT CURRENT_TIMESTAMP,
    submitted_at DATETIME NULL,
    graded_at DATETIME NULL,
    FOREIGN KEY (student_id) REFERENCES users_user(id) ON DELETE CASCADE,
    FOREIGN KEY (exercise_id) REFERENCES exercises_exercise(id) ON DELETE CASCADE,
    FOREIGN KEY (graded_by_id) REFERENCES users_user(id) ON DELETE SET NULL,
    INDEX idx_student (student_id),
    INDEX idx_exercise (exercise_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create learning path table
CREATE TABLE IF NOT EXISTS progress_learningpath (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    student_id BIGINT UNIQUE NOT NULL,
    current_level VARCHAR(20) BLANK,
    courses_completed INT DEFAULT 0,
    lessons_completed INT DEFAULT 0,
    exercises_completed INT DEFAULT 0,
    total_study_time_seconds BIGINT DEFAULT 0,
    average_score DOUBLE DEFAULT 0,
    last_learning_date DATE NULL,
    learning_streak_days INT DEFAULT 0,
    created_at DATETIME AUTO_INCREMENT DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES users_user(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create course enrollment table
CREATE TABLE IF NOT EXISTS courses_courseenrollment (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    student_id BIGINT NOT NULL,
    course_id BIGINT NOT NULL,
    status VARCHAR(20) DEFAULT 'enrolled',
    progress_percentage DOUBLE DEFAULT 0,
    enrolled_at DATETIME AUTO_INCREMENT DEFAULT CURRENT_TIMESTAMP,
    started_at DATETIME NULL,
    completed_at DATETIME NULL,
    last_accessed DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_enrollment (student_id, course_id),
    FOREIGN KEY (student_id) REFERENCES users_user(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses_course(id) ON DELETE CASCADE,
    INDEX idx_status (status),
    INDEX idx_student (student_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create achievements table
CREATE TABLE IF NOT EXISTS progress_achievement (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description LONGTEXT,
    category VARCHAR(20),
    badge_image VARCHAR(255),
    condition_rule JSON DEFAULT '{}',
    points_reward INT DEFAULT 10,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME AUTO_INCREMENT DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create student achievements table
CREATE TABLE IF NOT EXISTS progress_studentachievement (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    student_id BIGINT NOT NULL,
    achievement_id BIGINT NOT NULL,
    earned_at DATETIME AUTO_INCREMENT DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_achievement (student_id, achievement_id),
    FOREIGN KEY (student_id) REFERENCES users_user(id) ON DELETE CASCADE,
    FOREIGN KEY (achievement_id) REFERENCES progress_achievement(id) ON DELETE CASCADE,
    INDEX idx_student (student_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create content recommendation table
CREATE TABLE IF NOT EXISTS recommendations_contentrecommendation (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    student_id BIGINT NOT NULL,
    content_type VARCHAR(20),
    content_id INT NOT NULL,
    content_title VARCHAR(255),
    confidence_score DOUBLE,
    reason LONGTEXT,
    recommendation_factors JSON DEFAULT '{}',
    is_viewed BOOLEAN NOT NULL DEFAULT FALSE,
    is_accepted BOOLEAN NOT NULL DEFAULT FALSE,
    user_rating INT NULL,
    created_at DATETIME AUTO_INCREMENT DEFAULT CURRENT_TIMESTAMP,
    viewed_at DATETIME NULL,
    FOREIGN KEY (student_id) REFERENCES users_user(id) ON DELETE CASCADE,
    INDEX idx_student (student_id),
    INDEX idx_confidence (confidence_score),
    INDEX idx_viewed (is_viewed)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create learning style profile table
CREATE TABLE IF NOT EXISTS recommendations_learningstyleprofile (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    student_id BIGINT UNIQUE NOT NULL,
    primary_style VARCHAR(20) DEFAULT 'visual',
    secondary_style VARCHAR(20) BLANK,
    visual_preference DOUBLE DEFAULT 0,
    auditory_preference DOUBLE DEFAULT 0,
    kinesthetic_preference DOUBLE DEFAULT 0,
    reading_writing_preference DOUBLE DEFAULT 0,
    pace_preference DOUBLE DEFAULT 1.0,
    difficulty_preference INT DEFAULT 3,
    last_updated DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES users_user(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create notifications table
CREATE TABLE IF NOT EXISTS users_notification (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    type VARCHAR(50),
    title VARCHAR(255),
    message LONGTEXT,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    data JSON DEFAULT '{}',
    created_at DATETIME AUTO_INCREMENT DEFAULT CURRENT_TIMESTAMP,
    read_at DATETIME NULL,
    FOREIGN KEY (user_id) REFERENCES users_user(id) ON DELETE CASCADE,
    INDEX idx_user (user_id),
    INDEX idx_read (is_read),
    INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create indices for better performance
CREATE INDEX idx_users_created ON users_user(created_at);
CREATE INDEX idx_courses_created ON courses_course(created_at);
CREATE INDEX idx_lessons_created ON courses_lesson(created_at);
CREATE INDEX idx_exercises_created ON exercises_exercise(created_at);

-- Create view for student progress
CREATE OR REPLACE VIEW student_progress_summary AS
SELECT 
    u.id as student_id,
    u.email,
    COUNT(DISTINCT ce.id) as courses_enrolled,
    COUNT(DISTINCT CASE WHEN ce.status = 'completed' THEN ce.id END) as courses_completed,
    COUNT(DISTINCT ea.id) as exercises_attempted,
    COUNT(DISTINCT CASE WHEN ea.is_correct = TRUE THEN ea.id END) as exercises_correct,
    AVG(CASE WHEN ea.score IS NOT NULL THEN ea.score ELSE 0 END) as average_score,
    MAX(ea.started_at) as last_activity
FROM users_user u
LEFT JOIN courses_courseenrollment ce ON u.id = ce.student_id
LEFT JOIN exercises_exerciseattempt ea ON u.id = ea.student_id
WHERE u.role = 'student'
GROUP BY u.id, u.email;

-- Set up proper character set for all connections
SET character_set_server = utf8mb4;
SET collation_server = utf8mb4_unicode_ci;
