/**
 * Network status hook with offline detection and reconnection handling
 * Provides real-time network status and queued action execution on reconnect
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'sonner';

interface NetworkState {
  isOnline: boolean;
  wasOffline: boolean;
  lastOnlineAt: Date | null;
  connectionType: string | null;
}

interface UseNetworkStatusOptions {
  /** Show toast notifications for network changes */
  showToasts?: boolean;
  /** Callback when network comes back online */
  onReconnect?: () => void;
  /** Callback when network goes offline */
  onDisconnect?: () => void;
}

export function useNetworkStatus(options: UseNetworkStatusOptions = {}) {
  const { showToasts = true, onReconnect, onDisconnect } = options;
  
  const [state, setState] = useState<NetworkState>({
    isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
    wasOffline: false,
    lastOnlineAt: null,
    connectionType: null,
  });
  
  const offlineToastId = useRef<string | number | null>(null);
  const pendingActions = useRef<Array<() => Promise<void>>>([]);

  // Get connection type if available
  const getConnectionType = useCallback((): string | null => {
    if ('connection' in navigator) {
      const conn = (navigator as any).connection;
      return conn?.effectiveType || conn?.type || null;
    }
    return null;
  }, []);

  // Execute pending actions when back online
  const executePendingActions = useCallback(async () => {
    const actions = [...pendingActions.current];
    pendingActions.current = [];
    
    for (const action of actions) {
      try {
        await action();
      } catch (error) {
        console.error('[Network] Failed to execute pending action:', error);
      }
    }
  }, []);

  // Handle online event
  const handleOnline = useCallback(() => {
    console.log('[Network] Connection restored');
    
    setState(prev => ({
      ...prev,
      isOnline: true,
      wasOffline: true,
      lastOnlineAt: new Date(),
      connectionType: getConnectionType(),
    }));

    // Dismiss offline toast
    if (offlineToastId.current) {
      toast.dismiss(offlineToastId.current);
      offlineToastId.current = null;
    }

    if (showToasts) {
      toast.success('Back online', {
        description: 'Your connection has been restored.',
        duration: 3000,
      });
    }

    // Execute any pending actions
    executePendingActions();
    
    onReconnect?.();
  }, [showToasts, onReconnect, getConnectionType, executePendingActions]);

  // Handle offline event
  const handleOffline = useCallback(() => {
    console.log('[Network] Connection lost');
    
    setState(prev => ({
      ...prev,
      isOnline: false,
      connectionType: null,
    }));

    if (showToasts) {
      offlineToastId.current = toast.error('You\'re offline', {
        description: 'Check your internet connection. Changes will sync when you\'re back online.',
        duration: Infinity, // Stay until dismissed or online
        action: {
          label: 'Retry',
          onClick: () => {
            // Try to ping to check if actually offline
            fetch('/favicon.ico', { mode: 'no-cors', cache: 'no-store' })
              .then(() => handleOnline())
              .catch(() => {
                toast.error('Still offline', { duration: 2000 });
              });
          },
        },
      });
    }

    onDisconnect?.();
  }, [showToasts, onDisconnect, handleOnline]);

  // Queue an action to be executed when back online
  const queueAction = useCallback((action: () => Promise<void>) => {
    if (state.isOnline) {
      // Execute immediately if online
      action().catch(console.error);
    } else {
      // Queue for later
      pendingActions.current.push(action);
      if (showToasts) {
        toast.info('Action queued', {
          description: 'This will be completed when you\'re back online.',
          duration: 3000,
        });
      }
    }
  }, [state.isOnline, showToasts]);

  // Check if a fetch error is network-related
  const isNetworkError = useCallback((error: unknown): boolean => {
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      return true;
    }
    if (error instanceof Error) {
      const message = error.message.toLowerCase();
      return (
        message.includes('network') ||
        message.includes('offline') ||
        message.includes('internet') ||
        message.includes('connection')
      );
    }
    return false;
  }, []);

  useEffect(() => {
    // Set initial connection type
    setState(prev => ({
      ...prev,
      connectionType: getConnectionType(),
    }));

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Listen for connection type changes
    if ('connection' in navigator) {
      const conn = (navigator as any).connection;
      conn?.addEventListener?.('change', () => {
        setState(prev => ({
          ...prev,
          connectionType: getConnectionType(),
        }));
      });
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [handleOnline, handleOffline, getConnectionType]);

  return {
    ...state,
    queueAction,
    isNetworkError,
    pendingActionCount: pendingActions.current.length,
  };
}

export default useNetworkStatus;
