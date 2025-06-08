
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

export interface TestResult {
  name: string;
  status: 'pass' | 'fail' | 'warning' | 'pending';
  message: string;
  error?: any;
}

interface TestResultsProps {
  testResults: TestResult[];
}

const TestResults: React.FC<TestResultsProps> = ({ testResults }) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'fail':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default:
        return <div className="h-4 w-4 bg-gray-300 rounded-full animate-pulse" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pass':
        return <Badge className="bg-green-100 text-green-800">Pass</Badge>;
      case 'fail':
        return <Badge variant="destructive">Fail</Badge>;
      case 'warning':
        return <Badge variant="secondary">Warning</Badge>;
      default:
        return <Badge variant="outline">Pending</Badge>;
    }
  };

  if (testResults.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Test Results</h3>
      {testResults.map((result, index) => (
        <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
          <div className="flex items-center space-x-3">
            {getStatusIcon(result.status)}
            <div>
              <div className="font-medium">{result.name}</div>
              <div className="text-sm text-gray-600">{result.message}</div>
              {result.error && (
                <div className="text-xs text-red-600 mt-1">
                  Error: {result.error.message || JSON.stringify(result.error)}
                </div>
              )}
            </div>
          </div>
          {getStatusBadge(result.status)}
        </div>
      ))}
    </div>
  );
};

export default TestResults;
