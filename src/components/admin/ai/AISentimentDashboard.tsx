import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { Heart, ThumbsUp, ThumbsDown, Meh, Loader2, RefreshCw, TrendingUp, TrendingDown } from 'lucide-react';

interface SentimentAnalysis {
  overall_sentiment: string;
  sentiment_score: number;
  key_themes: string[];
  positive_highlights: string[];
  areas_for_improvement: string[];
  summary: string;
}

const AISentimentDashboard: React.FC = () => {
  const [analysis, setAnalysis] = useState<SentimentAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [reviewCount, setReviewCount] = useState(0);

  const analyzesentiment = async () => {
    setLoading(true);
    try {
      const { data: reviews, error } = await supabase
        .from('reviews')
        .select('content, rating, created_at')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;

      setReviewCount(reviews?.length || 0);

      if (!reviews || reviews.length === 0) {
        toast.info('No reviews to analyze');
        setLoading(false);
        return;
      }

      const { data, error: aiError } = await supabase.functions.invoke('admin-ai-assistant', {
        body: {
          type: 'sentiment_analysis',
          data: {
            reviews: reviews.map(r => ({
              content: r.content,
              rating: r.rating,
            })),
            totalCount: reviews.length,
          },
        },
      });

      if (aiError) throw aiError;

      let parsed: SentimentAnalysis;
      try {
        const jsonMatch = data.result.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          parsed = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('No JSON found');
        }
      } catch {
        parsed = {
          overall_sentiment: 'neutral',
          sentiment_score: 0,
          key_themes: [],
          positive_highlights: [],
          areas_for_improvement: [],
          summary: data.result,
        };
      }

      setAnalysis(parsed);
      toast.success('Sentiment analysis complete');

    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to analyze sentiment');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    analyzesentiment();
  }, []);

  const getSentimentIcon = () => {
    if (!analysis) return <Meh className="h-8 w-8" />;
    switch (analysis.overall_sentiment) {
      case 'positive':
        return <ThumbsUp className="h-8 w-8 text-green-500" />;
      case 'negative':
        return <ThumbsDown className="h-8 w-8 text-red-500" />;
      default:
        return <Meh className="h-8 w-8 text-yellow-500" />;
    }
  };

  const getSentimentColor = () => {
    if (!analysis) return 'bg-muted';
    switch (analysis.overall_sentiment) {
      case 'positive':
        return 'bg-green-100 dark:bg-green-950';
      case 'negative':
        return 'bg-red-100 dark:bg-red-950';
      default:
        return 'bg-yellow-100 dark:bg-yellow-950';
    }
  };

  const normalizedScore = analysis ? ((analysis.sentiment_score + 1) / 2) * 100 : 50;

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <Card className={getSentimentColor()}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-pink-500" />
                AI Sentiment Analysis
              </CardTitle>
              <CardDescription>
                Analyzing {reviewCount} recent reviews
              </CardDescription>
            </div>
            <Button onClick={analyzesentiment} disabled={loading} variant="outline">
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading && !analysis ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                <p className="mt-2 text-sm text-muted-foreground">Analyzing customer sentiment...</p>
              </div>
            </div>
          ) : analysis ? (
            <div className="grid gap-6 md:grid-cols-3">
              {/* Sentiment Score */}
              <div className="text-center">
                {getSentimentIcon()}
                <h3 className="text-2xl font-bold mt-2 capitalize">{analysis.overall_sentiment}</h3>
                <p className="text-sm text-muted-foreground">Overall Sentiment</p>
                <div className="mt-2">
                  <Progress value={normalizedScore} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">
                    Score: {analysis.sentiment_score.toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Key Themes */}
              <div>
                <h4 className="font-medium mb-2">Key Themes</h4>
                <div className="flex flex-wrap gap-1">
                  {analysis.key_themes.slice(0, 6).map((theme, i) => (
                    <Badge key={i} variant="outline">{theme}</Badge>
                  ))}
                </div>
              </div>

              {/* Summary */}
              <div>
                <h4 className="font-medium mb-2">AI Summary</h4>
                <p className="text-sm">{analysis.summary}</p>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              Click refresh to analyze sentiment
            </div>
          )}
        </CardContent>
      </Card>

      {analysis && (
        <div className="grid gap-6 md:grid-cols-2">
          {/* Positive Highlights */}
          <Card className="border-green-200 dark:border-green-800">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                What Customers Love
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {analysis.positive_highlights.length > 0 ? (
                  analysis.positive_highlights.map((item, i) => (
                    <li key={i} className="text-sm flex items-start gap-2">
                      <ThumbsUp className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))
                ) : (
                  <li className="text-sm text-muted-foreground">No specific highlights identified</li>
                )}
              </ul>
            </CardContent>
          </Card>

          {/* Areas for Improvement */}
          <Card className="border-orange-200 dark:border-orange-800">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <TrendingDown className="h-4 w-4 text-orange-500" />
                Areas for Improvement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {analysis.areas_for_improvement.length > 0 ? (
                  analysis.areas_for_improvement.map((item, i) => (
                    <li key={i} className="text-sm flex items-start gap-2">
                      <ThumbsDown className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))
                ) : (
                  <li className="text-sm text-muted-foreground">No significant issues identified</li>
                )}
              </ul>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AISentimentDashboard;
