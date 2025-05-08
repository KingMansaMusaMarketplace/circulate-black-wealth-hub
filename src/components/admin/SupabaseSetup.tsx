
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, CheckCircle, AlertCircle, Info } from 'lucide-react';

const SupabaseSetup: React.FC = () => {
  const [supabaseUrl, setSupabaseUrl] = useState(import.meta.env.VITE_SUPABASE_URL || '');
  const [supabaseKey, setSupabaseKey] = useState(import.meta.env.VITE_SUPABASE_ANON_KEY || '');
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSaveConfig = async () => {
    setIsSaving(true);
    setError(null);
    
    // Just validate basic input
    if (!supabaseUrl || !supabaseKey) {
      setError("Both Supabase URL and Key are required");
      setIsSaving(false);
      return;
    }

    // In Lovable we can't directly set environment variables from code,
    // so we'll store these in localStorage for demo purposes
    try {
      localStorage.setItem('SUPABASE_URL', supabaseUrl);
      localStorage.setItem('SUPABASE_ANON_KEY', supabaseKey);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsSaved(true);
    } catch (err: any) {
      setError(err.message || "Failed to save configuration");
    } finally {
      setIsSaving(false);
    }
  };

  const isConfigured = Boolean(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY);

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Supabase Connection Setup</CardTitle>
        <CardDescription>
          Configure your Supabase connection for the application
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isConfigured ? (
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-800">Supabase is already configured!</AlertTitle>
            <AlertDescription className="text-green-700">
              Your Supabase URL and anonymous key are already set in the environment variables.
            </AlertDescription>
          </Alert>
        ) : (
          <>
            <Alert className="bg-blue-50 border-blue-200">
              <Info className="h-4 w-4 text-blue-600" />
              <AlertTitle className="text-blue-800">How to find your Supabase credentials</AlertTitle>
              <AlertDescription className="text-blue-700 space-y-2">
                <p>1. Go to your Supabase dashboard</p>
                <p>2. Click on the "Settings" icon (gear icon) in the left sidebar</p>
                <p>3. Select "API" from the menu</p>
                <p>4. Copy your "Project URL" and "anon public" key</p>
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="supabaseUrl" className="text-sm font-medium">
                  Supabase URL
                </label>
                <Input
                  id="supabaseUrl"
                  placeholder="https://your-project-id.supabase.co"
                  value={supabaseUrl}
                  onChange={(e) => setSupabaseUrl(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="supabaseKey" className="text-sm font-medium">
                  Supabase Anonymous Key
                </label>
                <Input
                  id="supabaseKey"
                  placeholder="your-anon-key"
                  type="password"
                  value={supabaseKey}
                  onChange={(e) => setSupabaseKey(e.target.value)}
                />
              </div>
            </div>
            
            <div className="pt-2">
              <Alert variant="destructive" className={error ? "opacity-100" : "opacity-0 h-0 p-0 mb-0 overflow-hidden"}>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </div>
            
            <Alert className="bg-amber-50 border-amber-200 mt-4">
              <Info className="h-4 w-4 text-amber-600" />
              <AlertTitle className="text-amber-800">Important Note</AlertTitle>
              <AlertDescription className="text-amber-700">
                For production apps, set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your Lovable Environment Variables:
                <ol className="list-decimal ml-5 mt-2 space-y-1">
                  <li>Go to Project &gt; Settings</li>
                  <li>Click on Environment Variables</li>
                  <li>Add your Supabase credentials there</li>
                </ol>
              </AlertDescription>
            </Alert>
          </>
        )}

        {isSaved && !isConfigured && (
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-800">Configuration saved</AlertTitle>
            <AlertDescription className="text-green-700">
              Your Supabase configuration has been temporarily saved in the browser. For a permanent solution, set the environment variables in Lovable.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter>
        {!isConfigured && (
          <Button 
            onClick={handleSaveConfig} 
            disabled={isSaving || (!supabaseUrl && !supabaseKey)}
            className="w-full"
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving Configuration...
              </>
            ) : (
              'Save Configuration'
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default SupabaseSetup;
