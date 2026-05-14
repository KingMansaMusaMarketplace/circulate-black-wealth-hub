import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, MapPin, ArrowRight, GraduationCap, Building2, Utensils, Sparkles } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { getBusinessBanner } from '@/utils/businessBanners';

interface RelatedBusiness {
  id: string;
  business_name: string;
  category: string;
  city: string;
  state: string;
  logo_url: string;
  average_rating: number;
  is_verified: boolean;
  slug: string | null;
}

interface RelatedBusinessesProps {
  currentBusinessId: string;
  category: string;
  city?: string;
  limit?: number;
}

const getCategoryIcon = (category: string) => {
  const lowerCategory = category.toLowerCase();
  if (lowerCategory.includes('education') || lowerCategory.includes('hbcu') || lowerCategory.includes('college') || lowerCategory.includes('university')) {
    return <GraduationCap className="h-5 w-5" />;
  }
  if (lowerCategory.includes('restaurant') || lowerCategory.includes('food') || lowerCategory.includes('dining')) {
    return <Utensils className="h-5 w-5" />;
  }
  return <Building2 className="h-5 w-5" />;
};

const RelatedBusinesses: React.FC<RelatedBusinessesProps> = ({
  currentBusinessId,
  category,
  city,
  limit = 6,
}) => {
  const navigate = useNavigate();
  const [businesses, setBusinesses] = useState<RelatedBusiness[]>([]);
  const [loading, setLoading] = useState(true);
  const [headingMode, setHeadingMode] = useState<'sameCityCategory' | 'sameCategory' | 'fallback'>('sameCategory');

  useEffect(() => {
    const fetchRelated = async () => {
      const baseSelect = 'id, business_name, category, city, state, logo_url, average_rating, is_verified, slug';
      try {
        const collected: RelatedBusiness[] = [];

        // 1) Same city + same category (best for local SEO)
        if (city && category) {
          const { data } = await supabase
            .from('businesses')
            .select(baseSelect)
            .eq('category', category)
            .eq('city', city)
            .neq('id', currentBusinessId)
            .limit(limit);
          if (data && data.length) {
            collected.push(...(data as RelatedBusiness[]));
            setHeadingMode('sameCityCategory');
          }
        }

        // 2) Same category, any city
        if (collected.length < limit && category) {
          const need = limit - collected.length;
          const { data } = await supabase
            .from('businesses')
            .select(baseSelect)
            .eq('category', category)
            .neq('id', currentBusinessId)
            .not('id', 'in', `(${[currentBusinessId, ...collected.map(b => b.id)].map(id => `"${id}"`).join(',')})`)
            .limit(need);
          if (data && data.length) {
            collected.push(...(data as RelatedBusiness[]));
            if (collected.length === data.length) setHeadingMode('sameCategory');
          }
        }

        // 3) Fallback: top-rated businesses
        if (collected.length === 0) {
          const { data } = await supabase
            .from('businesses')
            .select(baseSelect)
            .neq('id', currentBusinessId)
            .order('average_rating', { ascending: false })
            .limit(limit);
          if (data) {
            collected.push(...(data as RelatedBusiness[]));
            setHeadingMode('fallback');
          }
        }

        setBusinesses(collected);
      } catch (err) {
        console.error('Error fetching related businesses:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRelated();
  }, [currentBusinessId, category, city, limit]);

  if (loading) {
    return (
      <Card className="bg-slate-900/40 backdrop-blur-xl border-white/10">
        <CardContent className="py-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-yellow-400"></div>
            <span className="ml-3 text-blue-200">Finding related businesses...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (businesses.length === 0) return null;

  const heading =
    headingMode === 'sameCityCategory'
      ? `More ${category} in ${city}`
      : headingMode === 'sameCategory'
      ? `More ${category} businesses`
      : 'Discover other businesses';

  return (
    <Card className="bg-slate-900/40 backdrop-blur-xl border-white/10">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          {getCategoryIcon(category)}
          {heading}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {businesses.map((business) => {
            const bannerUrl = getBusinessBanner(business.id, business.logo_url);
            const href = `/business/${business.slug || business.id}`;

            return (
              <Link
                key={business.id}
                to={href}
                aria-label={`${business.business_name} in ${business.city}`}
                className="group cursor-pointer bg-slate-800/50 rounded-lg overflow-hidden border border-white/5 hover:border-yellow-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/10 block"
              >
                <div className="relative h-32 overflow-hidden">
                  <img
                    src={bannerUrl}
                    alt={`${business.business_name} — ${business.category} in ${business.city}`}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=400&auto=format&fit=crop';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />

                  {business.average_rating > 0 && (
                    <div className="absolute top-2 right-2 bg-slate-900/80 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1">
                      <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                      <span className="text-xs text-white font-medium">{business.average_rating.toFixed(1)}</span>
                    </div>
                  )}
                </div>

                <div className="p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-white truncate group-hover:text-yellow-300 transition-colors">
                        {business.business_name}
                      </h4>
                      <div className="flex items-center gap-1 text-blue-300 text-xs mt-1">
                        <MapPin className="h-3 w-3" />
                        <span>{business.city}{business.state ? `, ${business.state}` : ''}</span>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-1" />
                  </div>

                  {business.is_verified && (
                    <Badge variant="outline" className="mt-2 text-xs border-green-500/30 text-green-400 bg-green-500/10">
                      <Sparkles className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>
              </Link>
            );
          })}
        </div>

        {/* SEO-friendly internal links to landing pages */}
        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 justify-center text-sm">
          {city && (
            <Link
              to={`/black-owned/city/${encodeURIComponent(city.toLowerCase().replace(/\s+/g, '-'))}`}
              className="text-yellow-400 hover:text-yellow-300 inline-flex items-center gap-1 hover:underline"
            >
              Black-owned businesses in {city}
              <ArrowRight className="h-4 w-4" />
            </Link>
          )}
          {category && (
            <Link
              to={`/black-owned/category/${encodeURIComponent(category.toLowerCase().replace(/\s+/g, '-'))}`}
              className="text-blue-300 hover:text-blue-200 inline-flex items-center gap-1 hover:underline"
            >
              All {category} businesses
              <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RelatedBusinesses;
