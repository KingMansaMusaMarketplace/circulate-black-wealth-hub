
import React from 'react';
import VerificationQueue from '@/components/admin/verification/VerificationQueue';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
          <Card>
            <CardHeader>
              <CardTitle>Verification Process Settings</CardTitle>
              <CardDescription>Configure how business verification works</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Settings for the verification process will be available here in a future update.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminVerificationPage;
