
import React, { useRef, useEffect } from 'react';

interface StandardPlayerProps {
  src: string;
  posterImage: string;
  isPlaying: boolean;
  isMuted: boolean;
  onStateChange: (isPlaying: boolean) => void;
  onEnded: () => void;
}

const StandardPlayer: React.FC<StandardPlayerProps> = ({
  src,
  posterImage,
  isPlaying,
  isMuted,
  onStateChange,
  onEnded
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Handle play/pause based on isPlaying prop
  useEffect(() => {
    if (!videoRef.current) return;
    
    if (isPlaying) {
      videoRef.current.play().catch(error => {
        console.error("Error playing video:", error);
        onStateChange(false);
      });
    } else {
      videoRef.current.pause();
    }
  }, [isPlaying, onStateChange]);
  
  // Handle mute state based on isMuted prop
  useEffect(() => {
    if (!videoRef.current) return;
    videoRef.current.muted = isMuted;
  }, [isMuted]);

  // Remove poster image when the video has played at all
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
    const handleTimeUpdate = () => {
      if (video.currentTime > 0 && video.getAttribute('poster')) {
        video.removeAttribute('poster');
      }
    };
    
    video.addEventListener('timeupdate', handleTimeUpdate);
    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, []);

  return (
    <div className="w-full h-full bg-black">
      <video
        ref={videoRef}
        src={src}
        poster={posterImage}
        className="w-full h-full object-cover bg-black"
        onEnded={() => {
          onEnded();
          if (videoRef.current) {
            videoRef.current.removeAttribute('poster');
          }
        }}
        onPlay={() => onStateChange(true)}
        onPause={() => onStateChange(false)}
      />
    </div>
  );
};

export default StandardPlayer;
