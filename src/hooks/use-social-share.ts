
import { toast } from 'sonner';

interface ShareOptions {
  title?: string;
  text?: string;
  url?: string;
}

export interface ShareTarget {
  name: string;
  icon: string;
  color: string;
  action: (options: ShareOptions) => Promise<boolean>;
}

export const useSocialShare = () => {
  const baseUrl = window.location.origin;

  // Check if Web Share API is available
  const canShare = 'share' in navigator;

  // Share using the Web Share API
  const shareWithNative = async (options: ShareOptions): Promise<boolean> => {
    if (!canShare) return false;

    try {
      await navigator.share({
        title: options.title,
        text: options.text,
        url: options.url || window.location.href
      });
      
      toast.success('Shared successfully!');
      return true;
    } catch (error: any) {
      // User canceled or share failed
      if (error.name !== 'AbortError') {
        console.error('Error sharing:', error);
        toast.error('Failed to share');
      }
      return false;
    }
  };

  // Share on Twitter
  const shareOnTwitter = async (options: ShareOptions): Promise<boolean> => {
    const text = encodeURIComponent(options.text || '');
    const url = encodeURIComponent(options.url || window.location.href);
    const shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
    
    try {
      window.open(shareUrl, '_blank');
      return true;
    } catch (error) {
      console.error('Error sharing to Twitter:', error);
      toast.error('Failed to share to Twitter');
      return false;
    }
  };

  // Share on Facebook
  const shareOnFacebook = async (options: ShareOptions): Promise<boolean> => {
    const url = encodeURIComponent(options.url || window.location.href);
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
    
    try {
      window.open(shareUrl, '_blank');
      return true;
    } catch (error) {
      console.error('Error sharing to Facebook:', error);
      toast.error('Failed to share to Facebook');
      return false;
    }
  };

  // Share on LinkedIn
  const shareOnLinkedIn = async (options: ShareOptions): Promise<boolean> => {
    const url = encodeURIComponent(options.url || window.location.href);
    const title = encodeURIComponent(options.title || '');
    const summary = encodeURIComponent(options.text || '');
    const shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${title}&summary=${summary}`;
    
    try {
      window.open(shareUrl, '_blank');
      return true;
    } catch (error) {
      console.error('Error sharing to LinkedIn:', error);
      toast.error('Failed to share to LinkedIn');
      return false;
    }
  };

  // Copy link to clipboard
  const copyToClipboard = async (options: ShareOptions): Promise<boolean> => {
    const textToCopy = options.url || window.location.href;
    
    try {
      await navigator.clipboard.writeText(textToCopy);
      toast.success('Link copied to clipboard!');
      return true;
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      toast.error('Failed to copy link');
      return false;
    }
  };

  // Generate sharing options
  const getShareUrl = (path: string): string => {
    return `${baseUrl}${path.startsWith('/') ? '' : '/'}${path}`;
  };

  // Available share targets
  const shareTargets: ShareTarget[] = [
    {
      name: 'Twitter',
      icon: 'twitter',
      color: 'bg-[#1DA1F2] text-white',
      action: shareOnTwitter
    },
    {
      name: 'Facebook',
      icon: 'facebook',
      color: 'bg-[#1877F2] text-white',
      action: shareOnFacebook
    },
    {
      name: 'LinkedIn',
      icon: 'linkedin',
      color: 'bg-[#0A66C2] text-white',
      action: shareOnLinkedIn
    },
    {
      name: 'Copy Link',
      icon: 'link',
      color: 'bg-gray-800 text-white dark:bg-gray-600',
      action: copyToClipboard
    }
  ];

  return {
    canShare,
    shareWithNative,
    shareTargets,
    getShareUrl,
    shareOnTwitter,
    shareOnFacebook,
    shareOnLinkedIn,
    copyToClipboard
  };
};
