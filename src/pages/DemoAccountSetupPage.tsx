import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, AlertCircle, Loader2, User, Mail, Key, UserPlus, Sparkles } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import DemoAccountCard from '@/components/auth/DemoAccountCard';

const DemoAccountSetupPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const setupDemoAccounts = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const { data, error: functionError } = await supabase.functions.invoke('setup-demo-accounts');

      if (functionError) {
        throw functionError;
      }

      setResult(data);
    } catch (err: any) {
      console.error('Demo accounts setup error:', err);
      setError(err.message || 'Failed to setup demo accounts');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20 relative overflow-hidden">
      {/* Animated Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-40 right-20 w-96 h-96 bg-pink-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-40 right-10 w-64 h-64 bg-cyan-400/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }} />
      </div>

      <Helmet>
        <title>Demo Account Setup | Mansa Musa Marketplace</title>
        <meta name="description" content="Verify and create demo account for Apple App Store review" />
      </Helmet>

      {/* Header */}
      <div className="bg-gradient-to-br from-orange-600 via-red-600 to-pink-700 text-white py-12 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-pink-400/20"></div>
        <div className="max-w-4xl mx-auto px-6 relative z-10 animate-fade-in">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm border-2 border-white/30 shadow-xl">
              <UserPlus className="h-12 w-12 drop-shadow-lg" />
            </div>
            <h1 className="text-5xl font-bold drop-shadow-lg">🍎 Demo Accounts Setup for Apple Review</h1>
          </div>
          <p className="text-orange-100 text-xl font-medium">
            Create both customer and business demo accounts with complete sample data
          </p>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8 max-w-4xl relative z-10">
        <div className="space-y-6">
          {/* Demo Credentials Card */}
          <Card className="bg-gradient-to-br from-white via-orange-50 to-red-50 dark:from-gray-800 dark:via-orange-900/30 dark:to-red-900/30 border-0 shadow-2xl hover:shadow-[0_0_40px_rgba(249,115,22,0.3)] transition-all group">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-400/10 to-red-400/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl pointer-events-none" />
            <CardHeader className="relative z-10">
              <CardTitle className="text-2xl flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-orange-600 to-red-600 rounded-xl shadow-lg">
                  <User className="h-6 w-6 text-white" />
                </div>
                <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  Demo Account Credentials
                </span>
              </CardTitle>
              <CardDescription className="text-base font-medium">
                These credentials are displayed on the login page for Apple reviewers
              </CardDescription>
            </CardHeader>
            <CardContent className="relative z-10">
              <DemoAccountCard />
            </CardContent>
          </Card>

          {/* Setup Card */}
          <Card className="bg-gradient-to-br from-white via-pink-50 to-purple-50 dark:from-gray-800 dark:via-pink-900/30 dark:to-purple-900/30 border-0 shadow-2xl hover:shadow-[0_0_40px_rgba(236,72,153,0.3)] transition-all group">
            <div className="absolute inset-0 bg-gradient-to-r from-pink-400/10 to-purple-400/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl pointer-events-none" />
            <CardHeader className="relative z-10">
              <CardTitle className="text-2xl flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-pink-600 to-purple-600 rounded-xl shadow-lg">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <span className="bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                  Setup Demo Accounts
                </span>
              </CardTitle>
              <CardDescription className="text-base font-medium">
                Create both customer and business demo accounts with complete sample data for Apple reviewers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 relative z-10">
              <Button
                onClick={setupDemoAccounts}
                disabled={loading}
                className="w-full bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 text-white text-lg px-8 py-6 shadow-xl hover:shadow-2xl hover:scale-105 transition-all border-0"
                size="lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                    ⚙️ Setting up demo accounts...
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-6 w-6" />
                    ✨ Setup Demo Accounts & Sample Data
                  </>
                )}
              </Button>

              {error && (
                <Alert variant="destructive" className="bg-gradient-to-r from-red-100 to-orange-100 dark:from-red-900/30 dark:to-orange-900/30 border-2 border-red-300 shadow-lg">
                  <AlertCircle className="h-5 w-5" />
                  <AlertDescription className="text-base font-medium">{error}</AlertDescription>
                </Alert>
              )}

              {result && result.success && (
                <Alert className="bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 border-2 border-green-300 shadow-lg animate-fade-in">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <AlertDescription>
                    <div className="space-y-3">
                      <p className="font-bold text-xl text-green-800 dark:text-green-200">🎉 {result.message}</p>
                      
                      <div className="space-y-3">
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border-2 border-green-300 shadow-md">
                          <p className="font-bold text-lg text-green-900 dark:text-green-100 mb-2">👤 Customer Account:</p>
                          <p className="text-green-800 dark:text-green-200 font-medium">📧 Email: {result.accounts?.customer?.email}</p>
                          <p className="text-green-800 dark:text-green-200 font-medium">🔑 Password: {result.accounts?.customer?.password}</p>
                        </div>
                        
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border-2 border-green-300 shadow-md">
                          <p className="font-bold text-lg text-green-900 dark:text-green-100 mb-2">🏢 Business Account:</p>
                          <p className="text-green-800 dark:text-green-200 font-medium">📧 Email: {result.accounts?.business?.email}</p>
                          <p className="text-green-800 dark:text-green-200 font-medium">🔑 Password: {result.accounts?.business?.password}</p>
                        </div>
                      </div>
                      
                      <p className="text-base text-green-700 dark:text-green-300 font-bold">✅ All sample data created successfully</p>
                    </div>
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* What This Creates Card */}
          <Card className="bg-gradient-to-br from-white via-cyan-50 to-blue-50 dark:from-gray-800 dark:via-cyan-900/30 dark:to-blue-900/30 border-0 shadow-2xl hover:shadow-[0_0_40px_rgba(6,182,212,0.3)] transition-all group">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 to-blue-400/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl pointer-events-none" />
            <CardHeader className="relative z-10">
              <CardTitle className="text-2xl flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-cyan-600 to-blue-600 rounded-xl shadow-lg">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <span className="bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                  What This Creates
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-base relative z-10">
              <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-cyan-100 to-blue-100 dark:from-cyan-900/20 dark:to-blue-900/20 rounded-xl border-2 border-cyan-200/50">
                <User className="h-6 w-6 mt-0.5 text-cyan-600" />
                <div>
                  <p className="font-bold text-cyan-900 dark:text-cyan-100">Customer Demo Account</p>
                  <p className="text-cyan-800 dark:text-cyan-200 font-medium">customer.demo@mansamusa.com with loyalty points, favorites, and transaction history</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border-2 border-blue-200/50">
                <Key className="h-6 w-6 mt-0.5 text-blue-600" />
                <div>
                  <p className="font-bold text-blue-900 dark:text-blue-100">Business Demo Account</p>
                  <p className="text-blue-800 dark:text-blue-200 font-medium">demo@mansamusa.com with complete restaurant profile and QR codes</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl border-2 border-indigo-200/50">
                <Mail className="h-6 w-6 mt-0.5 text-indigo-600" />
                <div>
                  <p className="font-bold text-indigo-900 dark:text-indigo-100">Sample Data</p>
                  <p className="text-indigo-800 dark:text-indigo-200 font-medium">Business analytics, hours, reviews, and 30 days of metrics</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Next Steps Card */}
          <Card className="bg-gradient-to-br from-white via-green-50 to-emerald-50 dark:from-gray-800 dark:via-green-900/30 dark:to-emerald-900/30 border-0 shadow-2xl hover:shadow-[0_0_40px_rgba(34,197,94,0.3)] transition-all group">
            <div className="absolute inset-0 bg-gradient-to-r from-green-400/10 to-emerald-400/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl pointer-events-none" />
            <CardHeader className="relative z-10">
              <CardTitle className="text-2xl flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl shadow-lg">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
                <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  Next Steps
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-base font-medium relative z-10">
              <p className="p-3 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border-l-4 border-green-500">1. ✅ Click "Setup Demo Accounts & Sample Data" button above</p>
              <p className="p-3 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border-l-4 border-green-500">2. ✅ Test customer account: customer.demo@mansamusa.com / CustomerDemo123!</p>
              <p className="p-3 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border-l-4 border-green-500">3. ✅ Test business account: demo@mansamusa.com / Demo123!</p>
              <p className="p-3 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border-l-4 border-green-500">4. ✅ Update App Store Connect with both credentials</p>
              <p className="p-3 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border-l-4 border-green-500">5. ✅ Use text from docs/app-store-setup/APP_STORE_CONNECT_SUBMISSION_TEXT.md</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default DemoAccountSetupPage;