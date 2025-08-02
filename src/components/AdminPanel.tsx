import React, { useState } from 'react';
import { supabase } from '../contexts/supabaseClient';
import { 
  Settings, 
  Users, 
  FileText, 
  BarChart3, 
  Plus, 
  Edit3, 
  Trash2, 
  Download,
  Upload,
  Eye,
  BookOpen,
  Clock,
  Award
} from 'lucide-react';

const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [results, setResults] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const tabs = [
    { id: 'overview', name: 'Overview', icon: BarChart3 },
    { id: 'questions', name: 'Questions', icon: FileText },
    { id: 'results', name: 'Results', icon: Award },
    { id: 'users', name: 'Users', icon: Users },
    { id: 'settings', name: 'Settings', icon: Settings }
  ];

  const mockQuestions = [
    {
      id: 1,
      subject: 'Math',
      question: 'What is 15 × 8?',
      difficulty: 'Easy',
      correctAnswer: '120'
    },
    {
      id: 2,
      subject: 'Science',
      question: 'What is the chemical symbol for gold?',
      difficulty: 'Easy',
      correctAnswer: 'Au'
    },
    {
      id: 3,
      subject: 'Reasoning',
      question: 'What comes next in the sequence: 2, 6, 12, 20, ?',
      difficulty: 'Medium',
      correctAnswer: '30'
    }
  ];

  const mockResults = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      testDate: '2025-01-14',
      mathScore: 85,
      scienceScore: 92,
      reasoningScore: 78,
      totalScore: 85,
      duration: '102 min'
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      testDate: '2025-01-14',
      mathScore: 94,
      scienceScore: 88,
      reasoningScore: 91,
      totalScore: 91,
      duration: '95 min'
    }
  ];

  const loadResults = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('test_results')
        .select(`
          *,
          registrations!inner(first_name, last_name)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading results:', error);
        return;
      }

      // Group results by user and test session
      const groupedResults: { [key: string]: any } = {};
      
      data?.forEach((result: any) => {
        const key = `${result.email}_${result.test_time}`;
        if (!groupedResults[key]) {
          groupedResults[key] = {
            email: result.email,
            name: `${result.registrations.first_name} ${result.registrations.last_name}`,
            testDate: new Date(result.test_time).toLocaleDateString(),
            duration: `${Math.round(result.duration_seconds / 60)} min`,
            subjects: {}
          };
        }
        groupedResults[key].subjects[result.subject] = result.score;
      });

      // Calculate total scores
      const finalResults = Object.values(groupedResults).map((result: any) => {
        const scores = Object.values(result.subjects) as number[];
        const totalScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
        return { ...result, totalScore, ...result.subjects };
      });

      setResults(finalResults);
    } catch (error) {
      console.error('Error loading results:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('registrations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading users:', error);
        return;
      }

      const formattedUsers = data?.map((user: any) => ({
        id: user.id,
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        registrationDate: new Date(user.created_at).toLocaleDateString(),
        status: 'Registered',
        testsTaken: 0 // Would need to calculate from test_results
      })) || [];

      setUsers(formattedUsers);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadQuestions = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading questions:', error);
        return;
      }

      setQuestions(data || []);
    } catch (error) {
      console.error('Error loading questions:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load data when tab changes
  React.useEffect(() => {
    if (activeTab === 'results') {
      loadResults();
    } else if (activeTab === 'users') {
      loadUsers();
    } else if (activeTab === 'questions') {
      loadQuestions();
    }
  }, [activeTab]);
  const mockUsers = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      registrationDate: '2025-01-10',
      status: 'Registered',
      testsTaken: 1
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      registrationDate: '2025-01-12',
      status: 'Registered',
      testsTaken: 1
    }
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-2xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Total Users</p>
              <p className="text-3xl font-bold">1,248</p>
            </div>
            <Users className="h-8 w-8 text-blue-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-2xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">Tests Completed</p>
              <p className="text-3xl font-bold">892</p>
            </div>
            <Award className="h-8 w-8 text-green-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-2xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">Questions Bank</p>
              <p className="text-3xl font-bold">2,156</p>
            </div>
            <FileText className="h-8 w-8 text-purple-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white p-6 rounded-2xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-amber-100">Avg. Score</p>
              <p className="text-3xl font-bold">84%</p>
            </div>
            <BarChart3 className="h-8 w-8 text-amber-200" />
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Recent Test Submissions</h3>
        <div className="space-y-4">
          {mockResults.slice(0, 5).map((result) => (
            <div key={result.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {result.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{result.name}</p>
                  <p className="text-sm text-gray-500">{result.email}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">{result.totalScore}%</p>
                <p className="text-sm text-gray-500">{result.testDate}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderQuestions = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold text-gray-900">Question Management</h3>
        <div className="flex space-x-3">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200">
            <Upload className="h-4 w-4" />
            <span>Import</span>
          </button>
          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200">
            <Plus className="h-4 w-4" />
            <span>Add Question</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Subject</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Question</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Difficulty</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {(questions.length > 0 ? questions : mockQuestions).map((question) => (
                <tr key={question.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                      {question.subject}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-900 max-w-md truncate">{question.question}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      question.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                      question.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {question.difficulty}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-800 p-1">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-800 p-1">
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-800 p-1">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderResults = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold text-gray-900">Test Results</h3>
        <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200">
          <Download className="h-4 w-4" />
          <span>Export CSV</span>
        </button>
      </div>

      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent mx-auto mb-2"></div>
          <p className="text-gray-600">Loading results...</p>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Student</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Test Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Math</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Science</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Reasoning</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Total</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Duration</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {(results.length > 0 ? results : mockResults).map((result, index) => (
                <tr key={result.id || index} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-semibold text-gray-900">{result.name}</p>
                      <p className="text-sm text-gray-500">{result.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-900">{result.testDate}</td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-gray-900">{result.Math || result.mathScore || 'N/A'}%</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-gray-900">{result.Science || result.scienceScore || 'N/A'}%</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-gray-900">{result.Reasoning || result.reasoningScore || 'N/A'}%</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`font-semibold px-3 py-1 rounded-full text-sm ${
                      result.totalScore >= 90 ? 'bg-green-100 text-green-800' :
                      result.totalScore >= 80 ? 'bg-blue-100 text-blue-800' :
                      result.totalScore >= 70 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {result.totalScore}%
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-900">{result.duration}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold text-gray-900">User Management</h3>
        <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200">
          <Download className="h-4 w-4" />
          <span>Export Users</span>
        </button>
      </div>

      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent mx-auto mb-2"></div>
          <p className="text-gray-600">Loading users...</p>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">User</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Registration Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Tests Taken</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {(users.length > 0 ? users : mockUsers).map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-semibold text-gray-900">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-900">{user.registrationDate}</td>
                  <td className="px-6 py-4">
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-900">{user.testsTaken}</td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-800 p-1">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-800 p-1">
                        <Edit3 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-gray-900">System Settings</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Test Configuration</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Test Duration (minutes)</label>
              <input type="number" className="w-full px-4 py-2 border border-gray-300 rounded-lg" defaultValue="120" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Questions per Subject</label>
              <input type="number" className="w-full px-4 py-2 border border-gray-300 rounded-lg" defaultValue="20" />
            </div>
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="randomize" className="rounded" defaultChecked />
              <label htmlFor="randomize" className="text-sm text-gray-700">Randomize Questions</label>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">System Preferences</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Platform Name</label>
              <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg" defaultValue="AssessmentPro" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Contact Email</label>
              <input type="email" className="w-full px-4 py-2 border border-gray-300 rounded-lg" defaultValue="admin@assessmentpro.com" />
            </div>
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="notifications" className="rounded" defaultChecked />
              <label htmlFor="notifications" className="text-sm text-gray-700">Email Notifications</label>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200">
          Save Settings
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">Admin Panel</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Administrator</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200
                      ${activeTab === tab.id
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'text-gray-600 hover:bg-gray-100'
                      }
                    `}
                  >
                    <tab.icon className="h-5 w-5" />
                    <span className="font-medium">{tab.name}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'questions' && renderQuestions()}
            {activeTab === 'results' && renderResults()}
            {activeTab === 'users' && renderUsers()}
            {activeTab === 'settings' && renderSettings()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;