import React from 'react';
import { motion } from 'framer-motion';
import { premiumTransitions, premiumEasing } from '../../utils/premiumAnimations';
import { useReducedMotion } from '../../utils/accessibility';
import {
  BookOpen,
  Brain,
  Zap,
  Target,
  Award,
  TrendingUp,
  Users,
  Clock,
  CheckCircle,
  Star,
  Heart,
  Download,
  Upload,
  Send,
  Search,
  Settings,
  Menu,
  X,
  ChevronRight,
  ChevronDown,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Bell,
  User
} from 'lucide-react';

interface AnimatedIconProps {
  size?: number;
  className?: string;
  animate?: boolean;
  variant?: 'bounce' | 'pulse' | 'rotate' | 'scale' | 'float' | 'glow';
}

const iconVariants = {
  bounce: {
    y: [0, -10, 0],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
  pulse: {
    scale: [1, 1.1, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
  rotate: {
    rotate: 360,
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'linear',
    },
  },
  scale: {
    scale: [1, 1.2, 1],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
  float: {
    y: [0, -15, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
  glow: {
    filter: [
      'drop-shadow(0 0 0px rgba(59, 130, 246, 0))',
      'drop-shadow(0 0 10px rgba(59, 130, 246, 0.5))',
      'drop-shadow(0 0 0px rgba(59, 130, 246, 0))',
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

const createAnimatedIcon = (IconComponent: React.ComponentType<any>) => {
  return React.forwardRef<HTMLDivElement, AnimatedIconProps>(
    ({ size = 24, className = '', animate = true, variant = 'float', ...props }, ref) => {
      const prefersReducedMotion = useReducedMotion();

      return (
        <motion.div
          ref={ref}
          className={className}
          animate={animate && !prefersReducedMotion ? iconVariants[variant] : {}}
          whileHover={!prefersReducedMotion ? {
            scale: 1.1,
            transition: premiumTransitions.micro
          } : {}}
          whileTap={!prefersReducedMotion ? {
            scale: 0.95,
            transition: premiumTransitions.micro
          } : {}}
          style={{ willChange: 'transform' }}
        >
          <IconComponent size={size} {...props} />
        </motion.div>
      );
    }
  );
};

// Animated Icons
export const AnimatedBookOpen = createAnimatedIcon(BookOpen);
export const AnimatedBrain = createAnimatedIcon(Brain);
export const AnimatedZap = createAnimatedIcon(Zap);
export const AnimatedTarget = createAnimatedIcon(Target);
export const AnimatedAward = createAnimatedIcon(Award);
export const AnimatedTrendingUp = createAnimatedIcon(TrendingUp);
export const AnimatedUsers = createAnimatedIcon(Users);
export const AnimatedClock = createAnimatedIcon(Clock);
export const AnimatedCheckCircle = createAnimatedIcon(CheckCircle);
export const AnimatedStar = createAnimatedIcon(Star);
export const AnimatedHeart = createAnimatedIcon(Heart);
export const AnimatedDownload = createAnimatedIcon(Download);
export const AnimatedUpload = createAnimatedIcon(Upload);
export const AnimatedSend = createAnimatedIcon(Send);
export const AnimatedSearch = createAnimatedIcon(Search);
export const AnimatedSettings = createAnimatedIcon(Settings);
export const AnimatedMenu = createAnimatedIcon(Menu);
export const AnimatedX = createAnimatedIcon(X);
export const AnimatedChevronRight = createAnimatedIcon(ChevronRight);
export const AnimatedChevronDown = createAnimatedIcon(ChevronDown);
export const AnimatedPlay = createAnimatedIcon(Play);
export const AnimatedPause = createAnimatedIcon(Pause);
export const AnimatedVolume2 = createAnimatedIcon(Volume2);
export const AnimatedVolumeX = createAnimatedIcon(VolumeX);
export const AnimatedBell = createAnimatedIcon(Bell);
export const AnimatedUser = createAnimatedIcon(User);

// Special animated icons with custom animations
export const PulsingStar: React.FC<AnimatedIconProps> = ({ 
  size = 24, 
  className = '' 
}) => (
  <motion.div
    className={className}
    animate={{
      scale: [1, 1.2, 1],
      rotate: [0, 180, 360],
    }}
    transition={{
      duration: 3,
      repeat: Infinity,
      ease: 'easeInOut',
    }}
  >
    <Star size={size} className="text-yellow-500" fill="currentColor" />
  </motion.div>
);

export const BouncingHeart: React.FC<AnimatedIconProps> = ({ 
  size = 24, 
  className = '' 
}) => (
  <motion.div
    className={className}
    animate={{
      scale: [1, 1.3, 1],
    }}
    transition={{
      duration: 1,
      repeat: Infinity,
      ease: 'easeInOut',
    }}
  >
    <Heart size={size} className="text-red-500" fill="currentColor" />
  </motion.div>
);

export const SpinningSettings: React.FC<AnimatedIconProps> = ({ 
  size = 24, 
  className = '' 
}) => (
  <motion.div
    className={className}
    animate={{ rotate: 360 }}
    transition={{
      duration: 4,
      repeat: Infinity,
      ease: 'linear',
    }}
    whileHover={{
      rotate: 360,
      transition: { duration: 0.5 },
    }}
  >
    <Settings size={size} />
  </motion.div>
);

export const GlowingZap: React.FC<AnimatedIconProps> = ({ 
  size = 24, 
  className = '' 
}) => (
  <motion.div
    className={className}
    animate={{
      filter: [
        'drop-shadow(0 0 0px rgba(234, 179, 8, 0))',
        'drop-shadow(0 0 15px rgba(234, 179, 8, 0.8))',
        'drop-shadow(0 0 0px rgba(234, 179, 8, 0))',
      ],
    }}
    transition={{
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    }}
  >
    <Zap size={size} className="text-yellow-500" fill="currentColor" />
  </motion.div>
);

export const FloatingBrain: React.FC<AnimatedIconProps> = ({ 
  size = 24, 
  className = '' 
}) => (
  <motion.div
    className={className}
    animate={{
      y: [0, -10, 0],
      rotate: [0, 5, -5, 0],
    }}
    transition={{
      duration: 4,
      repeat: Infinity,
      ease: 'easeInOut',
    }}
  >
    <Brain size={size} className="text-purple-500" />
  </motion.div>
);

// Interactive animated icons
export const InteractiveCheckCircle: React.FC<AnimatedIconProps & { 
  isChecked?: boolean;
  onToggle?: () => void;
}> = ({ 
  size = 24, 
  className = '', 
  isChecked = false,
  onToggle 
}) => (
  <motion.div
    className={`cursor-pointer ${className}`}
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
    onClick={onToggle}
    animate={{
      scale: isChecked ? [1, 1.2, 1] : 1,
      rotate: isChecked ? [0, 360] : 0,
    }}
    transition={{
      duration: 0.5,
      ease: 'easeInOut',
    }}
  >
    <CheckCircle 
      size={size} 
      className={isChecked ? 'text-green-500' : 'text-gray-400'}
      fill={isChecked ? 'currentColor' : 'none'}
    />
  </motion.div>
);

export const AnimatedMenuToggle: React.FC<AnimatedIconProps & { 
  isOpen?: boolean;
  onToggle?: () => void;
}> = ({ 
  size = 24, 
  className = '', 
  isOpen = false,
  onToggle 
}) => (
  <motion.div
    className={`cursor-pointer ${className}`}
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
    onClick={onToggle}
    animate={{ rotate: isOpen ? 90 : 0 }}
    transition={{ duration: 0.3 }}
  >
    {isOpen ? <X size={size} /> : <Menu size={size} />}
  </motion.div>
);

// Loading states for icons
export const LoadingIcon: React.FC<AnimatedIconProps> = ({ 
  size = 24, 
  className = '' 
}) => (
  <motion.div
    className={className}
    animate={{ rotate: 360 }}
    transition={{
      duration: 1,
      repeat: Infinity,
      ease: 'linear',
    }}
  >
    <div 
      className="border-2 border-gray-300 border-t-blue-600 rounded-full"
      style={{ width: size, height: size }}
    />
  </motion.div>
);
