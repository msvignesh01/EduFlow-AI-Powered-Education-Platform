
import { motion, HTMLMotionProps, SVGMotionProps, Variants } from 'framer-motion';
import { useReducedMotion } from '../../utils/accessibility';
import { premiumVariants, premiumTransitions } from '../../utils/premiumAnimations';

// Enhanced motion components that respect accessibility preferences
interface PremiumMotionProps extends HTMLMotionProps<'div'> {
  variant?: keyof typeof premiumVariants;
  reduceMotion?: boolean;
  children: React.ReactNode;
}

export const PremiumMotion: React.FC<PremiumMotionProps> = ({
  variant,
  reduceMotion,
  children,
  initial,
  animate,
  exit,
  variants,
  transition,
  ...props
}) => {
  const prefersReducedMotion = useReducedMotion();
  const shouldReduceMotion = reduceMotion ?? prefersReducedMotion;

  // Use selected variant or custom variants
  const motionVariants = variant ? premiumVariants[variant] : variants;

  // Simplified animations for reduced motion
  const reducedMotionVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.2 } },
  };

  return (
    <motion.div
      initial={shouldReduceMotion ? 'hidden' : initial || 'hidden'}
      animate={shouldReduceMotion ? 'visible' : animate || 'visible'}
      exit={shouldReduceMotion ? 'hidden' : exit}
      variants={shouldReduceMotion ? reducedMotionVariants : motionVariants}
      transition={shouldReduceMotion ? { duration: 0.2 } : transition}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Specialized motion components
export const FadeIn: React.FC<Omit<PremiumMotionProps, 'variant'>> = (props) => (
  <PremiumMotion variant="fadeIn" {...props} />
);

export const FadeInUp: React.FC<Omit<PremiumMotionProps, 'variant'>> = (props) => (
  <PremiumMotion variant="fadeInUp" {...props} />
);

export const FadeInDown: React.FC<Omit<PremiumMotionProps, 'variant'>> = (props) => (
  <PremiumMotion variant="fadeInDown" {...props} />
);

export const FadeInLeft: React.FC<Omit<PremiumMotionProps, 'variant'>> = (props) => (
  <PremiumMotion variant="fadeInLeft" {...props} />
);

export const FadeInRight: React.FC<Omit<PremiumMotionProps, 'variant'>> = (props) => (
  <PremiumMotion variant="fadeInRight" {...props} />
);

export const ScaleIn: React.FC<Omit<PremiumMotionProps, 'variant'>> = (props) => (
  <PremiumMotion variant="scaleIn" {...props} />
);

export const SlideInUp: React.FC<Omit<PremiumMotionProps, 'variant'>> = (props) => (
  <PremiumMotion variant="slideInUp" {...props} />
);

export const SlideInDown: React.FC<Omit<PremiumMotionProps, 'variant'>> = (props) => (
  <PremiumMotion variant="slideInDown" {...props} />
);

export const SlideInLeft: React.FC<Omit<PremiumMotionProps, 'variant'>> = (props) => (
  <PremiumMotion variant="slideInLeft" {...props} />
);

export const SlideInRight: React.FC<Omit<PremiumMotionProps, 'variant'>> = (props) => (
  <PremiumMotion variant="slideInRight" {...props} />
);

// Stagger container for animating lists
interface StaggerContainerProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  staggerDelay?: number;
  childDelay?: number;
}

export const StaggerContainer: React.FC<StaggerContainerProps> = ({
  children,
  staggerDelay = 0.1,
  childDelay = 0.1,
  ...props
}) => {
  const prefersReducedMotion = useReducedMotion();

  const staggerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : staggerDelay,
        delayChildren: prefersReducedMotion ? 0 : childDelay,
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={staggerVariants}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Stagger item for use within StaggerContainer
export const StaggerItem: React.FC<PremiumMotionProps> = ({
  children,
  ...props
}) => {
  const prefersReducedMotion = useReducedMotion();

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: prefersReducedMotion 
        ? { duration: 0.2 } 
        : premiumTransitions.spring,
    },
  };

  return (
    <motion.div variants={itemVariants} {...props}>
      {children}
    </motion.div>
  );
};

// Hover lift effect
interface HoverLiftProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  liftHeight?: number;
  scale?: number;
}

export const HoverLift: React.FC<HoverLiftProps> = ({
  children,
  liftHeight = 4,
  scale = 1.02,
  ...props
}) => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      whileHover={
        prefersReducedMotion
          ? {}
          : {
              y: -liftHeight,
              scale,
              transition: premiumTransitions.micro,
            }
      }
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Button press effect
interface ButtonPressProps extends HTMLMotionProps<'button'> {
  children: React.ReactNode;
  pressScale?: number;
}

export const ButtonPress: React.FC<ButtonPressProps> = ({
  children,
  pressScale = 0.95,
  ...props
}) => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.button
      whileTap={
        prefersReducedMotion
          ? {}
          : {
              scale: pressScale,
              transition: premiumTransitions.micro,
            }
      }
      {...props}
    >
      {children}
    </motion.button>
  );
};

// Pulse animation for loading states
interface PulseProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  pulseScale?: number;
  duration?: number;
}

export const Pulse: React.FC<PulseProps> = ({
  children,
  pulseScale = 1.05,
  duration = 2,
  ...props
}) => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      animate={
        prefersReducedMotion
          ? {}
          : {
              scale: [1, pulseScale, 1],
              transition: {
                duration,
                repeat: Infinity,
                ease: 'easeInOut',
              },
            }
      }
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Breathe animation for subtle attention
interface BreatheProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  scale?: number;
  opacity?: [number, number];
  duration?: number;
}

export const Breathe: React.FC<BreatheProps> = ({
  children,
  scale = 1.02,
  opacity = [0.8, 1],
  duration = 3,
  ...props
}) => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      animate={
        prefersReducedMotion
          ? {}
          : {
              scale: [1, scale, 1],
              opacity: [opacity[0], opacity[1], opacity[0]],
              transition: {
                duration,
                repeat: Infinity,
                ease: 'easeInOut',
              },
            }
      }
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Page transition wrapper
interface PageTransitionProps {
  children: React.ReactNode;
  direction?: 'left' | 'right' | 'fade';
}

export const PageTransition: React.FC<PageTransitionProps> = ({
  children,
  direction = 'fade',
}) => {
  const prefersReducedMotion = useReducedMotion();
  
  const getVariant = () => {
    if (prefersReducedMotion) return premiumVariants.fadeIn;
    
    switch (direction) {
      case 'left':
        return premiumVariants.pageSlideLeft;
      case 'right':
        return premiumVariants.pageSlideRight;
      default:
        return premiumVariants.pageFade;
    }
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={getVariant()}
    >
      {children}
    </motion.div>
  );
};
