
import React from 'react';
import { useSocialShare } from '@/hooks/use-social-share';

export const useShareSponsorship = () => {
  const socialShare = useSocialShare();
  
  const getShareData = (title: string = '1325.AI Sponsorship Agreement') => {
    return {
      title,
      text: 'Join our sponsorship program and make a difference in our community.',
      url: 'https://1325.ai/sponsorship/agreement'
    };
  };
  
  const shareSponsorship = async () => {
    const shareData = getShareData();
    return socialShare.share(shareData);
  };
  
  return {
    ...socialShare,
    getShareData,
    shareSponsorship
  };
};

export default useShareSponsorship;
