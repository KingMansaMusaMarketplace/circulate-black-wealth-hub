import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { 
  ArrowLeft, 
  Star, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Share2, 
  Heart,
  Clock,
  Verified,
  Camera
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { BookingForm } from '@/components/booking/BookingForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ReviewForm } from '@/components/reviews/ReviewForm';
import { ReviewsList } from '@/components/reviews/ReviewsList';
import { useNavigate } from 'react-router-dom';

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
  average_rating: number;
  review_count: number;
  created_at: string;
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

  const loadBusiness = async () => {
    if (!businessId) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('id', businessId)
        .single();

      if (error) throw error;
      setBusiness(data);
    } catch (error: any) {
      console.error('Error loading business:', error);
      setError(error.message || 'Failed to load business details');
    } finally {
      setLoading(false);
    }
  };

  const loadReviews = async () => {
    if (!businessId) return;

    try {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          profiles:customer_id (full_name)
        `)
        .eq('business_id', businessId)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      
      const formattedReviews = data?.map(review => ({
        ...review,
        customer_name: review.profiles?.full_name || 'Anonymous User'
      })) || [];
      
      setReviews(formattedReviews);
    } catch (error: any) {
      console.error('Error loading reviews:', error);
    }
  };

  const loadServices = async () => {
    if (!businessId) return;
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
        {/* Animated gradient orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-yellow-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }} />
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-yellow-400/15 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />

        {/* Header */}
        <div className="border-b border-white/10 bg-slate-900/40 backdrop-blur-xl sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link to="/businesses" className="flex items-center gap-2 text-blue-200 hover:text-yellow-400 transition-colors">
                <ArrowLeft className="h-4 w-4" />
                Back to Businesses
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
          {business.banner_url ? (
            <div className="h-64 md:h-80 overflow-hidden">
              <img 
                src={business.banner_url} 
                alt={business.business_name}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="h-64 md:h-80 bg-gradient-to-br from-blue-600/30 to-yellow-500/20" />
          )}
          
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
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl md:text-4xl font-bold text-white">
                      {business.business_name}
                    </h1>
                    {business.is_verified && (
                      <Verified className="h-6 w-6 text-yellow-400" />
                    )}
                  </div>
                  
                  <div className="flex items-center gap-4 mb-3 flex-wrap">
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

                <TabsContent value="about">
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
            </div>

            {/* Right Column - Contact & Info */}
            <div className="space-y-6">
              {/* Contact Info */}
              <Card className="bg-slate-900/40 backdrop-blur-xl border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Contact Information</CardTitle>
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
                  
                  {business.email && (
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-yellow-400" />
                      <div>
                        <p className="font-medium text-white">Email</p>
                        <a 
                          href={`mailto:${business.email}`} 
                          className="text-sm text-yellow-400 hover:text-yellow-300 hover:underline"
                        >
                          {business.email}
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
                  {business.phone && (
                    <Button className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-slate-900 font-semibold" asChild>
                      <a href={`tel:${business.phone}`}>
                        <Phone className="h-4 w-4 mr-2" />
                        Call Business
                      </a>
                    </Button>
                  )}
                  
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
