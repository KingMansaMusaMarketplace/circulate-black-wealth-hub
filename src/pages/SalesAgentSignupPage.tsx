
import React from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import ResponsiveLayout from '@/components/layouts/ResponsiveLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSalesAgent } from '@/hooks/use-sales-agent';
import { useSalesAgentTabs } from '@/hooks/use-sales-agent-tabs';
import AgentContent from '@/components/sales-agent/AgentContent';

const SalesAgentSignupPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { loading, isAgent, hasApplication, application } = useSalesAgent();
  const { 
    showTestForm, 
    handleApplicationSubmitted, 
    handleTestCompleted, 
    showTest 
  } = useSalesAgentTabs();

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <ResponsiveLayout title="Sales Agent Application">
      <Helmet>
        <title>Become a Sales Agent | Mansa Musa Marketplace</title>
        <meta name="description" content="Apply to become a sales agent for Mansa Musa Marketplace" />
      </Helmet>
      
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Sales Agent Program</h1>
          <p className="text-gray-600">
            Join our sales agent program and earn commissions by referring new customers and businesses to Mansa Musa Marketplace.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sales Agent Application</CardTitle>
            <CardDescription>
              Complete your application to become a Mansa Musa Marketplace sales agent
            </CardDescription>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>
      </div>
    </ResponsiveLayout>
  );
};

export default SalesAgentSignupPage;
