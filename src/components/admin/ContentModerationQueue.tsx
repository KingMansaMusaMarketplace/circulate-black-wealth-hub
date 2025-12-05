import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Shield, Flag, CheckCircle, XCircle, AlertTriangle, Eye, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

interface ModerationItem {
  id: string;
  content_type: string;
  content_id: string;
  reported_by: string | null;
  reason: string;
  details: string | null;
  status: string;
  reviewed_by: string | null;
  reviewed_at: string | null;
  action_taken: string | null;
  created_at: string;
}

interface FlaggedReview {
  id: string;
  rating: number;
  comment: string | null;
  is_flagged: boolean;
  flag_reason: string | null;
  customer_id: string;
  business_id: string;
  created_at: string;
}

const ContentModerationQueue: React.FC = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState('pending');
  const [selectedItem, setSelectedItem] = useState<ModerationItem | null>(null);
  const [actionNotes, setActionNotes] = useState('');

  const { data: moderationQueue, isLoading } = useQuery({
    queryKey: ['moderation-queue', statusFilter],
    queryFn: async () => {
      let query = supabase
        .from('content_moderation_queue')
        .select('*')
        .order('created_at', { ascending: false });

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as ModerationItem[];
    }
  });

  const { data: flaggedReviews } = useQuery({
    queryKey: ['flagged-reviews'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('is_flagged', true)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as FlaggedReview[];
    }
  });

  const moderateItemMutation = useMutation({
    mutationFn: async ({ id, action }: { id: string; action: 'approved' | 'removed' | 'warned' }) => {
      const { error } = await supabase
        .from('content_moderation_queue')
        .update({
          status: action,
          reviewed_by: user?.id,
          reviewed_at: new Date().toISOString(),
          action_taken: actionNotes || action
        })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['moderation-queue'] });
      setSelectedItem(null);
      setActionNotes('');
      toast.success('Moderation action completed');
    }
  });

  const unflagReviewMutation = useMutation({
    mutationFn: async (reviewId: string) => {
      const { error } = await supabase
        .from('reviews')
        .update({ is_flagged: false, flag_reason: null })
        .eq('id', reviewId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['flagged-reviews'] });
      toast.success('Review unflagged');
    }
  });

  const deleteReviewMutation = useMutation({
    mutationFn: async (reviewId: string) => {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', reviewId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['flagged-reviews'] });
      toast.success('Review deleted');
    }
  });

  const stats = {
    pending: moderationQueue?.filter(m => m.status === 'pending').length || 0,
    flaggedReviews: flaggedReviews?.length || 0,
    approvedToday: moderationQueue?.filter(m => 
      m.status === 'approved' && 
      new Date(m.reviewed_at || '').toDateString() === new Date().toDateString()
    ).length || 0,
    removedToday: moderationQueue?.filter(m => 
      m.status === 'removed' && 
      new Date(m.reviewed_at || '').toDateString() === new Date().toDateString()
    ).length || 0
  };

  const getReasonBadge = (reason: string) => {
    switch (reason.toLowerCase()) {
      case 'spam': return 'bg-orange-500/20 text-orange-400';
      case 'inappropriate': return 'bg-red-500/20 text-red-400';
      case 'harassment': return 'bg-red-600/20 text-red-400';
      case 'fake': return 'bg-purple-500/20 text-purple-400';
      default: return 'bg-white/20 text-white';
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-yellow-500/10 border-yellow-500/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Flag className="h-8 w-8 text-yellow-400" />
              <div>
                <p className="text-white/60 text-sm">Pending Review</p>
                <p className="text-2xl font-bold text-yellow-400">{stats.pending}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-red-500/10 border-red-500/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <MessageSquare className="h-8 w-8 text-red-400" />
              <div>
                <p className="text-white/60 text-sm">Flagged Reviews</p>
                <p className="text-2xl font-bold text-red-400">{stats.flaggedReviews}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-green-500/10 border-green-500/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-green-400" />
              <div>
                <p className="text-white/60 text-sm">Approved Today</p>
                <p className="text-2xl font-bold text-green-400">{stats.approvedToday}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-red-500/10 border-red-500/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <XCircle className="h-8 w-8 text-red-400" />
              <div>
                <p className="text-white/60 text-sm">Removed Today</p>
                <p className="text-2xl font-bold text-red-400">{stats.removedToday}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Flagged Reviews Section */}
      {flaggedReviews && flaggedReviews.length > 0 && (
        <Card className="bg-red-500/5 border-red-500/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-400" />
              Flagged Reviews ({flaggedReviews.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[200px]">
              <div className="space-y-2">
                {flaggedReviews.map((review) => (
                  <div
                    key={review.id}
                    className="p-3 bg-white/5 rounded-lg border border-white/10 flex items-start justify-between"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className="bg-red-500/20 text-red-400">{review.flag_reason || 'Flagged'}</Badge>
                        <span className="text-white/60 text-xs">
                          Rating: {'⭐'.repeat(review.rating)}
                        </span>
                      </div>
                      <p className="text-white/80 text-sm line-clamp-2">{review.comment || 'No comment'}</p>
                      <p className="text-white/40 text-xs mt-1">
                        {format(new Date(review.created_at), 'MMM d, yyyy')}
                      </p>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => unflagReviewMutation.mutate(review.id)}
                        className="border-green-500/30 text-green-400 hover:bg-green-500/10"
                      >
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => deleteReviewMutation.mutate(review.id)}
                        className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                      >
                        <XCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      {/* Moderation Queue */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center gap-2">
              <Shield className="h-5 w-5 text-mansagold" />
              Content Moderation Queue
            </CardTitle>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px] bg-white/5 border-white/20 text-white">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="removed">Removed</SelectItem>
                <SelectItem value="warned">Warned</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px]">
            {isLoading ? (
              <div className="flex items-center justify-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-mansagold"></div>
              </div>
            ) : moderationQueue && moderationQueue.length > 0 ? (
              <div className="space-y-2">
                {moderationQueue.map((item) => (
                  <Dialog key={item.id}>
                    <DialogTrigger asChild>
                      <div
                        onClick={() => setSelectedItem(item)}
                        className="p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors cursor-pointer"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="outline" className="text-xs">{item.content_type}</Badge>
                              <Badge className={getReasonBadge(item.reason)}>{item.reason}</Badge>
                              {item.status !== 'pending' && (
                                <Badge className={
                                  item.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                                  item.status === 'removed' ? 'bg-red-500/20 text-red-400' :
                                  'bg-yellow-500/20 text-yellow-400'
                                }>
                                  {item.status}
                                </Badge>
                              )}
                            </div>
                            <p className="text-white/80 text-sm line-clamp-2">{item.details || 'No details provided'}</p>
                          </div>
                          <div className="text-right shrink-0 ml-4">
                            <p className="text-white/60 text-xs">{format(new Date(item.created_at), 'MMM d, HH:mm')}</p>
                            <Button size="sm" variant="ghost" className="mt-2 text-mansagold">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </DialogTrigger>
                    <DialogContent className="bg-mansablue-dark border-white/20">
                      <DialogHeader>
                        <DialogTitle className="text-white">Review Content</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="p-4 bg-white/5 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline">{item.content_type}</Badge>
                            <Badge className={getReasonBadge(item.reason)}>{item.reason}</Badge>
                          </div>
                          <p className="text-white/80">{item.details || 'No details provided'}</p>
                          <p className="text-white/40 text-xs mt-2">
                            Content ID: {item.content_id}
                          </p>
                        </div>

                        {item.status === 'pending' && (
                          <>
                            <Textarea
                              placeholder="Add notes about your decision..."
                              value={actionNotes}
                              onChange={(e) => setActionNotes(e.target.value)}
                              className="bg-white/5 border-white/20 text-white"
                            />
                            <div className="flex gap-2">
                              <Button
                                onClick={() => moderateItemMutation.mutate({ id: item.id, action: 'approved' })}
                                className="flex-1 bg-green-600 hover:bg-green-700"
                              >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Approve
                              </Button>
                              <Button
                                onClick={() => moderateItemMutation.mutate({ id: item.id, action: 'warned' })}
                                variant="outline"
                                className="flex-1 border-yellow-500/30 text-yellow-400"
                              >
                                <AlertTriangle className="h-4 w-4 mr-2" />
                                Warn
                              </Button>
                              <Button
                                onClick={() => moderateItemMutation.mutate({ id: item.id, action: 'removed' })}
                                variant="destructive"
                                className="flex-1"
                              >
                                <XCircle className="h-4 w-4 mr-2" />
                                Remove
                              </Button>
                            </div>
                          </>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-white/60">
                <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No items in moderation queue</p>
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContentModerationQueue;
