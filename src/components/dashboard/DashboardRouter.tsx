
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

const DashboardRouter: React.FC = () => {
  const { user, userType, loading, authInitialized } = useAuth();

  // Show loading while auth is initializing
  if (loading || !authInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-mansablue" />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Redirect based on user type
  if (userType === 'business') {
    return <Navigate to="/business-dashboard" replace />;
  } else {
    return <Navigate to="/user-dashboard" replace />;
  }
};

export default DashboardRouter;
