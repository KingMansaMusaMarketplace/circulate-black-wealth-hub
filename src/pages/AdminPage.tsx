
import React, { useState } from 'react';
import DatabaseSetup from '../components/admin/DatabaseSetup';
import SupabaseSetup from '../components/admin/SupabaseSetup';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { setupDatabase } from '@/lib/database-init';
import { toast } from 'sonner';
import { Loader2, Check, Database, Shield } from 'lucide-react';

const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('setup');
  const [initializing, setInitializing] = useState(false);
  const [initialized, setInitialized] = useState(false);

  const handleInitializeDatabase = async () => {
    setInitializing(true);
    try {
      await setupDatabase();
      setInitialized(true);
      toast.success('Database initialized successfully!');
    } catch (error) {
      console.error('Error initializing database:', error);
      toast.error('Failed to initialize database');
    } finally {
      setInitializing(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      <div className="mb-8">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-mansablue" />
              Quick Setup
            </CardTitle>
            <CardDescription>
              Initialize your database and set up authentication for your Mansa Musa Marketplace
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center p-4 border rounded-md bg-gray-50">
              <div className="flex-1">
                <h3 className="font-medium">Initialize Database Functions</h3>
                <p className="text-sm text-gray-600">Set up QR code and loyalty functions in your database</p>
              </div>
              <Button 
                onClick={handleInitializeDatabase} 
                disabled={initializing || initialized}
                variant={initialized ? "outline" : "default"}
              >
                {initializing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Initializing...
                  </>
                ) : initialized ? (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Initialized
                  </>
                ) : (
                  "Initialize Database"
                )}
              </Button>
            </div>
            
            <div className="flex items-center p-4 border rounded-md bg-gray-50">
              <div className="flex-1">
                <h3 className="font-medium">Configure Authentication</h3>
                <p className="text-sm text-gray-600">Set up email verification settings in Supabase</p>
              </div>
              <Button 
                variant="outline"
                asChild
              >
                <a href="https://supabase.com/dashboard/project/agoclnqfyinwjxdmjnns/auth/providers" target="_blank" rel="noopener noreferrer">
                  <Shield className="mr-2 h-4 w-4" />
                  Auth Settings
                </a>
              </Button>
            </div>
          </CardContent>
          <CardFooter className="text-sm text-gray-500">
            Complete these steps before using the Mansa Musa Marketplace application
          </CardFooter>
        </Card>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
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
