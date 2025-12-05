import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Bell, Shield, Trash2, Settings } from 'lucide-react';
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
      
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 relative overflow-hidden">
        {/* Animated gradient orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div 
            className="absolute top-10 right-10 w-[500px] h-[500px] rounded-full blur-3xl opacity-30"
            style={{
              background: 'radial-gradient(circle, rgba(234,179,8,0.4) 0%, rgba(59,130,246,0.2) 50%, transparent 70%)',
              animation: 'pulse 8s ease-in-out infinite',
            }}
          />
          <div 
            className="absolute bottom-20 left-10 w-[600px] h-[600px] rounded-full blur-3xl opacity-25"
            style={{
              background: 'radial-gradient(circle, rgba(59,130,246,0.4) 0%, rgba(234,179,8,0.2) 50%, transparent 70%)',
              animation: 'pulse 10s ease-in-out infinite',
              animationDelay: '2s',
            }}
          />
          <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full blur-3xl opacity-20"
            style={{
              background: 'radial-gradient(circle, rgba(234,179,8,0.3) 0%, rgba(30,58,138,0.3) 60%, transparent 80%)',
              animation: 'pulse 6s ease-in-out infinite',
              animationDelay: '4s',
            }}
          />
        </div>

        {/* Subtle grid overlay */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `linear-gradient(rgba(234,179,8,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(234,179,8,0.3) 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
          }}
        />

        <main className="container mx-auto px-4 py-8 relative z-10">
          <div className="max-w-4xl mx-auto">
            {/* Enhanced Header with glass-morphism */}
            <div className="mb-8 animate-fade-in">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 via-blue-500/20 to-yellow-500/20 rounded-2xl blur-xl" />
                <div className="relative bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-2xl">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="p-3 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl shadow-lg">
                      <Settings className="h-8 w-8 text-slate-900" />
                    </div>
                    <div>
                      <h1 className="text-3xl md:text-4xl font-bold text-white">
                        Account <span className="text-yellow-400">Settings</span>
                      </h1>
                      <p className="text-blue-200/80 text-lg">
                        Manage your account preferences, privacy settings, and data
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Tabs defaultValue="profile" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4 bg-white/5 backdrop-blur-xl border border-white/10 p-1 rounded-xl">
                <TabsTrigger 
                  value="profile" 
                  className="flex items-center gap-2 text-blue-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-500 data-[state=active]:to-yellow-600 data-[state=active]:text-slate-900 data-[state=active]:font-semibold rounded-lg transition-all"
                >
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">Profile</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="notifications" 
                  className="flex items-center gap-2 text-blue-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-500 data-[state=active]:to-yellow-600 data-[state=active]:text-slate-900 data-[state=active]:font-semibold rounded-lg transition-all"
                >
                  <Bell className="h-4 w-4" />
                  <span className="hidden sm:inline">Notifications</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="privacy" 
                  className="flex items-center gap-2 text-blue-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-500 data-[state=active]:to-yellow-600 data-[state=active]:text-slate-900 data-[state=active]:font-semibold rounded-lg transition-all"
                >
                  <Shield className="h-4 w-4" />
                  <span className="hidden sm:inline">Privacy</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="account" 
                  className="flex items-center gap-2 text-blue-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-500 data-[state=active]:to-yellow-600 data-[state=active]:text-slate-900 data-[state=active]:font-semibold rounded-lg transition-all"
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="hidden sm:inline">Account</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="profile" className="space-y-6 animate-fade-in">
                <Card className="bg-white/5 backdrop-blur-xl border-white/10 shadow-2xl">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <User className="h-5 w-5 text-yellow-400" />
                      Profile Information
                    </CardTitle>
                    <CardDescription className="text-blue-200/70">
                      Update your personal information and profile details.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 text-blue-200/60">
                      Profile editing functionality coming soon.
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="notifications" className="space-y-6 animate-fade-in">
                <Card className="bg-white/5 backdrop-blur-xl border-white/10 shadow-2xl">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Bell className="h-5 w-5 text-yellow-400" />
                      Notification Preferences
                    </CardTitle>
                    <CardDescription className="text-blue-200/70">
                      Choose what notifications you want to receive.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 text-blue-200/60">
                      Notification settings coming soon.
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="privacy" className="space-y-6 animate-fade-in">
                <Card className="bg-white/5 backdrop-blur-xl border-white/10 shadow-2xl">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Shield className="h-5 w-5 text-yellow-400" />
                      Privacy & Security
                    </CardTitle>
                    <CardDescription className="text-blue-200/70">
                      Manage your privacy settings and security preferences.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl hover:border-yellow-500/30 transition-colors">
                        <h4 className="font-medium mb-2 text-white">Data Export</h4>
                        <p className="text-sm text-blue-200/70 mb-3">
                          Download a copy of your data including transactions, reviews, and profile information.
                        </p>
                        <button 
                          className="text-yellow-400 hover:text-yellow-300 text-sm font-medium transition-colors"
                          onClick={() => window.open('mailto:support@mansamusamarketplace.com?subject=Data Export Request', '_blank')}
                        >
                          Request Data Export →
                        </button>
                      </div>

                      <div className="p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl hover:border-yellow-500/30 transition-colors">
                        <h4 className="font-medium mb-2 text-white">Privacy Policy</h4>
                        <p className="text-sm text-blue-200/70 mb-3">
                          Review how we collect, use, and protect your personal information.
                        </p>
                        <button 
                          className="text-yellow-400 hover:text-yellow-300 text-sm font-medium transition-colors"
                          onClick={() => window.open('https://mansamusamarketplace.com/privacy-policy', '_blank')}
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
