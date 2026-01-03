
import React from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import ProfileHeader from '@/components/profile/ProfileHeader';
import ProfileForm from '@/components/profile/ProfileForm';
import SecuritySettings from '@/components/profile/SecuritySettings';
import SystemHealthSettings from '@/components/profile/SystemHealthSettings';
import ProfileCompletionCard from '@/components/profile/ProfileCompletionCard';
import { DashboardLayout } from '@/components/dashboard';
import { Loader2 } from 'lucide-react';

const ProfilePage = () => {
  const { user, userRole, loading, authInitialized } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const tab = searchParams.get('tab') || 'profile';

  const isAdmin = userRole === 'admin';

  // Show loading while auth is initializing
  if (loading || !authInitialized) {
    return (
      <DashboardLayout title="Account Settings">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Handle tab changes
  const handleTabChange = (value: string) => {
    const newSearchParams = new URLSearchParams(location.search);
    newSearchParams.set('tab', value);
    navigate({ search: newSearchParams.toString() });
  };

  return (
    <DashboardLayout title="Account Settings">
      <div className="space-y-3">
        {/* Decorative Banner */}
        <div className="relative overflow-hidden rounded-2xl h-32 mb-4">
          {/* Gradient background */}
          <div className="absolute inset-0 bg-gradient-to-r from-mansablue via-purple-600 to-mansagold" />
          
          {/* Animated decorative elements */}
          <div className="absolute top-4 right-10 w-24 h-24 bg-white/10 rounded-full blur-2xl animate-pulse" />
          <div className="absolute bottom-4 left-10 w-32 h-32 bg-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          
          {/* Content overlay */}
          <div className="relative h-full flex items-center px-8">
            <div className="text-white">
              <h2 className="text-2xl font-bold mb-1">Manage Your Account</h2>
              <p className="text-white/90 text-sm">Update your profile, security settings, and preferences</p>
            </div>
          </div>
        </div>

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
            <ProfileCompletionCard />
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
