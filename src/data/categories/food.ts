
import { BusinessCategory } from './types';

export const foodCategories: BusinessCategory[] = [
  {
    id: 'restaurant',
    name: 'Restaurants & Food',
    description: 'Dining, catering, food trucks, and culinary services',
    icon: '🍽️',
    subcategories: [
      'Fine Dining',
      'Casual Dining',
      'Fast Food',
      'Food Trucks',
      'Catering',
      'Bakeries',
      'Coffee Shops',
      'Bars & Nightlife',
      'Specialty Foods'
    ]
  },
  {
    id: 'grocery',
    name: 'Grocery & Markets',
    description: 'Supermarkets, specialty foods, and farmers markets',
    icon: '🛒',
    subcategories: [
      'Supermarkets',
      'Organic Foods',
      'Specialty Grocers',
      'Farmers Markets',
      'Butcher Shops',
      'Seafood Markets',
      'International Foods',
      'Health Foods'
    ]
  },
  {
    id: 'bakery',
    name: 'Bakeries & Pastries',
    description: 'Fresh baked goods and desserts',
    icon: '🥖'
  },
  {
    id: 'coffee',
    name: 'Coffee Shops',
    description: 'Cafes and coffee retailers',
    icon: '☕'
  },
  {
    id: 'pizza',
    name: 'Pizza Restaurants',
    description: 'Pizza delivery and dining',
    icon: '🍕'
  },
  {
    id: 'ice-cream',
    name: 'Ice Cream Shops',
    description: 'Frozen treats and desserts',
    icon: '🍦'
  },
  {
    id: 'catering',
    name: 'Catering Services',
    description: 'Food service for events',
    icon: '🍽️'
  },
  {
    id: 'food-truck',
    name: 'Food Trucks',
    description: 'Mobile food vendors',
    icon: '🚚'
  },
  {
    id: 'bar',
    name: 'Bars & Lounges',
    description: 'Nightlife and beverage service',
    icon: '🍹'
  },
  {
    id: 'brewery',
    name: 'Breweries & Distilleries',
    description: 'Craft beer and spirits',
    icon: '🍺'
  },
  {
    id: 'juice-bar',
    name: 'Juice & Smoothie Bars',
    description: 'Fresh juices and healthy drinks',
    icon: '🥤'
  },
  {
    id: 'meal-prep',
    name: 'Meal Prep Services',
    description: 'Pre-made healthy meal delivery',
    icon: '🥗'
  },
  {
    id: 'vegan',
    name: 'Vegan & Vegetarian',
    description: 'Plant-based dining options',
    icon: '🥬'
  },
  {
    id: 'soul-food',
    name: 'Soul Food',
    description: 'Traditional Southern and African American cuisine',
    icon: '🍗'
  },
  {
    id: 'caribbean',
    name: 'Caribbean Cuisine',
    description: 'Caribbean and island foods',
    icon: '🌴'
  },
  {
    id: 'african',
    name: 'African Cuisine',
    description: 'Traditional African dishes',
    icon: '🌍'
  }
];
