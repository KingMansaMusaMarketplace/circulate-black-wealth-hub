
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Star, ArrowRight, Loader2 } from 'lucide-react';
import OptimizedImage from '@/components/ui/optimized-image';
import { generatePlaceholder } from '@/utils/imageOptimizer';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { mapSupabaseBusinessToBusiness } from '@/lib/api/directory/mappers';

const FeaturedBusinesses = ({ limit = 3 }: { limit?: number }) => {
  const { data: displayBusinesses = [], isLoading } = useQuery({
    queryKey: ['featured-businesses', limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('business_directory')
        .select('*')
        .eq('is_verified', true)
        .order('average_rating', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching featured businesses:', error);
        return [];
      }

      return data.map(b => {
        const business = mapSupabaseBusinessToBusiness(b);
        return {
          id: business.id,
          name: business.name,
          category: business.category,
          description: business.description || `Discover amazing ${business.category.toLowerCase()} services and earn loyalty points`,
          rating: business.rating,
          reviews: business.reviewCount,
          distance: business.distance,
          image: business.bannerUrl || business.imageUrl || business.logoUrl,
          discount: business.discount,
        };
      });
    },
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <section className="py-3 md:py-8 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        <div className="container mx-auto px-4 flex justify-center py-6">
          <Loader2 className="h-8 w-8 animate-spin text-mansagold" />
        </div>
      </section>
    );
  }

  if (displayBusinesses.length === 0) return null;

  return (
    <section className="py-3 md:py-8 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-mansagold/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-mansablue/10 rounded-full blur-3xl" />
      </div>
      
      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-4 md:mb-10">
          <span className="text-mansagold text-sm font-mono tracking-widest uppercase mb-2 md:mb-4 block">
            Featured Partners
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 md:mb-6 font-display">
            Featured Black-Owned Businesses
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Discover amazing businesses in your community and start earning loyalty points today
          </p>
        </div>

        <div className={`grid gap-4 md:gap-8 mb-6 md:mb-12 ${displayBusinesses.length <= 3 ? 'md:grid-cols-3' : 'md:grid-cols-2 lg:grid-cols-3'}`}>
          {displayBusinesses.map((business) => (
            <Card key={business.id} className="group h-full flex flex-col overflow-hidden bg-slate-900/80 backdrop-blur-xl border-white/10 hover:border-mansagold/50 hover:shadow-[0_0_30px_rgba(251,191,36,0.15)] transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="aspect-video bg-slate-800 rounded-lg mb-4 overflow-hidden ring-1 ring-white/10">
                  <OptimizedImage 
                    src={business.image} 
                    alt={business.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    fallbackSrc={generatePlaceholder(400, 250, business.name)}
                    quality="medium"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg text-white group-hover:text-mansagold transition-colors">{business.name}</CardTitle>
                    <Badge variant="secondary" className="mt-1 bg-white/10 text-gray-300 border-white/20">
                      {business.category}
                    </Badge>
                  </div>
                  {business.discount && (
                    <Badge className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      {business.discount}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <CardDescription className="mb-4 text-gray-400">
                  {business.description}
                </CardDescription>
                
                <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-mansagold mr-1 fill-mansagold" />
                    <span className="text-white">{business.rating}</span>
                    <span className="ml-1 text-gray-500">({business.reviews} reviews)</span>
                  </div>
                </div>
                
                <div className="mt-auto">
                  <Link to={`/business/${business.id}`}>
                    <Button className="w-full bg-gradient-to-r from-mansablue to-blue-600 hover:from-mansagold hover:to-amber-500 hover:text-slate-900 transition-all duration-300 font-semibold">
                      View Details
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Link to="/directory">
            <Button size="lg" variant="outline" className="border-mansagold/50 text-mansagold hover:bg-mansagold hover:text-slate-900 transition-all duration-300 font-semibold px-10 py-6 text-lg">
              View All Businesses
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedBusinesses;
