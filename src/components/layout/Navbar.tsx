import React, { useState } from 'react';
import { Menu, X, BookOpen, BarChart2, FileText, Brain, MessageSquare, User } from 'lucide-react';
import Button from '../ui/Button';

interface NavbarProps {
  onNavItemClick: (route: string) => void;
  currentRoute: string;
}

const Navbar: React.FC<NavbarProps> = ({ onNavItemClick, currentRoute }) => {


  const navItems = [
    { name: 'Dashboard', icon: <BarChart2 size={20} />, route: 'dashboard' },
    { name: 'Study Materials', icon: <BookOpen size={20} />, route: 'materials' },
    { name: 'PDF Converter', icon: <FileText size={20} />, route: 'converter' },
    { name: 'Quizzes', icon: <Brain size={20} />, route: 'quizzes' },
    { name: 'Career Guide', icon: <MessageSquare size={20} />, route: 'career' },
    { name: 'Profile', icon: <User size={20} />, route: 'profile' },
  ];



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
          
          {
}
        </div>
      </div>

      {
