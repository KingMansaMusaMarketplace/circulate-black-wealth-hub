
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Heart, Users, Star } from 'lucide-react';

const WelcomeNotification: React.FC = () => {
  useEffect(() => {
    // Check if user has visited before
    const hasVisited = localStorage.getItem('mansa-musa-visited');
    
    if (!hasVisited) {
      // Show welcome toast after a short delay
      setTimeout(() => {
        toast.success('Welcome to Mansa Musa Marketplace! 🎉', {
          description: 'Discover amazing Black-owned businesses and earn rewards while building community wealth.',
          duration: 6000,
          action: {
            label: 'Explore Now',
            onClick: () => {
              const directoryLink = document.querySelector('a[href="/directory"]');
              if (directoryLink) {
                (directoryLink as HTMLElement).click();
              }
            }
          }
        });
        
        // Mark as visited
        localStorage.setItem('mansa-musa-visited', 'true');
      }, 2000);
    }
  }, []);

  return null;
};

export default WelcomeNotification;
