
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface UserFavorite {
  id: string;
  user_id: string;
  business_id: number;
  created_at: string;
}

export const useUserFavorites = () => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadFavorites();
    } else {
      setFavorites([]);
    }
  }, [user]);

  const loadFavorites = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('user_favorites')
        .select('business_id')
        .eq('user_id', user.id);

      if (error) throw error;
      
      setFavorites(data?.map(fav => fav.business_id) || []);
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToFavorites = async (businessId: number) => {
    if (!user) {
      toast.error('Please sign in to save favorites');
      return false;
    }

    try {
      const { error } = await supabase
        .from('user_favorites')
        .insert({
          user_id: user.id,
          business_id: businessId
        });

      if (error) throw error;

      setFavorites(prev => [...prev, businessId]);
      toast.success('Added to favorites');
      return true;
    } catch (error) {
      console.error('Error adding to favorites:', error);
      toast.error('Failed to add to favorites');
      return false;
    }
  };

  const removeFromFavorites = async (businessId: number) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('user_favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('business_id', businessId);

      if (error) throw error;

      setFavorites(prev => prev.filter(id => id !== businessId));
      toast.success('Removed from favorites');
      return true;
    } catch (error) {
      console.error('Error removing from favorites:', error);
      toast.error('Failed to remove from favorites');
      return false;
    }
  };

  const toggleFavorite = async (businessId: number) => {
    if (favorites.includes(businessId)) {
      return await removeFromFavorites(businessId);
    } else {
      return await addToFavorites(businessId);
    }
  };

  const isFavorite = (businessId: number) => favorites.includes(businessId);

  return {
    favorites,
    loading,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    isFavorite,
    loadFavorites
  };
};
