
import React from 'react';
import { useSocialShare } from '@/hooks/use-social-share';

export const useShareSponsorship = () => {
  const socialShare = useSocialShare();
  
  const getShareData = (title: string = 'Mansa Musa Marketplace Sponsorship Agreement') => {
    return {
      title,
      text: 'Join our sponsorship program and make a difference in our community.',
      url: 'https://mansamusa.com/sponsorship/agreement'
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
