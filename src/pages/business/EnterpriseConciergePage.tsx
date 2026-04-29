import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ArrowLeft,
  ShieldCheck,
  UserCircle,
  Mail,
  Phone,
  Calendar,
  Clock,
  Loader2,
  CheckCircle2,
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface AccountManager {
  manager_name: string;
  manager_email: string;
  manager_phone: string | null;
  manager_photo_url: string | null;
  manager_timezone: string | null;
  calendly_url: string | null;
  notes: string | null;
}

interface ConciergeRequest {
  id: string;
  subject: string;
  message: string;
  priority: string;
  status: string;
  created_at: string;
  responded_at: string | null;
  resolved_at: string | null;
}

const SLA_MATRIX: Record<string, { firstResponse: string; resolution: string }> = {
  urgent: { firstResponse: '1 hour', resolution: '4 hours' },
  high: { firstResponse: '4 hours', resolution: '1 business day' },
  normal: { firstResponse: '1 business day', resolution: '3 business days' },
  low: { firstResponse: '2 business days', resolution: '5 business days' },
};

export default function EnterpriseConciergePage() {
  const { user } = useAuth();
  const [am, setAm] = useState<AccountManager | null>(null);
  const [requests, setRequests] = useState<ConciergeRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    subject: '',
    message: '',
    priority: 'normal',
  });

  const load = async () => {
    if (!user) return;
    setLoading(true);
    const [amRes, reqRes] = await Promise.all([
      supabase
        .from('enterprise_account_managers')
        .select('*')
        .eq('owner_user_id', user.id)
        .maybeSingle(),
      supabase
        .from('enterprise_concierge_requests')
        .select('*')
        .eq('owner_user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20),
    ]);
    setAm((amRes.data as AccountManager) ?? null);
    setRequests((reqRes.data as ConciergeRequest[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [user]);

  const submit = async () => {
    if (!user) return;
    if (!form.subject.trim() || !form.message.trim()) {
      toast.error('Subject and message are required');
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from('enterprise_concierge_requests').insert({
      owner_user_id: user.id,
      subject: form.subject.trim().slice(0, 200),
      message: form.message.trim().slice(0, 4000),
      priority: form.priority,
    });
    setSubmitting(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success('Request submitted — your account manager has been notified.');
    setForm({ subject: '', message: '', priority: 'normal' });
    load();
  };

  const sla = SLA_MATRIX[form.priority] ?? SLA_MATRIX.normal;

  return (
    <div className="dark min-h-screen bg-gradient-to-br from-[#000000] via-[#050a18] to-[#030712] text-white">
      <Helmet>
        <title>Enterprise Concierge — Account Manager & SLA</title>
        <meta
          name="description"
          content="Reach your dedicated Kayla AI Enterprise account manager and submit SLA-backed requests."
        />
      </Helmet>
      <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-6">
        <Link to="/business/dashboard">
          <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
          </Button>
        </Link>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#003366] to-[#FFB300] flex items-center justify-center">
            <ShieldCheck className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Enterprise Concierge</h1>
            <p className="text-sm text-slate-400">
              Your dedicated account manager and SLA-backed support
            </p>
          </div>
        </div>

        {/* SLA Card — always visible */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Clock className="h-4 w-4 text-amber-300" /> Enterprise SLA
            </CardTitle>
            <CardDescription className="text-slate-400">
              Response and resolution targets for every request you submit below.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-4 gap-3 text-sm">
              {(['urgent', 'high', 'normal', 'low'] as const).map((p) => (
                <div
                  key={p}
                  className="p-3 rounded border border-white/10 bg-black/30"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold capitalize">{p}</span>
                    <Badge
                      variant="outline"
                      className={
                        p === 'urgent'
                          ? 'border-red-500 text-red-400'
                          : p === 'high'
                          ? 'border-amber-500 text-amber-300'
                          : p === 'normal'
                          ? 'border-sky-500 text-sky-300'
                          : 'border-slate-500 text-slate-300'
                      }
                    >
                      {p === 'urgent' ? 'P1' : p === 'high' ? 'P2' : p === 'normal' ? 'P3' : 'P4'}
                    </Badge>
                  </div>
                  <div className="text-xs text-slate-400">
                    First response: <span className="text-slate-200">{SLA_MATRIX[p].firstResponse}</span>
                  </div>
                  <div className="text-xs text-slate-400">
                    Resolution: <span className="text-slate-200">{SLA_MATRIX[p].resolution}</span>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-500 mt-3">
              99.9% uptime guarantee. Service credits issued automatically when SLA is missed. Full
              terms in your Enterprise Master Service Agreement.
            </p>
          </CardContent>
        </Card>

        {/* Account Manager Card */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <UserCircle className="h-4 w-4 text-amber-300" /> Your Dedicated Account Manager
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center gap-2 text-slate-400">
                <Loader2 className="h-4 w-4 animate-spin" /> Loading…
              </div>
            ) : am ? (
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                {am.manager_photo_url ? (
                  <img
                    src={am.manager_photo_url}
                    alt={am.manager_name}
                    className="w-20 h-20 rounded-full object-cover border border-white/20"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#003366] to-[#FFB300] flex items-center justify-center text-2xl font-bold">
                    {am.manager_name.charAt(0)}
                  </div>
                )}
                <div className="flex-1 space-y-1">
                  <div className="text-lg font-semibold">{am.manager_name}</div>
                  {am.manager_timezone && (
                    <div className="text-xs text-slate-400">Timezone: {am.manager_timezone}</div>
                  )}
                  <div className="flex flex-wrap gap-3 mt-2">
                    <a
                      href={`mailto:${am.manager_email}`}
                      className="text-sm text-amber-300 hover:underline flex items-center gap-1"
                    >
                      <Mail className="h-4 w-4" /> {am.manager_email}
                    </a>
                    {am.manager_phone && (
                      <a
                        href={`tel:${am.manager_phone}`}
                        className="text-sm text-amber-300 hover:underline flex items-center gap-1"
                      >
                        <Phone className="h-4 w-4" /> {am.manager_phone}
                      </a>
                    )}
                    {am.calendly_url && (
                      <a
                        href={am.calendly_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm text-amber-300 hover:underline flex items-center gap-1"
                      >
                        <Calendar className="h-4 w-4" /> Book a call
                      </a>
                    )}
                  </div>
                  {am.notes && (
                    <p className="text-xs text-slate-400 mt-2 italic">{am.notes}</p>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-slate-300 text-sm">
                  Your dedicated account manager will be assigned within 1 business day of activating
                  your Enterprise plan. In the meantime, our concierge team handles every request you
                  submit below.
                </p>
                <div className="flex gap-3">
                  <a href="mailto:concierge@1325.ai">
                    <Button variant="outline" className="border-white/20 text-slate-200 hover:bg-white/10">
                      <Mail className="h-4 w-4 mr-2" /> concierge@1325.ai
                    </Button>
                  </a>
                  <Link to="/contact">
                    <Button className="bg-gradient-to-r from-[#003366] to-[#FFB300] text-white">
                      Request priority assignment
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Submit Request */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Submit a Request</CardTitle>
            <CardDescription className="text-slate-400">
              SLA timer starts the moment you submit. Targets shown below.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-slate-200">Subject</Label>
              <Input
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                placeholder="Brief summary"
                maxLength={200}
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-slate-200">Priority</Label>
                <Select
                  value={form.priority}
                  onValueChange={(v) => setForm({ ...form, priority: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="urgent">Urgent (P1)</SelectItem>
                    <SelectItem value="high">High (P2)</SelectItem>
                    <SelectItem value="normal">Normal (P3)</SelectItem>
                    <SelectItem value="low">Low (P4)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <div className="text-xs text-slate-400 leading-relaxed">
                  Target response: <span className="text-slate-200">{sla.firstResponse}</span>
                  <br />
                  Target resolution: <span className="text-slate-200">{sla.resolution}</span>
                </div>
              </div>
            </div>
            <div>
              <Label className="text-slate-200">Message</Label>
              <Textarea
                rows={5}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Describe what you need…"
                maxLength={4000}
              />
            </div>
            <Button
              onClick={submit}
              disabled={submitting}
              className="bg-gradient-to-r from-[#003366] to-[#FFB300] text-white"
            >
              {submitting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
              Submit Request
            </Button>
          </CardContent>
        </Card>

        {/* Recent Requests */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Recent Requests</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-slate-400 text-sm flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" /> Loading…
              </div>
            ) : requests.length === 0 ? (
              <p className="text-slate-400 text-sm">No requests yet.</p>
            ) : (
              <div className="space-y-2">
                {requests.map((r) => (
                  <div
                    key={r.id}
                    className="p-3 rounded border border-white/10 bg-black/30 flex items-start justify-between gap-3"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium truncate">{r.subject}</span>
                        <Badge variant="outline" className="text-xs capitalize border-white/20">
                          {r.priority}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2">{r.message}</p>
                      <p className="text-xs text-slate-500 mt-1">
                        {new Date(r.created_at).toLocaleString()}
                      </p>
                    </div>
                    <Badge
                      className={
                        r.status === 'resolved' || r.status === 'closed'
                          ? 'bg-green-500/20 text-green-300 border-green-500/40'
                          : r.status === 'in_progress'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          : 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                      }
                    >
                      {r.status === 'resolved' || r.status === 'closed' ? (
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                      ) : null}
                      {r.status.replace('_', ' ')}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
