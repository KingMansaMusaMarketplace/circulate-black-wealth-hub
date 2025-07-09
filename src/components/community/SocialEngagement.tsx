
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Share2, Heart, MessageSquare, Users, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

interface SocialEngagementProps {
  businessId: string;
  businessName: string;
  imageUrl?: string;
  description?: string;
  onShare?: (platform: string) => void;
  onLike?: () => void;
  onComment?: () => void;
  likes?: number;
  comments?: number;
  isLiked?: boolean;
}

const SocialEngagement: React.FC<SocialEngagementProps> = ({
  businessId,
  businessName,
  imageUrl,
  description,
  onShare,
  onLike,
  onComment,
  likes = 0,
  comments = 0,
  isLiked = false
}) => {
  const [sharing, setSharing] = useState(false);

  const shareUrl = `${window.location.origin}/business/${businessId}`;
  const shareText = `Check out ${businessName} on Mansa Musa Marketplace - supporting Black-owned businesses!`;

  const handleShare = async (platform: string) => {
    setSharing(true);
    
    try {
      let url = '';
      
      switch (platform) {
        case 'facebook':
          url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
          break;
        case 'twitter':
          url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
          break;
        case 'linkedin':
          url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
          break;
        case 'copy':
          await navigator.clipboard.writeText(shareUrl);
          toast.success('Link copied to clipboard!');
          onShare?.(platform);
          return;
        default:
          if (navigator.share) {
            await navigator.share({
              title: businessName,
              text: shareText,
              url: shareUrl,
            });
            onShare?.(platform);
            return;
          }
      }
      
      if (url) {
        window.open(url, '_blank', 'width=600,height=400');
        onShare?.(platform);
        toast.success(`Shared on ${platform}!`);
      }
    } catch (error) {
      console.error('Share error:', error);
      toast.error('Failed to share');
    } finally {
      setSharing(false);
    }
  };

  const handleLike = () => {
    onLike?.();
    if (!isLiked) {
      toast.success('Added to favorites!');
    }
  };

  return (
    <Card className="border-none shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          {/* Engagement Stats */}
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <Heart className="h-4 w-4" />
              <span>{likes}</span>
            </div>
            <div className="flex items-center space-x-1">
              <MessageSquare className="h-4 w-4" />
              <span>{comments}</span>
            </div>
            <div className="flex items-center space-x-1">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="text-green-600">Supporting Black business</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className={`${isLiked ? 'text-red-500' : 'text-gray-600'}`}
            >
              <Heart className={`h-4 w-4 mr-1 ${isLiked ? 'fill-current' : ''}`} />
              {isLiked ? 'Liked' : 'Like'}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={onComment}
            >
              <MessageSquare className="h-4 w-4 mr-1" />
              Comment
            </Button>

            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleShare('native')}
                disabled={sharing}
              >
                <Share2 className="h-4 w-4 mr-1" />
                Share
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Share Options */}
        <div className="flex items-center justify-center space-x-2 mt-3 pt-3 border-t border-gray-100">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleShare('facebook')}
            disabled={sharing}
          >
            Facebook
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleShare('twitter')}
            disabled={sharing}
          >
            Twitter
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleShare('linkedin')}
            disabled={sharing}
          >
            LinkedIn
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleShare('copy')}
            disabled={sharing}
          >
            Copy Link
          </Button>
        </div>

        {/* Impact Message */}
        <div className="mt-3 p-2 bg-green-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-green-600" />
            <p className="text-sm text-green-800">
              Every share helps circulate wealth in the Black community! 
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SocialEngagement;
