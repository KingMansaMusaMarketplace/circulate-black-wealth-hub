import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import ResponsiveLayout from '@/components/layouts/ResponsiveLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ConnectStripeButton from '@/components/payments/ConnectStripeButton';
import PaymentForm from '@/components/payments/PaymentForm';
import TransactionsList from '@/components/payments/TransactionsList';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CreditCard, Store, TrendingUp, Info } from 'lucide-react';

const PaymentTestPage: React.FC = () => {
  const { user } = useAuth();
  const [testBusinessId] = useState('test-business-id'); // Replace with actual business ID in production

  return (
    <ResponsiveLayout
      title="Payment Integration Test"
      description="Test the payment processing integration with platform fees"
    >
      <Helmet>
        <title>Payment Test | Mansa Musa Marketplace</title>
      </Helmet>

      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-mansablue">
            Payment Integration Test
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Test the Stripe Connect integration, payment processing, and platform fee capture
          </p>
        </div>

        {!user && (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Please log in to test payment features
            </AlertDescription>
          </Alert>
        )}

        {user && (
          <>
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CreditCard className="h-5 w-5 text-blue-600" />
                  <span className="text-blue-900">How It Works</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-blue-800">
                <p>• Businesses connect their Stripe account via Stripe Connect</p>
                <p>• Customers pay businesses through the app</p>
                <p>• Platform automatically captures 2.5% fee from each transaction</p>
                <p>• Businesses receive 97.5% of the payment amount</p>
                <p>• All payments are processed securely through Stripe</p>
              </CardContent>
            </Card>

            <Tabs defaultValue="connect" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="connect">
                  <Store className="h-4 w-4 mr-2" />
                  Connect Stripe
                </TabsTrigger>
                <TabsTrigger value="payment">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Make Payment
                </TabsTrigger>
                <TabsTrigger value="transactions">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Transactions
                </TabsTrigger>
              </TabsList>

              <TabsContent value="connect" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Business Account Setup</CardTitle>
                    <CardDescription>
                      Connect a Stripe account to start accepting payments
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ConnectStripeButton businessId={testBusinessId} />
                  </CardContent>
                </Card>

                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Testing:</strong> Use Stripe test mode. You'll need to complete
                    the onboarding flow with test information. Stripe will provide test
                    account credentials during development.
                  </AlertDescription>
                </Alert>
              </TabsContent>

              <TabsContent value="payment" className="space-y-4">
                <PaymentForm
                  businessId={testBusinessId}
                  businessName="Test Business"
                  suggestedAmount={100}
                  onSuccess={(paymentIntentId) => {
                    console.log('Payment successful:', paymentIntentId);
                  }}
                />

                <Card>
                  <CardHeader>
                    <CardTitle>Test Card Numbers</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="font-medium">Successful payment:</p>
                        <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                          4242 4242 4242 4242
                        </code>
                      </div>
                      <div>
                        <p className="font-medium">Payment requires auth:</p>
                        <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                          4000 0025 0000 3155
                        </code>
                      </div>
                      <div>
                        <p className="font-medium">Payment declined:</p>
                        <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                          4000 0000 0000 9995
                        </code>
                      </div>
                      <div>
                        <p className="font-medium">Insufficient funds:</p>
                        <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                          4000 0000 0000 9995
                        </code>
                      </div>
                    </div>
                    <p className="text-gray-500 mt-4">
                      Use any future expiry date and any 3-digit CVC
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="transactions" className="space-y-4">
                <TransactionsList
                  businessId={testBusinessId}
                  showRevenue={true}
                />
              </TabsContent>
            </Tabs>

            <Card>
              <CardHeader>
                <CardTitle>Next Steps for Production</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-gray-600">
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
    </ResponsiveLayout>
  );
};

export default PaymentTestPage;
