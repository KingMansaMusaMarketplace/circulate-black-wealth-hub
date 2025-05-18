
/**
 * Extract YouTube video ID from URL
 */
export const getYouTubeId = (url: string): string | null => {
  // Handle multiple YouTube URL formats
  if (!url) return null;
  
  // First check for standard YouTube formats
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  
  if (match && match[2].length === 11) {
    return match[2];
  }
  
  // If the URL is just the ID (11 characters)
  if (url.length === 11) {
    return url;
  }
  
  // If the URL contains only the ID with possible whitespace
  const trimmedUrl = url.trim();
  if (trimmedUrl.length === 11) {
    return trimmedUrl;
  }
  
  return null;
};

/**
 * TypeScript declarations for YouTube IFrame API
 */
declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}
