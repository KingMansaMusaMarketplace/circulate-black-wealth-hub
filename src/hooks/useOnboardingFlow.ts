import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export const useOnboardingFlow = () => {
  const { user } = useAuth();
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    // Only show onboarding for authenticated users who haven't completed it
    if (user && user.email_confirmed_at) {
      const hasCompletedOnboarding = localStorage.getItem('onboarding_completed');
      const hasSeenWelcome = localStorage.getItem(`welcome_shown_${user.id}`);
      
      if (!hasCompletedOnboarding && !hasSeenWelcome) {
        // Small delay to ensure user data is loaded
        const timer = setTimeout(() => {
          setShowWelcome(true);
          localStorage.setItem(`welcome_shown_${user.id}`, 'true');
        }, 1000);

        return () => clearTimeout(timer);
      }
    }
  }, [user]);

  const closeWelcome = () => {
    setShowWelcome(false);
  };

  const resetOnboarding = () => {
    localStorage.removeItem('onboarding_completed');
    if (user) {
      localStorage.removeItem(`welcome_shown_${user.id}`);
    }
  };

  return {
    showWelcome,
    closeWelcome,
    resetOnboarding
  };
};