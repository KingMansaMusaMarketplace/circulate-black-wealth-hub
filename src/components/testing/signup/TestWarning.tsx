
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

const TestWarning: React.FC = () => {
  return (
    <Alert variant="destructive" className="mt-6">
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription>
        <strong>Warning:</strong> This testing page should only be used in development environments. Do not use in production.
      </AlertDescription>
    </Alert>
  );
};

export default TestWarning;
