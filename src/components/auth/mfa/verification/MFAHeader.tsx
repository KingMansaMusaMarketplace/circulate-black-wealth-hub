
import React from 'react';
import { Shield } from 'lucide-react';
import { CardTitle, CardDescription, CardHeader } from '@/components/ui/card';

export const MFAHeader: React.FC = () => {
  return (
    <CardHeader className="text-center">
      <div className="mx-auto w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
        <Shield className="h-6 w-6 text-blue-600" />
      </div>
      <CardTitle className="text-xl">Two-Factor Authentication</CardTitle>
      <CardDescription>
        Enter the verification code from your authenticator app
      </CardDescription>
    </CardHeader>
  );
};
