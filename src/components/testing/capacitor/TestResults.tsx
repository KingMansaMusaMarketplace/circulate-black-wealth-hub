
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TestResult {
  step: string;
  status: 'pending' | 'success' | 'error';
  message: string;
}

interface TestResultsProps {
  testResults: TestResult[];
}

const TestResults: React.FC<TestResultsProps> = ({ testResults }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Test Results</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {testResults.map((result, index) => (
            <div 
              key={index}
              className="p-3 rounded-md border"
            >
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${
                  result.status === 'success' ? 'bg-green-500' : 
                  result.status === 'error' ? 'bg-red-500' : 
                  'bg-yellow-500'
                }`} />
                <span className="font-medium">{result.step}</span>
              </div>
              <p className={`mt-1 text-sm ${
                result.status === 'success' ? 'text-green-700' : 
                result.status === 'error' ? 'text-red-700' : 
                'text-yellow-700'
              }`}>
                {result.message}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TestResults;
