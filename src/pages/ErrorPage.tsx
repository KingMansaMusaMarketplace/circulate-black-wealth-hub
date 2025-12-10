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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 relative overflow-hidden p-4">
      <Helmet>
        <title>{errorStatus} - {is404 ? 'Page Not Found' : 'Error'} | Mansa Musa Marketplace</title>
      </Helmet>
      
      {/* Animated Gradient Orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-mansagold/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-1/3 left-1/4 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />
        {/* Grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>
      
      {/* Glass Card */}
      <div className="relative z-10 w-full max-w-md animate-fade-in">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-xl" />
        <div className="relative backdrop-blur-xl bg-slate-900/80 border border-white/10 rounded-2xl p-8 text-center shadow-2xl">
          {/* Icon */}
          <div className="w-20 h-20 rounded-2xl mx-auto mb-6 flex items-center justify-center bg-gradient-to-br from-mansagold/30 to-orange-500/20 border border-mansagold/30 shadow-lg shadow-mansagold/20">
            <AlertTriangle className="h-10 w-10 text-mansagold" />
          </div>
          
          {/* Error Status */}
          <div className="text-7xl font-bold bg-gradient-to-r from-mansagold via-amber-400 to-orange-400 bg-clip-text text-transparent mb-4 font-display">
            {errorStatus}
          </div>
          
          {/* Title */}
          <h1 className="text-2xl font-bold text-white mb-3 font-display">
            {is404 ? 'Page Not Found' : 'Oops! Something went wrong'}
          </h1>
          
          {/* Description */}
          <p className="text-blue-200/80 mb-6 font-body text-lg">
            {is404 
              ? "The page you're looking for doesn't exist or has been moved."
              : "We apologize for the inconvenience. Please try again."
            }
          </p>
          
          {/* Dev Error Message */}
          {process.env.NODE_ENV === 'development' && !is404 && (
            <div className="p-3 bg-black/40 backdrop-blur-sm rounded-lg text-xs font-mono text-left overflow-auto max-h-32 mb-6 border border-red-500/30">
              <span className="text-red-400">{errorMessage}</span>
            </div>
          )}
          
          {/* Buttons */}
          <div className="flex flex-col space-y-3">
            <Button asChild className="w-full bg-gradient-to-r from-mansagold to-amber-500 hover:from-amber-500 hover:to-mansagold text-slate-900 font-semibold shadow-lg shadow-mansagold/30 hover:shadow-xl hover:shadow-mansagold/40 transition-all duration-300">
              <Link to="/">
                <Home className="h-4 w-4 mr-2" />
                Go Home
              </Link>
            </Button>
            <Button 
              variant="outline" 
              onClick={() => window.history.back()} 
              className="w-full border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white hover:border-white/30 transition-all duration-300"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          </div>
          
          {/* 404 Helpful Links */}
          {is404 && (
            <div className="mt-6 p-4 bg-blue-500/10 backdrop-blur-sm rounded-xl border border-blue-500/20">
              <p className="text-sm text-mansagold font-semibold mb-3">
                Looking for something specific?
              </p>
              <ul className="text-sm text-blue-200/90 space-y-2">
                <li>
                  <Link to="/directory" className="hover:text-mansagold transition-colors underline underline-offset-2 decoration-white/30 hover:decoration-mansagold">
                    Browse Business Directory
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="hover:text-mansagold transition-colors underline underline-offset-2 decoration-white/30 hover:decoration-mansagold">
                    Learn About Us
                  </Link>
                </li>
                <li>
                  <Link to="/help" className="hover:text-mansagold transition-colors underline underline-offset-2 decoration-white/30 hover:decoration-mansagold">
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
