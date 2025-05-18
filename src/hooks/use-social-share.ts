
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { checkRateLimit } from '@/lib/utils/error-utils';

// Define share target interface
export interface ShareTarget {
  name: string;
  icon: string;
  color: string;
  action: (data: ShareData) => void;
}

// Define share data interface
export interface ShareData {
  title: string;
  text?: string;
  url: string;
}

export const useSocialShare = () => {
  const [canShare, setCanShare] = useState(false);
  const [shareTargets, setShareTargets] = useState<ShareTarget[]>([]);

  // Check if Navigator Share API is available
  useEffect(() => {
    setCanShare(!!navigator.share);
  }, []);

  // Get absolute URL for sharing
  const getShareUrl = (path: string): string => {
    try {
      const baseUrl = window.location.origin;
      const cleanPath = path.startsWith('/') ? path : `/${path}`;
      return `${baseUrl}${cleanPath}`;
    } catch (error) {
      console.error('Error creating share URL:', error);
      return window.location.href;
    }
  };

  // Use Web Share API if available, otherwise use custom sharing
  const share = async (data: ShareData): Promise<boolean> => {
    try {
      // Rate limit check to prevent spam
      const withinLimit = await checkRateLimit('social_share', 5);
      if (!withinLimit) {
        toast.error('Please wait before sharing again');
        return false;
      }
      
      if (navigator.share) {
        await navigator.share(data);
        return true;
      } else {
        // Fallback: Copy to clipboard
        await navigator.clipboard.writeText(data.url);
        toast.success('Link copied to clipboard');
        return true;
      }
    } catch (error: any) {
      // User cancelling the share is not an error
      if (error.name === 'AbortError') {
        return false;
      }
      console.error('Error sharing:', error);
      toast.error('Failed to share');
      return false;
    }
  };

  // Generate platform-specific share URLs
  useEffect(() => {
    const targets: ShareTarget[] = [
      {
        name: 'Facebook',
        icon: 'facebook',
        color: 'bg-blue-600 text-white hover:bg-blue-700',
        action: ({ title, url }) => {
          const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(title)}`;
          window.open(shareUrl, '_blank', 'width=600,height=400');
        }
      },
      {
        name: 'Twitter',
        icon: 'twitter',
        color: 'bg-sky-500 text-white hover:bg-sky-600',
        action: ({ title, text, url }) => {
          const shareText = text || title;
          const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(url)}`;
          window.open(shareUrl, '_blank', 'width=600,height=400');
        }
      },
      {
        name: 'LinkedIn',
        icon: 'linkedin',
        color: 'bg-blue-700 text-white hover:bg-blue-800',
        action: ({ title, url }) => {
          const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
          window.open(shareUrl, '_blank', 'width=600,height=400');
        }
      },
      {
        name: 'Email',
        icon: 'mail',
        color: 'bg-gray-600 text-white hover:bg-gray-700',
        action: ({ title, text, url }) => {
          const body = text ? `${text}\n\n${url}` : url;
          window.location.href = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}`;
        }
      }
    ];

    setShareTargets(targets);
  }, []);

  return {
    canShare,
    shareTargets,
    getShareUrl,
    share
  };
};

export default useSocialShare;
