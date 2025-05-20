
import { useState } from 'react';
import { toast } from 'sonner';

export interface ShareData {
  title: string;
  text: string;
  url: string;
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

  return {
    share,
    canShare,
    isSharing,
    error
  };
};

export default useSocialShare;
