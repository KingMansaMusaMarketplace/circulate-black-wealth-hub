export type BadgeCategory = 'referrals' | 'earnings' | 'recruitment' | 'special';
export type BadgeTier = 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';

export interface Badge {
  id: string;
  name: string;
  description: string;
  category: BadgeCategory;
  tier: BadgeTier;
  icon_name: string;
  threshold_value: number;
  points: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface EarnedBadge {
  id: string;
  sales_agent_id: string;
  badge_id: string;
  earned_at: string;
  progress: number;
}

export interface BadgeWithProgress extends Badge {
  is_earned: boolean;
  earned_at?: string;
  progress: number;
  progress_percentage: number;
}
