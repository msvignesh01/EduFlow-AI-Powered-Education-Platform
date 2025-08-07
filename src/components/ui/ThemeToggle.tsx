
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { cn } from '../../utils/cn';

interface ThemeToggleProps {
  variant?: 'button' | 'dropdown' | 'switch';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  variant = 'button',
  size = 'md',
  className = '',
}) => {
  const { theme, setTheme, isDark, toggleTheme, isTransitioning } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24,
  };

  if (variant === 'button') {
    return (
      <motion.button
        onClick={toggleTheme}
        className={cn(
          'relative overflow-hidden rounded-xl bg-white/10 dark:bg-black/10 backdrop-blur-md border border-white/20 dark:border-white/10',
          'hover:bg-white/20 dark:hover:bg-black/20 transition-all duration-300',
          'focus:outline-none focus:ring-2 focus:ring-primary-500/50',
          'shadow-glass hover:shadow-glow-blue',
          sizeClasses[size],
          className
        )}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        disabled={isTransitioning}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={isDark ? 'moon' : 'sun'}
            initial={{ rotate: -180, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 180, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="absolute inset-0 flex items-center justify-center"
          >
            {isDark ? (
              <Moon 
                size={iconSizes[size]} 
                className="text-blue-400 drop-shadow-glow" 
              />
            ) : (
              <Sun 
                size={iconSizes[size]} 
                className="text-yellow-500 drop-shadow-glow" 
              />
            )}
          </motion.div>
        </AnimatePresence>
        
        {
}
        {isOpen && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
        )}
      </div>
    );
  }

  if (variant === 'switch') {
    return (
      <div className="flex items-center space-x-3">
        <Sun size={16} className="text-yellow-500" />
        <motion.button
          onClick={toggleTheme}
          className={cn(
            'relative w-12 h-6 rounded-full transition-colors duration-300',
            isDark ? 'bg-primary-600' : 'bg-gray-300',
            className
          )}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md"
            animate={{
              x: isDark ? 24 : 0,
            }}
            transition={{
              type: 'spring',
              stiffness: 500,
              damping: 30,
            }}
          />
        </motion.button>
        <Moon size={16} className="text-blue-400" />
      </div>
    );
  }

  return null;
};


export const FloatingThemeToggle: React.FC = () => {
  const { toggleTheme, isDark } = useTheme();

  return (
    <motion.button
      onClick={toggleTheme}
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-white/10 dark:bg-black/10 backdrop-blur-md border border-white/20 dark:border-white/10 shadow-glass hover:shadow-glow-blue"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1 }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={isDark ? 'moon' : 'sun'}
          initial={{ rotate: -180, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          exit={{ rotate: 180, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          {isDark ? (
            <Moon size={24} className="text-blue-400" />
          ) : (
            <Sun size={24} className="text-yellow-500" />
          )}
        </motion.div>
      </AnimatePresence>
    </motion.button>
  );
};
