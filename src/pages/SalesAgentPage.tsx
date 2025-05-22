
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

  if (!user) {
    return (
      <ResponsiveLayout title="Sales Agent Program">
        <div className="max-w-3xl mx-auto text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Please Log In</h2>
          <p className="mb-6">You need to be logged in to access the Sales Agent Program.</p>
          <Button asChild>
            <a href="/login">Log In</a>
          </Button>
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
