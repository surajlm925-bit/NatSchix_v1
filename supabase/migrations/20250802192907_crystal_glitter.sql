/*
  # Assessment Platform Database Schema

  1. New Tables
    - `registrations` - User registration data
    - `questions` - Question bank for all subjects  
    - `test_results` - Test submission results (admin-only access)
    - `subjects` - Subject management

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users and admin access
    - Secure test results (admin-only)

  3. Sample Data
    - Insert sample questions for testing
    - Create default subjects
*/

-- Create registrations table
CREATE TABLE IF NOT EXISTS registrations (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    email text UNIQUE NOT NULL,
    first_name text NOT NULL,
    last_name text NOT NULL,
    phone text NOT NULL,
    date_of_birth date NOT NULL,
    gender text NOT NULL CHECK (gender IN ('male', 'female', 'other', 'prefer-not-to-say')),
    address text NOT NULL,
    city text NOT NULL,
    state text NOT NULL,
    zip_code text NOT NULL,
    country text NOT NULL,
    education text NOT NULL,
    institution text,
    field_of_study text,
    experience text,
    hear_about_us text,
    created_at timestamptz DEFAULT now()
);

-- Create subjects table
CREATE TABLE IF NOT EXISTS subjects (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text UNIQUE NOT NULL,
    description text,
    is_active boolean DEFAULT true,
    created_at timestamptz DEFAULT now()
);

-- Create questions table
CREATE TABLE IF NOT EXISTS questions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    subject text NOT NULL,
    question text NOT NULL,
    option_a text NOT NULL,
    option_b text NOT NULL,
    option_c text NOT NULL,
    option_d text NOT NULL,
    correct_answer integer NOT NULL CHECK (correct_answer BETWEEN 1 AND 4),
    difficulty text NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
    created_at timestamptz DEFAULT now()
);

-- Create test_results table
CREATE TABLE IF NOT EXISTS test_results (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    email text NOT NULL,
    test_time timestamptz NOT NULL,
    subject text NOT NULL,
    questions jsonb NOT NULL,
    answers jsonb NOT NULL,
    score integer NOT NULL,
    duration_seconds integer NOT NULL,
    created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_results ENABLE ROW LEVEL SECURITY;

-- Create policies for registrations
CREATE POLICY "Users can read own registration"
    ON registrations
    FOR SELECT
    TO authenticated
    USING (auth.jwt() ->> 'email' = email);

CREATE POLICY "Users can insert own registration"
    ON registrations
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.jwt() ->> 'email' = email);

-- Create policies for subjects (public read)
CREATE POLICY "Anyone can read subjects"
    ON subjects
    FOR SELECT
    TO authenticated
    USING (is_active = true);

-- Create policies for questions (public read for authenticated users)
CREATE POLICY "Authenticated users can read questions"
    ON questions
    FOR SELECT
    TO authenticated
    USING (true);

-- Create policies for test_results (insert only, no read for students)
CREATE POLICY "Users can insert test results"
    ON test_results
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.jwt() ->> 'email' = email);

-- Insert default subjects
INSERT INTO subjects (name, description) VALUES
    ('Math', 'Mathematics including Algebra, Geometry, and Calculus'),
    ('Science', 'Physics, Chemistry, Biology, and Earth Science'),
    ('Reasoning', 'Logical Reasoning and Analytical Thinking')
ON CONFLICT (name) DO NOTHING;

-- Insert sample questions
INSERT INTO questions (subject, question, option_a, option_b, option_c, option_d, correct_answer, difficulty) VALUES
    -- Math Questions
    ('Math', 'What is 15 × 8?', '120', '110', '130', '125', 1, 'easy'),
    ('Math', 'Solve for x: 2x + 5 = 17', '6', '5', '7', '8', 1, 'medium'),
    ('Math', 'What is the area of a circle with radius 5?', '25π', '10π', '50π', '15π', 1, 'medium'),
    ('Math', 'If f(x) = 2x + 3, what is f(4)?', '11', '10', '12', '9', 1, 'easy'),
    ('Math', 'What is the derivative of x²?', '2x', 'x', '2', 'x²', 1, 'hard'),
    
    -- Science Questions
    ('Science', 'What is the chemical symbol for gold?', 'Go', 'Gd', 'Au', 'Ag', 3, 'easy'),
    ('Science', 'Which planet is known as the Red Planet?', 'Venus', 'Mars', 'Jupiter', 'Saturn', 2, 'easy'),
    ('Science', 'What is the speed of light in vacuum?', '3×10⁸ m/s', '3×10⁶ m/s', '3×10⁷ m/s', '3×10⁹ m/s', 1, 'medium'),
    ('Science', 'What is the atomic number of carbon?', '6', '12', '8', '14', 1, 'easy'),
    ('Science', 'Which gas makes up about 78% of Earth''s atmosphere?', 'Oxygen', 'Nitrogen', 'Carbon Dioxide', 'Argon', 2, 'medium'),
    
    -- Reasoning Questions
    ('Reasoning', 'If all roses are flowers and some flowers are red, then:', 'All roses are red', 'Some roses are red', 'No roses are red', 'Cannot be determined', 4, 'medium'),
    ('Reasoning', 'What comes next in the sequence: 2, 6, 12, 20, ?', '28', '30', '32', '34', 2, 'medium'),
    ('Reasoning', 'If A = 1, B = 2, C = 3, what is the value of CAB?', '312', '321', '123', '132', 1, 'easy'),
    ('Reasoning', 'Which number is the odd one out: 2, 4, 6, 9, 8?', '2', '4', '9', '8', 3, 'easy'),
    ('Reasoning', 'If today is Monday, what day will it be 100 days from now?', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 2, 'hard')
ON CONFLICT DO NOTHING;