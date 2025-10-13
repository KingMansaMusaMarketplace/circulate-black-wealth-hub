import React from 'react';
import { useRouteError, isRouteErrorResponse, useNavigate } from 'react-router-dom';
import { AlertTriangle, Home, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

/**
 * Route Error Boundary for React Router
 * Catches routing errors and displays appropriate error messages
 */
export const RouteErrorBoundary: React.FC = () => {
  const error = useRouteError();
  const navigate = useNavigate();

  // Check if it's a route error response (404, 500, etc.)
  if (isRouteErrorResponse(error)) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-muted/20">
        <Card className="w-full max-w-lg">
          <CardHeader>
            <div className="flex items-center gap-2 text-destructive mb-2">
              <AlertTriangle className="h-6 w-6" />
              <CardTitle>
                {error.status === 404 ? 'Page Not Found' : `Error ${error.status}`}
              </CardTitle>
            </div>
            <CardDescription>
              {error.status === 404
                ? "The page you're looking for doesn't exist."
                : error.statusText || 'An error occurred while loading this page.'}
            </CardDescription>
          </CardHeader>

          <CardContent>
            {error.data && (
              <p className="text-sm text-muted-foreground">{error.data}</p>
            )}
          </CardContent>

          <CardFooter className="flex gap-2">
            <Button onClick={() => navigate(-1)} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
            <Button onClick={() => navigate('/')}>
              <Home className="h-4 w-4 mr-2" />
              Go Home
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Generic error
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted/20">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <div className="flex items-center gap-2 text-destructive mb-2">
            <AlertTriangle className="h-6 w-6" />
            <CardTitle>Oops! Something went wrong</CardTitle>
          </div>
          <CardDescription>
            We encountered an unexpected error while loading this page.
          </CardDescription>
        </CardHeader>

        <CardContent>
          {process.env.NODE_ENV === 'development' && error instanceof Error && (
            <div className="p-4 bg-destructive/10 rounded-md">
              <p className="text-sm font-mono text-destructive">{error.message}</p>
              {error.stack && (
                <pre className="mt-2 text-xs overflow-auto max-h-48 text-destructive/80">
                  {error.stack}
                </pre>
              )}
            </div>
          )}
        </CardContent>

        <CardFooter className="flex gap-2">
          <Button onClick={() => navigate(-1)} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
          <Button onClick={() => navigate('/')}>
            <Home className="h-4 w-4 mr-2" />
            Go Home
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
