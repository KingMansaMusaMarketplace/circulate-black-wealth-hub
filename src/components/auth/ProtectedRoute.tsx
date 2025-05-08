import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredUserType?: 'customer' | 'business' | null;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredUserType 
}) => {
  const { user, loading, userType, checkSession } = useAuth();
  const [isVerifying, setIsVerifying] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const verifyAuth = async () => {
      if (!loading) {
        // If user is already set, we can determine auth status immediately
        if (user) {
          // If a specific user type is required, check that as well
          setIsAuthenticated(
            !requiredUserType || userType === requiredUserType
          );
          setIsVerifying(false);
          return;
        }
        
        // Otherwise, verify with the server
        const authenticated = await checkSession();
        setIsAuthenticated(authenticated);
        setIsVerifying(false);
      }
    };
    
    verifyAuth();
  }, [user, loading, userType, requiredUserType, checkSession]);

  if (loading || isVerifying) {
    // Show loading state while checking authentication
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-mansablue mx-auto mb-4" />
          <p className="text-gray-600">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
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

  return <>{children}</>;
};

export default ProtectedRoute;
