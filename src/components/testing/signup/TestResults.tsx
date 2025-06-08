
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

interface TestResultsProps {
  testResults: { [key: string]: 'pending' | 'success' | 'error' };
}

const TestResults: React.FC<TestResultsProps> = ({ testResults }) => {
  const getStatusIcon = (status: 'pending' | 'success' | 'error') => {
    switch (status) {
      case 'pending':
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Test Results</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span>Customer Signup</span>
            {getStatusIcon(testResults.customerSignup)}
          </div>
          <div className="flex items-center justify-between">
            <span>Business Signup</span>
            {getStatusIcon(testResults.businessSignup)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TestResults;
