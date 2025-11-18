
import React from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import ResponsiveLayout from '@/components/layouts/ResponsiveLayout';
import { useSalesAgent } from '@/hooks/use-sales-agent';
import { useSalesAgentTabs } from '@/hooks/use-sales-agent-tabs';
import AgentContent from '@/components/sales-agent/AgentContent';
import { ContextualTooltip } from '@/components/ui/ContextualTooltip';
import { ProgressiveDisclosure } from '@/components/ui/ProgressiveDisclosure';

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
      
      {/* Modern Navy/Gold Background with Animated Orbs */}
      <div className="min-h-screen bg-gradient-to-br from-mansablue-dark via-mansablue to-mansablue-light relative overflow-hidden">
        {/* Animated Background Orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-96 h-96 bg-mansagold/20 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-mansagold-light/30 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
          <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-mansablue-light/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }} />
        </div>

        {/* Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 py-12 relative z-10">
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
          
          <ContextualTooltip
            id="signup-application-help"
            title="Complete Your Application"
            tip="Take your time filling out the application. Provide accurate information about your business experience and marketing ideas - this helps us approve your application faster."
            position="top"
            trigger="auto"
            delay={2000}
          >
            <div />
          </ContextualTooltip>
          
          <ProgressiveDisclosure
            id="sales-agent-benefits"
            title="Why Become a Sales Agent?"
            message="Earn up to 25% commission on business referrals, get access to exclusive marketing materials, and build a sustainable income stream with our growing marketplace."
            position="bottom"
            autoShow={true}
            delay={4000}
            actionText="Learn Benefits"
            onDismiss={() => {}}
          />
        </div>
      </div>
    </ResponsiveLayout>
  );
};

export default SalesAgentSignupPage;
