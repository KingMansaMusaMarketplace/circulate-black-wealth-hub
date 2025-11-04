
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
    id: 'real-estate',
    name: 'Real Estate',
    description: 'Property sales, rentals, and management',
    icon: '🏘️',
    subcategories: [
      'Residential Sales',
      'Commercial Real Estate',
      'Property Management',
      'Real Estate Appraisal',
      'Vacation Rentals',
      'Rental Properties',
      'Real Estate Investment'
    ]
  },
  {
    id: 'event-planning',
    name: 'Event Planning & Coordination',
    description: 'Event management and party planning',
    icon: '🎉',
    subcategories: [
      'Wedding Planning',
      'Corporate Events',
      'Birthday Parties',
      'Event Venues',
      'Catering Coordination',
      'DJ Services',
      'Photography Services'
    ]
  },
  {
    id: 'printing',
    name: 'Printing Services',
    description: 'Commercial printing and copying',
    icon: '🖨️'
  },
  {
    id: 'laundry',
    name: 'Laundry & Dry Cleaning',
    description: 'Laundry and garment care services',
    icon: '🧺'
  },
  {
    id: 'tailoring',
    name: 'Tailoring & Alterations',
    description: 'Clothing alterations and custom tailoring',
    icon: '✂️'
  },
  {
    id: 'shoe-repair',
    name: 'Shoe Repair',
    description: 'Footwear repair and restoration',
    icon: '👞'
  },
  {
    id: 'funeral',
    name: 'Funeral Services',
    description: 'Funeral homes and memorial services',
    icon: '🕊️'
  },
  {
    id: 'insurance',
    name: 'Insurance Services',
    description: 'Insurance policies and claims',
    icon: '🛡️',
    subcategories: [
      'Auto Insurance',
      'Health Insurance',
      'Home Insurance',
      'Life Insurance',
      'Business Insurance'
    ]
  },
  {
    id: 'childcare',
    name: 'Childcare Services',
    description: 'Daycare and babysitting services',
    icon: '👶'
  },
  {
    id: 'elder-care',
    name: 'Elder Care Services',
    description: 'Senior care and assistance',
    icon: '👴'
  },
  {
    id: 'courier',
    name: 'Courier & Delivery Services',
    description: 'Package and document delivery',
    icon: '📮'
  },
  {
    id: 'translation',
    name: 'Translation Services',
    description: 'Language translation and interpretation',
    icon: '🌐'
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
