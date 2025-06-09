
import React from 'react';
import { Helmet } from 'react-helmet';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { DashboardLayout } from '@/components/dashboard';
import BusinessDashboard from '@/components/business/BusinessDashboard';
import { Loader2 } from 'lucide-react';

const BusinessDashboardPage = () => {
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

  // Redirect to regular dashboard if not a business user
  if (userType !== 'business') {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <>
      <Helmet>
        <title>Business Dashboard | Mansa Musa Marketplace</title>
        <meta name="description" content="Manage your business profile, analytics, and engagement tools" />
      </Helmet>
      
      <DashboardLayout title="Business Dashboard" icon={null}>
        <BusinessDashboard />
      </DashboardLayout>
    </>
  );
};

export default BusinessDashboardPage;
