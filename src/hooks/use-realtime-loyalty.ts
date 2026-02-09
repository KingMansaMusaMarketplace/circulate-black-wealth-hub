/**
 * @fileoverview Realtime Loyalty Points Hook
 * 
 * Uses Supabase Realtime subscriptions to provide live point updates
 * during transactions, eliminating the need for manual refreshes.
 */

import { useEffect, useState, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { RealtimeChannel } from '@supabase/supabase-js';
import { toast } from 'sonner';

export interface RealtimePointsUpdate {
  type: 'INSERT' | 'UPDATE' | 'DELETE';
  oldPoints?: number;
  newPoints: number;
  businessId?: string;
  businessName?: string;
  timestamp: Date;
}

interface UseRealtimeLoyaltyOptions {
  /** Show toast notifications on point changes */
  showNotifications?: boolean;
  /** Callback when points change */
  onPointsChange?: (update: RealtimePointsUpdate) => void;
}

export const useRealtimeLoyalty = (options: UseRealtimeLoyaltyOptions = {}) => {
  const { showNotifications = true, onPointsChange } = options;
  const { user } = useAuth();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<RealtimePointsUpdate | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('disconnected');
  const channelRef = useRef<RealtimeChannel | null>(null);

  // Subscribe to loyalty_points changes for the current user
  const subscribe = useCallback(async () => {
    if (!user?.id) return;

    // Clean up existing subscription
    if (channelRef.current) {
      await supabase.removeChannel(channelRef.current);
    }

    setConnectionStatus('connecting');

    const channel = supabase
      .channel(`loyalty-points-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to all events (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'loyalty_points',
          filter: `customer_id=eq.${user.id}`,
        },
        async (payload) => {
          console.log('[RealtimeLoyalty] Points change detected:', payload);

          const { eventType } = payload;
          const newRecord = payload.new as Record<string, any> | null;
          const oldRecord = payload.old as Record<string, any> | null;

          // Fetch business name for better notification
          let businessName = 'Business';
          const businessId = newRecord?.business_id || oldRecord?.business_id;
          if (businessId) {
            const { data: business } = await supabase
              .from('businesses')
              .select('business_name')
              .eq('id', businessId)
              .single();
            
            if (business) {
              businessName = business.business_name;
            }
          }

          const newPoints = newRecord?.points ?? 0;
          const oldPoints = oldRecord?.points ?? 0;

          const update: RealtimePointsUpdate = {
            type: eventType as 'INSERT' | 'UPDATE' | 'DELETE',
            oldPoints,
            newPoints,
            businessId,
            businessName,
            timestamp: new Date(),
          };

          setLastUpdate(update);

          // Show notification
          if (showNotifications) {
            if (eventType === 'INSERT' || (eventType === 'UPDATE' && newPoints > oldPoints)) {
              const pointsEarned = eventType === 'INSERT' 
                ? newPoints 
                : newPoints - oldPoints;
              
              toast.success(`+${pointsEarned} points earned at ${businessName}!`, {
                description: `Total: ${newPoints} points`,
                duration: 5000,
              });
            } else if (eventType === 'UPDATE' && newPoints < oldPoints) {
              const pointsUsed = oldPoints - newPoints;
              toast.info(`${pointsUsed} points redeemed at ${businessName}`, {
                description: `Remaining: ${newPoints} points`,
                duration: 5000,
              });
            }
          }

          // Call callback if provided
          onPointsChange?.(update);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'qr_scans',
          filter: `customer_id=eq.${user.id}`,
        },
        async (payload) => {
          console.log('[RealtimeLoyalty] QR scan detected:', payload);
          
          // Fetch business name for the scan
          const { new: scanRecord } = payload;
          let businessName = 'Business';
          
          if (scanRecord?.business_id) {
            const { data: business } = await supabase
              .from('businesses')
              .select('business_name')
              .eq('id', scanRecord.business_id)
              .single();
            
            if (business) {
              businessName = business.business_name;
            }
          }

          if (showNotifications && scanRecord?.points_earned) {
            toast.success(`QR Code scanned at ${businessName}!`, {
              description: `+${scanRecord.points_earned} points`,
              duration: 4000,
            });
          }
        }
      )
      .subscribe((status) => {
        console.log('[RealtimeLoyalty] Subscription status:', status);
        if (status === 'SUBSCRIBED') {
          setIsSubscribed(true);
          setConnectionStatus('connected');
        } else if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
          setIsSubscribed(false);
          setConnectionStatus('disconnected');
        }
      });

    channelRef.current = channel;
  }, [user?.id, showNotifications, onPointsChange]);

  // Unsubscribe from realtime
  const unsubscribe = useCallback(async () => {
    if (channelRef.current) {
      await supabase.removeChannel(channelRef.current);
      channelRef.current = null;
      setIsSubscribed(false);
      setConnectionStatus('disconnected');
    }
  }, []);

  // Auto-subscribe when user is available
  useEffect(() => {
    if (user?.id) {
      subscribe();
    }

    return () => {
      unsubscribe();
    };
  }, [user?.id, subscribe, unsubscribe]);

  return {
    isSubscribed,
    connectionStatus,
    lastUpdate,
    subscribe,
    unsubscribe,
  };
};

export default useRealtimeLoyalty;
