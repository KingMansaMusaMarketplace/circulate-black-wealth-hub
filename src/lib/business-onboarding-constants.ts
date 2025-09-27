import { Store, QrCode, BarChart3, Shield, Users, Gift } from 'lucide-react';

export interface BusinessOnboardingStep {
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

export const BUSINESS_ONBOARDING_STEPS: BusinessOnboardingStep[] = [
  {
    id: 'welcome-business',
    title: 'Welcome to Your Business Dashboard!',
    description: 'Get your Black-owned business discovered by thousands of potential customers in your community.',
    illustration: Store,
    features: [
      'Reach customers actively looking for Black-owned businesses',
      'Build a loyal customer base with our rewards system',
      'Get verified to boost your credibility and visibility',
      'Track customer engagement with detailed analytics'
    ]
  },
  {
    id: 'profile-setup',
    title: 'Complete Your Business Profile',
    description: 'A complete profile helps customers find you and builds trust. Add photos, hours, and detailed descriptions.',
    illustration: Users,
    features: [
      'Upload your logo and banner images',
      'Add business hours and contact information',
      'Write a compelling business description',
      'Select your business category and location'
    ],
    action: {
      text: 'Complete Profile',
      href: '/profile'
    }
  },
  {
    id: 'qr-codes',
    title: 'Create Your QR Codes',
    description: 'Generate QR codes for customers to scan and earn loyalty points when they shop with you.',
    illustration: QrCode,
    features: [
      'Generate unique QR codes for your business',
      'Set point values and discount percentages',
      'Download and print codes for your location',
      'Track scans and customer engagement'
    ],
    action: {
      text: 'Create QR Codes',
      href: '/dashboard'
    }
  },
  {
    id: 'verification',
    title: 'Get Verified for Maximum Visibility',
    description: 'Verified businesses get featured placement and build more customer trust. The process is simple and secure.',
    illustration: Shield,
    features: [
      'Upload business registration documents',
      'Provide proof of Black ownership',
      'Get the verified badge on your profile',
      'Appear higher in search results'
    ],
    action: {
      text: 'Start Verification',
      href: '/dashboard'
    }
  },
  {
    id: 'analytics',
    title: 'Track Your Success',
    description: 'Monitor your business performance with detailed analytics and customer insights.',
    illustration: BarChart3,
    features: [
      'See how many customers discovered your business',
      'Track QR code scans and point redemptions',
      'Monitor customer loyalty and repeat visits',
      'Understand peak business hours and trends'
    ],
    action: {
      text: 'View Analytics',
      href: '/dashboard'
    }
  }
];

export const BUSINESS_FAQ_ITEMS = [
  {
    question: 'How do I get my business listed?',
    answer: 'Sign up for a business account and complete your profile with business details, photos, and contact information. Your listing will be live immediately!'
  },
  {
    question: 'What documents do I need for verification?',
    answer: 'You\'ll need business registration documents, proof of Black ownership (51% or more), and proof of business address. All documents are securely stored and only viewed by our verification team.'
  },
  {
    question: 'How do QR codes work for my business?',
    answer: 'You generate QR codes from your dashboard, print them, and display them at checkout. When customers scan after making a purchase, they earn points and you build loyalty.'
  },
  {
    question: 'How much does it cost to list my business?',
    answer: 'Basic listing is free! Premium features and verification are available with our business subscription plans starting at $29/month.'
  },
  {
    question: 'How do customers find my business?',
    answer: 'Customers discover you through our directory search, map view, category browsing, and featured listings. Verified businesses get priority placement.'
  },
  {
    question: 'Can I manage multiple locations?',
    answer: 'Yes! You can create separate listings for each location or manage them under one business account with our multi-location features.'
  },
  {
    question: 'How do I set up customer rewards?',
    answer: 'Create QR codes with point values (e.g., 1 point per dollar spent) and customers can redeem points for discounts or free items you specify.'
  },
  {
    question: 'What analytics do I get?',
    answer: 'See profile views, QR scans, customer demographics, peak hours, popular services, and more. Premium accounts get advanced analytics and export features.'
  },
  {
    question: 'How long does verification take?',
    answer: 'Most verifications are completed within 2-3 business days. Complex cases may take up to a week. You\'ll get email updates throughout the process.'
  },
  {
    question: 'Can I edit my business information after listing?',
    answer: 'Yes! You can update your business information anytime from your dashboard. Photos, hours, descriptions, and contact info can all be changed instantly.'
  }
];

export const BUSINESS_HELP_SECTIONS = [
  {
    title: 'Getting Started',
    items: [
      { title: 'Setting Up Your Business Profile', description: 'Complete guide to creating an attractive business listing' },
      { title: 'Uploading Photos and Media', description: 'Best practices for business photos that attract customers' },
      { title: 'Business Verification Process', description: 'Step-by-step guide to getting verified' }
    ]
  },
  {
    title: 'QR Codes & Loyalty',
    items: [
      { title: 'Creating QR Codes', description: 'How to generate and manage QR codes for your business' },
      { title: 'Setting Up Rewards', description: 'Configure point values and customer rewards' },
      { title: 'Printing and Display Tips', description: 'Best practices for QR code placement and visibility' }
    ]
  },
  {
    title: 'Analytics & Growth',
    items: [
      { title: 'Understanding Your Analytics', description: 'How to read and interpret your business metrics' },
      { title: 'Increasing Visibility', description: 'Tips to get more customers to discover your business' },
      { title: 'Building Customer Loyalty', description: 'Strategies for repeat customers and word-of-mouth' }
    ]
  }
];

export const BUSINESS_CONTEXTUAL_TIPS = {
  'business-dashboard': {
    title: 'Business Dashboard',
    tip: 'This is your control center. Monitor key metrics, manage QR codes, and track customer engagement from here.'
  },
  'qr-code-creation': {
    title: 'QR Code Generator',
    tip: 'Set point values based on purchase amounts. For example, 1 point per dollar spent is a common ratio that customers love.'
  },
  'business-verification': {
    title: 'Verification Status',
    tip: 'Verified businesses get a badge and appear higher in search results. Upload clear, readable documents for faster approval.'
  },
  'analytics-overview': {
    title: 'Analytics Dashboard',
    tip: 'Track your most important metrics here. Focus on profile views, QR scans, and customer retention for business growth.'
  },
  'business-profile': {
    title: 'Profile Management',
    tip: 'Complete profiles with high-quality photos get 3x more customer visits. Update regularly with current info and photos.'
  }
};