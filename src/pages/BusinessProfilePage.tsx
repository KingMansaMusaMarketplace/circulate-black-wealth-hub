
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, useSearchParams } from 'react-router-dom';
import { DashboardLayout } from '@/components/dashboard';
import { BusinessProfileManager, BusinessDashboard } from '@/components/business';
import { Briefcase, BarChart3, Settings, TrendingUp } from 'lucide-react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

const BusinessProfilePage = () => {
  const { user, loading } = useAuth();
  const [searchParams] = useSearchParams();
  const defaultTab = searchParams.get('tab') || 'dashboard';
  const [activeTab, setActiveTab] = useState(defaultTab);
  
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
      title="Business Management" 
      icon={<Briefcase className="mr-2 h-5 w-5" />}
    >
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <BarChart3 size={16} />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <Briefcase size={16} />
            Business Profile
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <TrendingUp size={16} />
            Analytics
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard">
          <BusinessDashboard />
        </TabsContent>
        
        <TabsContent value="profile">
          <BusinessProfileManager />
        </TabsContent>
        
        <TabsContent value="analytics">
          <div className="text-center py-12">
            <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Analytics Dashboard</h3>
            <p className="text-gray-600 mb-4">Detailed analytics and insights coming soon.</p>
          </div>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default BusinessProfilePage;
