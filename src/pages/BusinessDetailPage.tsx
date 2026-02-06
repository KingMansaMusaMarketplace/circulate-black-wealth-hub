import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
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
import { useNavigate } from 'react-router-dom';
import { businesses as sampleBusinesses } from '@/data/businessesData';
import { getBusinessBanner } from '@/utils/businessBanners';
import BusinessLocationMap from '@/components/business-detail/BusinessLocationMap';
import RelatedBusinesses from '@/components/business-detail/RelatedBusinesses';

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
}

interface Review {
  id: string;
  customer_id: string;
  rating: number;
  review_text: string;
  created_at: string;
  customer_name?: string;
}

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

  const loadBusiness = async () => {
    if (!businessId) return;

    try {
      setLoading(true);
      setError(null);
      setIsSampleBusiness(false);

      // Check if this is a valid UUID (real database business)
      if (isValidUUID(businessId)) {
        // First try the public business_directory view (works for anonymous users)
        let { data, error } = await supabase
          .from('business_directory')
          .select('*')
          .eq('id', businessId)
          .maybeSingle();

        // If not found in directory view, try the businesses table (for authenticated users/owners)
        if (!data && !error) {
          const result = await supabase
            .from('businesses')
            .select('*')
            .eq('id', businessId)
            .maybeSingle();
          data = result.data;
          error = result.error;
        }

        if (error) throw error;
        if (!data) {
          setError('Business not found');
          return;
        }
        
        // Map from view/table to Business interface (handle both column naming conventions)
        setBusiness({
          id: data.id,
          business_name: data.business_name || data.name || '',
          description: data.description || '',
          category: data.category || '',
          address: data.address || '',
          city: data.city || '',
          state: data.state || '',
          zip_code: data.zip_code || '',
          phone: data.phone || '',
          email: data.email || '',
          website: data.website || '',
          logo_url: data.logo_url || '',
          banner_url: data.banner_url || '',
          is_verified: data.is_verified || false,
          is_founding_sponsor: data.is_founding_sponsor || false,
          average_rating: data.average_rating || 0,
          review_count: data.review_count || 0,
          created_at: data.created_at || new Date().toISOString(),
          latitude: data.latitude,
          longitude: data.longitude
        });
      } else {
        // Non-UUID ID - look in sample/demo data
        const sampleBusiness = sampleBusinesses.find(b => b.id === businessId);
        if (sampleBusiness) {
          // Map sample business to expected Business interface
          setBusiness({
            id: sampleBusiness.id,
            business_name: sampleBusiness.name,
            description: sampleBusiness.description || '',
            category: sampleBusiness.category,
            address: sampleBusiness.address || '',
            city: sampleBusiness.city || '',
            state: sampleBusiness.state || '',
            zip_code: sampleBusiness.zipCode || '',
            phone: sampleBusiness.phone || '',
            email: sampleBusiness.email || '',
            website: sampleBusiness.website || '',
            logo_url: sampleBusiness.logoUrl || sampleBusiness.imageUrl || '',
            banner_url: sampleBusiness.bannerUrl || '',
            is_verified: sampleBusiness.isVerified || false,
            is_founding_sponsor: false,
            average_rating: sampleBusiness.rating || sampleBusiness.averageRating || 0,
            review_count: sampleBusiness.reviewCount || 0,
            created_at: sampleBusiness.createdAt || new Date().toISOString()
          });
          setIsSampleBusiness(true);
        } else {
          setError('Business not found');
        }
      }
    } catch (error: any) {
      console.error('Error loading business:', error);
      setError(error.message || 'Failed to load business details');
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
  }, [businessId]);

  const renderStars = (rating: number, size: 'sm' | 'md' = 'sm') => {
    const starSize = size === 'sm' ? 'h-4 w-4' : 'h-5 w-5';
    
    return Array.from({ length: 5 }).map((_, index) => (
      <Star
        key={index}
        className={`${starSize} ${
          index < Math.floor(rating) 
            ? 'text-yellow-400 fill-current' 
            : 'text-yellow-400/30'
        }`}
      />
    ));
  };

  const handleShare = async () => {
    if (navigator.share && business) {
      try {
        await navigator.share({
          title: business.business_name,
          text: business.description,
          url: window.location.href,
        });
      } catch (error) {
        // Fallback to clipboard
        navigator.clipboard.writeText(window.location.href);
        toast.success('Link copied to clipboard');
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center relative overflow-hidden">
        {/* Animated gradient orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-yellow-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !business) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center relative overflow-hidden">
        {/* Animated gradient orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-yellow-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <Alert className="max-w-md bg-slate-900/40 backdrop-blur-xl border-white/10">
          <AlertDescription className="text-white">
            {error || 'Business not found'}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{business.business_name} | Mansa Musa Marketplace</title>
        <meta name="description" content={business.description} />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
        {/* Sample Business Banner */}
        {isSampleBusiness && (
          <div className="bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-900 py-3 px-4 relative z-50">
            <div className="container mx-auto flex items-center justify-center gap-3">
              <Info className="h-5 w-5" />
              <p className="text-sm font-medium">
                This is a sample business profile for demonstration purposes. 
                <Link to="/directory" className="underline ml-1 font-semibold hover:text-slate-800">
                  Explore real businesses →
                </Link>
              </p>
            </div>
          </div>
        )}

        {/* Animated gradient orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-yellow-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }} />
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-yellow-400/15 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />

        {/* Header */}
        <div className="border-b border-white/10 bg-slate-900/40 backdrop-blur-xl sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link to="/directory" className="flex items-center gap-2 text-blue-200 hover:text-yellow-400 transition-colors">
                <ArrowLeft className="h-4 w-4" />
                Back to Directory
              </Link>
              
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleLike}
                  className={`text-white hover:bg-white/10 ${isLiked ? 'text-red-400' : ''}`}
                >
                  <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
                </Button>
                <Button variant="ghost" size="sm" onClick={handleShare} className="text-white hover:bg-white/10">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <div className="relative z-10">
          {/* Banner Image */}
          {(() => {
            const bannerUrl = getBusinessBanner(business.id, business.banner_url);
            return bannerUrl ? (
              <div className="h-64 md:h-80 overflow-hidden">
                <img 
                  src={bannerUrl} 
                  alt={business.business_name}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="h-64 md:h-80 bg-gradient-to-br from-blue-600/30 to-yellow-500/20" />
            );
          })()}
          
          {/* Business Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900 via-slate-900/90 to-transparent text-white">
            <div className="container mx-auto px-4 py-8">
              <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
                {/* Logo */}
                <Avatar className="w-24 h-24 border-4 border-yellow-400/50 shadow-lg shadow-yellow-500/20">
                  <AvatarImage src={business.logo_url} alt={business.business_name} />
                  <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-blue-600 to-blue-800 text-white">
                    {business.business_name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                {/* Business Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <h1 className="text-3xl md:text-4xl font-bold text-white">
                      {business.business_name}
                    </h1>
                    {business.is_founding_sponsor && (
                      <FoundingSponsorBadge size="md" />
                    )}
                  </div>
                  
                  <div className="flex items-center gap-4 mb-2 flex-wrap">
                    <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-400/30">
                      {business.category}
                    </Badge>
                    
                    {business.average_rating > 0 ? (
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          {renderStars(business.average_rating, 'md')}
                        </div>
                        <span className="text-blue-200">
                          {business.average_rating.toFixed(1)} ({business.review_count} reviews)
                        </span>
                      </div>
                    ) : (
                      <span className="text-blue-300/70">No reviews yet</span>
                    )}
                  </div>
                  
                  {business.is_verified && (
                    <div className="mb-3">
                      <VerifiedBlackOwnedBadge tier="certified" variant="compact" showTooltip={true} />
                    </div>
                  )}
                  
                  {(business.city || business.state) && (
                    <div className="flex items-center gap-1 text-blue-200">
                      <MapPin className="h-4 w-4 text-yellow-400" />
                      <span>{business.city}{business.city && business.state ? ', ' : ''}{business.state}</span>
                    </div>
                  )}
                </div>
                
                {/* Book Now Button */}
                <Button 
                  size="lg"
                  onClick={() => navigate(`/book/${businessId}`)}
                  className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-slate-900 font-semibold shadow-lg shadow-yellow-500/30"
                >
                  Book Appointment
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Tabs: About, Book, Reviews */}
              <Tabs defaultValue="about" className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-slate-900/40 backdrop-blur-xl border border-white/10">
                  <TabsTrigger value="about" className="data-[state=active]:bg-yellow-500/20 data-[state=active]:text-yellow-300 text-blue-200">About</TabsTrigger>
                  <TabsTrigger value="book" className="data-[state=active]:bg-yellow-500/20 data-[state=active]:text-yellow-300 text-blue-200">Book Appointment</TabsTrigger>
                  <TabsTrigger value="reviews" className="data-[state=active]:bg-yellow-500/20 data-[state=active]:text-yellow-300 text-blue-200">Reviews ({reviews.length})</TabsTrigger>
                </TabsList>

                <TabsContent value="about" className="space-y-6">
                  <Card className="bg-slate-900/40 backdrop-blur-xl border-white/10">
                    <CardHeader>
                      <CardTitle className="text-white">About {business.business_name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-blue-200 leading-relaxed">
                        {business.description || 'No description available.'}
                      </p>
                    </CardContent>
                  </Card>

                  {/* Business Location Map */}
                  {business.address && business.city && business.state && (
                    <Card className="bg-slate-900/40 backdrop-blur-xl border-white/10">
                      <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                          <MapPin className="h-5 w-5" />
                          Business Location
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <BusinessLocationMap
                          lat={business.latitude || 0}
                          lng={business.longitude || 0}
                          businessName={business.business_name}
                          address={business.address}
                          city={business.city}
                          state={business.state}
                        />
                        <div className="text-center mt-4">
                          <p className="text-blue-200 mb-2">
                            {business.address}, {business.city}, {business.state} {business.zip_code}
                          </p>
                          <a 
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${business.address}, ${business.city}, ${business.state}`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-yellow-400 hover:text-yellow-300 hover:underline"
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
                  <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-lg p-6">
                    <BookingForm
                      businessId={business.id}
                      businessName={business.business_name}
                      services={services}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="reviews" className="space-y-6">
                  {user && (
                    <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-lg p-6">
                      <ReviewForm 
                        businessId={business.id} 
                        onSuccess={loadReviews}
                      />
                    </div>
                  )}
                  
                  <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-lg p-6">
                    <ReviewsList businessId={business.id} />
                  </div>
                </TabsContent>
              </Tabs>

              {/* Related Businesses Section */}
              {business.category && (
                <RelatedBusinesses 
                  currentBusinessId={business.id}
                  category={business.category}
                  limit={4}
                />
              )}
            </div>

            {/* Right Column - Contact & Info */}
            <div className="space-y-6">
              {/* Contact Form - Secure Alternative */}
              <BusinessContactForm 
                businessId={business.id} 
                businessName={business.business_name} 
              />

              {/* Location Info (public) */}
              <Card className="bg-slate-900/40 backdrop-blur-xl border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Location</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {business.address && (
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-yellow-400 mt-0.5" />
                      <div>
                        <p className="font-medium text-white">Address</p>
                        <p className="text-sm text-blue-200">
                          {business.address}
                          {business.city && <><br />{business.city}{business.state && `, ${business.state}`} {business.zip_code}</>}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {business.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-yellow-400" />
                      <div>
                        <p className="font-medium text-white">Phone</p>
                        <a 
                          href={`tel:${business.phone}`} 
                          className="text-sm text-yellow-400 hover:text-yellow-300 hover:underline"
                        >
                          {business.phone}
                        </a>
                      </div>
                    </div>
                  )}
                  
                  {business.website && (
                    <div className="flex items-center gap-3">
                      <Globe className="h-5 w-5 text-yellow-400" />
                      <div>
                        <p className="font-medium text-white">Website</p>
                        <a 
                          href={business.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-yellow-400 hover:text-yellow-300 hover:underline"
                        >
                          Visit Website
                        </a>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="bg-slate-900/40 backdrop-blur-xl border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  
                  {business.website && (
                    <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10 hover:text-yellow-300" asChild>
                      <a href={business.website} target="_blank" rel="noopener noreferrer">
                        <Globe className="h-4 w-4 mr-2" />
                        Visit Website
                      </a>
                    </Button>
                  )}
                  
                  <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10 hover:text-yellow-300" onClick={handleShare}>
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
