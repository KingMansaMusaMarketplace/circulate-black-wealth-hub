
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
  },
  {
    id: 'landscaping',
    name: 'Landscaping & Lawn Care',
    description: 'Yard maintenance and outdoor design',
    icon: '🌳'
  },
  {
    id: 'hvac',
    name: 'HVAC Services',
    description: 'Heating, ventilation, and air conditioning',
    icon: '❄️'
  },
  {
    id: 'roofing',
    name: 'Roofing Services',
    description: 'Roof repair and installation',
    icon: '🏠'
  },
  {
    id: 'painting',
    name: 'Painting Services',
    description: 'Interior and exterior painting',
    icon: '🎨'
  },
  {
    id: 'flooring',
    name: 'Flooring Installation',
    description: 'Carpet, tile, and hardwood flooring',
    icon: '🪵'
  },
  {
    id: 'pest-control',
    name: 'Pest Control',
    description: 'Extermination and prevention services',
    icon: '🐛'
  },
  {
    id: 'moving',
    name: 'Moving Services',
    description: 'Residential and commercial moving',
    icon: '📦'
  },
  {
    id: 'storage',
    name: 'Storage Facilities',
    description: 'Self-storage and warehouse services',
    icon: '🏢'
  },
  {
    id: 'security',
    name: 'Security Services',
    description: 'Security guards and monitoring',
    icon: '🛡️'
  },
  {
    id: 'auto-repair',
    name: 'Auto Repair & Maintenance',
    description: 'Vehicle service and repair',
    icon: '🔧'
  },
  {
    id: 'car-wash',
    name: 'Car Wash & Detailing',
    description: 'Vehicle cleaning and detailing',
    icon: '🚗'
  },
  {
    id: 'towing',
    name: 'Towing Services',
    description: 'Emergency towing and roadside assistance',
    icon: '🚛'
  }
];
