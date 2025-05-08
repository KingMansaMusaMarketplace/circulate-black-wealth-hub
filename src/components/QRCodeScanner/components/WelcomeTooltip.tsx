
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const WelcomeTooltip: React.FC = () => {
  const [showTooltip, setShowTooltip] = useState(false);
  
  useEffect(() => {
    // Check if the user has seen the tooltip before
    const hasSeenTooltip = localStorage.getItem('hasSeenQRTooltip');
    
    if (!hasSeenTooltip) {
      // Wait a moment before showing the tooltip
      const timer = setTimeout(() => {
        setShowTooltip(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, []);
  
  const dismissTooltip = () => {
    setShowTooltip(false);
    // Mark that the user has seen the tooltip
    localStorage.setItem('hasSeenQRTooltip', 'true');
  };
  
  if (!showTooltip) return null;
  
  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:bottom-4 md:w-80 bg-white rounded-lg shadow-lg p-4 border border-gray-200 z-50 animate-fade-in">
      <div className="flex justify-between items-start mb-2">
        <h4 className="text-sm font-semibold text-mansablue">Welcome to QR Scanner!</h4>
        <Button variant="ghost" size="sm" onClick={dismissTooltip} className="h-6 w-6 p-0">
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <p className="text-xs text-gray-600 mb-3">
        Scan QR codes from participating businesses to earn loyalty points and redeem rewards.
      </p>
      
      <div className="text-xs bg-gray-50 p-2 rounded-md mb-2">
        <p className="font-medium text-gray-700">Quick Tips:</p>
        <ul className="list-disc pl-4 mt-1 space-y-1">
          <li>Allow camera access when prompted</li>
          <li>Hold your phone steady</li>
          <li>Make sure the QR code is clearly visible</li>
        </ul>
      </div>
      
      <Button size="sm" className="w-full text-xs" onClick={dismissTooltip}>
        Got it!
      </Button>
    </div>
  );
};

export default WelcomeTooltip;
