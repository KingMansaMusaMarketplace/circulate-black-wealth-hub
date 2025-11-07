import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface SocialActivity {
  id: string;
  user_id: string;
  activity_type: 'purchase' | 'review' | 'check_in' | 'achievement' | 'business_support';
  business_id?: string;
  metadata: {
    amount?: number;
    rating?: number;
    achievement_name?: string;
    description?: string;
  };
  is_public: boolean;
  created_at: string;
  profiles?: {
    full_name: string;
    avatar_url?: string;
  };
  businesses?: {
    business_name: string;
    logo_url?: string;
  };
}

export const useSocialFeed = () => {
  const { user } = useAuth();
  const [activities, setActivities] = useState<SocialActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchFeed();
      subscribeToFeedUpdates();
    }
  }, [user]);

  const fetchFeed = async () => {
    if (!user) return;

    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('social_activity_feed')
        .select(`
          *,
          profiles!social_activity_feed_user_id_fkey(full_name, avatar_url),
          businesses(business_name, logo_url)
        `)
        .eq('is_public', true)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setActivities(data || []);

    } catch (error) {
      console.error('Error fetching social feed:', error);
    } finally {
      setLoading(false);
    }
  };

  const subscribeToFeedUpdates = () => {
    if (!user) return;

    const channel = supabase
      .channel('social_feed_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'social_activity_feed'
        },
        (payload) => {
          setActivities(prev => [payload.new as SocialActivity, ...prev].slice(0, 50));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const createActivity = async (
    activityType: SocialActivity['activity_type'],
    businessId?: string,
    metadata?: SocialActivity['metadata']
  ) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('social_activity_feed')
        .insert({
          user_id: user.id,
          activity_type: activityType,
          business_id: businessId,
          metadata: metadata || {},
          is_public: true
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error creating activity:', error);
    }
  };

  return {
    activities,
    loading,
    createActivity,
    refetch: fetchFeed
  };
};
