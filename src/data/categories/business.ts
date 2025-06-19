
import { BusinessCategory } from './types';

export const businessCategories: BusinessCategory[] = [
  {
    id: 'professional',
    name: 'Professional Services',
    description: 'Legal, financial, consulting, and business services',
    icon: '💼',
    subcategories: [
      'Legal Services',
      'Accounting & Finance',
      'Real Estate',
      'Insurance',
      'Consulting',
      'Marketing & PR',
      'IT Services',
      'Business Coaching',
      'Event Planning'
    ]
  },
  {
    id: 'finance',
    name: 'Financial Services',
    description: 'Banking, investment, and financial planning',
    icon: '💰',
    subcategories: [
      'Banking',
      'Investment Services',
      'Financial Planning',
      'Tax Services',
      'Credit Counseling',
      'Mortgage Services',
      'Insurance',
      'Bookkeeping'
    ]
  },
  {
    id: 'accounting',
    name: 'Accounting & Bookkeeping',
    description: 'Financial record keeping and tax preparation',
    icon: '📊'
  },
  {
    id: 'advertising',
    name: 'Advertising & Marketing',
    description: 'Promotional services and brand marketing',
    icon: '📢'
  },
  {
    id: 'business-coaching',
    name: 'Business Coaching & Mentoring',
    description: 'Professional development and business guidance',
    icon: '📈'
  },
  {
    id: 'consulting',
    name: 'Consulting Services',
    description: 'Professional consulting across various industries',
    icon: '🤝',
    subcategories: [
      'Business Consulting',
      'Management Consulting',
      'IT Consulting',
      'Marketing Consulting',
      'Financial Consulting',
      'HR Consulting',
      'Strategy Consulting',
      'Operations Consulting',
      'Engineering Consulting',
      'Healthcare Consulting',
      'Legal Consulting',
      'Educational Consulting'
    ]
  },
  {
    id: 'franchise-consulting',
    name: 'Franchise Consulting',
    description: 'Franchise development and consulting',
    icon: '🏢'
  }
];
