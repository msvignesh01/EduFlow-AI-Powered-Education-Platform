
import { motion } from 'framer-motion';
import { useResponsive } from '../../hooks/useResponsive';
import { cn } from '../../utils/cn';

interface BreakpointIndicatorProps {
  show?: boolean;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

export const BreakpointIndicator: React.FC<BreakpointIndicatorProps> = ({
  show = process.env.NODE_ENV === 'development',
  position = 'bottom-right',
}) => {
  const { currentBreakpoint, width, height, isLaptop, isDesktop, isLargeDesktop, isUltraWide, is4K } = useResponsive();

  if (!show) return null;

  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4',
  };

  const getBreakpointColor = () => {
    switch (currentBreakpoint) {
      case 'lg':
        return 'bg-green-500';
      case 'xl':
        return 'bg-blue-500';
      case '2xl':
        return 'bg-purple-500';
      case '3xl':
        return 'bg-indigo-500';
      case '4xl':
        return 'bg-pink-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getDeviceType = () => {
    if (isLaptop) return 'Laptop';
    if (isDesktop) return 'Desktop';
    if (isLargeDesktop) return 'Large Desktop';
    if (isUltraWide) return 'Ultra Wide';
    if (is4K) return '4K Display';
    return 'Desktop';
  };

  return (
    <motion.div
      className={cn(
        'fixed z-[9999] pointer-events-none',
        positionClasses[position]
      )}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="bg-black/80 backdrop-blur-sm text-white text-xs font-mono rounded-lg p-3 shadow-lg border border-white/20">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <div className={cn('w-2 h-2 rounded-full', getBreakpointColor())} />
            <span className="font-semibold">{currentBreakpoint.toUpperCase()}</span>
            <span className="text-gray-300">({getDeviceType()})</span>
          </div>
          
          <div className="text-gray-400">
            {width} × {height}
          </div>
          
          <div className="text-gray-500 text-[10px] mt-2 space-y-0.5">
            <div>xs: &lt;640px</div>
            <div>sm: ≥640px</div>
            <div>md: ≥768px</div>
            <div>lg: ≥1024px</div>
            <div>xl: ≥1280px</div>
            <div>2xl: ≥1536px</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Hook to toggle breakpoint indicator
export const useBreakpointIndicator = () => {
  const [show, setShow] = React.useState(false);

  React.useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Toggle with Ctrl/Cmd + Shift + B
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'B') {
        event.preventDefault();
        setShow(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  return { show, setShow };
};
