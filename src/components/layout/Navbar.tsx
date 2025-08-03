import React, { useState } from 'react';
import { Menu, X, BookOpen, BarChart2, FileText, Brain, MessageSquare, User } from 'lucide-react';
import Button from '../ui/Button';

interface NavbarProps {
  onNavItemClick: (route: string) => void;
  currentRoute: string;
}

const Navbar: React.FC<NavbarProps> = ({ onNavItemClick, currentRoute }) => {
  // Removed mobile menu - desktop only

  const navItems = [
    { name: 'Dashboard', icon: <BarChart2 size={20} />, route: 'dashboard' },
    { name: 'Study Materials', icon: <BookOpen size={20} />, route: 'materials' },
    { name: 'PDF Converter', icon: <FileText size={20} />, route: 'converter' },
    { name: 'Quizzes', icon: <Brain size={20} />, route: 'quizzes' },
    { name: 'Career Guide', icon: <MessageSquare size={20} />, route: 'career' },
    { name: 'Profile', icon: <User size={20} />, route: 'profile' },
  ];

  // Desktop-only navigation

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-30">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <BookOpen className="h-8 w-8 text-blue-600 dark:text-blue-500" />
              <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">StudyMind</span>
            </div>
          </div>
          
          {/* Desktop navigation */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {navItems.map((item) => (
              <button
                key={item.route}
                onClick={() => onNavItemClick(item.route)}
                className={`
                  px-3 py-2 rounded-md text-sm font-medium flex items-center transition-colors
                  ${currentRoute === item.route 
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' 
                    : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'}
                `}
              >
                <span className="mr-2">{item?.icon}</span>
                {item.name}
              </button>
            ))}
          </div>
          
          {/* Desktop-only navigation - no mobile menu needed */}
        </div>
      </div>

      {/* Desktop-only navigation - no mobile menu */}
    </nav>
  );
};

export default Navbar;
