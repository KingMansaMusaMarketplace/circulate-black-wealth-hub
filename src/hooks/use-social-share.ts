
import { useCallback, useMemo } from 'react';

interface ShareOptions {
  title?: string;
  text?: string;
  url?: string;
}

interface ShareTarget {
  name: string;
  action: (options: ShareOptions) => Promise<void>;
  icon: string;
  color: string;
}

export const useSocialShare = () => {
  // Check if native sharing is available
  const canShare = useMemo(() => typeof navigator !== 'undefined' && !!navigator.share, []);

  // Native web share API
  const shareWithNative = useCallback(async (options: ShareOptions) => {
    if (canShare) {
      try {
        await navigator.share({
          title: options.title,
          text: options.text,
          url: options.url || window.location.href
        });
        return true;
      } catch (err) {
        // User may have canceled or sharing failed
        console.error('Error sharing:', err);
        return false;
      }
    }
    return false;
  }, [canShare]);

  // Helper to generate share URLs
  const getShareUrl = useCallback((path: string) => {
    // Get base URL from current location
    const baseUrl = window.location.origin;
    // Ensure path starts with /
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    // Return full URL
    return `${baseUrl}${normalizedPath}`;
  }, []);

  // Define sharing targets
  const shareTargets = useMemo<ShareTarget[]>(() => [
    {
      name: 'Twitter',
      icon: 'twitter',
      color: 'bg-[#1DA1F2] hover:bg-[#0d95e8]',
      action: async ({ title, text, url }) => {
        const shareUrl = url || window.location.href;
        const shareText = text || title || '';
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
        window.open(twitterUrl, '_blank');
      }
    },
    {
      name: 'Facebook',
      icon: 'facebook',
      color: 'bg-[#1877F2] hover:bg-[#0e6adc]',
      action: async ({ url }) => {
        const shareUrl = url || window.location.href;
        const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        window.open(facebookUrl, '_blank');
      }
    },
    {
      name: 'LinkedIn',
      icon: 'linkedin',
      color: 'bg-[#0A66C2] hover:bg-[#0958a8]',
      action: async ({ title, url }) => {
        const shareUrl = url || window.location.href;
        const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
        window.open(linkedinUrl, '_blank');
      }
    }
  ], []);

  return {
    canShare,
    shareWithNative,
    shareTargets,
    getShareUrl
  };
};
