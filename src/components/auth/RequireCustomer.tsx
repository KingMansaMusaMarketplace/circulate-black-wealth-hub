
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface RequireCustomerProps {
  children: React.ReactNode;
}

const RequireCustomer: React.FC<RequireCustomerProps> = ({ children }) => {
  const { user, loading, userRole } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user has customer role
  if (userRole !== 'customer') {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default RequireCustomer;
