import React, { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

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
  
  // Conversation history to maintain context
  const [conversationHistory, setConversationHistory] = useState<Array<{ role: string; content: string }>>(() => {
    const saved = sessionStorage.getItem('kayla_conversation');
    return saved ? JSON.parse(saved) : [];
  });
  
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
      
      // Mobile-specific audio setup
      audio.setAttribute('playsinline', 'true'); // Prevent fullscreen on iOS
      audio.preload = 'auto';
      
      // iOS requires loading before playing
      audio.load();
      
      audio.onended = () => {
        URL.revokeObjectURL(audioUrl);
        audioRef.current = null;
        setAssistantSpeaking(false);
        setProcessingStage(null);
        onSpeakingChange?.(false);
      };
      
      audio.onerror = (e) => {
        console.error('Audio error:', e);
        URL.revokeObjectURL(audioUrl);
        audioRef.current = null;
        setAssistantSpeaking(false);
        setProcessingStage(null);
        onSpeakingChange?.(false);
        toast.error('Audio Error', {
          description: 'Failed to play audio. Please check your volume.'
        });
      };
      
      // Handle mobile autoplay restrictions with retry
      try {
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          await playPromise;
        }
      } catch (playError: any) {
        console.error('Audio playback error:', playError);
        
        // Try to play again after user interaction
        if (playError.name === 'NotAllowedError') {
          toast.error('Tap to Play', {
            description: 'Tap the button again to hear Kayla\'s response',
            duration: 5000
          });
        } else {
          toast.error('Playback Failed', {
            description: 'Unable to play audio. Please check your device settings.'
          });
        }
        throw playError;
      }
    } catch (error) {
      console.error('Error speaking:', error);
      onSpeakingChange?.(false);
      setAssistantSpeaking(false);
      setProcessingStage(null);
    }
  };

  const startRecording = async () => {
    try {
      // Haptic feedback for mobile
      try {
        await Haptics.impact({ style: ImpactStyle.Medium });
      } catch (e) {
        // Haptics not available (web or unsupported device)
      }

      // First time introduction (once per session)
      if (!hasIntroducedInSession()) {
        markIntroduced();
        await speak("Welcome to Mansa Musa Marketplace. My name is Kayla, how can I help you?");
        return;
      }

      // Check for microphone support
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        toast.error('Not Supported', {
          description: 'Your browser doesn\'t support audio recording'
        });
        return;
      }

      // Request microphone access with mobile-optimized settings
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 48000 // Better quality for mobile
        } 
      });
      
      audioChunksRef.current = [];
      
      // Detect device and use best compatible MIME type
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      const isAndroid = /Android/.test(navigator.userAgent);
      let mimeType = 'audio/webm';
      
      if (isIOS) {
        // iOS Safari priority: mp4 > wav
        if (MediaRecorder.isTypeSupported('audio/mp4')) {
          mimeType = 'audio/mp4';
        } else if (MediaRecorder.isTypeSupported('audio/wav')) {
          mimeType = 'audio/wav';
        }
        console.log('iOS detected, using MIME type:', mimeType);
      } else if (isAndroid) {
        // Android Chrome usually supports webm
        if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
          mimeType = 'audio/webm;codecs=opus';
        } else if (MediaRecorder.isTypeSupported('audio/webm')) {
          mimeType = 'audio/webm';
        }
        console.log('Android detected, using MIME type:', mimeType);
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

          // Add user message to conversation history
          const newHistory = [...conversationHistory, { role: 'user', content: transcript }];
          
          // Get AI response using OpenAI with full conversation history
          const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-chat`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`
            },
            body: JSON.stringify({
              messages: newHistory
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
          
          // Update conversation history with AI response
          const updatedHistory = [...newHistory, { role: 'assistant', content: aiResponse }];
          setConversationHistory(updatedHistory);
          sessionStorage.setItem('kayla_conversation', JSON.stringify(updatedHistory));
          
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

    } catch (error: any) {
      console.error('Error starting recording:', error);
      
      let errorMessage = 'Unable to access microphone';
      if (error.name === 'NotAllowedError') {
        errorMessage = 'Microphone permission denied. Please enable it in your device settings.';
      } else if (error.name === 'NotFoundError') {
        errorMessage = 'No microphone found on your device';
      } else if (error.name === 'NotReadableError') {
        errorMessage = 'Microphone is being used by another app';
      }
      
      toast.error('Recording Error', {
        description: errorMessage,
        duration: 5000
      });
    }
  };

  const stopRecording = () => {
    // Haptic feedback for mobile
    try {
      Haptics.impact({ style: ImpactStyle.Light });
    } catch (e) {
      // Haptics not available
    }

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
          className={`${
            isProcessing 
              ? 'kayla-button-idle opacity-80 cursor-not-allowed' 
              : 'kayla-button-idle hover:opacity-90'
          } text-white font-semibold shadow-2xl min-w-[240px] min-h-[64px] text-lg transition-opacity`}
          style={{ 
            touchAction: 'manipulation', 
            WebkitTapHighlightColor: 'transparent',
            WebkitUserSelect: 'none',
            userSelect: 'none'
          }}
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-3 h-6 w-6 animate-spin" />
              <span className="font-medium">
                {processingStage === 'transcribing' && 'Listening...'}
                {processingStage === 'thinking' && 'Kayla is thinking...'}
                {processingStage === 'speaking' && 'Kayla is speaking...'}
                {!processingStage && 'Processing...'}
              </span>
            </>
          ) : (
            <>
              <Mic className={`mr-3 h-6 w-6 ${!assistantSpeaking && 'kayla-mic-icon'}`} />
              <span className="font-medium">
                {assistantSpeaking ? 'Stop Kayla' : 'Talk to Kayla'}
              </span>
            </>
          )}
        </Button>
      ) : (
        <Button 
          onClick={stopRecording}
          size="lg"
          className="kayla-button-active text-white font-semibold shadow-2xl min-w-[240px] min-h-[64px] text-lg"
          style={{ 
            touchAction: 'manipulation', 
            WebkitTapHighlightColor: 'transparent',
            WebkitUserSelect: 'none',
            userSelect: 'none'
          }}
        >
          <MicOff className="mr-3 h-6 w-6 kayla-mic-icon" />
          <span className="font-medium">Stop Recording</span>
        </Button>
      )}
    </div>
  );
};

export default VoiceInterface;
