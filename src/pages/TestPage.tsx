
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AuthTest from '@/components/testing/AuthTest';
import { useAuth } from '@/contexts/AuthContext';

const TestPage: React.FC = () => {
  const { user, session, authInitialized } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>System Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <strong>Auth Initialized:</strong> {authInitialized ? '✅ Yes' : '❌ No'}
            </div>
            <div>
              <strong>User Present:</strong> {user ? '✅ Yes' : '❌ No'}
            </div>
            <div>
              <strong>Session Active:</strong> {session ? '✅ Yes' : '❌ No'}
            </div>
            <div>
              <strong>Current Route:</strong> {window.location.pathname}
            </div>
          </div>
          
          {user && (
            <div className="mt-4 space-y-2">
              <div><strong>User ID:</strong> {user.id}</div>
              <div><strong>Email:</strong> {user.email}</div>
              <div><strong>User Type:</strong> {user.user_metadata?.user_type || 'Not set'}</div>
              <div><strong>Email Confirmed:</strong> {user.email_confirmed_at ? '✅ Yes' : '❌ No'}</div>
            </div>
          )}
        </CardContent>
      </Card>

      <AuthTest />

      <Card>
        <CardHeader>
          <CardTitle>Quick Tests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div>• Navigate to /signup to test signup flow</div>
            <div>• Navigate to /login to test login flow</div>
            <div>• Check browser console for any errors</div>
            <div>• Verify Supabase connection in Network tab</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TestPage;
