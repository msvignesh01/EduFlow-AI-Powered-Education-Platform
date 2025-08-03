import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { useKeyboardNavigation } from '../../hooks/useKeyboardNavigation';
import { useResponsive } from '../../hooks/useResponsive';
import { cn } from '../../utils/cn';

interface PageLayoutProps {
  children: React.ReactNode;
}

export const PageLayout: React.FC<PageLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Default open for desktop
  const { isDesktop, isLargeDesktop, isUltraWide, is4K } = useResponsive();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  // Auto-manage sidebar based on screen size for desktop experience
  useEffect(() => {
    // Keep sidebar open by default on larger screens
    if (isDesktop || isLargeDesktop || isUltraWide || is4K) {
      // Sidebar stays open for better desktop experience
    }
  }, [isDesktop, isLargeDesktop, isUltraWide, is4K]);

  useKeyboardNavigation({
    isOpen: isSidebarOpen,
    onClose: closeSidebar,
  });
  
  return (
    <div className={cn(
      'flex h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200',
      'overflow-hidden' // Prevent layout shifts
    )}>
      {/* Skip to content link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium"
      >
        Skip to main content
      </a>

      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

      <div
        className={cn(
          'flex-1 flex flex-col min-h-screen',
          'transition-all duration-300 ease-in-out',
          // Improved responsive sidebar spacing - less cramping
          isSidebarOpen ? 'ml-56 lg:ml-64 xl:ml-72' : 'ml-0',
          // Ensure proper layout on all desktop sizes
          'min-w-0', // Prevent overflow
        )}
      >
        <Header toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />

        <motion.main
          id="main-content"
          className={cn(
            'flex-1 overflow-y-auto focus:outline-none transition-all duration-300',
            // Better responsive padding - not excessive
            'px-4 sm:px-6 lg:px-8 xl:px-12 pt-16 lg:pt-20 pb-8 lg:pb-12',
            // Smooth scrolling for desktop
            'scroll-smooth',
            // Professional background
            'bg-gray-50/50 dark:bg-gray-900/50'
          )}
          tabIndex={-1}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className={cn(
              'mx-auto w-full max-w-none' // Use full width
            )}
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            {children}
          </motion.div>
        </motion.main>
      </div>

      {/* Mobile sidebar backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-10 bg-black bg-opacity-50 lg:hidden"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}
    </div>
  );
};
