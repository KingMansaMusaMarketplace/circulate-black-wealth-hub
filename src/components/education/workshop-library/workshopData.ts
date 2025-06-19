
import { Workshop } from './WorkshopCard';

export const workshops: Workshop[] = [
  {
    id: '1',
    title: 'Building Your First Black-Owned Business',
    description: 'Learn the fundamentals of starting and scaling a successful Black-owned business, from ideation to execution.',
    instructor: 'Dr. Marcus Johnson',
    duration: '2 hours',
    level: 'Beginner',
    category: 'Business Fundamentals',
    date: '2024-07-01',
    time: '6:00 PM EST',
    attendees: 45,
    maxAttendees: 50,
    rating: 4.8,
    price: 29,
    isLive: true,
    hasRecording: true,
    tags: ['startup', 'business plan', 'funding']
  },
  {
    id: '2',
    title: 'Digital Marketing for Black Entrepreneurs',
    description: 'Master social media marketing, content creation, and online advertising specifically for Black-owned businesses.',
    instructor: 'Kenya Washington',
    duration: '1.5 hours',
    level: 'Intermediate',
    category: 'Marketing & Sales',
    date: '2024-07-03',
    time: '7:00 PM EST',
    attendees: 38,
    maxAttendees: 40,
    rating: 4.9,
    price: 39,
    isLive: false,
    hasRecording: true,
    tags: ['social media', 'branding', 'digital marketing']
  },
  {
    id: '3',
    title: 'Accessing Capital: Grants and Funding for Black Businesses',
    description: 'Navigate the funding landscape with focus on grants, loans, and investment opportunities for minority businesses.',
    instructor: 'Robert Davis',
    duration: '2.5 hours',
    level: 'Advanced',
    category: 'Finance & Funding',
    date: '2024-07-05',
    time: '5:30 PM EST',
    attendees: 32,
    maxAttendees: 35,
    rating: 4.7,
    price: 49,
    isLive: true,
    hasRecording: false,
    tags: ['funding', 'grants', 'investment', 'sba loans']
  },
  {
    id: '4',
    title: 'Building Generational Wealth Through Business',
    description: 'Learn strategies for creating lasting wealth that can be passed down through generations.',
    instructor: 'Dr. Angela Smith',
    duration: '3 hours',
    level: 'Advanced',
    category: 'Wealth Building',
    date: '2024-07-08',
    time: '6:00 PM EST',
    attendees: 28,
    maxAttendees: 30,
    rating: 4.9,
    price: 59,
    isLive: true,
    hasRecording: true,
    tags: ['wealth building', 'estate planning', 'succession']
  },
  {
    id: '5',
    title: 'Community-Centered Business Models',
    description: 'Explore how to build businesses that serve and strengthen Black communities while generating profit.',
    instructor: 'Michael Thompson',
    duration: '2 hours',
    level: 'Intermediate',
    category: 'Social Impact',
    date: '2024-07-10',
    time: '7:30 PM EST',
    attendees: 41,
    maxAttendees: 45,
    rating: 4.6,
    price: 35,
    isLive: false,
    hasRecording: true,
    tags: ['community impact', 'social enterprise', 'purpose-driven']
  }
];

export const categories = ['all', 'Business Fundamentals', 'Marketing & Sales', 'Finance & Funding', 'Wealth Building', 'Social Impact'];
export const levels = ['all', 'Beginner', 'Intermediate', 'Advanced'];
