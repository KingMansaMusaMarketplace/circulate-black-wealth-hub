
export interface BusinessCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  subcategories?: string[];
}

export const businessCategories: BusinessCategory[] = [
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
    id: 'professional',
    name: 'Professional Services',
    description: 'Legal, financial, consulting, and business services',
    icon: '💼',
    subcategories: [
      'Legal Services',
      'Accounting & Finance',
      'Real Estate',
      'Insurance',
      'Consulting',
      'Marketing & PR',
      'IT Services',
      'Business Coaching',
      'Event Planning'
    ]
  },
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
    id: 'nonprofit',
    name: 'Community & Nonprofit',
    description: 'Community organizations and nonprofit services',
    icon: '🤝',
    subcategories: [
      'Community Centers',
      'Religious Organizations',
      'Youth Programs',
      'Senior Services',
      'Advocacy Groups',
      'Educational Nonprofits',
      'Health Nonprofits',
      'Environmental Groups'
    ]
  },
  {
    id: 'technology',
    name: 'Technology',
    description: 'Tech companies, software development, and digital services',
    icon: '💻',
    subcategories: [
      'Software Development',
      'Web Design',
      'Mobile Apps',
      'IT Support',
      'Digital Marketing',
      'E-commerce',
      'Tech Consulting',
      'Cybersecurity'
    ]
  },
  {
    id: 'finance',
    name: 'Financial Services',
    description: 'Banking, investment, and financial planning',
    icon: '💰',
    subcategories: [
      'Banking',
      'Investment Services',
      'Financial Planning',
      'Tax Services',
      'Credit Counseling',
      'Mortgage Services',
      'Insurance',
      'Bookkeeping'
    ]
  }
];

export const getCategoryById = (id: string): BusinessCategory | undefined => {
  return businessCategories.find(category => category.id === id);
};

export const getCategoryOptions = () => {
  return businessCategories.map(category => ({
    value: category.id,
    label: category.name
  }));
};
