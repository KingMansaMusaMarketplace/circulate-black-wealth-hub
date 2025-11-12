import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, AlertCircle, Loader2, User, Mail, Key } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Helmet>
        <title>Demo Account Setup | Mansa Musa Marketplace</title>
        <meta name="description" content="Verify and create demo account for Apple App Store review" />
      </Helmet>

      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white py-12 shadow-lg">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-4xl font-bold mb-3">🍎 Demo Accounts Setup for Apple Review</h1>
          <p className="text-blue-100 text-lg">
            Create both customer and business demo accounts with complete sample data
          </p>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Demo Account Credentials</CardTitle>
              <CardDescription>
                These credentials are displayed on the login page for Apple reviewers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DemoAccountCard />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Setup Demo Accounts</CardTitle>
              <CardDescription>
                Create both customer and business demo accounts with complete sample data for Apple reviewers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={setupDemoAccounts}
                disabled={loading}
                className="w-full"
                size="lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Setting up demo accounts...
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-5 w-5" />
                    Setup Demo Accounts & Sample Data
                  </>
                )}
              </Button>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {result && result.success && (
                <Alert className="bg-green-50 border-green-200">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription>
                    <div className="space-y-3">
                      <p className="font-semibold text-green-800">{result.message}</p>
                      
                      <div className="space-y-2 text-sm">
                        <div className="bg-white p-3 rounded border border-green-200">
                          <p className="font-semibold text-green-900">👤 Customer Account:</p>
                          <p className="text-green-800">Email: {result.accounts?.customer?.email}</p>
                          <p className="text-green-800">Password: {result.accounts?.customer?.password}</p>
                        </div>
                        
                        <div className="bg-white p-3 rounded border border-green-200">
                          <p className="font-semibold text-green-900">🏢 Business Account:</p>
                          <p className="text-green-800">Email: {result.accounts?.business?.email}</p>
                          <p className="text-green-800">Password: {result.accounts?.business?.password}</p>
                        </div>
                      </div>
                      
                      <p className="text-sm text-green-700">✅ All sample data created successfully</p>
                    </div>
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-900">What This Creates</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-blue-800">
              <div className="flex items-start gap-3">
                <User className="h-5 w-5 mt-0.5 text-blue-600" />
                <div>
                  <p className="font-semibold">Customer Demo Account</p>
                  <p className="text-blue-700">customer.demo@mansamusa.com with loyalty points, favorites, and transaction history</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Key className="h-5 w-5 mt-0.5 text-blue-600" />
                <div>
                  <p className="font-semibold">Business Demo Account</p>
                  <p className="text-blue-700">demo@mansamusa.com with complete restaurant profile and QR codes</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 mt-0.5 text-blue-600" />
                <div>
                  <p className="font-semibold">Sample Data</p>
                  <p className="text-blue-700">Business analytics, hours, reviews, and 30 days of metrics</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Next Steps</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>1. ✅ Click "Setup Demo Accounts & Sample Data" button above</p>
              <p>2. ✅ Test customer account: customer.demo@mansamusa.com / CustomerDemo123!</p>
              <p>3. ✅ Test business account: demo@mansamusa.com / Demo123!</p>
              <p>4. ✅ Update App Store Connect with both credentials</p>
              <p>5. ✅ Use text from docs/app-store-setup/APP_STORE_CONNECT_SUBMISSION_TEXT.md</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default DemoAccountSetupPage;