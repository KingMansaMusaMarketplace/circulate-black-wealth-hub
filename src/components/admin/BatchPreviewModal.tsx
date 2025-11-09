import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Loader2, Check, X, Clock, Mail } from 'lucide-react';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';

interface PendingBatch {
  batch_key: string;
  notification_type: string;
  notifications: Array<{
    id: string;
    event_data: any;
    created_at: string;
  }>;
  total_count: number;
  oldest_notification: string;
}

interface BatchPreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const BatchPreviewModal: React.FC<BatchPreviewModalProps> = ({
  open,
  onOpenChange,
}) => {
  const [batches, setBatches] = useState<PendingBatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      fetchPendingBatches();
    }
  }, [open]);

  const fetchPendingBatches = async () => {
    setLoading(true);
    try {
      const { data: queueData, error } = await supabase
        .from('notification_batch_queue')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Group by batch_key
      const batchMap = new Map<string, PendingBatch>();
      
      queueData?.forEach((item) => {
        if (!batchMap.has(item.batch_key)) {
          batchMap.set(item.batch_key, {
            batch_key: item.batch_key,
            notification_type: item.notification_type,
            notifications: [],
            total_count: 0,
            oldest_notification: item.created_at,
          });
        }
        
        const batch = batchMap.get(item.batch_key)!;
        batch.notifications.push({
          id: item.id,
          event_data: item.event_data,
          created_at: item.created_at,
        });
        batch.total_count++;
        
        if (new Date(item.created_at) < new Date(batch.oldest_notification)) {
          batch.oldest_notification = item.created_at;
        }
      });

      setBatches(Array.from(batchMap.values()));
    } catch (error: any) {
      console.error('Error fetching pending batches:', error);
      toast.error('Failed to fetch pending batches');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveBatch = async (batchKey: string) => {
    setProcessing(batchKey);
    try {
      const { data, error } = await supabase.functions.invoke('process-notification-batches', {
        body: { batchKey },
      });

      if (error) throw error;

      const result = data as { batchesProcessed: number; notificationsProcessed: number };
      
      toast.success(
        `Processed ${result.notificationsProcessed} notification(s)`
      );
      
      await fetchPendingBatches();
    } catch (error: any) {
      console.error('Error approving batch:', error);
      toast.error('Failed to approve batch: ' + (error.message || 'Unknown error'));
    } finally {
      setProcessing(null);
    }
  };

  const handleRejectBatch = async (batchKey: string) => {
    setProcessing(batchKey);
    try {
      const { error } = await supabase
        .from('notification_batch_queue')
        .delete()
        .eq('batch_key', batchKey);

      if (error) throw error;

      toast.success('Batch rejected and removed from queue');
      await fetchPendingBatches();
    } catch (error: any) {
      console.error('Error rejecting batch:', error);
      toast.error('Failed to reject batch: ' + (error.message || 'Unknown error'));
    } finally {
      setProcessing(null);
    }
  };

  const getNotificationTypeLabel = (type: string) => {
    switch (type) {
      case 'business_verification':
        return 'Business Verification';
      case 'agent_milestone':
        return 'Agent Milestone';
      default:
        return type;
    }
  };

  const renderEventDetails = (eventData: any, notificationType: string) => {
    if (notificationType === 'business_verification') {
      return (
        <div className="text-sm space-y-1">
          <p><span className="font-medium">Business:</span> {eventData.businessName}</p>
          <p><span className="font-medium">Status:</span> {eventData.status}</p>
        </div>
      );
    } else if (notificationType === 'agent_milestone') {
      return (
        <div className="text-sm space-y-1">
          <p><span className="font-medium">Agent:</span> {eventData.agentName || 'Unknown'}</p>
          <p><span className="font-medium">Milestone:</span> {eventData.milestoneType}</p>
          <p><span className="font-medium">Value:</span> {eventData.value}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Review Pending Notification Batches</DialogTitle>
          <DialogDescription>
            Review and approve or reject pending notification batches before they are sent.
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : batches.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Mail className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No pending batches to review</p>
          </div>
        ) : (
          <ScrollArea className="h-[500px] pr-4">
            <div className="space-y-4">
              {batches.map((batch) => (
                <div
                  key={batch.batch_key}
                  className="border rounded-lg p-4 space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">
                          {getNotificationTypeLabel(batch.notification_type)}
                        </Badge>
                        <Badge variant="secondary">
                          {batch.total_count} notification{batch.total_count !== 1 ? 's' : ''}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        Oldest: {formatDistanceToNow(new Date(batch.oldest_notification), { addSuffix: true })}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRejectBatch(batch.batch_key)}
                        disabled={processing === batch.batch_key}
                      >
                        {processing === batch.batch_key ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <X className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleApproveBatch(batch.batch_key)}
                        disabled={processing === batch.batch_key}
                      >
                        {processing === batch.batch_key ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Check className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <p className="text-sm font-medium">Notifications in this batch:</p>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {batch.notifications.slice(0, 5).map((notification) => (
                        <div
                          key={notification.id}
                          className="text-sm bg-muted/50 p-2 rounded"
                        >
                          {renderEventDetails(notification.event_data, batch.notification_type)}
                        </div>
                      ))}
                      {batch.notifications.length > 5 && (
                        <p className="text-xs text-muted-foreground">
                          ... and {batch.notifications.length - 5} more
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  );
};
