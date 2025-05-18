
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

// Error response type
export interface ErrorResponse {
  message: string;
  code?: string;
  reference?: string;
}

// Type for logged errors
export interface LoggedError extends Error {
  reference?: string;
  details?: Record<string, any>;
}

// Handle API errors
export const handleApiError = async (
  error: any,
  operationName: string,
  details?: Record<string, any>
): Promise<LoggedError> => {
  // Create structured error
  const errorMessage = error?.message || error?.error?.message || 'An unknown error occurred';
  const errorDetails = {
    code: error?.code || 'UNKNOWN_ERROR',
    originalError: error,
    ...(details || {})
  };

  try {
    // Log error to database
    const { data, error: logError } = await supabase.rpc('handle_api_error', {
      operation_name: operationName,
      error_message: errorMessage,
      error_details: errorDetails
    });

    if (!logError && data?.error?.reference) {
      console.error(`Error logged with reference: ${data.error.reference}`);
      
      const loggedError = new Error(errorMessage) as LoggedError;
      loggedError.reference = data.error.reference;
      loggedError.details = errorDetails;
      return loggedError;
    }
    
    // Fallback if logging to database failed
    console.error(`Error in ${operationName}:`, error);
  } catch (logError) {
    // If error logging fails, at least console.log it
    console.error('Failed to log error:', logError);
    console.error(`Original error in ${operationName}:`, error);
  }
  
  const genericError = new Error(errorMessage) as LoggedError;
  genericError.details = errorDetails;
  return genericError;
};

// Display friendly error messages to users
export const showUserFriendlyError = (error: any, operation: string): void => {
  let message = 'Something went wrong. Please try again later.';
  
  if (error?.message) {
    // Clean up error message to be user-friendly
    message = error.message
      .replace(/^error:/i, '')
      .replace(/Error executing query/i, 'Could not complete operation')
      .replace(/supabase/i, 'server')
      .trim();
  }
  
  const reference = (error as LoggedError)?.reference;
  if (reference) {
    message += ` (Ref: ${reference.slice(0, 6)})`;
  }
  
  toast.error(message);
  
  // Additional logging for developers
  console.error(`Error in ${operation}:`, error);
};

// Function to check rate limits before performing operations
export const checkRateLimit = async (
  operationName: string, 
  limitPerMinute = 60
): Promise<boolean> => {
  try {
    const { data, error } = await supabase.rpc('check_rate_limit', {
      operation_name: operationName,
      limit_per_minute: limitPerMinute
    });
    
    if (error) {
      console.error('Rate limit check error:', error);
      return true; // On error, allow the operation to proceed
    }
    
    if (!data) {
      toast.error('You are making too many requests. Please slow down.');
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Rate limit check failed:', error);
    return true; // On error, allow the operation to proceed
  }
};

// Log important user activities for auditing
export const logActivity = async (
  activityType: string,
  entityType: string,
  entityId: string,
  details?: Record<string, any>
): Promise<void> => {
  try {
    await supabase.rpc('log_activity', {
      activity_type: activityType,
      entity_type: entityType,
      entity_id: entityId,
      details
    });
  } catch (error) {
    console.error('Failed to log activity:', error);
  }
};
