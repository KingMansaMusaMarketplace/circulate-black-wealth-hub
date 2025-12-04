import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bot, Lightbulb, Shield, Wand2, ShieldAlert, Heart, Brain } from 'lucide-react';
import AIAnalyticsAssistant from './AIAnalyticsAssistant';
import AIInsightsGenerator from './AIInsightsGenerator';
import AIContentModeration from './AIContentModeration';
import AIAnnouncementWriter from './AIAnnouncementWriter';
import AIFraudDetection from './AIFraudDetection';
import AISentimentDashboard from './AISentimentDashboard';
import AIPredictiveAnalytics from './AIPredictiveAnalytics';

const AdminAIDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-6 w-6 text-primary" />
            AI Command Center
          </CardTitle>
          <CardDescription>
            Leverage AI to analyze data, moderate content, detect fraud, and automate tasks
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="assistant" className="space-y-6">
        <TabsList className="flex flex-wrap gap-2 h-auto p-2">
          <TabsTrigger value="assistant" className="flex items-center gap-1 text-xs">
            <Bot className="h-3 w-3" />
            Analytics Chat
          </TabsTrigger>
          <TabsTrigger value="insights" className="flex items-center gap-1 text-xs">
            <Lightbulb className="h-3 w-3" />
            Insights
          </TabsTrigger>
          <TabsTrigger value="moderation" className="flex items-center gap-1 text-xs">
            <Shield className="h-3 w-3" />
            Moderation
          </TabsTrigger>
          <TabsTrigger value="announcements" className="flex items-center gap-1 text-xs">
            <Wand2 className="h-3 w-3" />
            Writer
          </TabsTrigger>
          <TabsTrigger value="fraud" className="flex items-center gap-1 text-xs">
            <ShieldAlert className="h-3 w-3" />
            Fraud
          </TabsTrigger>
          <TabsTrigger value="sentiment" className="flex items-center gap-1 text-xs">
            <Heart className="h-3 w-3" />
            Sentiment
          </TabsTrigger>
          <TabsTrigger value="predictive" className="flex items-center gap-1 text-xs">
            <Brain className="h-3 w-3" />
            Predictions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="assistant">
          <AIAnalyticsAssistant />
        </TabsContent>

        <TabsContent value="insights">
          <AIInsightsGenerator />
        </TabsContent>

        <TabsContent value="moderation">
          <AIContentModeration />
        </TabsContent>

        <TabsContent value="announcements">
          <AIAnnouncementWriter />
        </TabsContent>

        <TabsContent value="fraud">
          <AIFraudDetection />
        </TabsContent>

        <TabsContent value="sentiment">
          <AISentimentDashboard />
        </TabsContent>

        <TabsContent value="predictive">
          <AIPredictiveAnalytics />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminAIDashboard;
