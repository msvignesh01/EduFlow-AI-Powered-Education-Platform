
import { motion } from 'framer-motion';
import { useResponsive } from '../../hooks/useResponsive';
import { cn, responsive } from '../../utils/cn';

interface ResponsiveLayoutProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  padding?: boolean;
  center?: boolean;
}

export const ResponsiveLayout: React.FC<ResponsiveLayoutProps> = ({
  children,
  className = '',
  maxWidth = 'xl',
  padding = true,
  center = true,
}) => {
  const { isLaptop, isDesktop, isLargeDesktop, isUltraWide, is4K } = useResponsive();

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-4xl',
    xl: 'max-w-7xl',
    '2xl': 'max-w-screen-2xl',
    full: 'max-w-full',
  };

  return (
    <div
      className={cn(
        'w-full',
        center && 'mx-auto',
        maxWidthClasses[maxWidth],
        padding && responsive.container.default,
        className
      )}
    >
      {children}
    </div>
  );
};

// Grid layout component
interface ResponsiveGridProps {
  children: React.ReactNode;
  columns?: {
    xs?: number;
    mobile?: number;
    tablet?: number;
    desktop?: number;
    large?: number;
  };
  gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({
  children,
  columns = { xs: 1, mobile: 1, tablet: 2, desktop: 3, large: 4 },
  gap = 'md',
  className = '',
}) => {
  const { isLaptop, isDesktop, isLargeDesktop, isUltraWide, is4K } = useResponsive();

  const getGridCols = () => {
    if (is4K && columns.large) return `grid-cols-${columns.large}`;
    if (isUltraWide && columns.large) return `grid-cols-${columns.large}`;
    if (isLargeDesktop && columns.desktop) return `grid-cols-${columns.desktop}`;
    if (isDesktop && columns.desktop) return `grid-cols-${columns.desktop}`;
    if (isLaptop && columns.mobile) return `grid-cols-${columns.mobile}`;
    return `grid-cols-${columns.mobile || 2}`;
  };

  const gapClasses = {
    xs: 'gap-2 xl:gap-3 2xl:gap-4',
    sm: 'gap-4 xl:gap-5 2xl:gap-6',
    md: 'gap-6 xl:gap-8 2xl:gap-10',
    lg: 'gap-8 xl:gap-10 2xl:gap-12',
    xl: 'gap-10 xl:gap-12 2xl:gap-16',
  };

  return (
    <div
      className={cn(
        'grid',
        getGridCols(),
        gapClasses[gap],
        className
      )}
    >
      {children}
    </div>
  );
};

// Responsive stack component
interface ResponsiveStackProps {
  children: React.ReactNode;
  direction?: 'vertical' | 'horizontal' | 'responsive';
  spacing?: 'sm' | 'md' | 'lg' | 'xl';
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  className?: string;
}

export const ResponsiveStack: React.FC<ResponsiveStackProps> = ({
  children,
  direction = 'vertical',
  spacing = 'md',
  align = 'stretch',
  justify = 'start',
  className = '',
}) => {
  // Desktop-only layout - no mobile responsiveness needed

  const directionClasses = {
    vertical: 'flex flex-col',
    horizontal: 'flex flex-row',
    responsive: 'flex flex-row', // Always horizontal on desktop
  };

  const spacingClasses = {
    sm: direction === 'vertical' ? 'space-y-2' : 'space-x-2',
    md: direction === 'vertical' ? 'space-y-4' : 'space-x-4',
    lg: direction === 'vertical' ? 'space-y-6' : 'space-x-6',
    xl: direction === 'vertical' ? 'space-y-8' : 'space-x-8',
  };

  const alignClasses = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch',
  };

  const justifyClasses = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around',
    evenly: 'justify-evenly',
  };

  return (
    <div
      className={cn(
        directionClasses[direction],
        spacingClasses[spacing],
        alignClasses[align],
        justifyClasses[justify],
        className
      )}
    >
      {children}
    </div>
  );
};

// Responsive text component
interface ResponsiveTextProps {
  children: React.ReactNode;
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | 'hero';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  color?: 'primary' | 'secondary' | 'muted' | 'accent';
  align?: 'left' | 'center' | 'right' | 'justify';
  className?: string;
  as?: 'p' | 'span' | 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

export const ResponsiveText: React.FC<ResponsiveTextProps> = ({
  children,
  size = 'base',
  weight = 'normal',
  color = 'primary',
  align = 'left',
  className = '',
  as: Component = 'p',
}) => {
  const weightClasses = {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
  };

  const colorClasses = {
    primary: 'text-gray-900 dark:text-white',
    secondary: 'text-gray-600 dark:text-gray-400',
    muted: 'text-gray-500 dark:text-gray-500',
    accent: 'text-blue-600 dark:text-blue-400',
  };

  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
    justify: 'text-justify',
  };

  return (
    <Component
      className={cn(
        responsive.text[size],
        weightClasses[weight],
        colorClasses[color],
        alignClasses[align],
        className
      )}
    >
      {children}
    </Component>
  );
};

// Responsive section component
interface ResponsiveSectionProps {
  children: React.ReactNode;
  spacing?: 'tight' | 'normal' | 'loose';
  background?: 'transparent' | 'primary' | 'secondary' | 'accent';
  className?: string;
}

export const ResponsiveSection: React.FC<ResponsiveSectionProps> = ({
  children,
  spacing = 'normal',
  background = 'transparent',
  className = '',
}) => {
  const spacingClasses = {
    tight: responsive.spacing.tight,
    normal: responsive.spacing.section,
    loose: responsive.spacing.loose,
  };

  const backgroundClasses = {
    transparent: 'bg-transparent',
    primary: 'bg-white dark:bg-gray-900',
    secondary: 'bg-gray-50 dark:bg-gray-800',
    accent: 'bg-blue-50 dark:bg-blue-900/20',
  };

  return (
    <section
      className={cn(
        spacingClasses[spacing],
        backgroundClasses[background],
        className
      )}
    >
      {children}
    </section>
  );
};

// Responsive container with motion
interface MotionContainerProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  stagger?: boolean;
}

export const MotionContainer: React.FC<MotionContainerProps> = ({
  children,
  className = '',
  delay = 0,
  stagger = false,
}) => {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay,
        ...(stagger && {
          staggerChildren: 0.1,
          delayChildren: 0.2,
        }),
      }}
    >
      {children}
    </motion.div>
  );
};
