
import { Star, Crown, Building2, Zap, Rocket } from 'lucide-react';
import { type SubscriptionTier } from '@/lib/services/subscription-tiers';

export const tierIcons = {
  free: Star,
  premium: Crown,
  business_starter: Rocket,
  business: Building2,
  enterprise: Zap
};

export const tierColors = {
  free: 'bg-gray-100 text-gray-800',
  premium: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white',
  business_starter: 'bg-gradient-to-r from-green-500 to-emerald-600 text-white',
  business: 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white',
  enterprise: 'bg-gradient-to-r from-amber-500 to-orange-600 text-white'
};
