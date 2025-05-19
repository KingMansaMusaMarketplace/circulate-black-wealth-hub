
import React, { useState } from 'react';
import VerificationQueue from '@/components/admin/verification/VerificationQueue';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import VerificationSettings from '@/components/admin/verification/VerificationSettings';
import VerificationStatistics from '@/components/admin/verification/VerificationStatistics';
import { Activity, Settings, ClipboardList } from 'lucide-react';

const AdminVerificationPage: React.FC = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Business Verification Management</h1>
      
      <Tabs defaultValue="queue">
        <TabsList className="mb-4">
          <TabsTrigger value="stats" className="flex items-center gap-2">
            <Activity className="h-4 w-4" /> Statistics
          </TabsTrigger>
          <TabsTrigger value="queue" className="flex items-center gap-2">
            <ClipboardList className="h-4 w-4" /> Verification Queue
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" /> Settings
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="stats">
          <VerificationStatistics />
        </TabsContent>
        
        <TabsContent value="queue">
          <VerificationQueue />
        </TabsContent>
        
        <TabsContent value="settings">
          <VerificationSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminVerificationPage;
