import React, { useState, useEffect } from 'react';
import { Menu, X, Bell, Sun, Moon, User, LogOut, LogIn, Settings, Search, MoreVertical } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { useAuthStore } from '../../store/authStore';
import { AuthModal } from '../auth/AuthModal';
import { Button } from '../ui/Button';
import { ThemeToggle } from '../ui/ThemeToggle';
import { cn, responsive } from '../../utils/cn';
import { useResponsive } from '../../hooks/useResponsive';
import { AnimatedSearch, AnimatedBell, AnimatedSettings, AnimatedUser } from '../animations/AnimatedIcons';


interface HeaderProps {
  toggleSidebar: () => void; 
  isSidebarOpen: boolean;
}

export const Header: React.FC<HeaderProps> = ({ toggleSidebar, isSidebarOpen }) => {
  const { theme, setTheme, isDark } = useTheme();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { isLaptop, isDesktop, isLargeDesktop, isUltraWide, is4K } = useResponsive();
  const [isScrolled, setIsScrolled] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  const handleAuthClick = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
  };


  return (
    <>
      <motion.header
        className={cn(
          'fixed top-0 left-0 right-0 z-30',
          // Desktop-optimized sidebar spacing
          isSidebarOpen ? 'pl-64 xl:pl-72 2xl:pl-80' : 'pl-0',
          'transition-all duration-300 ease-in-out',
          isScrolled
            ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-xl border-b border-gray-200/50 dark:border-gray-700/50'
            : 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg'
        )}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <div className={cn(
          'h-16 xl:h-18 2xl:h-20 flex items-center justify-between',
          'px-8 xl:px-12 2xl:px-16'
        )}>
          <div className="flex items-center">
            {/* Mobile/Tablet sidebar toggle */}
            <motion.button
              onClick={toggleSidebar}
              className={cn(
                'p-2 rounded-xl transition-all duration-300',
                'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200',
                'hover:bg-white/50 dark:hover:bg-gray-800/50 backdrop-blur-sm',
                'focus:outline-none focus:ring-2 focus:ring-primary-500/50',
                'mr-4'
              )}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={isSidebarOpen ? 'close' : 'menu'}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                </motion.div>
              </AnimatePresence>
            </motion.button>

            {/* Logo - responsive sizing */}
            <motion.div
              className={cn(
                'font-bold bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text',
                'text-xl xl:text-2xl 2xl:text-2xl'
              )}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              EduLearn
            </motion.div>
          </div>

          {/* Desktop actions */}
          <div className={cn(
            'flex items-center space-x-3 xl:space-x-4 2xl:space-x-4'
          )}>
            {/* Search button - always visible on desktop */}
            <motion.button
              className={cn(
                'p-2 xl:p-3 2xl:p-3 rounded-xl transition-all duration-300',
                'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200',
                'hover:bg-white/50 dark:hover:bg-gray-800/50 backdrop-blur-sm',
                'focus:outline-none focus:ring-2 focus:ring-primary-500/50'
              )}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Search"
            >
              <Search size={18} />
            </motion.button>

            {/* Theme toggle - always visible */}
            <ThemeToggle variant="button" size="sm" />

            {/* Notifications - always visible on desktop */}
            <motion.button
              className={cn(
                'relative p-2 xl:p-3 2xl:p-3 rounded-xl transition-all duration-300',
                'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200',
                'hover:bg-white/50 dark:hover:bg-gray-800/50 backdrop-blur-sm',
                'focus:outline-none focus:ring-2 focus:ring-primary-500/50'
              )}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Notifications"
            >
              <AnimatedBell size={18} variant="bounce" />
              <motion.span
                className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.button>

            {/* Desktop sidebar toggle button */}
            <motion.button
              onClick={toggleSidebar}
              className={cn(
                'p-3 xl:p-3.5 2xl:p-4 rounded-xl transition-all duration-300',
                'bg-gray-100/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50',
                'hover:bg-gray-200/80 dark:hover:bg-gray-700/80 hover:scale-105 hover:shadow-lg',
                'focus:outline-none focus:ring-2 focus:ring-primary-500/50'
              )}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Toggle sidebar"
            >
              <Menu size={20} className="text-gray-700 dark:text-gray-300" />
            </motion.button>

            {isAuthenticated ? (
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-500 dark:text-gray-400"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  aria-label="User menu"
                >
                  <User size={18} />
                </Button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50">
                    <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {user?.username}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {user?.email}
                      </p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                    >
                      <LogOut size={16} className="mr-2" />
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleAuthClick('login')}
                >
                  Sign in
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleAuthClick('register')}
                >
                  Sign up
                </Button>
              </div>
            )}
          </div>
        </div>
      </motion.header>

      {/* Desktop-only header - no mobile menu needed */}

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        defaultMode={authMode}
      />

    </>
  );
};
