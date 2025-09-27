import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { CheckCircle, Users, Building, CreditCard, TrendingUp, Crown, Zap } from 'lucide-react';
import CustomerSignupTab from './CustomerSignupTab';
import BusinessSignupForm from './BusinessSignupForm';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscriptionActions } from '@/components/subscription/hooks/useSubscriptionActions';

const EnhancedSignupForm: React.FC = () => {
  const { user } = useAuth();
  const { handleSubscribe, loading } = useSubscriptionActions();
  const [selectedTab, setSelectedTab] = useState('customer');
  const [selectedPlan, setSelectedPlan] = useState<'free' | 'premium' | 'business_starter' | 'business'>('free');
  const [showAccountForm, setShowAccountForm] = useState(false);

  const handlePlanSelect = async (plan: 'free' | 'premium' | 'business_starter' | 'business') => {
    setSelectedPlan(plan);
    
    // For free plans, go straight to account creation
    if (plan === 'free') {
      setShowAccountForm(true);
      return;
    }
    
    // For paid plans, show payment collection notice and redirect to Stripe
    const tier = plan === 'premium' ? 'premium' : plan;
    
    try {
      await handleSubscribe(tier as any);
      // After successful payment setup, user will be redirected to success page
    } catch (error) {
      console.error('Payment setup failed:', error);
    }
  };

  const customerPlans = [
    {
      id: 'free',
      name: 'Community Member',
      price: 'Free Forever',
      description: 'Perfect for getting started',
      features: [
        'Browse complete business directory',
        'QR code scanning',
        'Basic loyalty points',
        'Community forum access'
      ],
      icon: Users,
      buttonText: 'Start Free',
      popular: false
    },
    {
      id: 'premium',
      name: 'Premium Member',
      price: 'Free until Jan 2026, then $4.99/month',
      description: 'Enhanced features and exclusive access',
      features: [
        'Everything in Community',
        'Redeem loyalty points for rewards',
        'Exclusive deals and discounts',
        'Premium customer support',
        'Advanced search filters'
      ],
      icon: Crown,
      buttonText: 'Get Premium (Free until 2026)',
      popular: true
    }
  ];

  const businessPlans = [
    {
      id: 'business_starter',
      name: 'Starter Business',
      price: 'Free until Jan 2026, then $29/month',
      description: 'Perfect for small businesses',
      features: [
        'Business profile listing',
        'Up to 3 QR codes',
        'Basic analytics dashboard',
        'Customer loyalty program',
        'Business verification'
      ],
      icon: Building,
      buttonText: 'Start Business (Free until 2026)',
      popular: false
    },
    {
      id: 'business',
      name: 'Professional Business',
      price: 'Free until Jan 2026, then $100/month',
      description: 'Complete business management suite',
      features: [
        'Everything in Starter',
        'Up to 50 QR codes',
        'Advanced analytics',
        'Event creation',
        'Priority support'
      ],
      icon: Zap,
      buttonText: 'Get Professional (Free until 2026)',
      popular: true
    }
  ];

  // Show account creation form for free plan or after successful payment setup
  if (showAccountForm) {
    return (
      <div className="w-full max-w-7xl mx-auto">
        <Card className="w-full">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Create Your Account</CardTitle>
            <CardDescription>
              You selected: {selectedPlan === 'free' ? 'Community Member (Free)' : selectedPlan}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            {selectedTab === 'customer' ? (
              <div className="max-w-md mx-auto">
                <CustomerSignupTab onSuccess={() => {}} />
              </div>
            ) : (
              <BusinessSignupForm 
                referralCode=""
                referringAgent={null}
                onCheckReferralCode={async () => null}
                onSuccess={() => {}}
              />
            )}
            
            <div className="mt-6 text-center">
              <Button variant="outline" onClick={() => setShowAccountForm(false)}>
                ← Back to Plans
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto">
      <Card className="w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Join the Movement</CardTitle>
          <CardDescription>
            Choose your membership type and plan to start supporting Black-owned businesses
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
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-center mb-2">Customer Plans</h3>
                <p className="text-gray-600 text-center mb-6">Support Black-owned businesses and earn rewards</p>
                
                <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                  {customerPlans.map((plan) => {
                    const IconComponent = plan.icon;
                    return (
                      <Card key={plan.id} className={`relative cursor-pointer transition-all hover:shadow-lg ${
                        plan.popular ? 'ring-2 ring-mansagold scale-105' : ''
                      }`}>
                        {plan.popular && (
                          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                            <div className="bg-mansagold text-white px-4 py-1 rounded-full text-sm font-medium">
                              Most Popular
                            </div>
                          </div>
                        )}
                        
                        <CardHeader className="text-center pb-4">
                          <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center bg-mansablue/10">
                            <IconComponent className="h-8 w-8 text-mansablue" />
                          </div>
                          <CardTitle className="text-xl">{plan.name}</CardTitle>
                          <CardDescription className="text-sm">{plan.description}</CardDescription>
                          <div className="mt-4">
                            <div className="text-lg font-bold text-mansablue">{plan.price}</div>
                          </div>
                        </CardHeader>
                        
                        <CardContent>
                          <ul className="space-y-2 mb-6">
                            {plan.features.map((feature, index) => (
                              <li key={index} className="flex items-center text-sm">
                                <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                          
                          <Button 
                            className="w-full" 
                            onClick={() => handlePlanSelect(plan.id as any)}
                            disabled={loading !== null}
                            variant={plan.popular ? "default" : "outline"}
                          >
                            {loading && selectedPlan === plan.id ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                                Processing...
                              </>
                            ) : (
                              plan.buttonText
                            )}
                          </Button>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="business" className="w-full">
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-center mb-2">Business Plans</h3>
                <p className="text-gray-600 text-center mb-6">Grow your business and connect with customers</p>
                
                <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                  {businessPlans.map((plan) => {
                    const IconComponent = plan.icon;
                    return (
                      <Card key={plan.id} className={`relative cursor-pointer transition-all hover:shadow-lg ${
                        plan.popular ? 'ring-2 ring-mansagold scale-105' : ''
                      }`}>
                        {plan.popular && (
                          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                            <div className="bg-mansagold text-white px-4 py-1 rounded-full text-sm font-medium">
                              Most Popular
                            </div>
                          </div>
                        )}
                        
                        <CardHeader className="text-center pb-4">
                          <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center bg-mansablue/10">
                            <IconComponent className="h-8 w-8 text-mansablue" />
                          </div>
                          <CardTitle className="text-xl">{plan.name}</CardTitle>
                          <CardDescription className="text-sm">{plan.description}</CardDescription>
                          <div className="mt-4">
                            <div className="text-lg font-bold text-mansablue">{plan.price}</div>
                          </div>
                        </CardHeader>
                        
                        <CardContent>
                          <ul className="space-y-2 mb-6">
                            {plan.features.map((feature, index) => (
                              <li key={index} className="flex items-center text-sm">
                                <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                          
                          <Button 
                            className="w-full" 
                            onClick={() => handlePlanSelect(plan.id as any)}
                            disabled={loading !== null}
                            variant={plan.popular ? "default" : "outline"}
                          >
                            {loading && selectedPlan === plan.id ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                                Processing...
                              </>
                            ) : (
                              plan.buttonText
                            )}
                          </Button>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          {/* Important Notice */}
          <div className="mt-8">
            <Alert className="max-w-4xl mx-auto">
              <CreditCard className="h-4 w-4" />
              <AlertDescription>
                <strong>Payment Info Required:</strong> Premium and Business plans require a credit/debit card during signup. 
                You'll enjoy all features completely FREE until January 1, 2026, then billing begins monthly. 
                Cancel anytime before then to avoid charges.
              </AlertDescription>
            </Alert>
          </div>
          
          {/* Community Features Preview */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg max-w-4xl mx-auto">
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