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
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      
      // Fetch profiles and businesses separately
      const userIds = [...new Set((data || []).map(a => a.user_id).filter(Boolean))];
      const businessIds = [...new Set((data || []).map(a => a.business_id).filter(Boolean))];
      
      const [profilesResult, businessesResult] = await Promise.all([
        userIds.length > 0 
          ? supabase.from('profiles').select('id, full_name, avatar_url').in('id', userIds)
          : Promise.resolve({ data: [] }),
        businessIds.length > 0
          ? supabase.from('businesses').select('id, business_name, logo_url').in('id', businessIds)
          : Promise.resolve({ data: [] })
      ]);
      
      const profilesMap = new Map((profilesResult.data || []).map(p => [p.id, p]));
      const businessesMap = new Map((businessesResult.data || []).map(b => [b.id, b]));
      
      const enrichedData = (data || []).map(a => ({
        ...a,
        profiles: profilesMap.get(a.user_id) || null,
        businesses: businessesMap.get(a.business_id) || null
      }));
      
      setActivities(enrichedData);

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
