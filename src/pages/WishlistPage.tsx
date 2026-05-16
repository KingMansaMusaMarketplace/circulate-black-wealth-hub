import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useWishlist } from '@/hooks/useWishlist';
import { VacationProperty } from '@/types/vacation-rental';
import { mapPropertyFromDB } from '@/lib/services/vacation-rental-service';
import PropertyCard from '@/components/vacation-rentals/PropertyCard';
import { Button } from '@/components/ui/button';
import { Heart, ChevronLeft, Loader2 } from 'lucide-react';

const WishlistPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isFavorited, toggleFavorite, favoritePropertyIds } = useWishlist();
  const [properties, setProperties] = useState<VacationProperty[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    loadWishlistProperties();
  }, [user, favoritePropertyIds]);

  const loadWishlistProperties = async () => {
    if (favoritePropertyIds.size === 0) {
      setProperties([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await (supabase as any)
        .from('vacation_properties_public')
        .select('*')
        .in('id', Array.from(favoritePropertyIds));

      if (error) throw error;
      setProperties((data || []).map(mapPropertyFromDB));
    } catch (err) {
      console.error('Error loading wishlist properties:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black relative">
      {/* Subtle ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[480px] opacity-60"
        style={{
          background:
            'radial-gradient(ellipse 80% 50% at 50% 0%, hsl(var(--mansagold) / 0.06), transparent 70%)',
        }}
      />
      <Helmet>
        <title>My Favorites | 1325.AI</title>
        <meta name="description" content="View your saved vacation and monthly rental properties on Mansa Stays." />
      </Helmet>
      <div className="max-w-7xl mx-auto px-4 py-8 relative">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="text-slate-300 hover:text-white hover:bg-white/5"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="font-display text-3xl font-bold tracking-tight text-white flex items-center gap-2">
              <Heart className="w-7 h-7 fill-mansagold text-mansagold" />
              My Favorites
            </h1>
            <p className="text-slate-400 mt-1">
              {properties.length} saved {properties.length === 1 ? 'property' : 'properties'}
            </p>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-mansagold" />
          </div>
        ) : properties.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <Heart className="w-16 h-16 text-mansagold/30 mx-auto mb-4" />
            <h2 className="font-display text-xl font-semibold tracking-tight text-white mb-2">No saved properties yet</h2>
            <p className="text-slate-400 mb-6">
              Tap the heart icon on any property to save it here.
            </p>
            <Button
              onClick={() => navigate('/stays')}
              className="bg-mansagold text-black hover:bg-mansagold/90"
            >
              Explore Properties
            </Button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property, index) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <PropertyCard
                  property={property}
                  isFavorited={isFavorited(property.id)}
                  onToggleFavorite={toggleFavorite}
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;
