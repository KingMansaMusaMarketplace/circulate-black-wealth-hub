import { supabase } from '@/integrations/supabase/client';

export interface BatchNotificationParams {
  notificationType: 'business_verification' | 'agent_milestone';
  eventData: any;
  batchKey?: string; // Optional - will auto-generate if not provided
}

/**
 * Queue a notification for batching
 * Similar notifications will be grouped and sent together
 */
export const queueBatchedNotification = async (params: BatchNotificationParams): Promise<boolean> => {
  try {
    const { notificationType, eventData, batchKey } = params;

    // Generate batch key if not provided
    const finalBatchKey = batchKey || generateBatchKey(notificationType, eventData);

    const { error } = await supabase
      .from('notification_batch_queue')
      .insert({
        notification_type: notificationType,
        event_data: eventData,
        batch_key: finalBatchKey,
      });

    if (error) {
      console.error('Error queuing batched notification:', error);
      return false;
    }

    console.log('Notification queued for batching:', finalBatchKey);
    return true;
  } catch (error) {
    console.error('Error in queueBatchedNotification:', error);
    return false;
  }
};

/**
 * Check if batching is enabled for the current admin
 */
export const isBatchingEnabled = async (): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { data, error } = await supabase
      .from('admin_notification_preferences')
      .select('enable_batching')
      .eq('admin_user_id', user.id)
      .single();

    if (error) {
      console.error('Error checking batching status:', error);
      return true; // Default to enabled on error
    }

    return data?.enable_batching ?? true;
  } catch (error) {
    console.error('Error in isBatchingEnabled:', error);
    return true;
  }
};

/**
 * Generate a batch key for grouping similar notifications
 */
function generateBatchKey(notificationType: string, eventData: any): string {
  // Group by notification type and time window
  const date = new Date();
  const timeWindow = Math.floor(date.getTime() / (5 * 60 * 1000)); // 5-minute windows

  if (notificationType === 'business_verification') {
    return `business_verification_${timeWindow}`;
  } else if (notificationType === 'agent_milestone') {
    // Group by milestone type
    const milestoneCategory = eventData.milestoneType?.split('_')[0] || 'general';
    return `agent_milestone_${milestoneCategory}_${timeWindow}`;
  }

  return `${notificationType}_${timeWindow}`;
}

/**
 * Send notification immediately (bypass batching)
 * Use for critical notifications that can't wait
 */
export const sendImmediateNotification = async (
  notificationType: string,
  eventData: any
): Promise<boolean> => {
  try {
    const { error } = await supabase.functions.invoke('send-admin-notification', {
      body: {
        notificationType,
        eventData,
        bypassBatching: true,
      },
    });

    if (error) {
      console.error('Error sending immediate notification:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in sendImmediateNotification:', error);
    return false;
  }
};

/**
 * Get batching statistics
 */
export const getBatchingStats = async (): Promise<{
  pendingCount: number;
  batchesLast24h: number;
  averageBatchSize: number;
} | null> => {
  try {
    const { data: pending, error: pendingError } = await supabase
      .from('notification_batch_queue')
      .select('id', { count: 'exact', head: true })
      .is('processed_at', null);

    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const { data: batches, error: batchesError } = await supabase
      .from('notification_batches')
      .select('event_count')
      .gte('created_at', yesterday.toISOString());

    if (pendingError || batchesError) {
      console.error('Error fetching batching stats:', pendingError || batchesError);
      return null;
    }

    const batchCount = batches?.length || 0;
    const totalEvents = batches?.reduce((sum, b) => sum + (b.event_count || 0), 0) || 0;
    const averageSize = batchCount > 0 ? Math.round(totalEvents / batchCount) : 0;

    return {
      pendingCount: pending?.length || 0,
      batchesLast24h: batchCount,
      averageBatchSize: averageSize,
    };
  } catch (error) {
    console.error('Error in getBatchingStats:', error);
    return null;
  }
};
