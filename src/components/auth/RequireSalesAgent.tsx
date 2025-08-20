
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface RequireSalesAgentProps {
  children: React.ReactNode;
}

const RequireSalesAgent: React.FC<RequireSalesAgentProps> = ({ children }) => {
  const { user, loading, userRole } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user has sales agent or admin role
  if (userRole !== 'sales_agent' && userRole !== 'admin') {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default RequireSalesAgent;
