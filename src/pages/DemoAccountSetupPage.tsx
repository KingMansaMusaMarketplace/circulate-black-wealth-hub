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

  const verifyDemoAccount = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const { data, error: functionError } = await supabase.functions.invoke('verify-demo-account');

      if (functionError) {
        throw functionError;
      }

      setResult(data);
    } catch (err: any) {
      console.error('Demo account verification error:', err);
      setError(err.message || 'Failed to verify demo account');
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
          <h1 className="text-4xl font-bold mb-3">🍎 Demo Account Setup for Apple Review</h1>
          <p className="text-blue-100 text-lg">
            Verify and create the demo account for App Store Connect submission
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
              <CardTitle>Verify Demo Account</CardTitle>
              <CardDescription>
                Click the button below to verify that the demo account exists in Supabase with the correct credentials
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={verifyDemoAccount}
                disabled={loading}
                className="w-full"
                size="lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Verifying Demo Account...
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-5 w-5" />
                    Verify / Create Demo Account
                  </>
                )}
              </Button>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {result && (
                <Alert variant={result.success ? "default" : "destructive"}>
                  {result.success ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <AlertCircle className="h-4 w-4" />
                  )}
                  <AlertDescription>
                    <div className="space-y-2">
                      <p className="font-semibold">{result.message}</p>
                      {result.userId && (
                        <p className="text-sm text-muted-foreground">User ID: {result.userId}</p>
                      )}
                      {result.exists ? (
                        <p className="text-sm text-green-700">✅ Demo account exists and is ready</p>
                      ) : (
                        <p className="text-sm text-blue-700">✨ Demo account was created successfully</p>
                      )}
                    </div>
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-900">What This Does</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-blue-800">
              <div className="flex items-start gap-3">
                <User className="h-5 w-5 mt-0.5 text-blue-600" />
                <div>
                  <p className="font-semibold">Checks for existing demo user</p>
                  <p className="text-blue-700">Searches Supabase auth for demo@mansamusa.com</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Key className="h-5 w-5 mt-0.5 text-blue-600" />
                <div>
                  <p className="font-semibold">Creates account if missing</p>
                  <p className="text-blue-700">Sets password to Demo123! and email_confirmed to true</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 mt-0.5 text-blue-600" />
                <div>
                  <p className="font-semibold">Creates profile data</p>
                  <p className="text-blue-700">Ensures the demo user has a business profile in the database</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Next Steps</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>1. ✅ Click "Verify / Create Demo Account" button above</p>
              <p>2. ✅ Confirm the demo account exists in Supabase</p>
              <p>3. ✅ Test login with demo@mansamusa.com / Demo123!</p>
              <p>4. ✅ Update App Store Connect with these exact credentials</p>
              <p>5. ✅ Verify DemoAccountCard is visible on the login page</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default DemoAccountSetupPage;