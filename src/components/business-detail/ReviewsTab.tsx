
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';
import { Business } from '@/types/business';
import ReviewCard from '@/components/ReviewCard';
import ReviewForm from '@/components/ReviewForm';
import { toast } from 'sonner';

interface ReviewsTabProps {
  business: Business;
}

const ReviewsTab: React.FC<ReviewsTabProps> = ({ business }) => {
  const [showReviewForm, setShowReviewForm] = useState(false);
  
  // Mock reviews
  const reviews = [
    {
      id: 1,
      userName: "Jasmine W.",
      avatar: "",
      rating: 5,
      date: "2 days ago",
      content: "Absolutely amazing food and atmosphere! The service was exceptional and they made our anniversary dinner special. The mac and cheese is to die for!",
      helpful: 12,
      isVerified: true
    },
    {
      id: 2,
      userName: "Marcus L.",
      avatar: "",
      rating: 5,
      date: "1 week ago",
      content: "Best soul food in Atlanta, hands down! The cornbread was perfectly sweet and the portions are very generous. I'm so glad I found this place through the app.",
      helpful: 8,
      isVerified: true
    },
    {
      id: 3,
      userName: "Tanya R.",
      avatar: "",
      rating: 4,
      date: "3 weeks ago",
      content: "Great food and warm service. The only reason I'm not giving 5 stars is because it was quite busy and we had to wait about 30 minutes for a table. But the food was worth the wait!",
      helpful: 5,
      isVerified: true
    }
  ];

  const handleReviewSubmit = (rating: number, content: string) => {
    setShowReviewForm(false);
    toast("Review Submitted Successfully", {
      description: "Thank you for your feedback! You've earned 15 loyalty points."
    });
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
            <span className="text-gray-600">{business.reviewCount} reviews</span>
          </div>
        </div>
        
        <Button 
          onClick={() => setShowReviewForm(true)}
          className="bg-mansablue hover:bg-mansablue/90"
        >
          Write a Review
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
      
      <div className="space-y-6">
        {reviews.map(review => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
      
      {reviews.length > 0 && (
        <div className="mt-6 pt-4 border-t flex justify-center">
          <Button variant="outline">See All {business.reviewCount} Reviews</Button>
        </div>
      )}
    </div>
  );
};

export default ReviewsTab;
