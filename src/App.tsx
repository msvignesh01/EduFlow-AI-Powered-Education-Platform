import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from './context/ThemeContext';
import { PageLayout } from './components/layout/PageLayout';
import { Dashboard } from './pages/Dashboard';
import { Profile } from './pages/Profile';
import { StudyAnalysis } from './pages/StudyAnalysis';
import { ChatPage } from './pages/ChatPage';
// Removed BlankPage - unnecessary demo component
import TutorPage from './pages/TutorPage';
// Removed InteractiveDemo - unnecessary clutter
import { ErrorBoundary } from './components/ErrorBoundary';
import { ToastContainer } from './components/ui/Toast';
import { BreakpointIndicator } from './components/dev/BreakpointIndicator';
import { PremiumLoadingScreen } from './components/ui/PremiumLoadingScreen';
import { useAuthStore } from './store/authStore';
import { useResponsive } from './hooks/useResponsive';
import { useEffect, useState } from 'react';
import { cn } from './utils/cn';

function App() {
  const { getCurrentUser, isAuthenticated } = useAuthStore();
  const { isLaptop, isDesktop, isLargeDesktop, isUltraWide, is4K } = useResponsive();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize auth state on app load
    if (isAuthenticated) {
      getCurrentUser();
    }

    // Simulate app initialization
    const initializeApp = async () => {
      // Minimum loading time for better UX
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsLoading(false);
    };

    initializeApp();
  }, [getCurrentUser, isAuthenticated]);

  return (
    <ErrorBoundary>
      <HelmetProvider>
        <ThemeProvider>
          <div
            className={cn(
              'min-h-screen w-full overflow-x-hidden',
              'select-none',
              // Desktop-focused classes
              isLaptop && 'laptop-device',
              isDesktop && 'desktop-device',
              isLargeDesktop && 'large-desktop-device',
              isUltraWide && 'ultra-wide-device',
              is4K && '4k-device'
            )}
            style={{
              WebkitTouchCallout: 'none',
              WebkitUserSelect: 'none',
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            <PremiumLoadingScreen
              isLoading={isLoading}
              onComplete={() => setIsLoading(false)}
            />

            {!isLoading && (
              <Router>
                <PageLayout>
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/study-analysis" element={<StudyAnalysis />} />
                    <Route path="/chat" element={<ChatPage />} />
                    {/* Removed blank page route - unnecessary demo */}
                    <Route path="/tutor" element={<TutorPage />} />
                    {/* Removed demo route - unnecessary clutter */}
                  </Routes>
                </PageLayout>
                <ToastContainer />
                {process.env.NODE_ENV === 'development' && <BreakpointIndicator />}
              </Router>
            )}
          </div>
        </ThemeProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
}

export default App;
