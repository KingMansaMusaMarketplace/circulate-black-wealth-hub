
export interface CommunityActivity {
  id: string;
  type: 'qr_scan' | 'business_discovery' | 'milestone' | 'community_goal' | 'reward_redemption' | 'review';
  user_id: string;
  user_name?: string;
  user_avatar?: string;
  business_id?: string;
  business_name?: string;
  description?: string;
  points_earned?: number;
  amount?: number;
  created_at: string;
  metadata?: Record<string, any>;
}

export interface ActivityFilters {
  type?: string[];
  user_id?: string;
  business_id?: string;
  date_from?: string;
  date_to?: string;
}
