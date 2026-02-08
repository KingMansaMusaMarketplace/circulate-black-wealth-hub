import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { StaysConversation } from '@/types/vacation-rental';
import { useAuth } from '@/contexts/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import { MessageSquare, Search, Loader2 } from 'lucide-react';

interface ConversationListProps {
  selectedConversationId?: string;
  onSelectConversation: (conversation: StaysConversation) => void;
  isHost?: boolean;
}

const ConversationList: React.FC<ConversationListProps> = ({
  selectedConversationId,
  onSelectConversation,
  isHost = false,
}) => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<StaysConversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (user) {
      fetchConversations();
      subscribeToConversations();
    }
  }, [user]);

  const fetchConversations = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('stays_conversations')
        .select(`
          *,
          vacation_properties (id, title, photos)
        `)
        .or(`guest_id.eq.${user.id},host_id.eq.${user.id}`)
        .order('last_message_at', { ascending: false });

      if (error) throw error;
      
      setConversations(data?.map(conv => ({
        ...conv,
        property: conv.vacation_properties,
      })) || []);
    } catch (err) {
      console.error('Error fetching conversations:', err);
    } finally {
      setLoading(false);
    }
  };

  const subscribeToConversations = () => {
    if (!user) return;

    const channel = supabase
      .channel('conversations')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'stays_conversations',
        },
        () => {
          fetchConversations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const getUnreadCount = (conv: StaysConversation) => {
    if (!user) return 0;
    return isHost ? conv.host_unread_count : conv.guest_unread_count;
  };

  const filteredConversations = conversations.filter(conv => {
    if (!searchQuery) return true;
    const propertyTitle = conv.property?.title?.toLowerCase() || '';
    return propertyTitle.includes(searchQuery.toLowerCase());
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-mansagold" />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Search */}
      <div className="p-3 border-b border-white/10">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-slate-800 border-white/20 text-white placeholder:text-white/40"
          />
        </div>
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-white/60">
            <MessageSquare className="w-12 h-12 mb-3 text-white/30" />
            <p>No conversations yet</p>
            <p className="text-sm text-white/40">
              {isHost ? 'Messages from guests will appear here' : 'Start a conversation with a host'}
            </p>
          </div>
        ) : (
          filteredConversations.map((conv) => {
            const unread = getUnreadCount(conv);
            const propertyPhoto = Array.isArray(conv.property?.photos) && conv.property.photos[0];
            
            return (
              <div
                key={conv.id}
                onClick={() => onSelectConversation(conv)}
                className={`p-3 border-b border-white/5 cursor-pointer transition-all hover:bg-white/5 ${
                  selectedConversationId === conv.id ? 'bg-mansablue/20 border-l-2 border-l-mansagold' : ''
                }`}
              >
                <div className="flex gap-3">
                  <Avatar className="w-12 h-12">
                    {propertyPhoto ? (
                      <AvatarImage src={propertyPhoto} alt={conv.property?.title} />
                    ) : null}
                    <AvatarFallback className="bg-mansablue/30 text-white">
                      {conv.property?.title?.charAt(0) || 'P'}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <h4 className="font-medium text-white truncate">
                        {conv.property?.title || 'Property'}
                      </h4>
                      {unread > 0 && (
                        <Badge className="bg-mansagold text-black text-xs ml-2">
                          {unread}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-white/60 truncate">
                      {conv.subject || 'Conversation'}
                    </p>
                    <p className="text-xs text-white/40 mt-1">
                      {formatDistanceToNow(new Date(conv.last_message_at), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ConversationList;
