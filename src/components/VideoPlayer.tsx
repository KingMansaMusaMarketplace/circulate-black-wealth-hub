
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
  const [youtubeReady, setYoutubeReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const youtubeContainerRef = useRef<HTMLDivElement>(null);
  const youtubePlayer = useRef<any>(null);

  // Extract YouTube video ID from URL
  const getYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  useEffect(() => {
    if (isYouTube) {
      // Create script tag if it doesn't exist
      if (!window.YT) {
        const tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
      }

      // Initialize player when API is ready
      const onYouTubeIframeAPIReady = () => {
        const videoId = getYouTubeId(src);
        if (!videoId || !youtubeContainerRef.current) return;

        youtubePlayer.current = new window.YT.Player(youtubeContainerRef.current, {
          videoId: videoId,
          playerVars: {
            'playsinline': 1,
            'controls': 0,
            'showinfo': 0,
            'rel': 0,
            'modestbranding': 1
          },
          events: {
            'onReady': () => setYoutubeReady(true),
            'onStateChange': onYouTubeStateChange
          }
        });
      };

      // Set up YouTube API callback
      if (window.YT && window.YT.Player) {
        // If API is already loaded
        onYouTubeIframeAPIReady();
      } else {
        // If API is still loading
        window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;
      }
    }

    return () => {
      // Clean up
      if (youtubePlayer.current) {
        try {
          youtubePlayer.current.destroy();
        } catch (e) {
          console.error("Error destroying YouTube player:", e);
        }
      }
    };
  }, [src, isYouTube]);

  const onYouTubeStateChange = (event: any) => {
    // Update playing state based on YouTube player state
    // YT.PlayerState.PLAYING = 1, YT.PlayerState.PAUSED = 2, YT.PlayerState.ENDED = 0
    if (event.data === 1) {
      setIsPlaying(true);
    } else if (event.data === 2 || event.data === 0) {
      setIsPlaying(false);
    }
  };

  const togglePlay = () => {
    if (isYouTube && youtubePlayer.current) {
      try {
        if (isPlaying) {
          youtubePlayer.current.pauseVideo();
          setIsPlaying(false);
        } else {
          youtubePlayer.current.playVideo();
          setIsPlaying(true);
        }
      } catch (e) {
        console.error("Error controlling YouTube player:", e);
      }
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
      try {
        if (isMuted) {
          youtubePlayer.current.unMute();
        } else {
          youtubePlayer.current.mute();
        }
        setIsMuted(!isMuted);
      } catch (e) {
        console.error("Error toggling YouTube mute:", e);
      }
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
        <div className="relative w-full aspect-video bg-black">
          <div 
            ref={youtubeContainerRef} 
            className="w-full h-full"
            id="youtube-container"
          ></div>
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
