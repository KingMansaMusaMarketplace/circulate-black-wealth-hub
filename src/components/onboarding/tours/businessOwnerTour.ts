import { TourStep } from '../OnboardingTour';

export const businessOwnerTourSteps: TourStep[] = [
  {
    target: '[data-tour="business-dashboard"]',
    title: 'Welcome Business Owner! 👋',
    description: 'Your dashboard is your command center for managing your business on the platform. Let\'s explore the key features.',
    position: 'bottom',
  },
  {
    target: '[data-tour="dashboard-stats"]',
    title: 'Performance Overview',
    description: 'Track your key metrics: total transactions, revenue, customer engagement, and growth trends at a glance.',
    position: 'bottom',
  },
  {
    target: '[data-tour="qr-code-section"]',
    title: 'Your QR Code',
    description: 'Display this QR code at your business. When customers scan it, they earn loyalty points and you track engagement!',
    position: 'right',
  },
  {
    target: '[data-tour="bookings-tab"]',
    title: 'Manage Bookings',
    description: 'If you offer services, manage customer bookings, appointments, and send automated reminders here.',
    position: 'bottom',
  },
  {
    target: '[data-tour="analytics-section"]',
    title: 'Analytics & Insights',
    description: 'Dive deep into customer behavior, peak hours, popular services, and revenue trends to optimize your business.',
    position: 'bottom',
  },
  {
    target: '[data-tour="profile-settings"]',
    title: 'Business Profile',
    description: 'Keep your business information, hours, photos, and contact details up to date. A complete profile attracts more customers!',
    position: 'left',
  },
  {
    target: '[data-tour="verification-badge"]',
    title: 'Get Verified',
    description: 'Submit verification documents to get your verified badge. Verified businesses get priority placement and build more trust.',
    position: 'bottom',
  },
];
