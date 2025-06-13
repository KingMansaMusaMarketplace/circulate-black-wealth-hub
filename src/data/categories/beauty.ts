
import { BusinessCategory } from './types';

export const beautyCategories: BusinessCategory[] = [
  {
    id: 'beauty',
    name: 'Beauty & Wellness',
    description: 'Salons, spas, barbershops, and wellness services',
    icon: '💄',
    subcategories: [
      'Hair Salons',
      'Barbershops',
      'Nail Salons',
      'Spas & Massage',
      'Skincare',
      'Makeup Artists',
      'Wellness Centers',
      'Fitness Studios',
      'Mental Health'
    ]
  },
  {
    id: 'hair',
    name: 'Hair Salons',
    description: 'Hair styling and treatments',
    icon: '💇'
  },
  {
    id: 'barbershop',
    name: 'Barbershops',
    description: 'Men\'s grooming and hair services',
    icon: '💈'
  },
  {
    id: 'nails',
    name: 'Nail Salons',
    description: 'Manicure and pedicure services',
    icon: '💅'
  },
  {
    id: 'spa',
    name: 'Spas & Wellness Centers',
    description: 'Relaxation and wellness services',
    icon: '🧘'
  },
  {
    id: 'massage',
    name: 'Massage Therapy',
    description: 'Therapeutic massage services',
    icon: '💆'
  },
  {
    id: 'cosmetics',
    name: 'Cosmetics & Beauty Products',
    description: 'Makeup and beauty supplies',
    icon: '💄'
  }
];
