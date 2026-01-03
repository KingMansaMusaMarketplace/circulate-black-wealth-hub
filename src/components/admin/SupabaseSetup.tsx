import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Info } from 'lucide-react';

/**
 * SupabaseSetup component - displays Supabase connection status
 * 
 * SECURITY NOTE: This component no longer stores credentials in localStorage.
 * Supabase credentials should ONLY come from environment variables.
 */
const SupabaseSetup: React.FC = () => {
  // Check if Supabase is configured via environment variables
  const isConfigured = Boolean(
    import.meta.env.VITE_SUPABASE_URL && 
    import.meta.env.VITE_SUPABASE_ANON_KEY
  );

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Supabase Connection Status</CardTitle>
        <CardDescription>
          View your Supabase connection configuration
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isConfigured ? (
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-800">Supabase is configured!</AlertTitle>
            <AlertDescription className="text-green-700">
              Your Supabase URL and anonymous key are properly set in the environment variables.
              The connection is ready to use.
            </AlertDescription>
          </Alert>
        ) : (
          <>
            <Alert className="bg-amber-50 border-amber-200">
              <Info className="h-4 w-4 text-amber-600" />
              <AlertTitle className="text-amber-800">Supabase Not Configured</AlertTitle>
              <AlertDescription className="text-amber-700 space-y-2">
                <p>Supabase credentials are not set. Please configure them securely:</p>
                <ol className="list-decimal ml-5 mt-2 space-y-1">
                  <li>Go to your Supabase dashboard</li>
                  <li>Click on "Settings" → "API"</li>
                  <li>Copy your "Project URL" and "anon public" key</li>
                  <li>Set them as environment variables in Lovable:
                    <ul className="list-disc ml-5 mt-1">
                      <li><code className="bg-amber-100 px-1 rounded">VITE_SUPABASE_URL</code></li>
                      <li><code className="bg-amber-100 px-1 rounded">VITE_SUPABASE_ANON_KEY</code></li>
                    </ul>
                  </li>
                </ol>
              </AlertDescription>
            </Alert>

            <Alert className="bg-red-50 border-red-200">
              <Info className="h-4 w-4 text-red-600" />
              <AlertTitle className="text-red-800">Security Notice</AlertTitle>
              <AlertDescription className="text-red-700">
                Never store Supabase credentials in localStorage or client-side code.
                Always use environment variables for secure credential management.
              </AlertDescription>
            </Alert>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default SupabaseSetup;
