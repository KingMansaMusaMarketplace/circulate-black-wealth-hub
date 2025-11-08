
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
      <Tabs defaultValue="dashboard" className="bg-blue-50/50 p-4 rounded-lg shadow-sm">
        <TabsList className="mb-6 bg-blue-100/50">
          <TabsTrigger value="dashboard" className="data-[state=active]:bg-mansablue data-[state=active]:text-white">Dashboard</TabsTrigger>
          <TabsTrigger value="how-it-works" className="data-[state=active]:bg-mansablue data-[state=active]:text-white">How It Works</TabsTrigger>
        </TabsList>
        <TabsContent value="dashboard">
          <div className="text-center py-8">
            <p className="text-lg mb-4">You're an active sales agent!</p>
            <a 
              href="/sales-agent-dashboard" 
              className="inline-flex items-center justify-center px-6 py-3 bg-mansablue text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
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
