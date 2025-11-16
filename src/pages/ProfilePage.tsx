
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import ProfileHeader from '@/components/profile/ProfileHeader';
import ProfileForm from '@/components/profile/ProfileForm';
import SecuritySettings from '@/components/profile/SecuritySettings';
import SystemHealthSettings from '@/components/profile/SystemHealthSettings';
import { DashboardLayout } from '@/components/dashboard';

const ProfilePage = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const tab = searchParams.get('tab') || 'profile';

  // Check if the user is an admin
  const { userRole } = useAuth();
  const isAdmin = userRole === 'admin';

  // Handle tab changes
  const handleTabChange = (value: string) => {
    const newSearchParams = new URLSearchParams(location.search);
    newSearchParams.set('tab', value);
    navigate({ search: newSearchParams.toString() });
  };

  return (
    <DashboardLayout title="Account Settings">
      <div className="space-y-3">
        <ProfileHeader />
        
        <Tabs 
          defaultValue={tab} 
          value={tab} 
          onValueChange={handleTabChange}
          className="space-y-3"
        >
          <TabsList className="grid grid-cols-3 w-full max-w-md">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            {isAdmin && <TabsTrigger value="health">System Health</TabsTrigger>}
          </TabsList>
          
          <TabsContent value="profile" className="space-y-3 mt-3">
            <ProfileForm />
          </TabsContent>
          
          <TabsContent value="security" className="space-y-3 mt-3">
            <SecuritySettings />
          </TabsContent>
          
          {isAdmin && (
            <TabsContent value="health" className="space-y-3 mt-3">
              <SystemHealthSettings />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;
