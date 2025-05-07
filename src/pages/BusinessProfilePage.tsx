
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/dashboard';
import { BusinessForm } from '@/components/business';
import { Briefcase } from 'lucide-react';

const BusinessProfilePage = () => {
  const { user, loading } = useAuth();
  
  // Show loading state while checking auth status
  if (loading) {
    return (
      <DashboardLayout title="Business Profile" location="">
        <div className="flex justify-center items-center h-64">
          <p>Loading...</p>
        </div>
      </DashboardLayout>
    );
  }
  
  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  return (
    <DashboardLayout 
      title="Business Profile" 
      icon={<Briefcase className="mr-2 h-5 w-5" />}
    >
      <div className="grid gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Business Information</h2>
          <BusinessForm />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default BusinessProfilePage;
