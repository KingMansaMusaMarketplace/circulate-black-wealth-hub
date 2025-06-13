
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
  // Additional 70+ categories to reach over 100
  {
    id: 'accounting',
    name: 'Accounting & Bookkeeping',
    description: 'Financial record keeping and tax preparation',
    icon: '📊'
  },
  {
    id: 'advertising',
    name: 'Advertising & Marketing',
    description: 'Promotional services and brand marketing',
    icon: '📢'
  },
  {
    id: 'air-conditioning',
    name: 'Air Conditioning & HVAC',
    description: 'Climate control and ventilation services',
    icon: '❄️'
  },
  {
    id: 'antiques',
    name: 'Antiques & Collectibles',
    description: 'Vintage items and collectible goods',
    icon: '🏺'
  },
  {
    id: 'appliances',
    name: 'Appliance Repair',
    description: 'Home and commercial appliance services',
    icon: '🔧'
  },
  {
    id: 'architecture',
    name: 'Architecture & Design',
    description: 'Building design and architectural services',
    icon: '🏗️'
  },
  {
    id: 'art-supplies',
    name: 'Art Supplies',
    description: 'Materials for artists and crafters',
    icon: '🖌️'
  },
  {
    id: 'astrology',
    name: 'Astrology & Psychic Services',
    description: 'Spiritual guidance and readings',
    icon: '🔮'
  },
  {
    id: 'auction',
    name: 'Auction Houses',
    description: 'Public sale and bidding services',
    icon: '🔨'
  },
  {
    id: 'bakery',
    name: 'Bakeries & Pastries',
    description: 'Fresh baked goods and desserts',
    icon: '🥖'
  },
  {
    id: 'barbershop',
    name: 'Barbershops',
    description: 'Men\'s grooming and hair services',
    icon: '💈'
  },
  {
    id: 'bicycle',
    name: 'Bicycle Shops',
    description: 'Bike sales, repair, and accessories',
    icon: '🚲'
  },
  {
    id: 'boat',
    name: 'Boat & Marine Services',
    description: 'Watercraft sales and maintenance',
    icon: '⛵'
  },
  {
    id: 'books',
    name: 'Bookstores',
    description: 'New and used book retailers',
    icon: '📚'
  },
  {
    id: 'bridal',
    name: 'Bridal Services',
    description: 'Wedding planning and bridal needs',
    icon: '👰'
  },
  {
    id: 'camera',
    name: 'Camera & Photography Equipment',
    description: 'Photo gear and camera services',
    icon: '📷'
  },
  {
    id: 'camping',
    name: 'Camping & Outdoor Gear',
    description: 'Equipment for outdoor adventures',
    icon: '⛺'
  },
  {
    id: 'candy',
    name: 'Candy & Sweets',
    description: 'Confectionery and sweet treats',
    icon: '🍭'
  },
  {
    id: 'carpet',
    name: 'Carpet & Flooring',
    description: 'Floor coverings and installation',
    icon: '🏠'
  },
  {
    id: 'catering',
    name: 'Catering Services',
    description: 'Food service for events',
    icon: '🍽️'
  },
  {
    id: 'chimney',
    name: 'Chimney Services',
    description: 'Cleaning and repair of chimneys',
    icon: '🏠'
  },
  {
    id: 'chiropractor',
    name: 'Chiropractic Care',
    description: 'Spinal and musculoskeletal treatment',
    icon: '🦴'
  },
  {
    id: 'cleaning',
    name: 'Cleaning Services',
    description: 'Residential and commercial cleaning',
    icon: '🧽'
  },
  {
    id: 'clock',
    name: 'Clock & Watch Repair',
    description: 'Timepiece maintenance and repair',
    icon: '⏰'
  },
  {
    id: 'clothing',
    name: 'Clothing Stores',
    description: 'Fashion and apparel retailers',
    icon: '👕'
  },
  {
    id: 'coffee',
    name: 'Coffee Shops',
    description: 'Cafes and coffee retailers',
    icon: '☕'
  },
  {
    id: 'computer',
    name: 'Computer Repair',
    description: 'Tech support and computer services',
    icon: '💻'
  },
  {
    id: 'construction',
    name: 'Construction Services',
    description: 'Building and renovation work',
    icon: '🏗️'
  },
  {
    id: 'cosmetics',
    name: 'Cosmetics & Beauty Products',
    description: 'Makeup and beauty supplies',
    icon: '💄'
  },
  {
    id: 'dance',
    name: 'Dance Studios',
    description: 'Dance instruction and performance',
    icon: '💃'
  },
  {
    id: 'daycare',
    name: 'Daycare Centers',
    description: 'Child care and early education',
    icon: '👶'
  },
  {
    id: 'dentist',
    name: 'Dental Services',
    description: 'Oral health and dental care',
    icon: '🦷'
  },
  {
    id: 'drycleaning',
    name: 'Dry Cleaning',
    description: 'Garment cleaning and pressing',
    icon: '👔'
  },
  {
    id: 'electrician',
    name: 'Electrical Services',
    description: 'Electrical installation and repair',
    icon: '⚡'
  },
  {
    id: 'electronics',
    name: 'Electronics Stores',
    description: 'Consumer electronics and gadgets',
    icon: '📱'
  },
  {
    id: 'emergency',
    name: 'Emergency Services',
    description: 'First aid and emergency response',
    icon: '🚨'
  },
  {
    id: 'employment',
    name: 'Employment Agencies',
    description: 'Job placement and recruiting',
    icon: '💼'
  },
  {
    id: 'eyecare',
    name: 'Eye Care & Optometry',
    description: 'Vision care and eyewear',
    icon: '👓'
  },
  {
    id: 'fabric',
    name: 'Fabric & Sewing Supplies',
    description: 'Materials for sewing and crafts',
    icon: '🧵'
  },
  {
    id: 'florist',
    name: 'Florists',
    description: 'Fresh flowers and arrangements',
    icon: '🌸'
  },
  {
    id: 'funeral',
    name: 'Funeral Services',
    description: 'Memorial and burial services',
    icon: '⚱️'
  },
  {
    id: 'furniture',
    name: 'Furniture Stores',
    description: 'Home and office furniture',
    icon: '🛋️'
  },
  {
    id: 'game',
    name: 'Game Stores',
    description: 'Video games and gaming accessories',
    icon: '🎮'
  },
  {
    id: 'gardening',
    name: 'Gardening & Landscaping',
    description: 'Outdoor design and plant care',
    icon: '🌱'
  },
  {
    id: 'gift',
    name: 'Gift Shops',
    description: 'Specialty gifts and souvenirs',
    icon: '🎁'
  },
  {
    id: 'glass',
    name: 'Glass & Window Services',
    description: 'Window installation and repair',
    icon: '🪟'
  },
  {
    id: 'golf',
    name: 'Golf Courses & Pro Shops',
    description: 'Golf facilities and equipment',
    icon: '⛳'
  },
  {
    id: 'hair',
    name: 'Hair Salons',
    description: 'Hair styling and treatments',
    icon: '💇'
  },
  {
    id: 'hardware',
    name: 'Hardware Stores',
    description: 'Tools and home improvement supplies',
    icon: '🔨'
  },
  {
    id: 'heating',
    name: 'Heating Services',
    description: 'Furnace and heating system care',
    icon: '🔥'
  },
  {
    id: 'hobby',
    name: 'Hobby Shops',
    description: 'Craft and hobby supplies',
    icon: '🎯'
  },
  {
    id: 'ice-cream',
    name: 'Ice Cream Shops',
    description: 'Frozen treats and desserts',
    icon: '🍦'
  },
  {
    id: 'internet',
    name: 'Internet Services',
    description: 'Web hosting and internet providers',
    icon: '🌐'
  },
  {
    id: 'jewelry',
    name: 'Jewelry Stores',
    description: 'Fine jewelry and accessories',
    icon: '💎'
  },
  {
    id: 'laundromat',
    name: 'Laundromats',
    description: 'Self-service laundry facilities',
    icon: '🧺'
  },
  {
    id: 'locksmith',
    name: 'Locksmith Services',
    description: 'Lock installation and security',
    icon: '🔐'
  },
  {
    id: 'massage',
    name: 'Massage Therapy',
    description: 'Therapeutic massage services',
    icon: '💆'
  },
  {
    id: 'mattress',
    name: 'Mattress Stores',
    description: 'Bedding and sleep products',
    icon: '🛏️'
  },
  {
    id: 'music',
    name: 'Music Stores',
    description: 'Instruments and music equipment',
    icon: '🎵'
  },
  {
    id: 'nails',
    name: 'Nail Salons',
    description: 'Manicure and pedicure services',
    icon: '💅'
  },
  {
    id: 'notary',
    name: 'Notary Services',
    description: 'Document certification and signing',
    icon: '📋'
  },
  {
    id: 'nursing',
    name: 'Nursing Services',
    description: 'Home health and nursing care',
    icon: '👩‍⚕️'
  },
  {
    id: 'optician',
    name: 'Optical Services',
    description: 'Eyeglasses and contact lenses',
    icon: '👓'
  },
  {
    id: 'paint',
    name: 'Paint & Wallpaper',
    description: 'Wall coverings and painting supplies',
    icon: '🎨'
  },
  {
    id: 'parking',
    name: 'Parking Services',
    description: 'Parking lots and garage management',
    icon: '🅿️'
  },
  {
    id: 'pharmacy',
    name: 'Pharmacies',
    description: 'Prescription and health products',
    icon: '💊'
  },
  {
    id: 'phone',
    name: 'Phone Repair',
    description: 'Mobile device repair services',
    icon: '📱'
  },
  {
    id: 'photography',
    name: 'Photography Studios',
    description: 'Professional photography services',
    icon: '📸'
  },
  {
    id: 'pizza',
    name: 'Pizza Restaurants',
    description: 'Pizza delivery and dining',
    icon: '🍕'
  },
  {
    id: 'plumbing',
    name: 'Plumbing Services',
    description: 'Pipe and water system repair',
    icon: '🔧'
  },
  {
    id: 'printing',
    name: 'Printing Services',
    description: 'Document and design printing',
    icon: '🖨️'
  },
  {
    id: 'radio',
    name: 'Radio Stations',
    description: 'Broadcasting and media services',
    icon: '📻'
  },
  {
    id: 'recycling',
    name: 'Recycling Centers',
    description: 'Waste processing and environmental services',
    icon: '♻️'
  },
  {
    id: 'roofing',
    name: 'Roofing Services',
    description: 'Roof installation and repair',
    icon: '🏠'
  },
  {
    id: 'shoe',
    name: 'Shoe Stores',
    description: 'Footwear and shoe repair',
    icon: '👟'
  },
  {
    id: 'spa',
    name: 'Spas & Wellness Centers',
    description: 'Relaxation and wellness services',
    icon: '🧘'
  },
  {
    id: 'storage',
    name: 'Storage Facilities',
    description: 'Self-storage and warehousing',
    icon: '📦'
  },
  {
    id: 'tailoring',
    name: 'Tailoring & Alterations',
    description: 'Clothing modification services',
    icon: '✂️'
  },
  {
    id: 'taxi',
    name: 'Taxi & Rideshare',
    description: 'Transportation and ride services',
    icon: '🚕'
  },
  {
    id: 'television',
    name: 'TV Repair',
    description: 'Electronics and appliance repair',
    icon: '📺'
  },
  {
    id: 'thrift',
    name: 'Thrift Stores',
    description: 'Second-hand and vintage items',
    icon: '👗'
  },
  {
    id: 'tire',
    name: 'Tire Services',
    description: 'Automotive tire sales and service',
    icon: '🛞'
  },
  {
    id: 'toy',
    name: 'Toy Stores',
    description: 'Children\'s toys and games',
    icon: '🧸'
  },
  {
    id: 'tree',
    name: 'Tree Services',
    description: 'Tree removal and landscaping',
    icon: '🌳'
  },
  {
    id: 'upholstery',
    name: 'Upholstery Services',
    description: 'Furniture restoration and repair',
    icon: '🛋️'
  },
  {
    id: 'veterinary',
    name: 'Veterinary Clinics',
    description: 'Animal health and pet care',
    icon: '🐾'
  },
  {
    id: 'video',
    name: 'Video Production',
    description: 'Film and video creation services',
    icon: '🎬'
  },
  {
    id: 'wine',
    name: 'Wine & Liquor Stores',
    description: 'Alcoholic beverages and spirits',
    icon: '🍷'
  },
  {
    id: 'yoga',
    name: 'Yoga Studios',
    description: 'Yoga instruction and wellness',
    icon: '🧘‍♀️'
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
