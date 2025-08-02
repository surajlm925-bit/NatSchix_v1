import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { BookOpen, Clock, Award, BarChart3, Calendar, Play, LogOut } from 'lucide-react';

const TestDashboard: React.FC = () => {
  const { user, logout } = useAuth();

  const subjects = [
    {
      name: 'Mathematics',
      description: 'Algebra, Geometry, Calculus, and Problem Solving',
      questions: 20,
      duration: '40 minutes',
      difficulty: 'Mixed',
      color: 'from-blue-500 to-blue-600'
    },
    {
      name: 'Science',
      description: 'Physics, Chemistry, Biology, and Earth Science',
      questions: 20,
      duration: '40 minutes',
      difficulty: 'Mixed',
      color: 'from-green-500 to-green-600'
    },
    {
      name: 'Reasoning',
      description: 'Logical Reasoning, Analytical Thinking, and Problem Solving',
      questions: 20,
      duration: '40 minutes',
      difficulty: 'Mixed',
      color: 'from-purple-500 to-purple-600'
    }
  ];

  const stats = [
    {
      icon: BookOpen,
      label: 'Total Questions',
      value: '60',
      description: '20 per subject'
    },
    {
      icon: Clock,
      label: 'Total Duration',
      value: '120 min',
      description: 'With breaks allowed'
    },
    {
      icon: Award,
      label: 'Difficulty',
      value: 'Mixed',
      description: 'Easy to Hard'
    },
    {
      icon: BarChart3,
      label: 'Results',
      value: 'Secure',
      description: 'Admin access only'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">AssessmentPro</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <img 
                  src={user?.picture || 'https://via.placeholder.com/32'} 
                  alt={user?.name}
                  className="w-8 h-8 rounded-full border-2 border-blue-200"
                />
                <span className="text-gray-700 font-medium">{user?.name}</span>
              </div>
              <button
                onClick={logout}
                className="text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name?.split(' ')[0]}!
          </h1>
          <p className="text-xl text-gray-600">
            Ready to take your comprehensive assessment? Review the details below and start when you're ready.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-blue-200 transition-all duration-300 hover:shadow-lg group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-sm text-gray-500">{stat.description}</div>
                </div>
              </div>
              <div className="text-lg font-semibold text-gray-700">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Test Information */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6">
            <h2 className="text-2xl font-bold text-white mb-2">Assessment Overview</h2>
            <p className="text-blue-100">
              Comprehensive multi-subject evaluation covering essential skills and knowledge
            </p>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {subjects.map((subject, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-2xl p-6 hover:border-blue-200 transition-all duration-300 hover:shadow-md group"
                >
                  <div className={`bg-gradient-to-r ${subject.color} w-full h-3 rounded-full mb-4`}></div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{subject.name}</h3>
                  <p className="text-gray-600 mb-4 text-sm leading-relaxed">{subject.description}</p>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Questions:</span>
                      <span className="font-semibold text-gray-900">{subject.questions}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Duration:</span>
                      <span className="font-semibold text-gray-900">{subject.duration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Difficulty:</span>
                      <span className="font-semibold text-gray-900">{subject.difficulty}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Important Instructions */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-8">
          <h3 className="text-lg font-semibold text-amber-800 mb-4">Important Instructions</h3>
          <ul className="space-y-2 text-amber-700">
            <li className="flex items-start">
              <div className="w-2 h-2 bg-amber-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <span>Ensure you have a stable internet connection throughout the assessment</span>
            </li>
            <li className="flex items-start">
              <div className="w-2 h-2 bg-amber-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <span>You cannot pause or restart the test once started - complete it in one session</span>
            </li>
            <li className="flex items-start">
              <div className="w-2 h-2 bg-amber-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <span>Results will be processed securely and are only accessible to administrators</span>
            </li>
            <li className="flex items-start">
              <div className="w-2 h-2 bg-amber-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <span>You can mark questions for review and navigate between questions freely</span>
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a
            href="/test"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-3"
          >
            <Play className="h-6 w-6" />
            <span>Start Assessment</span>
          </a>
          
          <button className="flex items-center space-x-2 bg-white hover:bg-gray-50 text-gray-700 px-6 py-4 rounded-xl font-semibold border border-gray-200 transition-all duration-200 hover:border-gray-300 shadow-sm hover:shadow-md">
            <Calendar className="h-5 w-5" />
            <span>Schedule for Later</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestDashboard;