
import React from 'react';

interface TestLogsProps {
  logs: string[];
}

const TestLogs: React.FC<TestLogsProps> = ({ logs }) => {
  if (logs.length === 0) {
    return null;
  }

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-3">Test Logs</h3>
      <div className="bg-gray-50 p-4 rounded-lg max-h-64 overflow-y-auto">
        {logs.map((log, index) => (
          <div key={index} className="text-sm font-mono text-gray-700 mb-1">
            {log}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestLogs;
