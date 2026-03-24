import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, Loader2, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

interface Props { businessId: string; }

const urgencyColors: Record<string, string> = {
  critical: 'bg-red-900/40 text-red-300 border-red-400/30',
  high: 'bg-orange-900/40 text-orange-300 border-orange-400/30',
  normal: 'bg-blue-900/40 text-blue-300 border-blue-400/30',
  low: 'bg-slate-700/40 text-slate-300 border-slate-400/30',
};

const categoryIcons: Record<string, string> = {
  tax: '💰', license: '📋', insurance: '🛡️', regulatory: '⚖️', employment: '👥', general: '📌',
};

export const KaylaComplianceReminders: React.FC<Props> = ({ businessId }) => {
  const [reminders, setReminders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => { fetchReminders(); }, [businessId]);

  const fetchReminders = async () => {
    const { data } = await supabase
      .from('kayla_compliance_reminders')
      .select('*')
      .eq('business_id', businessId)
      .order('due_date', { ascending: true });
    setReminders(data || []);
    setLoading(false);
  };

  const generateReminders = async () => {
    setGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('kayla-compliance-checker', {
        body: { business_id: businessId },
      });
      if (error) throw error;
      toast.success(`Generated ${data.reminders.length} compliance reminders!`);
      fetchReminders();
    } catch { toast.error('Failed to generate reminders'); }
    setGenerating(false);
  };

  const toggleComplete = async (id: string, current: boolean) => {
    await supabase.from('kayla_compliance_reminders')
      .update({ is_completed: !current, completed_at: !current ? new Date().toISOString() : null })
      .eq('id', id);
    setReminders(prev => prev.map(r => r.id === id ? { ...r, is_completed: !current } : r));
    toast.success(!current ? 'Marked complete!' : 'Marked incomplete');
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-yellow-400" /></div>;

  const pending = reminders.filter(r => !r.is_completed);
  const completed = reminders.filter(r => r.is_completed);
  const overdue = pending.filter(r => r.due_date && new Date(r.due_date) < new Date());

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Shield className="h-5 w-5 text-yellow-400" /> Compliance Reminders
        </h3>
        <Button size="sm" onClick={generateReminders} disabled={generating} className="bg-yellow-600 hover:bg-yellow-700 text-black">
          {generating ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Shield className="h-4 w-4 mr-1" />}
          Scan Compliance
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-slate-800/40 border-white/10">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-white">{pending.length}</p>
            <p className="text-xs text-white/60">Pending</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/40 border-white/10">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-red-400">{overdue.length}</p>
            <p className="text-xs text-white/60">Overdue</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/40 border-white/10">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-emerald-400">{completed.length}</p>
            <p className="text-xs text-white/60">Completed</p>
          </CardContent>
        </Card>
      </div>

      {/* Overdue alerts */}
      {overdue.length > 0 && (
        <Card className="bg-red-900/20 border-red-400/30">
          <CardHeader className="pb-2"><CardTitle className="text-sm text-red-400 flex items-center gap-2"><AlertTriangle className="h-4 w-4" /> Overdue Items</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {overdue.map(r => (
              <div key={r.id} className="flex items-center justify-between p-3 bg-slate-900/40 rounded-lg">
                <div className="flex items-center gap-3">
                  <span>{categoryIcons[r.category] || '📌'}</span>
                  <div>
                    <p className="text-sm font-medium text-white">{r.title}</p>
                    <p className="text-xs text-red-400">Due: {new Date(r.due_date).toLocaleDateString()}</p>
                  </div>
                </div>
                <Button size="sm" variant="ghost" onClick={() => toggleComplete(r.id, r.is_completed)} className="text-emerald-400 hover:bg-emerald-900/20">
                  <CheckCircle2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Pending reminders */}
      {pending.filter(r => !overdue.includes(r)).length > 0 && (
        <Card className="bg-slate-800/40 border-white/10">
          <CardHeader className="pb-2"><CardTitle className="text-sm text-white flex items-center gap-2"><Clock className="h-4 w-4" /> Upcoming</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {pending.filter(r => !overdue.includes(r)).map(r => (
              <div key={r.id} className="flex items-center justify-between p-3 bg-slate-900/30 rounded-lg">
                <div className="flex items-center gap-3 flex-1">
                  <span>{categoryIcons[r.category] || '📌'}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-white">{r.title}</p>
                      <Badge className={urgencyColors[r.urgency] || urgencyColors.normal}>{r.urgency}</Badge>
                    </div>
                    <p className="text-xs text-white/50">{r.description}</p>
                    {r.due_date && <p className="text-xs text-white/40 mt-1">Due: {new Date(r.due_date).toLocaleDateString()}</p>}
                  </div>
                </div>
                <Button size="sm" variant="ghost" onClick={() => toggleComplete(r.id, r.is_completed)} className="text-white/40 hover:text-emerald-400 hover:bg-emerald-900/20">
                  <CheckCircle2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {reminders.length === 0 && (
        <Card className="bg-slate-800/40 border-white/10">
          <CardContent className="p-8 text-center">
            <Shield className="h-12 w-12 text-yellow-400/40 mx-auto mb-3" />
            <p className="text-white/60 text-sm">Click "Scan Compliance" to get AI-generated reminders for tax deadlines, licenses, insurance, and regulatory requirements.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
