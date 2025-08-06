import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { useTheme } from './context/ThemeContext';
import { BookOpen, BarChart2, MessageSquare, User, Moon, Sun, LogOut, GraduationCap, Brain, FileText, BrainCircuit } from 'lucide-react';
import { User as FirebaseUser, signOut, onAuthStateChanged } from 'firebase/auth';
import { auth } from './lib/firebase';
import AuthWrapper from './components/auth/AuthWrapper';
import CareerGuidanceChatbot from './components/career/CareerGuidanceChatbot';
import StudyMaterials from './components/materials/StudyMaterials';
import QuizComponent from './components/quiz/QuizComponent';
import useHybridAI from './hooks/useHybridAI';
import { studyService } from './services/studyService';

// Clean Navbar with Firebase Auth
const EduNavbar = () => {
  const location = useLocation();
  const { theme, toggleTheme, isDark } = useTheme();
  const [user, setUser] = useState<FirebaseUser | null>(null);
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error: any) {
      console.error('Sign out error:', error);
    }
  };
  
  const navItems = [
    { name: 'Dashboard', icon: BarChart2, path: '/' },
    { name: 'AI Chat', icon: MessageSquare, path: '/chat' },
    { name: 'Career Guidance', icon: GraduationCap, path: '/career' },
    { name: 'Study Materials', icon: FileText, path: '/materials' },
    { name: 'Quizzes', icon: Brain, path: '/quizzes' },
    { name: 'Analytics', icon: BarChart2, path: '/analytics' },
  ];

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <BookOpen className="h-8 w-8 text-blue-600 dark:text-blue-500" />
              <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">EduFlow</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium flex items-center transition-colors ${
                    isActive 
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' 
                      : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                  }`}
                >
                  <Icon size={16} className="mr-2" />
                  {item.name}
                </Link>
              );
            })}
            
            {/* User Info & Auth */}
            {user && (
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-2 px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="Profile" className="w-6 h-6 rounded-full" />
                  ) : (
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">
                        {user.displayName?.charAt(0) || user.email?.charAt(0) || 'U'}
                      </span>
                    </div>
                  )}
                  <span className="text-sm text-gray-700 dark:text-gray-300 hidden sm:block">
                    {user.displayName || user.email}
                  </span>
                </div>
                <button
                  onClick={handleSignOut}
                  className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-red-100 dark:hover:bg-red-900 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                  title="Sign Out"
                >
                  <LogOut size={16} />
                </button>
              </div>
            )}
            
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

// Educational Dashboard Component
const EduDashboard = () => {
  const [stats, setStats] = useState({
    studyHours: 0,
    courses: 0,
    streak: 0,
    points: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [recentSessions, setRecentSessions] = useState<any[]>([]);
  const { generateContent, isLoading: aiLoading } = useHybridAI();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      
      // Get user stats from Firebase
      const userStats = await studyService.getUserStats();
      const recent = await studyService.getRecentSessions(7);
      
      setStats({
        studyHours: userStats.totalHours,
        courses: userStats.totalSessions,
        streak: userStats.currentStreak,
        points: Math.floor(userStats.totalHours * 100 + userStats.completedQuizzes * 50)
      });
      
      setRecentSessions(recent);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const completeStudySession = async () => {
    // Record a study session
    await studyService.saveStudySession({
      duration: 30, // 30 minute session
      subject: 'General Study',
      type: 'material'
    });
    
    // Reload data to show updated stats
    await loadDashboardData();
  };

  const handleGenerateQuiz = async () => {
    try {
      const response = await generateContent('Generate a 5-question multiple choice quiz about basic mathematics');
      const responseText = typeof response === 'string' ? response : response.content || 'Could not generate quiz.';
      alert(`✅ Quiz Generated!\n\n${responseText.substring(0, 200)}...`);
      
      // Track this as a study session
      await studyService.saveStudySession({
        duration: 10,
        subject: 'Mathematics',
        type: 'quiz'
      });
      
      await loadDashboardData();
    } catch (error) {
      alert('❌ Error generating quiz. Please check your AI configuration.');
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Welcome to EduFlow
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          🤖 AI-Powered Educational Platform with Gemini 2.0 + Ollama
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { title: "Study Hours", value: stats.studyHours.toFixed(1), icon: "📚", color: "blue" },
          { title: "Sessions", value: stats.courses.toString(), icon: "🎓", color: "purple" },
          { title: "Streak", value: `${stats.streak} days`, icon: "🔥", color: "green" },
          { title: "Points", value: stats.points.toLocaleString(), icon: "🏆", color: "yellow" }
        ].map((stat, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition-all transform hover:scale-105">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-lg">{stat.icon}</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity Section */}
      {recentSessions.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Recent Activity</h2>
          <div className="space-y-2">
            {recentSessions.slice(0, 5).map((session, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700 last:border-0">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">
                    {session.type === 'quiz' ? '📝' : 
                     session.type === 'chat' ? '💬' : 
                     session.type === 'career' ? '🎯' : '📚'}
                  </span>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{session.subject}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {session.duration} minutes
                      {session.score !== undefined && ` • Score: ${session.score}%`}
                    </p>
                  </div>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {session.completedAt?.toDate ? 
                    new Date(session.completedAt.toDate()).toLocaleDateString() : 
                    'Today'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Educational Tools</h2>
          <div className="space-y-3">
            <Link
              to="/chat"
              className="w-full text-left p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all block"
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">🤖</span>
                <div className="flex-1">
                  <span className="font-medium text-gray-900 dark:text-white">AI Tutor Chat</span>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Get instant help with your studies</p>
                </div>
              </div>
            </Link>
            
            <Link
              to="/career"
              className="w-full text-left p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/10 transition-all block"
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">🎯</span>
                <div className="flex-1">
                  <span className="font-medium text-gray-900 dark:text-white">Career Guidance</span>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Explore career paths and opportunities</p>
                </div>
              </div>
            </Link>
            
            <Link
              to="/materials"
              className="w-full text-left p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/10 transition-all block"
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">📚</span>
                <div className="flex-1">
                  <span className="font-medium text-gray-900 dark:text-white">Study Materials</span>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Access your learning resources</p>
                </div>
              </div>
            </Link>
            
            <Link
              to="/quizzes"
              className="w-full text-left p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/10 transition-all block"
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">🧠</span>
                <div className="flex-1">
                  <span className="font-medium text-gray-900 dark:text-white">Interactive Quizzes</span>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Test your knowledge</p>
                </div>
              </div>
            </Link>

            <button
              onClick={completeStudySession}
              className="w-full text-left p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/10 transition-all"
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">🚀</span>
                <div className="flex-1">
                  <span className="font-medium text-gray-900 dark:text-white">Complete Study Session</span>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Record a 30-minute study session</p>
                </div>
              </div>
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Quick Stats</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Today's Progress</span>
              <span className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 px-2 py-1 rounded text-sm">
                {recentSessions.filter(s => {
                  const today = new Date();
                  const sessionDate = s.completedAt?.toDate ? new Date(s.completedAt.toDate()) : new Date();
                  return sessionDate.toDateString() === today.toDateString();
                }).length} sessions
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">This Week</span>
              <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-2 py-1 rounded text-sm">
                {recentSessions.length} sessions
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Completion Rate</span>
              <span className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 px-2 py-1 rounded text-sm">
                {stats.courses > 0 ? Math.round((stats.courses / (stats.courses + 5)) * 100) : 0}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Learning Streak</span>
              <span className={`px-2 py-1 rounded text-sm ${
                stats.streak > 0 
                  ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' 
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
              }`}>
                {stats.streak > 0 ? `${stats.streak} days 🔥` : 'Start today!'}
              </span>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={handleGenerateQuiz}
                disabled={aiLoading}
                className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors"
              >
                {aiLoading ? 'Generating...' : '🧠 Test AI Quiz Generation'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// AI Chat Component with Hybrid AI
const AIChat = () => {
  const [messages, setMessages] = useState<Array<{id: string, content: string, sender: 'user' | 'ai', timestamp: Date}>>([]);
  const [inputValue, setInputValue] = useState('');
  const { generateContent, isLoading } = useHybridAI();

  const sendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user' as const,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue('');

    try {
      const response = await generateContent(currentInput);
      const responseText = typeof response === 'string' ? response : response.content || 'Sorry, I could not generate a response.';
      
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        content: responseText,
        sender: 'ai' as const,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
      
      // Track study session
      await studyService.saveStudySession({
        duration: 5, // Estimate 5 minutes per chat
        subject: 'AI Chat',
        type: 'chat'
      });
    } catch (error: any) {
      console.error('AI Error:', error);
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        content: `Sorry, I encountered an error: ${error.message}. Please check your AI service configuration.`,
        sender: 'ai' as const,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">AI Tutor Chat</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        💬 Get instant help with your studies using our hybrid AI system (Gemini 2.0 + Ollama)
      </p>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow h-96 flex flex-col">
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 dark:text-gray-400">
              <p>🤖 AI Tutor Ready</p>
              <p className="text-sm mt-2">Ask me anything about your studies!</p>
            </div>
          ) : (
            messages.map((message) => (
              <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.sender === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                }`}>
                  <p>{message.content}</p>
                  <div className="text-xs mt-1 opacity-70">
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))
          )}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                  <span className="text-xs text-gray-500">AI thinking...</span>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="border-t border-gray-200 dark:border-gray-700 p-4">
          <div className="flex space-x-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Ask me anything about your studies..."
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            />
            <button
              onClick={sendMessage}
              disabled={isLoading || !inputValue.trim()}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Study Analytics Component
const StudyAnalytics = () => {
  const [studyData, setStudyData] = useState({
    totalSessions: 0,
    totalHours: 0,
    averageScore: 0,
    weeklyGoal: 20,
    completedQuizzes: 0,
    currentStreak: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStudyData();
  }, []);

  const loadStudyData = async () => {
    try {
      setIsLoading(true);
      const stats = await studyService.getUserStats();
      setStudyData(stats);
    } catch (error) {
      console.error('Error loading study data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const weeklyProgress = Math.min((studyData.totalHours / studyData.weeklyGoal) * 100, 100);

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Study Analytics</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            📊 Track your learning progress and get insights to improve your study habits
          </p>
        </div>
        <button
          onClick={loadStudyData}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Refresh
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Sessions</h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{studyData.totalSessions}</p>
          <div className="flex items-center mt-2">
            <span className="text-green-500 text-sm">
              {studyData.totalSessions > 0 ? '📈 Active learner' : '🚀 Start learning!'}
            </span>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Study Hours</h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{studyData.totalHours}</p>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${weeklyProgress}%` }}
            ></div>
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {weeklyProgress.toFixed(0)}% of weekly goal
          </span>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Average Quiz Score</h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {studyData.averageScore || 0}%
          </p>
          <div className="flex items-center mt-2">
            <span className="text-green-500 text-sm">
              {studyData.averageScore >= 80 ? '🎯 Excellent!' : 
               studyData.averageScore >= 60 ? '📚 Good progress' : 
               '💪 Keep practicing'}
            </span>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Current Streak</h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{studyData.currentStreak} days</p>
          <div className="flex items-center mt-2">
            <span className="text-orange-500 text-sm">
              {studyData.currentStreak > 0 ? '🔥 Keep it up!' : '🌟 Start today!'}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Learning Insights</h2>
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h3 className="font-medium text-blue-900 dark:text-blue-200">📚 Study Pattern Analysis</h3>
            <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
              {studyData.totalSessions > 0 
                ? "You're building great study habits! Keep up the consistent learning."
                : "Start your learning journey today with AI-powered tutoring and quizzes."}
            </p>
          </div>
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <h3 className="font-medium text-green-900 dark:text-green-200">🎯 Performance Trends</h3>
            <p className="text-sm text-green-700 dark:text-green-300 mt-1">
              {studyData.averageScore > 0 
                ? `Your current average score is ${studyData.averageScore}%. ${studyData.averageScore >= 80 ? 'Excellent work!' : 'Keep practicing to improve!'}`
                : "Complete some quizzes to see your performance trends here."}
            </p>
          </div>
          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <h3 className="font-medium text-purple-900 dark:text-purple-200">💡 AI Recommendations</h3>
            <p className="text-sm text-purple-700 dark:text-purple-300 mt-1">
              {studyData.currentStreak > 0 
                ? `Great ${studyData.currentStreak}-day streak! Try exploring different subjects to broaden your knowledge.`
                : "Start with our AI tutor to get personalized learning recommendations."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthWrapper>
          <Router>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
              <EduNavbar />
              <main>
                <Routes>
                  <Route path="/" element={<EduDashboard />} />
                  <Route path="/chat" element={<AIChat />} />
                  <Route path="/career" element={<CareerGuidanceChatbot />} />
                  <Route path="/materials" element={<StudyMaterials />} />
                  <Route path="/quizzes" element={<QuizComponent />} />
                  <Route path="/analytics" element={<StudyAnalytics />} />
                </Routes>
              </main>
            </div>
          </Router>
        </AuthWrapper>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
