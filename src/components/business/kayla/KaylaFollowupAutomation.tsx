import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Loader2, RefreshCw, Sparkles } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface FollowupRule {
  id: string;
  rule_name: string;
  trigger_event: string;
  delay_hours: number;
  message_template: string;
  is_active: boolean;
}

interface Props {
  businessId: string;
}

export const KaylaFollowupAutomation: React.FC<Props> = ({ businessId }) => {
  const [rules, setRules] = useState<FollowupRule[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => { fetchRules(); }, [businessId]);

  const fetchRules = async () => {
    const { data } = await supabase
      .from('kayla_followup_rules')
      .select('*')
      .eq('business_id', businessId);
    if (data) setRules(data as unknown as FollowupRule[]);
    setFetching(false);
  };

  const generateRules = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.functions.invoke('kayla-followup-processor', {
        body: { businessId, action: 'generate_rules' },
      });
      if (error) throw error;
      toast.success('Follow-up rules generated!');
      await fetchRules();
    } catch (err: any) {
      toast.error(err.message || 'Failed to generate rules');
    } finally {
      setLoading(false);
    }
  };

  const toggleRule = async (id: string, isActive: boolean) => {
    await supabase.from('kayla_followup_rules').update({ is_active: isActive }).eq('id', id);
    setRules(prev => prev.map(r => r.id === id ? { ...r, is_active: isActive } : r));
    toast.success(isActive ? 'Rule activated' : 'Rule paused');
  };

  if (fetching) {
    return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-yellow-400" /></div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <RefreshCw className="h-5 w-5 text-orange-400" />
            Follow-up Automation
          </h3>
          <p className="text-sm text-white/50">Automated customer follow-ups</p>
        </div>
        {rules.length === 0 && (
          <Button
            onClick={generateRules}
            disabled={loading}
            className="bg-gradient-to-r from-orange-500 to-red-500 text-white"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Sparkles className="h-4 w-4 mr-2" />}
            {loading ? 'Generating...' : 'Generate Rules'}
          </Button>
        )}
      </div>

      {rules.length === 0 ? (
        <Card className="bg-slate-800/40 border-white/10">
          <CardContent className="p-8 text-center">
            <RefreshCw className="h-12 w-12 text-orange-400/40 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-white mb-1">No follow-up rules yet</h3>
            <p className="text-sm text-white/50">Generate smart follow-up rules for your business.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {rules.map((rule) => (
            <Card key={rule.id} className="bg-slate-800/40 border-white/10">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-medium text-white">{rule.rule_name}</h4>
                    <Badge variant="outline" className="text-xs border-white/10 text-white/50">
                      {rule.trigger_event}
                    </Badge>
                    <Badge variant="outline" className="text-xs border-white/10 text-white/40">
                      {rule.delay_hours}h delay
                    </Badge>
                  </div>
                  <p className="text-xs text-white/40 line-clamp-1">{rule.message_template}</p>
                </div>
                <Switch
                  checked={rule.is_active}
                  onCheckedChange={(checked) => toggleRule(rule.id, checked)}
                />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
