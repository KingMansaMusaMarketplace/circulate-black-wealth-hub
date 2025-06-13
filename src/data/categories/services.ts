
import { BusinessCategory } from './types';

export const serviceCategories: BusinessCategory[] = [
  {
    id: 'home',
    name: 'Home Services',
    description: 'Construction, repair, cleaning, and home improvement',
    icon: '🏠',
    subcategories: [
      'Construction',
      'Plumbing',
      'Electrical',
      'HVAC',
      'Cleaning Services',
      'Landscaping',
      'Interior Design',
      'Home Security',
      'Moving Services'
    ]
  },
  {
    id: 'automotive',
    name: 'Automotive',
    description: 'Car services, dealerships, and transportation',
    icon: '🚗',
    subcategories: [
      'Auto Repair',
      'Car Dealerships',
      'Car Wash & Detailing',
      'Towing Services',
      'Auto Parts',
      'Transportation Services',
      'Motorcycle Services'
    ]
  },
  {
    id: 'cleaning',
    name: 'Cleaning Services',
    description: 'Residential and commercial cleaning',
    icon: '🧽'
  },
  {
    id: 'plumbing',
    name: 'Plumbing Services',
    description: 'Pipe and water system repair',
    icon: '🔧'
  },
  {
    id: 'electrician',
    name: 'Electrical Services',
    description: 'Electrical installation and repair',
    icon: '⚡'
  },
  {
    id: 'construction',
    name: 'Construction Services',
    description: 'Building and renovation work',
    icon: '🏗️'
  },
  {
    id: 'locksmith',
    name: 'Locksmith Services',
    description: 'Lock installation and security',
    icon: '🔐'
  }
];
