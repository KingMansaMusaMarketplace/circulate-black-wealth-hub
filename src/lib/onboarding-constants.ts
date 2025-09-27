import { Search, QrCode, Gift, Heart } from 'lucide-react';

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  illustration: any;
  features: string[];
  action?: {
    text: string;
    href?: string;
  };
}

export const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to Mansa Musa Marketplace!',
    description: 'Your gateway to discovering and supporting Black-owned businesses in your community.',
    illustration: Heart,
    features: [
      'Discover amazing Black-owned businesses near you',
      'Earn rewards for every purchase you make',
      'Build stronger community connections',
      'Make a real economic impact'
    ]
  },
  {
    id: 'discovery',
    title: 'Discover Local Businesses',
    description: 'Find restaurants, shops, services, and more in your area with our powerful search and map features.',
    illustration: Search,
    features: [
      'Browse by category or search by name',
      'View businesses on an interactive map',
      'Read reviews from the community',
      'See business hours, contact info, and directions'
    ],
    action: {
      text: 'Explore Directory',
      href: '/directory'
    }
  },
  {
    id: 'qr-scanning',
    title: 'Scan QR Codes to Earn',
    description: 'Use our QR scanner when you visit participating businesses to earn points and unlock rewards.',
    illustration: QrCode,
    features: [
      'Scan QR codes at checkout to earn points',
      'Get instant confirmation of your rewards',
      'Track your point balance in real-time',
      'Works at all participating businesses'
    ],
    action: {
      text: 'Try QR Scanner',
      href: '/qr-scanner'
    }
  },
  {
    id: 'rewards',
    title: 'Redeem Amazing Rewards',
    description: 'Turn your points into discounts, free items, and exclusive offers from your favorite businesses.',
    illustration: Gift,
    features: [
      'Redeem points for discounts and free items',
      'Access exclusive member-only offers',
      'Save on future purchases automatically',
      'Special rewards for loyal customers'
    ],
    action: {
      text: 'View Rewards',
      href: '/loyalty'
    }
  }
];

export const FAQ_ITEMS = [
  {
    question: 'How do I earn points?',
    answer: 'You earn points by scanning QR codes at participating businesses when you make a purchase. Points are added to your account instantly!'
  },
  {
    question: 'How do I redeem my rewards?',
    answer: 'Visit the Loyalty section to see available rewards. Tap any reward to redeem it, and show the confirmation to the business when making your purchase.'
  },
  {
    question: 'How do I find businesses near me?',
    answer: 'Use the Directory page to browse businesses by category or search by name. The map view shows businesses closest to your location.'
  },
  {
    question: 'What if a business isn\'t listed?',
    answer: 'You can suggest new businesses through our contact form. We\'re always adding new partners to the marketplace!'
  },
  {
    question: 'How do QR codes work?',
    answer: 'Each participating business has a unique QR code. Scan it with our app after making a purchase to earn points. The business will confirm your purchase amount.'
  },
  {
    question: 'Is my personal information safe?',
    answer: 'Yes! We use industry-standard security measures to protect your data. We never share your personal information with third parties without your consent.'
  },
  {
    question: 'Can I use the app without creating an account?',
    answer: 'You can browse businesses without an account, but you\'ll need to sign up to earn points, redeem rewards, and save your favorite businesses.'
  },
  {
    question: 'Do points expire?',
    answer: 'Points remain active as long as you use the app regularly. Points may expire after 12 months of inactivity.'
  }
];

export const HELP_SECTIONS = [
  {
    title: 'Getting Started',
    items: [
      { title: 'Creating Your Account', description: 'Learn how to sign up and set up your profile' },
      { title: 'Finding Businesses', description: 'Tips for discovering businesses in your area' },
      { title: 'First QR Code Scan', description: 'Step-by-step guide to earning your first points' }
    ]
  },
  {
    title: 'Earning & Rewards',
    items: [
      { title: 'How Points Work', description: 'Understanding the point system and earning rates' },
      { title: 'Redeeming Rewards', description: 'How to use your points for discounts and freebies' },
      { title: 'Loyalty Tiers', description: 'Unlock better rewards as you earn more points' }
    ]
  },
  {
    title: 'Account & Privacy',
    items: [
      { title: 'Managing Your Profile', description: 'Update your information and preferences' },
      { title: 'Privacy Settings', description: 'Control what information you share' },
      { title: 'Account Security', description: 'Keep your account safe and secure' }
    ]
  }
];

export const CONTEXTUAL_TIPS = {
  'qr-scanner': {
    title: 'QR Code Scanner',
    tip: 'Point your camera at the QR code displayed at checkout. Make sure the code is well-lit and fully visible in the frame.'
  },
  'directory-map': {
    title: 'Map View',
    tip: 'Tap on any business marker to see details, or use the search bar to find specific types of businesses.'
  },
  'loyalty-rewards': {
    title: 'Rewards Catalog',
    tip: 'Rewards with a gold border are premium offers. Check back regularly as new rewards are added weekly!'
  },
  'business-profile': {
    title: 'Business Details',
    tip: 'Scroll down to see reviews, photos, and current offers. Tap the heart icon to save this business to your favorites.'
  }
};