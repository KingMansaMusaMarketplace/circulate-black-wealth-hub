
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface RequireCustomerProps {
  children: React.ReactNode;
}

const RequireCustomer: React.FC<RequireCustomerProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // This is a simplified check - in a real app, you'd verify the user is a customer
  if (user.user_metadata?.role !== 'customer' && !user.user_metadata?.is_customer) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default RequireCustomer;
