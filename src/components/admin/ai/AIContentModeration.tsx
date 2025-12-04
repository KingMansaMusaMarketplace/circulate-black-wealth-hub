import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { Shield, CheckCircle, XCircle, AlertTriangle, Bot, Loader2, Eye } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface ReviewItem {
  id: string;
  content: string;
  rating: number;
  business_name?: string;
  user_name?: string;
  created_at: string;
  aiAnalysis?: {
    approval_recommendation: string;
    confidence_score: number;
    flags: string[];
    reasoning: string;
  };
  analyzing?: boolean;
}

const AIContentModeration: React.FC = () => {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReview, setSelectedReview] = useState<ReviewItem | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          id,
          content,
          rating,
          created_at,
          businesses:business_id(business_name),
          profiles:user_id(full_name)
        `)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;

      setReviews((data || []).map(r => ({
        id: r.id,
        content: r.content || '',
        rating: r.rating,
        business_name: (r.businesses as unknown as { business_name: string } | null)?.business_name,
        user_name: (r.profiles as unknown as { full_name: string } | null)?.full_name,
        created_at: r.created_at,
      })));
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const analyzeReview = async (review: ReviewItem) => {
    setReviews(prev => prev.map(r => 
      r.id === review.id ? { ...r, analyzing: true } : r
    ));

    try {
      const { data, error } = await supabase.functions.invoke('admin-ai-assistant', {
        body: {
          type: 'content_moderation',
          data: {
            content: review.content,
            rating: review.rating,
            businessName: review.business_name,
          },
        },
      });

      if (error) throw error;

      let analysis;
      try {
        // Try to parse as JSON
        const jsonMatch = data.result.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          analysis = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('No JSON found');
        }
      } catch {
        analysis = {
          approval_recommendation: 'needs_review',
          confidence_score: 50,
          flags: ['Unable to parse AI response'],
          reasoning: data.result,
        };
      }

      setReviews(prev => prev.map(r => 
        r.id === review.id ? { ...r, aiAnalysis: analysis, analyzing: false } : r
      ));

    } catch (error) {
      console.error('Error analyzing review:', error);
      toast.error('Failed to analyze review');
      setReviews(prev => prev.map(r => 
        r.id === review.id ? { ...r, analyzing: false } : r
      ));
    }
  };

  const analyzeAll = async () => {
    for (const review of reviews.filter(r => !r.aiAnalysis)) {
      await analyzeReview(review);
      // Small delay between requests
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  };

  const getRecommendationBadge = (recommendation: string) => {
    switch (recommendation) {
      case 'approve':
        return <Badge className="bg-green-500"><CheckCircle className="h-3 w-3 mr-1" />Approve</Badge>;
      case 'reject':
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Reject</Badge>;
      default:
        return <Badge variant="secondary"><AlertTriangle className="h-3 w-3 mr-1" />Review</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              AI Content Moderation
            </CardTitle>
            <CardDescription>
              AI-powered review and content analysis
            </CardDescription>
          </div>
          <Button onClick={analyzeAll} disabled={loading}>
            <Bot className="h-4 w-4 mr-2" />
            Analyze All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8">
            <Loader2 className="h-8 w-8 animate-spin mx-auto" />
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No reviews to moderate
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Review</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Business</TableHead>
                <TableHead>AI Analysis</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reviews.map((review) => (
                <TableRow key={review.id}>
                  <TableCell className="max-w-xs">
                    <p className="truncate">{review.content || 'No content'}</p>
                    <p className="text-xs text-muted-foreground">by {review.user_name || 'Anonymous'}</p>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{review.rating}/5</Badge>
                  </TableCell>
                  <TableCell>{review.business_name || 'Unknown'}</TableCell>
                  <TableCell>
                    {review.analyzing ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : review.aiAnalysis ? (
                      <div className="space-y-1">
                        {getRecommendationBadge(review.aiAnalysis.approval_recommendation)}
                        <p className="text-xs text-muted-foreground">
                          {review.aiAnalysis.confidence_score}% confidence
                        </p>
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-sm">Not analyzed</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {!review.aiAnalysis && !review.analyzing && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => analyzeReview(review)}
                        >
                          <Bot className="h-3 w-3" />
                        </Button>
                      )}
                      {review.aiAnalysis && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedReview(review);
                            setDialogOpen(true);
                          }}
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>AI Analysis Details</DialogTitle>
            <DialogDescription>
              Full AI moderation analysis for this review
            </DialogDescription>
          </DialogHeader>
          {selectedReview?.aiAnalysis && (
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Review Content</h4>
                <p className="text-sm bg-muted p-3 rounded">{selectedReview.content}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-1">Recommendation</h4>
                  {getRecommendationBadge(selectedReview.aiAnalysis.approval_recommendation)}
                </div>
                <div>
                  <h4 className="font-medium mb-1">Confidence</h4>
                  <span>{selectedReview.aiAnalysis.confidence_score}%</span>
                </div>
              </div>
              {selectedReview.aiAnalysis.flags.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Flags</h4>
                  <div className="flex flex-wrap gap-1">
                    {selectedReview.aiAnalysis.flags.map((flag, i) => (
                      <Badge key={i} variant="outline">{flag}</Badge>
                    ))}
                  </div>
                </div>
              )}
              <div>
                <h4 className="font-medium mb-2">Reasoning</h4>
                <p className="text-sm">{selectedReview.aiAnalysis.reasoning}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default AIContentModeration;
