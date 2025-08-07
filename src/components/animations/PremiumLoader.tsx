
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';
import { variants, transitions, easings } from '../../utils/animations';
import { useReducedMotion } from '../../utils/accessibility';

interface PremiumLoaderProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'spinner' | 'dots' | 'pulse' | 'wave' | 'gradient';
  className?: string;
}

export const PremiumLoader: React.FC<PremiumLoaderProps> = ({
  size = 'md',
  variant = 'spinner',
  className = '',
}) => {
  const prefersReducedMotion = useReducedMotion();
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const containerClass = cn(
    'flex items-center justify-center',
    sizeClasses[size],
    className
  );

  if (variant === 'spinner') {
    return (
      <div className={containerClass}>
        <motion.div
          className="w-full h-full border-2 border-primary-200 border-t-primary-600 rounded-full"
          animate={prefersReducedMotion ? {} : { rotate: 360 }}
          transition={prefersReducedMotion ? {} : {
            duration: 1,
            repeat: Infinity,
            ease: 'linear',
          }}
          style={{ willChange: 'transform' }}
        />
      </div>
    );
  }

  if (variant === 'dots') {
    return (
      <div className={cn('flex space-x-1', className)}>
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            className="w-2 h-2 bg-primary-600 rounded-full"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              delay: index * 0.2,
            }}
          />
        ))}
      </div>
    );
  }

  if (variant === 'pulse') {
    return (
      <div className={containerClass}>
        <motion.div
          className="w-full h-full bg-primary-600 rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>
    );
  }

  if (variant === 'wave') {
    return (
      <div className={cn('flex items-end space-x-1', className)}>
        {[0, 1, 2, 3, 4].map((index) => (
          <motion.div
            key={index}
            className="w-1 bg-primary-600 rounded-full"
            animate={{
              height: ['8px', '24px', '8px'],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: index * 0.1,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>
    );
  }

  if (variant === 'gradient') {
    return (
      <div className={containerClass}>
        <motion.div
          className="w-full h-full rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
          animate={{ rotate: 360 }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'linear',
          }}
          style={{
            background: 'conic-gradient(from 0deg, #3b82f6, #8b5cf6, #ec4899, #3b82f6)',
          }}
        />
      </div>
    );
  }

  return null;
};


interface SkeletonProps {
  className?: string;
  lines?: number;
  avatar?: boolean;
}

export const PremiumSkeleton: React.FC<SkeletonProps> = ({
  className = '',
  lines = 3,
  avatar = false,
}) => {
  return (
    <div className={cn('animate-pulse', className)}>
      {avatar && (
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-full" />
          <div className="space-y-2 flex-1">
            <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded w-1/4" />
            <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded w-1/2" />
          </div>
        </div>
      )}
      
      <div className="space-y-3">
        {Array.from({ length: lines }).map((_, index) => (
          <motion.div
            key={index}
            className={cn(
              'h-4 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded',
              index === lines - 1 ? 'w-3/4' : 'w-full'
            )}
            animate={{
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: index * 0.1,
            }}
          />
        ))}
      </div>
    </div>
  );
};


interface LoadingOverlayProps {
  isLoading: boolean;
  children: React.ReactNode;
  message?: string;
  variant?: 'spinner' | 'dots' | 'pulse' | 'wave' | 'gradient';
}

export const PremiumLoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isLoading,
  children,
  message = 'Loading...',
  variant = 'gradient',
}) => {
  return (
    <div className="relative">
      {children}
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-50 rounded-lg"
        >
          <div className="text-center">
            <PremiumLoader variant={variant} size="lg" />
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-4 text-sm font-medium text-gray-600 dark:text-gray-400"
            >
              {message}
            </motion.p>
          </div>
        </motion.div>
      )}
    </div>
  );
};


interface ProgressBarProps {
  progress: number;
  className?: string;
  showPercentage?: boolean;
  animated?: boolean;
}

export const PremiumProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  className = '',
  showPercentage = true,
  animated = true,
}) => {
  return (
    <div className={cn('w-full', className)}>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Progress
        </span>
        {showPercentage && (
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {Math.round(progress)}%
          </span>
        )}
      </div>
      
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{
            duration: animated ? 0.5 : 0,
            ease: 'easeOut',
          }}
        />
      </div>
    </div>
  );
};
