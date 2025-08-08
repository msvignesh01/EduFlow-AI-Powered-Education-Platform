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
            
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            
            {user && (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <User size={20} className="text-gray-600 dark:text-gray-300" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {user.email}
                  </span>
                </div>
                <button
                  onClick={handleSignOut}
                  className="p-2 rounded-md text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  <LogOut size={20} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
          </div>
        </div>
      </div>
    </nav>
  );
};

const Dashboard = () => {
  const [recentSessions, setRecentSessions] = useState<any[]>([]);
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Welcome to EduFlow
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          🤖 AI-Powered Educational Platform with Gemini 2.0 + Ollama
        </p>
      </div>

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
    </div>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <ErrorBoundary>
        <Router>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <EduNavbar />
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/chat" element={<AuthWrapper><div>AI Chat Component</div></AuthWrapper>} />
              <Route path="/career" element={<AuthWrapper><CareerGuidanceChatbot /></AuthWrapper>} />
              <Route path="/materials" element={<AuthWrapper><StudyMaterials /></AuthWrapper>} />
              <Route path="/quizzes" element={<AuthWrapper><QuizComponent /></AuthWrapper>} />
              <Route path="/analytics" element={<AuthWrapper><div>Analytics Component</div></AuthWrapper>} />
            </Routes>
          </div>
        </Router>
      </ErrorBoundary>
    </ThemeProvider>
  );
};

export default App;