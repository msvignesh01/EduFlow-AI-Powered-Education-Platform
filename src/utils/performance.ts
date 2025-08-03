import React from 'react';
import { log } from './logger';

// Debounce function for performance optimization
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Throttle function for performance optimization
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Memoization for expensive computations
export function memoize<T extends (...args: any[]) => any>(
  func: T,
  getKey?: (...args: Parameters<T>) => string
): T {
  const cache = new Map<string, ReturnType<T>>();
  
  return ((...args: Parameters<T>) => {
    const key = getKey ? getKey(...args) : JSON.stringify(args);
    
    if (cache.has(key)) {
      return cache.get(key);
    }
    
    const result = func(...args);
    cache.set(key, result);
    return result;
  }) as T;
}

// Performance measurement
export class PerformanceMonitor {
  private static measurements = new Map<string, number[]>();
  
  static start(label: string): () => void {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      if (!this.measurements.has(label)) {
        this.measurements.set(label, []);
      }
      
      this.measurements.get(label)!.push(duration);
      
      log.debug(`Performance: ${label} took ${duration.toFixed(2)}ms`);
    };
  }
  
  static getStats(label: string) {
    const measurements = this.measurements.get(label);
    if (!measurements || measurements.length === 0) {
      return null;
    }
    
    const sorted = [...measurements].sort((a, b) => a - b);
    const avg = measurements.reduce((a, b) => a + b, 0) / measurements.length;
    const median = sorted[Math.floor(sorted.length / 2)];
    const min = sorted[0];
    const max = sorted[sorted.length - 1];
    
    return { avg, median, min, max, count: measurements.length };
  }
  
  static getAllStats() {
    const stats: Record<string, any> = {};
    for (const [label] of this.measurements) {
      stats[label] = this.getStats(label);
    }
    return stats;
  }
  
  static clear(label?: string) {
    if (label) {
      this.measurements.delete(label);
    } else {
      this.measurements.clear();
    }
  }
}

// Lazy loading utility
export function createLazyComponent<T extends React.ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  fallback?: React.ComponentType
) {
  return React.lazy(async () => {
    const stopMeasure = PerformanceMonitor.start('Component Load');
    try {
      const module = await importFunc();
      stopMeasure();
      return module;
    } catch (error) {
      stopMeasure();
      log.error('Failed to load component', error as Error);
      throw error;
    }
  });
}

// Image optimization
export function optimizeImage(
  src: string,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'webp' | 'jpeg' | 'png';
  } = {}
): string {
  // In a real app, you might use a service like Cloudinary or ImageKit
  // For now, just return the original src
  return src;
}

// Bundle size monitoring
export function reportBundleSize() {
  if ('performance' in window && 'getEntriesByType' in performance) {
    const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
    
    const jsResources = resources.filter(resource => 
      resource.name.includes('.js') && resource.transferSize
    );
    
    const totalJSSize = jsResources.reduce((total, resource) => 
      total + (resource.transferSize || 0), 0
    );
    
    log.info('Bundle analysis', {
      totalJSSize: `${(totalJSSize / 1024).toFixed(2)} KB`,
      jsFiles: jsResources.length,
      resources: jsResources.map(r => ({
        name: r.name.split('/').pop(),
        size: `${((r.transferSize || 0) / 1024).toFixed(2)} KB`
      }))
    });
  }
}

// Memory usage monitoring
export function reportMemoryUsage() {
  if ('memory' in performance) {
    const memory = (performance as any).memory;
    log.info('Memory usage', {
      used: `${(memory.usedJSHeapSize / 1024 / 1024).toFixed(2)} MB`,
      total: `${(memory.totalJSHeapSize / 1024 / 1024).toFixed(2)} MB`,
      limit: `${(memory.jsHeapSizeLimit / 1024 / 1024).toFixed(2)} MB`
    });
  }
}

// Initialize performance monitoring in development
if (process.env.NODE_ENV === 'development') {
  // Report bundle size after load
  window.addEventListener('load', () => {
    setTimeout(() => {
      reportBundleSize();
      reportMemoryUsage();
    }, 1000);
  });
  
  // Report memory usage periodically
  setInterval(reportMemoryUsage, 30000);
}
