
import { Star, Crown, Building2, Zap, Rocket, FileText, Bot, Shield, Sparkles } from 'lucide-react';
import { type SubscriptionTier } from '@/lib/services/subscription-tiers';

export const tierIcons: Record<SubscriptionTier, any> = {
  free: Star,
  kayla_essentials: Sparkles,
  kayla_essentials_annual: Sparkles,
  business_pro: Rocket,
  business_pro_annual: Rocket,
  kayla_starter: FileText,
  kayla_starter_annual: FileText,
  kayla_pro: Bot,
  kayla_pro_annual: Bot,
  kayla_pro_founders: Crown,
  kayla_enterprise: Shield,
  business_pro_kayla: Crown,
  business_pro_kayla_annual: Crown,
  enterprise: Building2,
  kayla_ai: Zap,
};

export const tierColors: Record<SubscriptionTier, string> = {
  free: 'bg-gray-100 text-gray-800',
  kayla_essentials: 'bg-gradient-to-r from-sky-500 to-blue-600 text-white',
  kayla_essentials_annual: 'bg-gradient-to-r from-sky-500 to-blue-600 text-white',
  business_pro: 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white',
  business_pro_annual: 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white',
  kayla_starter: 'bg-gradient-to-r from-green-500 to-emerald-600 text-white',
  kayla_starter_annual: 'bg-gradient-to-r from-green-500 to-emerald-600 text-white',
  kayla_pro: 'bg-gradient-to-r from-yellow-500 to-amber-600 text-white',
  kayla_pro_annual: 'bg-gradient-to-r from-yellow-500 to-amber-600 text-white',
  kayla_pro_founders: 'bg-gradient-to-r from-mansagold to-amber-500 text-white',
  kayla_enterprise: 'bg-gradient-to-r from-purple-500 to-pink-600 text-white',
  business_pro_kayla: 'bg-gradient-to-r from-amber-500 to-orange-600 text-white',
  business_pro_kayla_annual: 'bg-gradient-to-r from-amber-500 to-orange-600 text-white',
  enterprise: 'bg-gradient-to-r from-amber-500 to-orange-600 text-white',
  kayla_ai: 'bg-gradient-to-r from-amber-500 to-orange-600 text-white',
};
