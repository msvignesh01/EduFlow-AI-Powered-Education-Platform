import { useState, useEffect } from 'react';

// Desktop-focused breakpoint definitions for premium SaaS
export const breakpoints = {
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
  '3xl': 1920,
  '4xl': 2560,
} as const;

export type Breakpoint = keyof typeof breakpoints;

interface ResponsiveState {
  width: number;
  height: number;
  isLaptop: boolean;
  isDesktop: boolean;
  isLargeDesktop: boolean;
  isUltraWide: boolean;
  is4K: boolean;
  currentBreakpoint: Breakpoint;
}

export const useResponsive = (): ResponsiveState => {
  const [state, setState] = useState<ResponsiveState>(() => {
    if (typeof window === 'undefined') {
      return {
        width: 1280,
        height: 800,
        isLaptop: false,
        isDesktop: true,
        isLargeDesktop: false,
        isUltraWide: false,
        is4K: false,
        currentBreakpoint: 'xl' as const,
      };
    }

    const width = window.innerWidth;
    const height = window.innerHeight;
    const currentBreakpoint = getCurrentBreakpoint(width);

    return {
      width,
      height,
      isLaptop: width >= breakpoints.lg && width < breakpoints.xl,
      isDesktop: width >= breakpoints.xl && width < breakpoints['2xl'],
      isLargeDesktop: width >= breakpoints['2xl'] && width < breakpoints['3xl'],
      isUltraWide: width >= breakpoints['3xl'] && width < breakpoints['4xl'],
      is4K: width >= breakpoints['4xl'],
      currentBreakpoint,
    };
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const currentBreakpoint = getCurrentBreakpoint(width);

      setState({
        width,
        height,
        isLaptop: width >= breakpoints.lg && width < breakpoints.xl,
        isDesktop: width >= breakpoints.xl && width < breakpoints['2xl'],
        isLargeDesktop: width >= breakpoints['2xl'] && width < breakpoints['3xl'],
        isUltraWide: width >= breakpoints['3xl'] && width < breakpoints['4xl'],
        is4K: width >= breakpoints['4xl'],
        currentBreakpoint,
      });
    };

    // Use passive listeners for better performance
    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return state;
};

const getCurrentBreakpoint = (width: number): Breakpoint => {
  if (width >= breakpoints['4xl']) return '4xl';
  if (width >= breakpoints['3xl']) return '3xl';
  if (width >= breakpoints['2xl']) return '2xl';
  if (width >= breakpoints.xl) return 'xl';
  return 'lg';
};

// Hook for specific breakpoint checks
export const useBreakpoint = (breakpoint: Breakpoint): boolean => {
  const { width } = useResponsive();
  return width >= breakpoints[breakpoint];
};

// Hook for media queries
export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const media = window.matchMedia(query);
    setMatches(media.matches);

    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [query]);

  return matches;
};

// Responsive value hook - returns different values based on breakpoint
export const useResponsiveValue = <T>(values: {
  xs?: T;
  sm?: T;
  md?: T;
  lg?: T;
  xl?: T;
  '2xl'?: T;
}): T | undefined => {
  const { currentBreakpoint } = useResponsive();
  
  // Return the value for current breakpoint or fall back to smaller ones
  if (currentBreakpoint === '2xl' && values['2xl']) return values['2xl'];
  if ((currentBreakpoint === '2xl' || currentBreakpoint === 'xl') && values.xl) return values.xl;
  if ((currentBreakpoint === '2xl' || currentBreakpoint === 'xl' || currentBreakpoint === 'lg') && values.lg) return values.lg;
  if ((currentBreakpoint === '2xl' || currentBreakpoint === 'xl' || currentBreakpoint === 'lg' || currentBreakpoint === 'md') && values.md) return values.md;
  if ((currentBreakpoint === '2xl' || currentBreakpoint === 'xl' || currentBreakpoint === 'lg' || currentBreakpoint === 'md' || currentBreakpoint === 'sm') && values.sm) return values.sm;
  return values.xs;
};

// Desktop-focused responsive columns hook
export const useResponsiveColumns = (
  laptop: number = 2,
  desktop: number = 3,
  largeDesktop: number = 4,
  ultraWide: number = 6
): number => {
  const { isLaptop, isDesktop, isLargeDesktop, isUltraWide, is4K } = useResponsive();

  if (is4K) return ultraWide;
  if (isUltraWide) return ultraWide;
  if (isLargeDesktop) return largeDesktop;
  if (isDesktop) return desktop;
  return laptop;
};

// Removed touch device detection - desktop-only platform
