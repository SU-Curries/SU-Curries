import { useEffect, useCallback } from 'react';

interface PerformanceMetrics {
  lcp?: number; // Largest Contentful Paint
  fid?: number; // First Input Delay
  cls?: number; // Cumulative Layout Shift
  fcp?: number; // First Contentful Paint
  ttfb?: number; // Time to First Byte
}

interface UsePerformanceMonitoringOptions {
  enabled?: boolean;
  reportToAnalytics?: boolean;
  thresholds?: {
    lcp?: number;
    fid?: number;
    cls?: number;
  };
}

export const usePerformanceMonitoring = (options: UsePerformanceMonitoringOptions = {}) => {
  const {
    enabled = true,
    reportToAnalytics = false,
    thresholds = {
      lcp: 2500, // Good: < 2.5s
      fid: 100,  // Good: < 100ms
      cls: 0.1   // Good: < 0.1
    }
  } = options;

  const reportMetric = useCallback((metric: PerformanceMetrics) => {
    if (!enabled) return;

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Performance Metric:', metric);
    }

    // Report to analytics service if enabled
    if (reportToAnalytics && window.gtag) {
      Object.entries(metric).forEach(([name, value]) => {
        if (value !== undefined && window.gtag) {
          window.gtag('event', name, {
            event_category: 'Web Vitals',
            value: Math.round(name === 'cls' ? value * 1000 : value),
            non_interaction: true,
          });
        }
      });
    }

    // Check against thresholds and warn if poor
    Object.entries(metric).forEach(([name, value]) => {
      if (value !== undefined && thresholds[name as keyof typeof thresholds]) {
        const threshold = thresholds[name as keyof typeof thresholds]!;
        if (value > threshold) {
          console.warn(`Poor ${name.toUpperCase()} performance: ${value} (threshold: ${threshold})`);
        }
      }
    });
  }, [enabled, reportToAnalytics, thresholds]);

  const measureLCP = useCallback(() => {
    if (!('PerformanceObserver' in window)) return;

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1] as any;
      
      if (lastEntry) {
        reportMetric({ lcp: lastEntry.startTime });
      }
    });

    try {
      observer.observe({ entryTypes: ['largest-contentful-paint'] });
    } catch (e) {
      console.warn('LCP measurement not supported');
    }

    return () => observer.disconnect();
  }, [reportMetric]);

  const measureFID = useCallback(() => {
    if (!('PerformanceObserver' in window)) return;

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry: any) => {
        if (entry.name === 'first-input') {
          reportMetric({ fid: entry.processingStart - entry.startTime });
        }
      });
    });

    try {
      observer.observe({ entryTypes: ['first-input'] });
    } catch (e) {
      console.warn('FID measurement not supported');
    }

    return () => observer.disconnect();
  }, [reportMetric]);

  const measureCLS = useCallback(() => {
    if (!('PerformanceObserver' in window)) return;

    let clsValue = 0;
    let clsEntries: any[] = [];

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry: any) => {
        if (!entry.hadRecentInput) {
          clsEntries.push(entry);
          clsValue += entry.value;
        }
      });

      reportMetric({ cls: clsValue });
    });

    try {
      observer.observe({ entryTypes: ['layout-shift'] });
    } catch (e) {
      console.warn('CLS measurement not supported');
    }

    return () => observer.disconnect();
  }, [reportMetric]);

  const measureNavigationTiming = useCallback(() => {
    if (!('performance' in window) || !performance.getEntriesByType) return;

    const navigationEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
    if (navigationEntries.length > 0) {
      const entry = navigationEntries[0];
      
      const metrics: PerformanceMetrics = {
        fcp: entry.responseStart - entry.fetchStart,
        ttfb: entry.responseStart - entry.requestStart
      };

      reportMetric(metrics);
    }
  }, [reportMetric]);

  const measureResourceTiming = useCallback(() => {
    if (!('performance' in window) || !performance.getEntriesByType) return;

    const resourceEntries = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
    
    // Find slow resources (> 1s)
    const slowResources = resourceEntries.filter(entry => 
      entry.duration > 1000
    );

    if (slowResources.length > 0) {
      console.warn('Slow resources detected:', slowResources.map(r => ({
        name: r.name,
        duration: r.duration,
        size: r.transferSize
      })));
    }
  }, []);

  useEffect(() => {
    if (!enabled) return;

    // Measure Core Web Vitals
    const cleanupLCP = measureLCP();
    const cleanupFID = measureFID();
    const cleanupCLS = measureCLS();

    // Measure navigation timing
    if (document.readyState === 'complete') {
      measureNavigationTiming();
      measureResourceTiming();
    } else {
      window.addEventListener('load', () => {
        measureNavigationTiming();
        measureResourceTiming();
      });
    }

    return () => {
      cleanupLCP?.();
      cleanupFID?.();
      cleanupCLS?.();
    };
  }, [enabled, measureLCP, measureFID, measureCLS, measureNavigationTiming, measureResourceTiming]);

  // Manual performance measurement utilities
  const measureFunction = useCallback(<T extends (...args: any[]) => any>(
    fn: T,
    name?: string
  ): T => {
    return ((...args: Parameters<T>) => {
      const start = performance.now();
      const result = fn(...args);
      const end = performance.now();
      
      console.log(`${name || fn.name || 'Function'} execution time: ${end - start}ms`);
      
      return result;
    }) as T;
  }, []);

  const startMeasurement = useCallback((name: string) => {
    performance.mark(`${name}-start`);
  }, []);

  const endMeasurement = useCallback((name: string) => {
    performance.mark(`${name}-end`);
    performance.measure(name, `${name}-start`, `${name}-end`);
    
    const measure = performance.getEntriesByName(name, 'measure')[0];
    if (measure) {
      console.log(`${name}: ${measure.duration}ms`);
    }
  }, []);

  return {
    measureFunction,
    startMeasurement,
    endMeasurement,
    reportMetric
  };
};

// Extend Window interface for gtag
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}