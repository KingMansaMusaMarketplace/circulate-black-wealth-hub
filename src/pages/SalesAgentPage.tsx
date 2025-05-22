
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/contexts/auth';
import { useSalesAgent } from '@/hooks/use-sales-agent';
import ResponsiveLayout from '@/components/layouts/ResponsiveLayout';
import { Button } from '@/components/ui/button';
import AgentApplicationForm from '@/components/sales-agent/AgentApplicationForm';
import AgentQualificationTest from '@/components/sales-agent/AgentQualificationTest';
import ApplicationStatus from '@/components/sales-agent/ApplicationStatus';
import AgentDashboard from '@/components/sales-agent/AgentDashboard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowRight, DollarSign, Medal, Users } from 'lucide-react';

const SalesAgentPage: React.FC = () => {
  const { user } = useAuth();
  const { loading, isAgent, hasApplication, application } = useSalesAgent();
  const [showTestForm, setShowTestForm] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const handleApplicationSubmitted = () => {
    setRefresh(prev => !prev);
  };

  const handleTestCompleted = () => {
    setShowTestForm(false);
    setRefresh(prev => !prev);
  };

  const renderGuestView = () => {
    return (
      <div className="space-y-10">
        {/* Hero section */}
        <div className="text-center py-8 px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Become a Mansa Musa Marketplace Sales Agent</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
            Join our growing team of sales agents and earn commissions by connecting businesses and customers to the Mansa Musa Marketplace.
          </p>
          <Button asChild size="lg" className="bg-mansablue hover:bg-mansablue-dark">
            <a href="/login?redirect=/sales-agent">
              Sign In to Apply <ArrowRight className="ml-2 h-5 w-5" />
            </a>
          </Button>
        </div>

        {/* Benefits grid */}
        <div className="bg-gray-50 py-12 px-4">
          <h2 className="text-2xl font-bold text-center mb-8">Benefits of Becoming a Sales Agent</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="bg-mansablue/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <DollarSign className="h-6 w-6 text-mansablue" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Earn Commissions</h3>
              <p className="text-gray-600">
                Receive 10% commission on all subscription fees from businesses and customers you refer to our platform.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="bg-mansablue/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Medal className="h-6 w-6 text-mansablue" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Performance Rewards</h3>
              <p className="text-gray-600">
                Top-performing agents receive bonuses, recognition, and exclusive access to special events.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="bg-mansablue/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-mansablue" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Community Impact</h3>
              <p className="text-gray-600">
                Help build wealth in Black communities by connecting businesses with customers who value supporting them.
              </p>
            </div>
          </div>
        </div>

        {/* How it works section */}
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-center">How the Sales Agent Program Works</h2>
          
          <ol className="space-y-8">
            <li className="flex gap-4">
              <div className="bg-mansablue text-white rounded-full w-8 h-8 flex-shrink-0 flex items-center justify-center font-bold">1</div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Sign Up & Apply</h3>
                <p className="text-gray-600">
                  Create an account and complete the sales agent application. Our team will review your application.
                </p>
              </div>
            </li>
            
            <li className="flex gap-4">
              <div className="bg-mansablue text-white rounded-full w-8 h-8 flex-shrink-0 flex items-center justify-center font-bold">2</div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Pass the Qualification Test</h3>
                <p className="text-gray-600">
                  Complete a simple test about Mansa Musa Marketplace to ensure you can represent us effectively.
                </p>
              </div>
            </li>
            
            <li className="flex gap-4">
              <div className="bg-mansablue text-white rounded-full w-8 h-8 flex-shrink-0 flex items-center justify-center font-bold">3</div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Receive Your Referral Code</h3>
                <p className="text-gray-600">
                  Once approved, you'll get a unique referral code to share with businesses and customers.
                </p>
              </div>
            </li>
            
            <li className="flex gap-4">
              <div className="bg-mansablue text-white rounded-full w-8 h-8 flex-shrink-0 flex items-center justify-center font-bold">4</div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Start Earning</h3>
                <p className="text-gray-600">
                  Every time someone signs up with your code, you'll earn a 10% commission on their subscription fees.
                </p>
              </div>
            </li>
          </ol>
        </div>

        {/* CTA section */}
        <div className="bg-mansablue py-12 px-4 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Join Our Sales Agent Team?</h2>
          <p className="text-lg mb-6 max-w-2xl mx-auto">
            Sign up today and start earning commissions while helping to build wealth in Black communities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" size="lg" className="bg-white text-mansablue hover:bg-gray-100" asChild>
              <a href="/login?redirect=/sales-agent">
                Login to Apply
              </a>
            </Button>
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-mansablue" asChild>
              <a href="/signup">
                Create an Account
              </a>
            </Button>
          </div>
        </div>
      </div>
    );
  };

  if (!user) {
    return (
      <ResponsiveLayout title="Sales Agent Program">
        <Helmet>
          <title>Sales Agent Program | Mansa Musa Marketplace</title>
        </Helmet>

        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Sales Agent Program</h1>
            <p className="text-gray-600">
              Join our sales agent program and earn commissions by referring new customers and businesses to Mansa Musa Marketplace.
            </p>
          </div>

          {renderGuestView()}
        </div>
      </ResponsiveLayout>
    );
  }

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center p-12">
          <div className="animate-spin w-12 h-12 border-t-4 border-mansablue border-solid rounded-full"></div>
        </div>
      );
    }

    if (isAgent) {
      return <AgentDashboard />;
    }

    if (showTestForm && application) {
      return (
        <AgentQualificationTest
          applicationId={application.id}
          onComplete={handleTestCompleted}
        />
      );
    }

    if (hasApplication) {
      return (
        <ApplicationStatus 
          application={application!}
          onStartTest={() => setShowTestForm(true)}
        />
      );
    }

    return <AgentApplicationForm onSuccess={handleApplicationSubmitted} />;
  };

  return (
    <ResponsiveLayout title="Sales Agent Program">
      <Helmet>
        <title>Sales Agent Program | Mansa Musa Marketplace</title>
      </Helmet>

      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Sales Agent Program</h1>
          <p className="text-gray-600">
            Join our sales agent program and earn commissions by referring new customers and businesses to Mansa Musa Marketplace.
          </p>
        </div>

        {isAgent ? (
          <Tabs defaultValue="dashboard">
            <TabsList className="mb-6">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="how-it-works">How It Works</TabsTrigger>
            </TabsList>
            <TabsContent value="dashboard">
              {renderContent()}
            </TabsContent>
            <TabsContent value="how-it-works">
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-bold mb-4">How the Sales Agent Program Works</h2>
                  <ol className="space-y-4 list-decimal list-inside">
                    <li className="pl-2">
                      <span className="font-medium">Apply to become a sales agent</span>
                      <p className="text-gray-600 ml-6 mt-1">
                        Fill out the application form with your details.
                      </p>
                    </li>
                    <li className="pl-2">
                      <span className="font-medium">Complete the qualification test</span>
                      <p className="text-gray-600 ml-6 mt-1">
                        Pass a simple test about Mansa Musa Marketplace to ensure you can represent us effectively.
                      </p>
                    </li>
                    <li className="pl-2">
                      <span className="font-medium">Receive your unique referral code</span>
                      <p className="text-gray-600 ml-6 mt-1">
                        Once approved, you'll get a personal referral code to share with potential customers.
                      </p>
                    </li>
                    <li className="pl-2">
                      <span className="font-medium">Share your referral code</span>
                      <p className="text-gray-600 ml-6 mt-1">
                        Share your code with potential customers and business owners through various channels.
                      </p>
                    </li>
                    <li className="pl-2">
                      <span className="font-medium">Earn commissions</span>
                      <p className="text-gray-600 ml-6 mt-1">
                        You'll earn 10% commission on subscription fees when someone signs up using your code.
                      </p>
                    </li>
                    <li className="pl-2">
                      <span className="font-medium">Get paid</span>
                      <p className="text-gray-600 ml-6 mt-1">
                        Commissions are released 30 days after a successful referral.
                      </p>
                    </li>
                  </ol>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-bold mb-4">Commission Structure</h2>
                  <div className="space-y-3">
                    <p>
                      <span className="font-medium">Commission Rate:</span> 10% of subscription fees
                    </p>
                    <p>
                      <span className="font-medium">Payment Schedule:</span> 30 days after successful referral
                    </p>
                    <p>
                      <span className="font-medium">Recurring Commissions:</span> Earn commissions on recurring subscription payments
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        ) : (
          renderContent()
        )}
      </div>
    </ResponsiveLayout>
  );
};

export default SalesAgentPage;
