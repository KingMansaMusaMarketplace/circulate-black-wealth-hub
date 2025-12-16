
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

// Returns empty array - real activity data comes from the database
export const generateMockActivityData = (limit: number): ActivityItem[] => {
  return [];
};
