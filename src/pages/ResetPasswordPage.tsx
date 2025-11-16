import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail } from 'lucide-react';

const ResetPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRequestSent, setIsRequestSent] = useState(false);
  const { resetPassword } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await resetPassword(email);
      if (result.success) {
        setIsRequestSent(true);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-mansablue/10 via-background to-mansagold/10" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-purple-500/20 via-transparent to-transparent" />
      
      {/* Decorative elements */}
      <div className="absolute top-20 right-20 w-72 h-72 bg-mansagold/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-mansablue/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

      <div className="relative z-10 flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md animate-fade-in">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-mansablue/20 to-mansagold/20 rounded-3xl blur-xl" />
        <Card className="relative bg-card/95 backdrop-blur-sm border-2 border-border/40 shadow-xl rounded-3xl overflow-hidden w-full">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-mansablue via-purple-600 to-mansagold" />
              <CardHeader className="text-center pt-8">
            <CardTitle className="text-2xl font-bold text-mansablue">
              Reset Your Password
            </CardTitle>
            <CardDescription>
              Enter your email address and we'll send you a link to reset your password
            </CardDescription>
          </CardHeader>
          
          {isRequestSent ? (
            <CardContent className="text-center py-6">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 mb-4">
                <Mail className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">Check your email</h3>
              <p className="mt-2 text-gray-500">
                We've sent a password reset link to {email}
              </p>
              <Button 
                onClick={() => navigate('/login')} 
                variant="link" 
                className="mt-4 text-mansablue"
              >
                Back to login
              </Button>
            </CardContent>
          ) : (
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email address
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full"
                    placeholder="your.email@example.com"
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  type="submit" 
                  className="w-full bg-mansablue hover:bg-mansablue-dark"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending..." : "Send Reset Link"}
                </Button>
              </CardFooter>
              <div className="text-center pb-4">
                <Button 
                  onClick={() => navigate('/login')} 
                  variant="link" 
                  className="text-mansablue"
                >
                  Back to login
                </Button>
              </div>
            </form>
          )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
