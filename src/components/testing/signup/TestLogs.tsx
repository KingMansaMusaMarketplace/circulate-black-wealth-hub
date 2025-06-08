
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TestLogsProps {
  testLogs: string[];
}

const TestLogs: React.FC<TestLogsProps> = ({ testLogs }) => {
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Test Logs</CardTitle>
      </CardHeader>
      <CardContent>
        {testLogs.length === 0 ? (
          <p className="text-gray-500">No logs available.</p>
        ) : (
          <div className="max-h-60 overflow-y-auto">
            <pre className="text-sm bg-gray-100 p-3 rounded">
              {testLogs.join('\n')}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TestLogs;
