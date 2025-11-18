import { Building2, TrendingUp, Users, Award, Target, BarChart3 } from 'lucide-react';

export interface CorporateOnboardingStep {
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

export const CORPORATE_ONBOARDING_STEPS: CorporateOnboardingStep[] = [
  {
    id: 'welcome-corporate',
    title: 'Welcome, Corporate Partner!',
    description: 'Join leading companies making a real difference by supporting Black-owned businesses and strengthening communities.',
    illustration: Building2,
    features: [
      'Drive measurable economic impact in Black communities',
      'Enhance your corporate social responsibility profile',
      'Connect with engaged, diverse customer demographics',
      'Receive detailed impact reporting and analytics'
    ]
  },
  {
    id: 'sponsorship-tiers',
    title: 'Choose Your Impact Level',
    description: 'Select the sponsorship tier that aligns with your company\'s goals and budget. Each tier offers unique benefits and visibility.',
    illustration: Award,
    features: [
      'Bronze Tier: Essential community support ($5K/year)',
      'Silver Tier: Enhanced visibility and reporting ($15K/year)',
      'Gold Tier: Premium partnership benefits ($50K/year)',
      'Platinum Tier: Exclusive strategic partnership ($100K+/year)'
    ],
    action: {
      text: 'View Sponsorship Tiers',
      href: '/corporate-sponsorship'
    }
  },
  {
    id: 'brand-visibility',
    title: 'Maximize Your Brand Exposure',
    description: 'Showcase your commitment to community empowerment through strategic brand placement and authentic partnerships.',
    illustration: Target,
    features: [
      'Logo placement on our platform and marketing materials',
      'Featured mentions in community success stories',
      'Co-branded campaign opportunities',
      'Exclusive access to community events and networking'
    ],
    action: {
      text: 'See Brand Benefits',
      href: '/corporate-sponsorship'
    }
  },
  {
    id: 'impact-measurement',
    title: 'Track Your Community Impact',
    description: 'Access comprehensive analytics showing exactly how your sponsorship drives economic circulation and business growth.',
    illustration: BarChart3,
    features: [
      'Monthly impact reports with key metrics',
      'Dollar circulation tracking in sponsored communities',
      'Business growth metrics for supported enterprises',
      'Customer engagement and demographic insights'
    ],
    action: {
      text: 'View Sample Reports',
      href: '/corporate-sponsorship'
    }
  },
  {
    id: 'partnership-benefits',
    title: 'Access Exclusive Partnership Services',
    description: 'Beyond sponsorship, purchase access to unique services and opportunities to engage directly with our community and business network.',
    illustration: Users,
    features: [
      'First access to partnership opportunities with growing businesses',
      'VIP invitations to community events and conferences',
      'Direct networking with successful Black entrepreneurs',
      'Co-marketing opportunities with high-performing businesses'
    ],
    action: {
      text: 'Start Partnership',
      href: '/corporate-sponsorship'
    }
  }
];

export const CORPORATE_FAQ_ITEMS = [
  {
    question: 'What are the different sponsorship tiers and their benefits?',
    answer: 'We offer Bronze ($5K), Silver ($15K), Gold ($50K), and Platinum ($100K+) tiers. Each includes increasing levels of brand visibility, impact reporting, networking opportunities, and exclusive partnership benefits. Higher tiers receive premium placement and co-marketing opportunities.'
  },
  {
    question: 'How do you measure and report on community impact?',
    answer: 'We provide detailed monthly reports showing dollar circulation, number of businesses supported, job creation estimates, customer engagement metrics, and demographic insights. Platinum sponsors receive real-time dashboards and quarterly impact presentations.'
  },
  {
    question: 'What kind of brand visibility will our company receive?',
    answer: 'Visibility varies by tier but includes logo placement on our platform, mentions in marketing materials, social media recognition, newsletter features, and potential co-branded campaigns. Gold and Platinum sponsors get premium homepage placement and event naming opportunities.'
  },
  {
    question: 'Can we target our sponsorship to specific regions or business types?',
    answer: 'Yes! Silver and above tiers can specify geographic focus areas or business categories. This allows you to align sponsorship with your company\'s local presence or industry expertise while maximizing relevant community impact.'
  },
  {
    question: 'What is the minimum commitment period for corporate sponsorship?',
    answer: 'Our standard sponsorship agreements are annual commitments. However, we offer quarterly pilots for new corporate partners to experience the impact before committing to a full year. Month-to-month options are available for Platinum-level partnerships.'
  },
  {
    question: 'How can our employees get involved beyond financial sponsorship?',
    answer: 'We offer volunteer opportunities, mentorship programs, and skill-sharing sessions where your employees can directly support Black entrepreneurs. Many sponsors also organize company visits to partner businesses and group purchasing initiatives.'
  },
  {
    question: 'Do you provide materials for our CSR and sustainability reporting?',
    answer: 'Absolutely! We provide detailed impact summaries, success stories, photos, and metrics formatted for CSR reports, sustainability disclosures, and stakeholder communications. This helps demonstrate your company\'s authentic commitment to economic equity.'
  },
  {
    question: 'Can we sponsor specific initiatives or campaigns rather than general support?',
    answer: 'Yes, Gold and Platinum sponsors can earmark funds for specific initiatives like business incubator programs, community events, or educational workshops. This creates more targeted impact aligned with your company\'s values and interests.'
  },
  {
    question: 'What compliance and due diligence processes do you have in place?',
    answer: 'We maintain rigorous financial transparency with quarterly audits, detailed fund allocation reports, and compliance with all nonprofit regulations. We provide documentation needed for your internal compliance and audit requirements.'
  },
  {
    question: 'How do we get started with a corporate sponsorship?',
    answer: 'Contact our corporate partnerships team to schedule a consultation. We\'ll assess your goals, recommend the right tier, and create a customized partnership proposal. The onboarding process typically takes 2-3 weeks from agreement to launch.'
  }
];

export const CORPORATE_HELP_SECTIONS = [
  {
    title: 'Getting Started',
    items: [
      { title: 'Choosing the Right Sponsorship Tier', description: 'Understanding which sponsorship level aligns with your goals and budget' },
      { title: 'Partnership Agreement Process', description: 'Legal requirements, timelines, and documentation needed' },
      { title: 'Setting Up Your Sponsor Profile', description: 'Brand guidelines, logo requirements, and messaging approval' }
    ]
  },
  {
    title: 'Impact & Reporting',
    items: [
      { title: 'Understanding Impact Metrics', description: 'How we measure community economic circulation and business growth' },
      { title: 'Accessing Your Analytics Dashboard', description: 'Real-time insights into your sponsorship effectiveness' },
      { title: 'Using Reports for CSR Communication', description: 'Materials and data for your corporate responsibility reporting' }
    ]
  },
  {
    title: 'Maximizing Partnership Value',
    items: [
      { title: 'Employee Engagement Opportunities', description: 'Volunteer programs and mentorship initiatives for your team' },
      { title: 'Co-Marketing and Brand Collaboration', description: 'Joint campaigns and authentic community storytelling' },
      { title: 'Network Access and Business Development', description: 'Connecting with high-growth Black-owned businesses' }
    ]
  }
];

export const CORPORATE_CONTEXTUAL_TIPS = {
  'sponsorship-dashboard': {
    title: 'Corporate Partnership Dashboard',
    tip: 'Monitor your community impact, track engagement metrics, and access exclusive partnership opportunities from this centralized hub.'
  },
  'impact-analytics': {
    title: 'Impact Analytics',
    tip: 'These metrics show real dollars circulated and businesses supported through your sponsorship. Use this data for CSR reporting and stakeholder communications.'
  },
  'brand-visibility': {
    title: 'Brand Visibility Options',
    tip: 'Customize your brand presence while maintaining authentic community connection. Higher visibility options require approval to ensure community alignment.'
  },
  'community-engagement': {
    title: 'Community Engagement',
    tip: 'Direct engagement with business owners and community members creates stronger partnerships and more meaningful impact than purely financial support.'
  },
  'sponsorship-tiers': {
    title: 'Sponsorship Investment',
    tip: 'Higher tiers provide access to exclusive partnership services like co-branding, executive networking, and priority partnership opportunities with high-growth businesses.'
  }
};