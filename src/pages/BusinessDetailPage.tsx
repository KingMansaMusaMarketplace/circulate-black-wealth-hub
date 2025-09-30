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
  const [business, setBusiness] = useState<Business | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
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

  useEffect(() => {
    loadBusiness();
    loadReviews();
  }, [businessId]);

  const renderStars = (rating: number, size: 'sm' | 'md' = 'sm') => {
    const starSize = size === 'sm' ? 'h-4 w-4' : 'h-5 w-5';
    
    return Array.from({ length: 5 }).map((_, index) => (
      <Star
        key={index}
        className={`${starSize} ${
          index < Math.floor(rating) 
            ? 'text-yellow-400 fill-current' 
            : 'text-gray-300'
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
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !business) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Alert className="max-w-md">
          <AlertDescription>
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

      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="border-b bg-background/95 backdrop-blur sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link to="/businesses" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                <ArrowLeft className="h-4 w-4" />
                Back to Businesses
              </Link>
              
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleLike}
                  className={isLiked ? 'text-red-500' : ''}
                >
                  <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
                </Button>
                <Button variant="ghost" size="sm" onClick={handleShare}>
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <div className="relative">
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
            <div className="h-64 md:h-80 bg-gradient-to-br from-primary/20 to-primary/10" />
          )}
          
          {/* Business Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent text-white">
            <div className="container mx-auto px-4 py-8">
              <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
                {/* Logo */}
                <Avatar className="w-24 h-24 border-4 border-background">
                  <AvatarImage src={business.logo_url} alt={business.business_name} />
                  <AvatarFallback className="text-2xl font-bold bg-primary text-primary-foreground">
                    {business.business_name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                {/* Business Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl md:text-4xl font-bold">
                      {business.business_name}
                    </h1>
                    {business.is_verified && (
                      <Verified className="h-6 w-6 text-blue-400" />
                    )}
                  </div>
                  
                  <div className="flex items-center gap-4 mb-3">
                    <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                      {business.category}
                    </Badge>
                    
                    {business.average_rating > 0 ? (
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          {renderStars(business.average_rating, 'md')}
                        </div>
                        <span className="text-white/90">
                          {business.average_rating.toFixed(1)} ({business.review_count} reviews)
                        </span>
                      </div>
                    ) : (
                      <span className="text-white/70">No reviews yet</span>
                    )}
                  </div>
                  
                  {(business.city || business.state) && (
                    <div className="flex items-center gap-1 text-white/90">
                      <MapPin className="h-4 w-4" />
                      <span>{business.city}{business.city && business.state ? ', ' : ''}{business.state}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Tabs: About, Book, Reviews */}
              <Tabs defaultValue="about" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="about">About</TabsTrigger>
                  <TabsTrigger value="book">Book Appointment</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews ({reviews.length})</TabsTrigger>
                </TabsList>

                <TabsContent value="about">
                  <Card>
                    <CardHeader>
                      <CardTitle>About {business.business_name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground leading-relaxed">
                        {business.description || 'No description available.'}
                      </p>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="book">
                  <BookingForm
                    businessId={business.id}
                    businessName={business.business_name}
                  />
                </TabsContent>

                <TabsContent value="reviews">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        Reviews ({reviews.length})
                        {user && (
                          <Button size="sm">Write a Review</Button>
                        )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {reviews.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                          <p>No reviews yet. Be the first to review this business!</p>
                        </div>
                      ) : (
                    <div className="space-y-6">
                      {reviews.map((review) => (
                        <div key={review.id}>
                          <div className="flex items-start gap-4">
                            <Avatar>
                              <AvatarFallback>
                                {review.customer_name?.charAt(0).toUpperCase() || 'U'}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium">{review.customer_name}</span>
                                <div className="flex items-center gap-1">
                                  {renderStars(review.rating)}
                                </div>
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">
                                {new Date(review.created_at).toLocaleDateString()}
                              </p>
                              {review.review_text && (
                                <p className="text-sm">{review.review_text}</p>
                              )}
                            </div>
                          </div>
                          <Separator className="mt-4" />
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Right Column - Contact & Info */}
            <div className="space-y-6">
              {/* Contact Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {business.address && (
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="font-medium">Address</p>
                        <p className="text-sm text-muted-foreground">
                          {business.address}
                          {business.city && <><br />{business.city}{business.state && `, ${business.state}`} {business.zip_code}</>}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {business.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Phone</p>
                        <a 
                          href={`tel:${business.phone}`} 
                          className="text-sm text-primary hover:underline"
                        >
                          {business.phone}
                        </a>
                      </div>
                    </div>
                  )}
                  
                  {business.email && (
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Email</p>
                        <a 
                          href={`mailto:${business.email}`} 
                          className="text-sm text-primary hover:underline"
                        >
                          {business.email}
                        </a>
                      </div>
                    </div>
                  )}
                  
                  {business.website && (
                    <div className="flex items-center gap-3">
                      <Globe className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Website</p>
                        <a 
                          href={business.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline"
                        >
                          Visit Website
                        </a>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {business.phone && (
                    <Button className="w-full" asChild>
                      <a href={`tel:${business.phone}`}>
                        <Phone className="h-4 w-4 mr-2" />
                        Call Business
                      </a>
                    </Button>
                  )}
                  
                  {business.website && (
                    <Button variant="outline" className="w-full" asChild>
                      <a href={business.website} target="_blank" rel="noopener noreferrer">
                        <Globe className="h-4 w-4 mr-2" />
                        Visit Website
                      </a>
                    </Button>
                  )}
                  
                  <Button variant="outline" className="w-full" onClick={handleShare}>
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