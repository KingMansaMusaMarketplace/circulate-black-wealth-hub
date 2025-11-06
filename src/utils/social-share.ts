export interface ShareData {
  title: string;
  text: string;
  url?: string;
  image?: string;
}

export const shareToTwitter = (data: ShareData) => {
  const text = encodeURIComponent(`${data.title}\n\n${data.text}`);
  const url = encodeURIComponent(data.url || window.location.href);
  window.open(
    `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
    '_blank',
    'width=550,height=420'
  );
};

export const shareToFacebook = (data: ShareData) => {
  const url = encodeURIComponent(data.url || window.location.href);
  window.open(
    `https://www.facebook.com/sharer/sharer.php?u=${url}`,
    '_blank',
    'width=550,height=420'
  );
};

export const shareToLinkedIn = (data: ShareData) => {
  const url = encodeURIComponent(data.url || window.location.href);
  const title = encodeURIComponent(data.title);
  const summary = encodeURIComponent(data.text);
  window.open(
    `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
    '_blank',
    'width=550,height=420'
  );
};

export const shareViaEmail = (data: ShareData) => {
  const subject = encodeURIComponent(data.title);
  const body = encodeURIComponent(`${data.text}\n\n${data.url || window.location.href}`);
  window.location.href = `mailto:?subject=${subject}&body=${body}`;
};

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy:', err);
    return false;
  }
};

export const nativeShare = async (data: ShareData): Promise<boolean> => {
  if (!navigator.share) {
    return false;
  }

  try {
    await navigator.share({
      title: data.title,
      text: data.text,
      url: data.url || window.location.href,
    });
    return true;
  } catch (err) {
    if ((err as Error).name !== 'AbortError') {
      console.error('Share failed:', err);
    }
    return false;
  }
};

// Generate shareable achievement text
export const generateAchievementShareText = (achievement: {
  achievement_name: string;
  points_awarded: number;
}) => {
  return {
    title: `🎉 Achievement Unlocked: ${achievement.achievement_name}!`,
    text: `I just earned ${achievement.points_awarded} points on Mansa Musa Marketplace for ${achievement.achievement_name}! Join me in supporting Black-owned businesses.`,
    url: window.location.origin,
  };
};

// Generate shareable streak text
export const generateStreakShareText = (streak: {
  current_streak: number;
  longest_streak: number;
}) => {
  return {
    title: `🔥 ${streak.current_streak}-Day Shopping Streak!`,
    text: `I'm on a ${streak.current_streak}-day streak supporting Black-owned businesses on Mansa Musa Marketplace! My longest streak is ${streak.longest_streak} days. #SupportBlackBusiness`,
    url: window.location.origin,
  };
};

// Generate shareable impact text
export const generateImpactShareText = (impact: {
  totalSpent?: number;
  businessesSupported?: number;
  communityMultiplier?: number;
}) => {
  const parts = [];
  if (impact.totalSpent) {
    parts.push(`$${impact.totalSpent.toLocaleString()} circulated`);
  }
  if (impact.businessesSupported) {
    parts.push(`${impact.businessesSupported} businesses supported`);
  }
  if (impact.communityMultiplier) {
    parts.push(`${impact.communityMultiplier}x community multiplier`);
  }

  return {
    title: '💪 My Community Impact',
    text: `I'm making an impact with Mansa Musa Marketplace! ${parts.join(', ')}. Join me in building Black economic power!`,
    url: window.location.origin,
  };
};
