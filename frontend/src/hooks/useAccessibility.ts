import { useEffect, useState } from 'react';

interface AccessibilityPreferences {
  reducedMotion: boolean;
  highContrast: boolean;
  fontSize: 'small' | 'medium' | 'large';
  screenReader: boolean;
}

export const useAccessibility = () => {
  const [preferences, setPreferences] = useState<AccessibilityPreferences>({
    reducedMotion: false,
    highContrast: false,
    fontSize: 'medium',
    screenReader: false,
  });

  useEffect(() => {
    // Check for reduced motion preference
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPreferences(prev => ({ ...prev, reducedMotion: reducedMotionQuery.matches }));

    const handleReducedMotionChange = (e: MediaQueryListEvent) => {
      setPreferences(prev => ({ ...prev, reducedMotion: e.matches }));
    };

    reducedMotionQuery.addEventListener('change', handleReducedMotionChange);

    // Check for high contrast preference
    const highContrastQuery = window.matchMedia('(prefers-contrast: high)');
    setPreferences(prev => ({ ...prev, highContrast: highContrastQuery.matches }));

    const handleHighContrastChange = (e: MediaQueryListEvent) => {
      setPreferences(prev => ({ ...prev, highContrast: e.matches }));
    };

    highContrastQuery.addEventListener('change', handleHighContrastChange);

    // Check for screen reader
    const checkScreenReader = () => {
      // Simple heuristic to detect screen reader usage
      const hasScreenReader = 
        navigator.userAgent.includes('NVDA') ||
        navigator.userAgent.includes('JAWS') ||
        navigator.userAgent.includes('VoiceOver') ||
        window.speechSynthesis !== undefined;
      
      setPreferences(prev => ({ ...prev, screenReader: hasScreenReader }));
    };

    checkScreenReader();

    // Load saved preferences from localStorage
    const savedPreferences = localStorage.getItem('accessibility-preferences');
    if (savedPreferences) {
      try {
        const parsed = JSON.parse(savedPreferences);
        setPreferences(prev => ({ ...prev, ...parsed }));
      } catch (error) {
        console.error('Failed to parse accessibility preferences:', error);
      }
    }

    return () => {
      reducedMotionQuery.removeEventListener('change', handleReducedMotionChange);
      highContrastQuery.removeEventListener('change', handleHighContrastChange);
    };
  }, []);

  const updatePreference = <K extends keyof AccessibilityPreferences>(
    key: K,
    value: AccessibilityPreferences[K]
  ) => {
    setPreferences(prev => {
      const newPreferences = { ...prev, [key]: value };
      localStorage.setItem('accessibility-preferences', JSON.stringify(newPreferences));
      return newPreferences;
    });
  };

  // Apply accessibility preferences to document
  useEffect(() => {
    const root = document.documentElement;

    // Apply font size
    root.classList.remove('text-small', 'text-medium', 'text-large');
    root.classList.add(`text-${preferences.fontSize}`);

    // Apply high contrast
    if (preferences.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    // Apply reduced motion
    if (preferences.reducedMotion) {
      root.classList.add('reduce-motion');
    } else {
      root.classList.remove('reduce-motion');
    }

    // Screen reader optimizations
    if (preferences.screenReader) {
      root.classList.add('screen-reader');
    } else {
      root.classList.remove('screen-reader');
    }
  }, [preferences]);

  return {
    preferences,
    updatePreference,
    isReducedMotion: preferences.reducedMotion,
    isHighContrast: preferences.highContrast,
    fontSize: preferences.fontSize,
    isScreenReader: preferences.screenReader,
  };
};

// Hook for managing focus
export const useFocusManagement = () => {
  const [focusedElement, setFocusedElement] = useState<HTMLElement | null>(null);

  const saveFocus = () => {
    setFocusedElement(document.activeElement as HTMLElement);
  };

  const restoreFocus = () => {
    if (focusedElement && focusedElement.focus) {
      focusedElement.focus();
    }
  };

  const focusElement = (selector: string) => {
    const element = document.querySelector(selector) as HTMLElement;
    if (element && element.focus) {
      element.focus();
    }
  };

  const trapFocus = (container: HTMLElement) => {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as NodeListOf<HTMLElement>;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    container.addEventListener('keydown', handleKeyDown);

    return () => {
      container.removeEventListener('keydown', handleKeyDown);
    };
  };

  return {
    saveFocus,
    restoreFocus,
    focusElement,
    trapFocus,
  };
};

// Hook for keyboard navigation
export const useKeyboardNavigation = () => {
  const handleKeyDown = (
    event: React.KeyboardEvent,
    handlers: Record<string, () => void>
  ) => {
    const handler = handlers[event.key];
    if (handler) {
      event.preventDefault();
      handler();
    }
  };

  const createArrowKeyHandler = (
    items: HTMLElement[],
    currentIndex: number,
    setCurrentIndex: (index: number) => void
  ) => ({
    ArrowUp: () => {
      const newIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
      setCurrentIndex(newIndex);
      items[newIndex]?.focus();
    },
    ArrowDown: () => {
      const newIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
      setCurrentIndex(newIndex);
      items[newIndex]?.focus();
    },
    Home: () => {
      setCurrentIndex(0);
      items[0]?.focus();
    },
    End: () => {
      const lastIndex = items.length - 1;
      setCurrentIndex(lastIndex);
      items[lastIndex]?.focus();
    },
  });

  return {
    handleKeyDown,
    createArrowKeyHandler,
  };
};

// Hook for announcements to screen readers
export const useScreenReaderAnnouncements = () => {
  const announce = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;

    document.body.appendChild(announcement);

    // Remove the announcement after a short delay
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  };

  return { announce };
};