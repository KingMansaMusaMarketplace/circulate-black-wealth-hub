
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
    // Log error using exec_sql since handle_api_error function might not be in types
    const { data, error: logError } = await supabase.rpc('exec_sql', {
      query: `
        SELECT * FROM handle_api_error(
          '${operationName}',
          '${errorMessage.replace(/'/g, "''")}',
          '${JSON.stringify(errorDetails).replace(/'/g, "''")}'
        )
      `
    });

    if (!logError) {
      // Try to extract reference from the response if possible
      let reference: string | undefined;
      try {
        if (typeof data === 'string') {
          const jsonData = JSON.parse(data);
          reference = jsonData.error?.reference;
        }
      } catch (parseError) {
        console.error('Error parsing error response:', parseError);
      }

      if (reference) {
        console.error(`Error logged with reference: ${reference}`);
        
        const loggedError = new Error(errorMessage) as LoggedError;
        loggedError.reference = reference;
        loggedError.details = errorDetails;
        return loggedError;
      }
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
    // Use exec_sql since check_rate_limit function might not be in types
    const { data, error } = await supabase.rpc('exec_sql', {
      query: `
        SELECT * FROM check_rate_limit(
          '${operationName}',
          ${limitPerMinute}
        )
      `
    });
    
    if (error) {
      console.error('Rate limit check error:', error);
      return true; // On error, allow the operation to proceed
    }
    
    // Parse the response
    let isAllowed = true;
    if (typeof data === 'string') {
      try {
        isAllowed = data === 't' || data === 'true'; // 't' for true in PostgreSQL text output
      } catch (parseError) {
        console.error('Error parsing rate limit response:', parseError);
      }
    }
    
    if (!isAllowed) {
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
    // Use exec_sql since log_activity function might not be in types
    await supabase.rpc('exec_sql', {
      query: `
        SELECT * FROM log_activity(
          '${activityType}',
          '${entityType}',
          '${entityId}',
          '${details ? JSON.stringify(details).replace(/'/g, "''") : null}'
        )
      `
    });
  } catch (error) {
    console.error('Failed to log activity:', error);
  }
};
