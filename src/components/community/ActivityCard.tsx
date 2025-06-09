
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, Share2, TrendingUp, QrCode, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ActivityItem } from './mockActivityData';

interface ActivityCardProps {
  activity: ActivityItem;
  onLike: (activityId: string) => void;
}

const ActivityCard: React.FC<ActivityCardProps> = ({ activity, onLike }) => {
  const getActivityIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'qr_scan':
        return <QrCode className="h-4 w-4" />;
      case 'business_review':
        return <MessageCircle className="h-4 w-4" />;
      case 'milestone':
        return <TrendingUp className="h-4 w-4" />;
      case 'community_post':
        return <Share2 className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getActivityBadgeColor = (type: ActivityItem['type']) => {
    switch (type) {
      case 'qr_scan':
        return 'bg-green-100 text-green-800';
      case 'business_review':
        return 'bg-blue-100 text-blue-800';
      case 'milestone':
        return 'bg-purple-100 text-purple-800';
      case 'community_post':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getActivityLabel = (type: ActivityItem['type']) => {
    switch (type) {
      case 'qr_scan':
        return 'QR Scan';
      case 'business_review':
        return 'Review';
      case 'milestone':
        return 'Milestone';
      case 'community_post':
        return 'Community';
      default:
        return 'Activity';
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarImage 
              src={activity.user_avatar} 
              alt={activity.user_name}
              className="object-cover"
            />
            <AvatarFallback className="bg-mansablue text-white">
              {activity.user_name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <h4 className="font-medium text-gray-900">{activity.user_name}</h4>
                <Badge 
                  variant="secondary" 
                  className={`text-xs ${getActivityBadgeColor(activity.type)}`}
                >
                  {getActivityIcon(activity.type)}
                  <span className="ml-1">{getActivityLabel(activity.type)}</span>
                </Badge>
              </div>
              <span className="text-xs text-gray-500">
                {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
              </span>
            </div>
            
            {activity.business_name && (
              <p className="text-sm text-mansablue font-medium mb-1">
                @ {activity.business_name}
              </p>
            )}
            
            <p className="text-gray-700 text-sm mb-3">{activity.content}</p>
            
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onLike(activity.id)}
                className={`text-xs ${activity.isLiked ? 'text-red-500' : 'text-gray-500'}`}
              >
                <Heart 
                  className={`h-4 w-4 mr-1 ${activity.isLiked ? 'fill-current' : ''}`} 
                />
                {activity.likes}
              </Button>
              
              <Button variant="ghost" size="sm" className="text-xs text-gray-500">
                <MessageCircle className="h-4 w-4 mr-1" />
                {activity.comments}
              </Button>
              
              <Button variant="ghost" size="sm" className="text-xs text-gray-500">
                <Share2 className="h-4 w-4 mr-1" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityCard;
