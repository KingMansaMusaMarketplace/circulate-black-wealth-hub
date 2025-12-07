
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

interface CommunityActivity {
  id: string;
  type: 'qr_scan' | 'business_review' | 'community_post' | 'milestone';
  user_name: string;
  user_avatar?: string;
  business_name?: string;
  content: string;
  timestamp: string;
  likes: number;
  comments: number;
  isLiked: boolean;
}

export const useCommunityActivity = (limit = 10) => {
  const { user } = useAuth();
  const [activities, setActivities] = useState<CommunityActivity[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchActivities = useCallback(async () => {
    setLoading(true);
    try {
      const allActivities: CommunityActivity[] = [];

      // Fetch recent QR scans with business info
      const { data: qrScans, error: scansError } = await supabase
        .from('qr_scans')
        .select(`
          id,
          scanned_at,
          points_earned,
          customer_id,
          business_id,
          businesses!inner (
            business_name
          )
        `)
        .order('scanned_at', { ascending: false })
        .limit(limit);

      if (!scansError && qrScans) {
        // Get user profiles for the scans
        const customerIds = [...new Set(qrScans.map(s => s.customer_id).filter(Boolean))];
        
        let profilesMap: Record<string, any> = {};
        if (customerIds.length > 0) {
          const { data: profiles } = await supabase
            .from('profiles')
            .select('id, full_name, avatar_url')
            .in('id', customerIds);
          
          profilesMap = (profiles || []).reduce((acc, p) => {
            acc[p.id] = p;
            return acc;
          }, {} as Record<string, any>);
        }

        qrScans.forEach(scan => {
          const profile = profilesMap[scan.customer_id] || {};
          const businessName = (scan.businesses as any)?.business_name || 'a local business';
          
          allActivities.push({
            id: `scan-${scan.id}`,
            type: 'qr_scan',
            user_name: profile.full_name || 'Community Member',
            user_avatar: profile.avatar_url,
            business_name: businessName,
            content: `Earned ${scan.points_earned || 0} points at ${businessName}!`,
            timestamp: scan.scanned_at,
            likes: Math.floor(Math.random() * 10),
            comments: Math.floor(Math.random() * 5),
            isLiked: false
          });
        });
      }

      // Fetch recent reviews
      const { data: reviews, error: reviewsError } = await supabase
        .from('reviews')
        .select(`
          id,
          created_at,
          rating,
          comment,
          customer_id,
          business_id,
          businesses!inner (
            business_name
          )
        `)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (!reviewsError && reviews) {
        const reviewerIds = [...new Set(reviews.map(r => r.customer_id).filter(Boolean))];
        
        let reviewerProfiles: Record<string, any> = {};
        if (reviewerIds.length > 0) {
          const { data: profiles } = await supabase
            .from('profiles')
            .select('id, full_name, avatar_url')
            .in('id', reviewerIds);
          
          reviewerProfiles = (profiles || []).reduce((acc, p) => {
            acc[p.id] = p;
            return acc;
          }, {} as Record<string, any>);
        }

        reviews.forEach(review => {
          const profile = reviewerProfiles[review.customer_id] || {};
          const businessName = (review.businesses as any)?.business_name || 'a business';
          
          allActivities.push({
            id: `review-${review.id}`,
            type: 'business_review',
            user_name: profile.full_name || 'Community Member',
            user_avatar: profile.avatar_url,
            business_name: businessName,
            content: review.comment || `Left a ${review.rating}-star review for ${businessName}`,
            timestamp: review.created_at,
            likes: Math.floor(Math.random() * 15),
            comments: Math.floor(Math.random() * 8),
            isLiked: false
          });
        });
      }

      // Sort all activities by timestamp
      allActivities.sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );

      setActivities(allActivities.slice(0, limit));
    } catch (error) {
      console.error('Error fetching community activities:', error);
      setActivities([]);
    } finally {
      setLoading(false);
    }
  }, [user, limit]);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  const likeActivity = (activityId: string) => {
    setActivities(activities.map(activity => 
      activity.id === activityId 
        ? { 
            ...activity, 
            isLiked: !activity.isLiked,
            likes: activity.isLiked ? activity.likes - 1 : activity.likes + 1
          }
        : activity
    ));
  };

  return {
    activities,
    loading,
    likeActivity,
    refetch: fetchActivities
  };
};
