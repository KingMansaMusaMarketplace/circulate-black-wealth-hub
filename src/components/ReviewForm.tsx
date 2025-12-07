
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Star } from 'lucide-react';
import { toast } from 'sonner';

interface ReviewFormProps {
  businessName: string;
  onSubmit?: (rating: number, content: string) => void | Promise<void>;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ businessName, onSubmit }) => {
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [content, setContent] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      toast("Rating Required", {
        description: "Please select a star rating before submitting your review."
      });
      return;
    }
    
    if (content.trim().length < 10) {
      toast("Review Too Short", {
        description: "Please provide more details in your review (minimum 10 characters)."
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      if (onSubmit) {
        await onSubmit(rating, content);
      }
      
      setRating(0);
      setContent('');
    } catch (error) {
      console.error('Error submitting review:', error);
      toast("Error", {
        description: "Failed to submit review. Please try again."
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="rating" className="block mb-2">Your Rating</Label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="p-1 focus:outline-none"
            >
              <Star 
                size={24} 
                className={`${
                  (hoverRating ? hoverRating >= star : rating >= star)
                    ? 'text-mansagold fill-current' 
                    : 'text-gray-300'
                }`} 
              />
            </button>
          ))}
        </div>
      </div>
      
      <div>
        <Label htmlFor="review" className="block mb-2">Your Review</Label>
        <Textarea
          id="review"
          placeholder={`Share your experience at ${businessName}...`}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={5}
          className="resize-none"
        />
        <p className="text-xs text-gray-500 mt-1">
          Your review will be public and may help other users discover this business.
        </p>
      </div>
      
      <div className="flex justify-end">
        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="bg-mansablue hover:bg-mansablue-dark"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Review'}
        </Button>
      </div>
    </form>
  );
};

export default ReviewForm;
