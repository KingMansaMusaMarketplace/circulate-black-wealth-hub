
import { BusinessCategory } from './types';

export const educationCategories: BusinessCategory[] = [
  {
    id: 'education',
    name: 'Education & Training',
    description: 'Schools, tutoring, and educational services',
    icon: '📚',
    subcategories: [
      'Tutoring',
      'Music Lessons',
      'Dance Studios',
      'Language Learning',
      'Vocational Training',
      'Childcare',
      'Academic Coaching',
      'Test Preparation'
    ]
  },
  {
    id: 'tutoring-services',
    name: 'Tutoring Services',
    description: 'Academic tutoring and test prep',
    icon: '📚'
  },
  {
    id: 'music-lessons',
    name: 'Music Lessons',
    description: 'Private music instruction',
    icon: '🎵'
  },
  {
    id: 'driving-schools',
    name: 'Driving Schools',
    description: 'Driver education and training',
    icon: '🚗'
  },
  {
    id: 'language-schools',
    name: 'Language Schools',
    description: 'Foreign language instruction',
    icon: '🗣️'
  },
  {
    id: 'cooking-classes',
    name: 'Cooking Classes',
    description: 'Culinary instruction and food classes',
    icon: '👨‍🍳'
  },
  {
    id: 'art-classes',
    name: 'Art Classes',
    description: 'Drawing, painting, and art instruction',
    icon: '🎨'
  }
];
