
import { BusinessCategory } from './types';

export const fitnessCategories: BusinessCategory[] = [
  {
    id: 'fitness',
    name: 'Fitness & Recreation',
    description: 'Gyms, sports facilities, and recreational activities',
    icon: '💪',
    subcategories: [
      'Gyms & Fitness Centers',
      'Yoga Studios',
      'Martial Arts',
      'Personal Training',
      'Sports Facilities',
      'Recreation Centers',
      'Swimming Pools',
      'Outdoor Activities'
    ]
  },
  {
    id: 'personal-trainers',
    name: 'Personal Trainers',
    description: 'Individual fitness coaching',
    icon: '💪'
  },
  {
    id: 'yoga',
    name: 'Yoga Studios',
    description: 'Yoga instruction and wellness',
    icon: '🧘‍♀️'
  },
  {
    id: 'martial-arts',
    name: 'Martial Arts Schools',
    description: 'Karate, judo, and self-defense training',
    icon: '🥋'
  },
  {
    id: 'swim-lessons',
    name: 'Swimming Lessons',
    description: 'Swimming instruction and water safety',
    icon: '🏊'
  },
  {
    id: 'golf-lessons',
    name: 'Golf Lessons',
    description: 'Golf instruction and coaching',
    icon: '⛳'
  }
];
