
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CheckCircle, Clock, XCircle, AlertTriangle } from 'lucide-react';
import { SalesAgentApplication } from '@/types/sales-agent';
import { formatDate } from '@/lib/utils';

interface ApplicationStatusProps {
  application: SalesAgentApplication;
  onStartTest: () => void;
}

const ApplicationStatus: React.FC<ApplicationStatusProps> = ({ application, onStartTest }) => {
  const getStatusUI = () => {
    // Use 'status' field if 'application_status' is not available
    const status = application.application_status || application.status;
    
    switch (status) {
      case 'approved':
        return {
          icon: <CheckCircle className="h-12 w-12 text-green-500" />,
          title: 'Application Approved',
          description: 'Congratulations! Your application has been approved.',
          details: application.reviewed_at ? `Approved on ${formatDate(application.reviewed_at)}` : undefined
        };
      case 'rejected':
        return {
          icon: <XCircle className="h-12 w-12 text-red-500" />,
          title: 'Application Rejected',
          description: 'Unfortunately, your application has been rejected.',
          details: application.notes
        };
      case 'pending':
        if (application.test_passed === true) {
          return {
            icon: <Clock className="h-12 w-12 text-mansablue" />,
            title: 'Under Review',
            description: 'Your application is being reviewed by our team.',
            details: `Submitted on ${formatDate(application.application_date)}`
          };
        } else if (application.test_score !== undefined && application.test_score !== null) {
          return {
            icon: <AlertTriangle className="h-12 w-12 text-yellow-500" />,
            title: 'Test Failed',
            description: 'You did not pass the qualification test.',
            details: `Score: ${application.test_score}%. Required: 70%`,
            action: {
              label: 'Try Again',
              onClick: onStartTest
            }
          };
        } else {
          return {
            icon: <AlertTriangle className="h-12 w-12 text-mansablue" />,
            title: 'Qualification Test Required',
            description: 'Complete the qualification test to proceed with your application.',
            action: {
              label: 'Take Qualification Test',
              onClick: onStartTest
            }
          };
        }
      default:
        return {
          icon: <Clock className="h-12 w-12 text-mansablue" />,
          title: 'Application Submitted',
          description: 'Your application has been received.'
        };
    }
  };

  const status = getStatusUI();

  return (
    <Card className="w-full max-w-2xl mx-auto bg-white/95 backdrop-blur-xl border-2 border-mansagold/20 shadow-2xl overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-mansagold-dark via-mansagold to-mansagold-light animate-pulse" />
      <CardHeader className="bg-gradient-to-r from-mansagold/5 via-mansablue/5 to-mansagold/5 border-b border-mansagold/20">
        <CardTitle className="text-2xl bg-gradient-to-r from-mansablue-dark via-mansablue to-mansablue-light bg-clip-text text-transparent">
          Application Status
        </CardTitle>
        <CardDescription className="text-foreground/70">
          Track the status of your sales agent application
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-8">
        <div className="flex flex-col items-center text-center space-y-6">
          <div className="p-4 rounded-full bg-gradient-to-br from-mansagold/10 to-mansablue/10 animate-pulse">
            {status.icon}
          </div>
          <h3 className="text-2xl font-bold bg-gradient-to-r from-mansablue-dark via-mansablue to-mansablue-light bg-clip-text text-transparent">
            {status.title}
          </h3>
          <p className="text-foreground/80 text-lg">{status.description}</p>
          
          {status.details && (
            <p className="text-sm text-foreground/60 bg-gradient-to-r from-mansagold/5 via-mansablue/5 to-mansagold/5 px-6 py-3 rounded-xl border border-mansagold/20">
              {status.details}
            </p>
          )}
          
          {status.action && (
            <button
              onClick={status.action.onClick}
              className="mt-4 px-8 py-4 bg-gradient-to-r from-mansagold-dark to-mansagold hover:from-mansagold hover:to-mansagold-light text-mansablue-dark font-semibold rounded-xl shadow-xl shadow-mansagold/30 hover:shadow-2xl hover:shadow-mansagold/50 transition-all duration-300 hover:scale-105"
            >
              {status.action.label}
            </button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ApplicationStatus;
