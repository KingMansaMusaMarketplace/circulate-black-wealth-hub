import React from 'react';
import { useRouteError, isRouteErrorResponse, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { AlertTriangle, Home, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
    <div className="min-h-screen flex items-center justify-center gradient-primary relative overflow-hidden p-4">
      <Helmet>
        <title>{errorStatus} - {is404 ? 'Page Not Found' : 'Error'} | Mansa Musa Marketplace</title>
      </Helmet>
      
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
            {is404 ? 'Page Not Found' : 'Oops! Something went wrong'}
          </h1>
          
          {/* Description */}
          <p className="text-white/80 mb-6 font-body">
            {is404 
              ? "The page you're looking for doesn't exist or has been moved."
              : "We apologize for the inconvenience. Please try again."
            }
          </p>
          
          {/* Dev Error Message */}
          {process.env.NODE_ENV === 'development' && !is404 && (
            <div className="p-3 bg-black/30 backdrop-blur-sm rounded-lg text-xs font-mono text-left overflow-auto max-h-32 mb-6 border border-white/10">
              <span className="text-red-300">{errorMessage}</span>
            </div>
          )}
          
          {/* Buttons */}
          <div className="flex flex-col space-y-3">
            <Button asChild className="w-full bg-mansagold hover:bg-mansagold-dark text-mansablue font-semibold">
              <Link to="/">
                <Home className="h-4 w-4 mr-2" />
                Go Home
              </Link>
            </Button>
            <Button 
              variant="outline" 
              onClick={() => window.history.back()} 
              className="w-full border-white/30 text-white hover:bg-white/10 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          </div>
          
          {/* 404 Helpful Links */}
          {is404 && (
            <div className="mt-6 p-4 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
              <p className="text-sm text-mansagold font-semibold mb-2">
                Looking for something specific?
              </p>
              <ul className="text-sm text-white/80 space-y-1">
                <li>
                  <Link to="/directory" className="hover:text-mansagold transition-colors underline underline-offset-2">
                    Browse Business Directory
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="hover:text-mansagold transition-colors underline underline-offset-2">
                    Learn About Us
                  </Link>
                </li>
                <li>
                  <Link to="/help" className="hover:text-mansagold transition-colors underline underline-offset-2">
                    Get Help
                  </Link>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
