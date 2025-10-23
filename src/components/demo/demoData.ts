
export interface DemoStep {
  id: string;
  title: string;
  description: string;
  image: string;
  features: string[];
}

export const demoSteps: DemoStep[] = [
  {
    id: 'scan',
    title: 'Scan QR Code',
    description: 'Simply scan the QR code at checkout to earn points and get instant discounts',
    image: '/lovable-uploads/463fe82d-8622-41a8-8286-28b3ef9532a4.png',
    features: ['Instant 15% discount', '25 loyalty points earned', 'Automatic tracking']
  },
  {
    id: 'discover',
    title: 'Discover Businesses',
    description: 'Browse our directory of Black-owned businesses near you',
    image: '/lovable-uploads/king-thomas-3.png',
    features: ['Filter by category', 'Search by distance', 'View ratings & reviews']
  },
  {
    id: 'profile',
    title: 'Business Profiles',
    description: 'Detailed business information with photos, reviews, and special offers',
    image: '/lovable-uploads/30f608bd-596a-4257-8272-19ad1bd552f7.png',
    features: ['High-quality photos', 'Customer reviews', 'Exclusive discounts']
  },
  {
    id: 'rewards',
    title: 'Redeem Rewards',
    description: 'Use your earned points for discounts and special offers',
    image: '/lovable-uploads/4a17f10b-e405-454e-bb76-c891478f42f6.png',
    features: ['Track your points', 'Redeem rewards', 'Special member offers']
  }
];
