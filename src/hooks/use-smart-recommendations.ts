
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Business } from '@/types/business';
import { LocationData } from '@/hooks/location/types';

export const useSmartRecommendations = (userLocation?: LocationData | null) => {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRecommendations = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch user's interactions to personalize recommendations
      let userInteractions: string[] = [];
      let userCategories: string[] = [];
      
      if (user) {
        // Get businesses the user has interacted with
        const { data: interactions } = await supabase
          .from('business_interactions')
          .select('business_id')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(20);
        
        userInteractions = interactions?.map(i => i.business_id) || [];

        // Get categories from user's favorite/visited businesses
        if (userInteractions.length > 0) {
          const { data: visitedBusinesses } = await supabase
            .from('businesses')
            .select('category')
            .in('id', userInteractions);
          
          userCategories = [...new Set(visitedBusinesses?.map(b => b.category).filter(Boolean) || [])];
        }

        // Check AI recommendations table
        const { data: aiRecs } = await supabase
          .from('ai_recommendations')
          .select('business_id, recommendation_score')
          .eq('user_id', user.id)
          .gte('expires_at', new Date().toISOString())
          .order('recommendation_score', { ascending: false })
          .limit(10);

        if (aiRecs && aiRecs.length > 0) {
          const aiBusinessIds = aiRecs.map(r => r.business_id);
          const { data: aiBusinesses, error } = await supabase
            .from('businesses')
            .select('*')
            .in('id', aiBusinessIds)
            .eq('is_verified', true);

          if (!error && aiBusinesses && aiBusinesses.length > 0) {
            const mapped = mapBusinesses(aiBusinesses);
            setRecommendations(mapped);
            setLoading(false);
            return;
          }
        }
      }

      // Build query for recommendations
      let query = supabase
        .from('businesses')
        .select('*')
        .eq('is_verified', true)
        .order('average_rating', { ascending: false })
        .order('review_count', { ascending: false })
        .limit(10);

      // Prioritize user's preferred categories if available
      if (userCategories.length > 0) {
        query = query.in('category', userCategories);
      }

      // Exclude already visited businesses for variety
      if (userInteractions.length > 0 && userInteractions.length < 50) {
        query = query.not('id', 'in', `(${userInteractions.join(',')})`);
      }

      const { data: businesses, error } = await query;

      if (error) {
        console.error('Error fetching recommendations:', error);
        // Fallback to simple query
        const { data: fallbackBusinesses } = await supabase
          .from('businesses')
          .select('*')
          .eq('is_verified', true)
          .order('average_rating', { ascending: false })
          .limit(10);
        
        setRecommendations(mapBusinesses(fallbackBusinesses || []));
      } else {
        // If not enough results with categories, fetch more general ones
        let allBusinesses = businesses || [];
        
        if (allBusinesses.length < 5) {
          const { data: moreBusinesses } = await supabase
            .from('businesses')
            .select('*')
            .eq('is_verified', true)
            .order('average_rating', { ascending: false })
            .limit(10 - allBusinesses.length);
          
          if (moreBusinesses) {
            const existingIds = new Set(allBusinesses.map(b => b.id));
            const newBusinesses = moreBusinesses.filter(b => !existingIds.has(b.id));
            allBusinesses = [...allBusinesses, ...newBusinesses];
          }
        }

        setRecommendations(mapBusinesses(allBusinesses));
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      setRecommendations([]);
    } finally {
      setLoading(false);
    }
  }, [user, userLocation]);

  useEffect(() => {
    fetchRecommendations();
  }, [fetchRecommendations]);

  return { recommendations, loading, refetch: fetchRecommendations };
};

function mapBusinesses(businesses: any[]): Business[] {
  return businesses.map(b => ({
    id: b.id,
    name: b.business_name || b.name,
    description: b.description || '',
    category: b.category || 'Other',
    address: b.address || '',
    city: b.city || '',
    state: b.state || '',
    zipCode: b.zip_code || '',
    phone: b.phone || '',
    email: b.email || '',
    website: b.website || '',
    logoUrl: b.logo_url || '',
    bannerUrl: b.banner_url || '',
    rating: Number(b.average_rating) || 0,
    averageRating: Number(b.average_rating) || 0,
    reviewCount: b.review_count || 0,
    discount: '',
    discountValue: 0,
    distance: '',
    distanceValue: 0,
    lat: 0,
    lng: 0,
    imageUrl: b.logo_url || b.banner_url || '',
    isFeatured: b.is_verified,
    isVerified: b.is_verified,
    ownerId: b.owner_id,
    createdAt: b.created_at,
    updatedAt: b.updated_at
  }));
}
