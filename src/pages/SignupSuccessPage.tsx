
import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '@/contexts/auth';
import AuthLayout from '@/components/auth/AuthLayout';
import { Button } from '@/components/ui/button';
import { subscriptionService } from '@/lib/services/subscription-service';

const SignupSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If we have a session ID and a user, refresh the subscription status
    if (sessionId && user) {
      const refreshSubscriptionStatus = async () => {
        try {
          await subscriptionService.checkSubscription();
          setLoading(false);
        } catch (error) {
          console.error('Error refreshing subscription:', error);
          setLoading(false);
        }
      };

      refreshSubscriptionStatus();
    } else {
      setLoading(false);
    }
  }, [sessionId, user]);

  return (
    <AuthLayout>
      <div className="max-w-md w-full mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-8">
          <div className="flex justify-center mb-6">
            <CheckCircle size={60} className="text-green-500" />
          </div>
          
          <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">
            Welcome to Mansa Musa Marketplace!
          </h1>
          
          <p className="text-center text-gray-600 mb-6">
            Your account has been created and your subscription is now active. 
            Thank you for joining our community!
          </p>
          
          <div className="space-y-4">
            <Button asChild className="w-full">
              <Link to="/dashboard">
                Go to Dashboard <ArrowRight size={16} className="ml-2" />
              </Link>
            </Button>
            
            <div className="text-center">
              <Link to="/" className="text-mansablue hover:underline text-sm">
                Return to Home Page
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
};

export default SignupSuccessPage;
