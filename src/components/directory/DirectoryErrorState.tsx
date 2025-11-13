
import React from 'react';
import { AlertCircle, RefreshCw } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface DirectoryErrorStateProps {
  error: string;
  onRetry?: () => void;
}

const DirectoryErrorState: React.FC<DirectoryErrorStateProps> = ({ error, onRetry }) => {
  return (
    <div className="flex items-center justify-center min-h-[400px] animate-fade-in">
      <Alert variant="destructive" className="glass-card border-red-500/30 max-w-2xl">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-red-500/10 rounded-full">
            <AlertCircle className="h-6 w-6 text-red-500" />
          </div>
          <div className="flex-1 space-y-3">
            <AlertTitle className="text-lg font-display font-semibold">
              Something went wrong
            </AlertTitle>
            <AlertDescription className="font-body text-base">
              {error}. Please try refreshing the page or contact support if the problem persists.
            </AlertDescription>
            {onRetry && (
              <Button 
                onClick={onRetry} 
                variant="outline"
                className="mt-4 gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Try Again
              </Button>
            )}
          </div>
        </div>
      </Alert>
    </div>
  );
};

export default DirectoryErrorState;
