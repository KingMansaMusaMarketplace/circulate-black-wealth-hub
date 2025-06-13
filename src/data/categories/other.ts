
import { BusinessCategory } from './types';

export const otherCategories: BusinessCategory[] = [
  {
    id: 'pet',
    name: 'Pet Services',
    description: 'Veterinary care, grooming, and pet supplies',
    icon: '🐕',
    subcategories: [
      'Veterinary Services',
      'Pet Grooming',
      'Pet Supplies',
      'Pet Training',
      'Pet Boarding',
      'Pet Photography',
      'Pet Walking',
      'Animal Rescue'
    ]
  },
  {
    id: 'travel',
    name: 'Travel & Hospitality',
    description: 'Hotels, travel agencies, and tourism services',
    icon: '✈️',
    subcategories: [
      'Hotels & Lodging',
      'Travel Agencies',
      'Tour Operators',
      'Vacation Rentals',
      'Transportation',
      'Travel Planning',
      'Event Venues',
      'Wedding Venues'
    ]
  },
  {
    id: 'nonprofit',
    name: 'Community & Nonprofit',
    description: 'Community organizations and nonprofit services',
    icon: '🤝',
    subcategories: [
      'Community Centers',
      'Religious Organizations',
      'Youth Programs',
      'Senior Services',
      'Advocacy Groups',
      'Educational Nonprofits',
      'Health Nonprofits',
      'Environmental Groups'
    ]
  },
  {
    id: 'other',
    name: 'Other Services',
    description: 'Miscellaneous and specialized services',
    icon: '🔧',
    subcategories: [
      'Specialty Services',
      'Consulting',
      'Custom Solutions',
      'Unique Offerings',
      'Specialized Equipment',
      'Niche Markets',
      'Innovation Services',
      'Emerging Industries'
    ]
  }
];
