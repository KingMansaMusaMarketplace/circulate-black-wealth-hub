import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface CorporateOnboardingState {
  isFirstVisit: boolean;
  currentStep: number;
  completed: boolean;
  skipped: boolean;
}

export const useCorporateOnboarding = () => {
  const { user } = useAuth();
  const [onboardingState, setOnboardingState] = useState<CorporateOnboardingState>({
    isFirstVisit: false,
    currentStep: 0,
    completed: false,
    skipped: false
  });

  const CORPORATE_ONBOARDING_KEY = 'mansa-corporate-onboarding-completed';
  const CORPORATE_ONBOARDING_STATE_KEY = 'mansa-corporate-onboarding-state';

  // Check if user is a corporate sponsor
  const isCorporateUser = user?.user_metadata?.user_type === 'corporate' || 
                         user?.user_metadata?.userType === 'corporate' ||
                         user?.user_metadata?.subscription_tier?.includes('corporate');

  useEffect(() => {
    if (!isCorporateUser) return;
    
    const checkOnboardingStatus = () => {
      const completed = localStorage.getItem(CORPORATE_ONBOARDING_KEY);
      const savedState = localStorage.getItem(CORPORATE_ONBOARDING_STATE_KEY);
      
      if (completed === 'true') {
        setOnboardingState(prev => ({ ...prev, completed: true }));
      } else if (savedState) {
        setOnboardingState(JSON.parse(savedState));
      } else {
        // First visit for new corporate users
        setOnboardingState(prev => ({ ...prev, isFirstVisit: true }));
      }
    };

    checkOnboardingStatus();
  }, [user, isCorporateUser]);

  const startOnboarding = () => {
    if (!isCorporateUser) return;
    
    setOnboardingState({
      isFirstVisit: true,
      currentStep: 0,
      completed: false,
      skipped: false
    });
    localStorage.removeItem(CORPORATE_ONBOARDING_KEY);
    localStorage.setItem(CORPORATE_ONBOARDING_STATE_KEY, JSON.stringify({
      isFirstVisit: true,
      currentStep: 0,
      completed: false,
      skipped: false
    }));
  };

  const nextStep = () => {
    const newState = {
      ...onboardingState,
      currentStep: onboardingState.currentStep + 1
    };
    setOnboardingState(newState);
    localStorage.setItem(CORPORATE_ONBOARDING_STATE_KEY, JSON.stringify(newState));
  };

  const prevStep = () => {
    const newState = {
      ...onboardingState,
      currentStep: Math.max(0, onboardingState.currentStep - 1)
    };
    setOnboardingState(newState);
    localStorage.setItem(CORPORATE_ONBOARDING_STATE_KEY, JSON.stringify(newState));
  };

  const completeOnboarding = () => {
    localStorage.setItem(CORPORATE_ONBOARDING_KEY, 'true');
    localStorage.removeItem(CORPORATE_ONBOARDING_STATE_KEY);
    setOnboardingState({
      isFirstVisit: false,
      currentStep: 0,
      completed: true,
      skipped: false
    });
  };

  const skipOnboarding = () => {
    localStorage.setItem(CORPORATE_ONBOARDING_KEY, 'true');
    localStorage.removeItem(CORPORATE_ONBOARDING_STATE_KEY);
    setOnboardingState({
      isFirstVisit: false,
      currentStep: 0,
      completed: true,
      skipped: true
    });
  };

  const resetOnboarding = () => {
    localStorage.removeItem(CORPORATE_ONBOARDING_KEY);
    localStorage.removeItem(CORPORATE_ONBOARDING_STATE_KEY);
    setOnboardingState({
      isFirstVisit: false,
      currentStep: 0,
      completed: false,
      skipped: false
    });
  };

  return {
    ...onboardingState,
    isCorporateUser,
    startOnboarding,
    nextStep,
    prevStep,
    completeOnboarding,
    skipOnboarding,
    resetOnboarding,
    shouldShowOnboarding: false // Temporarily disabled to prevent home page overlay
  };
};