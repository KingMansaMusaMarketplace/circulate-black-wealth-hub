
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
        return 'bg-green-500/10 border-green-400/30';
      case 'fail':
        return 'bg-red-500/10 border-red-400/30';
      case 'warning':
        return 'bg-yellow-500/10 border-yellow-400/30';
      default:
        return 'bg-white/5 border-white/10';
    }
  };

  return (
    <Card className="backdrop-blur-xl bg-white/5 border border-white/10 shadow-lg hover:shadow-xl transition-all">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <div className="p-2 bg-gradient-to-br from-violet-500 to-purple-500 rounded-lg">
            <CheckCircle className="h-5 w-5 text-white" />
          </div>
          Test Results
        </CardTitle>
      </CardHeader>
      <CardContent>
        {testResults.length === 0 ? (
          <div className="text-center py-8">
            <div className="inline-block p-3 bg-white/10 rounded-full mb-3">
              <AlertCircle className="h-8 w-8 text-blue-300" />
            </div>
            <p className="text-blue-200 font-medium">No tests run yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {testResults.map((result, index) => (
              <div 
                key={index} 
                className={`flex items-center justify-between p-4 border rounded-lg shadow-sm hover:shadow-md transition-all backdrop-blur-sm ${getBgClass(result.status)}`}
              >
                <div className="flex items-center space-x-3">
                  {getIcon(result.status)}
                  <span className="font-semibold text-white">{result.name}</span>
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
