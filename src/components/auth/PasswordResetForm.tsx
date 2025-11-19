
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { handlePasswordReset } from '@/contexts/auth/authUtils';
import { toastWrapper } from '@/contexts/auth/authUtils';
import { ArrowLeft, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const PasswordResetForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toastWrapper({
        title: "Email Required",
        description: "Please enter your email address.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const result = await handlePasswordReset(email, toastWrapper);
      
      if (result && result.success) {
        setIsSubmitted(true);
      }
    } catch (error) {
      console.error('Password reset error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-mansablue/20 to-mansagold/20 rounded-3xl blur-xl" />
        <Card className="relative border border-white/10 bg-slate-800/60 backdrop-blur-xl shadow-xl rounded-3xl overflow-hidden w-full max-w-md mx-auto">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-mansablue via-blue-500 to-mansagold" />
        <CardHeader className="text-center pt-8">
          <div className="mx-auto w-12 h-12 bg-green-500/20 border border-green-500/30 rounded-full flex items-center justify-center mb-4">
            <Mail className="w-6 h-6 text-green-400" />
          </div>
          <CardTitle className="text-2xl text-white">Check Your Email</CardTitle>
          <CardDescription className="text-slate-300">
            We've sent password reset instructions to {email}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-slate-400 text-center">
            If you don't see the email in your inbox, please check your spam folder.
          </p>
          <div className="flex flex-col gap-2">
            <Button 
              onClick={() => {
                setIsSubmitted(false);
                setEmail('');
              }}
              variant="outline"
              className="w-full border-white/10 text-white hover:bg-white/10"
            >
              Try Different Email
            </Button>
            <Link to="/login">
              <Button variant="ghost" className="w-full text-slate-300 hover:text-white hover:bg-white/10">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Login
              </Button>
            </Link>
          </div>
        </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-br from-mansablue/20 to-mansagold/20 rounded-3xl blur-xl" />
      <Card className="relative border border-white/10 bg-slate-800/60 backdrop-blur-xl shadow-xl rounded-3xl overflow-hidden w-full max-w-md mx-auto">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-mansablue via-blue-500 to-mansagold" />
      <CardHeader className="pt-8">
        <CardTitle className="text-2xl text-center text-white">
          Reset Your Password
        </CardTitle>
        <CardDescription className="text-center text-slate-300">
          Enter your email address and we'll send you instructions to reset your password.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-slate-300">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-mansablue via-blue-500 to-mansagold hover:from-blue-600 hover:via-blue-600 hover:to-amber-500"
            disabled={isLoading}
          >
            {isLoading ? 'Sending Reset Email...' : 'Send Reset Instructions'}
          </Button>
          
          <div className="text-center">
            <Link 
              to="/login" 
              className="text-sm text-mansagold hover:text-amber-400 inline-flex items-center transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Login
            </Link>
          </div>
        </form>
      </CardContent>
      </Card>
    </div>
  );
};

export default PasswordResetForm;
