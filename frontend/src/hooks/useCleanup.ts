import { useEffect, useRef, useCallback } from 'react';

/**
 * Hook to manage cleanup functions and prevent memory leaks
 */
export const useCleanup = () => {
  const cleanupFunctions = useRef<(() => void)[]>([]);
  const timeouts = useRef<number[]>([]);
  const intervals = useRef<number[]>([]);
  const eventListeners = useRef<Array<{
    element: EventTarget;
    event: string;
    handler: EventListener;
    options?: boolean | AddEventListenerOptions;
  }>>([]);

  // Add a cleanup function
  const addCleanup = useCallback((fn: () => void) => {
    cleanupFunctions.current.push(fn);
  }, []);

  // Managed setTimeout that auto-cleans up
  const setTimeout = useCallback((callback: () => void, delay: number) => {
    const timeoutId = window.setTimeout(() => {
      callback();
      // Remove from tracking array
      const index = timeouts.current.indexOf(timeoutId);
      if (index > -1) {
        timeouts.current.splice(index, 1);
      }
    }, delay);
    
    timeouts.current.push(timeoutId);
    return timeoutId;
  }, []);

  // Managed setInterval that auto-cleans up
  const setInterval = useCallback((callback: () => void, delay: number) => {
    const intervalId = window.setInterval(callback, delay);
    intervals.current.push(intervalId);
    return intervalId;
  }, []);

  // Managed event listener that auto-cleans up
  const addEventListener = useCallback((
    element: EventTarget,
    event: string,
    handler: EventListener,
    options?: boolean | AddEventListenerOptions
  ) => {
    element.addEventListener(event, handler, options);
    eventListeners.current.push({ element, event, handler, options });
  }, []);

  // Manual cleanup function
  const cleanup = useCallback(() => {
    // Clear all timeouts
    timeouts.current.forEach(id => window.clearTimeout(id));
    timeouts.current = [];

    // Clear all intervals
    intervals.current.forEach(id => window.clearInterval(id));
    intervals.current = [];

    // Remove all event listeners
    eventListeners.current.forEach(({ element, event, handler, options }) => {
      element.removeEventListener(event, handler, options);
    });
    eventListeners.current = [];

    // Run all cleanup functions
    cleanupFunctions.current.forEach(fn => {
      try {
        fn();
      } catch (error) {
        console.error('Error in cleanup function:', error);
      }
    });
    cleanupFunctions.current = [];
  }, []);

  // Auto-cleanup on unmount
  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  return {
    addCleanup,
    setTimeout,
    setInterval,
    addEventListener,
    cleanup
  };
};

/**
 * Hook for managing async operations and preventing state updates on unmounted components
 */
export const useAsyncCleanup = () => {
  const isMountedRef = useRef(true);
  const { addCleanup } = useCleanup();

  useEffect(() => {
    isMountedRef.current = true;
    addCleanup(() => {
      isMountedRef.current = false;
    });
  }, [addCleanup]);

  const safeSetState = useCallback(<T>(
    setState: React.Dispatch<React.SetStateAction<T>>,
    value: T | ((prev: T) => T)
  ) => {
    if (isMountedRef.current) {
      setState(value);
    }
  }, []);

  const safeAsync = useCallback(async <T>(
    asyncFn: () => Promise<T>,
    onSuccess?: (result: T) => void,
    onError?: (error: Error) => void
  ) => {
    try {
      const result = await asyncFn();
      if (isMountedRef.current && onSuccess) {
        onSuccess(result);
      }
      return result;
    } catch (error) {
      if (isMountedRef.current && onError) {
        onError(error as Error);
      }
      throw error;
    }
  }, []);

  return {
    isMounted: () => isMountedRef.current,
    safeSetState,
    safeAsync
  };
};

/**
 * Hook for managing WebSocket connections with automatic cleanup
 */
export const useWebSocketCleanup = (url: string, options?: {
  onOpen?: (event: Event) => void;
  onMessage?: (event: MessageEvent) => void;
  onError?: (event: Event) => void;
  onClose?: (event: CloseEvent) => void;
  reconnectAttempts?: number;
  reconnectDelay?: number;
}) => {
  const wsRef = useRef<WebSocket | null>(null);
  const { addCleanup } = useCleanup();
  const { isMounted } = useAsyncCleanup();

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return wsRef.current;
    }

    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = (event) => {
      if (isMounted() && options?.onOpen) {
        options.onOpen(event);
      }
    };

    ws.onmessage = (event) => {
      if (isMounted() && options?.onMessage) {
        options.onMessage(event);
      }
    };

    ws.onerror = (event) => {
      if (isMounted() && options?.onError) {
        options.onError(event);
      }
    };

    ws.onclose = (event) => {
      if (isMounted() && options?.onClose) {
        options.onClose(event);
      }
    };

    return ws;
  }, [url, options, isMounted]);

  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
  }, []);

  const send = useCallback((data: string | ArrayBufferLike | Blob | ArrayBufferView) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(data);
    }
  }, []);

  useEffect(() => {
    addCleanup(disconnect);
  }, [addCleanup, disconnect]);

  return {
    connect,
    disconnect,
    send,
    readyState: wsRef.current?.readyState || WebSocket.CLOSED
  };
};