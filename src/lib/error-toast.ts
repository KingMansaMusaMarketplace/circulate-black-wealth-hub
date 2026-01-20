/**
 * Error Toast Utilities with Recovery Actions
 * Provides user-friendly error messages with navigation options
 */

import { toast } from 'sonner';

/**
 * Shows an error toast with a "Go Home" action button
 */
export const showErrorWithRecovery = (
  message: string,
  options?: {
    description?: string;
    showRetry?: boolean;
    onRetry?: () => void;
  }
) => {
  const toastId = toast.error(message, {
    description: options?.description,
    duration: 10000, // Longer duration so users can click
    action: {
      label: 'Go Home',
      onClick: () => {
        toast.dismiss(toastId);
        // Use location.href for guaranteed navigation
        window.location.href = '/';
      },
    },
  });

  return toastId;
};

/**
 * Shows a database error with recovery options
 */
export const showDatabaseError = (
  originalError?: string,
  entityName: string = 'data'
) => {
  // Clean up technical error messages for users
  let userMessage = `Unable to load ${entityName}`;
  
  if (originalError?.includes('uuid')) {
    userMessage = `Invalid ${entityName} ID. The link may be broken.`;
  } else if (originalError?.includes('network') || originalError?.includes('fetch')) {
    userMessage = 'Network error. Please check your connection.';
  } else if (originalError?.includes('permission') || originalError?.includes('RLS')) {
    userMessage = `You don't have permission to view this ${entityName}.`;
  }

  return showErrorWithRecovery(userMessage, {
    description: 'Try going back or returning to the home page.',
  });
};

/**
 * Shows an error for invalid route/navigation
 */
export const showNavigationError = (pageName: string = 'page') => {
  return showErrorWithRecovery(`This ${pageName} couldn't be found`, {
    description: 'The link may be broken or the content was removed.',
  });
};
