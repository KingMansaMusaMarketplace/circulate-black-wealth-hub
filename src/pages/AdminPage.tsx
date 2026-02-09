/**
 * @deprecated This page is deprecated. Use AdminDashboardPage instead.
 * The /admin route now redirects to /admin-dashboard which includes all admin functionality
 * including the Setup tab for database and Supabase configuration.
 * 
 * This file is kept for backward compatibility only.
 * @see src/pages/AdminDashboardPage.tsx
 */

import React, { useState } from 'react';
import DatabaseSetup from '../components/admin/DatabaseSetup';
import SupabaseSetup from '../components/admin/SupabaseSetup';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { setupDatabase } from '@/lib/database-init';
import { toast } from 'sonner';
import { Loader2, Check, Database, Shield, Settings } from 'lucide-react';

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
    <div className="min-h-screen gradient-primary relative overflow-hidden">
      {/* Animated Gradient Orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-mansagold/20 blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-mansagold/15 blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/3 w-64 h-64 rounded-full bg-white/5 blur-2xl animate-float" style={{ animationDelay: '4s' }}></div>
        <div className="absolute bottom-1/4 left-1/4 w-48 h-48 rounded-full bg-mansagold/10 blur-2xl animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/4 right-1/4 w-56 h-56 rounded-full bg-white/5 blur-2xl animate-float" style={{ animationDelay: '3s' }}></div>
      </div>

      <div className="container mx-auto py-8 px-4 relative z-10">
        {/* Header */}
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 md:p-8 mb-8 shadow-2xl animate-fade-in">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-mansagold/20 border border-mansagold/30">
              <Settings className="h-7 w-7 text-mansagold" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white font-display">Admin Dashboard</h1>
              <p className="text-white/70">Manage your Mansa Musa Marketplace</p>
            </div>
          </div>
        </div>
        
        {/* Quick Setup Card */}
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 md:p-8 mb-8 shadow-xl animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-mansagold/20 border border-mansagold/30">
              <Database className="h-6 w-6 text-mansagold" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white font-display">Quick Setup</h2>
              <p className="text-white/70 text-sm">Initialize your database and set up authentication</p>
            </div>
          </div>
          
          <div className="space-y-4">
            {/* Initialize Database */}
            <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-white">Initialize Database Functions</h3>
                <p className="text-sm text-white/60">Set up QR code and loyalty functions in your database</p>
              </div>
              <Button 
                onClick={handleInitializeDatabase} 
                disabled={initializing || initialized}
                className={initialized 
                  ? "bg-white/10 border border-white/20 text-white hover:bg-white/20" 
                  : "bg-mansagold hover:bg-mansagold-dark text-mansablue font-semibold"
                }
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
            
            {/* Configure Authentication */}
            <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-white">Configure Authentication</h3>
                <p className="text-sm text-white/60">Set up email verification settings in Supabase</p>
              </div>
              <Button 
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10 hover:text-white"
                asChild
              >
                <a href="https://supabase.com/dashboard/project/agoclnqfyinwjxdmjnns/auth/providers" target="_blank" rel="noopener noreferrer">
                  <Shield className="mr-2 h-4 w-4" />
                  Auth Settings
                </a>
              </Button>
            </div>
          </div>
          
          <p className="text-sm text-white/50 mt-4">
            Complete these steps before using the Mansa Musa Marketplace application
          </p>
        </div>
        
        {/* Tabs Section */}
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 md:p-8 shadow-xl animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6 bg-white/10 border border-white/20">
              <TabsTrigger 
                value="setup" 
                className="data-[state=active]:bg-mansagold data-[state=active]:text-mansablue text-white/70"
              >
                Supabase Setup
              </TabsTrigger>
              <TabsTrigger 
                value="database"
                className="data-[state=active]:bg-mansagold data-[state=active]:text-mansablue text-white/70"
              >
                Database
              </TabsTrigger>
            </TabsList>
            <TabsContent value="setup" className="space-y-6">
              <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-4">
                <SupabaseSetup />
              </div>
            </TabsContent>
            <TabsContent value="database" className="space-y-6">
              <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-4">
                <DatabaseSetup />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
