
import React from 'react';
import { getYouTubeId } from './youtube';

interface VideoStructuredDataProps {
  src: string;
  title: string;
  description?: string; 
  uploadDate?: string;
  thumbnailUrl?: string;
  isYouTube?: boolean;
}

/**
 * Component that adds Schema.org VideoObject structured data to the page
 * to improve search engine visibility of videos
 */
export const VideoStructuredData: React.FC<VideoStructuredDataProps> = ({
  src,
  title,
  description = "Video content from Mansa Musa Marketplace",
  uploadDate = new Date().toISOString().split('T')[0], // Default to today's date
  thumbnailUrl = "/placeholder.svg",
  isYouTube = false,
}) => {
  // For YouTube videos, we need to use the YouTube URL format
  const videoUrl = isYouTube 
    ? `https://www.youtube.com/watch?v=${getYouTubeId(src)}` 
    : src;
  
  // Generate the VideoObject structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "name": title,
    "description": description,
    "thumbnailUrl": thumbnailUrl,
    "uploadDate": uploadDate,
    "contentUrl": videoUrl,
    "embedUrl": isYouTube 
      ? `https://www.youtube.com/embed/${getYouTubeId(src)}` 
      : undefined
  };

  return (
    <script type="application/ld+json">
      {JSON.stringify(structuredData)}
    </script>
  );
};

export default VideoStructuredData;
