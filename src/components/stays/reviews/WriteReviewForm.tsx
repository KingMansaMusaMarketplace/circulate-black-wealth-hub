import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Star, Loader2, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface WriteReviewFormProps {
  bookingId: string;
  propertyId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

interface CategoryRating {
  cleanliness: number;
  accuracy: number;
  communication: number;
  location: number;
  check_in: number;
  value: number;
}

const CATEGORIES = [
  { key: 'cleanliness', label: 'Cleanliness' },
  { key: 'accuracy', label: 'Accuracy' },
  { key: 'communication', label: 'Communication' },
  { key: 'location', label: 'Location' },
  { key: 'check_in', label: 'Check-in' },
  { key: 'value', label: 'Value' },
] as const;

const WriteReviewForm: React.FC<WriteReviewFormProps> = ({
  bookingId,
  propertyId,
  onSuccess,
  onCancel,
}) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [overallRating, setOverallRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [categoryRatings, setCategoryRatings] = useState<CategoryRating>({
    cleanliness: 0,
    accuracy: 0,
    communication: 0,
    location: 0,
    check_in: 0,
    value: 0,
  });
  const [hoverCategory, setHoverCategory] = useState<{ key: string; rating: number } | null>(null);
  const [reviewText, setReviewText] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleCategoryRating = (category: keyof CategoryRating, rating: number) => {
    setCategoryRatings(prev => ({ ...prev, [category]: rating }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please log in to leave a review');
      return;
    }
    
    if (overallRating === 0) {
      toast.error('Please provide an overall rating');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.from('property_reviews').insert({
        booking_id: bookingId,
        property_id: propertyId,
        guest_id: user.id,
        rating: overallRating,
        cleanliness: categoryRatings.cleanliness || null,
        accuracy: categoryRatings.accuracy || null,
        communication: categoryRatings.communication || null,
        location: categoryRatings.location || null,
        check_in: categoryRatings.check_in || null,
        value: categoryRatings.value || null,
        review_text: reviewText.trim() || null,
        is_public: true,
      });

      if (error) {
        if (error.code === '23505') {
          toast.error('You have already reviewed this booking');
        } else {
          throw error;
        }
        return;
      }

      setSubmitted(true);
      toast.success('Thank you for your review!');
      onSuccess?.();
    } catch (err: any) {
      console.error('Error submitting review:', err);
      toast.error(err.message || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  const renderStarPicker = (
    value: number,
    onSet: (rating: number) => void,
    hoverValue?: number,
    onHover?: (rating: number) => void,
    onHoverEnd?: () => void,
    size: 'sm' | 'lg' = 'sm'
  ) => {
    const sizeClass = size === 'lg' ? 'w-8 h-8' : 'w-5 h-5';
    const displayValue = hoverValue || value;

    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map(star => (
          <button
            key={star}
            type="button"
            onClick={() => onSet(star)}
            onMouseEnter={() => onHover?.(star)}
            onMouseLeave={onHoverEnd}
            className="focus:outline-none transition-transform hover:scale-110"
          >
            <Star
              className={cn(
                sizeClass,
                'transition-colors',
                star <= displayValue
                  ? 'fill-mansagold text-mansagold'
                  : 'text-slate-600 hover:text-slate-500'
              )}
            />
          </button>
        ))}
      </div>
    );
  };

  if (submitted) {
    return (
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="py-12">
          <div className="text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Review Submitted!</h3>
            <p className="text-slate-400">
              Thank you for sharing your experience. Your review helps other guests make informed decisions.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Star className="w-5 h-5 text-mansagold" />
          Write a Review
        </CardTitle>
        <CardDescription className="text-slate-400">
          Share your experience to help future guests
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Overall Rating */}
          <div className="space-y-2">
            <Label className="text-white text-base">Overall Rating *</Label>
            <div className="flex items-center gap-4">
              {renderStarPicker(
                overallRating,
                setOverallRating,
                hoverRating,
                setHoverRating,
                () => setHoverRating(0),
                'lg'
              )}
              {overallRating > 0 && (
                <span className="text-mansagold font-semibold">
                  {overallRating === 5 && 'Excellent!'}
                  {overallRating === 4 && 'Very Good'}
                  {overallRating === 3 && 'Good'}
                  {overallRating === 2 && 'Fair'}
                  {overallRating === 1 && 'Poor'}
                </span>
              )}
            </div>
          </div>

          {/* Category Ratings */}
          <div className="space-y-3">
            <Label className="text-white text-base">Rate by Category (Optional)</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {CATEGORIES.map(({ key, label }) => (
                <div key={key} className="flex items-center justify-between bg-slate-900/50 rounded-lg p-3">
                  <span className="text-slate-300 text-sm">{label}</span>
                  {renderStarPicker(
                    categoryRatings[key as keyof CategoryRating],
                    (rating) => handleCategoryRating(key as keyof CategoryRating, rating),
                    hoverCategory?.key === key ? hoverCategory.rating : undefined,
                    (rating) => setHoverCategory({ key, rating }),
                    () => setHoverCategory(null)
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Review Text */}
          <div className="space-y-2">
            <Label htmlFor="review-text" className="text-white text-base">
              Your Review (Optional)
            </Label>
            <Textarea
              id="review-text"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Tell other guests about your experience. What did you love? Any tips for future guests?"
              rows={4}
              maxLength={2000}
              className="bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500 resize-none"
            />
            <p className="text-xs text-slate-500 text-right">
              {reviewText.length}/2000 characters
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button
              type="submit"
              disabled={loading || overallRating === 0}
              className="flex-1 bg-mansagold text-black hover:bg-mansagold/90"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Review'
              )}
            </Button>
            {onCancel && (
              <Button
                type="button"
                variant="ghost"
                onClick={onCancel}
                disabled={loading}
                className="text-slate-400 hover:text-white"
              >
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default WriteReviewForm;
