import React, { useState } from 'react';
import { Info, Copy, Check } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const DemoAccountCard: React.FC = () => {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="font-semibold text-blue-900 mb-2">Demo Account Available</h3>
            <p className="text-sm text-blue-800 mb-3">
              Try our platform with a pre-configured business account
            </p>
            <div className="space-y-2">
              <div className="flex items-center justify-between bg-white rounded-lg p-2">
                <div className="flex-1">
                  <div className="text-xs text-gray-500">Email</div>
                  <div className="text-sm font-mono text-gray-900">testuser@example.com</div>
                </div>
                <button
                  onClick={() => copyToClipboard('testuser@example.com', 'email')}
                  className="ml-2 p-2 hover:bg-gray-100 rounded transition-colors"
                  aria-label="Copy email"
                >
                  {copiedField === 'email' ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4 text-gray-600" />
                  )}
                </button>
              </div>
              <div className="flex items-center justify-between bg-white rounded-lg p-2">
                <div className="flex-1">
                  <div className="text-xs text-gray-500">Password</div>
                  <div className="text-sm font-mono text-gray-900">TestPass123!</div>
                </div>
                <button
                  onClick={() => copyToClipboard('TestPass123!', 'password')}
                  className="ml-2 p-2 hover:bg-gray-100 rounded transition-colors"
                  aria-label="Copy password"
                >
                  {copiedField === 'password' ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4 text-gray-600" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DemoAccountCard;
