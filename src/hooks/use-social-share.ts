import { useState } from 'react';
import { toast } from 'sonner';

export interface ShareData {
  title: string;
  text: string;
  url: string;
}

export interface ShareTarget {
  name: string;
  action: (data: ShareData) => Promise<void>;
  color: string;
}

export const useSocialShare = () => {
  const [isSharing, setIsSharing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canShare = (data?: ShareData): boolean => {
    if (!navigator.share) return false;
    
    // If no data provided, just check if share API is available
    if (!data) return true;
    
    // Check if the data can be shared
    try {
      return navigator.canShare?.(data as any) || true;
    } catch (err) {
      // Fall back to true if canShare throws an error
      return true;
    }
  };

  const share = async (data: ShareData): Promise<boolean> => {
    setIsSharing(true);
    setError(null);
    
    try {
      if (navigator.share) {
        await navigator.share(data);
        return true;
      } else {
        // Fallback for browsers that don't support Web Share API
        try {
          await navigator.clipboard.writeText(data.url);
          toast.success('Link copied to clipboard!');
          return true;
        } catch (err) {
          throw new Error('Could not copy link to clipboard');
        }
      }
    } catch (err: any) {
      // Don't show errors for user cancellations
      if (err.name === 'AbortError') {
        return false;
      }
      
      const errorMessage = err.message || 'Failed to share content';
      setError(errorMessage);
      toast.error('Sharing failed', { description: errorMessage });
      return false;
    } finally {
      setIsSharing(false);
    }
  };

  // Get a properly formatted share URL from a path
  const getShareUrl = (path?: string): string => {
    // If no path is provided, use current location
    if (!path) return window.location.href;
    
    // If path is already a full URL, return it
    if (path.startsWith('http')) return path;
    
    // Otherwise, construct URL from origin and path
    return `${window.location.origin}${path.startsWith('/') ? '' : '/'}${path}`;
  };

  // Define share targets for social media platforms
  const shareTargets: ShareTarget[] = [
    {
      name: 'Twitter',
      color: 'bg-[#1DA1F2] text-white hover:bg-[#0d95e8]',
      action: async (data: ShareData) => {
        const url = new URL('https://twitter.com/intent/tweet');
        url.searchParams.append('text', data.text || data.title);
        url.searchParams.append('url', data.url);
        window.open(url.toString(), '_blank');
      }
    },
    {
      name: 'Facebook',
      color: 'bg-[#1877F2] text-white hover:bg-[#0e6adc]',
      action: async (data: ShareData) => {
        const url = new URL('https://www.facebook.com/sharer/sharer.php');
        url.searchParams.append('u', data.url);
        window.open(url.toString(), '_blank');
      }
    },
    {
      name: 'LinkedIn',
      color: 'bg-[#0A66C2] text-white hover:bg-[#0958a8]',
      action: async (data: ShareData) => {
        const url = new URL('https://www.linkedin.com/sharing/share-offsite/');
        url.searchParams.append('url', data.url);
        window.open(url.toString(), '_blank');
      }
    }
  ];

  return {
    share,
    canShare,
    isSharing,
    error,
    shareTargets,
    getShareUrl
  };
};

export default useSocialShare;
