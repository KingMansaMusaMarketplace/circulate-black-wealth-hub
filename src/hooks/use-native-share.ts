import { useState } from 'react';
import { Share } from '@capacitor/share';
import { Capacitor } from '@capacitor/core';
import { toast } from 'sonner';
import { useHapticFeedback } from './use-haptic-feedback';

export const useNativeShare = () => {
  const [isSharing, setIsSharing] = useState(false);
  const haptics = useHapticFeedback();
  const isNative = Capacitor.isNativePlatform();

  const canShare = async () => {
    if (!isNative) return false;
    
    try {
      const result = await Share.canShare();
      return result.value;
    } catch {
      return false;
    }
  };

  const shareText = async (text: string, title?: string, dialogTitle?: string) => {
    if (!isNative) {
      // Web fallback
      if (navigator.share) {
        try {
          await navigator.share({ text, title });
          return true;
        } catch (error) {
          return false;
        }
      }
      return false;
    }

    setIsSharing(true);
    haptics.light();

    try {
      await Share.share({
        text,
        title,
        dialogTitle: dialogTitle || 'Share'
      });
      
      haptics.success();
      toast.success('Shared successfully!');
      return true;
    } catch (error: any) {
      if (error.message !== 'Share canceled') {
        console.error('Error sharing:', error);
        haptics.error();
        toast.error('Failed to share');
      }
      return false;
    } finally {
      setIsSharing(false);
    }
  };

  const shareUrl = async (url: string, text?: string, title?: string) => {
    if (!isNative) {
      // Web fallback
      if (navigator.share) {
        try {
          await navigator.share({ url, text, title });
          haptics.success();
          toast.success('Shared successfully!');
          return true;
        } catch (error) {
          // User canceled or error occurred
          return false;
        }
      }
      
      // Clipboard fallback for browsers without Web Share API
      try {
        await navigator.clipboard.writeText(url);
        haptics.success();
        toast.success('Link copied to clipboard!');
        return true;
      } catch (error) {
        haptics.error();
        toast.error('Failed to copy link');
        return false;
      }
    }

    setIsSharing(true);
    haptics.light();

    try {
      await Share.share({
        url,
        title,
        dialogTitle: title || 'Share'
      });
      
      haptics.success();
      toast.success('Shared successfully!');
      return true;
    } catch (error: any) {
      if (error.message !== 'Share canceled') {
        console.error('Error sharing:', error);
        haptics.error();
        toast.error('Failed to share');
      }
      return false;
    } finally {
      setIsSharing(false);
    }
  };

  const shareBusiness = async (businessName: string, businessId: string) => {
    const url = `${window.location.origin}/business/${businessId}`;
    const text = `Check out ${businessName} on Mansa Musa Marketplace - Supporting Black-owned businesses!`;
    
    return await shareUrl(url, text, 'Share Business');
  };

  const shareAppInvite = async (referralCode?: string) => {
    const url = referralCode 
      ? `${window.location.origin}?ref=${referralCode}`
      : window.location.origin;
    
    const text = 'Join me in supporting Black-owned businesses on Mansa Musa Marketplace! Download the app and earn rewards.';
    
    return await shareUrl(url, text, 'Invite Friends');
  };

  return {
    isSharing,
    canShare,
    shareText,
    shareUrl,
    shareBusiness,
    shareAppInvite,
    isNative
  };
};
