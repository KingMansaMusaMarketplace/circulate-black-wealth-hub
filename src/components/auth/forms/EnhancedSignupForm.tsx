
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, Users, Building, CreditCard, TrendingUp } from 'lucide-react';
import CustomerSignupTab from './CustomerSignupTab';
import BusinessSignupForm from './BusinessSignupForm';
import EnhancedPaymentButton from '@/components/payments/EnhancedPaymentButton';
import { useAuth } from '@/contexts/AuthContext';

const EnhancedSignupForm: React.FC = () => {
  const { user } = useAuth();
  const [selectedTab, setSelectedTab] = useState('customer');
  const [showPayment, setShowPayment] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);

  const handleSignupSuccess = () => {
    setSignupSuccess(true);
    // Show payment options after successful signup
    setTimeout(() => {
      setShowPayment(true);
    }, 2000);
  };

  const customerPlans = [
    {
      tier: 'free',
      price: 'Free',
      features: [
        'Browse Black-owned businesses',
        'QR code scanning',
        'Basic loyalty points',
        'Community access'
      ]
    },
    {
      tier: 'premium',
      price: '$9.99/month',
      features: [
        'Everything in Free',
        'Premium business recommendations',
        'Advanced search filters',
        'Priority customer support',
        'Exclusive deals and discounts'
      ]
    }
  ];

  const businessPlans = [
    {
      tier: 'business_starter',
      price: '$29.99/month',
      features: [
        'Business profile listing',
        'QR code generation',
        'Basic analytics',
        '30-day free trial'
      ]
    },
    {
      tier: 'business_pro',
      price: '$99.99/month',
      features: [
        'Everything in Starter',
        'Advanced analytics',
        'Premium listing placement',
        'Marketing tools',
        'Dedicated support'
      ]
    }
  ];

  // Show payment options if user just signed up successfully or if already authenticated
  if ((showPayment && signupSuccess) || (user && !signupSuccess)) {
    const plans = selectedTab === 'customer' ? customerPlans : businessPlans;
    
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center space-x-2">
            <CreditCard className="h-6 w-6" />
            <span>Choose Your Plan</span>
          </CardTitle>
          <CardDescription>
            {signupSuccess ? 
              'Welcome! Select a plan to get the most out of Mansa Musa Marketplace' :
              'Select a plan to get the most out of Mansa Musa Marketplace'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            {plans.map((plan) => (
              <EnhancedPaymentButton
                key={plan.tier}
                userType={selectedTab as 'customer' | 'business'}
                tier={plan.tier}
                email={user?.email || 'guest@example.com'}
                name={user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}
                price={plan.price}
                features={plan.features}
                onSuccess={() => {
                  console.log(`Successfully subscribed to ${plan.tier}`);
                }}
              />
            ))}
          </div>
          
          <div className="mt-6 text-center">
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                You can always upgrade or downgrade your plan later. Business plans include a 30-day free trial!
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto">
      <Card className="w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Join the Movement</CardTitle>
          <CardDescription>
            Create an account to start supporting Black-owned businesses and building community wealth
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 max-w-md mx-auto">
              <TabsTrigger value="customer" className="flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <span>Customer</span>
              </TabsTrigger>
              <TabsTrigger value="business" className="flex items-center space-x-2">
                <Building className="h-4 w-4" />
                <span>Business</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="customer" className="w-full">
              <div className="max-w-md mx-auto">
                <CustomerSignupTab onSuccess={handleSignupSuccess} />
              </div>
            </TabsContent>
            
            <TabsContent value="business" className="w-full">
              <BusinessSignupForm 
                referralCode=""
                referringAgent={null}
                onCheckReferralCode={async () => null}
                onSuccess={handleSignupSuccess}
              />
            </TabsContent>
          </Tabs>
          
          {/* Community Features Preview */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-center mb-4">Join Our Growing Community</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="space-y-2">
                <Users className="h-8 w-8 mx-auto text-mansablue" />
                <p className="text-sm font-medium">Connect & Share</p>
                <p className="text-xs text-gray-600">Review businesses and share your experiences</p>
              </div>
              <div className="space-y-2">
                <TrendingUp className="h-8 w-8 mx-auto text-green-600" />
                <p className="text-sm font-medium">Track Impact</p>
                <p className="text-xs text-gray-600">See how your spending supports the community</p>
              </div>
              <div className="space-y-2">
                <CheckCircle className="h-8 w-8 mx-auto text-mansagold" />
                <p className="text-sm font-medium">Earn Rewards</p>
                <p className="text-xs text-gray-600">Get points and exclusive deals for your loyalty</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedSignupForm;
