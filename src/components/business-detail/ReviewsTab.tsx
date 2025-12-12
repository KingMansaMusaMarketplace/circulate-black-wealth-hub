
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Star, Loader2 } from 'lucide-react';
import { Business } from '@/types/business';
import ReviewCard from '@/components/ReviewCard';
import ReviewForm from '@/components/ReviewForm';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface Review {
  id: string;
  userName: string;
  avatar: string;
  rating: number;
  date: string;
  content: string;
  helpful: number;
  isVerified: boolean;
}

interface ReviewsTabProps {
  business: Business;
}

const ReviewsTab: React.FC<ReviewsTabProps> = ({ business }) => {
  const { user } = useAuth();
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, [business.id]);

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          id,
          rating,
          review_text,
          is_verified,
          created_at,
          customer_id,
          profiles:customer_id (full_name, avatar_url)
        `)
        .eq('business_id', business.id)
        .eq('is_flagged', false)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedReviews: Review[] = (data || []).map((review: any) => ({
        id: review.id,
        userName: review.profiles?.full_name || 'Anonymous',
        avatar: review.profiles?.avatar_url || '',
        rating: review.rating,
        date: formatDate(review.created_at),
        content: review.review_text || '',
        helpful: 0,
        isVerified: review.is_verified
      }));

      setReviews(formattedReviews);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  const handleReviewSubmit = async (rating: number, content: string) => {
    if (!user) {
      toast.error('Please log in to submit a review');
      return;
    }

    try {
      const { error } = await supabase
        .from('reviews')
        .insert([{
          business_id: business.id,
          customer_id: user.id,
          rating,
          review_text: content,
          is_verified: true
        }]);

      if (error) throw error;

      setShowReviewForm(false);
      toast.success("Review Submitted Successfully! You've earned 15 loyalty points.");
      fetchReviews(); // Refresh reviews
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('Failed to submit review. Please try again.');
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold">Customer Reviews</h2>
          <div className="flex items-center mt-1">
            <div className="flex text-mansagold mr-2">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  size={18} 
                  fill={i < Math.floor(business.rating) ? "currentColor" : "none"} 
                  className={i < Math.floor(business.rating) ? "text-mansagold" : "text-gray-300"} 
                />
              ))}
            </div>
            <span className="font-semibold">{business.rating}</span>
            <span className="mx-1 text-gray-400">•</span>
            <span className="text-gray-600">{reviews.length} reviews</span>
          </div>
        </div>
        
        <Button 
          onClick={() => setShowReviewForm(true)}
          className="bg-mansablue hover:bg-mansablue/90"
          disabled={!user}
        >
          {user ? 'Write a Review' : 'Log in to Review'}
        </Button>
      </div>
      
      {showReviewForm && (
        <div className="mb-8 border-b pb-8">
          <h3 className="text-lg font-medium mb-4">Your Review</h3>
          <ReviewForm 
            businessName={business.name} 
            onSubmit={handleReviewSubmit}
          />
        </div>
      )}
      
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-mansablue" />
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p>No reviews yet. Be the first to review this business!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {(showAll ? reviews : reviews.slice(0, 5)).map(review => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      )}
      
      {reviews.length > 5 && !showAll && (
        <div className="mt-6 pt-4 border-t flex justify-center">
          <Button variant="outline" onClick={() => setShowAll(true)}>
            See All {reviews.length} Reviews
          </Button>
        </div>
      )}
    </div>
  );
};

export default ReviewsTab;
