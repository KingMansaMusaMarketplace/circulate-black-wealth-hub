import React, { useState, useEffect } from 'react';
import { sanitizeHtml } from '@/lib/security/content-sanitizer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Mail, Sparkles, Eye, MousePointer, Send } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Campaign {
  id: string;
  campaign_name: string;
  trigger_type: string;
  subject_line: string;
  email_body: string;
  is_active: boolean;
  total_sent: number;
  total_opened: number;
  total_clicked: number;
  created_at: string;
}

interface Props {
  businessId: string;
}

const triggerLabels: Record<string, { label: string; emoji: string }> = {
  first_visit: { label: 'First Visit', emoji: '👋' },
  repeat_visit: { label: 'Repeat Customer', emoji: '🔁' },
  no_visit_30d: { label: 'Win-Back (30d inactive)', emoji: '💤' },
  high_spender: { label: 'VIP / High Spender', emoji: '⭐' },
  new_review: { label: 'New Review', emoji: '📝' },
  birthday: { label: 'Birthday', emoji: '🎂' },
  abandoned_booking: { label: 'Abandoned Booking', emoji: '🛒' },
};

export const KaylaEmailCampaigns: React.FC<Props> = ({ businessId }) => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [selectedTrigger, setSelectedTrigger] = useState('repeat_visit');
  const [previewId, setPreviewId] = useState<string | null>(null);

  useEffect(() => { fetchCampaigns(); }, [businessId]);

  const fetchCampaigns = async () => {
    const { data } = await supabase
      .from('kayla_email_campaigns')
      .select('*')
      .eq('business_id', businessId)
      .order('created_at', { ascending: false });
    if (data) setCampaigns(data as unknown as Campaign[]);
    setFetching(false);
  };

  const generateCampaign = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('kayla-email-campaigns', {
        body: { businessId, action: 'generate_campaign', triggerType: selectedTrigger },
      });
      if (error) throw error;
      toast.success('Campaign generated!');
      await fetchCampaigns();
    } catch (err: any) {
      toast.error(err.message || 'Failed to generate campaign');
    } finally {
      setLoading(false);
    }
  };

  const toggleCampaign = async (id: string, isActive: boolean) => {
    await supabase.from('kayla_email_campaigns').update({ is_active: isActive, updated_at: new Date().toISOString() }).eq('id', id);
    setCampaigns(prev => prev.map(c => c.id === id ? { ...c, is_active: isActive } : c));
    toast.success(isActive ? 'Campaign activated' : 'Campaign paused');
  };

  if (fetching) {
    return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-yellow-400" /></div>;
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Mail className="h-5 w-5 text-pink-400" />
          Behavior-Triggered Email Campaigns
        </h3>
        <p className="text-sm text-white/50">Automated emails based on customer behavior</p>
      </div>

      {/* Generator */}
      <Card className="bg-slate-800/40 border-white/10">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Select value={selectedTrigger} onValueChange={setSelectedTrigger}>
              <SelectTrigger className="w-64 bg-slate-700/50 border-white/10 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(triggerLabels).map(([key, { label, emoji }]) => (
                  <SelectItem key={key} value={key}>{emoji} {label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              onClick={generateCampaign}
              disabled={loading}
              className="bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:from-pink-400 hover:to-rose-400"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Sparkles className="h-4 w-4 mr-2" />}
              {loading ? 'Generating...' : 'Generate Campaign'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Campaign List */}
      {campaigns.length === 0 ? (
        <Card className="bg-slate-800/40 border-white/10">
          <CardContent className="p-8 text-center">
            <Mail className="h-12 w-12 text-pink-400/40 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-white mb-1">No campaigns yet</h3>
            <p className="text-sm text-white/50">Select a trigger and generate your first AI-powered email campaign.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {campaigns.map((campaign) => {
            const trigger = triggerLabels[campaign.trigger_type] || { label: campaign.trigger_type, emoji: '📧' };
            return (
              <Card key={campaign.id} className="bg-slate-800/40 border-white/10">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-sm font-semibold text-white">{campaign.campaign_name}</h4>
                        <Badge variant="outline" className="text-xs border-white/10 text-white/50">
                          {trigger.emoji} {trigger.label}
                        </Badge>
                      </div>
                      <p className="text-xs text-white/60 mb-2">Subject: {campaign.subject_line}</p>
                      <div className="flex items-center gap-4 text-xs text-white/40">
                        <span className="flex items-center gap-1"><Send className="h-3 w-3" /> {campaign.total_sent} sent</span>
                        <span className="flex items-center gap-1"><Eye className="h-3 w-3" /> {campaign.total_opened} opened</span>
                        <span className="flex items-center gap-1"><MousePointer className="h-3 w-3" /> {campaign.total_clicked} clicked</span>
                      </div>
                      {previewId === campaign.id && campaign.email_body && (
                        <div className="mt-3 bg-white/5 rounded-lg p-3 text-xs text-white/60 max-h-40 overflow-y-auto" dangerouslySetInnerHTML={{ __html: campaign.email_body }} />
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-white/40 text-xs"
                        onClick={() => setPreviewId(previewId === campaign.id ? null : campaign.id)}
                      >
                        {previewId === campaign.id ? 'Hide' : 'Preview'}
                      </Button>
                      <Switch
                        checked={campaign.is_active}
                        onCheckedChange={(checked) => toggleCampaign(campaign.id, checked)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
