
import { motion, HTMLMotionProps } from 'framer-motion';
import React from 'react';
import { cn } from '../../utils/cn';
import { PremiumLoader } from '../animations/PremiumLoader';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'gradient' | 'glass';
type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'size'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  icon?: React.ReactNode; // For backward compatibility
  glow?: boolean;
  shimmer?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  icon, // For backward compatibility
  fullWidth = false,
  glow = false,
  shimmer = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = cn(
    'relative inline-flex items-center justify-center font-semibold transition-all duration-300',
    'focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:ring-offset-2 dark:focus:ring-offset-gray-900',
    'disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed',
    'overflow-hidden group',
    fullWidth && 'w-full'
  );
  
  const variantStyles = {
    primary: cn(
      'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg',
      'hover:from-blue-700 hover:to-blue-800 hover:shadow-xl hover:shadow-blue-500/25',
      'active:from-blue-800 active:to-blue-900',
      glow && 'shadow-glow-blue'
    ),
    secondary: cn(
      'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg',
      'hover:from-purple-700 hover:to-purple-800 hover:shadow-xl hover:shadow-purple-500/25',
      'active:from-purple-800 active:to-purple-900',
      glow && 'shadow-glow-purple'
    ),
    outline: cn(
      'border-2 border-gray-300 dark:border-gray-600 bg-transparent backdrop-blur-sm',
      'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50',
      'hover:border-gray-400 dark:hover:border-gray-500 hover:shadow-md'
    ),
    ghost: cn(
      'bg-transparent text-gray-700 dark:text-gray-300',
      'hover:bg-gray-100 dark:hover:bg-gray-800/50 hover:backdrop-blur-sm'
    ),
    danger: cn(
      'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg',
      'hover:from-red-700 hover:to-red-800 hover:shadow-xl hover:shadow-red-500/25',
      'active:from-red-800 active:to-red-900'
    ),
    gradient: cn(
      'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white shadow-lg',
      'hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 hover:shadow-xl',
      'hover:shadow-purple-500/25 active:scale-95'
    ),
    glass: cn(
      'bg-white/10 dark:bg-black/10 backdrop-blur-md border border-white/20 dark:border-white/10',
      'text-gray-900 dark:text-white shadow-glass',
      'hover:bg-white/20 dark:hover:bg-black/20 hover:shadow-glass-dark'
    ),
  };
  
  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 rounded-lg',
    md: 'text-sm px-4 py-2 rounded-xl',
    lg: 'text-base px-5 py-2.5 rounded-xl',
    xl: 'text-lg px-8 py-4 rounded-2xl',
  };
  
  const widthStyles = fullWidth ? 'w-full' : '';
  
  return (
    <motion.button
      className={cn(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        shimmer && 'shimmer-effect',
        className
      )}
      disabled={disabled || isLoading}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
      {...props}
    >
      {/* Shimmer effect overlay */}
      {shimmer && (
        <div className="absolute inset-0 -top-px overflow-hidden rounded-inherit">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-shimmer" />
        </div>
      )}

      {/* Content */}
      <div className="relative flex items-center justify-center">
        {isLoading ? (
          <PremiumLoader variant="spinner" size="sm" />
        ) : (
          <>
            {(leftIcon || icon) && (
              <motion.span
                className="mr-2"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
              >
                {leftIcon || icon}
              </motion.span>
            )}

            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2, delay: 0.1 }}
            >
              {children}
            </motion.span>

            {rightIcon && (
              <motion.span
                className="ml-2"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
              >
                {rightIcon}
              </motion.span>
            )}
          </>
        )}
      </div>

      {/* Glow effect for hover */}
      {glow && (
        <motion.div
          className="absolute inset-0 rounded-inherit opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: variant === 'primary'
              ? 'radial-gradient(circle at center, rgba(59, 130, 246, 0.3) 0%, transparent 70%)'
              : variant === 'secondary'
              ? 'radial-gradient(circle at center, rgba(139, 92, 246, 0.3) 0%, transparent 70%)'
              : 'radial-gradient(circle at center, rgba(59, 130, 246, 0.3) 0%, transparent 70%)',
          }}
        />
      )}
    </motion.button>
  );
};

export default Button;
