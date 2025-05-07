
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/dashboard';
import { BusinessForm } from '@/components/business';
import BusinessDashboard from '@/components/business/BusinessDashboard';
import { Briefcase, BarChart3, Settings } from 'lucide-react';
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
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <BarChart3 size={16} />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <Briefcase size={16} />
            Business Info
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings size={16} />
            Settings
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard">
          <BusinessDashboard />
        </TabsContent>
        
        <TabsContent value="profile">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Business Information</h2>
            <BusinessForm />
          </div>
        </TabsContent>
        
        <TabsContent value="settings">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Business Settings</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-3">Loyalty Program Settings</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Points Per Visit</h4>
                      <p className="text-sm text-gray-500">Standard points awarded per visit</p>
                    </div>
                    <input 
                      type="number" 
                      className="w-24 px-3 py-1 border rounded"
                      defaultValue={10}
                      min={1}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Points Per Review</h4>
                      <p className="text-sm text-gray-500">Points awarded for customer reviews</p>
                    </div>
                    <input 
                      type="number" 
                      className="w-24 px-3 py-1 border rounded"
                      defaultValue={15} 
                      min={0}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Points Per Dollar Spent</h4>
                      <p className="text-sm text-gray-500">Additional points based on purchase amount</p>
                    </div>
                    <input 
                      type="number" 
                      className="w-24 px-3 py-1 border rounded"
                      defaultValue={1} 
                      min={0}
                      step={0.1}
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-3">Discount Settings</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Standard Discount</h4>
                      <p className="text-sm text-gray-500">Default discount for app users</p>
                    </div>
                    <div className="flex items-center">
                      <input 
                        type="number" 
                        className="w-24 px-3 py-1 border rounded-r-none rounded-l"
                        defaultValue={10} 
                        min={0}
                        max={100}
                      />
                      <span className="bg-gray-100 px-3 py-1 border border-l-0 rounded-r">%</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 flex justify-end">
                <button className="bg-mansablue hover:bg-mansablue-dark text-white px-4 py-2 rounded">
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default BusinessProfilePage;
