
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
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'fail':
        return <XCircle className="h-4 w-4 text-red-400" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-400" />;
      default:
        return <div className="h-4 w-4 bg-white/30 rounded-full animate-pulse" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pass':
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Pass</Badge>;
      case 'fail':
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Fail</Badge>;
      case 'warning':
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Warning</Badge>;
      default:
        return <Badge className="bg-white/10 text-white/60 border-white/20">Pending</Badge>;
    }
  };

  if (testResults.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Test Results</h3>
      {testResults.map((result, index) => (
        <div key={index} className="flex items-center justify-between p-4 border border-white/10 rounded-lg bg-white/5">
          <div className="flex items-center space-x-3">
            {getStatusIcon(result.status)}
            <div>
              <div className="font-medium text-white">{result.name}</div>
              <div className="text-sm text-blue-200">{result.message}</div>
              {result.error && (
                <div className="text-xs text-red-400 mt-1">
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
