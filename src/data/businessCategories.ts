
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
    id: 'travel',
    name: 'Travel & Hospitality',
    description: 'Hotels, travel agencies, and tourism services',
    icon: '✈️',
    subcategories: [
      'Hotels & Lodging',
      'Travel Agencies',
      'Tour Operators',
      'Vacation Rentals',
      'Transportation',
      'Travel Planning',
      'Event Venues',
      'Wedding Venues'
    ]
  },
  {
    id: 'pet',
    name: 'Pet Services',
    description: 'Veterinary care, grooming, and pet supplies',
    icon: '🐕',
    subcategories: [
      'Veterinary Services',
      'Pet Grooming',
      'Pet Supplies',
      'Pet Training',
      'Pet Boarding',
      'Pet Photography',
      'Pet Walking',
      'Animal Rescue'
    ]
  },
  {
    id: 'legal',
    name: 'Legal Services',
    description: 'Law firms, attorneys, and legal consultation',
    icon: '⚖️',
    subcategories: [
      'Personal Injury',
      'Family Law',
      'Criminal Defense',
      'Business Law',
      'Real Estate Law',
      'Immigration Law',
      'Estate Planning',
      'Employment Law'
    ]
  },
  {
    id: 'media',
    name: 'Media & Communications',
    description: 'Broadcasting, publishing, and media production',
    icon: '📺',
    subcategories: [
      'Radio Stations',
      'TV Production',
      'Publishing',
      'Podcasting',
      'Social Media',
      'Public Relations',
      'Advertising',
      'Content Creation'
    ]
  },
  {
    id: 'agriculture',
    name: 'Agriculture & Farming',
    description: 'Farms, agricultural services, and rural businesses',
    icon: '🌾',
    subcategories: [
      'Crop Farming',
      'Livestock',
      'Organic Farming',
      'Agricultural Equipment',
      'Farm Supplies',
      'Agricultural Consulting',
      'Beekeeping',
      'Aquaculture'
    ]
  },
  {
    id: 'manufacturing',
    name: 'Manufacturing & Industrial',
    description: 'Manufacturing, warehousing, and industrial services',
    icon: '🏭',
    subcategories: [
      'Food Processing',
      'Textile Manufacturing',
      'Metal Fabrication',
      'Packaging',
      'Industrial Equipment',
      'Warehousing',
      'Quality Control',
      'Supply Chain'
    ]
  },
  {
    id: 'transportation',
    name: 'Transportation & Logistics',
    description: 'Shipping, delivery, and transportation services',
    icon: '🚛',
    subcategories: [
      'Trucking',
      'Delivery Services',
      'Logistics',
      'Moving Companies',
      'Courier Services',
      'Freight',
      'Taxi & Rideshare',
      'Public Transit'
    ]
  },
  {
    id: 'energy',
    name: 'Energy & Environment',
    description: 'Renewable energy, environmental services, and utilities',
    icon: '🔋',
    subcategories: [
      'Solar Energy',
      'Wind Energy',
      'Environmental Consulting',
      'Waste Management',
      'Recycling',
      'Energy Efficiency',
      'Utilities',
      'Green Technology'
    ]
  },
  {
    id: 'childcare',
    name: 'Childcare & Family',
    description: 'Daycare, family services, and child-focused businesses',
    icon: '👶',
    subcategories: [
      'Daycare Centers',
      'Preschools',
      'After School Programs',
      'Summer Camps',
      'Babysitting',
      'Family Counseling',
      'Children\'s Activities',
      'Parenting Classes'
    ]
  },
  {
    id: 'senior',
    name: 'Senior Services',
    description: 'Elder care, senior living, and age-focused services',
    icon: '👴',
    subcategories: [
      'Senior Living',
      'Home Healthcare',
      'Adult Day Care',
      'Senior Activities',
      'Elder Law',
      'Medicare Services',
      'Assisted Living',
      'Senior Transportation'
    ]
  },
  {
    id: 'security',
    name: 'Security Services',
    description: 'Security systems, protection, and safety services',
    icon: '🛡️',
    subcategories: [
      'Security Systems',
      'Private Security',
      'Cybersecurity',
      'Surveillance',
      'Alarm Systems',
      'Background Checks',
      'Safety Consulting',
      'Emergency Services'
    ]
  },
  {
    id: 'craft',
    name: 'Arts & Crafts',
    description: 'Handmade goods, artisan services, and creative workshops',
    icon: '🎨',
    subcategories: [
      'Handmade Jewelry',
      'Pottery',
      'Woodworking',
      'Textiles',
      'Custom Art',
      'Craft Supplies',
      'Art Classes',
      'Custom Design'
    ]
  },
  {
    id: 'spiritual',
    name: 'Spiritual & Religious',
    description: 'Churches, spiritual services, and religious organizations',
    icon: '⛪',
    subcategories: [
      'Churches',
      'Spiritual Coaching',
      'Religious Education',
      'Wedding Ceremonies',
      'Funeral Services',
      'Religious Supplies',
      'Meditation Centers',
      'Faith-Based Counseling'
    ]
  },
  {
    id: 'events',
    name: 'Event Planning & Services',
    description: 'Event coordination, party supplies, and celebration services',
    icon: '🎉',
    subcategories: [
      'Wedding Planning',
      'Party Planning',
      'Corporate Events',
      'Catering Services',
      'Event Venues',
      'DJ Services',
      'Photography',
      'Decoration Services'
    ]
  },
  {
    id: 'sports',
    name: 'Sports & Athletics',
    description: 'Sports teams, coaching, and athletic services',
    icon: '⚽',
    subcategories: [
      'Sports Coaching',
      'Athletic Training',
      'Sports Equipment',
      'Sports Medicine',
      'Youth Sports',
      'Professional Teams',
      'Sports Facilities',
      'Sports Photography'
    ]
  },
  {
    id: 'other',
    name: 'Other Services',
    description: 'Miscellaneous and specialized services',
    icon: '🔧',
    subcategories: [
      'Specialty Services',
      'Consulting',
      'Custom Solutions',
      'Unique Offerings',
      'Specialized Equipment',
      'Niche Markets',
      'Innovation Services',
      'Emerging Industries'
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
