import React, { createContext, useContext, useState, ReactNode } from 'react';
import { supabase } from './supabaseClient';
import { useAuth } from './AuthContext';

interface Question {
  id: string;
  subject: string;
  question: string;
  options: string[];
  correctAnswer: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface TestAnswer {
  questionId: string;
  selectedAnswer: number | null;
  timeSpent: number;
  marked: boolean;
}

interface TestState {
  questions: Question[];
  answers: TestAnswer[];
  currentQuestion: number;
  timeRemaining: number;
  isActive: boolean;
  startTime: Date | null;
}

interface TestContextType {
  testState: TestState;
  startTest: () => void;
  endTest: () => void;
  selectAnswer: (questionId: string, answer: number) => void;
  markForReview: (questionId: string) => void;
  navigateToQuestion: (index: number) => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  submitTest: () => Promise<void>;
}

const TestContext = createContext<TestContextType | undefined>(undefined);

export const useTest = () => {
  const context = useContext(TestContext);
  if (context === undefined) {
    throw new Error('useTest must be used within a TestProvider');
  }
  return context;
};

interface TestProviderProps {
  children: ReactNode;
}

// Mock questions data
const mockQuestions: Question[] = [
  // Math Questions
  {
    id: 'math_1',
    subject: 'Math',
    question: 'What is 15 × 8?',
    options: ['120', '110', '130', '125'],
    correctAnswer: 0,
    difficulty: 'easy'
  },
  {
    id: 'math_2',
    subject: 'Math',
    question: 'Solve for x: 2x + 5 = 17',
    options: ['6', '5', '7', '8'],
    correctAnswer: 0,
    difficulty: 'medium'
  },
  // Science Questions
  {
    id: 'science_1',
    subject: 'Science',
    question: 'What is the chemical symbol for gold?',
    options: ['Go', 'Gd', 'Au', 'Ag'],
    correctAnswer: 2,
    difficulty: 'easy'
  },
  {
    id: 'science_2',
    subject: 'Science',
    question: 'Which planet is known as the Red Planet?',
    options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
    correctAnswer: 1,
    difficulty: 'easy'
  },
  // Reasoning Questions
  {
    id: 'reasoning_1',
    subject: 'Reasoning',
    question: 'If all roses are flowers and some flowers are red, then:',
    options: ['All roses are red', 'Some roses are red', 'No roses are red', 'Cannot be determined'],
    correctAnswer: 3,
    difficulty: 'medium'
  },
  {
    id: 'reasoning_2',
    subject: 'Reasoning',
    question: 'What comes next in the sequence: 2, 6, 12, 20, ?',
    options: ['28', '30', '32', '34'],
    correctAnswer: 1,
    difficulty: 'medium'
  }
];

export const TestProvider: React.FC<TestProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [testState, setTestState] = useState<TestState>({
    questions: [],
    answers: [],
    currentQuestion: 0,
    timeRemaining: 3600, // 60 minutes
    isActive: false,
    startTime: null
  });

  const startTest = () => {
    // Load questions from Supabase or use mock data for demo
    loadQuestions();
  };

  const loadQuestions = async () => {
    try {
      // Try to load questions from Supabase
      const { data: questions, error } = await supabase
        .from('questions')
        .select('*')
        .limit(60); // 20 per subject ideally

      let selectedQuestions = mockQuestions; // Fallback to mock data
      
      if (!error && questions && questions.length > 0) {
        // Convert Supabase questions to our format
        selectedQuestions = questions.map(q => ({
          id: q.id.toString(),
          subject: q.subject,
          question: q.question,
          options: [q.option_a, q.option_b, q.option_c, q.option_d],
          correctAnswer: q.correct_answer - 1, // Convert 1-based to 0-based
          difficulty: q.difficulty as 'easy' | 'medium' | 'hard'
        }));
      }
      
      // Shuffle and select questions
      const shuffledQuestions = [...selectedQuestions].sort(() => Math.random() - 0.5);
      const finalQuestions = shuffledQuestions.slice(0, Math.min(6, shuffledQuestions.length)); // 6 for demo
    
      const initialAnswers = finalQuestions.map(q => ({
        questionId: q.id,
        selectedAnswer: null,
        timeSpent: 0,
        marked: false
      }));

      setTestState({
        questions: finalQuestions,
        answers: initialAnswers,
        currentQuestion: 0,
        timeRemaining: 3600,
        isActive: true,
        startTime: new Date()
      });
    } catch (error) {
      console.error('Error loading questions:', error);
      // Fallback to mock questions
      const shuffledQuestions = [...mockQuestions].sort(() => Math.random() - 0.5);
      const selectedQuestions = shuffledQuestions.slice(0, 6);
      
      const initialAnswers = selectedQuestions.map(q => ({
        questionId: q.id,
        selectedAnswer: null,
        timeSpent: 0,
        marked: false
      }));

      setTestState({
        questions: selectedQuestions,
        answers: initialAnswers,
        currentQuestion: 0,
        timeRemaining: 3600,
        isActive: true,
        startTime: new Date()
      });
    }
  };

  const submitTest = async () => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      // Calculate scores by subject
      const subjectScores: { [key: string]: { correct: number; total: number } } = {};
      
      testState.answers.forEach((answer, index) => {
        const question = testState.questions[index];
        if (!question) return;
        
        const subject = question.subject;
        if (!subjectScores[subject]) {
          subjectScores[subject] = { correct: 0, total: 0 };
        }
        
        subjectScores[subject].total++;
        if (answer.selectedAnswer === question.correctAnswer) {
          subjectScores[subject].correct++;
        }
      });

      // Calculate duration
      const duration = testState.startTime 
        ? Math.floor((new Date().getTime() - testState.startTime.getTime()) / 1000)
        : 0;

      // Save results to Supabase for each subject
      const testResults = Object.entries(subjectScores).map(([subject, scores]) => ({
        email: user.email,
        test_time: testState.startTime?.toISOString(),
        subject: subject,
        questions: JSON.stringify(testState.questions.filter(q => q.subject === subject)),
        answers: JSON.stringify(testState.answers.filter((_, index) => 
          testState.questions[index]?.subject === subject
        )),
        score: scores.total > 0 ? Math.round((scores.correct / scores.total) * 100) : 0,
        duration_seconds: duration
      }));

      const { error } = await supabase
        .from('test_results')
        .insert(testResults);

      if (error) {
        console.error('Error submitting test:', error);
        throw error;
      }

      endTest();
    } catch (error) {
      console.error('Error submitting test:', error);
      throw error;
    }
  };

  const submitTestOld = async () => {
    try {
      // Mock API call to submit test results
      const testResults = {
        answers: testState.answers,
        startTime: testState.startTime,
        endTime: new Date(),
        totalQuestions: testState.questions.length
      };
      
      console.log('Submitting test results:', testResults);
      
      // In production, this would be an API call
      // await api.submitTest(testResults);
      
      endTest();
    } catch (error) {
      console.error('Error submitting test:', error);
      throw error;
    }
  };
      questionId: q.id,
      selectedAnswer: null,
      timeSpent: 0,
      marked: false
    }));

    setTestState({
      questions: selectedQuestions,
      answers: initialAnswers,
      currentQuestion: 0,
      timeRemaining: 3600,
      isActive: true,
      startTime: new Date()
    });
  };

  const endTest = () => {
    setTestState(prev => ({
      ...prev,
      isActive: false
    }));
  };

  const selectAnswer = (questionId: string, answer: number) => {
    setTestState(prev => ({
      ...prev,
      answers: prev.answers.map(a =>
        a.questionId === questionId ? { ...a, selectedAnswer: answer } : a
      )
    }));
  };

  const markForReview = (questionId: string) => {
    setTestState(prev => ({
      ...prev,
      answers: prev.answers.map(a =>
        a.questionId === questionId ? { ...a, marked: !a.marked } : a
      )
    }));
  };

  const navigateToQuestion = (index: number) => {
    setTestState(prev => ({
      ...prev,
      currentQuestion: index
    }));
  };

  const nextQuestion = () => {
    setTestState(prev => ({
      ...prev,
      currentQuestion: Math.min(prev.currentQuestion + 1, prev.questions.length - 1)
    }));
  };

  const previousQuestion = () => {
    setTestState(prev => ({
      ...prev,
      currentQuestion: Math.max(prev.currentQuestion - 1, 0)
    }));
  };

  const submitTest = async () => {
    try {
      // Mock API call to submit test results
      const testResults = {
        answers: testState.answers,
        startTime: testState.startTime,
        endTime: new Date(),
        totalQuestions: testState.questions.length
      };
      
      console.log('Submitting test results:', testResults);
      
      // In production, this would be an API call
      // await api.submitTest(testResults);
      
      endTest();
    } catch (error) {
      console.error('Error submitting test:', error);
      throw error;
    }
  };

  const value: TestContextType = {
    testState,
    startTest,
    endTest,
    selectAnswer,
    markForReview,
    navigateToQuestion,
    nextQuestion,
    previousQuestion,
    submitTest
  };

  return (
    <TestContext.Provider value={value}>
      {children}
    </TestContext.Provider>
  );
};