
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { InfoIcon } from 'lucide-react';

const TestBanner: React.FC = () => {
  return (
    <Alert className="mb-6">
      <InfoIcon className="h-4 w-4" />
      <AlertDescription>
        This is a testing environment for the signup process. Use this page to verify that all signup flows work correctly.
      </AlertDescription>
    </Alert>
  );
};

export default TestBanner;
