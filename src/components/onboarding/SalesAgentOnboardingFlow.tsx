import React from 'react';
import { OnboardingStep } from '@/components/onboarding/OnboardingStep';
import { SALES_AGENT_ONBOARDING_STEPS } from '@/lib/sales-agent-onboarding-constants';
import { useSalesAgentOnboarding } from '@/hooks/useSalesAgentOnboarding';

const SalesAgentOnboardingFlow: React.FC = () => {
  const {
    showOnboarding,
    currentStep,
    completeOnboarding,
    skipOnboarding,
    nextStep,
    prevStep
  } = useSalesAgentOnboarding();

  if (!showOnboarding) return null;

  const currentStepData = SALES_AGENT_ONBOARDING_STEPS[currentStep];
  const isLastStep = currentStep === SALES_AGENT_ONBOARDING_STEPS.length - 1;

  return (
    <OnboardingStep
      {...currentStepData}
      stepNumber={currentStep + 1}
      totalSteps={SALES_AGENT_ONBOARDING_STEPS.length}
      onNext={nextStep}
      onPrev={prevStep}
      onSkip={skipOnboarding}
      onComplete={completeOnboarding}
      isLastStep={isLastStep}
    />
  );
};

export default SalesAgentOnboardingFlow;