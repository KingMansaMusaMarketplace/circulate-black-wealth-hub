import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { QrCode, Gift, Star, MapPin, Clock } from 'lucide-react';
import { useRealtimeNotifications } from '@/hooks/useRealtimeNotifications';
import { formatDistanceToNow } from 'date-fns';

const ActivityFeed: React.FC = () => {
  const { activityFeed } = useRealtimeNotifications();

  const getActivityIcon = (eventType: string) => {
    switch (eventType) {
      case 'qr_scan':
        return <QrCode className="h-4 w-4" />;
      case 'review':
        return <Star className="h-4 w-4" />;
      case 'reward_redemption':
        return <Gift className="h-4 w-4" />;
      default:
        return <MapPin className="h-4 w-4" />;
    }
  };

  const getActivityColor = (eventType: string) => {
    switch (eventType) {
      case 'qr_scan':
        return 'text-blue-600 bg-blue-100';
      case 'review':
        return 'text-yellow-600 bg-yellow-100';
      case 'reward_redemption':
        return 'text-purple-600 bg-purple-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getActivityMessage = (activity: any) => {
    switch (activity.event_type) {
      case 'qr_scan':
        return `scanned QR code at ${activity.business?.business_name || 'a business'}`;
      case 'review':
        return `left a review for ${activity.business?.business_name || 'a business'}`;
      case 'reward_redemption':
        return `redeemed a reward at ${activity.business?.business_name || 'a business'}`;
      default:
        return 'performed an action';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Clock className="h-5 w-5" />
          <span>Live Community Activity</span>
        </CardTitle>
        <CardDescription>
          See what's happening in your community right now
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-96">
          {activityFeed.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-sm">No recent activity</p>
              <p className="text-xs mt-1">Activity will appear here as users interact with businesses</p>
            </div>
          ) : (
            <div className="space-y-4">
              {activityFeed.map((activity, index) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    getActivityColor(activity.event_type)
                  }`}>
                    {getActivityIcon(activity.event_type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={activity.business?.logo_url} />
                        <AvatarFallback className="text-xs">
                          {activity.business?.business_name?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <p className="text-sm">
                        <span className="font-medium">Someone</span>{' '}
                        {getActivityMessage(activity)}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      {activity.points_earned && (
                        <Badge variant="secondary" className="text-xs">
                          +{activity.points_earned} pts
                        </Badge>
                      )}
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                  {index === 0 && (
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  )}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default ActivityFeed;