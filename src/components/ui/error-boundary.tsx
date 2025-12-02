import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  private handleRefresh = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

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

              {/* Title */}
              <h1 className="text-2xl font-bold text-white mb-3 font-display">
                Something went wrong
              </h1>

              {/* Description */}
              <p className="text-white/80 mb-6 font-body">
                We apologize for the inconvenience. An unexpected error occurred.
              </p>

              {/* Error Details (Development Only) */}
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="p-3 bg-black/30 backdrop-blur-sm rounded-lg text-xs font-mono overflow-auto max-h-32 mb-6 border border-white/10">
                  <span className="text-red-300">{this.state.error.message}</span>
                </div>
              )}

              {/* Buttons */}
              <div className="flex flex-col space-y-3">
                <Button 
                  onClick={this.handleRefresh} 
                  className="w-full bg-mansagold hover:bg-mansagold-dark text-mansablue font-semibold"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
                <Button 
                  variant="outline" 
                  onClick={this.handleGoHome} 
                  className="w-full border-white/30 text-white hover:bg-white/10 hover:text-white"
                >
                  <Home className="h-4 w-4 mr-2" />
                  Go Home
                </Button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
