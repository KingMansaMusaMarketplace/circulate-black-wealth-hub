
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/dashboard';
import { ProfileHeader, ProfileForm, SecuritySettings } from '@/components/profile';
import { User } from 'lucide-react';

const ProfilePage = () => {
  const { user, loading } = useAuth();
  
  // Show loading state while checking auth status
  if (loading) {
    return (
      <DashboardLayout title="Profile" location="">
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
      title="My Profile" 
      icon={<User className="mr-2 h-5 w-5" />}
    >
      <div className="grid gap-6">
        <ProfileHeader />
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
            <ProfileForm />
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-4">Account Security</h2>
            <SecuritySettings />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;
