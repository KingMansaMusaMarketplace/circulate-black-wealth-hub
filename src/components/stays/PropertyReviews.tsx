import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Star, MessageSquare, User, PenLine } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { format } from 'date-fns';
import WriteReviewForm from './reviews/WriteReviewForm';
import { usePropertyReviews } from '@/hooks/usePropertyReviews';

interface PropertyReviewsProps {
  propertyId: string;
  isHost?: boolean;
}

interface Review {
  id: string;
  rating: number;
  cleanliness?: number;
  communication?: number;
  location?: number;
  value?: number;
  review_text?: string;
  host_response?: string;
  host_response_at?: string;
  created_at: string;
  guest_id: string;
  guest_name?: string;
  guest_avatar?: string;
}

interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: { [key: number]: number };
  categoryAverages: {
    cleanliness: number;
    communication: number;
    location: number;
    value: number;
  };
}

const PropertyReviews: React.FC<PropertyReviewsProps> = ({ propertyId, isHost = false }) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [respondingTo, setRespondingTo] = useState<string | null>(null);
  const [responseText, setResponseText] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);

  const { canReview, pendingBookingId, refreshEligibility } = usePropertyReviews({ propertyId });

  useEffect(() => {
    fetchReviews();
  }, [propertyId]);

  const fetchReviews = async () => {
    try {
      const { data: reviewsData, error } = await supabase
        .from('property_reviews')
        .select('*')
        .eq('property_id', propertyId)
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Fetch guest profiles
      if (reviewsData && reviewsData.length > 0) {
        const guestIds = [...new Set(reviewsData.map(r => r.guest_id))];
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, full_name, avatar_url')
          .in('id', guestIds);

        const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);

        const enrichedReviews = reviewsData.map(review => ({
          ...review,
          guest_name: profileMap.get(review.guest_id)?.full_name || 'Guest',
          guest_avatar: profileMap.get(review.guest_id)?.avatar_url,
        }));

        setReviews(enrichedReviews);
        calculateStats(enrichedReviews);
      } else {
        setReviews([]);
        setStats(null);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (reviewsData: Review[]) => {
    if (reviewsData.length === 0) {
      setStats(null);
      return;
    }

    const totalReviews = reviewsData.length;
    const sumRating = reviewsData.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = sumRating / totalReviews;

    // Rating distribution
    const ratingDistribution: { [key: number]: number } = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviewsData.forEach(r => {
      ratingDistribution[r.rating] = (ratingDistribution[r.rating] || 0) + 1;
    });

    // Category averages (using correct column names)
    const cleanlinessReviews = reviewsData.filter(r => r.cleanliness);
    const communicationReviews = reviewsData.filter(r => r.communication);
    const locationReviews = reviewsData.filter(r => r.location);
    const valueReviews = reviewsData.filter(r => r.value);

    const categoryAverages = {
      cleanliness: cleanlinessReviews.length > 0
        ? cleanlinessReviews.reduce((sum, r) => sum + (r.cleanliness || 0), 0) / cleanlinessReviews.length
        : 0,
      communication: communicationReviews.length > 0
        ? communicationReviews.reduce((sum, r) => sum + (r.communication || 0), 0) / communicationReviews.length
        : 0,
      location: locationReviews.length > 0
        ? locationReviews.reduce((sum, r) => sum + (r.location || 0), 0) / locationReviews.length
        : 0,
      value: valueReviews.length > 0
        ? valueReviews.reduce((sum, r) => sum + (r.value || 0), 0) / valueReviews.length
        : 0,
    };

    setStats({ averageRating, totalReviews, ratingDistribution, categoryAverages });
  };

  const handleReviewSuccess = () => {
    setShowReviewForm(false);
    fetchReviews();
    refreshEligibility();
  };

  const submitHostResponse = async (reviewId: string) => {
    if (!responseText.trim()) {
      toast.error('Please enter a response');
      return;
    }

    try {
      const { error } = await supabase
        .from('property_reviews')
        .update({
          host_response: responseText,
          host_responded_at: new Date().toISOString(),
        })
        .eq('id', reviewId);

      if (error) throw error;

      toast.success('Response submitted');
      setRespondingTo(null);
      setResponseText('');
      fetchReviews();
    } catch (error) {
      console.error('Error submitting response:', error);
      toast.error('Failed to submit response');
    }
  };

  const renderStars = (rating: number, size: 'sm' | 'md' = 'sm') => {
    const sizeClass = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map(star => (
          <Star
            key={star}
            className={cn(
              sizeClass,
              star <= rating ? 'fill-mansagold text-mansagold' : 'text-slate-600'
            )}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-slate-700 rounded w-1/4" />
            <div className="h-24 bg-slate-700 rounded" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Write Review Form - Show if user has completed a booking but hasn't reviewed yet */}
      {canReview && pendingBookingId && !isHost && (
        showReviewForm ? (
          <WriteReviewForm
            propertyId={propertyId}
            bookingId={pendingBookingId}
            onSuccess={handleReviewSuccess}
            onCancel={() => setShowReviewForm(false)}
          />
        ) : (
          <Card className="bg-gradient-to-r from-mansagold/10 to-amber-500/10 border-mansagold/30">
            <CardContent className="py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-mansagold/20 flex items-center justify-center">
                    <PenLine className="w-5 h-5 text-mansagold" />
                  </div>
                  <div>
                    <p className="font-medium text-white">Share your experience</p>
                    <p className="text-sm text-slate-400">You stayed here! Leave a review to help future guests.</p>
                  </div>
                </div>
                <Button
                  onClick={() => setShowReviewForm(true)}
                  className="bg-mansagold text-black hover:bg-mansagold/90"
                >
                  Write Review
                </Button>
              </div>
            </CardContent>
          </Card>
        )
      )}

      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Star className="w-5 h-5 text-mansagold" />
            Guest Reviews
          </CardTitle>
          {stats && (
            <CardDescription className="text-slate-400">
              {stats.averageRating.toFixed(1)} average from {stats.totalReviews} reviews
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          {stats && reviews.length > 0 && (
          <>
            {/* Overall Rating Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center gap-4">
                <div className="text-5xl font-bold text-white">
                  {stats.averageRating.toFixed(1)}
                </div>
                <div>
                  {renderStars(Math.round(stats.averageRating), 'md')}
                  <p className="text-sm text-slate-400 mt-1">
                    {stats.totalReviews} review{stats.totalReviews > 1 ? 's' : ''}
                  </p>
                </div>
              </div>

              {/* Rating Distribution */}
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map(rating => {
                  const count = stats.ratingDistribution[rating] || 0;
                  const percentage = stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0;
                  return (
                    <div key={rating} className="flex items-center gap-2 text-sm">
                      <span className="text-slate-400 w-3">{rating}</span>
                      <Star className="w-3 h-3 text-mansagold fill-mansagold" />
                      <Progress value={percentage} className="flex-1 h-2" />
                      <span className="text-slate-500 w-8 text-right">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Category Breakdown */}
            {(stats.categoryAverages.cleanliness > 0 || stats.categoryAverages.communication > 0) && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-slate-700">
                {stats.categoryAverages.cleanliness > 0 && (
                  <div>
                    <p className="text-slate-400 text-sm">Cleanliness</p>
                    <p className="text-white font-semibold">{stats.categoryAverages.cleanliness.toFixed(1)}</p>
                  </div>
                )}
                {stats.categoryAverages.communication > 0 && (
                  <div>
                    <p className="text-slate-400 text-sm">Communication</p>
                    <p className="text-white font-semibold">{stats.categoryAverages.communication.toFixed(1)}</p>
                  </div>
                )}
                {stats.categoryAverages.location > 0 && (
                  <div>
                    <p className="text-slate-400 text-sm">Location</p>
                    <p className="text-white font-semibold">{stats.categoryAverages.location.toFixed(1)}</p>
                  </div>
                )}
                {stats.categoryAverages.value > 0 && (
                  <div>
                    <p className="text-slate-400 text-sm">Value</p>
                    <p className="text-white font-semibold">{stats.categoryAverages.value.toFixed(1)}</p>
                  </div>
                )}
              </div>
            )}

            {/* Individual Reviews */}
            <div className="space-y-4 pt-4 border-t border-slate-700">
              {reviews.map(review => (
                <div key={review.id} className="space-y-3">
                  <div className="flex items-start gap-4">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={review.guest_avatar} />
                      <AvatarFallback className="bg-slate-700">
                        <User className="w-5 h-5 text-slate-400" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-white">{review.guest_name}</span>
                        {renderStars(review.rating)}
                      </div>
                      <p className="text-xs text-slate-500">
                        {format(new Date(review.created_at), 'MMMM yyyy')}
                      </p>
                      {review.review_text && (
                        <p className="text-slate-300 mt-2">{review.review_text}</p>
                      )}

                      {/* Host Response */}
                      {review.host_response && (
                        <div className="mt-3 pl-4 border-l-2 border-mansagold/50">
                          <p className="text-sm text-slate-400 font-medium">Host Response</p>
                          <p className="text-sm text-slate-300">{review.host_response}</p>
                        </div>
                      )}

                      {/* Host Response Form */}
                      {isHost && !review.host_response && (
                        <>
                          {respondingTo === review.id ? (
                            <div className="mt-3 space-y-2">
                              <Textarea
                                value={responseText}
                                onChange={(e) => setResponseText(e.target.value)}
                                placeholder="Write your response..."
                                className="bg-slate-900 border-slate-700 text-white"
                              />
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  onClick={() => submitHostResponse(review.id)}
                                  className="bg-mansagold text-black hover:bg-mansagold/90"
                                >
                                  Submit Response
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => {
                                    setRespondingTo(null);
                                    setResponseText('');
                                  }}
                                >
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="mt-2 text-mansagold"
                              onClick={() => setRespondingTo(review.id)}
                            >
                              <MessageSquare className="w-4 h-4 mr-1" />
                              Respond
                            </Button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

          {reviews.length === 0 && (
            <div className="text-center py-8">
              <Star className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400">No reviews yet</p>
              <p className="text-sm text-slate-500">
                Reviews will appear here after guests complete their stays
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PropertyReviews;
