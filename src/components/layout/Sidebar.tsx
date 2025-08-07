import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  User,
  BarChart2,
  MessageSquare,
  Settings,
  LogOut,
  BookOpen,
  Lightbulb,
  X
} from 'lucide-react';
import { cn, responsive } from '../../utils/cn';

interface SidebarProps {
  isOpen: boolean;
  onClose?: () => void;
}

interface NavItem {
  path: string;
  label: string;
  icon: React.ReactNode;
}

const primaryNavItems: NavItem[] = [
  { path: '/', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
  { path: '/profile', label: 'Profile', icon: <User size={20} /> },
  { path: '/study-analysis', label: 'Study Analysis', icon: <BarChart2 size={20} /> },
  { path: '/chat', label: 'AI Chat', icon: <MessageSquare size={20} /> },
  { path: '/tutor', label: 'AI Tutor', icon: <Lightbulb size={20} /> },
];

const secondaryNavItems: NavItem[] = [
  { path: '/courses', label: 'Courses', icon: <BookOpen size={20} /> },
  { path: '/resources', label: 'Resources', icon: <Lightbulb size={20} /> },
  { path: '/settings', label: 'Settings', icon: <Settings size={20} /> },
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();



  const NavItem: React.FC<{ item: NavItem }> = ({ item }) => {
    const isActive = location.pathname === item.path;

    return (
      <motion.div
        whileHover={{ x: 4 }}
        whileTap={{ scale: 0.98 }}
      >
        <Link
          to={item.path}
          className={cn(
            'flex items-center px-4 xl:px-5 2xl:px-6 py-3 xl:py-4 2xl:py-4 rounded-xl text-sm xl:text-base 2xl:text-base font-medium transition-all duration-300',
            'hover:shadow-lg hover:-translate-y-0.5 hover:bg-white/80 dark:hover:bg-gray-800/80',
            isActive
              ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
              : 'text-gray-700 hover:bg-white/50 dark:text-gray-300 dark:hover:bg-gray-800/50 backdrop-blur-sm'
          )}
        >
          <motion.span
            className={cn(
              'transition-colors duration-300',
              isActive ? 'text-white' : 'text-gray-500 dark:text-gray-400'
            )}
            whileHover={{ scale: 1.1 }}
          >
            {item?.icon}
          </motion.span>
          <span className="ml-3 font-medium">{item.label}</span>
          {isActive && (
            <motion.div
              className="ml-auto w-2 h-2 bg-white rounded-full"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          )}
        </Link>
      </motion.div>
    );
  };

  return (
    <>
      {
}
      <motion.aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex flex-col',
          'bg-white/98 dark:bg-gray-900/98 backdrop-blur-xl',
          'border-r border-gray-200/80 dark:border-gray-700/80 shadow-xl',

          'w-56 lg:w-64 xl:w-72',

          'transform transition-all duration-300 ease-out',
          isOpen ? 'translate-x-0' : '-translate-x-full',

          'translate-x-0 static shadow-none'
        )}
        initial={false}
        animate={{
          x: isOpen ? 0 : 0,
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30
        }}
      >
        {
}
        <div className={cn(
          'flex flex-col h-full pt-16 xl:pt-18 2xl:pt-20'
        )}>
          {
}
          <motion.div
            className="p-4 border-t border-white/10 dark:border-gray-800/50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <motion.button
              className={cn(
                'flex items-center w-full px-3 py-3 text-sm font-medium rounded-xl transition-all duration-300',
                'text-red-600 dark:text-red-400',
                'hover:bg-red-50 dark:hover:bg-red-900/20',
                'hover:shadow-lg hover:-translate-y-0.5'
              )}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <LogOut size={20} className="text-red-500 dark:text-red-400" />
              <span className="ml-3">Log out</span>
            </motion.button>
          </motion.div>
        </div>
      </motion.aside>
    </>
  );
};
