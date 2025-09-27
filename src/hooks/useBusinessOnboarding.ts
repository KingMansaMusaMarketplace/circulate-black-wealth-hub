import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface BusinessOnboardingState {
  isFirstVisit: boolean;
  currentStep: number;
  completed: boolean;
  skipped: boolean;
}

export const useBusinessOnboarding = () => {
  const { user } = useAuth();
  const [onboardingState, setOnboardingState] = useState<BusinessOnboardingState>({
    isFirstVisit: false,
    currentStep: 0,
    completed: false,
    skipped: false
  });

  const BUSINESS_ONBOARDING_KEY = 'mansa-business-onboarding-completed';
  const BUSINESS_ONBOARDING_STATE_KEY = 'mansa-business-onboarding-state';

  // Check if user is a business owner
  const isBusinessUser = user?.user_metadata?.user_type === 'business' || 
                        user?.user_metadata?.userType === 'business';

  useEffect(() => {
    if (!isBusinessUser) return;
    
    const checkOnboardingStatus = () => {
      const completed = localStorage.getItem(BUSINESS_ONBOARDING_KEY);
      const savedState = localStorage.getItem(BUSINESS_ONBOARDING_STATE_KEY);
      
      if (completed === 'true') {
        setOnboardingState(prev => ({ ...prev, completed: true }));
      } else if (savedState) {
        setOnboardingState(JSON.parse(savedState));
      } else {
        // First visit for new business users
        setOnboardingState(prev => ({ ...prev, isFirstVisit: true }));
      }
    };

    checkOnboardingStatus();
  }, [user, isBusinessUser]);

  const startOnboarding = () => {
    if (!isBusinessUser) return;
    
    setOnboardingState({
      isFirstVisit: true,
      currentStep: 0,
      completed: false,
      skipped: false
    });
    localStorage.removeItem(BUSINESS_ONBOARDING_KEY);
    localStorage.setItem(BUSINESS_ONBOARDING_STATE_KEY, JSON.stringify({
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
    localStorage.setItem(BUSINESS_ONBOARDING_STATE_KEY, JSON.stringify(newState));
  };

  const prevStep = () => {
    const newState = {
      ...onboardingState,
      currentStep: Math.max(0, onboardingState.currentStep - 1)
    };
    setOnboardingState(newState);
    localStorage.setItem(BUSINESS_ONBOARDING_STATE_KEY, JSON.stringify(newState));
  };

  const completeOnboarding = () => {
    localStorage.setItem(BUSINESS_ONBOARDING_KEY, 'true');
    localStorage.removeItem(BUSINESS_ONBOARDING_STATE_KEY);
    setOnboardingState({
      isFirstVisit: false,
      currentStep: 0,
      completed: true,
      skipped: false
    });
  };

  const skipOnboarding = () => {
    localStorage.setItem(BUSINESS_ONBOARDING_KEY, 'true');
    localStorage.removeItem(BUSINESS_ONBOARDING_STATE_KEY);
    setOnboardingState({
      isFirstVisit: false,
      currentStep: 0,
      completed: true,
      skipped: true
    });
  };

  const resetOnboarding = () => {
    localStorage.removeItem(BUSINESS_ONBOARDING_KEY);
    localStorage.removeItem(BUSINESS_ONBOARDING_STATE_KEY);
    setOnboardingState({
      isFirstVisit: false,
      currentStep: 0,
      completed: false,
      skipped: false
    });
  };

  return {
    ...onboardingState,
    isBusinessUser,
    startOnboarding,
    nextStep,
    prevStep,
    completeOnboarding,
    skipOnboarding,
    resetOnboarding,
    shouldShowOnboarding: false // Temporarily disabled to prevent home page overlay
  };
};