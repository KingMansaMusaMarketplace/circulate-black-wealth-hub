
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MapPin, QrCode, Target, TrendingUp, Users, Gift, Star } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { CommunityActivity } from './types/activity';

interface ActivityItemProps {
  activity: CommunityActivity;
}

const ActivityItem: React.FC<ActivityItemProps> = ({ activity }) => {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'qr_scan':
        return <QrCode className="h-4 w-4" />;
      case 'business_discovery':
        return <MapPin className="h-4 w-4" />;
      case 'milestone':
        return <Target className="h-4 w-4" />;
      case 'community_goal':
        return <Users className="h-4 w-4" />;
      case 'reward_redemption':
        return <Gift className="h-4 w-4" />;
      case 'review':
        return <Star className="h-4 w-4" />;
      default:
        return <TrendingUp className="h-4 w-4" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'qr_scan':
        return 'text-green-600 bg-green-100';
      case 'business_discovery':
        return 'text-blue-600 bg-blue-100';
      case 'milestone':
        return 'text-mansagold bg-yellow-100';
      case 'community_goal':
        return 'text-purple-600 bg-purple-100';
      case 'reward_redemption':
        return 'text-pink-600 bg-pink-100';
      case 'review':
        return 'text-orange-600 bg-orange-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const formatActivityDescription = (activity: CommunityActivity) => {
    switch (activity.type) {
      case 'qr_scan':
        return `scanned a QR code at ${activity.business_name} and earned ${activity.points_earned} points`;
      case 'business_discovery':
        return `discovered ${activity.business_name}`;
      case 'milestone':
        return `reached a personal milestone: ${activity.description}`;
      case 'community_goal':
        return `Community achieved: ${activity.description}`;
      case 'reward_redemption':
        return `redeemed a reward from ${activity.business_name}`;
      case 'review':
        return `left a review for ${activity.business_name}`;
      default:
        return activity.description || 'participated in community activity';
    }
  };

  return (
    <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
      <div className={`p-2 rounded-full ${getActivityColor(activity.type)}`}>
        {getActivityIcon(activity.type)}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2 mb-1">
          <Avatar className="h-6 w-6">
            <AvatarImage src={activity.user_avatar} />
            <AvatarFallback className="text-xs">
              {activity.user_name?.charAt(0) || '?'}
            </AvatarFallback>
          </Avatar>
          <span className="font-medium text-sm">{activity.user_name || 'Community Member'}</span>
        </div>
        
        <p className="text-sm text-gray-700 mb-2">
          {formatActivityDescription(activity)}
        </p>
        
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">
            {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
          </span>
          
          {activity.points_earned && activity.points_earned > 0 && (
            <Badge variant="outline" className="text-xs">
              +{activity.points_earned} points
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityItem;
