import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { AudioRecorder } from '@/utils/AudioRecorder';
import { supabase } from '@/integrations/supabase/client';
import { Mic, MicOff, Loader2 } from 'lucide-react';

interface VoiceInterfaceProps {
  onSpeakingChange?: (speaking: boolean) => void;
}

const VoiceInterface: React.FC<VoiceInterfaceProps> = ({ onSpeakingChange }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const recorderRef = useRef<AudioRecorder | null>(null);
  const synthRef = useRef<SpeechSynthesisUtterance | null>(null);

  const speak = (text: string) => {
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    
    utterance.onstart = () => onSpeakingChange?.(true);
    utterance.onend = () => onSpeakingChange?.(false);
    utterance.onerror = () => onSpeakingChange?.(false);
    
    synthRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const startRecording = async () => {
    try {
      recorderRef.current = new AudioRecorder();
      await recorderRef.current.startRecording();
      setIsRecording(true);
      toast.success('Listening...', {
        description: 'Speak now, then click Stop'
      });
    } catch (error) {
      console.error('Error starting recording:', error);
      toast.error('Failed to access microphone', {
        description: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  const stopRecording = async () => {
    if (!recorderRef.current) return;

    try {
      setIsRecording(false);
      setIsProcessing(true);

      const audioBlob = await recorderRef.current.stopRecording();
      const base64Audio = await recorderRef.current.blobToBase64(audioBlob);

      console.log('Transcribing audio...');
      const { data: transcription, error: transcribeError } = await supabase.functions.invoke('transcribe-audio', {
        body: { audio: base64Audio }
      });

      if (transcribeError) throw transcribeError;
      if (!transcription?.text) throw new Error('No transcription received');

      console.log('You said:', transcription.text);

      // Get AI response using existing chat function
      const response = await fetch(`https://agoclnqfyinwjxdmjnns.supabase.co/functions/v1/ai-chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFnb2NsbnFmeWlud2p4ZG1qbm5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY1OTUyMjUsImV4cCI6MjA2MjE3MTIyNX0.9upJQa6LxK7_0waLixPY5403mpvckXVIvd8GGcDs-bQ`
        },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: 'You are a helpful AI assistant. Keep your responses clear, concise, and friendly.' },
            { role: 'user', content: transcription.text }
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

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 z-50">
      {!isRecording ? (
        <Button 
          onClick={startRecording}
          disabled={isProcessing}
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
              Start Recording
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
          Stop Recording
        </Button>
      )}
    </div>
  );
};

export default VoiceInterface;
