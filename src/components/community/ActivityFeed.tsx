
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import ActivityCard from './ActivityCard';
import ActivityFeedLoadingState from './ActivityFeedLoadingState';
import ActivityFeedEmptyState from './ActivityFeedEmptyState';
import { ActivityItem, generateMockActivityData } from './mockActivityData';

interface ActivityFeedProps {
  limit?: number;
  showHeader?: boolean;
  className?: string;
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({ 
  limit = 10, 
  showHeader = true,
  className = ""
}) => {
  const { user } = useAuth();
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    setLoading(true);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockActivities = generateMockActivityData(limit);
    setActivities(mockActivities);
    setLoading(false);
  };

  const handleLike = (activityId: string) => {
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

  if (loading) {
    return (
      <ActivityFeedLoadingState 
        showHeader={showHeader} 
        className={className} 
      />
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {showHeader && <h3 className="text-lg font-semibold text-mansablue">Community Activity</h3>}
      
      {activities.map((activity) => (
        <ActivityCard 
          key={activity.id} 
          activity={activity} 
          onLike={handleLike} 
        />
      ))}
      
      {activities.length === 0 && !loading && <ActivityFeedEmptyState />}
    </div>
  );
};

export default ActivityFeed;
