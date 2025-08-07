
import { motion, AnimatePresence, Variants } from 'framer-motion';


export const fadeInUp: Variants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3,
    },
  },
};

export const fadeInDown: Variants = {
  initial: {
    opacity: 0,
    y: -20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
  exit: {
    opacity: 0,
    y: 20,
    transition: {
      duration: 0.3,
    },
  },
};

export const fadeInLeft: Variants = {
  initial: {
    opacity: 0,
    x: -20,
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
  exit: {
    opacity: 0,
    x: 20,
    transition: {
      duration: 0.3,
    },
  },
};

export const fadeInRight: Variants = {
  initial: {
    opacity: 0,
    x: 20,
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
  exit: {
    opacity: 0,
    x: -20,
    transition: {
      duration: 0.3,
    },
  },
};

export const scaleIn: Variants = {
  initial: {
    opacity: 0,
    scale: 0.9,
  },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    transition: {
      duration: 0.3,
    },
  },
};

export const slideUp: Variants = {
  initial: {
    y: '100%',
    opacity: 0,
  },
  animate: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
  exit: {
    y: '100%',
    opacity: 0,
    transition: {
      duration: 0.4,
    },
  },
};

export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
  exit: {
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
};

export const staggerItem: Variants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3,
    },
  },
};


export const hoverLift: Variants = {
  initial: {
    y: 0,
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  },
  hover: {
    y: -4,
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    transition: {
      duration: 0.3,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
  tap: {
    y: -2,
    scale: 0.98,
    transition: {
      duration: 0.1,
    },
  },
};

export const hoverGlow: Variants = {
  initial: {
    boxShadow: '0 0 0 rgba(59, 130, 246, 0)',
  },
  hover: {
    boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)',
    transition: {
      duration: 0.3,
    },
  },
};


export const pageTransition: Variants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.4,
    },
  },
};


interface MotionWrapperProps {
  children: React.ReactNode;
  variants?: Variants;
  className?: string;
  delay?: number;
}

export const FadeInUp: React.FC<MotionWrapperProps> = ({ 
  children, 
  className = '', 
  delay = 0 
}) => (
  <motion.div
    variants={fadeInUp}
    initial="initial"
    animate="animate"
    exit="exit"
    className={className}
    style={{ animationDelay: `${delay}s` }}
  >
    {children}
  </motion.div>
);

export const FadeInDown: React.FC<MotionWrapperProps> = ({ 
  children, 
  className = '', 
  delay = 0 
}) => (
  <motion.div
    variants={fadeInDown}
    initial="initial"
    animate="animate"
    exit="exit"
    className={className}
    style={{ animationDelay: `${delay}s` }}
  >
    {children}
  </motion.div>
);

export const ScaleIn: React.FC<MotionWrapperProps> = ({ 
  children, 
  className = '', 
  delay = 0 
}) => (
  <motion.div
    variants={scaleIn}
    initial="initial"
    animate="animate"
    exit="exit"
    className={className}
    style={{ animationDelay: `${delay}s` }}
  >
    {children}
  </motion.div>
);

export const StaggerContainer: React.FC<MotionWrapperProps> = ({ 
  children, 
  className = '' 
}) => (
  <motion.div
    variants={staggerContainer}
    initial="initial"
    animate="animate"
    exit="exit"
    className={className}
  >
    {children}
  </motion.div>
);

export const StaggerItem: React.FC<MotionWrapperProps> = ({ 
  children, 
  className = '' 
}) => (
  <motion.div
    variants={staggerItem}
    className={className}
  >
    {children}
  </motion.div>
);

export const HoverLift: React.FC<MotionWrapperProps> = ({ 
  children, 
  className = '' 
}) => (
  <motion.div
    variants={hoverLift}
    initial="initial"
    whileHover="hover"
    whileTap="tap"
    className={className}
  >
    {children}
  </motion.div>
);


export const PageTransition: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AnimatePresence mode="wait">
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {children}
    </motion.div>
  </AnimatePresence>
);
