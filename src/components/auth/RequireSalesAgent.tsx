
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface RequireSalesAgentProps {
  children: React.ReactNode;
}

const RequireSalesAgent: React.FC<RequireSalesAgentProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // This is a simplified check - in a real app, you'd verify the user is a sales agent
  if (user.user_metadata?.role !== 'sales_agent' && !user.user_metadata?.is_agent) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default RequireSalesAgent;
