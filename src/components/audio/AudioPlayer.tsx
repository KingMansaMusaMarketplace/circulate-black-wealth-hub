
import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audioSource, setAudioSource] = useState(src);
  
  useEffect(() => {
    // Create audio element
    const audio = new Audio(src);
    audioRef.current = audio;
    
    // Add event listeners
    audio.addEventListener('ended', handleAudioEnded);
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
                setError('Failed to play audio');
              });
          }
        }

        // Add error handler for the fallback as well
        wavAudio.addEventListener('error', () => {
          console.error('WAV audio also failed to load');
          setError('Failed to load audio file');
        });
      } else {
        setError('Failed to load audio file');
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

  const toggleAudio = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      onPause?.();
    } else {
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
            setError('Failed to play audio');
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
        disabled={!!error || disabled}
        {...props}
      >
        {children}
        {isPlaying ? (
          <Pause className="ml-2 h-4 w-4" />
        ) : (
          <Play className="ml-2 h-4 w-4" />
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
      
      {error && (
        <span className="text-red-500 text-sm ml-2">{error}</span>
      )}
    </div>
  );
};
