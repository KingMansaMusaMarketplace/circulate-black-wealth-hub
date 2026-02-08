import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { PropertyReview } from '@/types/vacation-rental';
import { format } from 'date-fns';
import { Star, CheckCircle } from 'lucide-react';

interface ReviewCardProps {
  review: PropertyReview;
  showPropertyInfo?: boolean;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review, showPropertyInfo = false }) => {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'fill-mansagold text-mansagold' : 'text-white/20'
        }`}
      />
    ));
  };

  const ratingCategories = [
    { label: 'Cleanliness', value: review.cleanliness_rating },
    { label: 'Accuracy', value: review.accuracy_rating },
    { label: 'Communication', value: review.communication_rating },
    { label: 'Location', value: review.location_rating },
    { label: 'Check-in', value: review.checkin_rating },
    { label: 'Value', value: review.value_rating },
  ].filter(cat => cat.value !== null && cat.value !== undefined);

  return (
    <Card className="bg-slate-800/50 border-white/10">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Avatar className="w-10 h-10">
            <AvatarImage src={review.guest_avatar} />
            <AvatarFallback className="bg-mansablue/30 text-white">
              {review.guest_name?.charAt(0) || 'G'}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-white">
                  {review.guest_name || 'Guest'}
                </h4>
                <p className="text-xs text-white/40">
                  {format(new Date(review.created_at), 'MMMM yyyy')}
                </p>
              </div>
              <div className="flex items-center gap-1">
                {renderStars(review.overall_rating)}
              </div>
            </div>

            {/* Review Text */}
            {review.review_text && (
              <p className="text-white/80 mt-3">{review.review_text}</p>
            )}

            {/* Rating Breakdown */}
            {ratingCategories.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-4">
                {ratingCategories.map((cat) => (
                  <div key={cat.label} className="flex items-center justify-between text-sm">
                    <span className="text-white/60">{cat.label}</span>
                    <span className="text-white font-medium">{cat.value}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Host Response */}
            {review.host_response && (
              <div className="mt-4 pl-4 border-l-2 border-mansagold/50">
                <div className="flex items-center gap-2 text-sm text-white/60 mb-1">
                  <CheckCircle className="w-3 h-3 text-mansagold" />
                  Host Response
                  {review.host_response_at && (
                    <span>• {format(new Date(review.host_response_at), 'MMM d, yyyy')}</span>
                  )}
                </div>
                <p className="text-white/70 text-sm">{review.host_response}</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReviewCard;
