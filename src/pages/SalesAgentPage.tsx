
import React from 'react';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/contexts/auth';
import { useSalesAgent } from '@/hooks/use-sales-agent';
import { useSalesAgentTabs } from '@/hooks/use-sales-agent-tabs';
import ResponsiveLayout from '@/components/layouts/ResponsiveLayout';
import GuestView from '@/components/sales-agent/GuestView';
import AgentContent from '@/components/sales-agent/AgentContent';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

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
    <ResponsiveLayout title="Sales Agent Program" className="bg-gradient-to-b from-blue-50 to-blue-100">
      <Helmet>
        <title>Sales Agent Program | Mansa Musa Marketplace</title>
      </Helmet>

      {/* Account Button - Fixed position at top right */}
      <div className="fixed top-4 right-4 z-40">
        <Button 
          className="bg-mansagold hover:bg-mansagold-dark text-white font-medium shadow-md"
          asChild
        >
          <Link to="/profile">Account</Link>
        </Button>
      </div>

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
    </ResponsiveLayout>
  );
};

export default SalesAgentPage;
