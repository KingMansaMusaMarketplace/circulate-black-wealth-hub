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
    <Card className="border-0 bg-gradient-to-r from-mansablue via-blue-700 to-mansagold p-[2px] shadow-[0_0_20px_rgba(251,191,36,0.3)] hover:shadow-[0_0_30px_rgba(251,191,36,0.5)] transition-all duration-500 hover:scale-[1.02] group overflow-hidden relative">
      {/* Shimmer effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
      
      <CardContent className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg p-4 m-0">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-gradient-to-br from-mansablue to-blue-700 rounded-lg shadow-lg shadow-mansablue/50 animate-pulse">
            <Info className="h-5 w-5 text-white flex-shrink-0" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-transparent bg-gradient-to-r from-mansablue via-blue-400 to-mansagold bg-clip-text mb-2 text-lg animate-fade-in">Demo Account Available</h3>
            <p className="text-sm text-slate-300 mb-3 font-medium">
              Try our platform with a pre-configured business account 🚀
            </p>
            <div className="space-y-3">
              <div className="relative group/email flex items-center justify-between bg-gradient-to-r from-slate-800/80 to-blue-900/50 rounded-lg p-3 border border-mansablue/30 hover:border-mansablue/60 transition-all duration-300 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-mansablue/5 to-transparent opacity-0 group-hover/email:opacity-100 transition-opacity duration-300" />
                <div className="flex-1 relative z-10">
                  <div className="text-xs font-semibold text-blue-400 mb-1">Email</div>
                  <div className="text-sm font-mono font-bold text-white">demo@mansamusa.com</div>
                </div>
                <button
                  onClick={() => copyToClipboard('demo@mansamusa.com', 'email')}
                  className="relative z-10 ml-2 p-2 bg-mansablue/20 hover:bg-mansablue/40 rounded-lg transition-all duration-300 hover:scale-110"
                  aria-label="Copy email"
                >
                  {copiedField === 'email' ? (
                    <Check className="h-5 w-5 text-green-400 animate-scale-in" />
                  ) : (
                    <Copy className="h-5 w-5 text-blue-300" />
                  )}
                </button>
              </div>
              <div className="relative group/password flex items-center justify-between bg-gradient-to-r from-slate-800/80 to-amber-900/50 rounded-lg p-3 border border-mansagold/30 hover:border-mansagold/60 transition-all duration-300 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-mansagold/5 to-transparent opacity-0 group-hover/password:opacity-100 transition-opacity duration-300" />
                <div className="flex-1 relative z-10">
                  <div className="text-xs font-semibold text-amber-400 mb-1">Password</div>
                  <div className="text-sm font-mono font-bold text-white">Demo123!</div>
                </div>
                <button
                  onClick={() => copyToClipboard('Demo123!', 'password')}
                  className="relative z-10 ml-2 p-2 bg-mansagold/20 hover:bg-mansagold/40 rounded-lg transition-all duration-300 hover:scale-110"
                  aria-label="Copy password"
                >
                  {copiedField === 'password' ? (
                    <Check className="h-5 w-5 text-green-400 animate-scale-in" />
                  ) : (
                    <Copy className="h-5 w-5 text-amber-300" />
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
