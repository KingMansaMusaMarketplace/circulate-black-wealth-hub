import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, MapPin, ArrowRight, Navigation, Building2, Sparkles } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { getBusinessBanner } from '@/utils/businessBanners';

interface NearbyBusiness {
  id: string;
  business_name: string;
  category: string;
  logo_url: string;
  distance_miles: number;
  discount: string;
}

interface NearbyBusinessesProps {
  currentBusinessId: string;
  currentCategory: string;
  lat: number;
  lng: number;
  radiusMiles?: number;
}

const NearbyBusinesses: React.FC<NearbyBusinessesProps> = ({
  currentBusinessId,
  currentCategory,
  lat,
  lng,
  radiusMiles = 5,
}) => {
  const navigate = useNavigate();
  const [grouped, setGrouped] = useState<Record<string, NearbyBusiness[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNearby = async () => {
      if (!lat || !lng) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase.rpc('get_nearby_businesses', {
          user_lat: lat,
          user_lng: lng,
          radius_miles: radiusMiles,
        });

        if (error) throw error;

        // Filter out the current business and current category, then group by category
        const filtered = (data || []).filter(
          (b: NearbyBusiness) =>
            b.id !== currentBusinessId &&
            b.category?.toLowerCase() !== currentCategory?.toLowerCase()
        );

        const groups: Record<string, NearbyBusiness[]> = {};
        filtered.forEach((b: NearbyBusiness) => {
          const cat = b.category || 'Other';
          if (!groups[cat]) groups[cat] = [];
          if (groups[cat].length < 4) {
            groups[cat].push(b);
          }
        });

        setGrouped(groups);
      } catch (err) {
        console.error('Error fetching nearby businesses:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNearby();
  }, [currentBusinessId, currentCategory, lat, lng, radiusMiles]);

  if (loading) {
    return (
      <Card className="bg-slate-900/40 backdrop-blur-xl border-white/10 mt-8">
        <CardContent className="py-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-yellow-400" />
            <span className="ml-3 text-blue-200">Finding businesses near you...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  const categories = Object.keys(grouped);
  if (categories.length === 0) return null;

  return (
    <Card className="bg-slate-900/40 backdrop-blur-xl border-white/10 mt-8">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Navigation className="h-5 w-5 text-yellow-400" />
          Other Businesses Near Me
        </CardTitle>
        <p className="text-sm text-blue-300/70">
          Discover different types of businesses within {radiusMiles} miles
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {categories.map((category) => (
          <div key={category}>
            <div className="flex items-center gap-2 mb-3">
              <Building2 className="h-4 w-4 text-yellow-400" />
              <h3 className="text-sm font-semibold text-yellow-300 uppercase tracking-wider">
                {category}
              </h3>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {grouped[category].map((business) => {
                const bannerUrl = getBusinessBanner(business.id, business.logo_url);

                return (
                  <div
                    key={business.id}
                    onClick={() => navigate(`/business/${business.id}`)}
                    className="group cursor-pointer bg-slate-800/50 rounded-lg overflow-hidden border border-white/5 hover:border-yellow-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/10"
                  >
                    <div className="relative h-28 overflow-hidden">
                      <img
                        src={bannerUrl}
                        alt={business.business_name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=400&auto=format&fit=crop';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />

                      {/* Distance Badge */}
                      <div className="absolute top-2 right-2 bg-slate-900/80 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-yellow-400" />
                        <span className="text-xs text-white font-medium">
                          {business.distance_miles.toFixed(1)} mi
                        </span>
                      </div>
                    </div>

                    <div className="p-3">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-semibold text-white truncate group-hover:text-yellow-300 transition-colors text-sm">
                          {business.business_name}
                        </h4>
                        <ArrowRight className="h-4 w-4 text-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-0.5" />
                      </div>

                      {business.discount && (
                        <Badge
                          variant="outline"
                          className="mt-1.5 text-xs border-green-500/30 text-green-400 bg-green-500/10"
                        >
                          <Sparkles className="h-3 w-3 mr-1" />
                          {business.discount}
                        </Badge>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        <div className="mt-4 text-center">
          <button
            onClick={() => navigate('/directory')}
            className="text-sm text-yellow-400 hover:text-yellow-300 inline-flex items-center gap-1 hover:underline"
          >
            Explore all businesses in the directory
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default NearbyBusinesses;
