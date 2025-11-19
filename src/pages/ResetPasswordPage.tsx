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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 relative overflow-hidden flex flex-col">
      {/* Animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-96 h-96 bg-mansablue/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-[32rem] h-[32rem] bg-mansagold/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]"></div>
      </div>

      <div className="relative z-10 flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md animate-fade-in">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-mansablue/20 to-mansagold/20 rounded-3xl blur-xl" />
        <Card className="relative border border-white/10 bg-slate-800/60 backdrop-blur-xl shadow-xl rounded-3xl overflow-hidden w-full">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-mansablue via-blue-500 to-mansagold" />
              <CardHeader className="text-center pt-8">
            <CardTitle className="text-2xl font-bold text-white">
              Reset Your Password
            </CardTitle>
            <CardDescription className="text-slate-300">
              Enter your email address and we'll send you a link to reset your password
            </CardDescription>
          </CardHeader>
          
          {isRequestSent ? (
            <CardContent className="text-center py-6">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-500/20 border border-green-500/30 mb-4">
                <Mail className="h-6 w-6 text-green-400" />
              </div>
              <h3 className="text-lg font-medium text-white">Check your email</h3>
              <p className="mt-2 text-slate-300">
                We've sent a password reset link to {email}
              </p>
              <Button 
                onClick={() => navigate('/login')} 
                variant="link" 
                className="mt-4 text-mansagold hover:text-amber-400"
              >
                Back to login
              </Button>
            </CardContent>
          ) : (
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <label htmlFor="email" className="block text-sm font-medium text-slate-300">
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
                  className="w-full bg-gradient-to-r from-mansablue via-blue-500 to-mansagold hover:from-blue-600 hover:via-blue-600 hover:to-amber-500"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending..." : "Send Reset Link"}
                </Button>
              </CardFooter>
              <div className="text-center pb-4">
                <Button 
                  onClick={() => navigate('/login')} 
                  variant="link" 
                  className="text-mansagold hover:text-amber-400"
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
