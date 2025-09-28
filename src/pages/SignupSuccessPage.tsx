
import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle, ArrowRight, Info, QrCode, Shield } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import AuthLayout from '@/components/auth/AuthLayout';
import { Button } from '@/components/ui/button';
import { subscriptionService } from '@/lib/services/subscription-service';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client'; // Import supabase client directly

const SignupSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [userType, setUserType] = useState<'customer' | 'business' | null>(null);

  useEffect(() => {
    // If we have a session ID and a user, refresh the subscription status
    if (sessionId && user) {
      const refreshSubscriptionStatus = async () => {
        try {
          await subscriptionService.checkSubscription();
          
          // Get user type from metadata
          const { data: { user: currentUser } } = await supabase.auth.getUser();
          const type = currentUser?.user_metadata?.userType as 'customer' | 'business' | null;
          setUserType(type);
          
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

  const renderBusinessGuidance = () => (
    <div className="space-y-4 mt-6">
      <Alert className="bg-amber-50 border-amber-200">
        <QrCode className="h-5 w-5 text-amber-500" />
        <AlertTitle className="text-amber-800">QR Code Management</AlertTitle>
        <AlertDescription className="text-amber-700">
          As a business owner, you can now create and manage QR codes for your customers. 
          These QR codes can offer loyalty points or discounts to enhance customer retention.
        </AlertDescription>
      </Alert>
      
      <Alert className="bg-blue-50 border-blue-200">
        <Info className="h-5 w-5 text-blue-500" />
        <AlertTitle className="text-blue-800">Next Steps</AlertTitle>
        <AlertDescription className="text-blue-700">
          <ol className="list-decimal ml-5 space-y-1">
            <li>Complete your business profile in your dashboard</li>
            <li>Generate your first QR code in the QR Management section</li>
            <li>Display your QR code in your store for customers to scan</li>
            <li>Track customer engagement and analytics</li>
          </ol>
        </AlertDescription>
      </Alert>
    </div>
  );

  const renderCustomerGuidance = () => (
    <div className="space-y-4 mt-6">
      <Alert className="bg-green-50 border-green-200">
        <QrCode className="h-5 w-5 text-green-500" />
        <AlertTitle className="text-green-800">Scan & Earn</AlertTitle>
        <AlertDescription className="text-green-700">
          As a customer, you can now scan QR codes at participating businesses to earn loyalty points and access special discounts.
        </AlertDescription>
      </Alert>
      
      <Alert className="bg-blue-50 border-blue-200">
        <Info className="h-5 w-5 text-blue-500" />
        <AlertTitle className="text-blue-800">Next Steps</AlertTitle>
        <AlertDescription className="text-blue-700">
          <ol className="list-decimal ml-5 space-y-1">
            <li>Complete your profile in your dashboard</li>
            <li>Explore the business directory to find participating businesses</li>
            <li>Use the QR scanner in your dashboard to scan codes</li>
            <li>Track your loyalty points and available rewards</li>
          </ol>
        </AlertDescription>
      </Alert>
    </div>
  );

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
          
          {/* User type specific guidance */}
          {!loading && userType === 'business' && renderBusinessGuidance()}
          {!loading && userType === 'customer' && renderCustomerGuidance()}
          
          <div className="space-y-4 mt-6">
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
