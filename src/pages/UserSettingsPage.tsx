import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Bell, Shield, Trash2, Settings, Building2, ArrowRight, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import AccountDeletion from '@/components/auth/AccountDeletion';
import Loading from '@/components/ui/loading';
import { Button } from '@/components/ui/button';
import ProfileForm from '@/components/profile/ProfileForm';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const UserSettingsPage: React.FC = () => {
  const { user, userType, loading } = useAuth();

  if (loading) {
    return <Loading fullScreen text="Loading settings..." />;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <>
      <Helmet>
        <title>Account Settings - 1325.AI</title>
        <meta 
          name="description" 
          content="Manage your account settings, preferences, and data on 1325.AI." 
        />
      </Helmet>
      
      <div className="min-h-screen bg-black relative overflow-hidden">
        {/* Subtle ambient accent */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-[480px] opacity-70"
          style={{
            background:
              'radial-gradient(ellipse 70% 50% at 50% 0%, hsl(var(--mansagold) / 0.05), transparent 70%)',
          }}
        />

        <main className="container mx-auto px-4 py-8 relative z-10">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8 animate-fade-in">
              <div className="bg-slate-900/40 rounded-2xl p-6 border border-white/10">
                <div className="flex items-center gap-4 mb-3">
                  <div className="p-3 bg-mansagold/10 ring-1 ring-mansagold/30 rounded-xl">
                    <Settings className="h-8 w-8 text-mansagold" />
                  </div>
                  <div>
                    <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight text-white">
                      Account <span className="text-mansagold">Settings</span>
                    </h1>
                    <p className="text-slate-400 text-lg">
                      Manage your account preferences, privacy settings, and data
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Account Deletion Notice — Apple 5.1.1(v) compliance */}
            <Alert className="mb-6 bg-red-500/10 border-red-500/30 animate-fade-in">
              <AlertTriangle className="h-5 w-5 text-red-400" />
              <AlertTitle className="text-red-400 font-semibold">Account Management</AlertTitle>
              <AlertDescription className="text-slate-300">
                Need to delete your account? Go to the{' '}
                <button 
                  onClick={() => {
                    const accountTab = document.querySelector('[value="account"]') as HTMLElement;
                    if (accountTab) accountTab.click();
                  }}
                  className="text-red-400 hover:text-red-300 underline font-semibold"
                >
                  Account tab
                </button>
                {' '}or scroll down to find the "Delete Account" option.
              </AlertDescription>
            </Alert>

            <Tabs defaultValue="profile" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4 bg-slate-900/40 border border-white/10 p-1 rounded-xl">
                <TabsTrigger 
                  value="profile" 
                  className="flex items-center gap-2 text-slate-300 data-[state=active]:bg-mansagold data-[state=active]:text-black data-[state=active]:font-semibold rounded-lg transition-all"
                >
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">Profile</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="notifications" 
                  className="flex items-center gap-2 text-slate-300 data-[state=active]:bg-mansagold data-[state=active]:text-black data-[state=active]:font-semibold rounded-lg transition-all"
                >
                  <Bell className="h-4 w-4" />
                  <span className="hidden sm:inline">Notifications</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="privacy" 
                  className="flex items-center gap-2 text-slate-300 data-[state=active]:bg-mansagold data-[state=active]:text-black data-[state=active]:font-semibold rounded-lg transition-all"
                >
                  <Shield className="h-4 w-4" />
                  <span className="hidden sm:inline">Privacy</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="account" 
                  className="flex items-center gap-2 text-slate-300 data-[state=active]:bg-mansagold data-[state=active]:text-black data-[state=active]:font-semibold rounded-lg transition-all"
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="hidden sm:inline">Account</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="profile" className="space-y-6 animate-fade-in">
                {/* Business Profile Link for Business Users */}
                {userType === 'business' && (
                  <Card className="bg-mansagold/5 border-mansagold/30">
                    <CardContent className="py-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-mansagold/10 ring-1 ring-mansagold/30 rounded-xl">
                            <Building2 className="h-6 w-6 text-mansagold" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-white">Business Profile</h3>
                            <p className="text-slate-400 text-sm">
                              Edit your business details, images, services, and more
                            </p>
                          </div>
                        </div>
                        <Button asChild className="bg-mansagold hover:bg-mansagold/90 text-black font-medium">
                          <Link to="/business/profile">
                            Edit Business Profile
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Personal Profile Form */}
                <Card className="bg-slate-900/40 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <User className="h-5 w-5 text-mansagold" />
                      Personal Information
                    </CardTitle>
                    <CardDescription className="text-slate-400">
                      Update your personal information and profile details.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ProfileForm />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="notifications" className="space-y-6 animate-fade-in">
                <Card className="bg-slate-900/40 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Bell className="h-5 w-5 text-mansagold" />
                      Notification Preferences
                    </CardTitle>
                    <CardDescription className="text-slate-400">
                      Choose what notifications you want to receive.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 text-slate-400">
                      Notification settings coming soon.
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="privacy" className="space-y-6 animate-fade-in">
                <Card className="bg-slate-900/40 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Shield className="h-5 w-5 text-mansagold" />
                      Privacy & Security
                    </CardTitle>
                    <CardDescription className="text-slate-400">
                      Manage your privacy settings and security preferences.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 bg-black/40 border border-white/10 rounded-xl hover:border-mansagold/40 transition-colors">
                        <h4 className="font-medium mb-2 text-white">Data Export</h4>
                        <p className="text-sm text-slate-400 mb-3">
                          Download a copy of your data including transactions, reviews, and profile information.
                        </p>
                        <button 
                          className="text-mansagold hover:text-mansagold/80 text-sm font-medium transition-colors"
                          onClick={() => window.open('mailto:Thomas@1325.AI?subject=Data Export Request', '_blank')}
                        >
                          Request Data Export →
                        </button>
                      </div>

                      <div className="p-4 bg-black/40 border border-white/10 rounded-xl hover:border-mansagold/40 transition-colors">
                        <h4 className="font-medium mb-2 text-white">Privacy Policy</h4>
                        <p className="text-sm text-slate-400 mb-3">
                          Review how we collect, use, and protect your personal information.
                        </p>
                        <button 
                          className="text-mansagold hover:text-mansagold/80 text-sm font-medium transition-colors"
                          onClick={() => window.open('https://1325.ai/privacy-policy', '_blank')}
                        >
                          View Privacy Policy →
                        </button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="account" className="space-y-6 animate-fade-in">
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl">
                  <AccountDeletion />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </>
  );
};

export default UserSettingsPage;
