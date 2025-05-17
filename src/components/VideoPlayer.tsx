
import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

interface VideoPlayerProps {
  src: string;
  title?: string;
  posterImage?: string;
  className?: string;
  isYouTube?: boolean;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  src,
  title = "Circulate Black Wealth",
  posterImage = "/placeholder.svg",
  className = "",
  isYouTube = false
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const youtubeRef = useRef<HTMLIFrameElement>(null);
  const youtubePlayer = useRef<any>(null);

  // Extract YouTube video ID from URL
  const getYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  useEffect(() => {
    if (isYouTube) {
      // Load YouTube iframe API
      const tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

      // Initialize player when API is ready
      window.onYouTubeIframeAPIReady = () => {
        const videoId = getYouTubeId(src);
        if (!videoId) return;

        youtubePlayer.current = new window.YT.Player(youtubeRef.current, {
          videoId,
          playerVars: {
            'playsinline': 1,
            'controls': 0,
            'showinfo': 0,
            'rel': 0,
            'modestbranding': 1
          },
          events: {
            'onStateChange': onYouTubeStateChange
          }
        });
      };
    }

    return () => {
      // Clean up
      if (youtubePlayer.current) {
        youtubePlayer.current.destroy();
      }
      window.onYouTubeIframeAPIReady = null;
    };
  }, [src, isYouTube]);

  const onYouTubeStateChange = (event: any) => {
    // YT.PlayerState.ENDED = 0
    if (event.data === 0) {
      setIsPlaying(false);
    }
  };

  const togglePlay = () => {
    if (isYouTube && youtubePlayer.current) {
      if (isPlaying) {
        youtubePlayer.current.pauseVideo();
      } else {
        youtubePlayer.current.playVideo();
      }
      setIsPlaying(!isPlaying);
    } else if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (isYouTube && youtubePlayer.current) {
      if (isMuted) {
        youtubePlayer.current.unMute();
      } else {
        youtubePlayer.current.mute();
      }
      setIsMuted(!isMuted);
    } else if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(!isMuted);
    }
  };

  const handleVideoEnded = () => {
    setIsPlaying(false);
  };

  return (
    <div className={`relative rounded-xl overflow-hidden shadow-xl ${className}`}>
      {/* Video title */}
      {title && (
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/70 to-transparent p-4 z-10">
          <h3 className="text-white text-lg font-medium">{title}</h3>
        </div>
      )}
      
      {/* Video element */}
      {isYouTube ? (
        <div className="relative w-full aspect-video">
          <div id="youtube-player" className="w-full h-full">
            <iframe 
              ref={youtubeRef}
              className="w-full h-full"
              title={title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      ) : (
        <video
          ref={videoRef}
          src={src}
          poster={posterImage}
          className="w-full h-full object-cover"
          onEnded={handleVideoEnded}
        />
      )}
      
      {/* Play/Pause button */}
      <button
        onClick={togglePlay}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                  bg-mansablue/80 hover:bg-mansablue text-white w-16 h-16 rounded-full 
                  flex items-center justify-center transition-colors z-10
                  border-2 border-white shadow-lg"
        aria-label={isPlaying ? "Pause video" : "Play video"}
      >
        {isPlaying ? (
          <Pause className="w-8 h-8" />
        ) : (
          <Play className="w-8 h-8 ml-1" />
        )}
      </button>
      
      {/* Video controls overlay - appears on hover */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 opacity-0 hover:opacity-100 transition-opacity">
        <div className="flex items-center justify-between">
          <button 
            onClick={togglePlay}
            className="text-white flex items-center"
          >
            {isPlaying ? (
              <>
                <Pause className="w-5 h-5 mr-2" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5 mr-2" />
                <span>Play</span>
              </>
            )}
          </button>
          
          <button
            onClick={toggleMute}
            className="text-white flex items-center"
          >
            {isMuted ? (
              <>
                <VolumeX className="w-5 h-5 mr-2" />
                <span>Unmute</span>
              </>
            ) : (
              <>
                <Volume2 className="w-5 h-5 mr-2" />
                <span>Mute</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// Add the YouTube IFrame API types
declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export default VideoPlayer;
