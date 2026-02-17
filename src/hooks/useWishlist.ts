import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface WishlistItem {
  id: string;
  property_id: string;
  wishlist_id: string;
  created_at: string;
}

interface Wishlist {
  id: string;
  name: string;
  user_id: string;
  created_at: string;
}

export function useWishlist() {
  const { user } = useAuth();
  const [favoritePropertyIds, setFavoritePropertyIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [defaultWishlistId, setDefaultWishlistId] = useState<string | null>(null);

  // Load user's favorited property IDs
  const loadFavorites = useCallback(async () => {
    if (!user) {
      setFavoritePropertyIds(new Set());
      return;
    }

    try {
      const { data, error } = await supabase
        .from('stays_wishlist_items')
        .select('property_id')
        .eq('user_id', user.id);

      if (error) throw error;
      setFavoritePropertyIds(new Set(data?.map(item => item.property_id) || []));
    } catch (err) {
      console.error('Error loading favorites:', err);
    }
  }, [user]);

  // Get or create default wishlist
  const getDefaultWishlist = useCallback(async (): Promise<string | null> => {
    if (!user) return null;
    if (defaultWishlistId) return defaultWishlistId;

    try {
      // Check for existing wishlist
      const { data: existing, error: fetchError } = await supabase
        .from('stays_wishlists')
        .select('id')
        .eq('user_id', user.id)
        .limit(1)
        .single();

      if (existing) {
        setDefaultWishlistId(existing.id);
        return existing.id;
      }

      // Create default wishlist
      const { data: created, error: createError } = await supabase
        .from('stays_wishlists')
        .insert({ user_id: user.id, name: 'My Favorites' })
        .select('id')
        .single();

      if (createError) throw createError;
      setDefaultWishlistId(created.id);
      return created.id;
    } catch (err) {
      console.error('Error getting wishlist:', err);
      return null;
    }
  }, [user, defaultWishlistId]);

  // Toggle favorite
  const toggleFavorite = useCallback(async (propertyId: string) => {
    if (!user) {
      toast.error('Please sign in to save favorites');
      return;
    }

    const isFavorited = favoritePropertyIds.has(propertyId);

    // Optimistic update
    setFavoritePropertyIds(prev => {
      const next = new Set(prev);
      if (isFavorited) {
        next.delete(propertyId);
      } else {
        next.add(propertyId);
      }
      return next;
    });

    try {
      if (isFavorited) {
        // Remove from wishlist
        const { error } = await supabase
          .from('stays_wishlist_items')
          .delete()
          .eq('user_id', user.id)
          .eq('property_id', propertyId);

        if (error) throw error;
        toast.success('Removed from favorites');
      } else {
        // Add to wishlist
        const wishlistId = await getDefaultWishlist();
        if (!wishlistId) throw new Error('Could not create wishlist');

        const { error } = await supabase
          .from('stays_wishlist_items')
          .insert({
            wishlist_id: wishlistId,
            property_id: propertyId,
            user_id: user.id,
          });

        if (error) throw error;
        toast.success('Saved to favorites ❤️');
      }
    } catch (err: any) {
      // Revert optimistic update
      setFavoritePropertyIds(prev => {
        const next = new Set(prev);
        if (isFavorited) {
          next.add(propertyId);
        } else {
          next.delete(propertyId);
        }
        return next;
      });
      console.error('Error toggling favorite:', err);
      toast.error('Failed to update favorites');
    }
  }, [user, favoritePropertyIds, getDefaultWishlist]);

  const isFavorited = useCallback((propertyId: string) => {
    return favoritePropertyIds.has(propertyId);
  }, [favoritePropertyIds]);

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  return {
    favoritePropertyIds,
    toggleFavorite,
    isFavorited,
    loading,
    refreshFavorites: loadFavorites,
  };
}
