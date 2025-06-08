
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const TestWarning: React.FC = () => {
  return (
    <Alert className="mt-6">
      <AlertDescription>
        This testing page will create real test accounts in your database. 
        The tests use timestamp-based email addresses to avoid conflicts.
        Check the console and logs above for detailed error information.
      </AlertDescription>
    </Alert>
  );
};

export default TestWarning;
