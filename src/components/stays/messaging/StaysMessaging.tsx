import React, { useState, useEffect } from 'react';
import { StaysConversation } from '@/types/vacation-rental';
import ConversationList from '@/components/stays/messaging/ConversationList';
import MessageThread from '@/components/stays/messaging/MessageThread';
import { Card } from '@/components/ui/card';
import { MessageSquare } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface StaysMessagingProps {
  isHost?: boolean;
  initialConversationId?: string | null;
}

const StaysMessaging: React.FC<StaysMessagingProps> = ({ 
  isHost = false,
  initialConversationId 
}) => {
  const { user } = useAuth();
  const [selectedConversation, setSelectedConversation] = useState<StaysConversation | null>(null);

  // Load initial conversation if provided
  useEffect(() => {
    if (initialConversationId && user) {
      loadConversation(initialConversationId);
    }
  }, [initialConversationId, user]);

  const loadConversation = async (conversationId: string) => {
    try {
      const { data, error } = await supabase
        .from('stays_conversations')
        .select(`
          *,
          vacation_properties (id, title, photos)
        `)
        .eq('id', conversationId)
        .single();

      if (error) throw error;
      
      if (data) {
        setSelectedConversation({
          ...data,
          property: data.vacation_properties,
        } as StaysConversation);
      }
    } catch (err) {
      console.error('Error loading conversation:', err);
    }
  };

  return (
    <div className="h-[600px] flex rounded-lg overflow-hidden border border-white/10 bg-slate-900/50">
      {/* Conversation List - Hidden on mobile when conversation is selected */}
      <div className={`w-full md:w-80 border-r border-white/10 ${selectedConversation ? 'hidden md:block' : ''}`}>
        <ConversationList
          selectedConversationId={selectedConversation?.id}
          onSelectConversation={setSelectedConversation}
          isHost={isHost}
        />
      </div>

      {/* Message Thread */}
      <div className={`flex-1 ${!selectedConversation ? 'hidden md:flex' : 'flex'}`}>
        {selectedConversation ? (
          <MessageThread
            conversation={selectedConversation}
            onBack={() => setSelectedConversation(null)}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center text-white/40">
            <div className="text-center">
              <MessageSquare className="w-16 h-16 mx-auto mb-4 text-white/20" />
              <p className="text-lg">Select a conversation</p>
              <p className="text-sm">Choose a conversation from the list to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StaysMessaging;
