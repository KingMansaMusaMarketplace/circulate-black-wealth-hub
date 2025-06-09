
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Heart, MessageCircle } from 'lucide-react';

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
  const activities = [
    {
      id: 1,
      type: 'join',
      user: 'Sarah M.',
      action: 'joined the community',
      time: '2 hours ago',
      icon: Users
    },
    {
      id: 2,
      type: 'like',
      user: 'John D.',
      action: 'liked a post about supporting local businesses',
      time: '4 hours ago',
      icon: Heart
    },
    {
      id: 3,
      type: 'comment',
      user: 'Lisa K.',
      action: 'commented on a business review',
      time: '6 hours ago',
      icon: MessageCircle
    }
  ];

  const displayActivities = activities.slice(0, limit);

  return (
    <Card className={className}>
      {showHeader && (
        <CardHeader>
          <CardTitle className="text-lg">Community Activity</CardTitle>
        </CardHeader>
      )}
      <CardContent className={showHeader ? '' : 'pt-6'}>
        <div className="space-y-4">
          {displayActivities.map((activity) => {
            const Icon = activity.icon;
            return (
              <div key={activity.id} className="flex items-start gap-3">
                <div className="w-8 h-8 bg-mansablue/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Icon className="h-4 w-4 text-mansablue" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm">
                    <span className="font-medium">{activity.user}</span>{' '}
                    <span className="text-gray-600">{activity.action}</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityFeed;
