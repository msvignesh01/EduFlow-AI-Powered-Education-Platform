import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Premium glass effect utility
export const glassEffect = {
  light: 'bg-white/10 backdrop-blur-md border border-white/20',
  dark: 'bg-black/10 backdrop-blur-md border border-white/10',
  blue: 'bg-blue-500/10 backdrop-blur-md border border-blue-500/20',
  purple: 'bg-purple-500/10 backdrop-blur-md border border-purple-500/20',
  emerald: 'bg-emerald-500/10 backdrop-blur-md border border-emerald-500/20',
};

// Premium gradient utilities
export const gradients = {
  primary: 'bg-gradient-to-r from-blue-600 to-blue-700',
  secondary: 'bg-gradient-to-r from-purple-600 to-purple-700',
  accent: 'bg-gradient-to-r from-emerald-600 to-emerald-700',
  premium: 'bg-gradient-premium',
  glass: 'bg-gradient-glass',
  mesh: 'bg-gradient-mesh',
};

// Premium shadow utilities
export const shadows = {
  glass: 'shadow-glass',
  premium: 'shadow-premium',
  glow: {
    blue: 'shadow-glow-blue',
    purple: 'shadow-glow-purple',
    emerald: 'shadow-glow-emerald',
  },
};

// Animation utilities
export const animations = {
  fadeIn: 'animate-fade-in',
  slideUp: 'animate-slide-up',
  slideDown: 'animate-slide-down',
  slideLeft: 'animate-slide-left',
  slideRight: 'animate-slide-right',
  scaleIn: 'animate-scale-in',
  float: 'animate-float',
  glow: 'animate-glow',
  shimmer: 'animate-shimmer',
  pulse: 'animate-pulse-slow',
  bounce: 'animate-bounce-slow',
};

// Desktop-first responsive utilities for premium SaaS experience
export const responsive = {
  // Container variants optimized for desktop screens (1024px+)
  container: {
    default: 'max-w-7xl mx-auto px-8 xl:px-12 2xl:px-16',
    narrow: 'max-w-5xl mx-auto px-8 xl:px-12 2xl:px-16',
    wide: 'max-w-full mx-auto px-8 xl:px-12 2xl:px-16 3xl:px-20',
    fluid: 'w-full px-8 xl:px-12 2xl:px-16',
    modal: 'w-full max-w-2xl xl:max-w-3xl 2xl:max-w-4xl mx-auto px-8',
  },

  // Desktop-optimized grid system for professional layouts
  grid: {
    cols1: 'grid grid-cols-1',
    cols2: 'grid grid-cols-2',
    cols3: 'grid grid-cols-3',
    cols4: 'grid grid-cols-4',
    cols5: 'grid grid-cols-5',
    cols6: 'grid grid-cols-6',
    auto: 'grid grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 3xl:grid-cols-8',
    responsive: 'grid grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5',
    stats: 'grid grid-cols-4 xl:grid-cols-4 2xl:grid-cols-6',
    // Removed demo grid - no longer needed
    dashboard: 'grid grid-cols-12 gap-6 xl:gap-8 2xl:gap-10',
  },

  // Flexible layouts
  flex: {
    center: 'flex items-center justify-center',
    between: 'flex items-center justify-between',
    start: 'flex items-center justify-start',
    end: 'flex items-center justify-end',
    col: 'flex flex-col',
    colCenter: 'flex flex-col items-center justify-center',
    colBetween: 'flex flex-col justify-between',
    wrap: 'flex flex-wrap',
    nowrap: 'flex flex-nowrap',
    responsive: 'flex flex-col md:flex-row md:items-center md:justify-between',
  },

  // Professional spacing system for desktop SaaS applications
  spacing: {
    section: 'py-12 xl:py-16 2xl:py-20',
    component: 'p-6 xl:p-8 2xl:p-10',
    tight: 'p-4 xl:p-5 2xl:p-6',
    loose: 'p-8 xl:p-12 2xl:p-16',
    card: 'p-6 xl:p-8 2xl:p-10',
    sidebar: 'p-6 xl:p-8 2xl:p-10',
    header: 'px-8 py-4 xl:px-12 xl:py-6 2xl:px-16 2xl:py-8',
    gap: {
      xs: 'gap-2 xl:gap-3 2xl:gap-4',
      sm: 'gap-4 xl:gap-5 2xl:gap-6',
      md: 'gap-6 xl:gap-8 2xl:gap-10',
      lg: 'gap-8 xl:gap-10 2xl:gap-12',
      xl: 'gap-10 xl:gap-12 2xl:gap-16',
    },
  },

  // Professional typography for desktop SaaS applications
  text: {
    xs: 'text-xs xl:text-sm 2xl:text-sm',
    sm: 'text-sm xl:text-base 2xl:text-base',
    base: 'text-base xl:text-lg 2xl:text-lg',
    lg: 'text-lg xl:text-xl 2xl:text-2xl',
    xl: 'text-xl xl:text-2xl 2xl:text-3xl',
    '2xl': 'text-2xl xl:text-3xl 2xl:text-4xl',
    '3xl': 'text-3xl xl:text-4xl 2xl:text-5xl',
    '4xl': 'text-4xl xl:text-5xl 2xl:text-6xl',
    hero: 'text-4xl xl:text-5xl 2xl:text-6xl 3xl:text-7xl',
    display: 'text-5xl xl:text-6xl 2xl:text-7xl 3xl:text-8xl',
  },

  // Desktop-optimized component sizing for professional interfaces
  desktop: {
    button: {
      sm: 'h-9 xl:h-10 2xl:h-11 px-4 xl:px-5 2xl:px-6',
      md: 'h-10 xl:h-11 2xl:h-12 px-6 xl:px-7 2xl:px-8',
      lg: 'h-12 xl:h-13 2xl:h-14 px-8 xl:px-10 2xl:px-12',
    },
    input: 'h-10 xl:h-11 2xl:h-12 px-4 xl:px-5 2xl:px-6',
    icon: {
      sm: 'w-4 h-4 xl:w-5 xl:h-5 2xl:w-5 2xl:h-5',
      md: 'w-5 h-5 xl:w-6 xl:h-6 2xl:w-6 2xl:h-6',
      lg: 'w-6 h-6 xl:w-7 xl:h-7 2xl:w-8 2xl:h-8',
    },
    sidebar: {
      width: 'w-64 xl:w-72 2xl:w-80',
      collapsed: 'w-16 xl:w-18 2xl:w-20',
    },
  },

  // Hide/show utilities
  visibility: {
    mobileOnly: 'block md:hidden',
    tabletOnly: 'hidden md:block lg:hidden',
    desktopOnly: 'hidden lg:block',
    mobileUp: 'block',
    tabletUp: 'hidden md:block',
    desktopUp: 'hidden lg:block',
  },
};

// Theme-aware utilities
export const themeAware = {
  bg: {
    primary: 'bg-white dark:bg-gray-900',
    secondary: 'bg-gray-50 dark:bg-gray-800',
    card: 'bg-white dark:bg-gray-800',
    glass: 'bg-white/10 dark:bg-black/10 backdrop-blur-md',
  },
  text: {
    primary: 'text-gray-900 dark:text-white',
    secondary: 'text-gray-600 dark:text-gray-400',
    muted: 'text-gray-500 dark:text-gray-500',
  },
  border: {
    primary: 'border-gray-200 dark:border-gray-700',
    secondary: 'border-gray-300 dark:border-gray-600',
    glass: 'border-white/20 dark:border-white/10',
  },
};
