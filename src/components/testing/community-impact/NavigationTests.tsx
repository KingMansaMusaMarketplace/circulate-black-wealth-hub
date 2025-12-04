
import React from 'react';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

const NavigationTests: React.FC = () => {
  return (
    <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
      <div className="p-6 border-b border-white/10">
        <h2 className="text-xl font-bold text-white">Quick Navigation Tests</h2>
        <p className="text-blue-200 text-sm mt-1">Test navigation to related pages</p>
      </div>
      <div className="p-6 space-y-3">
        <Button 
          variant="outline" 
          onClick={() => window.location.href = '/community-impact'}
          className="w-full bg-white/5 border-white/20 text-white hover:bg-white/10 hover:text-yellow-400"
        >
          <ExternalLink className="h-4 w-4 mr-2" />
          Test: Navigate to Community Impact Page
        </Button>
        <Button 
          variant="outline" 
          onClick={() => window.location.href = '/dashboard'}
          className="w-full bg-white/5 border-white/20 text-white hover:bg-white/10 hover:text-yellow-400"
        >
          <ExternalLink className="h-4 w-4 mr-2" />
          Test: Navigate to Dashboard
        </Button>
        <Button 
          variant="outline" 
          onClick={() => window.location.href = '/community'}
          className="w-full bg-white/5 border-white/20 text-white hover:bg-white/10 hover:text-yellow-400"
        >
          <ExternalLink className="h-4 w-4 mr-2" />
          Test: Navigate to Community Hub
        </Button>
      </div>
    </div>
  );
};

export default NavigationTests;
