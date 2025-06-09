
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, Share2, TrendingUp, QrCode, Clock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { formatDistanceToNow } from 'date-fns';

interface ActivityItem {
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
    
    // Mock activity data
    const mockActivities: ActivityItem[] = [
      {
        id: '1',
        type: 'qr_scan',
        user_name: 'Marcus Johnson',
        user_avatar: '/placeholder.svg',
        business_name: 'Soul Food Kitchen',
        content: 'Just discovered an amazing soul food restaurant! The QR scan earned me 50 points.',
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
        likes: 12,
        comments: 3,
        isLiked: false
      },
      {
        id: '2',
        type: 'business_review',
        user_name: 'Keisha Williams',
        user_avatar: '/placeholder.svg',
        business_name: 'Natural Hair Studio',
        content: 'Left a 5-star review for this incredible hair salon. Supporting Black businesses feels so good!',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
        likes: 28,
        comments: 7,
        isLiked: true
      },
      {
        id: '3',
        type: 'milestone',
        user_name: 'Andre Thompson',
        user_avatar: '/placeholder.svg',
        content: 'Just reached $500 in total spending with Black-owned businesses this month! 🎉',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), // 4 hours ago
        likes: 45,
        comments: 12,
        isLiked: false
      },
      {
        id: '4',
        type: 'community_post',
        user_name: 'Zara Davis',
        user_avatar: '/placeholder.svg',
        content: 'Anyone know good Black-owned bookstores in the Atlanta area? Looking for some new reads!',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(), // 6 hours ago
        likes: 8,
        comments: 15,
        isLiked: false
      },
      {
        id: '5',
        type: 'qr_scan',
        user_name: 'Jordan Smith',
        user_avatar: '/placeholder.svg',
        business_name: 'Tech Innovators Inc',
        content: 'Supporting Black tech! This consulting firm helped my startup with their excellent services.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(), // 8 hours ago
        likes: 22,
        comments: 5,
        isLiked: true
      }
    ];
    
    setActivities(mockActivities.slice(0, limit));
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

  if (loading) {
    return (
      <div className={`space-y-4 ${className}`}>
        {showHeader && <h3 className="text-lg font-semibold text-mansablue">Community Activity</h3>}
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="flex space-x-3">
                <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {showHeader && <h3 className="text-lg font-semibold text-mansablue">Community Activity</h3>}
      
      {activities.map((activity) => (
        <Card key={activity.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={activity.user_avatar} />
                <AvatarFallback>
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
                    onClick={() => handleLike(activity.id)}
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
      ))}
      
      {activities.length === 0 && !loading && (
        <Card>
          <CardContent className="p-8 text-center">
            <TrendingUp className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No activity yet</h3>
            <p className="text-gray-600">
              Start scanning QR codes and supporting businesses to see community activity!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ActivityFeed;
