import { Variants, Transition } from 'framer-motion';


export const easings = {

  apple: [0.25, 0.1, 0.25, 1],

  material: [0.4, 0, 0.2, 1],

  smooth: [0.25, 0.46, 0.45, 0.94],

  bounce: [0.68, -0.55, 0.265, 1.55],

  sharp: [0.4, 0, 0.2, 1],

  gentle: [0.25, 0.46, 0.45, 0.94],

  dramatic: [0.175, 0.885, 0.32, 1.275],

  subtle: [0.645, 0.045, 0.355, 1],

  elastic: [0.68, -0.55, 0.265, 1.55],
} as const;


export const springs = {

  gentle: {
    type: 'spring' as const,
    stiffness: 300,
    damping: 30,
    mass: 1,
  },

  bouncy: {
    type: 'spring' as const,
    stiffness: 400,
    damping: 25,
    mass: 0.8,
  },

  snappy: {
    type: 'spring' as const,
    stiffness: 500,
    damping: 35,
    mass: 0.6,
  },

  smooth: {
    type: 'spring' as const,
    stiffness: 200,
    damping: 40,
    mass: 1.2,
  },

  wobbly: {
    type: 'spring' as const,
    stiffness: 180,
    damping: 12,
    mass: 1,
  },

  premium: {
    type: 'spring' as const,
    stiffness: 260,
    damping: 20,
    mass: 1,
  },
} as const;


export const transitions = {

  micro: {
    duration: 0.1,
    ease: easings.sharp,
  },

  fast: {
    duration: 0.15,
    ease: easings.sharp,
  },

  standard: {
    duration: 0.3,
    ease: easings.smooth,
  },

  dramatic: {
    duration: 0.6,
    ease: easings.dramatic,
  },

  gentle: {
    duration: 0.4,
    ease: easings.gentle,
  },

  bounce: springs.bouncy,

  spring: springs.gentle,

  premium: springs.premium,
} as const;


export const variants = {

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


  buttonPress: {
    rest: { scale: 1 },
    pressed: { 
      scale: 0.95,
      transition: transitions.micro,
    },
  } as Variants,


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


export const performanceSettings = {

  optimized: {
    layout: false,
    layoutId: undefined,
    style: {
      willChange: 'transform, opacity',
    },
  },

  complex: {
    layout: true,
    style: {
      willChange: 'transform, opacity, width, height',
    },
  },
} as const;


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
