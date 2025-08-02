import React, { useState, useEffect } from 'react';
import { useTest } from '../contexts/TestContext';
import { useNavigate } from 'react-router-dom';
import { 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  Flag, 
  BookOpen, 
  CheckCircle, 
  Circle,
  AlertTriangle,
  Send
} from 'lucide-react';

const TestEngine: React.FC = () => {
  const { testState, startTest, selectAnswer, markForReview, navigateToQuestion, nextQuestion, previousQuestion, submitTest } = useTest();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);

  useEffect(() => {
    if (!testState.isActive && testState.questions.length === 0) {
      startTest();
    }
  }, []);

  useEffect(() => {
    if (!testState.isActive) return;

    const timer = setInterval(() => {
      // Timer logic would go here
      // For demo purposes, we'll skip the countdown implementation
    }, 1000);

    return () => clearInterval(timer);
  }, [testState.isActive, testState.timeRemaining]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (optionIndex: number) => {
    const currentQuestion = testState.questions[testState.currentQuestion];
    selectAnswer(currentQuestion.id, optionIndex);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await submitTest();
      navigate('/dashboard');
    } catch (error) {
      console.error('Error submitting test:', error);
    } finally {
      setIsSubmitting(false);
      setShowSubmitConfirm(false);
    }
  };

  const getQuestionStatus = (questionId: string) => {
    const answer = testState.answers.find(a => a.questionId === questionId);
    if (answer?.marked) return 'marked';
    if (answer?.selectedAnswer !== null) return 'answered';
    return 'unanswered';
  };

  const currentQuestion = testState.questions[testState.currentQuestion];
  const currentAnswer = testState.answers.find(a => a.questionId === currentQuestion?.id);

  if (!testState.isActive || !currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading your assessment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">Assessment</span>
              <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-500">
                <span>Question {testState.currentQuestion + 1} of {testState.questions.length}</span>
                <span>•</span>
                <span>{currentQuestion.subject}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-red-50 text-red-700 px-4 py-2 rounded-lg border border-red-200">
                <Clock className="h-5 w-5" />
                <span className="font-mono text-lg">{formatTime(testState.timeRemaining)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Question Navigation Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sticky top-24">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Question Navigator</h3>
              
              <div className="grid grid-cols-5 gap-2 mb-6">
                {testState.questions.map((_, index) => {
                  const status = getQuestionStatus(testState.questions[index].id);
                  return (
                    <button
                      key={index}
                      onClick={() => navigateToQuestion(index)}
                      className={`
                        w-10 h-10 text-sm font-semibold rounded-lg transition-all duration-200 border-2
                        ${index === testState.currentQuestion 
                          ? 'bg-blue-600 text-white border-blue-600 shadow-md' 
                          : status === 'answered'
                          ? 'bg-green-100 text-green-700 border-green-300 hover:bg-green-200'
                          : status === 'marked'
                          ? 'bg-orange-100 text-orange-700 border-orange-300 hover:bg-orange-200'
                          : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                        }
                      `}
                    >
                      {index + 1}
                    </button>
                  );
                })}
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-green-100 border-2 border-green-300 rounded"></div>
                  <span className="text-gray-600">Answered</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-orange-100 border-2 border-orange-300 rounded"></div>
                  <span className="text-gray-600">Marked for Review</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-gray-100 border-2 border-gray-300 rounded"></div>
                  <span className="text-gray-600">Not Answered</span>
                </div>
              </div>

              <button
                onClick={() => setShowSubmitConfirm(true)}
                className="w-full mt-6 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
              >
                <Send className="h-5 w-5" />
                <span>Submit Test</span>
              </button>
            </div>
          </div>

          {/* Question Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              {/* Question Header */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 px-8 py-6 border-b border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    {currentQuestion.subject}
                  </span>
                  <span className="text-gray-500 text-sm">
                    Question {testState.currentQuestion + 1} of {testState.questions.length}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((testState.currentQuestion + 1) / testState.questions.length) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Question Body */}
              <div className="p-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-8 leading-relaxed">
                  {currentQuestion.question}
                </h2>

                <div className="space-y-4">
                  {currentQuestion.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect(index)}
                      className={`
                        w-full text-left p-6 rounded-xl border-2 transition-all duration-200 hover:shadow-md
                        ${currentAnswer?.selectedAnswer === index
                          ? 'bg-blue-50 border-blue-300 text-blue-900'
                          : 'bg-gray-50 border-gray-200 hover:border-gray-300 text-gray-700'
                        }
                      `}
                    >
                      <div className="flex items-center space-x-4">
                        {currentAnswer?.selectedAnswer === index ? (
                          <CheckCircle className="h-6 w-6 text-blue-600 flex-shrink-0" />
                        ) : (
                          <Circle className="h-6 w-6 text-gray-400 flex-shrink-0" />
                        )}
                        <span className="text-lg">{option}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Question Footer */}
              <div className="bg-gray-50 px-8 py-6 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => markForReview(currentQuestion.id)}
                      className={`
                        flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200
                        ${currentAnswer?.marked
                          ? 'bg-orange-100 text-orange-700 border border-orange-300'
                          : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
                        }
                      `}
                    >
                      <Flag className="h-4 w-4" />
                      <span>{currentAnswer?.marked ? 'Marked' : 'Mark for Review'}</span>
                    </button>
                  </div>

                  <div className="flex items-center space-x-3">
                    <button
                      onClick={previousQuestion}
                      disabled={testState.currentQuestion === 0}
                      className="flex items-center space-x-2 px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      <span>Previous</span>
                    </button>
                    
                    <button
                      onClick={nextQuestion}
                      disabled={testState.currentQuestion === testState.questions.length - 1}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    >
                      <span>Next</span>
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Submit Confirmation Modal */}
      {showSubmitConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <div className="text-center">
              <AlertTriangle className="h-16 w-16 text-amber-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Submit Assessment?</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to submit your assessment? You cannot make changes after submission.
              </p>
              
              <div className="flex space-x-4">
                <button
                  onClick={() => setShowSubmitConfirm(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-xl transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      <span>Submit</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestEngine;