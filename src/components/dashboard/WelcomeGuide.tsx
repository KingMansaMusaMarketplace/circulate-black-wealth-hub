
import React, { useState, useEffect } from 'react';
import { X, QrCode, BadgeCheck, Wallet } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from '@/contexts/auth';

interface WelcomeGuideProps {
  userType: 'customer' | 'business';
}

const WelcomeGuide: React.FC<WelcomeGuideProps> = ({ userType }) => {
  const [showGuide, setShowGuide] = useState(false);
  const { user } = useAuth();
  
  useEffect(() => {
    // Check if this is the first time the user sees the guide
    const hasSeenGuide = localStorage.getItem(`hasSeenGuide-${userType}`);
    
    if (!hasSeenGuide && user) {
      // Wait a moment before showing the guide to let the dashboard load
      const timer = setTimeout(() => {
        setShowGuide(true);
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [user, userType]);
  
  const dismissGuide = () => {
    setShowGuide(false);
    // Mark that the user has seen the guide
    localStorage.setItem(`hasSeenGuide-${userType}`, 'true');
  };
  
  if (!showGuide) return null;

  return (
    <div className="fixed bottom-8 right-8 z-50 max-w-sm">
      <Card className="shadow-xl border border-mansablue/20">
        <CardContent className="p-5">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-bold text-mansablue flex items-center gap-2">
              <BadgeCheck className="h-5 w-5" />
              Welcome to Your Dashboard
            </h3>
            <Button variant="ghost" size="sm" onClick={dismissGuide} className="h-8 w-8 p-0">
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {userType === 'business' ? (
            <div className="space-y-4">
              <p className="text-sm text-gray-700">
                Now that you've joined, here's how to make the most of your Mansa Musa Marketplace business account:
              </p>
              
              <div className="space-y-3">
                <div className="flex gap-3">
                  <div className="rounded-full bg-green-100 p-2 flex-shrink-0">
                    <QrCode className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Create QR Codes</h4>
                    <p className="text-xs text-gray-600">Generate loyalty and discount QR codes that customers can scan</p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <div className="rounded-full bg-blue-100 p-2 flex-shrink-0">
                    <Wallet className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Track Engagement</h4>
                    <p className="text-xs text-gray-600">Monitor scans, points awarded, and customer loyalty</p>
                  </div>
                </div>
              </div>
              
              <p className="text-xs text-gray-500 mt-2">
                Visit the QR Code Management page to get started with your first QR code.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-gray-700">
                Now that you've joined, here's how to use the QR scanning feature:
              </p>
              
              <div className="space-y-3">
                <div className="flex gap-3">
                  <div className="rounded-full bg-green-100 p-2 flex-shrink-0">
                    <QrCode className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Scan QR Codes</h4>
                    <p className="text-xs text-gray-600">Scan QR codes at participating businesses to earn points</p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <div className="rounded-full bg-blue-100 p-2 flex-shrink-0">
                    <Wallet className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Redeem Rewards</h4>
                    <p className="text-xs text-gray-600">Use your accumulated points for discounts and special offers</p>
                  </div>
                </div>
              </div>
              
              <p className="text-xs text-gray-500 mt-2">
                Visit the QR Scanner page in your dashboard to start earning rewards.
              </p>
            </div>
          )}
          
          <div className="mt-4">
            <Button onClick={dismissGuide} className="w-full text-sm">
              Got it!
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WelcomeGuide;
