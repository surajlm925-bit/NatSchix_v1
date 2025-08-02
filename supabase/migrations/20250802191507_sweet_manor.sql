-- Multi-Subject Online Assessment Platform Database Schema
-- This schema supports user registration, question management, test results, and admin functionality

-- Enable UUID extension for generating unique identifiers
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User registration data
-- Stores comprehensive user information collected during registration
CREATE TABLE IF NOT EXISTS registrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(100) UNIQUE NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    date_of_birth DATE NOT NULL,
    gender VARCHAR(20) NOT NULL CHECK (gender IN ('male', 'female', 'other', 'prefer-not-to-say')),
    address TEXT NOT NULL,
    city VARCHAR(50) NOT NULL,
    state VARCHAR(50) NOT NULL,
    zip_code VARCHAR(20) NOT NULL,
    country VARCHAR(50) NOT NULL,
    education VARCHAR(50) NOT NULL,
    institution VARCHAR(100),
    field_of_study VARCHAR(100),
    experience VARCHAR(20),
    hear_about_us VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Subject management
-- Allows dynamic addition and management of test subjects
CREATE TABLE IF NOT EXISTS subjects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    questions_per_test INTEGER DEFAULT 20,
    time_limit_minutes INTEGER DEFAULT 40,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Question bank
-- Stores all questions with subject categorization and difficulty levels
CREATE TABLE IF NOT EXISTS questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subject VARCHAR(50) NOT NULL,
    question TEXT NOT NULL,
    option_a VARCHAR(500) NOT NULL,
    option_b VARCHAR(500) NOT NULL,
    option_c VARCHAR(500) NOT NULL,
    option_d VARCHAR(500) NOT NULL,
    correct_answer INTEGER NOT NULL CHECK (correct_answer BETWEEN 1 AND 4),
    difficulty VARCHAR(10) NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
    explanation TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Test results (admin-only access)
-- Stores comprehensive test results with security measures
CREATE TABLE IF NOT EXISTS test_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(100) NOT NULL,
    test_time TIMESTAMP WITH TIME ZONE NOT NULL,
    subject VARCHAR(50) NOT NULL,
    questions JSONB NOT NULL,
    answers JSONB NOT NULL,
    score INTEGER NOT NULL CHECK (score BETWEEN 0 AND 100),
    duration_seconds INTEGER NOT NULL,
    browser_info JSONB,
    ip_address INET,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Test sessions
-- Tracks test sessions for security and analytics
CREATE TABLE IF NOT EXISTS test_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(100) NOT NULL,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'abandoned', 'expired')),
    questions_data JSONB,
    current_question INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Admin users
-- Manages admin access and permissions
CREATE TABLE IF NOT EXISTS admin_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    role VARCHAR(20) DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- System configuration
-- Stores platform-wide settings and configurations
CREATE TABLE IF NOT EXISTS system_config (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    config_key VARCHAR(100) UNIQUE NOT NULL,
    config_value JSONB NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_registrations_email ON registrations(email);
CREATE INDEX IF NOT EXISTS idx_registrations_created_at ON registrations(created_at);

CREATE INDEX IF NOT EXISTS idx_questions_subject ON questions(subject);
CREATE INDEX IF NOT EXISTS idx_questions_difficulty ON questions(difficulty);
CREATE INDEX IF NOT EXISTS idx_questions_is_active ON questions(is_active);

CREATE INDEX IF NOT EXISTS idx_test_results_email ON test_results(email);
CREATE INDEX IF NOT EXISTS idx_test_results_test_time ON test_results(test_time);
CREATE INDEX IF NOT EXISTS idx_test_results_subject ON test_results(subject);
CREATE INDEX IF NOT EXISTS idx_test_results_created_at ON test_results(created_at);

CREATE INDEX IF NOT EXISTS idx_test_sessions_email ON test_sessions(email);
CREATE INDEX IF NOT EXISTS idx_test_sessions_status ON test_sessions(status);
CREATE INDEX IF NOT EXISTS idx_test_sessions_session_token ON test_sessions(session_token);

CREATE INDEX IF NOT EXISTS idx_subjects_is_active ON subjects(is_active);
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);
CREATE INDEX IF NOT EXISTS idx_admin_users_is_active ON admin_users(is_active);

-- Insert default subjects
INSERT INTO subjects (name, description, questions_per_test, time_limit_minutes) VALUES
('Math', 'Mathematics including Algebra, Geometry, Calculus, and Problem Solving', 20, 40),
('Science', 'Science covering Physics, Chemistry, Biology, and Earth Science', 20, 40),
('Reasoning', 'Logical Reasoning, Analytical Thinking, and Problem Solving', 20, 40)
ON CONFLICT (name) DO NOTHING;

-- Insert sample questions for demonstration
INSERT INTO questions (subject, question, option_a, option_b, option_c, option_d, correct_answer, difficulty, explanation) VALUES
-- Math Questions
('Math', 'What is 15 × 8?', '120', '110', '130', '125', 1, 'easy', '15 × 8 = 120'),
('Math', 'Solve for x: 2x + 5 = 17', '6', '5', '7', '8', 1, 'medium', '2x = 17 - 5 = 12, so x = 6'),
('Math', 'What is the area of a circle with radius 5?', '25π', '10π', '50π', '15π', 1, 'medium', 'Area = πr² = π(5)² = 25π'),
('Math', 'If f(x) = 2x + 3, what is f(4)?', '11', '10', '12', '9', 1, 'easy', 'f(4) = 2(4) + 3 = 8 + 3 = 11'),

-- Science Questions
('Science', 'What is the chemical symbol for gold?', 'Go', 'Gd', 'Au', 'Ag', 3, 'easy', 'Gold has the chemical symbol Au from the Latin word aurum'),
('Science', 'Which planet is known as the Red Planet?', 'Venus', 'Mars', 'Jupiter', 'Saturn', 2, 'easy', 'Mars appears red due to iron oxide (rust) on its surface'),
('Science', 'What is the speed of light in vacuum?', '300,000 km/s', '150,000 km/s', '450,000 km/s', '200,000 km/s', 1, 'medium', 'The speed of light in vacuum is approximately 300,000 km/s'),
('Science', 'Which gas makes up about 78% of Earth''s atmosphere?', 'Oxygen', 'Nitrogen', 'Carbon Dioxide', 'Argon', 2, 'medium', 'Nitrogen makes up about 78% of Earth''s atmosphere'),

-- Reasoning Questions
('Reasoning', 'If all roses are flowers and some flowers are red, then:', 'All roses are red', 'Some roses are red', 'No roses are red', 'Cannot be determined', 4, 'medium', 'We cannot determine the color of roses from the given information'),
('Reasoning', 'What comes next in the sequence: 2, 6, 12, 20, ?', '28', '30', '32', '34', 2, 'medium', 'The differences are 4, 6, 8, so the next difference is 10: 20 + 10 = 30'),
('Reasoning', 'If A = 1, B = 2, C = 3, what is the value of CAB?', '312', '321', '123', '132', 1, 'easy', 'C=3, A=1, B=2, so CAB = 312'),
('Reasoning', 'Which number is the odd one out: 2, 4, 6, 9, 8?', '2', '4', '6', '9', 4, 'easy', '9 is the only odd number in the sequence')
ON CONFLICT DO NOTHING;

-- Insert default system configuration
INSERT INTO system_config (config_key, config_value, description) VALUES
('platform_name', '"AssessmentPro"', 'Name of the assessment platform'),
('test_duration_minutes', '120', 'Total test duration in minutes'),
('questions_per_subject', '20', 'Number of questions per subject'),
('randomize_questions', 'true', 'Whether to randomize question order'),
('allow_review', 'true', 'Whether students can mark questions for review'),
('show_progress', 'true', 'Whether to show progress indicators'),
('contact_email', '"admin@assessmentpro.com"', 'Contact email for support'),
('maintenance_mode', 'false', 'Whether the platform is in maintenance mode')
ON CONFLICT (config_key) DO NOTHING;

-- Enable Row Level Security (RLS) for all tables
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_config ENABLE ROW LEVEL SECURITY;

-- Create RLS policies

-- Registrations: Users can only access their own registration data
CREATE POLICY "Users can insert their own registration" ON registrations
    FOR INSERT WITH CHECK (auth.jwt() ->> 'email' = email);

CREATE POLICY "Users can view their own registration" ON registrations
    FOR SELECT USING (auth.jwt() ->> 'email' = email);

CREATE POLICY "Users can update their own registration" ON registrations
    FOR UPDATE USING (auth.jwt() ->> 'email' = email);

-- Questions: Read-only access for authenticated users
CREATE POLICY "Authenticated users can view active questions" ON questions
    FOR SELECT USING (auth.role() = 'authenticated' AND is_active = true);

-- Subjects: Read-only access for authenticated users
CREATE POLICY "Authenticated users can view active subjects" ON subjects
    FOR SELECT USING (auth.role() = 'authenticated' AND is_active = true);

-- Test results: Users can insert their own results, but cannot read them
CREATE POLICY "Users can insert their own test results" ON test_results
    FOR INSERT WITH CHECK (auth.jwt() ->> 'email' = email);

-- Test sessions: Users can manage their own sessions
CREATE POLICY "Users can manage their own test sessions" ON test_sessions
    FOR ALL USING (auth.jwt() ->> 'email' = email);

-- System config: Read-only for authenticated users
CREATE POLICY "Authenticated users can view system config" ON system_config
    FOR SELECT USING (auth.role() = 'authenticated' AND is_active = true);

-- Admin policies (these would be managed through a separate admin role)
-- For now, we'll create policies that allow service role access

CREATE POLICY "Service role can manage all data" ON registrations
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage questions" ON questions
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage subjects" ON subjects
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage test results" ON test_results
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage test sessions" ON test_sessions
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage admin users" ON admin_users
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage system config" ON system_config
    FOR ALL USING (auth.role() = 'service_role');