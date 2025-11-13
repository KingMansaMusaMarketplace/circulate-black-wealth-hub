import { useReviewSentiment } from '@/hooks/use-review-sentiment';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Smile, Frown, Meh, AlertCircle, TrendingUp, Loader2 } from 'lucide-react';

interface SentimentAnalysisWidgetProps {
  businessId: string;
}

export const SentimentAnalysisWidget = ({ businessId }: SentimentAnalysisWidgetProps) => {
  const { sentiments, sentimentStats, isLoading } = useReviewSentiment(businessId);

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return <Smile className="h-4 w-4 text-green-600" />;
      case 'negative': return <Frown className="h-4 w-4 text-red-600" />;
      case 'neutral': return <Meh className="h-4 w-4 text-gray-600" />;
      case 'mixed': return <TrendingUp className="h-4 w-4 text-orange-600" />;
      default: return <Meh className="h-4 w-4" />;
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'bg-green-100 text-green-800 border-green-200';
      case 'negative': return 'bg-red-100 text-red-800 border-red-200';
      case 'neutral': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'mixed': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6 flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  if (sentimentStats.total === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Customer Sentiment
          </CardTitle>
          <CardDescription>AI-powered sentiment analysis of your reviews</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-4">
            No reviews analyzed yet. Sentiment analysis runs automatically on new reviews.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Customer Sentiment Analysis
        </CardTitle>
        <CardDescription>
          AI analysis of {sentimentStats.total} reviews
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Sentiment Breakdown */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Smile className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">Positive</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold">{sentimentStats.positive}</span>
              <span className="text-xs text-muted-foreground">
                ({sentimentStats.positivePercentage.toFixed(0)}%)
              </span>
            </div>
          </div>
          <Progress value={sentimentStats.positivePercentage} className="h-2" />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Frown className="h-4 w-4 text-red-600" />
              <span className="text-sm font-medium">Negative</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold">{sentimentStats.negative}</span>
              <span className="text-xs text-muted-foreground">
                ({((sentimentStats.negative / sentimentStats.total) * 100).toFixed(0)}%)
              </span>
            </div>
          </div>
          <Progress 
            value={(sentimentStats.negative / sentimentStats.total) * 100} 
            className="h-2 [&>div]:bg-red-600"
          />
        </div>

        <div className="grid grid-cols-2 gap-2 pt-2">
          <div className="text-center p-3 bg-muted rounded-lg">
            <div className="text-2xl font-bold">
              {sentimentStats.averageScore.toFixed(2)}
            </div>
            <div className="text-xs text-muted-foreground">Avg. Score</div>
          </div>
          <div className="text-center p-3 bg-muted rounded-lg">
            <div className="text-2xl font-bold text-orange-600">
              {sentimentStats.urgent}
            </div>
            <div className="text-xs text-muted-foreground">Urgent Issues</div>
          </div>
        </div>

        {/* Recent Urgent Reviews */}
        {sentimentStats.urgent > 0 && (
          <div className="pt-4 border-t">
            <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-orange-600" />
              Recent Urgent Reviews
            </h4>
            <div className="space-y-2">
              {sentiments
                .filter(s => s.urgency_level === 'high' || s.urgency_level === 'critical')
                .slice(0, 3)
                .map((sentiment) => (
                  <div 
                    key={sentiment.id}
                    className={`p-3 rounded-lg border ${getSentimentColor(sentiment.sentiment)}`}
                  >
                    <div className="flex items-start gap-2 mb-1">
                      {getSentimentIcon(sentiment.sentiment)}
                      <Badge variant="outline" className="text-xs">
                        {sentiment.urgency_level}
                      </Badge>
                    </div>
                    <p className="text-xs mt-2">{sentiment.ai_summary}</p>
                    {sentiment.key_themes.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {sentiment.key_themes.slice(0, 3).map((theme, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {theme}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
