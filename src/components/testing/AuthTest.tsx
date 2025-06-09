
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

const AuthTest: React.FC = () => {
  const { user, signIn, signUp, signOut, loading } = useAuth();
  const [email, setEmail] = useState('test@example.com');
  const [password, setPassword] = useState('testpassword123');
  const [name, setName] = useState('Test User');

  const handleTestSignUp = async () => {
    try {
      const result = await signUp(email, password, {
        name,
        user_type: 'customer',
        userType: 'customer'
      });
      if (result.error) {
        toast.error(`Signup failed: ${result.error.message}`);
      } else {
        toast.success('Signup test completed');
      }
    } catch (error: any) {
      toast.error(`Signup error: ${error.message}`);
    }
  };

  const handleTestSignIn = async () => {
    try {
      const result = await signIn(email, password);
      if (result.error) {
        toast.error(`Signin failed: ${result.error.message}`);
      } else {
        toast.success('Signin test completed');
      }
    } catch (error: any) {
      toast.error(`Signin error: ${error.message}`);
    }
  };

  if (loading) {
    return <div>Loading auth state...</div>;
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Authentication Test Panel</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <strong>Status:</strong> {user ? `Logged in as ${user.email}` : 'Not logged in'}
        </div>
        
        {user && (
          <div>
            <strong>User Type:</strong> {user.user_metadata?.user_type || 'Unknown'}
          </div>
        )}

        <div className="space-y-2">
          <Input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          {!user ? (
            <>
              <Button onClick={handleTestSignUp} variant="outline">
                Test Signup
              </Button>
              <Button onClick={handleTestSignIn}>
                Test Signin
              </Button>
            </>
          ) : (
            <Button onClick={signOut} variant="destructive">
              Sign Out
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AuthTest;
