import React from 'react';
import { useRouteError, isRouteErrorResponse, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { AlertTriangle, Home, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const ErrorPage: React.FC = () => {
  const error = useRouteError();
  
  let errorMessage = 'An unexpected error occurred';
  let errorStatus = 500;
  
  if (isRouteErrorResponse(error)) {
    errorMessage = error.statusText || error.data?.message || errorMessage;
    errorStatus = error.status;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  const is404 = errorStatus === 404;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Helmet>
        <title>{errorStatus} - {is404 ? 'Page Not Found' : 'Error'} | Mansa Musa Marketplace</title>
      </Helmet>
      
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center bg-red-100">
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl">
            {is404 ? 'Page Not Found' : 'Oops! Something went wrong'}
          </CardTitle>
          <CardDescription>
            {is404 
              ? "The page you're looking for doesn't exist or has been moved."
              : "We apologize for the inconvenience. Please try again."
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-6xl font-bold text-gray-300 mb-4">
            {errorStatus}
          </div>
          
          {process.env.NODE_ENV === 'development' && !is404 && (
            <div className="p-3 bg-gray-100 rounded text-xs font-mono text-left overflow-auto max-h-32">
              {errorMessage}
            </div>
          )}
          
          <div className="flex flex-col space-y-2">
            <Button asChild className="w-full">
              <Link to="/">
                <Home className="h-4 w-4 mr-2" />
                Go Home
              </Link>
            </Button>
            <Button variant="outline" onClick={() => window.history.back()} className="w-full">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          </div>
          
          {is404 && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Looking for something specific?</strong>
              </p>
              <ul className="text-sm text-blue-700 mt-2 space-y-1">
                <li>• <Link to="/directory" className="underline">Browse Business Directory</Link></li>
                <li>• <Link to="/about" className="underline">Learn About Us</Link></li>
                <li>• <Link to="/help" className="underline">Get Help</Link></li>
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ErrorPage;