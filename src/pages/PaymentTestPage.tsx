import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ConnectStripeButton from '@/components/payments/ConnectStripeButton';
import PaymentForm from '@/components/payments/PaymentForm';
import TransactionsList from '@/components/payments/TransactionsList';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CreditCard, Store, TrendingUp, Info, Sparkles } from 'lucide-react';
import { IOSPaymentBlocker } from '@/components/platform/IOSPaymentBlocker';

const PaymentTestPage: React.FC = () => {
  const { user } = useAuth();
  const [testBusinessId] = useState('test-business-id');

  return (
    <div className="dark min-h-screen bg-gradient-to-br from-[#0a1628] via-[#1a1f3c] to-[#0d2847] relative overflow-hidden">
      <Helmet>
        <title>Payment Test | Mansa Musa Marketplace</title>
      </Helmet>

      {/* Animated gradient orbs */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-amber-500/20 to-yellow-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-blue-500/15 to-indigo-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/3 w-80 h-80 bg-gradient-to-r from-amber-500/10 to-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />

      <div className="relative z-10 py-8 px-4">
        <IOSPaymentBlocker
          fallback={(
            <div className="max-w-2xl mx-auto">
              <Alert className="bg-white/5 backdrop-blur-xl border-white/10">
                <Info className="h-4 w-4 text-amber-400" />
                <AlertDescription className="text-slate-300">
                  Payment testing is not available in the iOS app. Please visit our website to test payment features.
                </AlertDescription>
              </Alert>
            </div>
          )}
        >
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Header */}
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-3">
                <Sparkles className="h-8 w-8 text-amber-400" />
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
                  Payment Integration Test
                </h1>
                <Sparkles className="h-8 w-8 text-amber-400" />
              </div>
              <p className="text-slate-300 max-w-2xl mx-auto">
                Test the Stripe Connect integration, payment processing, and platform fee capture
              </p>
            </div>

            {!user && (
              <Alert className="bg-white/5 backdrop-blur-xl border-white/10">
                <Info className="h-4 w-4 text-amber-400" />
                <AlertDescription className="text-slate-300">
                  Please log in to test payment features
                </AlertDescription>
              </Alert>
            )}

            {user && (
              <>
                {/* How It Works Card */}
                <Card className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 backdrop-blur-xl border-white/10">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <CreditCard className="h-5 w-5 text-amber-400" />
                      <span className="text-white">How It Works</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm text-slate-300">
                    <p>• Businesses connect their Stripe account via Stripe Connect</p>
                    <p>• Customers pay businesses through the app</p>
                    <p>• Platform automatically captures 2.5% fee from each transaction</p>
                    <p>• Businesses receive 97.5% of the payment amount</p>
                    <p>• All payments are processed securely through Stripe</p>
                  </CardContent>
                </Card>

                {/* Tabs */}
                <Tabs defaultValue="connect" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 bg-white/5 backdrop-blur-xl border border-white/10">
                    <TabsTrigger value="connect" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-yellow-500 data-[state=active]:text-slate-900 text-slate-300">
                      <Store className="h-4 w-4 mr-2" />
                      Connect Stripe
                    </TabsTrigger>
                    <TabsTrigger value="payment" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-yellow-500 data-[state=active]:text-slate-900 text-slate-300">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Make Payment
                    </TabsTrigger>
                    <TabsTrigger value="transactions" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-yellow-500 data-[state=active]:text-slate-900 text-slate-300">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Transactions
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="connect" className="space-y-4 mt-6">
                    <Card className="bg-white/5 backdrop-blur-xl border-white/10">
                      <CardHeader>
                        <CardTitle className="text-white">Business Account Setup</CardTitle>
                        <CardDescription className="text-slate-400">
                          Connect a Stripe account to start accepting payments
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ConnectStripeButton businessId={testBusinessId} />
                      </CardContent>
                    </Card>

                    <Alert className="bg-white/5 backdrop-blur-xl border-white/10">
                      <Info className="h-4 w-4 text-amber-400" />
                      <AlertDescription className="text-slate-300">
                        <strong className="text-amber-400">Testing:</strong> Use Stripe test mode. You'll need to complete
                        the onboarding flow with test information. Stripe will provide test
                        account credentials during development.
                      </AlertDescription>
                    </Alert>
                  </TabsContent>

                  <TabsContent value="payment" className="space-y-4 mt-6">
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg p-6">
                      <PaymentForm
                        businessId={testBusinessId}
                        businessName="Test Business"
                        suggestedAmount={100}
                        onSuccess={(paymentIntentId) => {
                          console.log('Payment successful:', paymentIntentId);
                        }}
                      />
                    </div>

                    <Card className="bg-white/5 backdrop-blur-xl border-white/10">
                      <CardHeader>
                        <CardTitle className="text-white">Test Card Numbers</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2 text-sm">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                            <p className="font-medium text-amber-400">Successful payment:</p>
                            <code className="text-xs bg-slate-800/50 text-slate-200 px-2 py-1 rounded mt-1 inline-block">
                              4242 4242 4242 4242
                            </code>
                          </div>
                          <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                            <p className="font-medium text-amber-400">Payment requires auth:</p>
                            <code className="text-xs bg-slate-800/50 text-slate-200 px-2 py-1 rounded mt-1 inline-block">
                              4000 0025 0000 3155
                            </code>
                          </div>
                          <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                            <p className="font-medium text-amber-400">Payment declined:</p>
                            <code className="text-xs bg-slate-800/50 text-slate-200 px-2 py-1 rounded mt-1 inline-block">
                              4000 0000 0000 9995
                            </code>
                          </div>
                          <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                            <p className="font-medium text-amber-400">Insufficient funds:</p>
                            <code className="text-xs bg-slate-800/50 text-slate-200 px-2 py-1 rounded mt-1 inline-block">
                              4000 0000 0000 9995
                            </code>
                          </div>
                        </div>
                        <p className="text-slate-400 mt-4">
                          Use any future expiry date and any 3-digit CVC
                        </p>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="transactions" className="space-y-4 mt-6">
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg p-6">
                      <TransactionsList
                        businessId={testBusinessId}
                        showRevenue={true}
                      />
                    </div>
                  </TabsContent>
                </Tabs>

                {/* Next Steps Card */}
                <Card className="bg-white/5 backdrop-blur-xl border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-amber-400" />
                      Next Steps for Production
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm text-slate-300">
                    <p>1. Set up Stripe webhook endpoint for production</p>
                    <p>2. Configure STRIPE_WEBHOOK_SECRET in Supabase secrets</p>
                    <p>3. Integrate Stripe Elements for card input (currently using test mode)</p>
                    <p>4. Add refund functionality for businesses</p>
                    <p>5. Implement dispute handling</p>
                    <p>6. Add analytics dashboard for platform revenue tracking</p>
                    <p>7. Set up automated payout scheduling</p>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </IOSPaymentBlocker>
      </div>
    </div>
  );
};

export default PaymentTestPage;
