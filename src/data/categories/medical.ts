
import { BusinessCategory } from './types';

export const medicalCategories: BusinessCategory[] = [
  {
    id: 'health',
    name: 'Healthcare',
    description: 'Medical practices, dental, and health services',
    icon: '🏥',
    subcategories: [
      'Primary Care',
      'Dental Care',
      'Mental Health',
      'Alternative Medicine',
      'Pharmacy',
      'Medical Specialists',
      'Physical Therapy',
      'Nutrition & Dietetics'
    ]
  },
  {
    id: 'general-dentistry',
    name: 'General Dentistry',
    description: 'Comprehensive dental care and checkups',
    icon: '🦷'
  },
  {
    id: 'pediatric-dentistry',
    name: 'Pediatric Dentistry',
    description: 'Dental care for children and teens',
    icon: '👶'
  },
  {
    id: 'orthodontics',
    name: 'Orthodontics',
    description: 'Braces, aligners, and teeth straightening',
    icon: '😁'
  },
  {
    id: 'oral-surgery',
    name: 'Oral Surgery',
    description: 'Dental surgery and oral procedures',
    icon: '🔬'
  },
  {
    id: 'periodontics',
    name: 'Periodontics',
    description: 'Gum disease treatment and prevention',
    icon: '🦷'
  },
  {
    id: 'endodontics',
    name: 'Endodontics',
    description: 'Root canal therapy and tooth preservation',
    icon: '🩺'
  },
  {
    id: 'prosthodontics',
    name: 'Prosthodontics',
    description: 'Dental prosthetics and tooth replacement',
    icon: '🦷'
  },
  {
    id: 'cosmetic-dentistry',
    name: 'Cosmetic Dentistry',
    description: 'Teeth whitening and aesthetic dental work',
    icon: '✨'
  },
  {
    id: 'dental-implants',
    name: 'Dental Implants',
    description: 'Tooth implant surgery and restoration',
    icon: '🔧'
  },
  {
    id: 'emergency-dentistry',
    name: 'Emergency Dentistry',
    description: '24/7 dental emergency services',
    icon: '🚨'
  },
  {
    id: 'podiatry',
    name: 'Podiatry',
    description: 'Foot and ankle medical care',
    icon: '🦶'
  },
  {
    id: 'dermatology',
    name: 'Dermatology',
    description: 'Skin care and dermatological treatment',
    icon: '🧴'
  },
  {
    id: 'cardiology',
    name: 'Cardiology',
    description: 'Heart and cardiovascular specialists',
    icon: '❤️'
  },
  {
    id: 'neurology',
    name: 'Neurology',
    description: 'Brain and nervous system specialists',
    icon: '🧠'
  },
  {
    id: 'orthopedics',
    name: 'Orthopedics',
    description: 'Bone, joint, and muscle specialists',
    icon: '🦴'
  },
  {
    id: 'family-medicine',
    name: 'Family Medicine',
    description: 'Comprehensive family healthcare',
    icon: '👨‍👩‍👧‍👦'
  },
  {
    id: 'pediatrics',
    name: 'Pediatrics',
    description: 'Children\'s healthcare and medicine',
    icon: '👶'
  },
  {
    id: 'urgent-care',
    name: 'Urgent Care',
    description: 'Walk-in medical care and treatment',
    icon: '🏥'
  }
];
