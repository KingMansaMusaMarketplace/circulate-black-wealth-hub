import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ExternalLink, Globe, Award, Heart, ArrowRight } from 'lucide-react';

export default function SponsorLandingPage() {
  const { slug } = useParams<{ slug: string }>();

  const { data: sponsor, isLoading, error } = useQuery({
    queryKey: ['sponsor-landing', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('corporate_subscriptions')
        .select('*')
        .eq('landing_page_slug', slug)
        .eq('landing_page_enabled', true)
        .eq('is_visible', true)
        .eq('approval_status', 'approved')
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a1628]">
        <div className="container mx-auto px-4 py-16 space-y-8">
          <Skeleton className="h-64 w-full bg-white/10 rounded-2xl" />
          <Skeleton className="h-12 w-96 bg-white/10" />
          <Skeleton className="h-6 w-full max-w-2xl bg-white/10" />
        </div>
      </div>
    );
  }

  if (error || !sponsor) {
    return (
      <div className="min-h-screen bg-[#0a1628] flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-amber-100">Sponsor Page Not Found</h1>
          <p className="text-blue-200/70">This sponsor landing page doesn't exist or isn't published yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a1628] relative overflow-hidden">
      <Helmet>
        <title>{sponsor.company_name} | Corporate Sponsor | 1325.AI</title>
        <meta name="description" content={sponsor.landing_page_description || `${sponsor.company_name} is a proud corporate sponsor of 1325.AI`} />
      </Helmet>

      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-gradient-to-br from-amber-500/20 to-yellow-600/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-60 w-[600px] h-[600px] bg-gradient-to-tr from-blue-600/15 to-indigo-700/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <section className="relative">
          {sponsor.landing_page_hero_image_url ? (
            <div className="relative h-[400px] md:h-[500px] overflow-hidden">
              <img
                src={sponsor.landing_page_hero_image_url}
                alt={`${sponsor.company_name} hero`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628] via-[#0a1628]/60 to-transparent" />
            </div>
          ) : (
            <div className="h-[300px] bg-gradient-to-br from-amber-500/20 via-[#0a1628] to-blue-600/20 flex items-end">
              <div className="w-full h-1/2 bg-gradient-to-t from-[#0a1628] to-transparent" />
            </div>
          )}

          {/* Company Info Overlay */}
          <div className="container mx-auto px-4 -mt-32 relative z-10">
            <div className="flex flex-col md:flex-row items-start gap-6">
              {sponsor.logo_url && (
                <div className="w-28 h-28 md:w-36 md:h-36 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 p-3 flex-shrink-0 shadow-2xl">
                  <img
                    src={sponsor.logo_url}
                    alt={sponsor.company_name}
                    className="w-full h-full object-contain"
                  />
                </div>
              )}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-yellow-600 text-white text-xs font-semibold uppercase tracking-wider">
                    {sponsor.tier} Sponsor
                  </span>
                  {sponsor.is_founding_sponsor && (
                    <span className="px-3 py-1 rounded-full bg-white/10 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-wider">
                      Founding Sponsor
                    </span>
                  )}
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-200 bg-clip-text text-transparent">
                  {sponsor.landing_page_headline || sponsor.company_name}
                </h1>
              </div>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="container mx-auto px-4 py-12 md:py-16">
          <div className="max-w-4xl mx-auto space-y-12">
            {/* Description */}
            {sponsor.landing_page_description && (
              <div className="prose prose-lg max-w-none">
                <p className="text-xl md:text-2xl text-blue-100/90 leading-relaxed">
                  {sponsor.landing_page_description}
                </p>
              </div>
            )}

            {/* Impact & Partnership Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-6 text-center space-y-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center mx-auto">
                  <Award className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-amber-100 font-semibold">Corporate Partner</h3>
                <p className="text-blue-200/70 text-sm">Committed to economic empowerment through strategic partnership</p>
              </div>
              <div className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-6 text-center space-y-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center mx-auto">
                  <Heart className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-amber-100 font-semibold">Community Impact</h3>
                <p className="text-blue-200/70 text-sm">Supporting Black-owned businesses and circulating wealth</p>
              </div>
              <div className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-6 text-center space-y-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mx-auto">
                  <Globe className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-amber-100 font-semibold">Economic Growth</h3>
                <p className="text-blue-200/70 text-sm">Driving sustainable economic development nationwide</p>
              </div>
            </div>

            {/* CTA Section */}
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center pt-4">
              {sponsor.landing_page_cta_url && (
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white font-semibold px-8 py-6 text-lg rounded-xl shadow-lg shadow-amber-500/25 gap-2"
                >
                  <a href={sponsor.landing_page_cta_url} target="_blank" rel="noopener noreferrer">
                    {sponsor.landing_page_cta_text || 'Learn More'}
                    <ArrowRight className="h-5 w-5" />
                  </a>
                </Button>
              )}
              {sponsor.website_url && (
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-white/20 text-blue-100 hover:bg-white/10 px-8 py-6 text-lg rounded-xl gap-2"
                >
                  <a href={sponsor.website_url} target="_blank" rel="noopener noreferrer">
                    Visit Website
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
