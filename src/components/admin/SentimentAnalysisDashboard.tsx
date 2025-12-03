import { useState } from 'react';
import { useReviewSentiment } from '@/hooks/use-review-sentiment';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, Smile, Frown, Meh, AlertCircle, Loader2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export const SentimentAnalysisDashboard = () => {
  const { sentiments, sentimentStats, isLoading } = useReviewSentiment();
  const [selectedSentiment, setSelectedSentiment] = useState<string>('all');

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return <Smile className="h-4 w-4 text-green-400" />;
      case 'negative': return <Frown className="h-4 w-4 text-red-400" />;
      case 'neutral': return <Meh className="h-4 w-4 text-white/60" />;
      case 'mixed': return <TrendingUp className="h-4 w-4 text-orange-400" />;
      default: return <Meh className="h-4 w-4 text-white/60" />;
    }
  };

  const getSentimentCardStyle = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'backdrop-blur-xl bg-green-500/10 border-green-500/30';
      case 'negative': return 'backdrop-blur-xl bg-red-500/10 border-red-500/30';
      case 'neutral': return 'backdrop-blur-xl bg-white/10 border-white/20';
      case 'mixed': return 'backdrop-blur-xl bg-orange-500/10 border-orange-500/30';
      default: return 'backdrop-blur-xl bg-white/10 border-white/20';
    }
  };

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case 'critical': return <Badge className="bg-red-500/20 text-red-300 border-red-500/30">Critical</Badge>;
      case 'high': return <Badge className="bg-orange-500/20 text-orange-300 border-orange-500/30">High</Badge>;
      case 'medium': return <Badge className="bg-mansagold/20 text-mansagold border-mansagold/30">Medium</Badge>;
      case 'low': return <Badge className="bg-white/10 text-white/70 border-white/20">Low</Badge>;
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
        <Loader2 className="h-8 w-8 animate-spin text-mansagold" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
        <Card className="backdrop-blur-xl bg-white/10 border-white/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/70">Total Analyzed</CardTitle>
            <TrendingUp className="h-4 w-4 text-mansagold" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{sentimentStats.total}</div>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-xl bg-green-500/10 border-green-500/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-300">Positive</CardTitle>
            <Smile className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">{sentimentStats.positive}</div>
            <div className="text-xs text-green-300/70">{sentimentStats.positivePercentage.toFixed(0)}%</div>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-xl bg-red-500/10 border-red-500/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-300">Negative</CardTitle>
            <Frown className="h-4 w-4 text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-400">{sentimentStats.negative}</div>
            <div className="text-xs text-red-300/70">
              {((sentimentStats.negative / sentimentStats.total) * 100).toFixed(0)}%
            </div>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-xl bg-white/10 border-white/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/70">Neutral</CardTitle>
            <Meh className="h-4 w-4 text-white/60" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{sentimentStats.neutral}</div>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-xl bg-white/10 border-white/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/70">Avg. Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-mansagold" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{sentimentStats.averageScore.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-xl bg-orange-500/10 border-orange-500/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-300">Urgent</CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-400">{sentimentStats.urgent}</div>
          </CardContent>
        </Card>
      </div>

      {/* Sentiment List */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="backdrop-blur-xl bg-white/10 border border-white/20">
          <TabsTrigger 
            value="all" 
            onClick={() => setSelectedSentiment('all')}
            className="data-[state=active]:bg-mansagold data-[state=active]:text-mansablue text-white/70"
          >
            All ({sentimentStats.total})
          </TabsTrigger>
          <TabsTrigger 
            value="urgent" 
            onClick={() => setSelectedSentiment('urgent')}
            className="data-[state=active]:bg-mansagold data-[state=active]:text-mansablue text-white/70"
          >
            Urgent ({sentimentStats.urgent})
          </TabsTrigger>
          <TabsTrigger 
            value="positive" 
            onClick={() => setSelectedSentiment('positive')}
            className="data-[state=active]:bg-mansagold data-[state=active]:text-mansablue text-white/70"
          >
            Positive ({sentimentStats.positive})
          </TabsTrigger>
          <TabsTrigger 
            value="negative" 
            onClick={() => setSelectedSentiment('negative')}
            className="data-[state=active]:bg-mansagold data-[state=active]:text-mansablue text-white/70"
          >
            Negative ({sentimentStats.negative})
          </TabsTrigger>
          <TabsTrigger 
            value="neutral" 
            onClick={() => setSelectedSentiment('neutral')}
            className="data-[state=active]:bg-mansagold data-[state=active]:text-mansablue text-white/70"
          >
            Neutral ({sentimentStats.neutral})
          </TabsTrigger>
        </TabsList>

        {['all', 'urgent', 'positive', 'negative', 'neutral'].map(tab => (
          <TabsContent key={tab} value={tab} className="space-y-4">
            {filterSentiments(tab).length === 0 ? (
              <Card className="backdrop-blur-xl bg-white/10 border-white/20">
                <CardContent className="pt-6 text-center text-white/60">
                  No {tab !== 'all' ? tab : ''} reviews found
                </CardContent>
              </Card>
            ) : (
              filterSentiments(tab).map((sentiment) => (
                <Card key={sentiment.id} className={`hover:shadow-lg transition-all ${getSentimentCardStyle(sentiment.sentiment)}`}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          {getSentimentIcon(sentiment.sentiment)}
                          <Badge className="capitalize bg-white/10 text-white border-white/20">
                            {sentiment.sentiment}
                          </Badge>
                          {getUrgencyBadge(sentiment.urgency_level)}
                          <span className="text-xs text-white/60">
                            Confidence: {(sentiment.confidence_score * 100).toFixed(0)}%
                          </span>
                        </div>
                        
                        <CardDescription className="text-sm font-medium text-white/80">
                          {sentiment.ai_summary}
                        </CardDescription>

                        {sentiment.key_themes.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {sentiment.key_themes.map((theme, idx) => (
                              <Badge key={idx} className="text-xs bg-mansagold/20 text-mansagold border-mansagold/30">
                                {theme}
                              </Badge>
                            ))}
                          </div>
                        )}

                        {sentiment.extracted_topics.length > 0 && (
                          <div className="text-xs space-y-1 mt-2">
                            {sentiment.extracted_topics.slice(0, 3).map((topic, idx) => (
                              <div key={idx} className="flex items-start gap-2">
                                <span className="font-medium text-white/80">{topic.topic}:</span>
                                <span className="text-white/60">{topic.mention}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        <div className="text-xs text-white/50">
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
