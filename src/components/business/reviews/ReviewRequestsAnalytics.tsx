import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Mail, Star, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';

interface ReviewRequestsAnalyticsProps {
  businessId: string;
}

export const ReviewRequestsAnalytics: React.FC<ReviewRequestsAnalyticsProps> = ({ businessId }) => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [recentRequests, setRecentRequests] = useState<any[]>([]);

  useEffect(() => {
    loadAnalytics();
  }, [businessId]);

  const loadAnalytics = async () => {
    try {
      // Fetch review requests
      const { data: requests, error: requestsError } = await supabase
        .from('review_requests')
        .select('*')
        .eq('business_id', businessId)
        .order('sent_at', { ascending: false })
        .limit(10);

      if (requestsError) throw requestsError;

      // Calculate stats
      const totalRequests = requests?.length || 0;
      const reviewsReceived = requests?.filter(r => r.review_submitted).length || 0;
      const conversionRate = totalRequests > 0 ? (reviewsReceived / totalRequests) * 100 : 0;

      // Recent requests (last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const recentCount = requests?.filter(r => new Date(r.sent_at) >= sevenDaysAgo).length || 0;

      setStats({
        totalRequests,
        reviewsReceived,
        conversionRate,
        recentCount
      });

      setRecentRequests(requests || []);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Total Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalRequests}</div>
            <p className="text-xs text-muted-foreground mt-1">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Star className="h-4 w-4" />
              Reviews Received
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.reviewsReceived}</div>
            <p className="text-xs text-muted-foreground mt-1">From requests</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Conversion Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.conversionRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground mt-1">Request to review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.recentCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Last 7 days</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Review Requests</CardTitle>
          <CardDescription>Track the status of your review requests</CardDescription>
        </CardHeader>
        <CardContent>
          {recentRequests.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No review requests sent yet. Complete bookings to automatically send review requests!
            </p>
          ) : (
            <div className="space-y-3">
              {recentRequests.map((request) => (
                <div 
                  key={request.id} 
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex-1">
                    <p className="font-medium">{request.customer_email}</p>
                    <p className="text-sm text-muted-foreground">
                      Sent {format(new Date(request.sent_at), 'MMM dd, yyyy')}
                    </p>
                  </div>
                  <div>
                    {request.review_submitted ? (
                      <div className="flex items-center gap-2 text-green-600">
                        <Star className="h-4 w-4 fill-current" />
                        <span className="text-sm font-medium">Reviewed</span>
                        {request.review_submitted_at && (
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(request.review_submitted_at), 'MMM dd')}
                          </span>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-yellow-600">
                        <Mail className="h-4 w-4" />
                        <span className="text-sm font-medium">Pending</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Mail className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h4 className="font-semibold text-blue-900 mb-1">How Review Requests Work</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Requests are automatically sent when you mark a booking as "Completed"</li>
                <li>• You can also manually send requests from the Bookings page</li>
                <li>• Emails include a direct link for customers to leave a review</li>
                <li>• Track which customers have responded in this dashboard</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};