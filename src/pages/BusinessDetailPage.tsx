import React, { useState, useEffect, useMemo, memo, lazy, Suspense } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  ArrowLeft, 
  Star, 
  MapPin, 
  Globe, 
  Share2, 
  Heart,
  Clock,
  Camera,
  Info,
  Phone
} from 'lucide-react';
import { FoundingSponsorBadge } from '@/components/badges/FoundingSponsorBadge';
import VerifiedBlackOwnedBadge from '@/components/ui/VerifiedBlackOwnedBadge';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { useAuth } from '@/contexts/AuthContext';
import { BusinessContactForm } from '@/components/business/BusinessContactForm';
import { toast } from 'sonner';
import { BookingForm } from '@/components/booking/BookingForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ReviewForm } from '@/components/reviews/ReviewForm';
import { ReviewsList } from '@/components/reviews/ReviewsList';
import AIReviewSummary from '@/components/business/AIReviewSummary';
import { useNavigate } from 'react-router-dom';
// Sample business data removed - all data comes from Supabase
import { getBusinessBanner } from '@/utils/businessBanners';
const BusinessLocationMap = lazy(() => import('@/components/business-detail/BusinessLocationMap'));
import RelatedBusinesses from '@/components/business-detail/RelatedBusinesses';
import BusinessImpactScorecard from '@/components/community-impact/BusinessImpactScorecard';
import { getRememberedDirectoryUrl } from '@/utils/directoryReturn';
import BoostVisibilityCard from '@/components/business/BoostVisibilityCard';
import { BusinessStructuredData } from '@/components/SEO/BusinessStructuredData';
import { BreadcrumbStructuredData } from '@/components/SEO/BreadcrumbStructuredData';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

// Subtle static accent — Apple-minimal, no animated colored orbs
const BackgroundAccent = memo(() => (
  <div
    className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,179,0,0.05),transparent_60%)] pointer-events-none"
    style={{ contain: 'strict' }}
  />
));
BackgroundAccent.displayName = 'BackgroundAccent';

// Helper to check if ID is a valid UUID
const isValidUUID = (id: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

interface Business {
  id: string;
  business_name: string;
  description: string;
  category: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  phone: string;
  email: string;
  website: string;
  logo_url: string;
  banner_url: string;
  is_verified: boolean;
  is_founding_sponsor: boolean;
  average_rating: number;
  review_count: number;
  created_at: string;
  latitude?: number;
  longitude?: number;
  owner_id?: string;
}

interface Review {
  id: string;
  customer_id: string;
  rating: number;
  review_text: string;
  created_at: string;
  customer_name?: string;
}

const BUSINESS_CACHE_PREFIX = 'mm:business-detail:';

const getCachedBusiness = (id: string): Business | null => {
  try {
    const cached = sessionStorage.getItem(`${BUSINESS_CACHE_PREFIX}${id}`);
    return cached ? JSON.parse(cached) as Business : null;
  } catch {
    return null;
  }
};

const cacheBusiness = (business: Business) => {
  try {
    sessionStorage.setItem(`${BUSINESS_CACHE_PREFIX}${business.id}`, JSON.stringify(business));
  } catch {
    // sessionStorage can fail in private browsing — safe to ignore.
  }
};

const BusinessDetailPage = () => {
  const { businessId } = useParams<{ businessId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [business, setBusiness] = useState<Business | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isSampleBusiness, setIsSampleBusiness] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const loadBusiness = async () => {
    if (!businessId) {
      setBusiness(null);
      setError('Business not found');
      setLoading(false);
      return;
    }

    const cachedBusiness = getCachedBusiness(businessId);

    try {
      setLoading(!cachedBusiness);
      setError(null);
      setIsSampleBusiness(false);

      if (cachedBusiness) {
        setBusiness(cachedBusiness);
      } else {
        setBusiness(null);
      }

      // Look up by UUID or slug
      const isUuid = isValidUUID(businessId);
      const { data, error } = isUuid
        ? await supabase.rpc('get_directory_business_by_id', { p_business_id: businessId })
        : await supabase.rpc('get_directory_business_by_slug', { p_slug: businessId });

      if (error) throw error;

      const row = Array.isArray(data) ? data[0] : data;
      if (!row) {
        if (!cachedBusiness) {
          setError('Business not found');
        }
        return;
      }

      // If accessed by UUID and a slug exists, redirect to the slug URL (better SEO + shareable)
      if (isUuid && row.slug && row.slug !== businessId) {
        navigate(`/business/${row.slug}`, { replace: true });
        return;
      }

      const nextBusiness = {
        id: row.id,
        business_name: row.business_name || row.name || '',
        description: row.description || '',
        category: row.category || '',
        address: row.address || '',
        city: row.city || '',
        state: row.state || '',
        zip_code: row.zip_code || '',
        phone: row.phone || '',
        email: row.email || '',
        website: row.website || '',
        logo_url: row.logo_url || '',
        banner_url: row.banner_url || '',
        is_verified: row.is_verified || false,
        is_founding_sponsor: row.is_founding_sponsor || false,
        average_rating: row.average_rating || 0,
        review_count: row.review_count || 0,
        created_at: row.created_at || new Date().toISOString(),
        latitude: row.latitude,
        longitude: row.longitude
      };

      setBusiness(nextBusiness);
      cacheBusiness(nextBusiness);
    } catch (error: any) {
      console.error('Error loading business:', error);
      if (!cachedBusiness) {
        const message = String(error?.message || '').toLowerCase();
        const isTimeout = error?.name === 'AbortError' || message.includes('abort') || message.includes('timed out');
        setError(isTimeout 
          ? 'Connection timed out. Please check your internet and try again.' 
          : (error.message || 'Failed to load business details'));
      }
    } finally {
      setLoading(false);
    }
  };

  const loadReviews = async () => {
    if (!businessId || !isValidUUID(businessId)) return; // Skip for sample businesses

    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('business_id', businessId)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      
      // Fetch profile names separately since there's no FK relationship
      const customerIds = [...new Set(data?.map(r => r.customer_id).filter(Boolean) || [])];
      let profilesMap: Record<string, string> = {};
      
      if (customerIds.length > 0) {
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, full_name')
          .in('id', customerIds);
        
        profiles?.forEach(p => {
          profilesMap[p.id] = p.full_name || 'Anonymous User';
        });
      }
      
      const formattedReviews = data?.map(review => ({
        ...review,
        customer_name: profilesMap[review.customer_id] || 'Anonymous User'
      })) || [];
      
      setReviews(formattedReviews);
    } catch (error: any) {
      console.error('Error loading reviews:', error);
    }
  };

  const loadServices = async () => {
    if (!businessId || !isValidUUID(businessId)) return; // Skip for sample businesses
    try {
      const { data, error } = await supabase
        .from('business_services')
        .select('*')
        .eq('business_id', businessId)
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setServices(data || []);
    } catch (error: any) {
      console.error('Error loading services:', error);
    }
  };

  useEffect(() => {
    loadBusiness();
    loadReviews();
    loadServices();
  }, [businessId, retryCount]);

  const renderStars = (rating: number, size: 'sm' | 'md' = 'sm') => {
    const starSize = size === 'sm' ? 'h-4 w-4' : 'h-5 w-5';

    return Array.from({ length: 5 }).map((_, index) => (
      <Star
        key={index}
        className={`${starSize} ${
          index < Math.floor(rating)
            ? 'text-mansagold fill-mansagold'
            : 'text-mansagold/25'
        }`}
      />
    ));
  };

  const getShareUrl = () => {
    // Use the published domain for sharing, not the preview URL
    const publishedDomain = 'https://1325.ai';
    const path = window.location.pathname + window.location.search + window.location.hash;
    return `${publishedDomain}${path}`;
  };

  const handleShare = async () => {
    const shareUrl = getShareUrl();
    if (navigator.share && business) {
      try {
        await navigator.share({
          title: business.business_name,
          text: business.description,
          url: shareUrl,
        });
      } catch (error) {
        // Fallback to clipboard
        navigator.clipboard.writeText(shareUrl);
        toast.success('Link copied to clipboard');
      }
    } else {
      navigator.clipboard.writeText(shareUrl);
      toast.success('Link copied to clipboard');
    }
  };

  const handleLike = () => {
    if (!user) {
      toast.error('Please sign in to save businesses');
      return;
    }
    setIsLiked(!isLiked);
    toast.success(isLiked ? 'Removed from favorites' : 'Added to favorites');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">
        <BackgroundAccent />
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !business) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center relative overflow-hidden px-4">
        <BackgroundAccent />
        <div className="relative z-10 text-center max-w-md space-y-6">
          <div className="text-6xl">😔</div>
          <h2 className="text-xl font-bold text-white">
            {error?.includes('timed out') ? 'Connection Issue' : 'Business Not Found'}
          </h2>
          <p className="text-slate-400 text-sm">
            {error || 'This business listing could not be loaded.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={() => setRetryCount(c => c + 1)}
              className="bg-mansagold hover:bg-mansagold/90 text-black font-semibold"
            >
              Try Again
            </Button>
            <Link to="/directory">
              <Button variant="outline" className="border-white/15 text-white hover:bg-white/5 w-full">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Directory
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Build a unique, indexable description even when the listing is thin.
  // Google demotes pages whose description is empty or boilerplate; this
  // gives every business something specific to index on.
  const locationLabel = [business.city, business.state].filter(Boolean).join(', ');
  const categoryLabel = business.category || 'Black-owned business';
  const fallbackDescription = `${business.business_name} is a Black-owned ${categoryLabel.toLowerCase()}${locationLabel ? ` located in ${locationLabel}` : ''}. Find contact info, hours, and reviews on 1325.AI's directory of 43,000+ Black-owned businesses.`;
  const metaDescription = (business.description && business.description.trim().length > 40)
    ? business.description.trim().slice(0, 300)
    : fallbackDescription;
  const canonicalUrl = `https://1325.ai/business/${business.id}`;
  const ogImage = business.banner_url || business.logo_url || 'https://1325.ai/mmm-logo.png';
  const pageTitle = locationLabel
    ? `${business.business_name} — ${categoryLabel} in ${locationLabel} | 1325.AI`
    : `${business.business_name} | 1325.AI`;

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={metaDescription} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="profile" />
        <meta property="og:image" content={ogImage} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={metaDescription} />
        <meta name="twitter:image" content={ogImage} />
      </Helmet>
      {/* Emit LocalBusiness JSON-LD for every business (was previously gated on is_verified, which excluded ~44K pages from rich-result eligibility). */}
      <BusinessStructuredData business={business} />
      <BreadcrumbStructuredData
        items={[
          { name: 'Home', url: '/' },
          { name: 'Directory', url: '/directory' },
          ...(business.category
            ? [{ name: business.category, url: `/directory?category=${encodeURIComponent(business.category)}` }]
            : []),
          ...(business.city
            ? [{ name: business.city, url: `/black-owned/city/${encodeURIComponent(business.city.toLowerCase().replace(/\s+/g, '-'))}` }]
            : []),
          { name: business.business_name, url: canonicalUrl },
        ]}
      />




      <div className="min-h-screen bg-black relative overflow-hidden">
        <BackgroundAccent />

        {/* Header */}
        <div className="border-b border-white/10 bg-black/80 backdrop-blur-xl sticky top-0 z-50">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  const remembered = getRememberedDirectoryUrl();
                  if (remembered) {
                    navigate(remembered);
                  } else if (
                    window.history.length > 1 &&
                    document.referrer &&
                    document.referrer.includes(window.location.host)
                  ) {
                    navigate(-1);
                  } else {
                    navigate('/directory');
                  }
                }}
                className="flex items-center gap-2 text-slate-300 hover:text-mansagold transition-colors text-sm"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Directory
              </button>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLike}
                  className={`hover:bg-white/5 ${isLiked ? 'text-red-400 hover:text-red-400' : 'text-slate-300 hover:text-white'}`}
                >
                  <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleShare}
                  className="text-slate-300 hover:bg-white/5 hover:text-white"
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Visible breadcrumbs (SEO + UX) */}
        <nav className="relative z-10 border-b border-white/5 bg-black/40">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <Breadcrumb>
              <BreadcrumbList className="text-slate-400">
                <BreadcrumbItem>
                  <BreadcrumbLink href="/" className="hover:text-mansagold">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/directory" className="hover:text-mansagold">Directory</BreadcrumbLink>
                </BreadcrumbItem>
                {business.category && (
                  <>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbLink
                        href={`/directory?category=${encodeURIComponent(business.category)}`}
                        className="hover:text-mansagold"
                      >
                        {business.category}
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                  </>
                )}
                {business.city && (
                  <>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbLink
                        href={`/black-owned/city/${encodeURIComponent(business.city.toLowerCase().replace(/\s+/g, '-'))}`}
                        className="hover:text-mansagold"
                      >
                        {business.city}
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                  </>
                )}
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-white truncate max-w-[200px] sm:max-w-none">
                    {business.business_name}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="relative z-10">
          {/* Banner Image */}
          {(() => {
            const bannerUrl = getBusinessBanner(business.id, business.banner_url, business.website);
            return bannerUrl ? (
              <div className="h-72 md:h-96 overflow-hidden">
                <img
                  src={bannerUrl}
                  alt={business.business_name}
                  className="w-full h-full object-cover object-[center_25%]"
                />
              </div>
            ) : (
              <div className="h-64 md:h-80 bg-slate-900" />
            );
          })()}

          {/* Business Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent text-white">
            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
                {/* Logo */}
                <Avatar className="w-24 h-24 border border-mansagold/40 ring-1 ring-black/40">
                  <AvatarImage src={business.logo_url} alt={business.business_name} />
                  <AvatarFallback className="text-2xl font-bold bg-slate-800 text-mansagold">
                    {business.business_name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                {/* Business Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <h1 className="font-display text-3xl md:text-4xl font-bold text-white tracking-tight">
                      {business.business_name}
                    </h1>
                    {business.is_founding_sponsor && (
                      <FoundingSponsorBadge size="md" />
                    )}
                  </div>

                  <div className="flex items-center gap-4 mb-2 flex-wrap">
                    <Badge variant="outline" className="bg-mansagold/10 text-mansagold border-mansagold/30">
                      {business.category}
                    </Badge>

                    {business.average_rating > 0 ? (
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          {renderStars(business.average_rating, 'md')}
                        </div>
                        <span className="text-slate-300 text-sm">
                          {business.average_rating.toFixed(1)} <span className="text-slate-500">({business.review_count} reviews)</span>
                        </span>
                      </div>
                    ) : (
                      <span className="text-slate-500 text-sm">No reviews yet</span>
                    )}
                  </div>

                  {business.is_verified && (
                    <div className="mb-3">
                      <VerifiedBlackOwnedBadge tier="certified" variant="compact" showTooltip={true} />
                    </div>
                  )}

                  {(business.city || business.state) && (
                    <div className="flex items-center gap-1 text-slate-300 text-sm">
                      <MapPin className="h-4 w-4 text-mansagold" />
                      <span>{business.city}{business.city && business.state ? ', ' : ''}{business.state}</span>
                    </div>
                  )}
                </div>

                {/* Book Now Button */}
                <Button
                  size="lg"
                  onClick={() => navigate(`/book/${businessId}`)}
                  className="bg-mansagold hover:bg-mansagold/90 text-black font-semibold"
                >
                  Book Appointment
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
          {/* Owner-only: Boost Visibility upsell */}
          {user?.id && business.owner_id && user.id === business.owner_id && (
            <div className="mb-6 max-w-md">
              <BoostVisibilityCard />
            </div>
          )}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Tabs: About, Book, Reviews */}
              <Tabs defaultValue="about" className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-slate-900/40 border border-white/10">
                  <TabsTrigger value="about" className="data-[state=active]:bg-mansagold data-[state=active]:text-black text-slate-300">About</TabsTrigger>
                  <TabsTrigger value="book" className="data-[state=active]:bg-mansagold data-[state=active]:text-black text-slate-300">Book Appointment</TabsTrigger>
                  <TabsTrigger value="reviews" className="data-[state=active]:bg-mansagold data-[state=active]:text-black text-slate-300">Reviews ({reviews.length})</TabsTrigger>
                </TabsList>

                <TabsContent value="about" className="space-y-6">
                  <Card className="bg-slate-900/40 border-white/10">
                    <CardHeader>
                      <CardTitle className="text-white">About {business.business_name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-slate-300 leading-relaxed">
                        {business.description || 'No description available.'}
                      </p>
                    </CardContent>
                  </Card>

                  {/* Business Location Map */}
                  {business.city && business.state && (
                    <Card className="bg-slate-900/40 border-white/10">
                      <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                          <MapPin className="h-5 w-5 text-mansagold" />
                          Business Location
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Suspense fallback={<div className="h-64 w-full bg-slate-800/40 rounded-lg animate-pulse" />}>
                          <BusinessLocationMap
                            lat={business.latitude || 0}
                            lng={business.longitude || 0}
                            businessName={business.business_name}
                            address={business.address || ''}
                            city={business.city}
                            state={business.state}
                          />
                        </Suspense>
                        <div className="text-center mt-4 space-y-2">
                          <p className="text-slate-300 text-sm">
                            {business.address ? `${business.address}, ` : ''}{business.city}, {business.state} {business.zip_code}
                          </p>
                          {business.phone && (
                            <p className="text-slate-300 text-sm">
                              <a
                                href={`tel:${business.phone}`}
                                className="inline-flex items-center hover:text-mansagold transition-colors"
                              >
                                <Phone size={16} className="mr-1" />
                                {business.phone}
                              </a>
                            </p>
                          )}
                          <a
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${business.address ? business.address + ', ' : ''}${business.city}, ${business.state}`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-mansagold hover:text-mansagold/80 hover:underline"
                          >
                            <MapPin size={16} className="mr-1" />
                            Get Directions
                          </a>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="book">
                  <div className="bg-slate-900/40 border border-white/10 rounded-lg p-6">
                    <BookingForm
                      businessId={business.id}
                      businessName={business.business_name}
                      services={services}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="reviews" className="space-y-6">
                  {user && (
                    <div className="bg-slate-900/40 border border-white/10 rounded-lg p-6">
                      <ReviewForm
                        businessId={business.id}
                        onSuccess={loadReviews}
                      />
                    </div>
                  )}

                  <AIReviewSummary businessId={business.id} />

                  <div className="bg-slate-900/40 border border-white/10 rounded-lg p-6">
                    <ReviewsList businessId={business.id} />
                  </div>
                </TabsContent>
              </Tabs>

              {/* Related Businesses Section */}
              {business.category && (
                <RelatedBusinesses 
                  currentBusinessId={business.id}
                  category={business.category}
                  city={business.city}
                  limit={6}
                />
              )}
            </div>

            {/* Right Column - Contact & Info */}
            <div className="space-y-6">
              {/* Community Impact Scorecard */}
              <BusinessImpactScorecard
                businessId={business.id}
                businessName={business.business_name}
              />

              {/* Contact Form - Secure Alternative */}
              <BusinessContactForm 
                businessId={business.id} 
                businessName={business.business_name} 
              />

              {/* Location Info (public) */}
              <Card className="bg-slate-900/40 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Location</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {business.address && (
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-mansagold mt-0.5" />
                      <div>
                        <p className="font-medium text-white text-sm">Address</p>
                        <p className="text-sm text-slate-400">
                          {business.address}
                          {business.city && <><br />{business.city}{business.state && `, ${business.state}`} {business.zip_code}</>}
                        </p>
                      </div>
                    </div>
                  )}

                  {business.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-mansagold" />
                      <div>
                        <p className="font-medium text-white text-sm">Phone</p>
                        <a
                          href={`tel:${business.phone}`}
                          className="text-sm text-mansagold hover:text-mansagold/80 hover:underline"
                        >
                          {business.phone}
                        </a>
                      </div>
                    </div>
                  )}

                  {business.website && (
                    <div className="flex items-center gap-3">
                      <Globe className="h-5 w-5 text-mansagold" />
                      <div>
                        <p className="font-medium text-white text-sm">Website</p>
                        <a
                          href={business.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-mansagold hover:text-mansagold/80 hover:underline"
                        >
                          Visit Website
                        </a>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="bg-slate-900/40 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">

                  {business.phone && (
                    <Button variant="outline" className="w-full border-white/15 bg-transparent text-slate-300 hover:bg-white/5 hover:text-mansagold" asChild>
                      <a href={`tel:${business.phone}`}>
                        <Phone className="h-4 w-4 mr-2" />
                        Call {business.phone}
                      </a>
                    </Button>
                  )}

                  {business.website && (
                    <Button variant="outline" className="w-full border-white/15 bg-transparent text-slate-300 hover:bg-white/5 hover:text-mansagold" asChild>
                      <a href={business.website} target="_blank" rel="noopener noreferrer">
                        <Globe className="h-4 w-4 mr-2" />
                        Visit Website
                      </a>
                    </Button>
                  )}

                  <Button variant="outline" className="w-full border-white/15 bg-transparent text-slate-300 hover:bg-white/5 hover:text-mansagold" onClick={handleShare}>
                    <Share2 className="h-4 w-4 mr-2" />
                    Share Business
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BusinessDetailPage;
