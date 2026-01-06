import { useQuery } from '@tanstack/react-query';
import { Star, User } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';
import { format } from 'date-fns';

interface ReviewsListProps {
  businessId: string;
}

export function ReviewsList({ businessId }: ReviewsListProps) {
  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ['reviews', businessId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('business_id', businessId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Fetch profiles separately
      const customerIds = [...new Set((data || []).map(r => r.customer_id).filter(Boolean))];
      let profilesData: any[] = [];
      
      if (customerIds.length > 0) {
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, full_name')
          .in('id', customerIds);
        profilesData = profiles || [];
      }
      
      const profilesMap = new Map(profilesData.map(p => [p.id, p]));
      
      return (data || []).map(r => ({
        ...r,
        profiles: profilesMap.get(r.customer_id) || null
      }));
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="pt-6">
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-muted rounded w-1/4"></div>
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground py-8">
            No reviews yet. Be the first to leave a review!
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review: any) => (
        <Card key={review.id}>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="font-medium">
                    {review.profiles?.full_name || 'Anonymous'}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {format(new Date(review.created_at), 'PPP')}
                  </div>
                </div>
              </div>
              {review.is_verified && (
                <Badge variant="secondary" className="bg-green-50 text-green-700">
                  Verified Customer
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-1 mb-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-4 h-4 ${
                    star <= review.rating
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>

            {review.review_text && (
              <p className="text-sm leading-relaxed">{review.review_text}</p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
