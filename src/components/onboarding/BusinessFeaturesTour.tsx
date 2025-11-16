import React from 'react';
import { OnboardingTour, TourStep } from './OnboardingTour';
import { useOnboarding } from './useOnboarding';

const businessTourSteps: TourStep[] = [
  {
    target: '[data-tour="dashboard"]',
    title: 'Welcome to Your Dashboard',
    description: 'This is your central hub for managing your business. Access all features from here.',
    position: 'bottom'
  },
  {
    target: '[data-tour="products"]',
    title: 'Product Management',
    description: 'Upload and manage your product images with built-in optimization and editing tools.',
    position: 'right'
  },
  {
    target: '[data-tour="financials"]',
    title: 'Financial Tools',
    description: 'Track invoices, expenses, and generate comprehensive financial reports.',
    position: 'right'
  },
  {
    target: '[data-tour="customers"]',
    title: 'Customer Management',
    description: 'Manage customer profiles and track interactions.',
    position: 'right'
  },
  {
    target: '[data-tour="features-btn"]',
    title: 'Discover More',
    description: 'Click here anytime to explore all available features and learn how to use them.',
    position: 'bottom'
  }
];

export const BusinessFeaturesTour: React.FC = () => {
  const { shouldShowOnboarding, completeOnboarding } = useOnboarding();

  if (!shouldShowOnboarding) return null;

  return (
    <OnboardingTour
      steps={businessTourSteps}
      onComplete={completeOnboarding}
      onSkip={completeOnboarding}
      tourKey="business-features"
    />
  );
};

export default BusinessFeaturesTour;
