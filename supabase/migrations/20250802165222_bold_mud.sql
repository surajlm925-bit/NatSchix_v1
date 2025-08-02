-- Assessment Platform Database Schema
-- Created: 2025-01-14

-- Create database
CREATE DATABASE IF NOT EXISTS assessment_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE assessment_db;

-- Subjects table
CREATE TABLE IF NOT EXISTS subjects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Questions table
CREATE TABLE IF NOT EXISTS questions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    subject_id INT NOT NULL,
    question TEXT NOT NULL,
    option_a VARCHAR(500) NOT NULL,
    option_b VARCHAR(500) NOT NULL,
    option_c VARCHAR(500) NOT NULL,
    option_d VARCHAR(500) NOT NULL,
    correct_answer TINYINT NOT NULL CHECK (correct_answer IN (0, 1, 2, 3)),
    difficulty ENUM('easy', 'medium', 'hard') DEFAULT 'medium',
    explanation TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE,
    INDEX idx_subject_difficulty (subject_id, difficulty),
    INDEX idx_active (is_active)
);

-- User registrations table
CREATE TABLE IF NOT EXISTS registrations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    date_of_birth DATE NOT NULL,
    gender ENUM('male', 'female', 'other', 'prefer-not-to-say') NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    zip_code VARCHAR(20) NOT NULL,
    country VARCHAR(100) NOT NULL,
    education ENUM('high-school', 'associate', 'bachelor', 'master', 'doctorate', 'other') NOT NULL,
    institution VARCHAR(255),
    field_of_study VARCHAR(255),
    experience ENUM('0-1', '2-5', '6-10', '11-15', '15+'),
    hear_about_us ENUM('search-engine', 'social-media', 'friend-referral', 'advertisement', 'institution', 'other'),
    google_id VARCHAR(255),
    profile_picture_url TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_created (created_at)
);

-- Test results table
CREATE TABLE IF NOT EXISTS test_results (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    test_time DATETIME NOT NULL,
    subject VARCHAR(50) NOT NULL,
    questions JSON NOT NULL,
    answers JSON NOT NULL,
    score INT NOT NULL CHECK (score >= 0 AND score <= 100),
    duration_seconds INT NOT NULL,
    browser_info JSON,
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (email) REFERENCES registrations(email) ON DELETE CASCADE,
    INDEX idx_email_test (email, test_time),
    INDEX idx_subject_score (subject, score),
    INDEX idx_test_time (test_time)
);

-- Test sessions table (for tracking test attempts)
CREATE TABLE IF NOT EXISTS test_sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    session_token VARCHAR(255) NOT NULL UNIQUE,
    start_time DATETIME NOT NULL,
    end_time DATETIME,
    status ENUM('active', 'completed', 'abandoned', 'expired') DEFAULT 'active',
    questions_assigned JSON NOT NULL,
    current_question INT DEFAULT 0,
    time_remaining INT DEFAULT 7200, -- 2 hours in seconds
    browser_info JSON,
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (email) REFERENCES registrations(email) ON DELETE CASCADE,
    INDEX idx_email_status (email, status),
    INDEX idx_session_token (session_token),
    INDEX idx_status_time (status, start_time)
);

-- System configuration table
CREATE TABLE IF NOT EXISTS system_config (
    id INT AUTO_INCREMENT PRIMARY KEY,
    config_key VARCHAR(100) NOT NULL UNIQUE,
    config_value TEXT NOT NULL,
    data_type ENUM('string', 'integer', 'boolean', 'json') DEFAULT 'string',
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default subjects
INSERT INTO subjects (name, description) VALUES
('Math', 'Mathematics including algebra, geometry, calculus, and problem solving'),
('Science', 'General science covering physics, chemistry, biology, and earth science'),
('Reasoning', 'Logical reasoning, analytical thinking, and problem-solving skills')
ON DUPLICATE KEY UPDATE description = VALUES(description);

-- Insert default system configuration
INSERT INTO system_config (config_key, config_value, data_type, description) VALUES
('test_duration_minutes', '120', 'integer', 'Total test duration in minutes'),
('questions_per_subject', '20', 'integer', 'Number of questions per subject'),
('randomize_questions', 'true', 'boolean', 'Whether to randomize question order'),
('platform_name', 'AssessmentPro', 'string', 'Name of the assessment platform'),
('contact_email', 'admin@assessmentpro.com', 'string', 'Contact email for support'),
('enable_notifications', 'true', 'boolean', 'Enable email notifications'),
('max_test_attempts', '3', 'integer', 'Maximum number of test attempts per user'),
('passing_score', '70', 'integer', 'Minimum passing score percentage'),
('session_timeout_minutes', '15', 'integer', 'Session timeout in minutes of inactivity')
ON DUPLICATE KEY UPDATE config_value = VALUES(config_value);

-- Sample questions for demonstration
INSERT INTO questions (subject_id, question, option_a, option_b, option_c, option_d, correct_answer, difficulty) VALUES
-- Math Questions
((SELECT id FROM subjects WHERE name = 'Math'), 'What is 15 × 8?', '120', '110', '130', '125', 0, 'easy'),
((SELECT id FROM subjects WHERE name = 'Math'), 'Solve for x: 2x + 5 = 17', '6', '5', '7', '8', 0, 'medium'),
((SELECT id FROM subjects WHERE name = 'Math'), 'What is the area of a circle with radius 5?', '25π', '10π', '50π', '15π', 0, 'medium'),
((SELECT id FROM subjects WHERE name = 'Math'), 'If f(x) = 2x + 3, what is f(4)?', '11', '10', '12', '9', 0, 'easy'),
((SELECT id FROM subjects WHERE name = 'Math'), 'What is the derivative of x²?', '2x', 'x', '2', 'x²', 0, 'medium'),

-- Science Questions
((SELECT id FROM subjects WHERE name = 'Science'), 'What is the chemical symbol for gold?', 'Go', 'Gd', 'Au', 'Ag', 2, 'easy'),
((SELECT id FROM subjects WHERE name = 'Science'), 'Which planet is known as the Red Planet?', 'Venus', 'Mars', 'Jupiter', 'Saturn', 1, 'easy'),
((SELECT id FROM subjects WHERE name = 'Science'), 'What is the powerhouse of the cell?', 'Nucleus', 'Mitochondria', 'Ribosome', 'Cytoplasm', 1, 'medium'),
((SELECT id FROM subjects WHERE name = 'Science'), 'What is the chemical formula for water?', 'H2O', 'CO2', 'NaCl', 'CH4', 0, 'easy'),
((SELECT id FROM subjects WHERE name = 'Science'), 'At what temperature does water boil at sea level?', '90°C', '100°C', '110°C', '120°C', 1, 'easy'),

-- Reasoning Questions
((SELECT id FROM subjects WHERE name = 'Reasoning'), 'If all roses are flowers and some flowers are red, then:', 'All roses are red', 'Some roses are red', 'No roses are red', 'Cannot be determined', 3, 'medium'),
((SELECT id FROM subjects WHERE name = 'Reasoning'), 'What comes next in the sequence: 2, 6, 12, 20, ?', '28', '30', '32', '34', 1, 'medium'),
((SELECT id FROM subjects WHERE name = 'Reasoning'), 'If A > B and B > C, then:', 'A < C', 'A > C', 'A = C', 'Cannot be determined', 1, 'easy'),
((SELECT id FROM subjects WHERE name = 'Reasoning'), 'Complete the analogy: Book : Read :: Music : ?', 'Hear', 'Listen', 'Sound', 'Play', 1, 'medium'),
((SELECT id FROM subjects WHERE name = 'Reasoning'), 'Which number is the odd one out: 2, 4, 6, 9, 12?', '2', '4', '9', '12', 2, 'easy')
ON DUPLICATE KEY UPDATE question = VALUES(question);