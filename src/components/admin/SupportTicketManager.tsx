import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Ticket, Search, MessageSquare, Clock, User, AlertCircle, CheckCircle, Send } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

interface SupportTicket {
  id: string;
  ticket_number: string;
  user_id: string;
  subject: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  assigned_to: string | null;
  created_at: string;
  updated_at: string;
  resolved_at: string | null;
  resolution_notes: string | null;
}

interface TicketMessage {
  id: string;
  ticket_id: string;
  sender_id: string;
  message: string;
  is_internal_note: boolean;
  created_at: string;
}

const SupportTicketManager: React.FC = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [isInternalNote, setIsInternalNote] = useState(false);

  const { data: tickets, isLoading } = useQuery({
    queryKey: ['support-tickets', statusFilter, priorityFilter],
    queryFn: async () => {
      let query = supabase
        .from('support_tickets')
        .select('*')
        .order('created_at', { ascending: false });

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }
      if (priorityFilter !== 'all') {
        query = query.eq('priority', priorityFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as SupportTicket[];
    }
  });

  const { data: ticketMessages } = useQuery({
    queryKey: ['ticket-messages', selectedTicket?.id],
    queryFn: async () => {
      if (!selectedTicket) return [];
      const { data, error } = await supabase
        .from('support_ticket_messages')
        .select('*')
        .eq('ticket_id', selectedTicket.id)
        .order('created_at', { ascending: true });
      if (error) throw error;
      return data as TicketMessage[];
    },
    enabled: !!selectedTicket
  });

  const updateTicketMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<SupportTicket> }) => {
      const { error } = await supabase
        .from('support_tickets')
        .update(updates)
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['support-tickets'] });
      toast.success('Ticket updated');
    }
  });

  const sendReplyMutation = useMutation({
    mutationFn: async () => {
      if (!selectedTicket || !replyMessage.trim()) return;
      const { error } = await supabase
        .from('support_ticket_messages')
        .insert({
          ticket_id: selectedTicket.id,
          sender_id: user?.id,
          message: replyMessage,
          is_internal_note: isInternalNote
        });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ticket-messages'] });
      setReplyMessage('');
      toast.success(isInternalNote ? 'Internal note added' : 'Reply sent');
    }
  });

  const filteredTickets = tickets?.filter(ticket =>
    searchTerm === '' ||
    ticket.ticket_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-green-500/20 text-green-400 border-green-500/30';
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

  const stats = {
    open: tickets?.filter(t => t.status === 'open').length || 0,
    inProgress: tickets?.filter(t => t.status === 'in_progress').length || 0,
    urgent: tickets?.filter(t => t.priority === 'urgent' && t.status !== 'resolved' && t.status !== 'closed').length || 0,
    resolved: tickets?.filter(t => t.status === 'resolved' || t.status === 'closed').length || 0
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-blue-500/10 border-blue-500/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Ticket className="h-8 w-8 text-blue-400" />
              <div>
                <p className="text-white/60 text-sm">Open</p>
                <p className="text-2xl font-bold text-blue-400">{stats.open}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-purple-500/10 border-purple-500/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Clock className="h-8 w-8 text-purple-400" />
              <div>
                <p className="text-white/60 text-sm">In Progress</p>
                <p className="text-2xl font-bold text-purple-400">{stats.inProgress}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-red-500/10 border-red-500/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-8 w-8 text-red-400" />
              <div>
                <p className="text-white/60 text-sm">Urgent</p>
                <p className="text-2xl font-bold text-red-400">{stats.urgent}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-green-500/10 border-green-500/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-green-400" />
              <div>
                <p className="text-white/60 text-sm">Resolved</p>
                <p className="text-2xl font-bold text-green-400">{stats.resolved}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Ticket className="h-5 w-5 text-mansagold" />
            Support Tickets
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
              <Input
                placeholder="Search tickets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/5 border-white/20 text-white"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px] bg-white/5 border-white/20 text-white">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="waiting_on_user">Waiting</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-[150px] bg-white/5 border-white/20 text-white">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Ticket List */}
          <ScrollArea className="h-[500px]">
            {isLoading ? (
              <div className="flex items-center justify-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-mansagold"></div>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredTickets?.map((ticket) => (
                  <Dialog key={ticket.id}>
                    <DialogTrigger asChild>
                      <div
                        onClick={() => setSelectedTicket(ticket)}
                        className="p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors cursor-pointer"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-mansagold font-mono text-sm">{ticket.ticket_number}</span>
                              <Badge className={getPriorityColor(ticket.priority)}>{ticket.priority}</Badge>
                              <Badge className={getStatusColor(ticket.status)}>{ticket.status.replace('_', ' ')}</Badge>
                            </div>
                            <h4 className="text-white font-medium truncate">{ticket.subject}</h4>
                            <p className="text-white/60 text-sm truncate mt-1">{ticket.description}</p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-white/60 text-xs">{format(new Date(ticket.created_at), 'MMM d, HH:mm')}</p>
                            <Badge variant="outline" className="mt-1 text-xs">{ticket.category}</Badge>
                          </div>
                        </div>
                      </div>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl bg-mansablue-dark border-white/20">
                      <DialogHeader>
                        <DialogTitle className="text-white flex items-center gap-2">
                          <span className="text-mansagold">{ticket.ticket_number}</span>
                          <span>-</span>
                          <span>{ticket.subject}</span>
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        {/* Ticket Actions */}
                        <div className="flex gap-2 flex-wrap">
                          <Select
                            value={ticket.status}
                            onValueChange={(value) => updateTicketMutation.mutate({ id: ticket.id, updates: { status: value } })}
                          >
                            <SelectTrigger className="w-[150px] bg-white/5 border-white/20 text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="open">Open</SelectItem>
                              <SelectItem value="in_progress">In Progress</SelectItem>
                              <SelectItem value="waiting_on_user">Waiting on User</SelectItem>
                              <SelectItem value="resolved">Resolved</SelectItem>
                              <SelectItem value="closed">Closed</SelectItem>
                            </SelectContent>
                          </Select>
                          <Select
                            value={ticket.priority}
                            onValueChange={(value) => updateTicketMutation.mutate({ id: ticket.id, updates: { priority: value } })}
                          >
                            <SelectTrigger className="w-[130px] bg-white/5 border-white/20 text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="low">Low</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="high">High</SelectItem>
                              <SelectItem value="urgent">Urgent</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Original Message */}
                        <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                          <div className="flex items-center gap-2 mb-2">
                            <User className="h-4 w-4 text-white/60" />
                            <span className="text-white/60 text-sm">Original Request</span>
                          </div>
                          <p className="text-white/80">{ticket.description}</p>
                        </div>

                        {/* Messages */}
                        <ScrollArea className="h-[200px]">
                          <div className="space-y-3">
                            {ticketMessages?.map((msg) => (
                              <div
                                key={msg.id}
                                className={`p-3 rounded-lg ${
                                  msg.is_internal_note
                                    ? 'bg-yellow-500/10 border border-yellow-500/30'
                                    : 'bg-white/5 border border-white/10'
                                }`}
                              >
                                <div className="flex items-center gap-2 mb-1">
                                  <MessageSquare className="h-3 w-3 text-white/60" />
                                  <span className="text-white/60 text-xs">
                                    {format(new Date(msg.created_at), 'MMM d, HH:mm')}
                                  </span>
                                  {msg.is_internal_note && (
                                    <Badge variant="outline" className="text-xs text-yellow-400 border-yellow-400/30">
                                      Internal Note
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-white/80 text-sm">{msg.message}</p>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>

                        {/* Reply Form */}
                        <div className="space-y-3">
                          <Textarea
                            placeholder="Type your reply..."
                            value={replyMessage}
                            onChange={(e) => setReplyMessage(e.target.value)}
                            className="bg-white/5 border-white/20 text-white min-h-[100px]"
                          />
                          <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 text-white/60 text-sm cursor-pointer">
                              <input
                                type="checkbox"
                                checked={isInternalNote}
                                onChange={(e) => setIsInternalNote(e.target.checked)}
                                className="rounded border-white/20"
                              />
                              Internal note (not visible to user)
                            </label>
                            <Button
                              onClick={() => sendReplyMutation.mutate()}
                              disabled={!replyMessage.trim()}
                              className="bg-mansagold hover:bg-mansagold/90 text-mansablue-dark"
                            >
                              <Send className="h-4 w-4 mr-2" />
                              {isInternalNote ? 'Add Note' : 'Send Reply'}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                ))}
                {filteredTickets?.length === 0 && (
                  <div className="text-center py-12 text-white/60">
                    No tickets found
                  </div>
                )}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default SupportTicketManager;
