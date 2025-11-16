import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Bell, Shield, Trash2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import AccountDeletion from '@/components/auth/AccountDeletion';
import Loading from '@/components/ui/loading';

const UserSettingsPage: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loading fullScreen text="Loading settings..." />;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <>
      <Helmet>
        <title>Account Settings - Mansa Musa Marketplace</title>
        <meta 
          name="description" 
          content="Manage your account settings, preferences, and data on Mansa Musa Marketplace." 
        />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-20 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 left-20 w-[32rem] h-[32rem] bg-purple-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 right-1/3 w-72 h-72 bg-pink-400/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <main className="container mx-auto px-4 py-8 relative z-10">
          <div className="max-w-4xl mx-auto">
            {/* Enhanced Header */}
            <div className="mb-8 animate-fade-in">
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-400/30 via-purple-400/30 to-pink-400/30 rounded-2xl blur-xl"></div>
                <div className="relative bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
                  <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Account <span className="text-yellow-500">Settings</span> ⚙️
                  </h1>
                  <p className="text-gray-700 text-lg font-medium">
                    Manage your account preferences, privacy settings, and data ✨
                  </p>
                </div>
              </div>
            </div>

            <Tabs defaultValue="profile" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="profile" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Profile
                </TabsTrigger>
                <TabsTrigger value="notifications" className="flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  Notifications
                </TabsTrigger>
                <TabsTrigger value="privacy" className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Privacy
                </TabsTrigger>
                <TabsTrigger value="account" className="flex items-center gap-2">
                  <Trash2 className="h-4 w-4" />
                  Account
                </TabsTrigger>
              </TabsList>

              <TabsContent value="profile" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>
                      Update your personal information and profile details.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 text-muted-foreground">
                      Profile editing functionality coming soon.
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="notifications" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Preferences</CardTitle>
                    <CardDescription>
                      Choose what notifications you want to receive.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 text-muted-foreground">
                      Notification settings coming soon.
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="privacy" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Privacy & Security</CardTitle>
                    <CardDescription>
                      Manage your privacy settings and security preferences.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-medium mb-2">Data Export</h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          Download a copy of your data including transactions, reviews, and profile information.
                        </p>
                        <button 
                          className="text-primary hover:underline text-sm"
                          onClick={() => window.open('mailto:support@mansamusamarketplace.com?subject=Data Export Request', '_blank')}
                        >
                          Request Data Export
                        </button>
                      </div>

                      <div className="p-4 border rounded-lg">
                        <h4 className="font-medium mb-2">Privacy Policy</h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          Review how we collect, use, and protect your personal information.
                        </p>
                        <button 
                          className="text-primary hover:underline text-sm"
                          onClick={() => window.open('https://mansamusamarketplace.com/privacy-policy', '_blank')}
                        >
                          View Privacy Policy
                        </button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="account" className="space-y-6">
                <AccountDeletion />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </>
  );
};

export default UserSettingsPage;