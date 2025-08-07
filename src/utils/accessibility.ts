

import { useEffect, useState } from 'react';


export const KEYBOARD_KEYS = {
  ENTER: 'Enter',
  SPACE: ' ',
  ESCAPE: 'Escape',
  TAB: 'Tab',
  ARROW_UP: 'ArrowUp',
  ARROW_DOWN: 'ArrowDown',
  ARROW_LEFT: 'ArrowLeft',
  ARROW_RIGHT: 'ArrowRight',
  HOME: 'Home',
  END: 'End',
} as const;


export const focusElement = (element: HTMLElement | null) => {
  if (element) {
    element.focus();
  }
};

export const getFocusableElements = (container: HTMLElement): HTMLElement[] => {
  const focusableSelectors = [
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    'a[href]',
    '[tabindex]:not([tabindex="-1"])',
    '[contenteditable="true"]',
  ].join(', ');

  return Array.from(container.querySelectorAll(focusableSelectors));
};


export const useFocusTrap = (isActive: boolean, containerRef: React.RefObject<HTMLElement>) => {
  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const container = containerRef.current;
    const focusableElements = getFocusableElements(container);
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === KEYBOARD_KEYS.TAB) {
        if (e.shiftKey) {

          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement?.focus();
          }
        } else {

          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement?.focus();
          }
        }
      }
    };

    container.addEventListener('keydown', handleKeyDown);
    

    firstElement?.focus();

    return () => {
      container.removeEventListener('keydown', handleKeyDown);
    };
  }, [isActive, containerRef]);
};


export const announceToScreenReader = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.setAttribute('class', 'sr-only');
  announcement.textContent = message;

  document.body.appendChild(announcement);


  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
};


export const createSkipLinkProps = (href: string) => ({
  href,
  className: "sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-lg focus:shadow-lg",
  onFocus: () => announceToScreenReader('Skip link focused'),
});


export const useReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReducedMotion;
};


export const useHighContrast = () => {
  const [prefersHighContrast, setPrefersHighContrast] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-contrast: high)');
    setPrefersHighContrast(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersHighContrast(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersHighContrast;
};


export const getAriaAttributes = (props: {
  label?: string;
  labelledBy?: string;
  describedBy?: string;
  expanded?: boolean;
  selected?: boolean;
  disabled?: boolean;
  required?: boolean;
  invalid?: boolean;
  hidden?: boolean;
  live?: 'polite' | 'assertive' | 'off';
  atomic?: boolean;
  busy?: boolean;
  controls?: string;
  owns?: string;
  haspopup?: boolean | 'menu' | 'listbox' | 'tree' | 'grid' | 'dialog';
  level?: number;
  posinset?: number;
  setsize?: number;
}) => {
  const ariaProps: Record<string, any> = {};

  if (props.label) ariaProps['aria-label'] = props.label;
  if (props.labelledBy) ariaProps['aria-labelledby'] = props.labelledBy;
  if (props.describedBy) ariaProps['aria-describedby'] = props.describedBy;
  if (props.expanded !== undefined) ariaProps['aria-expanded'] = props.expanded;
  if (props.selected !== undefined) ariaProps['aria-selected'] = props.selected;
  if (props.disabled !== undefined) ariaProps['aria-disabled'] = props.disabled;
  if (props.required !== undefined) ariaProps['aria-required'] = props.required;
  if (props.invalid !== undefined) ariaProps['aria-invalid'] = props.invalid;
  if (props.hidden !== undefined) ariaProps['aria-hidden'] = props.hidden;
  if (props.live) ariaProps['aria-live'] = props.live;
  if (props.atomic !== undefined) ariaProps['aria-atomic'] = props.atomic;
  if (props.busy !== undefined) ariaProps['aria-busy'] = props.busy;
  if (props.controls) ariaProps['aria-controls'] = props.controls;
  if (props.owns) ariaProps['aria-owns'] = props.owns;
  if (props.haspopup !== undefined) ariaProps['aria-haspopup'] = props.haspopup;
  if (props.level !== undefined) ariaProps['aria-level'] = props.level;
  if (props.posinset !== undefined) ariaProps['aria-posinset'] = props.posinset;
  if (props.setsize !== undefined) ariaProps['aria-setsize'] = props.setsize;

  return ariaProps;
};


export const useKeyboardNavigation = (
  items: any[],
  onSelect?: (item: any, index: number) => void,
  orientation: 'horizontal' | 'vertical' = 'vertical'
) => {
  const [activeIndex, setActiveIndex] = useState(-1);

  const handleKeyDown = (e: KeyboardEvent) => {
    const { key } = e;
    
    switch (key) {
      case KEYBOARD_KEYS.ARROW_DOWN:
        if (orientation === 'vertical') {
          e.preventDefault();
          setActiveIndex(prev => (prev + 1) % items.length);
        }
        break;
        
      case KEYBOARD_KEYS.ARROW_UP:
        if (orientation === 'vertical') {
          e.preventDefault();
          setActiveIndex(prev => (prev - 1 + items.length) % items.length);
        }
        break;
        
      case KEYBOARD_KEYS.ARROW_RIGHT:
        if (orientation === 'horizontal') {
          e.preventDefault();
          setActiveIndex(prev => (prev + 1) % items.length);
        }
        break;
        
      case KEYBOARD_KEYS.ARROW_LEFT:
        if (orientation === 'horizontal') {
          e.preventDefault();
          setActiveIndex(prev => (prev - 1 + items.length) % items.length);
        }
        break;
        
      case KEYBOARD_KEYS.HOME:
        e.preventDefault();
        setActiveIndex(0);
        break;
        
      case KEYBOARD_KEYS.END:
        e.preventDefault();
        setActiveIndex(items.length - 1);
        break;
        
      case KEYBOARD_KEYS.ENTER:
      case KEYBOARD_KEYS.SPACE:
        if (activeIndex >= 0 && onSelect) {
          e.preventDefault();
          onSelect(items[activeIndex], activeIndex);
        }
        break;
    }
  };

  return {
    activeIndex,
    setActiveIndex,
    handleKeyDown,
  };
};


export const getContrastRatio = (color1: string, color2: string): number => {

  const getLuminance = (color: string): number => {

    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16) / 255;
    const g = parseInt(hex.substr(2, 2), 16) / 255;
    const b = parseInt(hex.substr(4, 2), 16) / 255;
    
    const sRGB = [r, g, b].map(c => {
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    
    return 0.2126 * sRGB[0] + 0.7152 * sRGB[1] + 0.0722 * sRGB[2];
  };

  const lum1 = getLuminance(color1);
  const lum2 = getLuminance(color2);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  
  return (brightest + 0.05) / (darkest + 0.05);
};

export const meetsWCAGContrast = (color1: string, color2: string, level: 'AA' | 'AAA' = 'AA'): boolean => {
  const ratio = getContrastRatio(color1, color2);
  return level === 'AA' ? ratio >= 4.5 : ratio >= 7;
};


export const srOnlyClass = 'absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-0';


import React from 'react';
