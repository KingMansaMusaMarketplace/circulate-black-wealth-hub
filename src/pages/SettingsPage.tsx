
import React from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileForm from '../components/profile/ProfileForm';
import SecuritySettings from '../components/profile/SecuritySettings';
import NotificationSettings from '../components/profile/NotificationSettings';
import { Settings, User, Shield, Bell } from 'lucide-react';

const SettingsPage = () => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <Helmet>
        <title>Settings | Mansa Musa Marketplace</title>
        <meta name="description" content="Manage your account settings and preferences" />
      </Helmet>

      {/* Animated Background */}
      <div className="fixed inset-0 z-0 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>

      <div className="relative z-10 container mx-auto py-10 px-4 md:px-6">
        <div className="flex flex-col space-y-6 max-w-4xl mx-auto">
          {/* Header Banner */}
          <div className="relative overflow-hidden rounded-2xl h-36 backdrop-blur-xl bg-white/5 border border-white/10 shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-yellow-500/20" />
            <div className="absolute top-4 right-10 w-24 h-24 bg-blue-400/20 rounded-full blur-2xl animate-pulse" />
            <div className="absolute bottom-4 left-10 w-32 h-32 bg-yellow-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            <div className="relative h-full flex items-center px-8">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
                  <Settings className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white font-display">Settings</h1>
                  <p className="text-blue-200/80">
                    Manage your account settings and preferences
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="mb-6 backdrop-blur-xl bg-slate-800/40 border border-white/10 p-1">
              <TabsTrigger 
                value="profile" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white text-white/70 flex items-center gap-2"
              >
                <User className="h-4 w-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger 
                value="security"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white text-white/70 flex items-center gap-2"
              >
                <Shield className="h-4 w-4" />
                Security
              </TabsTrigger>
              <TabsTrigger 
                value="notifications"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white text-white/70 flex items-center gap-2"
              >
                <Bell className="h-4 w-4" />
                Notifications
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile">
              <Card className="backdrop-blur-xl bg-slate-900/40 border-white/10 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-white font-display">Profile Information</CardTitle>
                  <CardDescription className="text-white/60">
                    Update your profile information and contact details.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ProfileForm />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="security">
              <Card className="backdrop-blur-xl bg-slate-900/40 border-white/10 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-white font-display">Security Settings</CardTitle>
                  <CardDescription className="text-white/60">
                    Update your password and security preferences.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <SecuritySettings />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="notifications">
              <Card className="backdrop-blur-xl bg-slate-900/40 border-white/10 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-white font-display">Notification Settings</CardTitle>
                  <CardDescription className="text-white/60">
                    Manage how you receive notifications.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <NotificationSettings />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Dark theme styles for form elements */}
      <style>{`
        .settings-dark-theme input,
        .settings-dark-theme textarea,
        .settings-dark-theme select {
          background-color: rgba(15, 23, 42, 0.5) !important;
          border-color: rgba(255, 255, 255, 0.15) !important;
          color: white !important;
        }
        .settings-dark-theme input::placeholder,
        .settings-dark-theme textarea::placeholder {
          color: rgba(148, 163, 184, 0.6) !important;
        }
        .settings-dark-theme label {
          color: rgba(191, 219, 254, 0.9) !important;
        }
      `}</style>
    </div>
  );
};

export default SettingsPage;
