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
import { shouldHideStripePayments } from '@/utils/platform-utils';
import { IOSPaymentBlocker } from '@/components/platform/IOSPaymentBlocker';

const EnhancedSignupForm: React.FC = () => {
  const { user } = useAuth();
  const { handleSubscribe, loading } = useSubscriptionActions();
  const [selectedTab, setSelectedTab] = useState('customer');
  const [selectedPlan, setSelectedPlan] = useState<'free' | 'premium' | 'business_starter' | 'business'>('free');
  const [showAccountForm, setShowAccountForm] = useState(false);
  const hidePayments = shouldHideStripePayments();

  const handlePlanSelect = async (plan: 'free' | 'premium' | 'business_starter' | 'business') => {
    setSelectedPlan(plan);
    
    // Block paid plans on iOS
    if (hidePayments && plan !== 'free') {
      return;
    }
    
    // For all plans, first show account creation form
    // For paid plans, payment setup will happen after account creation
    setShowAccountForm(true);
  };

  const customerPlans = [
    {
      id: 'free',
      name: 'Community Member',
      price: hidePayments ? 'Free Forever' : 'Free Forever',
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
      price: hidePayments ? 'Free Forever' : 'Free until Jan 2026',
      description: 'Enhanced features and exclusive access',
      features: [
        'Everything in Community',
        'Redeem loyalty points for rewards',
        'Exclusive deals and discounts',
        'Premium customer support',
        'Advanced search filters'
      ],
      icon: Crown,
      buttonText: hidePayments ? 'Get Premium' : 'Get Premium (Free until 2026)',
      popular: true
    }
  ];

  const businessPlans = [
    {
      id: 'business_starter',
      name: 'Starter Business',
      price: hidePayments ? 'Free to Use' : 'Free until Jan 2026, then $29/month',
      description: 'Perfect for small businesses',
      features: [
        'Business profile listing',
        'Up to 3 QR codes',
        'Basic analytics dashboard',
        'Customer loyalty program',
        'Business verification'
      ],
      icon: Building,
      buttonText: hidePayments ? 'Start Business' : 'Start Business (Free until 2026)',
      popular: false
    },
    {
      id: 'business',
      name: 'Professional Business',
      price: hidePayments ? 'Free to Use' : 'Free until Jan 2026',
      description: 'Complete business management suite',
      features: [
        'Everything in Starter',
        'Up to 50 QR codes',
        'Advanced analytics',
        'Event creation',
        'Priority support'
      ],
      icon: Zap,
      buttonText: hidePayments ? 'Get Professional' : 'Get Professional (Free until 2026)',
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
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6">
      <Card className="w-full border-2 shadow-xl bg-card">
        <CardHeader className="text-center px-4 sm:px-6 pb-4">
          <CardTitle className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Join the Movement
          </CardTitle>
          <CardDescription className="text-sm sm:text-base mt-2">
            Choose your membership type and plan to start supporting Black-owned businesses
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8 max-w-md mx-auto h-14 bg-muted/50 p-1">
              <TabsTrigger 
                value="customer" 
                className="flex items-center justify-center space-x-2 text-sm sm:text-base font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md transition-all"
              >
                <Users className="h-4 w-4 sm:h-5 sm:w-5" />
                <span>Customer</span>
              </TabsTrigger>
              <TabsTrigger 
                value="business" 
                className="flex items-center justify-center space-x-2 text-sm sm:text-base font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md transition-all"
              >
                <Building className="h-4 w-4 sm:h-5 sm:w-5" />
                <span>Business</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="customer" className="w-full">
              <div className="mb-6 sm:mb-8">
                <h3 className="text-xl sm:text-2xl font-bold text-center mb-2 text-foreground">Customer Plans</h3>
                <p className="text-muted-foreground text-center mb-6 sm:mb-8 text-sm sm:text-base px-2">
                  Support Black-owned businesses and earn rewards
                </p>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto">
                  {customerPlans.map((plan) => {
                    const IconComponent = plan.icon;
                    return (
                      <Card 
                        key={plan.id} 
                        className={`relative cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl border-2 ${
                          plan.popular 
                            ? 'border-primary bg-gradient-to-br from-primary/5 to-transparent ring-2 ring-primary/20 mt-8 sm:mt-10' 
                            : 'border-border hover:border-primary/50 mt-2 sm:mt-4 bg-card'
                        }`}
                      >
                        {plan.popular && (
                          <div className="absolute -top-5 sm:-top-6 left-1/2 transform -translate-x-1/2 z-10">
                            <div className="bg-gradient-to-r from-amber-400 to-amber-500 text-white px-4 sm:px-6 py-1.5 rounded-full text-xs sm:text-sm font-bold shadow-lg">
                              ⭐ Most Popular
                            </div>
                          </div>
                        )}
                        
                        <CardHeader className="text-center pb-4 sm:pb-6 px-4 sm:px-6">
                          <div className={`w-14 h-14 sm:w-20 sm:h-20 rounded-full mx-auto mb-4 sm:mb-6 flex items-center justify-center shadow-md ${
                            plan.popular 
                              ? 'bg-gradient-to-br from-primary to-primary/70' 
                              : 'bg-primary/10'
                          }`}>
                            <IconComponent className={`h-6 w-6 sm:h-10 sm:w-10 ${
                              plan.popular ? 'text-primary-foreground' : 'text-primary'
                            }`} />
                          </div>
                          <CardTitle className="text-xl sm:text-2xl mb-3 font-bold">{plan.name}</CardTitle>
                          <div className={`text-2xl sm:text-3xl font-bold mb-2 ${
                            plan.popular ? 'bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent' : 'text-foreground'
                          }`}>
                            {plan.price}
                          </div>
                          <CardDescription className="text-sm mt-2">{plan.description}</CardDescription>
                        </CardHeader>
                        
                        <CardContent className="px-4 sm:px-6">
                          <ul className="space-y-3 mb-6 sm:mb-8">
                            {plan.features.map((feature, index) => (
                              <li key={index} className="flex items-start text-sm sm:text-base">
                                <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                                <span className="leading-relaxed text-muted-foreground">{feature}</span>
                              </li>
                            ))}
                          </ul>
                          
                          <Button 
                            className={`w-full text-sm sm:text-base font-semibold py-4 sm:py-6 h-auto shadow-md hover:shadow-lg transition-all ${
                              plan.popular ? 'bg-gradient-to-r from-primary to-primary/80' : ''
                            }`}
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
                              <span>{plan.buttonText}</span>
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
              <div className="mb-6 sm:mb-8">
                <h3 className="text-xl sm:text-2xl font-bold text-center mb-2 text-foreground">Business Plans</h3>
                <p className="text-muted-foreground text-center mb-6 sm:mb-8 text-sm sm:text-base px-2">
                  Grow your business and connect with customers
                </p>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto">
                  {businessPlans.map((plan) => {
                    const IconComponent = plan.icon;
                    return (
                      <Card 
                        key={plan.id} 
                        className={`relative cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl border-2 ${
                          plan.popular 
                            ? 'border-primary bg-gradient-to-br from-primary/5 to-transparent ring-2 ring-primary/20 mt-8 sm:mt-10' 
                            : 'border-border hover:border-primary/50 mt-2 sm:mt-4 bg-card'
                        }`}
                      >
                        {plan.popular && (
                          <div className="absolute -top-5 sm:-top-6 left-1/2 transform -translate-x-1/2 z-10">
                            <div className="bg-gradient-to-r from-amber-400 to-amber-500 text-white px-4 sm:px-6 py-1.5 rounded-full text-xs sm:text-sm font-bold shadow-lg">
                              ⭐ Most Popular
                            </div>
                          </div>
                        )}
                        
                        <CardHeader className="text-center pb-4 sm:pb-6 px-4 sm:px-6">
                          <div className={`w-14 h-14 sm:w-20 sm:h-20 rounded-full mx-auto mb-4 sm:mb-6 flex items-center justify-center shadow-md ${
                            plan.popular 
                              ? 'bg-gradient-to-br from-primary to-primary/70' 
                              : 'bg-primary/10'
                          }`}>
                            <IconComponent className={`h-6 w-6 sm:h-10 sm:w-10 ${
                              plan.popular ? 'text-primary-foreground' : 'text-primary'
                            }`} />
                          </div>
                          <CardTitle className="text-xl sm:text-2xl mb-3 font-bold">{plan.name}</CardTitle>
                          <div className={`text-2xl sm:text-3xl font-bold mb-2 ${
                            plan.popular ? 'bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent' : 'text-foreground'
                          }`}>
                            {plan.price}
                          </div>
                          <CardDescription className="text-sm mt-2">{plan.description}</CardDescription>
                        </CardHeader>
                        
                        <CardContent className="px-4 sm:px-6">
                          <ul className="space-y-3 mb-6 sm:mb-8">
                            {plan.features.map((feature, index) => (
                              <li key={index} className="flex items-start text-sm sm:text-base">
                                <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                                <span className="leading-relaxed text-muted-foreground">{feature}</span>
                              </li>
                            ))}
                          </ul>
                          
                          <Button 
                            className={`w-full text-sm sm:text-base font-semibold py-4 sm:py-6 h-auto shadow-md hover:shadow-lg transition-all ${
                              plan.popular ? 'bg-gradient-to-r from-primary to-primary/80' : ''
                            }`}
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
                              <span>{plan.buttonText}</span>
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
          
          {/* Important Notice - Hide on iOS */}
          {!hidePayments && (
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
          )}
          
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