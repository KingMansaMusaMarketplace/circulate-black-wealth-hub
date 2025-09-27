import React from 'react';
import { OnboardingStep } from './OnboardingStep';
import { useCorporateOnboarding } from '@/hooks/useCorporateOnboarding';
import { CORPORATE_ONBOARDING_STEPS } from '@/lib/corporate-onboarding-constants';

export const CorporateOnboardingFlow: React.FC = () => {
  const {
    shouldShowOnboarding,
    currentStep,
    nextStep,
    prevStep,
    completeOnboarding,
    skipOnboarding
  } = useCorporateOnboarding();

  if (!shouldShowOnboarding) {
    return null;
  }

  const currentStepData = CORPORATE_ONBOARDING_STEPS[currentStep];
  
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
      totalSteps={CORPORATE_ONBOARDING_STEPS.length}
      onNext={nextStep}
      onPrev={prevStep}
      onSkip={skipOnboarding}
      onComplete={completeOnboarding}
      isLastStep={currentStep === CORPORATE_ONBOARDING_STEPS.length - 1}
      action={currentStepData.action}
    />
  );
};