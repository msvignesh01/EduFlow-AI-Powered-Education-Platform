
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '../../utils/cn';

interface CardProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'glass' | 'gradient' | 'elevated' | 'outlined';
  hover?: boolean;
  glow?: boolean;
  hasShadow?: boolean; // For backward compatibility
  border?: boolean; // For backward compatibility
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  padding = 'md',
  variant = 'default',
  hover = true,
  glow = false,
  hasShadow = true,
  border = false,
  ...props
}) => {
  const paddingClasses = {
    none: 'p-0',
    sm: 'p-3',
    md: 'p-5',
    lg: 'p-8',
    xl: 'p-10',
  };

  // Handle legacy props
  const effectiveVariant = border ? 'outlined' : variant;

  const variantClasses = {
    default: cn(
      'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700',
      hasShadow && 'shadow-lg hover:shadow-xl transition-all duration-300'
    ),
    glass: cn(
      'bg-white/10 dark:bg-black/10 backdrop-blur-md border border-white/20 dark:border-white/10',
      'shadow-glass hover:shadow-glass-dark transition-all duration-300'
    ),
    gradient: cn(
      'bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900',
      'border border-gray-200 dark:border-gray-700 shadow-premium',
      'hover:shadow-2xl transition-all duration-300'
    ),
    elevated: cn(
      'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700',
      'shadow-2xl hover:shadow-premium transition-all duration-300',
      'ring-1 ring-gray-900/5 dark:ring-white/10'
    ),
    outlined: cn(
      'bg-transparent border-2 border-gray-300 dark:border-gray-600',
      'hover:border-primary-500 dark:hover:border-primary-400 transition-all duration-300'
    ),
  };

  return (
    <motion.div
      className={cn(
        'rounded-xl overflow-hidden',
        variantClasses[effectiveVariant],
        paddingClasses[padding],
        hover && 'hover:-translate-y-1',
        glow && 'hover:shadow-glow-blue',
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={hover ? { y: -4 } : {}}
      {...props}
    >
      {children}
    </motion.div>
  );
};

interface CardHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
  gradient?: boolean;
}

export const CardHeader: React.FC<CardHeaderProps> = ({
  title,
  subtitle,
  action,
  icon,
  gradient = false,
  className = '',
}) => {
  return (
    <motion.div
      className={cn('flex items-start justify-between mb-6', className)}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <div className="flex items-start space-x-3">
        {icon && (
          <motion.div
            className="flex-shrink-0 mt-1"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            {icon}
          </motion.div>
        )}
        <div>
          <motion.h3
            className={cn(
              'text-xl font-bold',
              gradient
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'
                : 'text-gray-900 dark:text-white'
            )}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.15 }}
          >
            {title}
          </motion.h3>
          {subtitle && (
            <motion.p
              className="text-sm text-gray-600 dark:text-gray-400 mt-1"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              {subtitle}
            </motion.p>
          )}
        </div>
      </div>
      {action && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.25 }}
        >
          {action}
        </motion.div>
      )}
    </motion.div>
  );
};

interface CardContentProps {
  className?: string;
  children: React.ReactNode;
}

export const CardContent: React.FC<CardContentProps> = ({
  className = '',
  children,
}) => {
  return <div className={className}>{children}</div>;
};

interface CardFooterProps {
  className?: string;
  children: React.ReactNode;
}

export const CardFooter: React.FC<CardFooterProps> = ({
  className = '',
  children,
}) => {
  return (
    <div className={`mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 ${className}`}>
      {children}
    </div>
  );
};

// Add these type exports for compatibility
export const CardTitle = CardHeader;
export const CardDescription = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <p className={`text-sm text-gray-600 dark:text-gray-400 ${className}`}>{children}</p>
);
