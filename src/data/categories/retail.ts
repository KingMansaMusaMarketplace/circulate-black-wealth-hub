
import { BusinessCategory } from './types';

export const retailCategories: BusinessCategory[] = [
  {
    id: 'retail',
    name: 'Retail & Shopping',
    description: 'Clothing, accessories, home goods, and specialty retail',
    icon: '🛍️',
    subcategories: [
      'Clothing & Fashion',
      'Accessories & Jewelry',
      'Home & Garden',
      'Electronics',
      'Books & Media',
      'Gifts & Novelties',
      'Sports & Outdoor',
      'Baby & Kids',
      'Art & Crafts'
    ]
  },
  {
    id: 'clothing',
    name: 'Clothing Stores',
    description: 'Fashion and apparel retailers',
    icon: '👕'
  },
  {
    id: 'jewelry',
    name: 'Jewelry Stores',
    description: 'Fine jewelry and accessories',
    icon: '💎'
  },
  {
    id: 'electronics',
    name: 'Electronics Stores',
    description: 'Consumer electronics and gadgets',
    icon: '📱'
  },
  {
    id: 'books',
    name: 'Bookstores',
    description: 'New and used book retailers',
    icon: '📚'
  },
  {
    id: 'gift',
    name: 'Gift Shops',
    description: 'Specialty gifts and souvenirs',
    icon: '🎁'
  },
  {
    id: 'antiques',
    name: 'Antiques & Collectibles',
    description: 'Vintage items and collectible goods',
    icon: '🏺'
  },
  {
    id: 'thrift',
    name: 'Thrift Stores',
    description: 'Second-hand and vintage items',
    icon: '👗'
  }
];
