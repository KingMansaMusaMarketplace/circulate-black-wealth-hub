
import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useSalesAgent } from '@/hooks/use-sales-agent';
import { useSalesAgentTabs } from '@/hooks/use-sales-agent-tabs';
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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 relative overflow-hidden">
      {/* Animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-mansagold/10 rounded-full blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-400/5 rounded-full blur-[150px]" />
      </div>
      
      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none opacity-50" />
      
      <Helmet>
        <title>Sales Agent Program | Mansa Musa Marketplace</title>
      </Helmet>

      <main className="relative z-10 py-12">
        <div className="container mx-auto px-4">
          {!user ? (
            <motion.div 
              className="max-w-6xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="mb-8 text-center">
                <span className="inline-block text-mansagold text-sm font-semibold uppercase tracking-widest mb-4">Earn With Us</span>
                <h1 className="font-heading text-4xl md:text-5xl font-bold text-white mb-4">Sales Agent Program</h1>
                <p className="text-blue-200/80 text-lg max-w-2xl mx-auto">
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
            </motion.div>
          ) : (
            <motion.div 
              className="max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="mb-8 text-center">
                <span className="inline-block text-mansagold text-sm font-semibold uppercase tracking-widest mb-4">Your Dashboard</span>
                <h1 className="font-heading text-4xl md:text-5xl font-bold text-white mb-4">Sales Agent Program</h1>
                <p className="text-blue-200/80 text-lg max-w-2xl mx-auto">
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
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
};

export default SalesAgentPage;
