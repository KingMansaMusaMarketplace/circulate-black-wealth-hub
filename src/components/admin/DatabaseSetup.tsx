
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { setupSupabaseTables } from '@/utils/supabase-setup';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const DatabaseSetup: React.FC = () => {
  const [isInitializing, setIsInitializing] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInitializeDatabase = async () => {
    setIsInitializing(true);
    setError(null);
    
    try {
      const success = await setupSupabaseTables();
      setIsInitialized(success);
      if (!success) {
        setError("Failed to initialize database. Check console for details.");
      }
    } catch (err: any) {
      setError(err.message || "An unknown error occurred");
      setIsInitialized(false);
    } finally {
      setIsInitializing(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Database Setup</CardTitle>
        <CardDescription>
          Initialize your Supabase database with all required tables for the application
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p>
            This will create all necessary tables in your Supabase database including:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Profiles</li>
            <li>Businesses</li>
            <li>Product Images</li>
            <li>Loyalty Points</li>
            <li>Transactions</li>
            <li>Reviews</li>
            <li>QR Codes</li>
            <li>Rewards</li>
            <li>And more...</li>
          </ul>
          
          {isInitialized && (
            <div className="flex items-center gap-2 p-3 bg-green-50 text-green-700 rounded-md">
              <CheckCircle size={18} />
              <span>Database initialized successfully!</span>
            </div>
          )}
          
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-md">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleInitializeDatabase} 
          disabled={isInitializing || isInitialized}
          className="w-full"
        >
          {isInitializing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Initializing Database...
            </>
          ) : isInitialized ? (
            <>
              <CheckCircle className="mr-2 h-4 w-4" />
              Database Initialized
            </>
          ) : (
            'Initialize Database'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DatabaseSetup;
