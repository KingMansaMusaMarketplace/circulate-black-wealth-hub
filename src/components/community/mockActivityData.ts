
import { formatDistanceToNow } from 'date-fns';

export interface ActivityItem {
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

export const generateMockActivityData = (limit: number): ActivityItem[] => {
  const mockActivities: ActivityItem[] = [
    {
      id: '1',
      type: 'qr_scan',
      user_name: 'Marcus Johnson',
      user_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
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
      user_avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
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
      user_avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
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
      user_avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
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
      user_avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
      business_name: 'Tech Innovators Inc',
      content: 'Supporting Black tech! This consulting firm helped my startup with their excellent services.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(), // 8 hours ago
      likes: 22,
      comments: 5,
      isLiked: true
    }
  ];
  
  return mockActivities.slice(0, limit);
};
