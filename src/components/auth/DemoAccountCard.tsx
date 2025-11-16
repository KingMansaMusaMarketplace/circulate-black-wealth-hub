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
    <Card className="border-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-0.5 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
      <CardContent className="bg-white rounded-lg p-4 m-0">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg">
            <Info className="h-5 w-5 text-white flex-shrink-0" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text mb-2 text-lg">Demo Account Available</h3>
            <p className="text-sm text-gray-700 mb-3 font-medium">
              Try our platform with a pre-configured business account 🚀
            </p>
            <div className="space-y-3">
              <div className="flex items-center justify-between bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-3 border-2 border-blue-200">
                <div className="flex-1">
                  <div className="text-xs font-semibold text-blue-600 mb-1">Email</div>
                  <div className="text-sm font-mono font-bold text-gray-900">demo@mansamusa.com</div>
                </div>
                <button
                  onClick={() => copyToClipboard('demo@mansamusa.com', 'email')}
                  className="ml-2 p-2 hover:bg-white rounded-lg transition-all duration-300 hover:scale-110"
                  aria-label="Copy email"
                >
                  {copiedField === 'email' ? (
                    <Check className="h-5 w-5 text-green-600" />
                  ) : (
                    <Copy className="h-5 w-5 text-blue-600" />
                  )}
                </button>
              </div>
              <div className="flex items-center justify-between bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-3 border-2 border-purple-200">
                <div className="flex-1">
                  <div className="text-xs font-semibold text-purple-600 mb-1">Password</div>
                  <div className="text-sm font-mono font-bold text-gray-900">Demo123!</div>
                </div>
                <button
                  onClick={() => copyToClipboard('Demo123!', 'password')}
                  className="ml-2 p-2 hover:bg-white rounded-lg transition-all duration-300 hover:scale-110"
                  aria-label="Copy password"
                >
                  {copiedField === 'password' ? (
                    <Check className="h-5 w-5 text-green-600" />
                  ) : (
                    <Copy className="h-5 w-5 text-purple-600" />
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
