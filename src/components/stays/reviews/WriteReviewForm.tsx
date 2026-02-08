import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Star, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface WriteReviewFormProps {
  bookingId: string;
  propertyId: string;
  hostId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const WriteReviewForm: React.FC<WriteReviewFormProps> = ({
  bookingId,
  propertyId,
  hostId,
  onSuccess,
  onCancel,
}) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [overallRating, setOverallRating] = useState(0);
  const [ratings, setRatings] = useState({
    cleanliness: 0,
    accuracy: 0,
    communication: 0,
    location: 0,
    checkin: 0,
    value: 0,
  });
  const [reviewText, setReviewText] = useState('');

  const ratingCategories = [
    { key: 'cleanliness', label: 'Cleanliness' },
    { key: 'accuracy', label: 'Accuracy' },
    { key: 'communication', label: 'Communication' },
    { key: 'location', label: 'Location' },
    { key: 'checkin', label: 'Check-in' },
    { key: 'value', label: 'Value' },
  ] as const;

  const handleSubmit = async () => {
    if (!user) return;
    if (overallRating === 0) {
      toast.error('Please provide an overall rating');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.from('stays_reviews').insert({
        booking_id: bookingId,
        property_id: propertyId,
        reviewer_id: user.id,
        reviewer_type: 'guest',
        reviewee_id: hostId,
        overall_rating: overallRating,
        cleanliness_rating: ratings.cleanliness || null,
        accuracy_rating: ratings.accuracy || null,
        communication_rating: ratings.communication || null,
        location_rating: ratings.location || null,
        checkin_rating: ratings.checkin || null,
        value_rating: ratings.value || null,
        review_text: reviewText.trim() || null,
        is_public: true,
      });

      if (error) throw error;

      toast.success('Review submitted successfully!');
      onSuccess?.();
    } catch (err: any) {
      console.error('Error submitting review:', err);
      toast.error(err.message || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  const StarRating = ({
    value,
    onChange,
    size = 'md',
  }: {
    value: number;
    onChange: (rating: number) => void;
    size?: 'sm' | 'md' | 'lg';
  }) => {
    const sizeClasses = {
      sm: 'w-4 h-4',
      md: 'w-6 h-6',
      lg: 'w-8 h-8',
    };

    return (
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onChange(i + 1)}
            className="transition-transform hover:scale-110"
          >
            <Star
              className={`${sizeClasses[size]} ${
                i < value ? 'fill-mansagold text-mansagold' : 'text-white/30 hover:text-white/50'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <Card className="bg-slate-800/50 border-white/10">
      <CardHeader>
        <CardTitle className="text-white">Write a Review</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Rating */}
        <div>
          <Label className="text-white mb-2 block">Overall Rating *</Label>
          <StarRating value={overallRating} onChange={setOverallRating} size="lg" />
        </div>

        {/* Category Ratings */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {ratingCategories.map((cat) => (
            <div key={cat.key}>
              <Label className="text-white/70 text-sm mb-1 block">{cat.label}</Label>
              <StarRating
                value={ratings[cat.key]}
                onChange={(value) => setRatings((prev) => ({ ...prev, [cat.key]: value }))}
                size="sm"
              />
            </div>
          ))}
        </div>

        {/* Review Text */}
        <div>
          <Label className="text-white mb-2 block">Your Review</Label>
          <Textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Share your experience with other guests..."
            className="bg-slate-800 border-white/20 text-white placeholder:text-white/40 min-h-[120px]"
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          {onCancel && (
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button
            onClick={handleSubmit}
            disabled={loading || overallRating === 0}
            className="bg-mansagold text-black hover:bg-mansagold/90"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Submit Review
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default WriteReviewForm;
