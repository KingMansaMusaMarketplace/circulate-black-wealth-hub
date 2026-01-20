import React, { useState, useEffect } from 'react';
import { Home, RefreshCw, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * Global Error Recovery Component
 * Provides a floating escape button that appears when the app detects an error state
 * This ensures users are NEVER stuck on a dead-end screen
 */
export const GlobalErrorRecovery: React.FC = () => {
  const [showRecovery, setShowRecovery] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    // Listen for unhandled errors
    const handleError = (event: ErrorEvent) => {
      console.error('[GlobalErrorRecovery] Caught error:', event.message);
      setErrorMessage(event.message);
      setShowRecovery(true);
    };

    // Listen for unhandled promise rejections
    const handleRejection = (event: PromiseRejectionEvent) => {
      console.error('[GlobalErrorRecovery] Caught rejection:', event.reason);
      setErrorMessage(String(event.reason));
      setShowRecovery(true);
    };

    // Listen for custom error events from the app
    const handleCustomError = (event: CustomEvent) => {
      setErrorMessage(event.detail?.message || 'An error occurred');
      setShowRecovery(true);
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleRejection);
    window.addEventListener('app:error' as any, handleCustomError);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleRejection);
      window.removeEventListener('app:error' as any, handleCustomError);
    };
  }, []);

  // Auto-hide after 30 seconds if user doesn't interact
  useEffect(() => {
    if (showRecovery) {
      const timer = setTimeout(() => {
        setShowRecovery(false);
        setErrorMessage(null);
      }, 30000);
      return () => clearTimeout(timer);
    }
  }, [showRecovery]);

  const handleGoHome = () => {
    setShowRecovery(false);
    // Force full page reload to clear any error state
    window.location.href = '/';
  };

  const handleReload = () => {
    setShowRecovery(false);
    window.location.reload();
  };

  const handleDismiss = () => {
    setShowRecovery(false);
    setErrorMessage(null);
  };

  if (!showRecovery) return null;

  return (
    <div 
      className="fixed bottom-20 left-0 right-0 z-[9999] px-4 animate-in slide-in-from-bottom-4 duration-300"
      role="alert"
      aria-live="assertive"
    >
      <div className="max-w-md mx-auto bg-destructive/95 backdrop-blur-sm text-destructive-foreground rounded-lg shadow-lg p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm">Something went wrong</p>
            {errorMessage && (
              <p className="text-xs mt-1 opacity-90 truncate">
                {errorMessage.slice(0, 100)}
              </p>
            )}
          </div>
          <button 
            onClick={handleDismiss}
            className="text-destructive-foreground/70 hover:text-destructive-foreground text-lg leading-none"
            aria-label="Dismiss error"
          >
            ×
          </button>
        </div>
        
        <div className="flex gap-2 mt-3">
          <Button 
            onClick={handleGoHome}
            size="sm"
            variant="secondary"
            className="flex-1 bg-background/20 hover:bg-background/30 text-destructive-foreground border-0"
          >
            <Home className="h-4 w-4 mr-1.5" />
            Go Home
          </Button>
          <Button 
            onClick={handleReload}
            size="sm"
            variant="secondary"
            className="flex-1 bg-background/20 hover:bg-background/30 text-destructive-foreground border-0"
          >
            <RefreshCw className="h-4 w-4 mr-1.5" />
            Reload
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GlobalErrorRecovery;
