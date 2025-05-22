
/**
 * Extract a YouTube video ID from a URL
 * @param url YouTube URL or embed code
 * @returns YouTube video ID or null if not found
 */
export const getYouTubeId = (url: string): string | null => {
  if (!url) return null;
  
  // Handle already-extracted IDs
  if (/^[a-zA-Z0-9_-]{11}$/.test(url)) {
    return url;
  }
  
  // Handle full YouTube URLs
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  
  if (match && match[2].length === 11) {
    return match[2];
  }
  
  // Handle shortened URLs
  const shortUrlRegExp = /^.*(youtu.be\/)([^#&?]*).*/;
  const shortMatch = url.match(shortUrlRegExp);
  
  if (shortMatch && shortMatch[2].length === 11) {
    return shortMatch[2];
  }
  
  // Handle "youtu.be" URLs directly
  if (url.includes('youtu.be/')) {
    const parts = url.split('youtu.be/');
    if (parts[1] && parts[1].length >= 11) {
      // Remove any query parameters or hash
      const videoId = parts[1].split(/[?&#]/)[0];
      return videoId;
    }
  }
  
  return null;
};

/**
 * Create a proper YouTube embed URL
 * @param videoId YouTube video ID
 * @returns Full YouTube embed URL
 */
export const getYouTubeEmbedUrl = (videoId: string): string => {
  return `https://www.youtube.com/embed/${videoId}`;
};
