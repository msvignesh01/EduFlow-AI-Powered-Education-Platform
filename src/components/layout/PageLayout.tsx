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
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { isDesktop, isLargeDesktop, isUltraWide, is4K } = useResponsive();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };


  useEffect(() => {

    if (isDesktop || isLargeDesktop || isUltraWide || is4K) {

    }
  }, [isDesktop, isLargeDesktop, isUltraWide, is4K]);

  useKeyboardNavigation({
    isOpen: isSidebarOpen,
    onClose: closeSidebar,
  });
  
  return (
    <div className={cn(
      'flex h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200',
      'overflow-hidden'
    )}>
      {
}
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
