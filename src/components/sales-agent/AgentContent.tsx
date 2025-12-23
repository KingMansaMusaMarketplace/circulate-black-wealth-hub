
import React from 'react';
import { SalesAgentApplication } from '@/types/sales-agent';
import AgentApplicationForm from './AgentApplicationForm';
import AgentQualificationTest from './AgentQualificationTest';
import ApplicationStatus from './ApplicationStatus';
import AgentDashboard from './AgentDashboard';
import LoadingState from './LoadingState';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import HowItWorksContent from './HowItWorksContent';

interface AgentContentProps {
  loading: boolean;
  isAgent: boolean;
  hasApplication: boolean;
  application: SalesAgentApplication | null;
  showTestForm: boolean;
  onApplicationSubmitted: () => void;
  onTestCompleted: () => void;
  onStartTest: () => void;
}

const AgentContent: React.FC<AgentContentProps> = ({
  loading,
  isAgent,
  hasApplication,
  application,
  showTestForm,
  onApplicationSubmitted,
  onTestCompleted,
  onStartTest
}) => {
  if (loading) {
    return <LoadingState />;
  }

  if (isAgent) {
    return (
      <Tabs defaultValue="dashboard" className="bg-white/95 backdrop-blur-xl p-6 rounded-2xl shadow-2xl border-2 border-mansagold/20">
        <TabsList className="mb-8 bg-gradient-to-r from-mansablue/5 via-mansagold/5 to-mansablue/5 backdrop-blur-sm p-1 rounded-xl">
          <TabsTrigger 
            value="dashboard" 
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-mansablue-dark data-[state=active]:to-mansablue data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300"
          >
            Dashboard
          </TabsTrigger>
          <TabsTrigger 
            value="how-it-works" 
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-mansagold-dark data-[state=active]:to-mansagold data-[state=active]:text-mansablue-dark data-[state=active]:shadow-lg transition-all duration-300"
          >
            How It Works
          </TabsTrigger>
        </TabsList>
        <TabsContent value="dashboard">
          <div className="text-center py-12">
            <p className="text-xl mb-6 text-foreground font-semibold">You're an active Mansa Ambassador!</p>
            <a 
              href="/sales-agent-dashboard" 
              className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-mansablue-dark to-mansablue hover:from-mansablue hover:to-mansablue-light text-white rounded-xl font-semibold shadow-xl shadow-mansablue/30 hover:shadow-2xl hover:shadow-mansablue/50 transition-all duration-300 hover:scale-105"
            >
              Go to Dashboard →
            </a>
          </div>
        </TabsContent>
        <TabsContent value="how-it-works">
          <HowItWorksContent />
        </TabsContent>
      </Tabs>
    );
  }

  if (showTestForm && application) {
    return (
      <AgentQualificationTest
        applicationId={application.id}
        onComplete={onTestCompleted}
      />
    );
  }

  if (hasApplication && application) {
    return (
      <ApplicationStatus 
        application={application}
        onStartTest={onStartTest}
      />
    );
  }

  return <AgentApplicationForm onSuccess={onApplicationSubmitted} />;
};

export default AgentContent;
