import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAuth = true 
}) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-mansablue" />
      </div>
    );
  }

  // Enhanced authentication check to prevent loops
  if (requireAuth && !user) {
    // Only redirect if we're not already on an auth page
    const currentPath = window.location.pathname;
    if (currentPath !== '/auth' && currentPath !== '/login' && currentPath !== '/signup') {
      return <Navigate to="/auth" replace />;
    }
  }

  if (!requireAuth && user) {
    // Only redirect authenticated users away from auth pages if they're specifically on those pages
    const currentPath = window.location.pathname;
    if (currentPath === '/auth' || currentPath === '/login' || currentPath === '/signup') {
      return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;