
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export interface Review {
  id: string;
  business_id: string;
  customer_id: string;
  rating: number;
  review_text: string;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

// Submit a review
export const submitReview = async (
  businessId: string,
  customerId: string,
  rating: number,
  reviewText: string
): Promise<{ success: boolean; review?: Review; error?: any }> => {
  try {
    // Check if user already reviewed this business
    const { data: existingReview, error: checkError } = await supabase
      .from('reviews')
      .select('id')
      .eq('business_id', businessId)
      .eq('customer_id', customerId)
      .single();
    
    let result;
    
    if (existingReview) {
      // Update existing review
      const { data, error } = await supabase
        .from('reviews')
        .update({
          rating,
          review_text: reviewText,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingReview.id)
        .select()
        .single();
      
      if (error) throw error;
      result = { success: true, review: data };
      toast.success('Your review has been updated!');
    } else {
      // Create new review
      const { data, error } = await supabase
        .from('reviews')
        .insert({
          business_id: businessId,
          customer_id: customerId,
          rating,
          review_text: reviewText
        })
        .select()
        .single();
      
      if (error) throw error;
      result = { success: true, review: data };
      
      // Award points for leaving a review
      await supabase.from('transactions').insert({
        customer_id: customerId,
        business_id: businessId,
        points_earned: 25,
        description: 'Points for submitting a review',
        transaction_type: 'review'
      });
      
      // Update loyalty points
      await supabase
        .from('loyalty_points')
        .insert({
          customer_id: customerId,
          business_id: businessId,
          points: 25
        })
        .onConflict(['customer_id', 'business_id'])
        .merge('points', '+')
        .select();
      
      toast.success('Your review has been submitted! You earned 25 loyalty points.');
    }
    
    // Update business average rating
    await updateBusinessAverageRating(businessId);
    
    return result;
  } catch (error: any) {
    console.error('Error submitting review:', error.message);
    toast.error('Failed to submit review: ' + error.message);
    return { success: false, error };
  }
};

// Get reviews for a business
export const getBusinessReviews = async (businessId: string): Promise<Review[]> => {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select('*, profiles(full_name, avatar_url)')
      .eq('business_id', businessId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error: any) {
    console.error('Error fetching business reviews:', error.message);
    return [];
  }
};

// Get a customer's reviews
export const getCustomerReviews = async (customerId: string): Promise<Review[]> => {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select('*, businesses(business_name)')
      .eq('customer_id', customerId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error: any) {
    console.error('Error fetching customer reviews:', error.message);
    return [];
  }
};

// Update business average rating
const updateBusinessAverageRating = async (businessId: string): Promise<void> => {
  try {
    // Get all ratings for this business
    const { data: reviews, error } = await supabase
      .from('reviews')
      .select('rating')
      .eq('business_id', businessId);
    
    if (error) throw error;
    
    if (reviews && reviews.length > 0) {
      // Calculate average rating
      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
      const averageRating = totalRating / reviews.length;
      
      // Update business record
      await supabase
        .from('businesses')
        .update({
          average_rating: averageRating,
          review_count: reviews.length
        })
        .eq('id', businessId);
    }
  } catch (error) {
    console.error('Error updating business average rating:', error);
  }
};
