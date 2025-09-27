import { useState, useEffect } from 'react';
import { SALES_AGENT_ONBOARDING_STORAGE_KEY } from '@/lib/sales-agent-onboarding-constants';

export const useSalesAgentOnboarding = () => {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const hasCompletedOnboarding = localStorage.getItem(SALES_AGENT_ONBOARDING_STORAGE_KEY);
    // Temporarily disabled auto-show to prevent home page overlay
    // if (!hasCompletedOnboarding) {
    //   setShowOnboarding(true);
    // }
  }, []);

  const completeOnboarding = () => {
    localStorage.setItem(SALES_AGENT_ONBOARDING_STORAGE_KEY, 'true');
    setShowOnboarding(false);
  };

  const skipOnboarding = () => {
    completeOnboarding();
  };

  const nextStep = () => {
    setCurrentStep(prev => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(0, prev - 1));
  };

  const resetOnboarding = () => {
    localStorage.removeItem(SALES_AGENT_ONBOARDING_STORAGE_KEY);
    setCurrentStep(0);
    setShowOnboarding(true);
  };

  return {
    showOnboarding,
    currentStep,
    completeOnboarding,
    skipOnboarding,
    nextStep,
    prevStep,
    resetOnboarding
  };
};