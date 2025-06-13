
import { BusinessCategory } from './types';

export const technologyCategories: BusinessCategory[] = [
  {
    id: 'technology',
    name: 'Technology',
    description: 'Tech companies, software development, and digital services',
    icon: '💻',
    subcategories: [
      'Software Development',
      'Web Design',
      'Mobile Apps',
      'IT Support',
      'Digital Marketing',
      'E-commerce',
      'Tech Consulting',
      'Cybersecurity'
    ]
  },
  {
    id: 'mobile-apps',
    name: 'Mobile App Development',
    description: 'iOS and Android app development',
    icon: '📱'
  },
  {
    id: 'web-development',
    name: 'Web Development',
    description: 'Website design and development',
    icon: '💻'
  },
  {
    id: 'seo-services',
    name: 'SEO Services',
    description: 'Search engine optimization',
    icon: '🔍'
  },
  {
    id: 'social-media-marketing',
    name: 'Social Media Marketing',
    description: 'Social media management and advertising',
    icon: '📱'
  },
  {
    id: 'artificial-intelligence',
    name: 'Artificial Intelligence Services',
    description: 'AI development and consulting',
    icon: '🤖'
  },
  {
    id: 'blockchain',
    name: 'Blockchain & Cryptocurrency',
    description: 'Digital currency and blockchain services',
    icon: '₿'
  },
  {
    id: 'cloud-computing',
    name: 'Cloud Computing Services',
    description: 'Cloud infrastructure and services',
    icon: '☁️'
  },
  {
    id: 'cybersecurity',
    name: 'Cybersecurity',
    description: 'Digital security and protection services',
    icon: '🛡️'
  },
  {
    id: 'data-analytics',
    name: 'Data Analytics',
    description: 'Business intelligence and data analysis',
    icon: '📈'
  }
];
