
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { InfoIcon } from 'lucide-react';

const TestBanner: React.FC = () => {
  return (
    <Alert className="mb-6 backdrop-blur-xl bg-white/5 border border-cyan-400/30 shadow-lg hover:shadow-xl transition-shadow">
      <div className="flex items-center gap-2">
        <div className="p-2 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full">
          <InfoIcon className="h-4 w-4 text-white" />
        </div>
        <AlertDescription className="text-cyan-200 font-medium">
          This is a testing environment for the signup process. Use this page to verify that all signup flows work correctly.
        </AlertDescription>
      </div>
    </Alert>
  );
};

export default TestBanner;
