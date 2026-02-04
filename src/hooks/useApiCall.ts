/**
 * Unified API call hook with automatic error handling, retries, and user feedback
 * Wraps async operations with consistent error handling patterns
 */

import { useState, useCallback, useRef } from 'react';
import { toast } from 'sonner';
import { useNetworkStatus } from './useNetworkStatus';

interface ApiCallState<T> {
  data: T | null;
  error: Error | null;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
}

interface ApiCallOptions {
  /** Custom error message to show (overrides auto-generated) */
  errorMessage?: string;
  /** Custom success message */
  successMessage?: string;
  /** Number of retry attempts for transient failures */
  retries?: number;
  /** Delay between retries in ms (doubles each attempt) */
  retryDelay?: number;
  /** Show toast on error */
  showErrorToast?: boolean;
  /** Show toast on success */
  showSuccessToast?: boolean;
  /** Called before each retry attempt */
  onRetry?: (attempt: number, error: Error) => void;
  /** Entity name for error messages (e.g., "business", "user") */
  entityName?: string;
}

const DEFAULT_OPTIONS: ApiCallOptions = {
  retries: 2,
  retryDelay: 1000,
  showErrorToast: true,
  showSuccessToast: false,
  entityName: 'data',
};

/**
 * Transform technical errors into user-friendly messages
 */
function getUserFriendlyError(error: Error, entityName: string): string {
  const message = error.message.toLowerCase();
  
  // Network errors
  if (message.includes('failed to fetch') || message.includes('network')) {
    return 'Unable to connect. Please check your internet connection.';
  }
  
  // Auth errors
  if (message.includes('unauthorized') || message.includes('401')) {
    return 'Your session has expired. Please log in again.';
  }
  if (message.includes('forbidden') || message.includes('403')) {
    return `You don't have permission to access this ${entityName}.`;
  }
  
  // Not found
  if (message.includes('not found') || message.includes('404')) {
    return `This ${entityName} could not be found.`;
  }
  
  // Database/validation errors
  if (message.includes('uuid') || message.includes('invalid input')) {
    return `Invalid ${entityName} ID. The link may be broken.`;
  }
  if (message.includes('duplicate') || message.includes('unique constraint')) {
    return `This ${entityName} already exists.`;
  }
  if (message.includes('rls') || message.includes('row-level security')) {
    return `You don't have permission to access this ${entityName}.`;
  }
  
  // Rate limiting
  if (message.includes('rate limit') || message.includes('429')) {
    return 'Too many requests. Please wait a moment and try again.';
  }
  
  // Server errors
  if (message.includes('500') || message.includes('internal server')) {
    return 'Server error. Our team has been notified. Please try again later.';
  }
  
  // Timeout
  if (message.includes('timeout') || message.includes('timed out')) {
    return 'Request timed out. Please try again.';
  }
  
  // Default
  return `Unable to load ${entityName}. Please try again.`;
}

/**
 * Check if an error is retryable (transient)
 */
function isRetryableError(error: Error): boolean {
  const message = error.message.toLowerCase();
  return (
    message.includes('network') ||
    message.includes('failed to fetch') ||
    message.includes('timeout') ||
    message.includes('429') ||
    message.includes('503') ||
    message.includes('502')
  );
}

/**
 * Sleep utility for retry delays
 */
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Hook for making API calls with unified error handling
 */
export function useApiCall<T>() {
  const [state, setState] = useState<ApiCallState<T>>({
    data: null,
    error: null,
    isLoading: false,
    isSuccess: false,
    isError: false,
  });
  
  const { isOnline, queueAction } = useNetworkStatus({ showToasts: false });
  const abortControllerRef = useRef<AbortController | null>(null);

  const execute = useCallback(async (
    asyncFn: (signal?: AbortSignal) => Promise<T>,
    options: ApiCallOptions = {}
  ): Promise<T | null> => {
    const opts = { ...DEFAULT_OPTIONS, ...options };
    
    // Cancel any in-flight request
    abortControllerRef.current?.abort();
    abortControllerRef.current = new AbortController();
    
    // Check offline status
    if (!isOnline) {
      const offlineError = new Error('You are currently offline');
      setState({
        data: null,
        error: offlineError,
        isLoading: false,
        isSuccess: false,
        isError: true,
      });
      
      if (opts.showErrorToast) {
        toast.error('You\'re offline', {
          description: 'This action will be completed when you\'re back online.',
          action: {
            label: 'Queue Action',
            onClick: () => queueAction(() => asyncFn().then(() => {})),
          },
        });
      }
      return null;
    }

    setState(prev => ({
      ...prev,
      isLoading: true,
      isError: false,
      error: null,
    }));

    let lastError: Error | null = null;
    let attempt = 0;

    while (attempt <= (opts.retries || 0)) {
      try {
        const result = await asyncFn(abortControllerRef.current?.signal);
        
        setState({
          data: result,
          error: null,
          isLoading: false,
          isSuccess: true,
          isError: false,
        });

        if (opts.showSuccessToast && opts.successMessage) {
          toast.success(opts.successMessage);
        }

        return result;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        
        // Don't retry aborted requests
        if (lastError.name === 'AbortError') {
          setState(prev => ({ ...prev, isLoading: false }));
          return null;
        }

        // Check if we should retry
        const shouldRetry = attempt < (opts.retries || 0) && isRetryableError(lastError);
        
        if (shouldRetry) {
          attempt++;
          opts.onRetry?.(attempt, lastError);
          console.log(`[API] Retry attempt ${attempt} after error:`, lastError.message);
          await sleep((opts.retryDelay || 1000) * Math.pow(2, attempt - 1));
          continue;
        }

        break;
      }
    }

    // All retries exhausted or non-retryable error
    const userMessage = opts.errorMessage || 
      getUserFriendlyError(lastError!, opts.entityName || 'data');

    setState({
      data: null,
      error: lastError,
      isLoading: false,
      isSuccess: false,
      isError: true,
    });

    if (opts.showErrorToast) {
      toast.error(userMessage, {
        action: isRetryableError(lastError!) ? {
          label: 'Retry',
          onClick: () => execute(asyncFn, options),
        } : undefined,
      });
    }

    console.error('[API] Call failed:', lastError);
    return null;
  }, [isOnline, queueAction]);

  const reset = useCallback(() => {
    abortControllerRef.current?.abort();
    setState({
      data: null,
      error: null,
      isLoading: false,
      isSuccess: false,
      isError: false,
    });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
}

export default useApiCall;
