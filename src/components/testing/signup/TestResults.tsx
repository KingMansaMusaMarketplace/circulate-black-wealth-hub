
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface TestResult {
  name: string;
  status: 'pass' | 'fail' | 'warning';
  message: string;
}

interface TestResultsProps {
  testResults: TestResult[];
}

const TestResults: React.FC<TestResultsProps> = ({ testResults }) => {
  const getIcon = (status: string) => {
    switch (status) {
      case 'pass':
        return (
          <div className="p-1.5 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full">
            <CheckCircle className="h-4 w-4 text-white" />
          </div>
        );
      case 'fail':
        return (
          <div className="p-1.5 bg-gradient-to-br from-red-500 to-rose-500 rounded-full">
            <XCircle className="h-4 w-4 text-white" />
          </div>
        );
      case 'warning':
        return (
          <div className="p-1.5 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full">
            <AlertCircle className="h-4 w-4 text-white" />
          </div>
        );
      default:
        return null;
    }
  };

  const getVariant = (status: string) => {
    switch (status) {
      case 'pass':
        return 'default';
      case 'fail':
        return 'destructive';
      case 'warning':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getBgClass = (status: string) => {
    switch (status) {
      case 'pass':
        return 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200';
      case 'fail':
        return 'bg-gradient-to-r from-red-50 to-rose-50 border-red-200';
      case 'warning':
        return 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <Card className="bg-gradient-to-br from-violet-50 to-purple-50 border-violet-200 shadow-lg hover:shadow-xl transition-all">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-violet-700">
          <div className="p-2 bg-gradient-to-br from-violet-500 to-purple-500 rounded-lg">
            <CheckCircle className="h-5 w-5 text-white" />
          </div>
          Test Results
        </CardTitle>
      </CardHeader>
      <CardContent>
        {testResults.length === 0 ? (
          <div className="text-center py-8">
            <div className="inline-block p-3 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full mb-3">
              <AlertCircle className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-gray-500 font-medium">No tests run yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {testResults.map((result, index) => (
              <div 
                key={index} 
                className={`flex items-center justify-between p-4 border rounded-lg shadow-sm hover:shadow-md transition-all ${getBgClass(result.status)}`}
              >
                <div className="flex items-center space-x-3">
                  {getIcon(result.status)}
                  <span className="font-semibold">{result.name}</span>
                </div>
                <Badge 
                  variant={getVariant(result.status) as any}
                  className="font-bold shadow-sm"
                >
                  {result.status.toUpperCase()}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TestResults;
