
import React from 'react';
import DatabaseSetup from '../components/admin/DatabaseSetup';
import SupabaseSetup from '../components/admin/SupabaseSetup';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";

const AdminPage: React.FC = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      <Tabs defaultValue="setup">
        <TabsList className="mb-4">
          <TabsTrigger value="setup">Supabase Setup</TabsTrigger>
          <TabsTrigger value="database">Database</TabsTrigger>
        </TabsList>
        <TabsContent value="setup" className="space-y-6">
          <SupabaseSetup />
        </TabsContent>
        <TabsContent value="database" className="space-y-6">
          <DatabaseSetup />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPage;
