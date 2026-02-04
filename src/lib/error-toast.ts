/**
 * Error Toast Utilities with Recovery Actions
 * Provides user-friendly error messages with navigation and retry options
 */

import { toast } from 'sonner';

type ErrorToastId = string | number;

interface RecoveryOptions {
  description?: string;
  showRetry?: boolean;
  onRetry?: () => void;
  /** Duration in ms (default: 10000) */
  duration?: number;
  /** Show "Go Home" button */
  showHomeButton?: boolean;
}

/**
 * Shows an error toast with a "Go Home" action button
 */
export const showErrorWithRecovery = (
  message: string,
  options: RecoveryOptions = {}
): ErrorToastId => {
  const {
    description,
    showRetry = false,
    onRetry,
    duration = 10000,
    showHomeButton = true,
  } = options;

  const toastId = toast.error(message, {
    description,
    duration,
    action: showRetry && onRetry
      ? {
          label: 'Retry',
          onClick: () => {
            toast.dismiss(toastId);
            onRetry();
          },
        }
      : showHomeButton
      ? {
          label: 'Go Home',
          onClick: () => {
            toast.dismiss(toastId);
            window.location.href = '/';
          },
        }
      : undefined,
  });

  return toastId;
};

/**
 * Shows a database error with contextual recovery options
 */
export const showDatabaseError = (
  originalError?: string,
  entityName: string = 'data'
): ErrorToastId => {
  const errorLower = originalError?.toLowerCase() || '';
  let userMessage = `Unable to load ${entityName}`;
  let description = 'Please try again or return to the home page.';

  if (errorLower.includes('uuid') || errorLower.includes('invalid input')) {
    userMessage = `Invalid ${entityName} ID`;
    description = 'The link may be broken or the item no longer exists.';
  } else if (errorLower.includes('network') || errorLower.includes('fetch') || errorLower.includes('failed to fetch')) {
    userMessage = 'Connection error';
    description = 'Please check your internet connection and try again.';
  } else if (errorLower.includes('permission') || errorLower.includes('rls') || errorLower.includes('denied')) {
    userMessage = `Access denied`;
    description = `You don't have permission to view this ${entityName}.`;
  } else if (errorLower.includes('not found') || errorLower.includes('no rows')) {
    userMessage = `${entityName.charAt(0).toUpperCase() + entityName.slice(1)} not found`;
    description = 'This item may have been deleted or moved.';
  } else if (errorLower.includes('timeout')) {
    userMessage = 'Request timed out';
    description = 'The server took too long to respond. Please try again.';
  }

  return showErrorWithRecovery(userMessage, { description });
};

/**
 * Shows an error for invalid route/navigation
 */
export const showNavigationError = (pageName: string = 'page'): ErrorToastId => {
  return showErrorWithRecovery(`This ${pageName} couldn't be found`, {
    description: 'The link may be broken or the content was removed.',
  });
};

/**
 * Shows a session expired error with login redirect
 */
export const showSessionExpiredError = (): ErrorToastId => {
  return toast.error('Session expired', {
    description: 'Please log in again to continue.',
    duration: 10000,
    action: {
      label: 'Log In',
      onClick: () => {
        window.location.href = '/login';
      },
    },
  });
};

/**
 * Shows a rate limit error with countdown
 */
export const showRateLimitError = (retryAfterSeconds: number = 60): ErrorToastId => {
  return toast.error('Too many requests', {
    description: `Please wait ${retryAfterSeconds} seconds before trying again.`,
    duration: retryAfterSeconds * 1000,
  });
};

/**
 * Shows a validation error for form submissions
 */
export const showValidationError = (
  fieldErrors: Record<string, string>
): ErrorToastId => {
  const errorMessages = Object.entries(fieldErrors)
    .map(([field, error]) => `${field}: ${error}`)
    .join('\n');

  return toast.error('Please fix the following errors', {
    description: errorMessages,
    duration: 8000,
  });
};

/**
 * Generic error handler that categorizes and shows appropriate toast
 */
export const handleErrorWithToast = (
  error: unknown,
  context: { entityName?: string; operation?: string } = {}
): ErrorToastId => {
  const { entityName = 'data', operation = 'operation' } = context;
  
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    
    // Check for specific error types
    if (message.includes('unauthorized') || message.includes('401')) {
      return showSessionExpiredError();
    }
    if (message.includes('rate limit') || message.includes('429')) {
      return showRateLimitError();
    }
    
    return showDatabaseError(error.message, entityName);
  }
  
  return showErrorWithRecovery(`Failed to complete ${operation}`, {
    description: 'An unexpected error occurred. Please try again.',
  });
};
