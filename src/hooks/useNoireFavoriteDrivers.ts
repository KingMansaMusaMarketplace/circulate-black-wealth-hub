import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface FavoriteDriver {
  id: string;
  driver_id: string;
  nickname: string | null;
  rides_together: number;
  last_ride_at: string | null;
  created_at: string;
  driver?: {
    id: string;
    display_name: string;
    vehicle_make: string;
    vehicle_model: string;
    vehicle_year: number;
    average_rating: number;
    total_rides: number;
    is_online: boolean;
  };
}

export function useNoireFavoriteDrivers() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<FavoriteDriver[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = useCallback(async () => {
    if (!user) { setLoading(false); return; }
    try {
      const { data, error } = await supabase
        .from('noire_favorite_drivers')
        .select(`
          *,
          driver:noir_drivers(id, display_name, vehicle_make, vehicle_model, vehicle_year, average_rating, total_rides, is_online)
        `)
        .eq('rider_user_id', user.id)
        .order('rides_together', { ascending: false });

      if (error) throw error;
      setFavorites((data as any[]) || []);
    } catch (err) {
      console.error('Error fetching favorite drivers:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { fetchFavorites(); }, [fetchFavorites]);

  const addFavorite = async (driverId: string, nickname?: string) => {
    if (!user) return;
    try {
      const { error } = await supabase
        .from('noire_favorite_drivers')
        .insert({ rider_user_id: user.id, driver_id: driverId, nickname: nickname || null });
      if (error) throw error;
      toast.success('Driver added to favorites!');
      fetchFavorites();
    } catch (err: any) {
      if (err?.code === '23505') toast.info('Driver is already in your favorites');
      else toast.error('Failed to add favorite driver');
    }
  };

  const removeFavorite = async (driverId: string) => {
    if (!user) return;
    try {
      const { error } = await supabase
        .from('noire_favorite_drivers')
        .delete()
        .eq('rider_user_id', user.id)
        .eq('driver_id', driverId);
      if (error) throw error;
      toast.success('Driver removed from favorites');
      fetchFavorites();
    } catch {
      toast.error('Failed to remove favorite');
    }
  };

  return { favorites, loading, addFavorite, removeFavorite, refetch: fetchFavorites };
}
