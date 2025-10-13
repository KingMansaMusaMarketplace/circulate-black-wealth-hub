import { TourStep } from '../OnboardingTour';

export const customerTourSteps: TourStep[] = [
  {
    target: '[data-tour="directory-link"]',
    title: 'Welcome to the Marketplace! 🎉',
    description: 'Discover and support Black-owned businesses in your community. Let\'s take a quick tour to help you get started.',
    position: 'bottom',
  },
  {
    target: '[data-tour="search-businesses"]',
    title: 'Search Businesses',
    description: 'Use the search bar to find businesses by name, category, or location. Filter results to find exactly what you\'re looking for.',
    position: 'bottom',
  },
  {
    target: '[data-tour="business-card"]',
    title: 'Business Listings',
    description: 'Browse verified Black-owned businesses. Each listing shows ratings, reviews, and key information.',
    position: 'right',
  },
  {
    target: '[data-tour="qr-scanner"]',
    title: 'QR Code Scanner',
    description: 'Scan business QR codes to earn loyalty points and access exclusive discounts. Your impact helps track community economic circulation!',
    position: 'bottom',
  },
  {
    target: '[data-tour="user-menu"]',
    title: 'Your Profile',
    description: 'Access your profile, view your impact metrics, manage loyalty points, and track your contribution to the community.',
    position: 'left',
  },
  {
    target: '[data-tour="community-tab"]',
    title: 'Community Hub',
    description: 'Join discussions, attend events, and connect with other community members in our forum.',
    position: 'bottom',
  },
];
