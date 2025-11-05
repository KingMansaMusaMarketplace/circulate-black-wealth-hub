import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, MapPin, ChevronRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const NativeFeaturedBusinesses = () => {
  const { data: businesses, isLoading } = useQuery({
    queryKey: ['featured-businesses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(6);
      
      if (error) throw error;
      return data || [];
    },
  });

  if (isLoading) {
    return (
      <div className="px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Featured Businesses</h2>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (!businesses || businesses.length === 0) {
    return null;
  }

  return (
    <div className="px-4 py-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Featured Businesses</h2>
        <Link to="/directory" className="text-sm text-primary font-medium flex items-center gap-1">
          View All
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Horizontal Scroll */}
      <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 snap-x snap-mandatory scrollbar-hide">
        {businesses.slice(0, 6).map((business) => (
          <Link
            key={business.id}
            to={`/business/${business.id}`}
            className="flex-shrink-0 w-72 snap-start"
          >
            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              {business.logo_url && (
                <div className="h-32 bg-gradient-to-br from-primary/10 to-accent/10 relative overflow-hidden">
                  <img
                    src={business.logo_url}
                    alt={business.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              <div className="p-4">
                <h3 className="font-semibold text-base mb-1 truncate">
                  {business.name}
                </h3>
                
                <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                  <MapPin className="h-3 w-3" />
                  <span className="truncate">{business.city}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-primary text-primary" />
                    <span className="text-sm font-medium">4.5</span>
                    <span className="text-xs text-muted-foreground">(120)</span>
                  </div>
                  
                  {business.discount_percentage && (
                    <Badge variant="secondary" className="text-xs">
                      {business.discount_percentage}% Off
                    </Badge>
                  )}
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default NativeFeaturedBusinesses;
