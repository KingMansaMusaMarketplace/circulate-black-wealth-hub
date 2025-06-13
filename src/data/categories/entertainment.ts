
import { BusinessCategory } from './types';

export const entertainmentCategories: BusinessCategory[] = [
  {
    id: 'entertainment',
    name: 'Entertainment & Arts',
    description: 'Entertainment venues, artists, and creative services',
    icon: '🎭',
    subcategories: [
      'Music Venues',
      'Art Galleries',
      'Photography',
      'Video Production',
      'DJ Services',
      'Entertainment Centers',
      'Museums',
      'Theaters',
      'Creative Studios'
    ]
  },
  {
    id: 'photography',
    name: 'Photography Studios',
    description: 'Professional photography services',
    icon: '📸'
  },
  {
    id: 'video',
    name: 'Video Production',
    description: 'Film and video creation services',
    icon: '🎬'
  },
  {
    id: 'music',
    name: 'Music Stores',
    description: 'Instruments and music equipment',
    icon: '🎵'
  },
  {
    id: 'dance',
    name: 'Dance Studios',
    description: 'Dance instruction and performance',
    icon: '💃'
  }
];
