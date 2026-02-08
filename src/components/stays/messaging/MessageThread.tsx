import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { supabase } from '@/integrations/supabase/client';
import { StaysMessage, StaysConversation } from '@/types/vacation-rental';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';
import { Send, Loader2, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

interface MessageThreadProps {
  conversation: StaysConversation;
  onBack?: () => void;
}

const MessageThread: React.FC<MessageThreadProps> = ({ conversation, onBack }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<StaysMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isHost = user?.id === conversation.host_id;

  useEffect(() => {
    fetchMessages();
    markAsRead();
    const cleanup = subscribeToMessages();
    return cleanup;
  }, [conversation.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('stays_messages')
        .select('*')
        .eq('conversation_id', conversation.id)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (err) {
      console.error('Error fetching messages:', err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async () => {
    if (!user) return;
    
    try {
      // Mark messages as read
      await supabase
        .from('stays_messages')
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq('conversation_id', conversation.id)
        .neq('sender_id', user.id)
        .eq('is_read', false);

      // Reset unread count
      const updateField = isHost ? 'host_unread_count' : 'guest_unread_count';
      await supabase
        .from('stays_conversations')
        .update({ [updateField]: 0 })
        .eq('id', conversation.id);
    } catch (err) {
      console.error('Error marking as read:', err);
    }
  };

  const subscribeToMessages = () => {
    const channel = supabase
      .channel(`messages:${conversation.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'stays_messages',
          filter: `conversation_id=eq.${conversation.id}`,
        },
        (payload) => {
          setMessages(prev => [...prev, payload.new as StaysMessage]);
          if (payload.new.sender_id !== user?.id) {
            markAsRead();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async () => {
    if (!newMessage.trim() || !user) return;

    setSending(true);
    try {
      const { error } = await supabase.from('stays_messages').insert({
        conversation_id: conversation.id,
        sender_id: user.id,
        message: newMessage.trim(),
        message_type: 'text',
      });

      if (error) throw error;
      setNewMessage('');
    } catch (err) {
      console.error('Error sending message:', err);
      toast.error('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-mansagold" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-white/10 flex items-center gap-3">
        {onBack && (
          <Button variant="ghost" size="icon" onClick={onBack} className="md:hidden">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        )}
        <div>
          <h3 className="font-medium text-white">
            {conversation.property?.title || 'Property'}
          </h3>
          <p className="text-sm text-white/60">
            {isHost ? 'Guest inquiry' : 'Host conversation'}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-white/40 py-8">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isOwn = msg.sender_id === user?.id;
            return (
              <div
                key={msg.id}
                className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[75%] rounded-lg px-4 py-2 ${
                    isOwn
                      ? 'bg-mansagold text-black'
                      : 'bg-slate-700 text-white'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.message}</p>
                  <p
                    className={`text-xs mt-1 ${
                      isOwn ? 'text-black/60' : 'text-white/40'
                    }`}
                  >
                    {format(new Date(msg.created_at), 'MMM d, h:mm a')}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-white/10">
        <div className="flex gap-2">
          <Textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type a message..."
            className="bg-slate-800 border-white/20 text-white placeholder:text-white/40 resize-none"
            rows={2}
          />
          <Button
            onClick={handleSend}
            disabled={!newMessage.trim() || sending}
            className="bg-mansagold text-black hover:bg-mansagold/90 px-4"
          >
            {sending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MessageThread;
