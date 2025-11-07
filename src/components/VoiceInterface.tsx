import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { RealtimeChat } from '@/utils/RealtimeAudio';
import { Mic, MicOff } from 'lucide-react';

interface VoiceInterfaceProps {
  onSpeakingChange?: (speaking: boolean) => void;
}

const VoiceInterface: React.FC<VoiceInterfaceProps> = ({ onSpeakingChange }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const chatRef = useRef<RealtimeChat | null>(null);

  const handleMessage = (event: any) => {
    console.log('Received message:', event);
    
    // Handle different event types
    if (event.type === 'response.audio.delta') {
      onSpeakingChange?.(true);
    } else if (event.type === 'response.audio.done') {
      onSpeakingChange?.(false);
    } else if (event.type === 'response.done') {
      // Catch model failures and surface to user
      const status = event.response?.status;
      if (status === 'failed') {
        const err = event.response?.status_details?.error;
        const msg = err?.message || 'Voice model failed to respond';
        console.error('Realtime response failed:', err || event);
        toast.error('Voice assistant error', { description: msg });
        try { chatRef.current?.disconnect(); } catch {}
        setIsConnected(false);
        onSpeakingChange?.(false);
      }
    } else if (event.type === 'error') {
      console.error('Realtime API error:', event);
      toast.error('An error occurred: ' + (event.error?.message || 'Unknown error'));
    }
  };

  const startConversation = async () => {
    setIsLoading(true);
    try {
      console.log('Starting conversation...');
      chatRef.current = new RealtimeChat(handleMessage);
      await chatRef.current.init();
      setIsConnected(true);
      
      toast.success('Voice assistant connected', {
        description: 'You can now speak to the AI'
      });
    } catch (error) {
      console.error('Error starting conversation:', error);
      toast.error('Failed to connect', {
        description: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const endConversation = () => {
    chatRef.current?.disconnect();
    setIsConnected(false);
    onSpeakingChange?.(false);
    toast.info('Voice assistant disconnected');
  };

  useEffect(() => {
    return () => {
      chatRef.current?.disconnect();
    };
  }, []);

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 z-50">
      {!isConnected ? (
        <Button 
          onClick={startConversation}
          disabled={isLoading}
          size="lg"
          className="bg-primary hover:bg-primary/90 text-white shadow-lg"
        >
          {isLoading ? (
            <>Starting...</>
          ) : (
            <>
              <Mic className="mr-2 h-5 w-5" />
              Start Voice Assistant
            </>
          )}
        </Button>
      ) : (
        <Button 
          onClick={endConversation}
          size="lg"
          variant="destructive"
          className="shadow-lg"
        >
          <MicOff className="mr-2 h-5 w-5" />
          End Conversation
        </Button>
      )}
    </div>
  );
};

export default VoiceInterface;
