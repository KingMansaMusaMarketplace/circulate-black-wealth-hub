
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';

interface RequireBusinessProps {
  children: React.ReactNode;
}

const RequireBusiness: React.FC<RequireBusinessProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // This is a simplified check - in a real app, you'd verify the user is a business
  if (user.user_metadata?.role !== 'business') {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default RequireBusiness;
