
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { updatePassword } from '@/lib/auth/auth-password';

const NewPasswordPage = () => {
  console.log('NewPasswordPage component is rendering');
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted');
    
    setError('');
    
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setIsSubmitting(true);

    try {
      const result = await updatePassword(password, (props) => {
        if (props.variant === 'destructive') {
          toast.error(props.title, { description: props.description });
        } else {
          toast.success(props.title, { description: props.description });
        }
      });
      
      if (result.success) {
        setIsComplete(true);
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setError(result.error?.message || 'Failed to update password');
      }
    } catch (err: any) {
      console.error('Password update error:', err);
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  console.log('About to render NewPasswordPage JSX');

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#000000] via-[#050a18] to-[#030712]">
      <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md bg-white/5 backdrop-blur-lg border-white/10">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-mansagold">
              Set New Password
            </CardTitle>
            <CardDescription className="text-white/60">
              Create a new secure password for your account
            </CardDescription>
          </CardHeader>
          
          {isComplete ? (
            <CardContent className="text-center py-6">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-500/20 mb-4">
                <CheckCircle className="h-6 w-6 text-green-400" />
              </div>
              <h3 className="text-lg font-medium text-white">Password updated successfully!</h3>
              <p className="mt-2 text-white/60">
                Redirecting you to the login page...
              </p>
            </CardContent>
          ) : (
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                {error && (
                  <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded">
                    {error}
                  </div>
                )}
                
                <div className="space-y-1">
                  <label htmlFor="password" className="block text-sm font-medium text-white/80">
                    New Password
                  </label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full bg-white/5 border-white/20 text-white placeholder:text-white/40"
                  />
                  <p className="text-xs text-white/50">
                    Must be at least 8 characters
                  </p>
                </div>
                
                <div className="space-y-1">
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-white/80">
                    Confirm Password
                  </label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="block w-full bg-white/5 border-white/20 text-white placeholder:text-white/40"
                  />
                </div>
              </CardContent>
              
              <CardFooter>
                <Button 
                  type="submit" 
                  className="w-full bg-mansagold hover:bg-mansagold/90 text-black font-bold"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Updating..." : "Update Password"}
                </Button>
              </CardFooter>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
};

export default NewPasswordPage;
