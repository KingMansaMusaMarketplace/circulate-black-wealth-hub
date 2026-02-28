import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface ScheduledRide {
  id: string;
  preferred_driver_id: string | null;
  pickup_address: string;
  dropoff_address: string;
  scheduled_for: string;
  status: string;
  estimated_fare: number | null;
  notes: string | null;
  created_at: string;
  driver?: {
    display_name: string;
    vehicle_make: string;
    vehicle_model: string;
    average_rating: number;
  };
}

export function useNoireScheduledRides() {
  const { user } = useAuth();
  const [rides, setRides] = useState<ScheduledRide[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRides = useCallback(async () => {
    if (!user) { setLoading(false); return; }
    try {
      const { data, error } = await supabase
        .from('noire_scheduled_rides')
        .select(`
          *,
          driver:noir_drivers!noire_scheduled_rides_preferred_driver_id_fkey(display_name, vehicle_make, vehicle_model, average_rating)
        `)
        .eq('rider_user_id', user.id)
        .order('scheduled_for', { ascending: true });

      if (error) throw error;
      setRides((data as any[]) || []);
    } catch (err) {
      console.error('Error fetching scheduled rides:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { fetchRides(); }, [fetchRides]);

  const scheduleRide = async (ride: {
    preferred_driver_id?: string;
    pickup_address: string;
    pickup_lat?: number;
    pickup_lng?: number;
    dropoff_address: string;
    dropoff_lat?: number;
    dropoff_lng?: number;
    scheduled_for: string;
    estimated_fare?: number;
    notes?: string;
  }) => {
    if (!user) return;
    try {
      const { error } = await supabase
        .from('noire_scheduled_rides')
        .insert({ ...ride, rider_user_id: user.id });
      if (error) throw error;
      toast.success('Ride scheduled successfully!');
      fetchRides();
    } catch {
      toast.error('Failed to schedule ride');
    }
  };

  const cancelRide = async (rideId: string) => {
    if (!user) return;
    try {
      const { error } = await supabase
        .from('noire_scheduled_rides')
        .update({ status: 'cancelled' })
        .eq('id', rideId)
        .eq('rider_user_id', user.id);
      if (error) throw error;
      toast.success('Scheduled ride cancelled');
      fetchRides();
    } catch {
      toast.error('Failed to cancel ride');
    }
  };

  return { rides, loading, scheduleRide, cancelRide, refetch: fetchRides };
}
