import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Loader2, Bell, Clock, Mail, Send, Sparkles } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ReminderRule {
  id: string;
  reminder_type: string;
  hours_before: number;
  message_template: string;
  channel: string;
  is_active: boolean;
}

interface ReminderSent {
  id: string;
  customer_name: string;
  customer_email: string;
  message_content: string;
  sent_at: string;
  status: string;
}

interface Props {
  businessId: string;
}

export const KaylaAppointmentReminders: React.FC<Props> = ({ businessId }) => {
  const [rules, setRules] = useState<ReminderRule[]>([]);
  const [sentReminders, setSentReminders] = useState<ReminderSent[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => { fetchData(); }, [businessId]);

  const fetchData = async () => {
    const [rulesRes, sentRes] = await Promise.all([
      supabase.from('kayla_reminder_rules').select('*').eq('business_id', businessId),
      supabase.from('kayla_reminders_sent').select('*').eq('business_id', businessId).order('sent_at', { ascending: false }).limit(20),
    ]);
    if (rulesRes.data) setRules(rulesRes.data as unknown as ReminderRule[]);
    if (sentRes.data) setSentReminders(sentRes.data as unknown as ReminderSent[]);
    setFetching(false);
  };

  const setupDefaults = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.functions.invoke('kayla-reminder-engine', {
        body: { businessId, action: 'setup_defaults' },
      });
      if (error) throw error;
      toast.success('Default reminder rules created!');
      await fetchData();
    } catch (err: any) {
      toast.error(err.message || 'Failed to setup reminders');
    } finally {
      setLoading(false);
    }
  };

  const toggleRule = async (ruleId: string, isActive: boolean) => {
    await supabase.from('kayla_reminder_rules').update({ is_active: isActive }).eq('id', ruleId);
    setRules(prev => prev.map(r => r.id === ruleId ? { ...r, is_active: isActive } : r));
    toast.success(isActive ? 'Reminder activated' : 'Reminder paused');
  };

  const processReminders = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('kayla-reminder-engine', {
        body: { businessId, action: 'process_reminders' },
      });
      if (error) throw error;
      toast.success(`Processed ${data.sent || 0} reminders`);
      await fetchData();
    } catch (err: any) {
      toast.error(err.message || 'Failed to process reminders');
    } finally {
      setLoading(false);
    }
  };

  const typeLabels: Record<string, string> = {
    appointment: '📅 Appointment Reminder',
    follow_up: '🤝 Post-Visit Follow-up',
    renewal: '🔄 Re-engagement',
    custom: '✏️ Custom',
  };

  if (fetching) {
    return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-yellow-400" /></div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Bell className="h-5 w-5 text-amber-400" />
            Appointment Reminders
          </h3>
          <p className="text-sm text-white/50">Automated reminders & follow-ups for your customers</p>
        </div>
        <div className="flex gap-2">
          {rules.length === 0 && (
            <Button
              onClick={setupDefaults}
              disabled={loading}
              className="bg-gradient-to-r from-amber-500 to-orange-500 text-white"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Sparkles className="h-4 w-4 mr-2" />}
              Setup Smart Reminders
            </Button>
          )}
          {rules.length > 0 && (
            <Button
              onClick={processReminders}
              disabled={loading}
              variant="outline"
              className="border-amber-400/30 text-amber-400"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}
              Process Now
            </Button>
          )}
        </div>
      </div>

      {rules.length === 0 ? (
        <Card className="bg-slate-800/40 border-white/10">
          <CardContent className="p-8 text-center">
            <Bell className="h-12 w-12 text-amber-400/40 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-white mb-1">No reminder rules yet</h3>
            <p className="text-sm text-white/50">Set up smart reminders to automatically follow up with customers.</p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-3">
            {rules.map((rule) => (
              <Card key={rule.id} className="bg-slate-800/40 border-white/10">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-sm font-medium text-white">
                          {typeLabels[rule.reminder_type] || rule.reminder_type}
                        </h4>
                        <Badge variant="outline" className="text-xs border-white/10 text-white/50">
                          <Clock className="h-3 w-3 mr-1" /> {rule.hours_before}h before
                        </Badge>
                        <Badge variant="outline" className="text-xs border-white/10 text-white/50">
                          <Mail className="h-3 w-3 mr-1" /> {rule.channel}
                        </Badge>
                      </div>
                      <p className="text-xs text-white/40 line-clamp-1">{rule.message_template}</p>
                    </div>
                    <Switch
                      checked={rule.is_active}
                      onCheckedChange={(checked) => toggleRule(rule.id, checked)}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {sentReminders.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-white/70 mb-2">Recent Sends ({sentReminders.length})</h4>
              <div className="grid gap-2">
                {sentReminders.slice(0, 5).map((sent) => (
                  <Card key={sent.id} className="bg-slate-900/30 border-white/5">
                    <CardContent className="p-3 flex items-center justify-between">
                      <div>
                        <span className="text-sm text-white/60">{sent.customer_name || sent.customer_email}</span>
                        <span className="text-xs text-white/30 ml-2">
                          {new Date(sent.sent_at).toLocaleDateString()}
                        </span>
                      </div>
                      <Badge variant="outline" className={`text-xs ${sent.status === 'opened' ? 'border-emerald-400/30 text-emerald-400' : 'border-white/10 text-white/40'}`}>
                        {sent.status}
                      </Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
