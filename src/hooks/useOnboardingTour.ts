import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { TourStep } from '@/components/onboarding/OnboardingTour';
import { customerTourSteps } from '@/components/onboarding/tours/customerTour';
import { businessOwnerTourSteps } from '@/components/onboarding/tours/businessOwnerTour';
import { salesAgentTourSteps } from '@/components/onboarding/tours/salesAgentTour';

export const useOnboardingTour = () => {
  const { user, userRole } = useAuth();
  const [shouldShowTour, setShouldShowTour] = useState(false);
  const [tourSteps, setTourSteps] = useState<TourStep[]>([]);
  const [tourKey, setTourKey] = useState('');

  useEffect(() => {
    if (!user || !userRole) return;

    // Determine which tour to show based on user role
    let steps: TourStep[] = [];
    let key = '';

    if (userRole === 'business_owner') {
      steps = businessOwnerTourSteps;
      key = 'business-owner';
    } else if (userRole === 'sales_agent') {
      steps = salesAgentTourSteps;
      key = 'sales-agent';
    } else {
      // Default customer tour
      steps = customerTourSteps;
      key = 'customer';
    }

    setTourSteps(steps);
    setTourKey(key);

    // Check if user has completed the tour
    const hasCompleted = localStorage.getItem(`tour-${key}-completed`);
    const hasSeenWelcome = localStorage.getItem(`welcome-shown-${user.id}`);

    // Show tour if:
    // 1. User hasn't completed it
    // 2. User has seen the welcome screen (first login)
    // 3. User has been on the platform for less than 7 days
    if (!hasCompleted && hasSeenWelcome) {
      const accountAge = Date.now() - new Date(user.created_at).getTime();
      const sevenDays = 7 * 24 * 60 * 60 * 1000;
      
      if (accountAge < sevenDays) {
        // Delay showing tour slightly to let the page load
        const timer = setTimeout(() => {
          setShouldShowTour(true);
        }, 2000);
        
        return () => clearTimeout(timer);
      }
    }
  }, [user, userRole]);

  const startTour = () => {
    setShouldShowTour(true);
  };

  const completeTour = () => {
    setShouldShowTour(false);
    if (tourKey) {
      localStorage.setItem(`tour-${tourKey}-completed`, 'true');
    }
  };

  const skipTour = () => {
    setShouldShowTour(false);
    if (tourKey) {
      localStorage.setItem(`tour-${tourKey}-completed`, 'true');
    }
  };

  const resetTour = () => {
    if (tourKey) {
      localStorage.removeItem(`tour-${tourKey}-completed`);
      setShouldShowTour(true);
    }
  };

  return {
    shouldShowTour,
    tourSteps,
    tourKey,
    startTour,
    completeTour,
    skipTour,
    resetTour,
  };
};
