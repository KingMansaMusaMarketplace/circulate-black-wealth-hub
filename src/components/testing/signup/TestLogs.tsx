
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TestLogsProps {
  testLogs: string[];
}

const TestLogs: React.FC<TestLogsProps> = ({ testLogs }) => {
  return (
    <Card className="mt-6 bg-gradient-to-br from-slate-50 to-gray-50 border-slate-200 shadow-lg hover:shadow-xl transition-all">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-slate-700">
          <div className="p-2 bg-gradient-to-br from-slate-600 to-gray-600 rounded-lg">
            <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          Test Logs
        </CardTitle>
      </CardHeader>
      <CardContent>
        {testLogs.length === 0 ? (
          <div className="text-center py-8">
            <div className="inline-block p-3 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full mb-3">
              <svg className="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-gray-500 font-medium">No logs available.</p>
          </div>
        ) : (
          <div className="max-h-60 overflow-y-auto">
            <pre className="text-sm bg-gradient-to-br from-slate-900 to-gray-900 text-green-400 p-4 rounded-lg shadow-inner font-mono">
              {testLogs.join('\n')}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TestLogs;
