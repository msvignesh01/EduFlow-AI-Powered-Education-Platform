import { Variants, Transition } from 'framer-motion';

// Premium easing curves for natural motion
export const premiumEasing = {
  // Smooth and natural easing
  smooth: [0.25, 0.1, 0.25, 1],
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
} as const;

// Premium spring configurations
export const premiumSprings = {
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
} as const;

// Premium transition presets
export const premiumTransitions = {
  // Fast and smooth for micro-interactions
  micro: {
    duration: 0.15,
    ease: premiumEasing.sharp,
  },
  // Standard for most UI animations
  standard: {
    duration: 0.3,
    ease: premiumEasing.smooth,
  },
  // Slow and dramatic for page transitions
  dramatic: {
    duration: 0.6,
    ease: premiumEasing.dramatic,
  },
  // Gentle for subtle state changes
  gentle: {
    duration: 0.4,
    ease: premiumEasing.gentle,
  },
  // Bounce for playful interactions
  bounce: premiumSprings.bouncy,
  // Smooth spring for natural motion
  spring: premiumSprings.gentle,
} as const;

// Premium animation variants
export const premiumVariants = {
  // Fade animations
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: premiumTransitions.standard,
    },
  } as Variants,

  fadeInUp: {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: premiumTransitions.spring,
    },
  } as Variants,

  fadeInDown: {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: premiumTransitions.spring,
    },
  } as Variants,

  fadeInLeft: {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: premiumTransitions.spring,
    },
  } as Variants,

  fadeInRight: {
    hidden: { opacity: 0, x: 20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: premiumTransitions.spring,
    },
  } as Variants,

  // Scale animations
  scaleIn: {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: premiumTransitions.bounce,
    },
  } as Variants,

  scaleInCenter: {
    hidden: { opacity: 0, scale: 0 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: premiumTransitions.bounce,
    },
  } as Variants,

  // Slide animations
  slideInUp: {
    hidden: { y: '100%', opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: premiumTransitions.spring,
    },
  } as Variants,

  slideInDown: {
    hidden: { y: '-100%', opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: premiumTransitions.spring,
    },
  } as Variants,

  slideInLeft: {
    hidden: { x: '-100%', opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: premiumTransitions.spring,
    },
  } as Variants,

  slideInRight: {
    hidden: { x: '100%', opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: premiumTransitions.spring,
    },
  } as Variants,

  // Stagger animations for lists
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
      transition: premiumTransitions.spring,
    },
  } as Variants,

  // Hover animations
  hoverLift: {
    rest: { y: 0, scale: 1 },
    hover: { 
      y: -4, 
      scale: 1.02,
      transition: premiumTransitions.micro,
    },
  } as Variants,

  hoverScale: {
    rest: { scale: 1 },
    hover: { 
      scale: 1.05,
      transition: premiumTransitions.micro,
    },
  } as Variants,

  hoverGlow: {
    rest: { 
      boxShadow: '0 0 0 rgba(59, 130, 246, 0)',
    },
    hover: { 
      boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)',
      transition: premiumTransitions.standard,
    },
  } as Variants,

  // Button press animations
  buttonPress: {
    rest: { scale: 1 },
    pressed: { 
      scale: 0.95,
      transition: premiumTransitions.micro,
    },
  } as Variants,

  // Loading animations
  pulse: {
    animate: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: premiumEasing.gentle,
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
        ease: premiumEasing.gentle,
      },
    },
  } as Variants,

  // Attention-grabbing animations
  shake: {
    animate: {
      x: [0, -2, 2, -2, 2, 0],
      transition: {
        duration: 0.5,
        ease: premiumEasing.sharp,
      },
    },
  } as Variants,

  bounce: {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 0.6,
        repeat: Infinity,
        ease: premiumEasing.bounce,
      },
    },
  } as Variants,

  // Page transition animations
  pageSlideLeft: {
    initial: { x: '100%', opacity: 0 },
    animate: { 
      x: 0, 
      opacity: 1,
      transition: premiumTransitions.dramatic,
    },
    exit: { 
      x: '-100%', 
      opacity: 0,
      transition: premiumTransitions.dramatic,
    },
  } as Variants,

  pageSlideRight: {
    initial: { x: '-100%', opacity: 0 },
    animate: { 
      x: 0, 
      opacity: 1,
      transition: premiumTransitions.dramatic,
    },
    exit: { 
      x: '100%', 
      opacity: 0,
      transition: premiumTransitions.dramatic,
    },
  } as Variants,

  pageFade: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { 
      opacity: 1, 
      scale: 1,
      transition: premiumTransitions.gentle,
    },
    exit: { 
      opacity: 0, 
      scale: 1.05,
      transition: premiumTransitions.gentle,
    },
  } as Variants,
} as const;

// Utility function to create custom stagger animations
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

// Utility function to create custom spring animations
export const createSpringVariants = (
  from: Record<string, any>,
  to: Record<string, any>,
  springConfig: Transition = premiumSprings.gentle
): Variants => ({
  hidden: from,
  visible: {
    ...to,
    transition: springConfig,
  },
});

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
