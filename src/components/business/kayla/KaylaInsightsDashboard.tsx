import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sparkles, MessageSquare, AlertTriangle, Handshake, FileText, TrendingUp, Check, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { KaylaUpgradeCard } from './KaylaUpgradeCard';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { KaylaSocialPostGenerator } from './KaylaSocialPostGenerator';
import { KaylaSEOAudit } from './KaylaSEOAudit';
import { KaylaCustomerSegments } from './KaylaCustomerSegments';
import { KaylaFollowupAutomation } from './KaylaFollowupAutomation';
import { KaylaGrantMatcher } from './KaylaGrantMatcher';
import { KaylaCashFlowForecast } from './KaylaCashFlowForecast';
import { KaylaPriceOptimizer } from './KaylaPriceOptimizer';
import { KaylaAppointmentReminders } from './KaylaAppointmentReminders';
import { KaylaEmailCampaigns } from './KaylaEmailCampaigns';
import { KaylaInventoryManager } from './KaylaInventoryManager';
import { KaylaTaxPrep } from './KaylaTaxPrep';
import { KaylaInvestmentReadiness } from './KaylaInvestmentReadiness';
import { KaylaComplianceReminders } from './KaylaComplianceReminders';
import { KaylaLegalTemplates } from './KaylaLegalTemplates';

interface KaylaInsight {
  id: string;
  business_id: string;
  insight_type: string;
  title: string;
  content: string;
  status: string;
  metadata: Record<string, unknown>;
  created_at: string;
}

const insightConfig: Record<string, { icon: React.ElementType; label: string; color: string }> = {
  review_draft: { icon: MessageSquare, label: 'Review Draft', color: 'text-blue-400 bg-blue-400/10' },
  churn_alert: { icon: AlertTriangle, label: 'Churn Alert', color: 'text-red-400 bg-red-400/10' },
  onboarding_tip: { icon: Sparkles, label: 'Onboarding Tip', color: 'text-amber-400 bg-amber-400/10' },
  b2b_match: { icon: Handshake, label: 'B2B Match', color: 'text-emerald-400 bg-emerald-400/10' },
  content_suggestion: { icon: FileText, label: 'Content Idea', color: 'text-purple-400 bg-purple-400/10' },
  quality_score: { icon: TrendingUp, label: 'Quality Score', color: 'text-cyan-400 bg-cyan-400/10' },
  upgrade_pitch: { icon: Sparkles, label: 'Opportunity', color: 'text-yellow-400 bg-yellow-400/10' },
};

interface Props {
  businessId: string;
}

export const KaylaInsightsDashboard: React.FC<Props> = ({ businessId }) => {
  const [insights, setInsights] = useState<KaylaInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const { subscriptionInfo } = useSubscription();

  const tier = subscriptionInfo?.subscription_tier as string | undefined;
  const isKaylaSubscriber = tier === 'kayla_starter' ||
    tier === 'kayla_starter_annual' ||
    tier === 'kayla_pro' ||
    tier === 'kayla_pro_annual' ||
    tier === 'kayla_enterprise' ||
    // Legacy tiers
    tier === 'kayla_ai' ||
    tier === 'enterprise' ||
    tier === 'business_pro_kayla' ||
    tier === 'business_pro_kayla_annual';

  useEffect(() => {
    fetchInsights();

    const channel = supabase
      .channel('kayla-insights')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'kayla_business_insights',
        filter: `business_id=eq.${businessId}`,
      }, () => {
        fetchInsights();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [businessId]);

  const fetchInsights = async () => {
    const { data, error } = await supabase
      .from('kayla_business_insights')
      .select('*')
      .eq('business_id', businessId)
      .order('created_at', { ascending: false })
      .limit(50);

    if (!error && data) {
      setInsights(data as unknown as KaylaInsight[]);
    }
    setLoading(false);
  };

  const updateStatus = async (id: string, status: 'approved' | 'dismissed') => {
    const { error } = await supabase
      .from('kayla_business_insights')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      toast.error('Failed to update insight');
    } else {
      toast.success(status === 'approved' ? 'Insight approved!' : 'Insight dismissed');
      setInsights(prev => prev.map(i => i.id === id ? { ...i, status } : i));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-yellow-400" />
      </div>
    );
  }

  const pendingInsights = insights.filter(i => i.status === 'pending');
  const actionedInsights = insights.filter(i => i.status !== 'pending');

  return (
    <div className="space-y-6">
      {!isKaylaSubscriber && <KaylaUpgradeCard />}

      <Tabs defaultValue="insights" className="w-full">
        <TabsList className="flex flex-wrap gap-1 bg-slate-800/40 border border-white/10 h-auto p-1">
          <TabsTrigger value="insights" className="data-[state=active]:bg-yellow-900/60 data-[state=active]:text-yellow-300 text-white/60 text-xs">📊 Insights</TabsTrigger>
          <TabsTrigger value="grants" className="data-[state=active]:bg-emerald-900/60 data-[state=active]:text-emerald-300 text-white/60 text-xs">💰 Grants</TabsTrigger>
          <TabsTrigger value="cashflow" className="data-[state=active]:bg-blue-900/60 data-[state=active]:text-blue-300 text-white/60 text-xs">📈 Cash Flow</TabsTrigger>
          <TabsTrigger value="pricing" className="data-[state=active]:bg-purple-900/60 data-[state=active]:text-purple-300 text-white/60 text-xs">🏷️ Pricing</TabsTrigger>
          <TabsTrigger value="tax" className="data-[state=active]:bg-amber-900/60 data-[state=active]:text-amber-300 text-white/60 text-xs">🧾 Tax Prep</TabsTrigger>
          <TabsTrigger value="investment" className="data-[state=active]:bg-cyan-900/60 data-[state=active]:text-cyan-300 text-white/60 text-xs">📊 Investor Score</TabsTrigger>
          <TabsTrigger value="inventory" className="data-[state=active]:bg-orange-900/60 data-[state=active]:text-orange-300 text-white/60 text-xs">📦 Inventory</TabsTrigger>
          <TabsTrigger value="compliance" className="data-[state=active]:bg-red-900/60 data-[state=active]:text-red-300 text-white/60 text-xs">🛡️ Compliance</TabsTrigger>
          <TabsTrigger value="legal" className="data-[state=active]:bg-indigo-900/60 data-[state=active]:text-indigo-300 text-white/60 text-xs">⚖️ Legal</TabsTrigger>
          <TabsTrigger value="social" className="data-[state=active]:bg-pink-900/60 data-[state=active]:text-pink-300 text-white/60 text-xs">📱 Social</TabsTrigger>
          <TabsTrigger value="seo" className="data-[state=active]:bg-cyan-900/60 data-[state=active]:text-cyan-300 text-white/60 text-xs">🔍 SEO</TabsTrigger>
          <TabsTrigger value="segments" className="data-[state=active]:bg-indigo-900/60 data-[state=active]:text-indigo-300 text-white/60 text-xs">👥 Segments</TabsTrigger>
          <TabsTrigger value="followups" className="data-[state=active]:bg-orange-900/60 data-[state=active]:text-orange-300 text-white/60 text-xs">🔄 Follow-ups</TabsTrigger>
          <TabsTrigger value="reminders" className="data-[state=active]:bg-amber-900/60 data-[state=active]:text-amber-300 text-white/60 text-xs">🔔 Reminders</TabsTrigger>
          <TabsTrigger value="emails" className="data-[state=active]:bg-rose-900/60 data-[state=active]:text-rose-300 text-white/60 text-xs">✉️ Campaigns</TabsTrigger>
        </TabsList>

        <TabsContent value="insights">
          {/* Stats summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-slate-800/40 border-white/10">
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-yellow-400">{insights.length}</p>
                <p className="text-xs text-white/60">Total Insights</p>
              </CardContent>
            </Card>
            <Card className="bg-slate-800/40 border-white/10">
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-blue-400">{pendingInsights.length}</p>
                <p className="text-xs text-white/60">Pending Action</p>
              </CardContent>
            </Card>
            <Card className="bg-slate-800/40 border-white/10">
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-emerald-400">
                  {insights.filter(i => i.insight_type === 'review_draft').length}
                </p>
                <p className="text-xs text-white/60">Review Drafts</p>
              </CardContent>
            </Card>
            <Card className="bg-slate-800/40 border-white/10">
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-purple-400">
                  {insights.filter(i => i.insight_type === 'b2b_match').length}
                </p>
                <p className="text-xs text-white/60">B2B Matches</p>
              </CardContent>
            </Card>
          </div>

          {/* Pending insights */}
          {pendingInsights.length > 0 && (
            <div className="space-y-3 mb-6">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-yellow-400" />
                Pending Insights ({pendingInsights.length})
              </h3>
              {pendingInsights.map(insight => {
                const config = insightConfig[insight.insight_type] || insightConfig.content_suggestion;
                const Icon = config.icon;
                return (
                  <Card key={insight.id} className="bg-slate-800/40 border-white/10 hover:border-yellow-400/30 transition-all">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3 flex-1">
                          <div className={`p-2 rounded-lg ${config.color}`}>
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="outline" className="text-xs border-white/20 text-white/70">
                                {config.label}
                              </Badge>
                              <span className="text-xs text-white/40">
                                {new Date(insight.created_at).toLocaleDateString()}
                              </span>
                            </div>
                            <h4 className="text-sm font-medium text-white mb-1">{insight.title}</h4>
                            <p className="text-sm text-white/60 line-clamp-3">{insight.content}</p>
                          </div>
                        </div>
                        {isKaylaSubscriber && (
                          <div className="flex gap-2 shrink-0">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-400/10"
                              onClick={() => updateStatus(insight.id, 'approved')}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                              onClick={() => updateStatus(insight.id, 'dismissed')}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Actioned insights */}
          {actionedInsights.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-white/70">History</h3>
              {actionedInsights.slice(0, 10).map(insight => {
                const config = insightConfig[insight.insight_type] || insightConfig.content_suggestion;
                const Icon = config.icon;
                return (
                  <Card key={insight.id} className="bg-slate-900/30 border-white/5 opacity-60">
                    <CardContent className="p-3">
                      <div className="flex items-center gap-3">
                        <Icon className="h-4 w-4 text-white/40" />
                        <span className="text-sm text-white/50 flex-1">{insight.title}</span>
                        <Badge variant="outline" className={`text-xs ${insight.status === 'approved' ? 'border-emerald-400/30 text-emerald-400/70' : 'border-red-400/30 text-red-400/70'}`}>
                          {insight.status}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {insights.length === 0 && (
            <Card className="bg-slate-800/40 border-white/10">
              <CardContent className="p-8 text-center">
                <Sparkles className="h-12 w-12 text-yellow-400/40 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-white mb-1">Kayla is analyzing your business</h3>
                <p className="text-sm text-white/50">
                  Insights will appear here as Kayla processes reviews, finds B2B matches, and generates content for you.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="grants">
          <KaylaGrantMatcher businessId={businessId} />
        </TabsContent>

        <TabsContent value="cashflow">
          <KaylaCashFlowForecast businessId={businessId} />
        </TabsContent>

        <TabsContent value="pricing">
          <KaylaPriceOptimizer businessId={businessId} />
        </TabsContent>

        <TabsContent value="tax">
          <KaylaTaxPrep businessId={businessId} />
        </TabsContent>

        <TabsContent value="investment">
          <KaylaInvestmentReadiness businessId={businessId} />
        </TabsContent>

        <TabsContent value="inventory">
          <KaylaInventoryManager businessId={businessId} />
        </TabsContent>

        <TabsContent value="compliance">
          <KaylaComplianceReminders businessId={businessId} />
        </TabsContent>

        <TabsContent value="legal">
          <KaylaLegalTemplates businessId={businessId} />
        </TabsContent>

        <TabsContent value="social">
          <KaylaSocialPostGenerator businessId={businessId} />
        </TabsContent>

        <TabsContent value="seo">
          <KaylaSEOAudit businessId={businessId} />
        </TabsContent>

        <TabsContent value="segments">
          <KaylaCustomerSegments businessId={businessId} />
        </TabsContent>

        <TabsContent value="followups">
          <KaylaFollowupAutomation businessId={businessId} />
        </TabsContent>

        <TabsContent value="reminders">
          <KaylaAppointmentReminders businessId={businessId} />
        </TabsContent>

        <TabsContent value="emails">
          <KaylaEmailCampaigns businessId={businessId} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
