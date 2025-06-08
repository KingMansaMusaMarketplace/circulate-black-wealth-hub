
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

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

  useEffect(() => {
    fetchActivities();
  }, [user, limit]);

  const fetchActivities = async () => {
    setLoading(true);
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data for now
      const mockActivities: CommunityActivity[] = [
        {
          id: '1',
          type: 'qr_scan',
          user_name: 'Marcus Johnson',
          business_name: 'Soul Food Kitchen',
          content: 'Just discovered an amazing soul food restaurant!',
          timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
          likes: 12,
          comments: 3,
          isLiked: false
        },
        // Add more mock activities as needed
      ];
      
      setActivities(mockActivities.slice(0, limit));
    } catch (error) {
      console.error('Error fetching community activities:', error);
    } finally {
      setLoading(false);
    }
  };

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
