
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle } from 'lucide-react';

const TestBanner: React.FC = () => {
  return (
    <Alert className="mb-6 border-green-200 bg-green-50">
      <CheckCircle className="h-4 w-4 text-green-600" />
      <AlertDescription className="text-green-800">
        <strong>Tests Updated!</strong> Now using realistic email domains (@testmail.com) and strong passwords. 
        The email confirmation should work properly with the updated URL configuration.
      </AlertDescription>
    </Alert>
  );
};

export default TestBanner;
