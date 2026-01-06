import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX, Loader2 } from 'lucide-react';
import { useTextToSpeech } from '@/hooks/use-text-to-speech';
import { toast } from 'sonner';

interface HighlightToSpeakButtonProps {
  className?: string;
}

const HighlightToSpeakButton: React.FC<HighlightToSpeakButtonProps> = ({ className }) => {
  const { speak, stop, isSpeaking, isLoading } = useTextToSpeech();
  const [selectedText, setSelectedText] = useState('');
  const [buttonPosition, setButtonPosition] = useState<{ x: number; y: number } | null>(null);

  const handleSelectionChange = useCallback(() => {
    const selection = window.getSelection();
    const text = selection?.toString().trim() || '';
    
    if (text.length > 0) {
      setSelectedText(text);
      
      // Get position for floating button
      const range = selection?.getRangeAt(0);
      if (range) {
        const rect = range.getBoundingClientRect();
        setButtonPosition({
          x: rect.left + rect.width / 2,
          y: rect.top - 10,
        });
      }
    } else {
      // Delay clearing to allow button click
      setTimeout(() => {
        const currentSelection = window.getSelection()?.toString().trim() || '';
        if (currentSelection.length === 0) {
          setSelectedText('');
          setButtonPosition(null);
        }
      }, 200);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('selectionchange', handleSelectionChange);
    document.addEventListener('mouseup', handleSelectionChange);
    
    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
      document.removeEventListener('mouseup', handleSelectionChange);
    };
  }, [handleSelectionChange]);

  const handleSpeak = async () => {
    if (isSpeaking) {
      stop();
      return;
    }

    if (!selectedText) {
      toast.info('Highlight text first', { description: 'Select text on the page to have Sarah read it aloud' });
      return;
    }

    await speak(selectedText);
  };

  // Floating button appears near selection
  if (buttonPosition && selectedText && !isSpeaking && !isLoading) {
    return (
      <Button
        onClick={handleSpeak}
        size="sm"
        className="fixed z-[200] shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground animate-in fade-in zoom-in-95"
        style={{
          left: `${Math.min(buttonPosition.x - 40, window.innerWidth - 100)}px`,
          top: `${Math.max(buttonPosition.y - 40, 10)}px`,
        }}
      >
        <Volume2 className="h-4 w-4 mr-1" />
        Read
      </Button>
    );
  }

  // Fixed button when speaking or loading
  if (isSpeaking || isLoading) {
    return (
      <Button
        onClick={handleSpeak}
        size="sm"
        variant={isSpeaking ? "destructive" : "default"}
        className={`fixed bottom-4 right-4 z-[200] shadow-lg ${className}`}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 mr-1 animate-spin" />
            Loading...
          </>
        ) : (
          <>
            <VolumeX className="h-4 w-4 mr-1" />
            Stop Sarah
          </>
        )}
      </Button>
    );
  }

  return null;
};

export default HighlightToSpeakButton;
