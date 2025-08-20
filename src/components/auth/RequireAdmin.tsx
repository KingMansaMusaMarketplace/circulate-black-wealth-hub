import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Loading from '@/components/ui/loading';

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
          <button 
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-mansablue text-white rounded hover:bg-opacity-90 transition-colors mr-2"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default RequireAdmin;