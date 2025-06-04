
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Loading from '@/components/ui/loading';

interface RequireBusinessProps {
  children: React.ReactNode;
}

const RequireBusiness: React.FC<RequireBusinessProps> = ({ children }) => {
  const { user, loading, userType } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Loading fullScreen text="Checking business access..." />;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user is a business type
  if (userType !== 'business') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Business Access Required</h1>
          <p className="mb-6 text-gray-700">
            This feature is only available to business accounts. Please upgrade your account or contact support.
          </p>
          <button 
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-mansablue text-white rounded hover:bg-opacity-90 transition-colors mr-2"
          >
            Go Back
          </button>
          <Navigate to="/signup" state={{ userType: 'business' }} replace />
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default RequireBusiness;
