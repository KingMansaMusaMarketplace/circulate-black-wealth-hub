
import React, { useState } from 'react';
import { useAuth } from '@/contexts/auth';
import { Navigate } from 'react-router-dom';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { BusinessProfileManager, BusinessDashboard } from '@/components/business';
import { Briefcase, BarChart3 } from 'lucide-react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

const BusinessProfilePage = () => {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  
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
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <BarChart3 size={16} />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <Briefcase size={16} />
            Business Profile
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard">
          <BusinessDashboard />
        </TabsContent>
        
        <TabsContent value="profile">
          <BusinessProfileManager />
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default BusinessProfilePage;
