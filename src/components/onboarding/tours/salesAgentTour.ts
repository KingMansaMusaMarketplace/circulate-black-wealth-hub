import { TourStep } from '../OnboardingTour';

export const salesAgentTourSteps: TourStep[] = [
  {
    target: '[data-tour="agent-dashboard"]',
    title: 'Welcome Sales Agent! 💼',
    description: 'Your agent dashboard helps you track referrals, commissions, and grow your network. Let\'s get you started!',
    position: 'bottom',
  },
  {
    target: '[data-tour="referral-code"]',
    title: 'Your Unique Referral Code',
    description: 'Share this code with businesses you refer. When they sign up and subscribe, you earn commissions!',
    position: 'right',
  },
  {
    target: '[data-tour="commission-stats"]',
    title: 'Commission Overview',
    description: 'Track your total earnings, pending commissions, and payment history. Commissions are paid monthly.',
    position: 'bottom',
  },
  {
    target: '[data-tour="referral-list"]',
    title: 'Your Referrals',
    description: 'View all businesses you\'ve referred, their subscription status, and commission details.',
    position: 'right',
  },
  {
    target: '[data-tour="tier-progress"]',
    title: 'Agent Tier System',
    description: 'Earn higher commission rates as you refer more businesses. Progress from Bronze → Silver → Gold → Platinum!',
    position: 'bottom',
  },
  {
    target: '[data-tour="marketing-materials"]',
    title: 'Marketing Resources',
    description: 'Download brochures, presentation decks, and promotional materials to help you pitch to businesses.',
    position: 'bottom',
  },
  {
    target: '[data-tour="share-link"]',
    title: 'Share Your Link',
    description: 'Use the share button to easily send your referral link via email, SMS, or social media.',
    position: 'left',
  },
];
