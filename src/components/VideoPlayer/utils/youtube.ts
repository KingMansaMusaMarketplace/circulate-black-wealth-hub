
/**
 * Extract YouTube video ID from URL
 */
export const getYouTubeId = (url: string): string | null => {
  // Handle multiple YouTube URL formats
  if (!url) return null;
  
  // Remove any URL parameters (like timestamp)
  const urlWithoutParams = url.split('&')[0];
  
  // First check for standard YouTube formats
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = urlWithoutParams.match(regExp);
  
  if (match && match[2].length === 11) {
    return match[2];
  }
  
  // If the URL is just the ID (11 characters)
  if (urlWithoutParams.length === 11 && /^[a-zA-Z0-9_-]{11}$/.test(urlWithoutParams)) {
    return urlWithoutParams;
  }
  
  // If the URL contains only the ID with possible whitespace
  const trimmedUrl = urlWithoutParams.trim();
  if (trimmedUrl.length === 11 && /^[a-zA-Z0-9_-]{11}$/.test(trimmedUrl)) {
    return trimmedUrl;
  }
  
  // Handle youtu.be format
  const youtuBeMatch = urlWithoutParams.match(/youtu\.be\/([^?]*)/);
  if (youtuBeMatch && youtuBeMatch[1].length === 11) {
    return youtuBeMatch[1];
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
