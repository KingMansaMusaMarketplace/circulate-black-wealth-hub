
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
  // 100 NEW CATEGORIES START HERE
  {
    id: 'acupuncture',
    name: 'Acupuncture & Traditional Medicine',
    description: 'Alternative healing and traditional treatments',
    icon: '🌿'
  },
  {
    id: 'addiction-counseling',
    name: 'Addiction Counseling',
    description: 'Substance abuse and addiction recovery services',
    icon: '🫶'
  },
  {
    id: 'aerial-photography',
    name: 'Aerial Photography & Drone Services',
    description: 'Drone photography and videography',
    icon: '🚁'
  },
  {
    id: 'aircraft',
    name: 'Aircraft Services',
    description: 'Aviation maintenance and services',
    icon: '✈️'
  },
  {
    id: 'alpaca-farming',
    name: 'Alpaca & Llama Farming',
    description: 'Specialty livestock and fiber production',
    icon: '🦙'
  },
  {
    id: 'ambulance',
    name: 'Ambulance & Medical Transport',
    description: 'Emergency medical transportation',
    icon: '🚑'
  },
  {
    id: 'animation',
    name: 'Animation & Motion Graphics',
    description: 'Digital animation and motion design',
    icon: '🎬'
  },
  {
    id: 'apparel-manufacturing',
    name: 'Apparel Manufacturing',
    description: 'Clothing production and manufacturing',
    icon: '👗'
  },
  {
    id: 'appliance-manufacturing',
    name: 'Appliance Manufacturing',
    description: 'Home and commercial appliance production',
    icon: '🏭'
  },
  {
    id: 'aquarium',
    name: 'Aquarium Services',
    description: 'Fish tank maintenance and aquatic supplies',
    icon: '🐠'
  },
  {
    id: 'aromatherapy',
    name: 'Aromatherapy & Essential Oils',
    description: 'Natural wellness and therapeutic oils',
    icon: '🌸'
  },
  {
    id: 'artificial-intelligence',
    name: 'Artificial Intelligence Services',
    description: 'AI development and consulting',
    icon: '🤖'
  },
  {
    id: 'asbestos-removal',
    name: 'Asbestos Removal',
    description: 'Hazardous material removal services',
    icon: '⚠️'
  },
  {
    id: 'auto-glass',
    name: 'Auto Glass Repair',
    description: 'Windshield and auto window services',
    icon: '🚗'
  },
  {
    id: 'auto-insurance',
    name: 'Auto Insurance',
    description: 'Vehicle insurance and claims services',
    icon: '🛡️'
  },
  {
    id: 'auto-racing',
    name: 'Auto Racing & Motorsports',
    description: 'Racing events and motorsport services',
    icon: '🏎️'
  },
  {
    id: 'banquet-halls',
    name: 'Banquet Halls & Event Venues',
    description: 'Large event and celebration venues',
    icon: '🏛️'
  },
  {
    id: 'bartending',
    name: 'Bartending Services',
    description: 'Professional bartending and mixology',
    icon: '🍸'
  },
  {
    id: 'beekeeping',
    name: 'Beekeeping & Honey Production',
    description: 'Bee farming and honey products',
    icon: '🐝'
  },
  {
    id: 'bicycle-manufacturing',
    name: 'Bicycle Manufacturing',
    description: 'Bike production and custom builds',
    icon: '🚲'
  },
  {
    id: 'biotech',
    name: 'Biotechnology',
    description: 'Biological technology and research',
    icon: '🧬'
  },
  {
    id: 'blacksmithing',
    name: 'Blacksmithing & Metalworking',
    description: 'Traditional metalcraft and forging',
    icon: '🔨'
  },
  {
    id: 'blockchain',
    name: 'Blockchain & Cryptocurrency',
    description: 'Digital currency and blockchain services',
    icon: '₿'
  },
  {
    id: 'boarding-schools',
    name: 'Boarding Schools',
    description: 'Residential educational institutions',
    icon: '🏫'
  },
  {
    id: 'boat-manufacturing',
    name: 'Boat Manufacturing',
    description: 'Watercraft construction and design',
    icon: '⛵'
  },
  {
    id: 'botanical-gardens',
    name: 'Botanical Gardens & Arboretums',
    description: 'Plant conservation and education',
    icon: '🌺'
  },
  {
    id: 'bowling',
    name: 'Bowling Alleys',
    description: 'Bowling entertainment and leagues',
    icon: '🎳'
  },
  {
    id: 'brewing',
    name: 'Brewing & Distilleries',
    description: 'Craft beer and spirit production',
    icon: '🍺'
  },
  {
    id: 'broadcast-equipment',
    name: 'Broadcast Equipment',
    description: 'Radio and TV equipment sales and service',
    icon: '📡'
  },
  {
    id: 'building-materials',
    name: 'Building Materials Supply',
    description: 'Construction and building supplies',
    icon: '🧱'
  },
  {
    id: 'business-coaching',
    name: 'Business Coaching & Mentoring',
    description: 'Professional development and business guidance',
    icon: '📈'
  },
  {
    id: 'call-centers',
    name: 'Call Centers',
    description: 'Customer service and telemarketing',
    icon: '☎️'
  },
  {
    id: 'candle-making',
    name: 'Candle Making',
    description: 'Handcrafted candles and wax products',
    icon: '🕯️'
  },
  {
    id: 'cannabis',
    name: 'Cannabis & Hemp Products',
    description: 'Legal cannabis and CBD products',
    icon: '🌿'
  },
  {
    id: 'carnival-rides',
    name: 'Carnival & Amusement Rides',
    description: 'Mobile entertainment and rides',
    icon: '🎠'
  },
  {
    id: 'carpentry',
    name: 'Carpentry & Woodworking',
    description: 'Custom wood construction and furniture',
    icon: '🪵'
  },
  {
    id: 'cart-rental',
    name: 'Cart & Equipment Rental',
    description: 'Event and construction equipment rental',
    icon: '🛒'
  },
  {
    id: 'casting-agencies',
    name: 'Casting Agencies',
    description: 'Talent casting and entertainment booking',
    icon: '🎭'
  },
  {
    id: 'cell-tower',
    name: 'Cell Tower Services',
    description: 'Telecommunications infrastructure',
    icon: '📶'
  },
  {
    id: 'cemetery',
    name: 'Cemetery & Memorial Services',
    description: 'Burial grounds and memorial care',
    icon: '⚱️'
  },
  {
    id: 'cheese-making',
    name: 'Cheese Making & Dairy',
    description: 'Artisan dairy and cheese production',
    icon: '🧀'
  },
  {
    id: 'chemical-manufacturing',
    name: 'Chemical Manufacturing',
    description: 'Industrial chemical production',
    icon: '⚗️'
  },
  {
    id: 'chocolate-making',
    name: 'Chocolate Making',
    description: 'Artisan chocolate and confectionery',
    icon: '🍫'
  },
  {
    id: 'circus',
    name: 'Circus & Performance Arts',
    description: 'Acrobatic and circus entertainment',
    icon: '🎪'
  },
  {
    id: 'cloud-computing',
    name: 'Cloud Computing Services',
    description: 'Cloud infrastructure and services',
    icon: '☁️'
  },
  {
    id: 'coin-laundry',
    name: 'Coin-Operated Laundry',
    description: 'Self-service laundry facilities',
    icon: '🪙'
  },
  {
    id: 'collectibles',
    name: 'Collectibles & Memorabilia',
    description: 'Rare items and collectible trading',
    icon: '🏆'
  },
  {
    id: 'comedy-clubs',
    name: 'Comedy Clubs',
    description: 'Stand-up comedy and entertainment venues',
    icon: '😂'
  },
  {
    id: 'commercial-fishing',
    name: 'Commercial Fishing',
    description: 'Professional fishing and seafood',
    icon: '🎣'
  },
  {
    id: 'composite-manufacturing',
    name: 'Composite Manufacturing',
    description: 'Advanced materials and composites',
    icon: '🧪'
  },
  {
    id: 'concrete',
    name: 'Concrete Services',
    description: 'Concrete pouring and finishing',
    icon: '🏗️'
  },
  {
    id: 'consulting-engineering',
    name: 'Consulting Engineering',
    description: 'Technical engineering consultation',
    icon: '⚙️'
  },
  {
    id: 'costume-design',
    name: 'Costume Design & Rental',
    description: 'Theatrical and event costumes',
    icon: '🎭'
  },
  {
    id: 'court-reporting',
    name: 'Court Reporting',
    description: 'Legal transcription and stenography',
    icon: '⚖️'
  },
  {
    id: 'credit-repair',
    name: 'Credit Repair Services',
    description: 'Credit score improvement and counseling',
    icon: '📊'
  },
  {
    id: 'cremation',
    name: 'Cremation Services',
    description: 'Cremation and memorial services',
    icon: '🕊️'
  },
  {
    id: 'cruise-services',
    name: 'Cruise Services',
    description: 'Cruise planning and maritime tourism',
    icon: '🚢'
  },
  {
    id: 'custom-software',
    name: 'Custom Software Development',
    description: 'Bespoke software solutions',
    icon: '💻'
  },
  {
    id: 'data-analytics',
    name: 'Data Analytics',
    description: 'Business intelligence and data analysis',
    icon: '📈'
  },
  {
    id: 'data-recovery',
    name: 'Data Recovery Services',
    description: 'Digital data restoration and backup',
    icon: '💾'
  },
  {
    id: 'debt-collection',
    name: 'Debt Collection',
    description: 'Financial debt recovery services',
    icon: '💰'
  },
  {
    id: 'demolition',
    name: 'Demolition Services',
    description: 'Building demolition and site clearing',
    icon: '🏗️'
  },
  {
    id: 'detective',
    name: 'Detective & Investigation Services',
    description: 'Private investigation and security',
    icon: '🔍'
  },
  {
    id: 'dialysis',
    name: 'Dialysis Centers',
    description: 'Kidney treatment and dialysis services',
    icon: '🏥'
  },
  {
    id: 'digital-forensics',
    name: 'Digital Forensics',
    description: 'Cyber investigation and data analysis',
    icon: '🔬'
  },
  {
    id: 'disaster-recovery',
    name: 'Disaster Recovery Services',
    description: 'Emergency cleanup and restoration',
    icon: '🚨'
  },
  {
    id: 'disc-jockey',
    name: 'Disc Jockey Services',
    description: 'Professional DJ and music services',
    icon: '🎧'
  },
  {
    id: 'distilling',
    name: 'Distilling & Spirits',
    description: 'Alcoholic beverage production',
    icon: '🥃'
  },
  {
    id: 'doll-making',
    name: 'Doll Making & Toy Crafting',
    description: 'Handcrafted dolls and custom toys',
    icon: '🪆'
  },
  {
    id: 'drone-manufacturing',
    name: 'Drone Manufacturing',
    description: 'Unmanned aerial vehicle production',
    icon: '🚁'
  },
  {
    id: 'ebook-publishing',
    name: 'E-book Publishing',
    description: 'Digital book publishing and distribution',
    icon: '📚'
  },
  {
    id: 'economic-development',
    name: 'Economic Development',
    description: 'Community and regional development',
    icon: '🏙️'
  },
  {
    id: 'elderly-transportation',
    name: 'Elderly Transportation',
    description: 'Senior citizen transportation services',
    icon: '🚐'
  },
  {
    id: 'elevator-services',
    name: 'Elevator Services',
    description: 'Elevator installation and maintenance',
    icon: '🛗'
  },
  {
    id: 'embroidery',
    name: 'Embroidery & Monogramming',
    description: 'Custom embroidery and textile decoration',
    icon: '🧵'
  },
  {
    id: 'energy-auditing',
    name: 'Energy Auditing',
    description: 'Energy efficiency assessment and consulting',
    icon: '🔋'
  },
  {
    id: 'engraving',
    name: 'Engraving Services',
    description: 'Custom engraving and personalization',
    icon: '🪪'
  },
  {
    id: 'equipment-leasing',
    name: 'Equipment Leasing',
    description: 'Industrial and commercial equipment rental',
    icon: '🏗️'
  },
  {
    id: 'escape-rooms',
    name: 'Escape Rooms',
    description: 'Interactive puzzle and adventure games',
    icon: '🗝️'
  },
  {
    id: 'estate-sales',
    name: 'Estate Sales',
    description: 'Estate liquidation and auction services',
    icon: '🏠'
  },
  {
    id: 'ethical-hacking',
    name: 'Ethical Hacking & Penetration Testing',
    description: 'Cybersecurity testing and assessment',
    icon: '🛡️'
  },
  {
    id: 'event-security',
    name: 'Event Security Services',
    description: 'Security for events and gatherings',
    icon: '👮'
  },
  {
    id: 'exotic-pets',
    name: 'Exotic Pet Services',
    description: 'Specialized care for exotic animals',
    icon: '🦎'
  },
  {
    id: 'explosives',
    name: 'Explosives & Demolition',
    description: 'Controlled demolition and blasting',
    icon: '💥'
  },
  {
    id: 'fashion-design',
    name: 'Fashion Design',
    description: 'Custom fashion and clothing design',
    icon: '👗'
  },
  {
    id: 'fiber-optics',
    name: 'Fiber Optic Services',
    description: 'High-speed internet infrastructure',
    icon: '🌐'
  },
  {
    id: 'film-editing',
    name: 'Film Editing & Post-Production',
    description: 'Video editing and film production',
    icon: '🎬'
  },
  {
    id: 'fire-protection',
    name: 'Fire Protection Services',
    description: 'Fire safety systems and prevention',
    icon: '🚒'
  },
  {
    id: 'fireworks',
    name: 'Fireworks & Pyrotechnics',
    description: 'Professional fireworks displays',
    icon: '🎆'
  },
  {
    id: 'flight-training',
    name: 'Flight Training Schools',
    description: 'Pilot education and aviation training',
    icon: '✈️'
  },
  {
    id: 'food-testing',
    name: 'Food Testing & Safety',
    description: 'Food quality assurance and testing',
    icon: '🔬'
  },
  {
    id: 'forensic-accounting',
    name: 'Forensic Accounting',
    description: 'Financial investigation and fraud detection',
    icon: '🔍'
  },
  {
    id: 'franchise-consulting',
    name: 'Franchise Consulting',
    description: 'Franchise development and consulting',
    icon: '🏢'
  },
  {
    id: 'freight-brokerage',
    name: 'Freight Brokerage',
    description: 'Transportation logistics and coordination',
    icon: '🚛'
  },
  {
    id: 'genetic-testing',
    name: 'Genetic Testing Services',
    description: 'DNA analysis and genetic counseling',
    icon: '🧬'
  },
  {
    id: 'geothermal',
    name: 'Geothermal Energy Services',
    description: 'Renewable geothermal energy systems',
    icon: '🌋'
  },
  {
    id: 'glass-blowing',
    name: 'Glass Blowing & Art Glass',
    description: 'Artistic glass creation and custom work',
    icon: '🫧'
  },
  {
    id: 'greenhouse',
    name: 'Greenhouse & Nursery Services',
    description: 'Plant cultivation and horticultural services',
    icon: '🌱'
  },
  {
    id: 'hazmat',
    name: 'Hazardous Material Handling',
    description: 'Dangerous goods transportation and disposal',
    icon: '☢️'
  },
  {
    id: 'helicopter-services',
    name: 'Helicopter Services',
    description: 'Helicopter transport and aerial services',
    icon: '🚁'
  },
  {
    id: 'holistic-medicine',
    name: 'Holistic Medicine',
    description: 'Alternative and integrative healthcare',
    icon: '🌿'
  },
  {
    id: 'home-brewing',
    name: 'Home Brewing Supplies',
    description: 'Beer and wine making equipment',
    icon: '🍺'
  },
  {
    id: 'horse-boarding',
    name: 'Horse Boarding & Stables',
    description: 'Equestrian facilities and horse care',
    icon: '🐎'
  },
  {
    id: 'hypnotherapy',
    name: 'Hypnotherapy Services',
    description: 'Therapeutic hypnosis and counseling',
    icon: '🌀'
  },
  {
    id: 'immigration-services',
    name: 'Immigration Services',
    description: 'Immigration assistance and documentation',
    icon: '🛂'
  },
  {
    id: 'industrial-design',
    name: 'Industrial Design',
    description: 'Product design and development',
    icon: '📐'
  },
  {
    id: 'infusion-centers',
    name: 'Infusion Centers',
    description: 'Medical infusion and IV therapy',
    icon: '💉'
  },
  {
    id: 'invention-services',
    name: 'Invention & Patent Services',
    description: 'Innovation development and patent assistance',
    icon: '💡'
  },
  {
    id: 'karaoke',
    name: 'Karaoke Services',
    description: 'Karaoke entertainment and equipment rental',
    icon: '🎤'
  },
  {
    id: 'laser-services',
    name: 'Laser Services',
    description: 'Laser cutting, engraving, and medical services',
    icon: '⚡'
  },
  {
    id: 'leather-working',
    name: 'Leather Working',
    description: 'Custom leather goods and repair',
    icon: '🧳'
  },
  {
    id: 'lighting-design',
    name: 'Lighting Design',
    description: 'Architectural and event lighting',
    icon: '💡'
  },
  {
    id: 'marine-biology',
    name: 'Marine Biology Services',
    description: 'Ocean research and aquatic consulting',
    icon: '🐋'
  },
  {
    id: 'medical-devices',
    name: 'Medical Device Manufacturing',
    description: 'Healthcare equipment production',
    icon: '🏥'
  },
  {
    id: 'meteorology',
    name: 'Meteorology Services',
    description: 'Weather forecasting and climate analysis',
    icon: '🌤️'
  },
  {
    id: 'midwifery',
    name: 'Midwifery Services',
    description: 'Birth assistance and prenatal care',
    icon: '👶'
  },
  {
    id: 'mobile-app-development',
    name: 'Mobile App Development',
    description: 'Smartphone and tablet application development',
    icon: '📱'
  },
  {
    id: 'model-making',
    name: 'Model Making & Miniatures',
    description: 'Scale models and miniature crafting',
    icon: '🏠'
  },
  {
    id: 'mystery-shopping',
    name: 'Mystery Shopping Services',
    description: 'Retail evaluation and customer experience testing',
    icon: '🕵️'
  },
  {
    id: 'nanotechnology',
    name: 'Nanotechnology Services',
    description: 'Microscale technology and materials',
    icon: '⚛️'
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
  },
  // NEW CATEGORIES START HERE
  {
    id: 'attorneys-general',
    name: 'Attorneys & General Law',
    description: 'General practice attorneys and legal consultation',
    icon: '⚖️'
  },
  {
    id: 'personal-injury-lawyers',
    name: 'Personal Injury Lawyers',
    description: 'Attorneys specializing in personal injury cases',
    icon: '🩹'
  },
  {
    id: 'criminal-defense-attorneys',
    name: 'Criminal Defense Attorneys',
    description: 'Legal defense for criminal cases',
    icon: '🛡️'
  },
  {
    id: 'family-lawyers',
    name: 'Family Lawyers',
    description: 'Divorce, custody, and family law attorneys',
    icon: '👨‍👩‍👧‍👦'
  },
  {
    id: 'business-attorneys',
    name: 'Business Attorneys',
    description: 'Corporate and business law specialists',
    icon: '🏢'
  },
  {
    id: 'estate-planning-lawyers',
    name: 'Estate Planning Lawyers',
    description: 'Wills, trusts, and estate planning attorneys',
    icon: '📜'
  },
  {
    id: 'immigration-attorneys',
    name: 'Immigration Attorneys',
    description: 'Immigration and citizenship legal services',
    icon: '🌍'
  },
  {
    id: 'tax-attorneys',
    name: 'Tax Attorneys',
    description: 'Tax law and IRS representation',
    icon: '📊'
  },
  {
    id: 'employment-lawyers',
    name: 'Employment Lawyers',
    description: 'Workplace rights and employment law',
    icon: '💼'
  },
  {
    id: 'real-estate-attorneys',
    name: 'Real Estate Attorneys',
    description: 'Property law and real estate transactions',
    icon: '🏠'
  },
  {
    id: 'bankruptcy-lawyers',
    name: 'Bankruptcy Lawyers',
    description: 'Debt relief and bankruptcy proceedings',
    icon: '💸'
  },
  {
    id: 'intellectual-property-lawyers',
    name: 'Intellectual Property Lawyers',
    description: 'Patents, trademarks, and IP protection',
    icon: '💡'
  },
  {
    id: 'general-dentistry',
    name: 'General Dentistry',
    description: 'Comprehensive dental care and checkups',
    icon: '🦷'
  },
  {
    id: 'pediatric-dentistry',
    name: 'Pediatric Dentistry',
    description: 'Dental care for children and teens',
    icon: '👶'
  },
  {
    id: 'orthodontics',
    name: 'Orthodontics',
    description: 'Braces, aligners, and teeth straightening',
    icon: '😁'
  },
  {
    id: 'oral-surgery',
    name: 'Oral Surgery',
    description: 'Dental surgery and oral procedures',
    icon: '🔬'
  },
  {
    id: 'periodontics',
    name: 'Periodontics',
    description: 'Gum disease treatment and prevention',
    icon: '🦷'
  },
  {
    id: 'endodontics',
    name: 'Endodontics',
    description: 'Root canal therapy and tooth preservation',
    icon: '🩺'
  },
  {
    id: 'prosthodontics',
    name: 'Prosthodontics',
    description: 'Dental prosthetics and tooth replacement',
    icon: '🦷'
  },
  {
    id: 'cosmetic-dentistry',
    name: 'Cosmetic Dentistry',
    description: 'Teeth whitening and aesthetic dental work',
    icon: '✨'
  },
  {
    id: 'dental-implants',
    name: 'Dental Implants',
    description: 'Tooth implant surgery and restoration',
    icon: '🔧'
  },
  {
    id: 'emergency-dentistry',
    name: 'Emergency Dentistry',
    description: '24/7 dental emergency services',
    icon: '🚨'
  },
  {
    id: 'dentures-partials',
    name: 'Dentures & Partials',
    description: 'Full and partial denture services',
    icon: '🦷'
  },
  {
    id: 'sleep-dentistry',
    name: 'Sleep Dentistry',
    description: 'Sleep apnea and snoring treatment',
    icon: '😴'
  },
  {
    id: 'mobile-dentistry',
    name: 'Mobile Dentistry',
    description: 'In-home and mobile dental services',
    icon: '🚐'
  },
  {
    id: 'dental-hygienists',
    name: 'Dental Hygienists',
    description: 'Professional teeth cleaning services',
    icon: '🧽'
  },
  {
    id: 'podiatry',
    name: 'Podiatry',
    description: 'Foot and ankle medical care',
    icon: '🦶'
  },
  {
    id: 'dermatology',
    name: 'Dermatology',
    description: 'Skin care and dermatological treatment',
    icon: '🧴'
  },
  {
    id: 'cardiology',
    name: 'Cardiology',
    description: 'Heart and cardiovascular specialists',
    icon: '❤️'
  },
  {
    id: 'neurology',
    name: 'Neurology',
    description: 'Brain and nervous system specialists',
    icon: '🧠'
  },
  {
    id: 'orthopedics',
    name: 'Orthopedics',
    description: 'Bone, joint, and muscle specialists',
    icon: '🦴'
  },
  {
    id: 'gastroenterology',
    name: 'Gastroenterology',
    description: 'Digestive system specialists',
    icon: '🫄'
  },
  {
    id: 'oncology',
    name: 'Oncology',
    description: 'Cancer treatment and care',
    icon: '🎗️'
  },
  {
    id: 'psychiatry',
    name: 'Psychiatry',
    description: 'Mental health and psychiatric care',
    icon: '🧠'
  },
  {
    id: 'psychology',
    name: 'Psychology',
    description: 'Psychological counseling and therapy',
    icon: '💭'
  },
  {
    id: 'physical-therapy',
    name: 'Physical Therapy',
    description: 'Rehabilitation and physical treatment',
    icon: '🏃'
  },
  {
    id: 'occupational-therapy',
    name: 'Occupational Therapy',
    description: 'Daily living skills rehabilitation',
    icon: '🖐️'
  },
  {
    id: 'speech-therapy',
    name: 'Speech Therapy',
    description: 'Communication and speech improvement',
    icon: '🗣️'
  },
  {
    id: 'respiratory-therapy',
    name: 'Respiratory Therapy',
    description: 'Breathing and lung health treatment',
    icon: '🫁'
  },
  {
    id: 'radiology',
    name: 'Radiology',
    description: 'Medical imaging and diagnostic services',
    icon: '📷'
  },
  {
    id: 'laboratory-services',
    name: 'Laboratory Services',
    description: 'Medical testing and lab work',
    icon: '🔬'
  },
  {
    id: 'urgent-care',
    name: 'Urgent Care',
    description: 'Walk-in medical care and treatment',
    icon: '🏥'
  },
  {
    id: 'home-healthcare',
    name: 'Home Healthcare',
    description: 'In-home medical and nursing care',
    icon: '🏠'
  },
  {
    id: 'hospice-care',
    name: 'Hospice Care',
    description: 'End-of-life care and comfort services',
    icon: '🕊️'
  },
  {
    id: 'medical-equipment',
    name: 'Medical Equipment',
    description: 'Medical device sales and rental',
    icon: '🩺'
  },
  {
    id: 'hearing-aids',
    name: 'Hearing Aids',
    description: 'Hearing testing and hearing aid services',
    icon: '👂'
  },
  {
    id: 'vision-therapy',
    name: 'Vision Therapy',
    description: 'Eye exercises and vision improvement',
    icon: '👁️'
  },
  {
    id: 'contact-lenses',
    name: 'Contact Lenses',
    description: 'Contact lens fitting and supplies',
    icon: '👁️'
  },
  {
    id: 'mobile-apps',
    name: 'Mobile App Development',
    description: 'iOS and Android app development',
    icon: '📱'
  },
  {
    id: 'web-development',
    name: 'Web Development',
    description: 'Website design and development',
    icon: '💻'
  },
  {
    id: 'seo-services',
    name: 'SEO Services',
    description: 'Search engine optimization',
    icon: '🔍'
  },
  {
    id: 'social-media-marketing',
    name: 'Social Media Marketing',
    description: 'Social media management and advertising',
    icon: '📱'
  },
  {
    id: 'graphic-design',
    name: 'Graphic Design',
    description: 'Logo design and visual branding',
    icon: '🎨'
  },
  {
    id: 'copywriting',
    name: 'Copywriting',
    description: 'Content writing and marketing copy',
    icon: '✍️'
  },
  {
    id: 'translation-services',
    name: 'Translation Services',
    description: 'Document and language translation',
    icon: '🌐'
  },
  {
    id: 'interpreting',
    name: 'Interpreting Services',
    description: 'Live interpretation and sign language',
    icon: '🤟'
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
    id: 'tennis-lessons',
    name: 'Tennis Lessons',
    description: 'Tennis coaching and instruction',
    icon: '🎾'
  },
  {
    id: 'golf-lessons',
    name: 'Golf Lessons',
    description: 'Golf instruction and coaching',
    icon: '⛳'
  },
  {
    id: 'personal-trainers',
    name: 'Personal Trainers',
    description: 'Individual fitness coaching',
    icon: '💪'
  },
  {
    id: 'life-coaches',
    name: 'Life Coaches',
    description: 'Personal development and life coaching',
    icon: '🌟'
  },
  {
    id: 'career-counseling',
    name: 'Career Counseling',
    description: 'Career guidance and job placement',
    icon: '💼'
  },
  {
    id: 'marriage-counseling',
    name: 'Marriage Counseling',
    description: 'Couples therapy and relationship counseling',
    icon: '💑'
  },
  {
    id: 'family-counseling',
    name: 'Family Counseling',
    description: 'Family therapy and conflict resolution',
    icon: '👪'
  },
  {
    id: 'addiction-treatment',
    name: 'Addiction Treatment',
    description: 'Substance abuse treatment and recovery',
    icon: '🆘'
  },
  {
    id: 'grief-counseling',
    name: 'Grief Counseling',
    description: 'Bereavement support and grief therapy',
    icon: '💐'
  },
  {
    id: 'child-psychology',
    name: 'Child Psychology',
    description: 'Pediatric mental health services',
    icon: '🧸'
  },
  {
    id: 'teen-counseling',
    name: 'Teen Counseling',
    description: 'Adolescent therapy and support',
    icon: '👦'
  },
  {
    id: 'group-therapy',
    name: 'Group Therapy',
    description: 'Support groups and group counseling',
    icon: '👥'
  },
  {
    id: 'substance-abuse-counseling',
    name: 'Substance Abuse Counseling',
    description: 'Drug and alcohol counseling services',
    icon: '🚫'
  },
  {
    id: 'eating-disorder-treatment',
    name: 'Eating Disorder Treatment',
    description: 'Specialized eating disorder therapy',
    icon: '🍎'
  },
  {
    id: 'trauma-therapy',
    name: 'Trauma Therapy',
    description: 'PTSD and trauma recovery services',
    icon: '🛡️'
  },
  {
    id: 'adhd-treatment',
    name: 'ADHD Treatment',
    description: 'Attention deficit disorder therapy',
    icon: '🧩'
  },
  {
    id: 'autism-services',
    name: 'Autism Services',
    description: 'Autism spectrum disorder support',
    icon: '🌈'
  },
  {
    id: 'learning-disabilities',
    name: 'Learning Disabilities',
    description: 'Special education and learning support',
    icon: '📖'
  },
  {
    id: 'behavioral-therapy',
    name: 'Behavioral Therapy',
    description: 'Behavior modification and therapy',
    icon: '🔄'
  },
  {
    id: 'cognitive-therapy',
    name: 'Cognitive Therapy',
    description: 'Cognitive behavioral therapy services',
    icon: '🧠'
  },
  {
    id: 'anger-management',
    name: 'Anger Management',
    description: 'Anger control and stress management',
    icon: '😤'
  },
  {
    id: 'stress-management',
    name: 'Stress Management',
    description: 'Stress reduction and coping strategies',
    icon: '😌'
  },
  {
    id: 'mindfulness-coaching',
    name: 'Mindfulness Coaching',
    description: 'Meditation and mindfulness training',
    icon: '🧘'
  },
  {
    id: 'wellness-coaching',
    name: 'Wellness Coaching',
    description: 'Holistic health and wellness guidance',
    icon: '🌿'
  },
  {
    id: 'nutrition-counseling',
    name: 'Nutrition Counseling',
    description: 'Dietary planning and nutrition advice',
    icon: '🥗'
  },
  {
    id: 'weight-loss-coaching',
    name: 'Weight Loss Coaching',
    description: 'Weight management and fitness coaching',
    icon: '⚖️'
  },
  {
    id: 'diabetes-education',
    name: 'Diabetes Education',
    description: 'Diabetes management and education',
    icon: '🩸'
  },
  {
    id: 'smoking-cessation',
    name: 'Smoking Cessation',
    description: 'Quit smoking programs and support',
    icon: '🚭'
  },
  {
    id: 'sleep-disorders',
    name: 'Sleep Disorders',
    description: 'Sleep study and treatment services',
    icon: '😴'
  },
  {
    id: 'pain-management',
    name: 'Pain Management',
    description: 'Chronic pain treatment and therapy',
    icon: '🩹'
  },
  {
    id: 'allergy-testing',
    name: 'Allergy Testing',
    description: 'Allergy diagnosis and treatment',
    icon: '🤧'
  },
  {
    id: 'immunology',
    name: 'Immunology',
    description: 'Immune system disorders and treatment',
    icon: '🛡️'
  },
  {
    id: 'rheumatology',
    name: 'Rheumatology',
    description: 'Arthritis and joint disease treatment',
    icon: '🦴'
  },
  {
    id: 'pulmonology',
    name: 'Pulmonology',
    description: 'Lung and respiratory specialists',
    icon: '🫁'
  },
  {
    id: 'nephrology',
    name: 'Nephrology',
    description: 'Kidney disease and treatment',
    icon: '🩺'
  },
  {
    id: 'urology',
    name: 'Urology',
    description: 'Urinary system and male health',
    icon: '🩺'
  },
  {
    id: 'gynecology',
    name: 'Gynecology',
    description: 'Women\'s reproductive health',
    icon: '👩‍⚕️'
  },
  {
    id: 'obstetrics',
    name: 'Obstetrics',
    description: 'Pregnancy and childbirth care',
    icon: '🤱'
  },
  {
    id: 'fertility-services',
    name: 'Fertility Services',
    description: 'Reproductive health and fertility treatment',
    icon: '👶'
  },
  {
    id: 'mens-health',
    name: 'Men\'s Health',
    description: 'Specialized healthcare for men',
    icon: '👨‍⚕️'
  },
  {
    id: 'womens-health',
    name: 'Women\'s Health',
    description: 'Specialized healthcare for women',
    icon: '👩‍⚕️'
  },
  {
    id: 'pediatrics',
    name: 'Pediatrics',
    description: 'Children\'s healthcare and medicine',
    icon: '👶'
  },
  {
    id: 'geriatrics',
    name: 'Geriatrics',
    description: 'Healthcare for elderly patients',
    icon: '👴'
  },
  {
    id: 'family-medicine',
    name: 'Family Medicine',
    description: 'Comprehensive family healthcare',
    icon: '👨‍👩‍👧‍👦'
  },
  {
    id: 'internal-medicine',
    name: 'Internal Medicine',
    description: 'Adult internal medicine specialists',
    icon: '🩺'
  },
  {
    id: 'emergency-medicine',
    name: 'Emergency Medicine',
    description: 'Emergency room and trauma care',
    icon: '🚑'
  },
  {
    id: 'sports-medicine',
    name: 'Sports Medicine',
    description: 'Athletic injury treatment and prevention',
    icon: '🏃‍♂️'
  },
  {
    id: 'occupational-medicine',
    name: 'Occupational Medicine',
    description: 'Workplace health and safety',
    icon: '👷'
  },
  {
    id: 'travel-medicine',
    name: 'Travel Medicine',
    description: 'Travel health and vaccination services',
    icon: '✈️'
  },
  {
    id: 'preventive-medicine',
    name: 'Preventive Medicine',
    description: 'Disease prevention and health screening',
    icon: '🛡️'
  },
  {
    id: 'telemedicine',
    name: 'Telemedicine',
    description: 'Remote healthcare and virtual consultations',
    icon: '💻'
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
