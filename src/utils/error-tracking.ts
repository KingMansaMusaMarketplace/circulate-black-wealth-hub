/**
 * Error Tracking Utilities
 * Central place for error logging and tracking
 * Ready to integrate with services like Sentry, LogRocket, etc.
 */

export interface ErrorContext {
  user?: {
    id: string;
    email?: string;
    role?: string;
  };
  route?: string;
  component?: string;
  action?: string;
  metadata?: Record<string, any>;
}

export interface ErrorLog {
  error: Error;
  context: ErrorContext;
  timestamp: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

class ErrorTracker {
  private static instance: ErrorTracker;
  private errorLogs: ErrorLog[] = [];
  private maxLogs = 100;

  private constructor() {
    // Set up global error handlers
    this.setupGlobalHandlers();
  }

  static getInstance(): ErrorTracker {
    if (!ErrorTracker.instance) {
      ErrorTracker.instance = new ErrorTracker();
    }
    return ErrorTracker.instance;
  }

  /**
   * Set up global error handlers
   */
  private setupGlobalHandlers() {
    // Catch unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.logError(
        new Error(event.reason),
        {
          component: 'Global',
          action: 'unhandledrejection',
        },
        'high'
      );
    });

    // Catch global errors
    window.addEventListener('error', (event) => {
      this.logError(
        event.error || new Error(event.message),
        {
          component: 'Global',
          action: 'error',
          metadata: {
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno,
          },
        },
        'high'
      );
    });
  }

  /**
   * Log an error
   */
  logError(
    error: Error,
    context: ErrorContext = {},
    severity: ErrorLog['severity'] = 'medium'
  ) {
    const errorLog: ErrorLog = {
      error,
      context,
      timestamp: Date.now(),
      severity,
    };

    // Add to local logs
    this.errorLogs.push(errorLog);
    if (this.errorLogs.length > this.maxLogs) {
      this.errorLogs.shift();
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error tracked:', {
        message: error.message,
        stack: error.stack,
        context,
        severity,
      });
    }

    // TODO: Send to error tracking service
    // this.sendToService(errorLog);
  }

  /**
   * Log a warning (non-error issue)
   */
  logWarning(message: string, context: ErrorContext = {}) {
    this.logError(new Error(message), context, 'low');
  }

  /**
   * Log info for debugging
   */
  logInfo(message: string, metadata?: Record<string, any>) {
    if (process.env.NODE_ENV === 'development') {
      console.info('Info:', message, metadata);
    }
  }

  /**
   * Get recent error logs
   */
  getRecentLogs(count = 10): ErrorLog[] {
    return this.errorLogs.slice(-count);
  }

  /**
   * Clear error logs
   */
  clearLogs() {
    this.errorLogs = [];
  }

  /**
   * Send error to external service (placeholder)
   * Integrate with Sentry, LogRocket, etc.
   */
  private sendToService(errorLog: ErrorLog) {
    // Example Sentry integration:
    // if (window.Sentry) {
    //   window.Sentry.captureException(errorLog.error, {
    //     level: errorLog.severity,
    //     tags: {
    //       component: errorLog.context.component,
    //       route: errorLog.context.route,
    //     },
    //     user: errorLog.context.user,
    //     extra: errorLog.context.metadata,
    //   });
    // }

    // Example LogRocket integration:
    // if (window.LogRocket) {
    //   window.LogRocket.captureException(errorLog.error, {
    //     tags: errorLog.context,
    //   });
    // }
  }
}

// Export singleton instance
export const errorTracker = ErrorTracker.getInstance();

/**
 * React hook for error tracking
 */
export const useErrorTracking = () => {
  const logError = (error: Error, context?: ErrorContext, severity?: ErrorLog['severity']) => {
    errorTracker.logError(error, context, severity);
  };

  const logWarning = (message: string, context?: ErrorContext) => {
    errorTracker.logWarning(message, context);
  };

  const logInfo = (message: string, metadata?: Record<string, any>) => {
    errorTracker.logInfo(message, metadata);
  };

  return { logError, logWarning, logInfo };
};

/**
 * Higher-order function to wrap async functions with error tracking
 */
export const withErrorTracking = <T extends (...args: any[]) => Promise<any>>(
  fn: T,
  context: ErrorContext
): T => {
  return (async (...args: Parameters<T>) => {
    try {
      return await fn(...args);
    } catch (error) {
      errorTracker.logError(error as Error, context, 'high');
      throw error;
    }
  }) as T;
};
