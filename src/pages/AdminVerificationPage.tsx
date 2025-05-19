
import React, { useState } from 'react';
import VerificationQueue from '@/components/admin/verification/VerificationQueue';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import VerificationSettings from '@/components/admin/verification/VerificationSettings';

const AdminVerificationPage: React.FC = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Business Verification Management</h1>
      
      <Tabs defaultValue="queue">
        <TabsList className="mb-4">
          <TabsTrigger value="queue">Verification Queue</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
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
