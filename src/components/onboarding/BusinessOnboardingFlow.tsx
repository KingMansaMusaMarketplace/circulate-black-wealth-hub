import React from 'react';
import { OnboardingStep } from './OnboardingStep';
import { useBusinessOnboarding } from '@/hooks/useBusinessOnboarding';
import { BUSINESS_ONBOARDING_STEPS } from '@/lib/business-onboarding-constants';

export const BusinessOnboardingFlow: React.FC = () => {
  const {
    shouldShowOnboarding,
    currentStep,
    nextStep,
    prevStep,
    completeOnboarding,
    skipOnboarding
  } = useBusinessOnboarding();

  if (!shouldShowOnboarding) {
    return null;
  }

  const currentStepData = BUSINESS_ONBOARDING_STEPS[currentStep];
  
  if (!currentStepData) {
    completeOnboarding();
    return null;
  }

  return (
    <OnboardingStep
      title={currentStepData.title}
      description={currentStepData.description}
      illustration={currentStepData.illustration}
      features={currentStepData.features}
      stepNumber={currentStep + 1}
      totalSteps={BUSINESS_ONBOARDING_STEPS.length}
      onNext={nextStep}
      onPrev={prevStep}
      onSkip={skipOnboarding}
      onComplete={completeOnboarding}
      isLastStep={currentStep === BUSINESS_ONBOARDING_STEPS.length - 1}
      action={currentStepData.action}
    />
  );
};