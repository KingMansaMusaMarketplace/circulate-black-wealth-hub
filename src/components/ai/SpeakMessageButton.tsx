import React, { useEffect, useRef, useState } from 'react';
import { Volume2, Square, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

// Global guard so only one message plays at a time across the app.
let currentlyPlayingStop: (() => void) | null = null;

interface SpeakMessageButtonProps {
  text: string;
  className?: string;
  maxChars?: number;
}

export const SpeakMessageButton: React.FC<SpeakMessageButtonProps> = ({
  text,
  className,
  maxChars = 1500,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const urlRef = useRef<string | null>(null);

  const cleanup = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (urlRef.current) {
      URL.revokeObjectURL(urlRef.current);
      urlRef.current = null;
    }
    setIsPlaying(false);
  };

  useEffect(() => () => cleanup(), []);

  const handleClick = async () => {
    if (isPlaying) {
      cleanup();
      currentlyPlayingStop = null;
      return;
    }

    // Stop any other message that may be playing
    if (currentlyPlayingStop) {
      currentlyPlayingStop();
      currentlyPlayingStop = null;
    }

    const trimmed = (text || '').trim();
    if (!trimmed) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('elevenlabs-tts', {
        body: { text: trimmed.slice(0, maxChars) },
      });

      if (error) throw error;

      // Edge function returns audio bytes. supabase-js returns it as Blob.
      let blob: Blob;
      if (data instanceof Blob) {
        blob = data;
      } else if (data instanceof ArrayBuffer) {
        blob = new Blob([data], { type: 'audio/mpeg' });
      } else {
        throw new Error('Unexpected audio response');
      }

      const url = URL.createObjectURL(blob);
      urlRef.current = url;
      const audio = new Audio(url);
      audioRef.current = audio;

      audio.onended = () => {
        cleanup();
        currentlyPlayingStop = null;
      };
      audio.onerror = () => {
        cleanup();
        currentlyPlayingStop = null;
        toast.error('Could not play audio');
      };

      currentlyPlayingStop = () => cleanup();
      await audio.play();
      setIsPlaying(true);
    } catch (err: any) {
      console.error('TTS error:', err);
      toast.error('Could not read message', { description: err?.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={handleClick}
      aria-label={isPlaying ? 'Stop reading' : 'Listen to this message'}
      title={isPlaying ? 'Stop' : 'Listen'}
      className={cn('h-7 px-2 text-xs opacity-70 hover:opacity-100', className)}
    >
      {isLoading ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : isPlaying ? (
        <Square className="h-3.5 w-3.5 fill-current" />
      ) : (
        <Volume2 className="h-3.5 w-3.5" />
      )}
    </Button>
  );
};

export default SpeakMessageButton;
