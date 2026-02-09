import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface StartConversationParams {
  propertyId: string;
  hostId: string;
  initialMessage?: string;
  bookingId?: string;
}

export function useStaysMessaging() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const startConversation = async ({
    propertyId,
    hostId,
    initialMessage,
    bookingId,
  }: StartConversationParams): Promise<string | null> => {
    if (!user) {
      toast.error('Please log in to message the host');
      return null;
    }

    if (user.id === hostId) {
      toast.error("You can't message yourself");
      return null;
    }

    setLoading(true);
    try {
      // Check if conversation already exists
      const { data: existingConv, error: checkError } = await supabase
        .from('stays_conversations')
        .select('id')
        .eq('property_id', propertyId)
        .eq('guest_id', user.id)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        // PGRST116 = no rows found
        throw checkError;
      }

      let conversationId: string;

      if (existingConv) {
        conversationId = existingConv.id;
      } else {
        // Create new conversation
        const { data: newConv, error: createError } = await supabase
          .from('stays_conversations')
          .insert({
            property_id: propertyId,
            guest_id: user.id,
            host_id: hostId,
            booking_id: bookingId || null,
            subject: initialMessage?.slice(0, 100) || 'New inquiry',
            guest_unread_count: 0,
            host_unread_count: 0,
          })
          .select('id')
          .single();

        if (createError) throw createError;
        conversationId = newConv.id;
      }

      // Send initial message if provided
      if (initialMessage && initialMessage.trim()) {
        const { error: msgError } = await supabase
          .from('stays_messages')
          .insert({
            conversation_id: conversationId,
            sender_id: user.id,
            message: initialMessage.trim(),
            message_type: 'text',
          });

        if (msgError) throw msgError;

        // Update host unread count
        await supabase
          .from('stays_conversations')
          .update({ 
            host_unread_count: 1,
            last_message_at: new Date().toISOString(),
          })
          .eq('id', conversationId);
      }

      return conversationId;
    } catch (err) {
      console.error('Error starting conversation:', err);
      toast.error('Failed to start conversation');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const openMessaging = (conversationId?: string) => {
    if (conversationId) {
      navigate(`/stays/messages?conversation=${conversationId}`);
    } else {
      navigate('/stays/messages');
    }
  };

  const getUnreadCount = async (): Promise<number> => {
    if (!user) return 0;

    try {
      const { data, error } = await supabase
        .from('stays_conversations')
        .select('guest_unread_count, host_unread_count, guest_id, host_id')
        .or(`guest_id.eq.${user.id},host_id.eq.${user.id}`);

      if (error) throw error;

      return (data || []).reduce((total, conv) => {
        if (conv.guest_id === user.id) {
          return total + (conv.guest_unread_count || 0);
        } else {
          return total + (conv.host_unread_count || 0);
        }
      }, 0);
    } catch (err) {
      console.error('Error getting unread count:', err);
      return 0;
    }
  };

  return {
    startConversation,
    openMessaging,
    getUnreadCount,
    loading,
  };
}

export default useStaysMessaging;
