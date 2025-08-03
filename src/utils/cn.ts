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
  // Container variants optimized for better space utilization
  container: {
    default: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
    narrow: 'max-w-5xl mx-auto px-4 sm:px-6 lg:px-8',
    wide: 'max-w-full mx-auto px-4 sm:px-6 lg:px-8',
    fluid: 'w-full px-4 sm:px-6 lg:px-8',
    modal: 'w-full max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto px-4 sm:px-6',
  },

  // Better responsive grid system for full space utilization
  grid: {
    cols1: 'grid grid-cols-1',
    cols2: 'grid grid-cols-1 sm:grid-cols-2',
    cols3: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    cols4: 'grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4',
    cols5: 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5',
    cols6: 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6',
    auto: 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6',
    responsive: 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4',
    stats: 'grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4',
    dashboard: 'grid grid-cols-12 gap-4 lg:gap-6',
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

  // Better spacing system for responsive layouts
  spacing: {
    section: 'py-8 lg:py-12',
    component: 'p-4 lg:p-6',
    tight: 'p-3 lg:p-4',
    loose: 'p-6 lg:p-8',
    card: 'p-4 lg:p-6',
    sidebar: 'p-4 lg:p-6',
    header: 'px-4 py-3 sm:px-6 lg:px-8',
    gap: {
      xs: 'gap-2 lg:gap-3',
      sm: 'gap-3 lg:gap-4',
      md: 'gap-4 lg:gap-6',
      lg: 'gap-6 lg:gap-8',
      xl: 'gap-8 lg:gap-10',
    },
  },

  // Better responsive typography
  text: {
    xs: 'text-xs lg:text-sm',
    sm: 'text-sm lg:text-base',
    base: 'text-base lg:text-lg',
    lg: 'text-lg lg:text-xl',
    xl: 'text-xl lg:text-2xl',
    '2xl': 'text-2xl lg:text-3xl',
    '3xl': 'text-3xl lg:text-4xl',
    '4xl': 'text-4xl lg:text-5xl',
    hero: 'text-4xl lg:text-5xl xl:text-6xl',
    display: 'text-5xl lg:text-6xl xl:text-7xl',
  },

  // Better component sizing for responsive interfaces
  desktop: {
    button: {
      sm: 'h-9 lg:h-10 px-4 lg:px-5',
      md: 'h-10 lg:h-11 px-6 lg:px-7',
      lg: 'h-12 lg:h-13 px-8 lg:px-10',
    },
    input: 'h-10 lg:h-11 px-4 lg:px-5',
    icon: {
      sm: 'w-4 h-4 lg:w-5 lg:h-5',
      md: 'w-5 h-5 lg:w-6 lg:h-6',
      lg: 'w-6 h-6 lg:w-7 lg:h-7',
    },
    sidebar: {
      width: 'w-56 lg:w-64 xl:w-72',
      collapsed: 'w-16 lg:w-18',
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
