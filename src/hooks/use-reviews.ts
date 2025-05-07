
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  submitReview,
  getBusinessReviews,
  getCustomerReviews,
  Review
} from '@/lib/api/reviews-api';

// Hook for managing reviews
export const useReviews = (businessId?: string) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [userReview, setUserReview] = useState<Review | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Fetch reviews on mount or when businessId changes
  useEffect(() => {
    const loadReviews = async () => {
      if (businessId) {
        setLoading(true);
        try {
          const businessReviews = await getBusinessReviews(businessId);
          setReviews(businessReviews);
          
          // Check if user has already reviewed this business
          if (user?.id) {
            const userReview = businessReviews.find(review => review.customer_id === user.id);
            setUserReview(userReview || null);
          }
        } catch (error) {
          console.error('Error loading reviews:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    loadReviews();
  }, [businessId, user?.id]);

  // Submit a new review or update existing one
  const handleSubmitReview = async (rating: number, reviewText: string) => {
    if (!user?.id || !businessId) return false;
    
    setSubmitting(true);
    try {
      const result = await submitReview(businessId, user.id, rating, reviewText);
      if (result.success && result.review) {
        // Update local state
        setUserReview(result.review);
        
        // Update reviews list
        setReviews(prev => {
          const existing = prev.findIndex(r => r.customer_id === user.id);
          if (existing >= 0) {
            // Replace existing review
            const updated = [...prev];
            updated[existing] = result.review!;
            return updated;
          } else {
            // Add new review
            return [result.review!, ...prev];
          }
        });
        
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error submitting review:', error);
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  return {
    reviews,
    loading,
    userReview,
    submitting,
    submitReview: handleSubmitReview
  };
};

// Hook for loading a user's reviews
export const useUserReviews = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    const loadUserReviews = async () => {
      if (!user?.id) return;
      
      setLoading(true);
      try {
        const userReviews = await getCustomerReviews(user.id);
        setReviews(userReviews);
      } catch (error) {
        console.error('Error loading user reviews:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserReviews();
  }, [user?.id]);

  return {
    reviews,
    loading
  };
};
