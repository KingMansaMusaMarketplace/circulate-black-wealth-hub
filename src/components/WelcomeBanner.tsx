
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';

interface WelcomeBannerProps {
  siteUrl?: string;
}

const WelcomeBanner: React.FC<WelcomeBannerProps> = ({ siteUrl = "Mansa Musa Marketplace" }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if the user has seen the banner before
    const hasSeenBanner = localStorage.getItem('welcomeBannerSeen');
    
    if (!hasSeenBanner) {
      // Show banner after a short delay
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('welcomeBannerSeen', 'true');
  };

  const handleJoinCommunity = () => {
    handleDismiss();
    toast("Welcome to our community!", {
      description: "Thank you for joining our mission to build Black economic wealth!",
    });
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-5 left-0 right-0 mx-auto max-w-3xl z-50 animate-fade-in-up">
      <div className="bg-white border border-mansagold/50 rounded-lg shadow-lg p-5 m-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-mansablue-dark mb-1">
              Welcome to {siteUrl}!
            </h3>
            <p className="text-gray-600 mb-4">
              Join our growing community dedicated to circulating Black wealth and building economic legacy. 
              Together, we're creating sustainable prosperity for generations to come.
            </p>
            <div className="flex flex-wrap gap-2">
              <Button 
                onClick={handleJoinCommunity} 
                className="bg-mansagold hover:bg-mansagold-dark text-white"
              >
                Join Our Community
              </Button>
              <Button 
                variant="outline"
                onClick={handleDismiss} 
                className="border-mansablue text-mansablue hover:bg-mansablue/10"
              >
                Learn More Later
              </Button>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close welcome banner"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeBanner;
