import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface OnboardingState {
  isFirstVisit: boolean;
  currentStep: number;
  completed: boolean;
  skipped: boolean;
}

export const useOnboarding = () => {
  const { user } = useAuth();
  const [onboardingState, setOnboardingState] = useState<OnboardingState>({
    isFirstVisit: false,
    currentStep: 0,
    completed: false,
    skipped: false
  });

  const ONBOARDING_KEY = 'mansa-onboarding-completed';
  const ONBOARDING_STATE_KEY = 'mansa-onboarding-state';

  useEffect(() => {
    const checkOnboardingStatus = () => {
      const completed = localStorage.getItem(ONBOARDING_KEY);
      const savedState = localStorage.getItem(ONBOARDING_STATE_KEY);
      
      if (completed === 'true') {
        setOnboardingState(prev => ({ ...prev, completed: true }));
      } else if (savedState) {
        setOnboardingState(JSON.parse(savedState));
      } else {
        // First visit for new users
        setOnboardingState(prev => ({ ...prev, isFirstVisit: true }));
      }
    };

    checkOnboardingStatus();
  }, [user]);

  const startOnboarding = () => {
    setOnboardingState({
      isFirstVisit: true,
      currentStep: 0,
      completed: false,
      skipped: false
    });
    localStorage.removeItem(ONBOARDING_KEY);
    localStorage.setItem(ONBOARDING_STATE_KEY, JSON.stringify({
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
    localStorage.setItem(ONBOARDING_STATE_KEY, JSON.stringify(newState));
  };

  const prevStep = () => {
    const newState = {
      ...onboardingState,
      currentStep: Math.max(0, onboardingState.currentStep - 1)
    };
    setOnboardingState(newState);
    localStorage.setItem(ONBOARDING_STATE_KEY, JSON.stringify(newState));
  };

  const completeOnboarding = () => {
    localStorage.setItem(ONBOARDING_KEY, 'true');
    localStorage.removeItem(ONBOARDING_STATE_KEY);
    setOnboardingState({
      isFirstVisit: false,
      currentStep: 0,
      completed: true,
      skipped: false
    });
  };

  const skipOnboarding = () => {
    localStorage.setItem(ONBOARDING_KEY, 'true');
    localStorage.removeItem(ONBOARDING_STATE_KEY);
    setOnboardingState({
      isFirstVisit: false,
      currentStep: 0,
      completed: true,
      skipped: true
    });
  };

  const resetOnboarding = () => {
    localStorage.removeItem(ONBOARDING_KEY);
    localStorage.removeItem(ONBOARDING_STATE_KEY);
    setOnboardingState({
      isFirstVisit: false,
      currentStep: 0,
      completed: false,
      skipped: false
    });
  };

  return {
    ...onboardingState,
    startOnboarding,
    nextStep,
    prevStep,
    completeOnboarding,
    skipOnboarding,
    resetOnboarding,
    shouldShowOnboarding: false // Temporarily disable auto-onboarding to prevent intrusive modal
  };
};