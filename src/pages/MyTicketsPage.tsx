import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { 
  Ticket, Plus, Clock, CheckCircle, AlertCircle, 
  MessageSquare, Send, ArrowLeft
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface SupportTicket {
  id: string;
  ticket_number: string;
  subject: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  created_at: string;
  updated_at: string;
  resolved_at: string | null;
}

interface TicketMessage {
  id: string;
  message: string;
  is_internal_note: boolean;
  created_at: string;
  sender_id: string;
}

export default function MyTicketsPage() {
  const { user } = useAuth();
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const { data: tickets, isLoading, refetch } = useQuery({
    queryKey: ['my-tickets', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('support_tickets')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as SupportTicket[];
    },
    enabled: !!user?.id
  });

  const { data: messages, refetch: refetchMessages } = useQuery({
    queryKey: ['ticket-messages', selectedTicket?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('support_ticket_messages')
        .select('*')
        .eq('ticket_id', selectedTicket?.id)
        .eq('is_internal_note', false)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data as TicketMessage[];
    },
    enabled: !!selectedTicket?.id
  });

  const handleSendReply = async () => {
    if (!replyMessage.trim() || !selectedTicket || !user) return;

    setIsSending(true);
    try {
      const { error } = await supabase
        .from('support_ticket_messages')
        .insert({
          ticket_id: selectedTicket.id,
          sender_id: user.id,
          message: replyMessage,
          is_internal_note: false
        });

      if (error) throw error;

      // Update ticket status if it was waiting on user
      if (selectedTicket.status === 'waiting_on_user') {
        await supabase
          .from('support_tickets')
          .update({ status: 'open' })
          .eq('id', selectedTicket.id);
      }

      setReplyMessage('');
      refetchMessages();
      toast.success('Reply sent!');
    } catch (error: any) {
      toast.error('Failed to send reply: ' + error.message);
    } finally {
      setIsSending(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-500/20 text-blue-400';
      case 'in_progress': return 'bg-purple-500/20 text-purple-400';
      case 'waiting_on_user': return 'bg-yellow-500/20 text-yellow-400';
      case 'resolved': return 'bg-green-500/20 text-green-400';
      case 'closed': return 'bg-gray-500/20 text-gray-400';
      default: return 'bg-white/20 text-white';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'resolved':
      case 'closed':
        return <CheckCircle className="h-4 w-4" />;
      case 'waiting_on_user':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-green-500/20 text-green-400 border-green-500/30';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/30 rounded-full blur-3xl animate-float" />
      <div className="absolute top-40 right-20 w-96 h-96 bg-yellow-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />

      <div className="container mx-auto p-6 space-y-6 relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" className="text-white hover:bg-white/10">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Home
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <Ticket className="h-8 w-8 text-yellow-400" />
                My Support Tickets
              </h1>
              <p className="text-blue-200 mt-1">Track and manage your support requests</p>
            </div>
          </div>
          <Link to="/submit-ticket">
            <Button className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-slate-900 font-semibold">
              <Plus className="h-4 w-4 mr-2" />
              New Ticket
            </Button>
          </Link>
        </div>

        {/* Tickets List */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Your Tickets</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400" />
              </div>
            ) : tickets?.length === 0 ? (
              <div className="text-center py-12">
                <Ticket className="h-12 w-12 text-blue-200/30 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">No tickets yet</h3>
                <p className="text-blue-200/60 mb-4">Create your first support ticket to get help</p>
                <Link to="/submit-ticket">
                  <Button className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-slate-900">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Ticket
                  </Button>
                </Link>
              </div>
            ) : (
              <ScrollArea className="h-[500px]">
                <div className="space-y-3">
                  {tickets?.map((ticket) => (
                    <div
                      key={ticket.id}
                      onClick={() => setSelectedTicket(ticket)}
                      className="p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-all cursor-pointer"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-yellow-400 font-mono text-sm">{ticket.ticket_number}</span>
                            <Badge className={getPriorityColor(ticket.priority)}>{ticket.priority}</Badge>
                            <Badge className={getStatusColor(ticket.status)}>
                              <span className="flex items-center gap-1">
                                {getStatusIcon(ticket.status)}
                                {ticket.status.replace('_', ' ')}
                              </span>
                            </Badge>
                          </div>
                          <h4 className="text-white font-medium truncate">{ticket.subject}</h4>
                          <p className="text-blue-200/60 text-sm truncate mt-1">{ticket.description}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-blue-200/60 text-xs">{format(new Date(ticket.created_at), 'MMM d, yyyy')}</p>
                          <Badge variant="outline" className="mt-1 text-xs">{ticket.category}</Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>

        {/* Ticket Detail Dialog */}
        <Dialog open={!!selectedTicket} onOpenChange={() => setSelectedTicket(null)}>
          <DialogContent className="max-w-2xl bg-slate-900 border-white/20">
            <DialogHeader>
              <DialogTitle className="text-white flex items-center gap-2">
                <span className="text-yellow-400">{selectedTicket?.ticket_number}</span>
                <span>-</span>
                <span>{selectedTicket?.subject}</span>
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              {/* Status and Meta */}
              <div className="flex items-center gap-2">
                <Badge className={selectedTicket ? getStatusColor(selectedTicket.status) : ''}>
                  {selectedTicket?.status.replace('_', ' ')}
                </Badge>
                <Badge className={selectedTicket ? getPriorityColor(selectedTicket.priority) : ''}>
                  {selectedTicket?.priority}
                </Badge>
                <Badge variant="outline">{selectedTicket?.category}</Badge>
              </div>

              {/* Original Message */}
              <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                <p className="text-sm text-blue-200/60 mb-2">Original Request</p>
                <p className="text-white/80">{selectedTicket?.description}</p>
                <p className="text-xs text-blue-200/40 mt-2">
                  {selectedTicket && format(new Date(selectedTicket.created_at), 'MMM d, yyyy h:mm a')}
                </p>
              </div>

              {/* Messages */}
              <ScrollArea className="h-[200px]">
                <div className="space-y-3">
                  {messages?.map((msg) => (
                    <div
                      key={msg.id}
                      className={`p-3 rounded-lg ${
                        msg.sender_id === user?.id
                          ? 'bg-yellow-500/10 border border-yellow-500/20 ml-8'
                          : 'bg-white/5 border border-white/10 mr-8'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <MessageSquare className="h-3 w-3 text-blue-200/60" />
                        <span className="text-xs text-blue-200/60">
                          {msg.sender_id === user?.id ? 'You' : 'Support'}
                        </span>
                        <span className="text-xs text-blue-200/40">
                          {format(new Date(msg.created_at), 'MMM d, h:mm a')}
                        </span>
                      </div>
                      <p className="text-sm text-white/80">{msg.message}</p>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {/* Reply Form */}
              {selectedTicket?.status !== 'closed' && selectedTicket?.status !== 'resolved' && (
                <div className="space-y-3 pt-4 border-t border-white/10">
                  <Textarea
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    placeholder="Type your reply..."
                    className="bg-white/5 border-white/20 text-white min-h-[100px]"
                  />
                  <div className="flex justify-end">
                    <Button
                      onClick={handleSendReply}
                      disabled={!replyMessage.trim() || isSending}
                      className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-slate-900 font-semibold"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      {isSending ? 'Sending...' : 'Send Reply'}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
