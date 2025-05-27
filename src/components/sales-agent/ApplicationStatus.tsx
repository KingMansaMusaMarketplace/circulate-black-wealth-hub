
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
    <Card className="w-full max-w-md mx-auto bg-white border-mansablue/10 shadow-md">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
        <CardTitle className="text-mansablue">Application Status</CardTitle>
        <CardDescription>
          Track the status of your sales agent application
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="flex flex-col items-center text-center space-y-4">
          {status.icon}
          <h3 className="text-xl font-semibold text-mansablue">{status.title}</h3>
          <p>{status.description}</p>
          
          {status.details && (
            <p className="text-sm text-gray-500">{status.details}</p>
          )}
          
          {status.action && (
            <button
              onClick={status.action.onClick}
              className="mt-4 px-4 py-2 bg-mansablue hover:bg-mansablue-dark text-white rounded-md transition-colors"
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
