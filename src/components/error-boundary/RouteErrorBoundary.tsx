import React from 'react';
import { useRouteError, isRouteErrorResponse, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';

export const RouteErrorBoundary: React.FC = () => {
  const error = useRouteError();
  const navigate = useNavigate();

  let errorMessage: string;
  let errorTitle: string;
  let errorStatus = 500;

  if (isRouteErrorResponse(error)) {
    errorTitle = `${error.status} ${error.statusText}`;
    errorMessage = error.data?.message || 'An error occurred while loading this page.';
    errorStatus = error.status;
  } else if (error instanceof Error) {
    errorTitle = 'Application Error';
    errorMessage = error.message;
  } else {
    errorTitle = 'Unknown Error';
    errorMessage = 'Something went wrong. Please try again.';
  }

  const is404 = errorStatus === 404;

  return (
    <div className="min-h-screen flex items-center justify-center gradient-primary relative overflow-hidden p-4">
      {/* Animated Gradient Orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-mansagold/20 blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-mansagold/15 blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/3 w-64 h-64 rounded-full bg-white/5 blur-2xl animate-float" style={{ animationDelay: '4s' }}></div>
        <div className="absolute bottom-1/4 left-1/4 w-48 h-48 rounded-full bg-mansagold/10 blur-2xl animate-float" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Glass Card */}
      <div className="relative z-10 w-full max-w-md">
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 text-center shadow-2xl">
          {/* Icon */}
          <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center bg-mansagold/20 border border-mansagold/30">
            <AlertTriangle className="h-10 w-10 text-mansagold" />
          </div>

          {/* Error Status */}
          <div className="text-7xl font-bold text-mansagold/80 mb-4 font-display">
            {errorStatus}
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-white mb-3 font-display">
            {errorTitle}
          </h1>

          {/* Description */}
          <p className="text-white/80 mb-6 font-body">
            {errorMessage}
          </p>

          {/* Buttons */}
          <div className="flex flex-col space-y-3">
            <Button
              onClick={() => window.location.reload()}
              className="w-full bg-mansagold hover:bg-mansagold-dark text-mansablue font-semibold"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Reload Page
            </Button>
            <Button
              onClick={() => navigate('/')}
              variant="outline"
              className="w-full border-white/30 text-white hover:bg-white/10 hover:text-white"
            >
              <Home className="mr-2 h-4 w-4" />
              Go Home
            </Button>
          </div>

          {/* Help Text */}
          <p className="text-sm text-white/60 mt-6">
            If this problem persists, please contact support.
          </p>
        </div>
      </div>
    </div>
  );
};
