import { useState, useCallback, useRef, useEffect } from 'react';
import { useReducedMotion } from '../utils/accessibility';

interface MicroInteractionState {
  isHovered: boolean;
  isPressed: boolean;
  isFocused: boolean;
  isActive: boolean;
  ripples: Array<{ id: number; x: number; y: number }>;
}

interface UseMicroInteractionsOptions {
  enableRipple?: boolean;
  enableHaptic?: boolean;
  enableSound?: boolean;
  rippleDuration?: number;
  onInteraction?: (type: 'hover' | 'press' | 'focus' | 'click') => void;
}

export const useMicroInteractions = (options: UseMicroInteractionsOptions = {}) => {
  const {
    enableRipple = false,
    enableHaptic = false,
    enableSound = false,
    rippleDuration = 600,
    onInteraction,
  } = options;

  const prefersReducedMotion = useReducedMotion();
  const [state, setState] = useState<MicroInteractionState>({
    isHovered: false,
    isPressed: false,
    isFocused: false,
    isActive: false,
    ripples: [],
  });

  const audioContextRef = useRef<AudioContext | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  // Initialize audio context for sound feedback
  useEffect(() => {
    if (enableSound && !prefersReducedMotion) {
      try {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      } catch (error) {
        console.warn('Audio context not supported:', error);
      }
    }
  }, [enableSound, prefersReducedMotion]);

  // Haptic feedback
  const triggerHaptic = useCallback((intensity: 'light' | 'medium' | 'heavy' = 'light') => {
    if (!enableHaptic || prefersReducedMotion) return;

    if ('vibrate' in navigator) {
      const patterns = {
        light: 10,
        medium: 20,
        heavy: 50,
      };
      navigator.vibrate(patterns[intensity]);
    }
  }, [enableHaptic, prefersReducedMotion]);

  // Sound feedback
  const triggerSound = useCallback((frequency: number = 800, duration: number = 100) => {
    if (!enableSound || prefersReducedMotion || !audioContextRef.current) return;

    try {
      const oscillator = audioContextRef.current.createOscillator();
      const gainNode = audioContextRef.current.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContextRef.current.destination);

      oscillator.frequency.setValueAtTime(frequency, audioContextRef.current.currentTime);
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0.1, audioContextRef.current.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + duration / 1000);

      oscillator.start(audioContextRef.current.currentTime);
      oscillator.stop(audioContextRef.current.currentTime + duration / 1000);
    } catch (error) {
      console.warn('Sound feedback failed:', error);
    }
  }, [enableSound, prefersReducedMotion]);

  // Ripple effect
  const createRipple = useCallback((event: React.MouseEvent | React.TouchEvent) => {
    if (!enableRipple || prefersReducedMotion) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
    const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY;
    
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    const newRipple = { id: Date.now(), x, y };

    setState(prev => ({
      ...prev,
      ripples: [...prev.ripples, newRipple],
    }));

    setTimeout(() => {
      setState(prev => ({
        ...prev,
        ripples: prev.ripples.filter(ripple => ripple.id !== newRipple.id),
      }));
    }, rippleDuration);
  }, [enableRipple, prefersReducedMotion, rippleDuration]);

  // Event handlers
  const handleMouseEnter = useCallback(() => {
    setState(prev => ({ ...prev, isHovered: true }));
    onInteraction?.('hover');
  }, [onInteraction]);

  const handleMouseLeave = useCallback(() => {
    setState(prev => ({ 
      ...prev, 
      isHovered: false, 
      isPressed: false,
      isActive: false 
    }));
  }, []);

  const handleMouseDown = useCallback((event: React.MouseEvent) => {
    setState(prev => ({ ...prev, isPressed: true, isActive: true }));
    createRipple(event);
    triggerHaptic('light');
    triggerSound(800, 50);
    onInteraction?.('press');
  }, [createRipple, triggerHaptic, triggerSound, onInteraction]);

  const handleMouseUp = useCallback(() => {
    setState(prev => ({ ...prev, isPressed: false }));
    
    // Keep active state briefly for visual feedback
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setState(prev => ({ ...prev, isActive: false }));
    }, 150);
  }, []);

  const handleFocus = useCallback(() => {
    setState(prev => ({ ...prev, isFocused: true }));
    onInteraction?.('focus');
  }, [onInteraction]);

  const handleBlur = useCallback(() => {
    setState(prev => ({ ...prev, isFocused: false }));
  }, []);

  const handleClick = useCallback(() => {
    triggerHaptic('medium');
    triggerSound(1000, 100);
    onInteraction?.('click');
  }, [triggerHaptic, triggerSound, onInteraction]);

  // Touch handlers for mobile
  const handleTouchStart = useCallback((event: React.TouchEvent) => {
    setState(prev => ({ ...prev, isPressed: true, isActive: true, isHovered: true }));
    createRipple(event);
    triggerHaptic('light');
    onInteraction?.('press');
  }, [createRipple, triggerHaptic, onInteraction]);

  const handleTouchEnd = useCallback(() => {
    setState(prev => ({ ...prev, isPressed: false, isHovered: false }));
    
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setState(prev => ({ ...prev, isActive: false }));
    }, 150);
  }, []);

  // Cleanup
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  return {
    state,
    handlers: {
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
      onMouseDown: handleMouseDown,
      onMouseUp: handleMouseUp,
      onFocus: handleFocus,
      onBlur: handleBlur,
      onClick: handleClick,
      onTouchStart: handleTouchStart,
      onTouchEnd: handleTouchEnd,
    },
    utils: {
      triggerHaptic,
      triggerSound,
      createRipple,
    },
  };
};

// Hook for form field micro-interactions
export const useFormFieldInteractions = () => {
  const [state, setState] = useState({
    isFocused: false,
    hasValue: false,
    isValid: null as boolean | null,
    showValidation: false,
  });

  const handleFocus = useCallback(() => {
    setState(prev => ({ ...prev, isFocused: true }));
  }, []);

  const handleBlur = useCallback(() => {
    setState(prev => ({ ...prev, isFocused: false, showValidation: true }));
  }, []);

  const handleChange = useCallback((value: string, isValid?: boolean) => {
    setState(prev => ({
      ...prev,
      hasValue: value.length > 0,
      isValid: isValid ?? null,
    }));
  }, []);

  const reset = useCallback(() => {
    setState({
      isFocused: false,
      hasValue: false,
      isValid: null,
      showValidation: false,
    });
  }, []);

  return {
    state,
    handlers: {
      onFocus: handleFocus,
      onBlur: handleBlur,
      onChange: handleChange,
    },
    utils: {
      reset,
    },
  };
};

// Hook for loading state micro-interactions
export const useLoadingInteractions = (isLoading: boolean) => {
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState('');
  const intervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (isLoading) {
      setProgress(0);
      intervalRef.current = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + Math.random() * 10 + 5;
          
          // Update stage based on progress
          if (newProgress < 30) {
            setStage('Initializing...');
          } else if (newProgress < 60) {
            setStage('Processing...');
          } else if (newProgress < 90) {
            setStage('Finalizing...');
          } else {
            setStage('Complete!');
          }
          
          return Math.min(newProgress, 95);
        });
      }, 200);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      setProgress(100);
      setTimeout(() => {
        setProgress(0);
        setStage('');
      }, 500);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isLoading]);

  return {
    progress,
    stage,
  };
};

// Hook for scroll-based micro-interactions
export const useScrollInteractions = () => {
  const [scrollState, setScrollState] = useState({
    scrollY: 0,
    scrollDirection: 'up' as 'up' | 'down',
    isScrolling: false,
    isNearTop: true,
    isNearBottom: false,
  });

  const lastScrollY = useRef(0);
  const scrollTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const direction = currentScrollY > lastScrollY.current ? 'down' : 'up';
      const isNearTop = currentScrollY < 100;
      const isNearBottom = currentScrollY > document.documentElement.scrollHeight - window.innerHeight - 100;

      setScrollState({
        scrollY: currentScrollY,
        scrollDirection: direction,
        isScrolling: true,
        isNearTop,
        isNearBottom,
      });

      lastScrollY.current = currentScrollY;

      // Clear scrolling state after scroll ends
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      scrollTimeoutRef.current = setTimeout(() => {
        setScrollState(prev => ({ ...prev, isScrolling: false }));
      }, 150);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  return scrollState;
};
