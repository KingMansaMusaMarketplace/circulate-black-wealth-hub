
import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Headphones } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';

interface AudioPlayerProps {
  src: string;
  children: React.ReactNode;
  onPlay?: () => void;
  onPause?: () => void;
  className?: string;
  disabled?: boolean;
  [key: string]: any; // Allow other button props
}

export const AudioPlayer = ({ 
  src, 
  children, 
  onPlay, 
  onPause,
  className = "",
  disabled,
  ...props
}: AudioPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [audioLoaded, setAudioLoaded] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audioSource, setAudioSource] = useState(src);
  
  useEffect(() => {
    // Create audio element
    const audio = new Audio(src);
    audioRef.current = audio;
    
    // Add event listeners
    audio.addEventListener('ended', handleAudioEnded);
    audio.addEventListener('canplaythrough', () => {
      setAudioLoaded(true);
      setError(null);
    });
    
    audio.addEventListener('error', (e) => {
      console.error('Audio error:', e);
      
      // Try the alternative format if available
      if (src.endsWith('.mp3')) {
        const wavSrc = src.replace('.mp3', '.wav');
        console.log('Trying WAV format:', wavSrc);
        
        const wavAudio = new Audio(wavSrc);
        audioRef.current = wavAudio;
        setAudioSource(wavSrc);
        
        wavAudio.addEventListener('ended', handleAudioEnded);
        wavAudio.addEventListener('canplaythrough', () => {
          setAudioLoaded(true);
          setError(null);
        });
        
        // Try to play the WAV automatically if error was during playback
        if (isPlaying) {
          const playPromise = wavAudio.play();
          
          if (playPromise !== undefined) {
            playPromise
              .then(() => {
                setIsPlaying(true);
                onPlay?.();
              })
              .catch(error => {
                console.error("Audio playback error:", error);
                handleAudioError();
              });
          }
        }

        // Add error handler for the fallback as well
        wavAudio.addEventListener('error', () => {
          console.error('WAV audio also failed to load');
          handleAudioError();
        });
      } else {
        handleAudioError();
      }
    });
    
    // Clean up function
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeEventListener('ended', handleAudioEnded);
      }
    };
  }, [src]);

  const handleAudioError = () => {
    setError('Audio file not available');
    setAudioLoaded(false);
    // Don't show the error on the UI, just show a toast when user attempts to play
  };

  const toggleAudio = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      onPause?.();
    } else {
      // Check if the audio has loaded successfully
      if (!audioLoaded && error) {
        // Audio failed to load, show toast message instead
        toast.error("Audio file not available", {
          description: "Please check back later when audio files are uploaded.",
          duration: 3000
        });
        return;
      }
      
      // Play and handle potential errors
      const playPromise = audioRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            onPlay?.();
          })
          .catch(error => {
            console.error("Audio playback error:", error);
            toast.error("Failed to play audio", {
              description: "Please try again later.",
              duration: 3000
            });
          });
      }
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
    onPause?.();
  };

  return (
    <div className="inline-flex items-center">
      <Button 
        className={className}
        onClick={toggleAudio}
        disabled={disabled}
        {...props}
      >
        {children}
        {isPlaying ? (
          <Pause className="ml-2 h-4 w-4" />
        ) : (
          error ? (
            <Headphones className="ml-2 h-4 w-4" />
          ) : (
            <Play className="ml-2 h-4 w-4" />
          )
        )}
      </Button>
      
      {isPlaying && (
        <Button 
          variant="ghost" 
          size="sm" 
          className="ml-1" 
          onClick={toggleMute}
        >
          {isMuted ? (
            <VolumeX className="h-4 w-4" />
          ) : (
            <Volume2 className="h-4 w-4" />
          )}
        </Button>
      )}
    </div>
  );
};
