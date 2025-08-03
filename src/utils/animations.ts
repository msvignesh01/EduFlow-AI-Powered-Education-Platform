import { Variants, Transition } from 'framer-motion';

// Premium easing curves for natural motion
export const easings = {
  // Apple-inspired easing
  apple: [0.25, 0.1, 0.25, 1],
  // Google Material Design easing
  material: [0.4, 0, 0.2, 1],
  // Smooth and natural
  smooth: [0.25, 0.46, 0.45, 0.94],
  // Bouncy but controlled
  bounce: [0.68, -0.55, 0.265, 1.55],
  // Sharp and snappy
  sharp: [0.4, 0, 0.2, 1],
  // Gentle and organic
  gentle: [0.25, 0.46, 0.45, 0.94],
  // Dramatic entrance
  dramatic: [0.175, 0.885, 0.32, 1.275],
  // Subtle and refined
  subtle: [0.645, 0.045, 0.355, 1],
  // Elastic effect
  elastic: [0.68, -0.55, 0.265, 1.55],
} as const;

// Premium spring configurations
export const springs = {
  // Gentle spring for UI elements
  gentle: {
    type: 'spring' as const,
    stiffness: 300,
    damping: 30,
    mass: 1,
  },
  // Bouncy spring for playful interactions
  bouncy: {
    type: 'spring' as const,
    stiffness: 400,
    damping: 25,
    mass: 0.8,
  },
  // Snappy spring for quick feedback
  snappy: {
    type: 'spring' as const,
    stiffness: 500,
    damping: 35,
    mass: 0.6,
  },
  // Smooth spring for large elements
  smooth: {
    type: 'spring' as const,
    stiffness: 200,
    damping: 40,
    mass: 1.2,
  },
  // Wobbly spring for attention-grabbing
  wobbly: {
    type: 'spring' as const,
    stiffness: 180,
    damping: 12,
    mass: 1,
  },
  // Ultra smooth for premium feel
  premium: {
    type: 'spring' as const,
    stiffness: 260,
    damping: 20,
    mass: 1,
  },
} as const;

// Premium transition presets
export const transitions = {
  // Ultra fast for micro-interactions
  micro: {
    duration: 0.1,
    ease: easings.sharp,
  },
  // Fast and smooth for micro-interactions
  fast: {
    duration: 0.15,
    ease: easings.sharp,
  },
  // Standard for most UI animations
  standard: {
    duration: 0.3,
    ease: easings.smooth,
  },
  // Slow and dramatic for page transitions
  dramatic: {
    duration: 0.6,
    ease: easings.dramatic,
  },
  // Gentle for subtle state changes
  gentle: {
    duration: 0.4,
    ease: easings.gentle,
  },
  // Bounce for playful interactions
  bounce: springs.bouncy,
  // Smooth spring for natural motion
  spring: springs.gentle,
  // Premium spring for high-end feel
  premium: springs.premium,
} as const;

// Premium animation variants
export const variants = {
  // Enhanced fade animations
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: transitions.standard,
    },
  } as Variants,

  fadeInUp: {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: transitions.spring,
    },
  } as Variants,

  fadeInDown: {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: transitions.spring,
    },
  } as Variants,

  fadeInLeft: {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: transitions.spring,
    },
  } as Variants,

  fadeInRight: {
    hidden: { opacity: 0, x: 20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: transitions.spring,
    },
  } as Variants,

  // Enhanced scale animations
  scaleIn: {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: transitions.bounce,
    },
  } as Variants,

  scaleInCenter: {
    hidden: { opacity: 0, scale: 0 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: transitions.bounce,
    },
  } as Variants,

  // Premium slide animations
  slideInUp: {
    hidden: { y: '100%', opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: transitions.premium,
    },
  } as Variants,

  slideInDown: {
    hidden: { y: '-100%', opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: transitions.premium,
    },
  } as Variants,

  slideInLeft: {
    hidden: { x: '-100%', opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: transitions.premium,
    },
  } as Variants,

  slideInRight: {
    hidden: { x: '100%', opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: transitions.premium,
    },
  } as Variants,

  // Enhanced stagger animations
  staggerContainer: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  } as Variants,

  staggerItem: {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: transitions.premium,
    },
  } as Variants,

  // Premium hover animations
  hoverLift: {
    rest: { y: 0, scale: 1 },
    hover: { 
      y: -4, 
      scale: 1.02,
      transition: transitions.fast,
    },
  } as Variants,

  hoverScale: {
    rest: { scale: 1 },
    hover: { 
      scale: 1.05,
      transition: transitions.fast,
    },
  } as Variants,

  hoverGlow: {
    rest: { 
      boxShadow: '0 0 0 rgba(59, 130, 246, 0)',
    },
    hover: { 
      boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)',
      transition: transitions.standard,
    },
  } as Variants,

  // Enhanced button press animations
  buttonPress: {
    rest: { scale: 1 },
    pressed: { 
      scale: 0.95,
      transition: transitions.micro,
    },
  } as Variants,

  // Premium loading animations
  pulse: {
    animate: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: easings.gentle,
      },
    },
  } as Variants,

  breathe: {
    animate: {
      scale: [1, 1.02, 1],
      opacity: [0.8, 1, 0.8],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: easings.gentle,
      },
    },
  } as Variants,

  // Premium attention-grabbing animations
  shake: {
    animate: {
      x: [0, -2, 2, -2, 2, 0],
      transition: {
        duration: 0.5,
        ease: easings.sharp,
      },
    },
  } as Variants,

  bounce: {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 0.6,
        repeat: Infinity,
        ease: easings.bounce,
      },
    },
  } as Variants,

  // Premium page transition animations
  pageSlideLeft: {
    initial: { x: '100%', opacity: 0 },
    animate: { 
      x: 0, 
      opacity: 1,
      transition: transitions.dramatic,
    },
    exit: { 
      x: '-100%', 
      opacity: 0,
      transition: transitions.dramatic,
    },
  } as Variants,

  pageSlideRight: {
    initial: { x: '-100%', opacity: 0 },
    animate: { 
      x: 0, 
      opacity: 1,
      transition: transitions.dramatic,
    },
    exit: { 
      x: '100%', 
      opacity: 0,
      transition: transitions.dramatic,
    },
  } as Variants,

  pageFade: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { 
      opacity: 1, 
      scale: 1,
      transition: transitions.gentle,
    },
    exit: { 
      opacity: 0, 
      scale: 1.05,
      transition: transitions.gentle,
    },
  } as Variants,
} as const;

// Performance-optimized animation settings
export const performanceSettings = {
  // Use transform and opacity for best performance
  optimized: {
    layout: false,
    layoutId: undefined,
    style: {
      willChange: 'transform, opacity',
    },
  },
  // For complex animations that need layout
  complex: {
    layout: true,
    style: {
      willChange: 'transform, opacity, width, height',
    },
  },
} as const;

// Utility functions
export const createStaggerVariants = (
  staggerDelay: number = 0.1,
  childDelay: number = 0.1
): Variants => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: staggerDelay,
      delayChildren: childDelay,
    },
  },
});

export const createSpringVariants = (
  from: Record<string, any>,
  to: Record<string, any>,
  springConfig: Transition = springs.gentle
): Variants => ({
  hidden: from,
  visible: {
    ...to,
    transition: springConfig,
  },
});
