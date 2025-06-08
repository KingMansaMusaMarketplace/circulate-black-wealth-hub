
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
        <div className="bg-gray-100 p-4 rounded-lg max-h-96 overflow-y-auto">
          {testLogs.length === 0 ? (
            <p className="text-gray-500">No logs yet. Run tests to see detailed output.</p>
          ) : (
            testLogs.map((log, index) => (
              <div key={index} className="text-sm font-mono mb-1">
                {log}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TestLogs;
