
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Star, User, ThumbsUp, MessageCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface Review {
  id: string;
  customerName: string;
  rating: number;
  reviewText: string;
  createdAt: string;
  likes: number;
  isLiked: boolean;
}

interface ReviewSystemProps {
  businessId: string;
  reviews: Review[];
  onSubmitReview?: (rating: number, text: string) => void;
  onLikeReview?: (reviewId: string) => void;
}

const ReviewSystem: React.FC<ReviewSystemProps> = ({
  businessId,
  reviews,
  onSubmitReview,
  onLikeReview
}) => {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [hoveredStar, setHoveredStar] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitReview = async () => {
    if (!user) {
      toast.error('Please log in to submit a review');
      return;
    }

    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    if (!reviewText.trim()) {
      toast.error('Please write a review');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmitReview?.(rating, reviewText);
      setRating(0);
      setReviewText('');
      toast.success('Review submitted successfully!');
    } catch (error) {
      toast.error('Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (currentRating: number, interactive = false) => {
    return [...Array(5)].map((_, index) => {
      const starIndex = index + 1;
      const filled = interactive 
        ? starIndex <= (hoveredStar || rating)
        : starIndex <= currentRating;

      return (
        <Star
          key={index}
          className={`h-5 w-5 cursor-pointer transition-colors ${
            filled ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
          }`}
          onClick={interactive ? () => setRating(starIndex) : undefined}
          onMouseEnter={interactive ? () => setHoveredStar(starIndex) : undefined}
          onMouseLeave={interactive ? () => setHoveredStar(0) : undefined}
        />
      );
    });
  };

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;

  return (
    <div className="space-y-6">
      {/* Review Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Customer Reviews</span>
            <div className="flex items-center space-x-2">
              <div className="flex">{renderStars(averageRating)}</div>
              <span className="text-sm text-gray-600">
                {averageRating.toFixed(1)} ({reviews.length} reviews)
              </span>
            </div>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Submit Review Form */}
      {user && (
        <Card>
          <CardHeader>
            <CardTitle>Write a Review</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Rating</label>
              <div className="flex">{renderStars(rating, true)}</div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Your Review</label>
              <Textarea
                placeholder="Share your experience with this business..."
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                rows={4}
              />
            </div>
            
            <Button 
              onClick={handleSubmitReview}
              disabled={isSubmitting || rating === 0 || !reviewText.trim()}
              className="w-full"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <Card key={review.id}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-mansablue rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium">{review.customerName}</p>
                    <div className="flex items-center space-x-2">
                      <div className="flex">{renderStars(review.rating)}</div>
                      <span className="text-xs text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <p className="text-gray-700 mb-3">{review.reviewText}</p>
              
              <div className="flex items-center justify-between">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onLikeReview?.(review.id)}
                  className="flex items-center space-x-1"
                >
                  <ThumbsUp className={`h-4 w-4 ${review.isLiked ? 'fill-current text-blue-500' : ''}`} />
                  <span>{review.likes}</span>
                </Button>
                
                <Button variant="ghost" size="sm">
                  <MessageCircle className="h-4 w-4 mr-1" />
                  Reply
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {reviews.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <MessageCircle className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600">No reviews yet. Be the first to review this business!</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ReviewSystem;
