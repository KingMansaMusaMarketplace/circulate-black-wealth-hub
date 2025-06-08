
import { formatCurrency } from './formatters';

interface UserImpactMetrics {
  businesses_supported: number;
  wealth_circulated: number;
}

export const shareImpact = (userMetrics: UserImpactMetrics | null) => {
  if (userMetrics) {
    const text = `I've supported ${userMetrics.businesses_supported} Black-owned businesses and helped circulate ${formatCurrency(userMetrics.wealth_circulated)} in our community! 💪 #BlackOwnedBusinesses #CommunityWealth`;
    
    if (navigator.share) {
      navigator.share({
        title: 'My Community Impact',
        text: text,
        url: window.location.origin
      });
    } else {
      navigator.clipboard.writeText(text);
    }
  }
};
