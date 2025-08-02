import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { BookOpen, Shield, Clock, Award, Calendar, Users } from 'lucide-react';

const LandingPage: React.FC = () => {
  const { user, login } = useAuth();

  const features = [
    {
      icon: BookOpen,
      title: 'Multi-Subject Testing',
      description: 'Comprehensive assessments across Math, Science, and Reasoning'
    },
    {
      icon: Shield,
      title: 'Secure & Fair',
      description: 'Advanced security measures with randomized question selection'
    },
    {
      icon: Clock,
      title: 'Timed Assessments',
      description: 'Professional timing system with progress tracking'
    },
    {
      icon: Award,
      title: 'Detailed Analytics',
      description: 'Comprehensive performance analysis and reporting'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">AssessmentPro</span>
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-3">
                  <img 
                    src={user.picture || 'https://via.placeholder.com/32'} 
                    alt={user.name}
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="text-gray-700">{user.name}</span>
                </div>
              ) : (
                <button
                  onClick={login}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                >
                  Login with Google
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Professional Online
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Assessment </span>
              Platform
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Experience comprehensive multi-subject testing with advanced security, 
              real-time analytics, and professional-grade assessment tools.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {user ? (
                user.isRegistered ? (
                  <a
                    href="/dashboard"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    Start Assessment
                  </a>
                ) : (
                  <a
                    href="/register"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    Complete Registration
                  </a>
                )
              ) : (
                <button
                  onClick={login}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Get Started
                </button>
              )}
              
              <button className="flex items-center space-x-2 bg-white hover:bg-gray-50 text-gray-700 px-6 py-4 rounded-xl font-semibold border border-gray-200 transition-all duration-200 hover:border-gray-300 shadow-sm hover:shadow-md">
                <Calendar className="h-5 w-5" />
                <span>Schedule Assessment</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose AssessmentPro?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Built for educators, students, and organizations who demand excellence in assessment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-2xl border border-gray-100 hover:border-blue-200 transition-all duration-300 hover:shadow-lg group"
              >
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center text-white">
            <div>
              <div className="flex items-center justify-center mb-4">
                <Users className="h-8 w-8 mr-2" />
              </div>
              <div className="text-4xl font-bold mb-2">10,000+</div>
              <div className="text-blue-100">Active Users</div>
            </div>
            <div>
              <div className="flex items-center justify-center mb-4">
                <BookOpen className="h-8 w-8 mr-2" />
              </div>
              <div className="text-4xl font-bold mb-2">50,000+</div>
              <div className="text-blue-100">Assessments Completed</div>
            </div>
            <div>
              <div className="flex items-center justify-center mb-4">
                <Award className="h-8 w-8 mr-2" />
              </div>
              <div className="text-4xl font-bold mb-2">99.9%</div>
              <div className="text-blue-100">Platform Reliability</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-6 w-6" />
              <span className="text-lg font-semibold">AssessmentPro</span>
            </div>
            <div className="text-gray-400">
              © 2025 AssessmentPro. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;