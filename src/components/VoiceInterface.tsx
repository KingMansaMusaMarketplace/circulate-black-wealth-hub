import React, { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface VoiceInterfaceProps {
  onSpeakingChange?: (speaking: boolean) => void;
}

// Extend window type for webkit support
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

const VoiceInterface: React.FC<VoiceInterfaceProps> = ({ onSpeakingChange }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [interimTranscript, setInterimTranscript] = useState('');
  const recognitionRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Check if Web Speech API is supported
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSupported(false);
      toast.error('Speech recognition not supported', {
        description: 'Please use Chrome, Edge, or Safari'
      });
    }
  }, []);

  const speak = async (text: string) => {
    try {
      // Stop any currently playing audio
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }

      onSpeakingChange?.(true);
      
      // Use direct fetch for binary audio response
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/text-to-speech`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`
        },
        body: JSON.stringify({ text })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to generate speech');
      }

      // Get audio blob from response
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      
      audio.onended = () => {
        URL.revokeObjectURL(audioUrl);
        audioRef.current = null;
        onSpeakingChange?.(false);
      };
      
      audio.onerror = () => {
        URL.revokeObjectURL(audioUrl);
        audioRef.current = null;
        onSpeakingChange?.(false);
        toast.error('Audio Error', {
          description: 'Failed to play audio response'
        });
      };
      
      await audio.play();
    } catch (error) {
      console.error('Error speaking:', error);
      onSpeakingChange?.(false);
      toast.error('Speech Error', {
        description: error instanceof Error ? error.message : 'Failed to generate speech'
      });
    }
  };

  const startRecording = async () => {
    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        throw new Error('Speech recognition not supported in this browser');
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      recognition.maxAlternatives = 3;

      recognition.onstart = () => {
        setIsRecording(true);
        setInterimTranscript('');
        toast.success('Listening...', {
          description: 'Speak clearly and naturally'
        });
      };

      recognition.onresult = async (event: any) => {
        let finalTranscript = '';
        let interim = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interim += transcript;
          }
        }
        
        setInterimTranscript(interim);
        
        if (!finalTranscript) return;
        
        console.log('You said:', finalTranscript);
        
        setIsRecording(false);
        setInterimTranscript('');
        setIsProcessing(true);

        try {
          // Get AI response using Lovable AI (system prompt handled by edge function)
          const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-chat`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`
            },
            body: JSON.stringify({
              messages: [
                { role: 'user', content: finalTranscript.trim() }
              ]
            })
          });

          if (!response.ok) throw new Error('AI response failed');

          // Parse streaming response
          const reader = response.body?.getReader();
          const decoder = new TextDecoder();
          let aiResponse = '';

          if (reader) {
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;

              const chunk = decoder.decode(value);
              const lines = chunk.split('\n').filter(line => line.trim().startsWith('data: '));
              
              for (const line of lines) {
                const data = line.replace('data: ', '').trim();
                if (data === '[DONE]') continue;
                
                try {
                  const parsed = JSON.parse(data);
                  const content = parsed.choices?.[0]?.delta?.content;
                  if (content) aiResponse += content;
                } catch (e) {
                  // Skip invalid JSON
                }
              }
            }
          }

          if (!aiResponse) throw new Error('No AI response received');

          console.log('AI response:', aiResponse);
          speak(aiResponse);

        } catch (error) {
          console.error('Voice assistant error:', error);
          toast.error('Voice assistant error', {
            description: error instanceof Error ? error.message : 'Unknown error'
          });
        } finally {
          setIsProcessing(false);
        }
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
        setIsProcessing(false);
        
        if (event.error === 'no-speech') {
          toast.error('No speech detected', {
            description: 'Please try again and speak clearly'
          });
        } else if (event.error === 'not-allowed') {
          toast.error('Microphone access denied', {
            description: 'Please allow microphone access'
          });
        } else {
          toast.error('Speech recognition failed', {
            description: event.error
          });
        }
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
      recognition.start();

    } catch (error) {
      console.error('Error starting recording:', error);
      toast.error('Failed to start recording', {
        description: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 z-50">
      {interimTranscript && (
        <div className="bg-background/95 backdrop-blur-sm border border-border rounded-lg px-4 py-2 max-w-md">
          <p className="text-sm text-muted-foreground italic">{interimTranscript}</p>
        </div>
      )}
      
      {!isRecording ? (
        <Button 
          onClick={startRecording}
          disabled={isProcessing || !isSupported}
          size="lg"
          className="bg-primary hover:bg-primary/90 text-white shadow-lg"
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Mic className="mr-2 h-5 w-5" />
              {isSupported ? 'Start Recording' : 'Not Supported'}
            </>
          )}
        </Button>
      ) : (
        <Button 
          onClick={stopRecording}
          size="lg"
          variant="destructive"
          className="shadow-lg animate-pulse"
        >
          <MicOff className="mr-2 h-5 w-5" />
          Listening...
        </Button>
      )}
    </div>
  );
};

export default VoiceInterface;
