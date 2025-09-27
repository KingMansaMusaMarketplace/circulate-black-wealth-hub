import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Navbar } from '@/components/navbar';
import Footer from '@/components/Footer';
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
      
      <div className="min-h-screen bg-background">
        <Navbar />
        
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">Account Settings</h1>
              <p className="text-muted-foreground">
                Manage your account preferences, privacy settings, and data.
              </p>
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
        
        <Footer />
      </div>
    </>
  );
};

export default UserSettingsPage;