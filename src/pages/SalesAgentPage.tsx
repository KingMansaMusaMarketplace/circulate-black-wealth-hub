
import React from 'react';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/contexts/AuthContext';
import { useSalesAgent } from '@/hooks/use-sales-agent';
import { useSalesAgentTabs } from '@/hooks/use-sales-agent-tabs';
import { Navbar } from '@/components/navbar';
import Footer from '@/components/Footer';
import GuestView from '@/components/sales-agent/GuestView';
import AgentContent from '@/components/sales-agent/AgentContent';
import { ContextualTooltip } from '@/components/ui/ContextualTooltip';
import { ProgressiveDisclosure } from '@/components/ui/ProgressiveDisclosure';

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
              
              <ContextualTooltip
                id="guest-sales-agent-info"
                title="Sales Agent Program"
                tip="Join our sales agent program to earn commissions by referring businesses and customers. No upfront costs - you only earn when your referrals succeed!"
                position="top"
                trigger="auto"
                delay={3000}
              >
                <div />
              </ContextualTooltip>
              
              <ProgressiveDisclosure
                id="sales-agent-getting-started"
                title="Ready to Start Earning?"
                message="Join our sales agent program today and start earning commissions by referring new customers and businesses to Mansa Musa Marketplace."
                position="bottom"
                showOnMount={true}
                delay={5000}
                actionText="Get Started"
                onAction={() => window.location.href = '/signup'}
                onDismiss={() => {}}
              />
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
              
              {!isAgent && !hasApplication && (
                <ContextualTooltip
                  id="application-help"
                  title="Application Process"
                  tip="Fill out the application form completely and accurately. This helps us understand your background and ensures you're a good fit for our program."
                  position="top"
                  trigger="hover"
                >
                  <div />
                </ContextualTooltip>
              )}
              
              {hasApplication && application && !isAgent && (
                <ProgressiveDisclosure
                  id="application-status-help"
                  title="What's Next?"
                  message={application.status === 'pending' 
                    ? "Your application is under review. You'll be notified once it's processed. In the meantime, check out our training materials!"
                    : application.test_passed === false 
                    ? "Don't worry! You can retake the qualification test after reviewing our materials. Practice makes perfect!"
                    : "Complete your qualification test to become an approved sales agent and start earning commissions."
                  }
                  position="bottom"
                  autoShow={true}
                  delay={2000}
                  actionText="Learn More"
                  onDismiss={() => {}}
                />
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SalesAgentPage;
