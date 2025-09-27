import React from 'react';
import { OnboardingStep } from './OnboardingStep';
import { useOnboarding } from '@/hooks/useOnboarding';
import { ONBOARDING_STEPS } from '@/lib/onboarding-constants';

export const OnboardingFlow: React.FC = () => {
  const {
    shouldShowOnboarding,
    currentStep,
    nextStep,
    prevStep,
    completeOnboarding,
    skipOnboarding
  } = useOnboarding();

  if (!shouldShowOnboarding) {
    return null;
  }

  const currentStepData = ONBOARDING_STEPS[currentStep];
  
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
      totalSteps={ONBOARDING_STEPS.length}
      onNext={nextStep}
      onPrev={prevStep}
      onSkip={skipOnboarding}
      onComplete={completeOnboarding}
      isLastStep={currentStep === ONBOARDING_STEPS.length - 1}
      action={currentStepData.action}
    />
  );
};