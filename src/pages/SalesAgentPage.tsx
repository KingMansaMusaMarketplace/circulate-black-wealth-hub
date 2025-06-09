
import React from 'react';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/contexts/AuthContext';
import { useSalesAgent } from '@/hooks/use-sales-agent';
import { useSalesAgentTabs } from '@/hooks/use-sales-agent-tabs';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import GuestView from '@/components/sales-agent/GuestView';
import AgentContent from '@/components/sales-agent/AgentContent';

const SalesAgentPage: React.FC = () => {
  const { user } = useAuth();
  const { loading, isAgent, hasApplication, application } = useSalesAgent();
  const { 
    showTestForm, 
    handleApplicationSubmitted, 
    handleTestCompleted, 
    showTest 
  } = useSalesAgentTabs();

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Sales Agent Program | Mansa Musa Marketplace</title>
      </Helmet>

      <Navbar />

      <main className="bg-gradient-to-b from-blue-50 to-blue-100 py-8">
        <div className="container mx-auto px-4">
          {!user ? (
            <div className="max-w-6xl mx-auto">
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-mansablue mb-2">Sales Agent Program</h1>
                <p className="text-gray-600">
                  Join our sales agent program and earn commissions by referring new customers and businesses to Mansa Musa Marketplace.
                </p>
              </div>

              <GuestView />
            </div>
          ) : (
            <div className="max-w-4xl mx-auto">
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-mansablue mb-2">Sales Agent Program</h1>
                <p className="text-gray-600">
                  Join our sales agent program and earn commissions by referring new customers and businesses to Mansa Musa Marketplace.
                </p>
              </div>

              <AgentContent 
                loading={loading}
                isAgent={isAgent}
                hasApplication={hasApplication}
                application={application}
                showTestForm={showTestForm}
                onApplicationSubmitted={handleApplicationSubmitted}
                onTestCompleted={handleTestCompleted}
                onStartTest={showTest}
              />
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SalesAgentPage;
