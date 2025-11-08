import React, { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface VoiceInterfaceProps {
  onSpeakingChange?: (speaking: boolean) => void;
}

const VoiceInterface: React.FC<VoiceInterfaceProps> = ({ onSpeakingChange }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState<'transcribing' | 'thinking' | 'speaking' | null>(null);
  const [assistantSpeaking, setAssistantSpeaking] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const assistantSpeakingRef = useRef(false);
  
  // Check if introduction was already given in this session
  const hasIntroducedInSession = () => {
    return sessionStorage.getItem('kayla_introduced') === 'true';
  };
  
  const markIntroduced = () => {
    sessionStorage.setItem('kayla_introduced', 'true');
  };

  useEffect(() => {
    assistantSpeakingRef.current = assistantSpeaking;
  }, [assistantSpeaking]);

  const speak = async (text: string) => {
    try {
      // Stop any currently playing audio immediately
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current = null;
      }

      // Wait a brief moment to ensure previous audio is fully stopped
      await new Promise(resolve => setTimeout(resolve, 100));

      setProcessingStage('speaking');
      onSpeakingChange?.(true);
      setAssistantSpeaking(true);
      
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
      
      // iOS requires loading before playing
      audio.load();
      
      audio.onended = () => {
        URL.revokeObjectURL(audioUrl);
        audioRef.current = null;
        setAssistantSpeaking(false);
        setProcessingStage(null);
        onSpeakingChange?.(false);
      };
      
      audio.onerror = () => {
        URL.revokeObjectURL(audioUrl);
        audioRef.current = null;
        setAssistantSpeaking(false);
        setProcessingStage(null);
        onSpeakingChange?.(false);
        toast.error('Audio Error', {
          description: 'Failed to play audio response'
        });
      };
      
      // Handle iOS autoplay restrictions
      try {
        await audio.play();
      } catch (playError) {
        console.error('Audio playback error:', playError);
        // iOS might block autoplay, inform user
        toast.error('Audio Playback', {
          description: 'Please tap to hear the response'
        });
        throw playError;
      }
    } catch (error) {
      console.error('Error speaking:', error);
      onSpeakingChange?.(false);
      setAssistantSpeaking(false);
      setProcessingStage(null);
      toast.error('Speech Error', {
        description: error instanceof Error ? error.message : 'Failed to generate speech'
      });
    }
  };

  const startRecording = async () => {
    try {
      // First time introduction (once per session)
      if (!hasIntroducedInSession()) {
        markIntroduced();
        await speak("Welcome to Mansa Musa Marketplace. My name is Kayla, how can I help you?");
        return;
      }

      // Request microphone access with iOS-compatible settings
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });
      
      audioChunksRef.current = [];
      
      // Detect iOS and use compatible MIME type
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      let mimeType = 'audio/webm';
      
      if (isIOS) {
        // iOS Safari doesn't support webm, fall back to mp4
        if (MediaRecorder.isTypeSupported('audio/mp4')) {
          mimeType = 'audio/mp4';
        } else if (MediaRecorder.isTypeSupported('audio/wav')) {
          mimeType = 'audio/wav';
        }
      }
      
      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: mediaRecorder.mimeType });
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
        
        setIsProcessing(true);
        setProcessingStage('transcribing');

        try {
          // Convert blob to base64
          const fileReader = new FileReader();
          fileReader.readAsDataURL(audioBlob);
          
          const base64Audio = await new Promise<string>((resolve, reject) => {
            fileReader.onloadend = () => {
              const result = fileReader.result as string;
              resolve(result.split(',')[1]);
            };
            fileReader.onerror = reject;
          });

          // Transcribe audio using OpenAI Whisper
          const transcriptResponse = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/transcribe-audio`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`
            },
            body: JSON.stringify({ audio: base64Audio })
          });

          if (!transcriptResponse.ok) {
            const error = await transcriptResponse.json();
            throw new Error(error.error || 'Transcription failed');
          }

          const { text: transcript } = await transcriptResponse.json();
          console.log('You said:', transcript);

          setProcessingStage('thinking');

          // Get AI response using OpenAI
          const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-chat`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`
            },
            body: JSON.stringify({
              messages: [
                { role: 'user', content: transcript }
              ]
            })
          });

          if (!response.ok) throw new Error('AI response failed');

          // Parse streaming response
          const streamReader = response.body?.getReader();
          const decoder = new TextDecoder();
          let aiResponse = '';

          if (streamReader) {
            while (true) {
              const { done, value } = await streamReader.read();
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
          await speak(aiResponse);

        } catch (error) {
          console.error('Voice assistant error:', error);
          setProcessingStage(null);
          toast.error('Voice assistant error', {
            description: error instanceof Error ? error.message : 'Unknown error'
          });
        } finally {
          setIsProcessing(false);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
      
      toast.success('Recording...', {
        description: 'Speak now, then press Stop'
      });

    } catch (error) {
      console.error('Error starting recording:', error);
      toast.error('Failed to start recording', {
        description: error instanceof Error ? error.message : 'Microphone access denied'
      });
    }
  };

  const stopRecording = () => {
    // Forcefully stop any playing audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
      onSpeakingChange?.(false);
      setAssistantSpeaking(false);
    }
    
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    
    setIsRecording(false);
    setProcessingStage(null);
  };

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 z-50">
      {!isRecording ? (
        <Button 
          onClick={assistantSpeaking ? stopRecording : startRecording}
          disabled={isProcessing}
          size="lg"
          className="bg-primary hover:bg-primary/90 text-white shadow-lg touch-target"
          style={{ touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent' }}
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              {processingStage === 'transcribing' && 'Listening...'}
              {processingStage === 'thinking' && 'Kayla is thinking...'}
              {processingStage === 'speaking' && 'Kayla is speaking...'}
              {!processingStage && 'Processing...'}
            </>
          ) : (
            <>
              <Mic className="mr-2 h-5 w-5" />
              {assistantSpeaking ? 'Stop Kayla' : 'Talk to Kayla'}
            </>
          )}
        </Button>
      ) : (
        <Button 
          onClick={stopRecording}
          size="lg"
          variant="destructive"
          className="shadow-lg animate-pulse touch-target"
          style={{ touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent' }}
        >
          <MicOff className="mr-2 h-5 w-5" />
          Stop Recording
        </Button>
      )}
    </div>
  );
};

export default VoiceInterface;
