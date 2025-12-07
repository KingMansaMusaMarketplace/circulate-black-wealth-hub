
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, ThumbsUp, Flag } from 'lucide-react';

interface ReviewCardProps {
  review: {
    id: string | number;
    userName: string;
    avatar?: string;
    rating: number;
    date: string;
    content: string;
    helpful: number;
    isVerified: boolean;
  };
  showActions?: boolean;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review, showActions = true }) => {
  return (
    <div className="border rounded-lg p-4 bg-white">
      <div className="flex justify-between mb-3">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={review.avatar} alt={review.userName} />
            <AvatarFallback>{review.userName.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium">{review.userName}</span>
              {review.isVerified && (
                <span className="bg-green-100 text-green-700 text-xs px-1.5 py-0.5 rounded flex items-center">
                  <svg className="w-3 h-3 mr-0.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"></path>
                  </svg>
                  Verified
                </span>
              )}
            </div>
            <div className="flex items-center">
              <div className="flex text-mansagold">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={14} 
                    fill={i < review.rating ? "currentColor" : "none"} 
                    className={i < review.rating ? "text-mansagold" : "text-gray-300"} 
                  />
                ))}
              </div>
              <span className="text-xs text-gray-500 ml-2">{review.date}</span>
            </div>
          </div>
        </div>
      </div>
      
      <p className="text-sm text-gray-600 mb-3">{review.content}</p>
      
      {showActions && (
        <div className="flex justify-between items-center text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1 hover:text-mansablue p-1 rounded">
              <ThumbsUp size={14} />
              Helpful ({review.helpful})
            </button>
            <button className="flex items-center gap-1 hover:text-amber-600 p-1 rounded">
              <Flag size={14} />
              Report
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewCard;
