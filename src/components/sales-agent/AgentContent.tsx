
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
      <Tabs defaultValue="dashboard">
        <TabsList className="mb-6">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="how-it-works">How It Works</TabsTrigger>
        </TabsList>
        <TabsContent value="dashboard">
          <AgentDashboard />
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
