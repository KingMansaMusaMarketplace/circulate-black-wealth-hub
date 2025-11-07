import React, { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Mic, MicOff, Loader2 } from 'lucide-react';

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
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    // Check if Web Speech API is supported
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSupported(false);
      toast.error('Speech recognition not supported', {
        description: 'Please use Chrome, Edge, or Safari'
      });
    }
    
    // Load voices (they may not be immediately available)
    window.speechSynthesis.getVoices();
    window.speechSynthesis.onvoiceschanged = () => {
      window.speechSynthesis.getVoices();
    };
  }, []);

  const speak = (text: string) => {
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Get available voices and select a more natural one
    const voices = window.speechSynthesis.getVoices();
    const preferredVoices = voices.filter(voice => 
      voice.name.includes('Natural') || 
      voice.name.includes('Premium') ||
      voice.name.includes('Enhanced') ||
      voice.name.includes('Samantha') ||
      voice.name.includes('Google US English') ||
      (voice.lang.startsWith('en') && voice.localService === false)
    );
    
    if (preferredVoices.length > 0) {
      utterance.voice = preferredVoices[0];
    } else if (voices.length > 0) {
      // Fallback to first English voice
      const englishVoice = voices.find(v => v.lang.startsWith('en'));
      if (englishVoice) utterance.voice = englishVoice;
    }
    
    utterance.rate = 0.95; // Slightly slower for clarity
    utterance.pitch = 1.05; // Slightly higher for friendliness
    utterance.volume = 1.0;
    
    utterance.onstart = () => onSpeakingChange?.(true);
    utterance.onend = () => onSpeakingChange?.(false);
    utterance.onerror = () => onSpeakingChange?.(false);
    
    synthRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const startRecording = async () => {
    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        throw new Error('Speech recognition not supported in this browser');
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsRecording(true);
        toast.success('Listening...', {
          description: 'Speak now'
        });
      };

      recognition.onresult = async (event: any) => {
        const transcript = event.results[0][0].transcript;
        console.log('You said:', transcript);
        
        setIsRecording(false);
        setIsProcessing(true);

        try {
          // Get AI response using Lovable AI
          const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-chat`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`
            },
            body: JSON.stringify({
              messages: [
                { role: 'system', content: 'You are a helpful AI assistant. Keep your responses clear, concise, and friendly.' },
                { role: 'user', content: transcript }
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
