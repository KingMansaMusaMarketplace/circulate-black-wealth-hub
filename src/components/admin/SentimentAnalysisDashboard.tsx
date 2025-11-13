import { useState } from 'react';
import { useReviewSentiment } from '@/hooks/use-review-sentiment';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, Smile, Frown, Meh, AlertCircle, Sparkles, Loader2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export const SentimentAnalysisDashboard = () => {
  const { sentiments, sentimentStats, isLoading } = useReviewSentiment();
  const [selectedSentiment, setSelectedSentiment] = useState<string>('all');

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

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case 'critical': return <Badge variant="destructive">Critical</Badge>;
      case 'high': return <Badge variant="default" className="bg-orange-600">High</Badge>;
      case 'medium': return <Badge variant="secondary">Medium</Badge>;
      case 'low': return <Badge variant="outline">Low</Badge>;
      default: return null;
    }
  };

  const filterSentiments = (sentiment: string) => {
    if (sentiment === 'all') return sentiments;
    if (sentiment === 'urgent') {
      return sentiments.filter(s => s.urgency_level === 'high' || s.urgency_level === 'critical');
    }
    return sentiments.filter(s => s.sentiment === sentiment);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Sparkles className="h-8 w-8" />
          AI Sentiment Analysis
        </h1>
        <p className="text-muted-foreground mt-1">
          Automated analysis of customer review sentiment and emotions
        </p>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Analyzed</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sentimentStats.total}</div>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700">Positive</CardTitle>
            <Smile className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{sentimentStats.positive}</div>
            <div className="text-xs text-green-600">{sentimentStats.positivePercentage.toFixed(0)}%</div>
          </CardContent>
        </Card>

        <Card className="border-red-200 bg-red-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-700">Negative</CardTitle>
            <Frown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{sentimentStats.negative}</div>
            <div className="text-xs text-red-600">
              {((sentimentStats.negative / sentimentStats.total) * 100).toFixed(0)}%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Neutral</CardTitle>
            <Meh className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sentimentStats.neutral}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sentimentStats.averageScore.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-orange-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-700">Urgent</CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{sentimentStats.urgent}</div>
          </CardContent>
        </Card>
      </div>

      {/* Sentiment List */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all" onClick={() => setSelectedSentiment('all')}>
            All ({sentimentStats.total})
          </TabsTrigger>
          <TabsTrigger value="urgent" onClick={() => setSelectedSentiment('urgent')}>
            Urgent ({sentimentStats.urgent})
          </TabsTrigger>
          <TabsTrigger value="positive" onClick={() => setSelectedSentiment('positive')}>
            Positive ({sentimentStats.positive})
          </TabsTrigger>
          <TabsTrigger value="negative" onClick={() => setSelectedSentiment('negative')}>
            Negative ({sentimentStats.negative})
          </TabsTrigger>
          <TabsTrigger value="neutral" onClick={() => setSelectedSentiment('neutral')}>
            Neutral ({sentimentStats.neutral})
          </TabsTrigger>
        </TabsList>

        {['all', 'urgent', 'positive', 'negative', 'neutral'].map(tab => (
          <TabsContent key={tab} value={tab} className="space-y-4">
            {filterSentiments(tab).length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center text-muted-foreground">
                  No {tab !== 'all' ? tab : ''} reviews found
                </CardContent>
              </Card>
            ) : (
              filterSentiments(tab).map((sentiment) => (
                <Card key={sentiment.id} className={`hover:shadow-md transition-shadow ${getSentimentColor(sentiment.sentiment)}`}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2">
                          {getSentimentIcon(sentiment.sentiment)}
                          <Badge variant="outline" className="capitalize">
                            {sentiment.sentiment}
                          </Badge>
                          {getUrgencyBadge(sentiment.urgency_level)}
                          <span className="text-xs text-muted-foreground">
                            Confidence: {(sentiment.confidence_score * 100).toFixed(0)}%
                          </span>
                        </div>
                        
                        <CardDescription className="text-sm font-medium">
                          {sentiment.ai_summary}
                        </CardDescription>

                        {sentiment.key_themes.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {sentiment.key_themes.map((theme, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {theme}
                              </Badge>
                            ))}
                          </div>
                        )}

                        {sentiment.extracted_topics.length > 0 && (
                          <div className="text-xs space-y-1 mt-2">
                            {sentiment.extracted_topics.slice(0, 3).map((topic, idx) => (
                              <div key={idx} className="flex items-start gap-2">
                                <span className="font-medium">{topic.topic}:</span>
                                <span className="text-muted-foreground">{topic.mention}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        <div className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(sentiment.created_at), { addSuffix: true })}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};
