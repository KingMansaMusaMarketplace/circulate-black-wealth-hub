import React, { Component, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface Props {
  children: ReactNode;
  sectionName: string;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Section-level error boundary that prevents component failures from crashing the entire page
 * Shows a graceful fallback UI and allows users to retry
 */
export class SectionErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error(`[SectionErrorBoundary] Error in ${this.props.sectionName}:`, error, errorInfo);
    
    // Call optional error callback
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div className="w-full py-8 px-4">
          <Card className="max-w-2xl mx-auto border-destructive/20">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-destructive" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-foreground mb-1">
                    Section Temporarily Unavailable
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    The {this.props.sectionName} section encountered an issue. 
                    The rest of the page is working normally.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Button
                      onClick={this.handleReset}
                      variant="outline"
                      size="sm"
                      className="gap-2"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Try Again
                    </Button>
                    <Button
                      onClick={() => window.location.reload()}
                      variant="ghost"
                      size="sm"
                    >
                      Refresh Page
                    </Button>
                  </div>
                  {process.env.NODE_ENV === 'development' && this.state.error && (
                    <details className="mt-4">
                      <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground">
                        Error Details (Dev Only)
                      </summary>
                      <pre className="mt-2 text-xs bg-muted p-3 rounded overflow-x-auto">
                        {this.state.error.message}
                        {'\n\n'}
                        {this.state.error.stack}
                      </pre>
                    </details>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
