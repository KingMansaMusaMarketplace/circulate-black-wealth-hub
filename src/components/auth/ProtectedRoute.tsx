
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Loading from '@/components/ui/loading';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredUserType?: 'customer' | 'business' | null;
  requiredRole?: 'admin' | null;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredUserType,
  requiredRole
}) => {
  const { user, loading, userType, checkSession, authInitialized } = useAuth();
  const [isVerifying, setIsVerifying] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const verifyAuth = async () => {
      // Wait for auth to be initialized
      if (!loading && authInitialized) {
        // If user is already set, we can determine auth status immediately
        if (user) {
          // Check for admin role if required
          if (requiredRole === 'admin') {
            const isAdmin = user.user_metadata?.role === 'admin' || user.user_metadata?.is_admin;
            setIsAuthenticated(isAdmin);
            setIsVerifying(false);
            return;
          }
          
          // If a specific user type is required, check that as well
          setIsAuthenticated(
            !requiredUserType || userType === requiredUserType
          );
          setIsVerifying(false);
          return;
        }
        
        // Otherwise, verify with the server
        const authenticated = await checkSession();
        console.log("Session verification result:", authenticated);
        setIsAuthenticated(authenticated);
        setIsVerifying(false);
      }
    };
    
    verifyAuth();
  }, [user, loading, userType, requiredUserType, requiredRole, checkSession, authInitialized]);

  if (loading || isVerifying) {
    return <Loading fullScreen text="Verifying authentication..." />;
  }

  if (!isAuthenticated) {
    console.log("User not authenticated, redirecting to login", location.pathname);
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // If we require a specific user type and the user doesn't match
  if (requiredUserType && userType !== requiredUserType) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="mb-6 text-gray-700">
            You need to be a {requiredUserType} to access this page.
          </p>
          <button 
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-mansablue text-white rounded hover:bg-opacity-90 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // If we require admin role and user doesn't have it
  if (requiredRole === 'admin' && !(user?.user_metadata?.role === 'admin' || user?.user_metadata?.is_admin)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Admin Access Required</h1>
          <p className="mb-6 text-gray-700">
            You need admin privileges to access this page.
          </p>
          <button 
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-mansablue text-white rounded hover:bg-opacity-90 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
