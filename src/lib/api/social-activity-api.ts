import { supabase } from '@/lib/supabase';

export type ActivityType = 'purchase' | 'review' | 'check_in' | 'achievement' | 'business_support';

interface CreateActivityParams {
  userId: string;
  activityType: ActivityType;
  businessId?: string;
  metadata?: {
    amount?: number;
    rating?: number;
    achievement_name?: string;
    description?: string;
  };
  isPublic?: boolean;
}

/**
 * Creates a social activity feed entry
 * This is called automatically when users perform actions
 */
export const createSocialActivity = async ({
  userId,
  activityType,
  businessId,
  metadata = {},
  isPublic = true
}: CreateActivityParams) => {
  try {
    const { error } = await supabase
      .from('social_activity_feed')
      .insert({
        user_id: userId,
        activity_type: activityType,
        business_id: businessId,
        metadata,
        is_public: isPublic
      });

    if (error) {
      console.error('Error creating social activity:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in createSocialActivity:', error);
    return false;
  }
};

/**
 * Records a check-in at a business
 */
export const checkInAtBusiness = async (userId: string, businessId: string, description?: string) => {
  return createSocialActivity({
    userId,
    activityType: 'check_in',
    businessId,
    metadata: { description },
    isPublic: true
  });
};
