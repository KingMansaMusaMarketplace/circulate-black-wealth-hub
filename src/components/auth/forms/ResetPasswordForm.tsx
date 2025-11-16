import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, Eye, EyeOff, Lock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';

const passwordSchema = z.object({
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const ResetPasswordForm: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [isValidSession, setIsValidSession] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user has a valid password reset session
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setIsValidSession(true);
      } else {
        // If no session, redirect to login with error message
        toast.error('Invalid or expired reset link. Please request a new one.');
        navigate('/login');
      }
    };

    checkSession();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validate passwords
      const validated = passwordSchema.parse({ password, confirmPassword });
      
      // Update password
      const { error } = await supabase.auth.updateUser({
        password: validated.password
      });

      if (error) {
        throw error;
      }

      setSuccess(true);
      toast.success('Password updated successfully!');
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error: any) {
      if (error.errors) {
        setError(error.errors[0].message);
      } else {
        setError(error.message || 'Failed to update password');
      }
      toast.error('Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  if (!isValidSession) {
    return (
      <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-mansablue/10 via-background to-mansagold/10" />
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-mansablue relative z-10"></div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-mansablue/10 via-background to-mansagold/10" />
        <div className="absolute top-20 right-20 w-72 h-72 bg-mansagold/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-mansablue/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="relative z-10 w-full max-w-md mx-auto px-4 animate-fade-in">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-mansablue/20 to-mansagold/20 rounded-3xl blur-xl" />
            <Card className="relative bg-card/95 backdrop-blur-sm border-2 border-border/40 shadow-xl rounded-3xl overflow-hidden w-full">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-mansablue via-purple-600 to-mansagold" />
              <CardHeader className="text-center pt-8">
            <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center bg-green-100">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl">Password Updated!</CardTitle>
            <CardDescription>
              Your password has been successfully updated. You'll be redirected to login shortly.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Redirecting to login page in a few seconds...
              </AlertDescription>
            </Alert>
          </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 bg-gradient-to-br from-mansablue/10 via-background to-mansagold/10" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-purple-500/20 via-transparent to-transparent" />
      <div className="absolute top-20 right-20 w-72 h-72 bg-mansagold/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-mansablue/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      
      <div className="relative z-10 w-full max-w-md mx-auto px-4 animate-fade-in">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-mansablue/20 to-mansagold/20 rounded-3xl blur-xl" />
      <Card className="relative bg-card/95 backdrop-blur-sm border-2 border-border/40 shadow-xl rounded-3xl overflow-hidden w-full">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-mansablue via-purple-600 to-mansagold" />
            <CardHeader className="text-center pt-8">
          <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center bg-mansablue/10">
            <Lock className="h-8 w-8 text-mansablue" />
          </div>
          <CardTitle className="text-2xl">Create New Password</CardTitle>
          <CardDescription>
            Enter your new password below
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                New Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium">
                Confirm New Password
              </label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={loading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={loading}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <Alert>
              <Lock className="h-4 w-4" />
              <AlertDescription>
                Password must be at least 8 characters with uppercase, lowercase, number, and special character.
              </AlertDescription>
            </Alert>
            
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                  Updating Password...
                </>
              ) : (
                'Update Password'
              )}
            </Button>
          </form>
        </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordForm;