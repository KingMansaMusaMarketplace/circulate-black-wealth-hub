import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
  Star, Zap, Users, TrendingUp, Gift, Plus, Trash2, Loader2,
  RefreshCw, Sparkles, Target, Repeat, Car, Clock, Award
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface KaylaLoyaltyEngineProps {
  businessId: string;
}

const KaylaLoyaltyEngine: React.FC<KaylaLoyaltyEngineProps> = ({ businessId }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dashboard, setDashboard] = useState<any>(null);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [creatingRule, setCreatingRule] = useState(false);
  const [showRuleDialog, setShowRuleDialog] = useState(false);

  // New rule form
  const [newRule, setNewRule] = useState({
    name: '',
    rule_type: 'multiplier',
    trigger_event: 'qr_scan',
    multiplier: 2,
    bonus_points: 0,
    noire_credits: 0,
  });

  const fetchDashboard = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke('kayla-loyalty-engine', {
        body: { action: 'get_dashboard', business_id: businessId },
      });
      if (error) throw error;
      setDashboard(data);
    } catch (err) {
      console.error('Failed to load loyalty dashboard:', err);
    } finally {
      setLoading(false);
    }
  }, [businessId]);

  useEffect(() => {
    if (businessId && user) fetchDashboard();
  }, [businessId, user, fetchDashboard]);

  const fetchSuggestions = async () => {
    setLoadingSuggestions(true);
    try {
      const { data, error } = await supabase.functions.invoke('kayla-loyalty-engine', {
        body: { action: 'suggest_campaigns', business_id: businessId },
      });
      if (error) throw error;
      setSuggestions(data.suggestions || []);
    } catch {
      toast.error('Failed to get suggestions');
    } finally {
      setLoadingSuggestions(false);
    }
  };

  const createRule = async () => {
    if (!newRule.name) { toast.error('Rule name required'); return; }
    setCreatingRule(true);
    try {
      const rewardConfig: any = {};
      if (newRule.multiplier > 1) rewardConfig.multiplier = newRule.multiplier;
      if (newRule.bonus_points > 0) rewardConfig.bonus_points = newRule.bonus_points;
      if (newRule.noire_credits > 0) rewardConfig.noire_credits = newRule.noire_credits;

      const { error } = await supabase.functions.invoke('kayla-loyalty-engine', {
        body: {
          action: 'create_rule',
          business_id: businessId,
          name: newRule.name,
          rule_type: newRule.rule_type,
          trigger_event: newRule.trigger_event,
          reward_config: rewardConfig,
        },
      });
      if (error) throw error;
      toast.success('Rule created');
      setShowRuleDialog(false);
      setNewRule({ name: '', rule_type: 'multiplier', trigger_event: 'qr_scan', multiplier: 2, bonus_points: 0, noire_credits: 0 });
      fetchDashboard();
    } catch {
      toast.error('Failed to create rule');
    } finally {
      setCreatingRule(false);
    }
  };

  const toggleRule = async (ruleId: string, isActive: boolean) => {
    await supabase.functions.invoke('kayla-loyalty-engine', {
      body: { action: 'toggle_rule', business_id: businessId, rule_id: ruleId, is_active: !isActive },
    });
    fetchDashboard();
  };

  const deleteRule = async (ruleId: string) => {
    await supabase.functions.invoke('kayla-loyalty-engine', {
      body: { action: 'delete_rule', business_id: businessId, rule_id: ruleId },
    });
    toast.success('Rule deleted');
    fetchDashboard();
  };

  const deploySuggestion = async (suggestion: any) => {
    try {
      const { error } = await supabase.functions.invoke('kayla-loyalty-engine', {
        body: {
          action: 'create_campaign',
          business_id: businessId,
          name: suggestion.name,
          campaign_type: suggestion.campaign_type,
          description: suggestion.description,
          rules: suggestion.rules,
          ai_suggested: true,
          ai_reasoning: suggestion.ai_reasoning,
        },
      });
      if (error) throw error;
      toast.success(`Campaign "${suggestion.name}" deployed!`);
      fetchDashboard();
    } catch {
      toast.error('Failed to deploy campaign');
    }
  };

  const updateCampaignStatus = async (campaignId: string, status: string) => {
    await supabase.functions.invoke('kayla-loyalty-engine', {
      body: { action: 'update_campaign_status', business_id: businessId, campaign_id: campaignId, status },
    });
    toast.success(`Campaign ${status}`);
    fetchDashboard();
  };

  const triggerIcon = (event: string) => {
    switch (event) {
      case 'qr_scan': return <Target className="h-4 w-4" />;
      case 'review': return <Star className="h-4 w-4" />;
      case 'noire_ride': return <Car className="h-4 w-4" />;
      case 'booking': return <Clock className="h-4 w-4" />;
      case 'referral': return <Users className="h-4 w-4" />;
      default: return <Zap className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <Card><CardContent className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </CardContent></Card>
    );
  }

  const stats = dashboard?.stats || {};

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-primary">{stats.total_loyalty_members || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Loyalty Members</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold">{(stats.total_points_issued || 0).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Points Issued</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-amber-500">{stats.avg_multiplier || 1}x</div>
            <p className="text-xs text-muted-foreground mt-1">Avg Multiplier</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-emerald-500">{stats.total_noire_credits || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Noire Credits Given</p>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <Dialog open={showRuleDialog} onOpenChange={setShowRuleDialog}>
          <DialogTrigger asChild>
            <Button variant="outline"><Plus className="h-4 w-4 mr-2" />New Rule</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Create Loyalty Rule</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div><Label>Rule Name</Label><Input value={newRule.name} onChange={e => setNewRule(r => ({ ...r, name: e.target.value }))} placeholder="e.g. Double Points Friday" /></div>
              <div><Label>Trigger Event</Label>
                <Select value={newRule.trigger_event} onValueChange={v => setNewRule(r => ({ ...r, trigger_event: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="qr_scan">QR Scan</SelectItem>
                    <SelectItem value="review">Review</SelectItem>
                    <SelectItem value="booking">Booking</SelectItem>
                    <SelectItem value="referral">Referral</SelectItem>
                    <SelectItem value="noire_ride">Noire Ride</SelectItem>
                    <SelectItem value="checkin">Check-in</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div><Label>Rule Type</Label>
                <Select value={newRule.rule_type} onValueChange={v => setNewRule(r => ({ ...r, rule_type: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="multiplier">Point Multiplier</SelectItem>
                    <SelectItem value="bonus">Bonus Points</SelectItem>
                    <SelectItem value="cross_reward">Cross-Platform (Noire Credits)</SelectItem>
                    <SelectItem value="streak">Streak Challenge</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div><Label>Multiplier</Label><Input type="number" min={1} step={0.5} value={newRule.multiplier} onChange={e => setNewRule(r => ({ ...r, multiplier: parseFloat(e.target.value) || 1 }))} /></div>
                <div><Label>Bonus Pts</Label><Input type="number" min={0} value={newRule.bonus_points} onChange={e => setNewRule(r => ({ ...r, bonus_points: parseInt(e.target.value) || 0 }))} /></div>
                <div><Label>Noire Credits</Label><Input type="number" min={0} value={newRule.noire_credits} onChange={e => setNewRule(r => ({ ...r, noire_credits: parseInt(e.target.value) || 0 }))} /></div>
              </div>
              <Button onClick={createRule} disabled={creatingRule} className="w-full">
                {creatingRule ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Plus className="h-4 w-4 mr-2" />}
                Create Rule
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Button onClick={fetchSuggestions} disabled={loadingSuggestions}>
          {loadingSuggestions ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Sparkles className="h-4 w-4 mr-2" />}
          AI Suggest Campaigns
        </Button>

        <Button variant="ghost" onClick={fetchDashboard}><RefreshCw className="h-4 w-4 mr-2" />Refresh</Button>
      </div>

      {/* AI Suggestions */}
      {suggestions.length > 0 && (
        <Card className="border-primary/30 bg-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2"><Sparkles className="h-4 w-4 text-primary" />AI-Suggested Campaigns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {suggestions.map((s, i) => (
                <div key={i} className="flex items-start justify-between gap-3 p-3 rounded-lg bg-background border">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-sm">{s.name}</h4>
                      <Badge variant="outline" className="text-[10px]">{s.campaign_type}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-1">{s.description}</p>
                    <p className="text-xs text-primary/70 italic">{s.ai_reasoning}</p>
                  </div>
                  <Button size="sm" onClick={() => deploySuggestion(s)} className="shrink-0">
                    <Zap className="h-3 w-3 mr-1" />Deploy
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="rules" className="space-y-4">
        <TabsList>
          <TabsTrigger value="rules" className="text-xs"><Zap className="h-3 w-3 mr-1" />Rules ({stats.active_rules || 0})</TabsTrigger>
          <TabsTrigger value="campaigns" className="text-xs"><Gift className="h-3 w-3 mr-1" />Campaigns ({stats.active_campaigns || 0})</TabsTrigger>
          <TabsTrigger value="activity" className="text-xs"><TrendingUp className="h-3 w-3 mr-1" />Activity</TabsTrigger>
        </TabsList>

        {/* Rules Tab */}
        <TabsContent value="rules">
          <ScrollArea className="h-[400px]">
            <div className="space-y-3">
              {(dashboard?.rules || []).length === 0 ? (
                <Card><CardContent className="py-8 text-center text-muted-foreground">
                  <Zap className="h-10 w-10 mx-auto mb-3 opacity-50" />
                  <p>No loyalty rules yet.</p>
                  <p className="text-sm mt-1">Create rules to automate point multipliers and rewards.</p>
                </CardContent></Card>
              ) : (
                (dashboard.rules || []).map((rule: any) => (
                  <Card key={rule.id} className={`transition-all ${!rule.is_active ? 'opacity-60' : ''}`}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          {triggerIcon(rule.trigger_event)}
                          <div className="min-w-0">
                            <h4 className="font-semibold text-sm truncate">{rule.name}</h4>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                              <Badge variant="outline" className="text-[10px]">{rule.trigger_event}</Badge>
                              {rule.reward_config?.multiplier > 1 && (
                                <span className="text-amber-500 font-medium">{rule.reward_config.multiplier}x</span>
                              )}
                              {rule.reward_config?.bonus_points > 0 && (
                                <span>+{rule.reward_config.bonus_points}pts</span>
                              )}
                              {rule.reward_config?.noire_credits > 0 && (
                                <span className="text-emerald-500">+{rule.reward_config.noire_credits} credits</span>
                              )}
                              <span className="text-muted-foreground">Used {rule.current_uses || 0}x</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <Switch checked={rule.is_active} onCheckedChange={() => toggleRule(rule.id, rule.is_active)} />
                          <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-destructive" onClick={() => deleteRule(rule.id)}>
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        {/* Campaigns Tab */}
        <TabsContent value="campaigns">
          <ScrollArea className="h-[400px]">
            <div className="space-y-3">
              {(dashboard?.campaigns || []).length === 0 ? (
                <Card><CardContent className="py-8 text-center text-muted-foreground">
                  <Gift className="h-10 w-10 mx-auto mb-3 opacity-50" />
                  <p>No campaigns yet.</p>
                  <p className="text-sm mt-1">Use AI suggestions or create campaigns manually.</p>
                </CardContent></Card>
              ) : (
                (dashboard.campaigns || []).map((campaign: any) => (
                  <Card key={campaign.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-sm">{campaign.name}</h4>
                            <Badge variant={
                              campaign.status === 'active' ? 'default' :
                              campaign.status === 'paused' ? 'secondary' :
                              'outline'
                            } className="text-[10px]">
                              {campaign.status}
                            </Badge>
                            {campaign.ai_suggested && (
                              <Badge variant="outline" className="text-[10px] border-primary/30 text-primary">
                                <Sparkles className="h-2.5 w-2.5 mr-0.5" />AI
                              </Badge>
                            )}
                          </div>
                          {campaign.description && (
                            <p className="text-xs text-muted-foreground mb-1">{campaign.description}</p>
                          )}
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span>{campaign.participants_count || 0} participants</span>
                            <span>{(campaign.points_distributed || 0).toLocaleString()} pts distributed</span>
                            {campaign.noire_credits_distributed > 0 && (
                              <span className="text-emerald-500">{campaign.noire_credits_distributed} credits</span>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-1 shrink-0">
                          {campaign.status === 'active' && (
                            <Button size="sm" variant="outline" className="text-xs h-7" onClick={() => updateCampaignStatus(campaign.id, 'paused')}>
                              Pause
                            </Button>
                          )}
                          {campaign.status === 'paused' && (
                            <Button size="sm" variant="default" className="text-xs h-7" onClick={() => updateCampaignStatus(campaign.id, 'active')}>
                              Resume
                            </Button>
                          )}
                          {campaign.status === 'draft' && (
                            <Button size="sm" variant="default" className="text-xs h-7" onClick={() => updateCampaignStatus(campaign.id, 'active')}>
                              Launch
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity">
          <ScrollArea className="h-[400px]">
            <div className="space-y-2">
              {(dashboard?.recent_events || []).length === 0 ? (
                <Card><CardContent className="py-8 text-center text-muted-foreground">
                  <TrendingUp className="h-10 w-10 mx-auto mb-3 opacity-50" />
                  <p>No loyalty activity yet.</p>
                  <p className="text-sm mt-1">Events appear here as customers earn points.</p>
                </CardContent></Card>
              ) : (
                (dashboard.recent_events || []).map((event: any) => (
                  <div key={event.id} className="flex items-center justify-between gap-3 p-3 rounded-lg border bg-card">
                    <div className="flex items-center gap-3 min-w-0">
                      <Award className="h-4 w-4 text-primary shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs font-medium truncate">
                          {event.event_type.replace(/_/g, ' ')}
                          {event.multiplier > 1 && <span className="text-amber-500 ml-1">({event.multiplier}x)</span>}
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          {new Date(event.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold text-primary">+{event.total_points}</p>
                      {event.noire_credits_awarded > 0 && (
                        <p className="text-[10px] text-emerald-500">+{event.noire_credits_awarded} credits</p>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default KaylaLoyaltyEngine;
