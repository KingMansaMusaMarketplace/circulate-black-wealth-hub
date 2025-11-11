import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Loading from '@/components/ui/loading';
import { Button } from '@/components/ui/button';

interface RequireAdminProps {
  children: React.ReactNode;
}

const RequireAdmin: React.FC<RequireAdminProps> = ({ children }) => {
  const { user, loading, userRole } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Loading fullScreen text="Checking admin access..." />;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user has admin role
  if (userRole !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Admin Access Required</h1>
          <p className="mb-6 text-gray-700">
            This area is restricted to administrators only. Please contact support if you believe this is an error.
          </p>
          <Button 
            onClick={() => window.history.back()}
            className="bg-mansablue text-white hover:bg-mansablue-dark"
          >
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default RequireAdmin;