
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

const TestWarning: React.FC = () => {
  return (
    <Alert variant="destructive" className="mt-6 bg-gradient-to-r from-red-100 via-orange-100 to-red-100 border-red-300 shadow-lg hover:shadow-xl transition-all">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-gradient-to-br from-red-600 to-orange-600 rounded-full animate-pulse">
          <AlertTriangle className="h-5 w-5 text-white" />
        </div>
        <AlertDescription className="text-red-900 font-medium">
          <strong className="text-red-700">⚠️ Warning:</strong> This testing page should only be used in development environments. Do not use in production.
        </AlertDescription>
      </div>
    </Alert>
  );
};

export default TestWarning;
