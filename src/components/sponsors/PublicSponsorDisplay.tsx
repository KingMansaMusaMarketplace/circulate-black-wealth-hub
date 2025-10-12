import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { ExternalLink } from 'lucide-react';
import { useEffect } from 'react';

interface Sponsor {
  id: string;
  tier: string;
  company_name: string;
  logo_url: string | null;
  website_url: string | null;
  status: string;
}

const tierOrder = { platinum: 1, gold: 2, silver: 3, bronze: 4 };
const tierColors = {
  platinum: 'from-purple-500 to-pink-500',
  gold: 'from-yellow-500 to-amber-500',
  silver: 'from-gray-400 to-gray-500',
  bronze: 'from-orange-600 to-orange-700',
};

export const PublicSponsorDisplay = () => {
  const { data: sponsors, isLoading } = useQuery({
    queryKey: ['public-sponsors'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('corporate_subscriptions')
        .select('id, tier, company_name, logo_url, website_url, status')
        .eq('status', 'active')
        .order('tier');

      if (error) throw error;

      // Sort by tier priority
      return (data as Sponsor[]).sort(
        (a, b) => tierOrder[a.tier as keyof typeof tierOrder] - tierOrder[b.tier as keyof typeof tierOrder]
      );
    },
  });

  // Track impressions when sponsors are displayed
  useEffect(() => {
    if (sponsors && sponsors.length > 0) {
      sponsors.forEach((sponsor) => {
        supabase.rpc('increment_sponsor_impression', {
          p_subscription_id: sponsor.id,
        });
      });
    }
  }, [sponsors]);

  const handleSponsorClick = async (sponsor: Sponsor) => {
    // Track click
    await supabase.rpc('increment_sponsor_click', {
      p_subscription_id: sponsor.id,
    });

    // Open sponsor website
    if (sponsor.website_url) {
      window.open(sponsor.website_url, '_blank', 'noopener,noreferrer');
    }
  };

  if (isLoading) {
    return (
      <section className="py-12 bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-2">Our Sponsors</h2>
          <p className="text-center text-muted-foreground mb-8">
            Supporting Black-owned businesses together
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="p-6 animate-pulse">
                <div className="h-24 bg-muted rounded"></div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!sponsors || sponsors.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-2">Our Sponsors</h2>
        <p className="text-center text-muted-foreground mb-8">
          Supporting Black-owned businesses together
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {sponsors.map((sponsor) => {
            const tierGradient = tierColors[sponsor.tier as keyof typeof tierColors];
            const isPlatinum = sponsor.tier === 'platinum';

            return (
              <Card
                key={sponsor.id}
                className={`relative overflow-hidden transition-all hover:scale-105 cursor-pointer group ${
                  isPlatinum ? 'md:col-span-2' : ''
                }`}
                onClick={() => handleSponsorClick(sponsor)}
              >
                {/* Tier badge */}
                <div
                  className={`absolute top-0 right-0 px-3 py-1 text-xs font-semibold text-white bg-gradient-to-r ${tierGradient} rounded-bl-lg`}
                >
                  {sponsor.tier.toUpperCase()}
                </div>

                {/* Logo or company name */}
                <div className="p-6 flex items-center justify-center min-h-32">
                  {sponsor.logo_url ? (
                    <img
                      src={sponsor.logo_url}
                      alt={sponsor.company_name}
                      className="max-h-20 max-w-full object-contain"
                    />
                  ) : (
                    <h3 className="text-xl font-bold text-center">{sponsor.company_name}</h3>
                  )}
                </div>

                {/* Hover overlay with link icon */}
                {sponsor.website_url && (
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <ExternalLink className="h-6 w-6 text-primary" />
                  </div>
                )}
              </Card>
            );
          })}
        </div>

        <p className="text-center text-sm text-muted-foreground mt-8">
          Interested in sponsoring?{' '}
          <a href="/sponsor-pricing" className="text-primary hover:underline">
            Learn more about our sponsorship tiers
          </a>
        </p>
      </div>
    </section>
  );
};
