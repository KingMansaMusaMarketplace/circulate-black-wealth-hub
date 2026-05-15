import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Megaphone, Plus, Pencil, Trash2, AlertCircle, CheckCircle, Info, AlertTriangle, Users, Target } from 'lucide-react';
import { format } from 'date-fns';

interface TargetFilters {
  user_type?: string;          // 'customer' | 'business' | 'agent'
  subscription_tier?: string;  // 'free' | 'founding' | 'premium'
  city?: string;
  state?: string;
  is_founding_member?: boolean;
  is_hbcu_member?: boolean;
  signed_up_within_days?: number;
}

interface Announcement {
  id: string;
  title: string;
  message: string;
  announcement_type: string;
  target_audience: string;
  target_filters: TargetFilters | null;
  priority: number;
  is_active: boolean;
  starts_at: string;
  expires_at: string | null;
  created_at: string;
}

const typeConfig: Record<string, { icon: React.ElementType; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  info: { icon: Info, variant: 'secondary' },
  warning: { icon: AlertTriangle, variant: 'outline' },
  alert: { icon: AlertCircle, variant: 'destructive' },
  success: { icon: CheckCircle, variant: 'default' },
};

const ANY = '__any__';

const buildAudienceQuery = (filters: TargetFilters) => {
  let q = supabase.from('profiles').select('id', { count: 'exact', head: true });
  if (filters.user_type) q = q.eq('user_type', filters.user_type);
  if (filters.subscription_tier) q = q.eq('subscription_tier', filters.subscription_tier);
  if (filters.city) q = q.ilike('city', filters.city);
  if (filters.state) q = q.ilike('state', filters.state);
  if (filters.is_founding_member) q = q.eq('is_founding_member', true);
  if (filters.is_hbcu_member) q = q.eq('is_hbcu_member', true);
  if (filters.signed_up_within_days && filters.signed_up_within_days > 0) {
    const since = new Date(Date.now() - filters.signed_up_within_days * 86400000).toISOString();
    q = q.gte('created_at', since);
  }
  return q;
};

const summarizeFilters = (f: TargetFilters | null) => {
  if (!f || Object.keys(f).length === 0) return 'No filters';
  const parts: string[] = [];
  if (f.user_type) parts.push(f.user_type);
  if (f.subscription_tier) parts.push(`tier: ${f.subscription_tier}`);
  if (f.city) parts.push(`city: ${f.city}`);
  if (f.state) parts.push(`state: ${f.state}`);
  if (f.is_founding_member) parts.push('founding');
  if (f.is_hbcu_member) parts.push('HBCU');
  if (f.signed_up_within_days) parts.push(`<${f.signed_up_within_days}d new`);
  return parts.join(' · ') || 'No filters';
};

const BroadcastAnnouncements: React.FC = () => {
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);

  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [announcementType, setAnnouncementType] = useState('info');
  const [targetAudience, setTargetAudience] = useState('all');
  const [filters, setFilters] = useState<TargetFilters>({});
  const [priority, setPriority] = useState(0);
  const [startsAt, setStartsAt] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [audienceCount, setAudienceCount] = useState<number | null>(null);
  const [estimating, setEstimating] = useState(false);

  const fetchAnnouncements = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('broadcast_announcements')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) toast.error('Failed to load announcements');
    else setAnnouncements((data as Announcement[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchAnnouncements(); }, []);

  const resetForm = () => {
    setTitle(''); setMessage(''); setAnnouncementType('info');
    setTargetAudience('all'); setFilters({}); setPriority(0);
    setStartsAt(''); setExpiresAt(''); setEditingAnnouncement(null);
    setAudienceCount(null);
  };

  const openEditDialog = (a: Announcement) => {
    setEditingAnnouncement(a);
    setTitle(a.title); setMessage(a.message);
    setAnnouncementType(a.announcement_type);
    setTargetAudience(a.target_audience);
    setFilters(a.target_filters ?? {});
    setPriority(a.priority);
    setStartsAt(a.starts_at.slice(0, 16));
    setExpiresAt(a.expires_at?.slice(0, 16) || '');
    setAudienceCount(null);
    setDialogOpen(true);
  };

  const estimateAudience = useCallback(async () => {
    setEstimating(true);
    try {
      const { count, error } = await buildAudienceQuery(filters);
      if (error) throw error;
      setAudienceCount(count ?? 0);
    } catch (e: any) {
      toast.error(e.message ?? 'Could not estimate audience');
    } finally {
      setEstimating(false);
    }
  }, [filters]);

  const handleSave = async () => {
    if (!title || !message) {
      toast.error('Please fill in title and message');
      return;
    }
    const payload = {
      title, message,
      announcement_type: announcementType,
      target_audience: targetAudience,
      target_filters: filters,
      priority,
      starts_at: startsAt || new Date().toISOString(),
      expires_at: expiresAt || null,
      created_by: user?.id,
    };
    const op = editingAnnouncement
      ? supabase.from('broadcast_announcements').update(payload).eq('id', editingAnnouncement.id)
      : supabase.from('broadcast_announcements').insert(payload);
    const { error } = await op;
    if (error) toast.error('Failed to save announcement');
    else {
      toast.success(editingAnnouncement ? 'Updated' : 'Created');
      setDialogOpen(false); resetForm(); fetchAnnouncements();
    }
  };

  const toggleActive = async (a: Announcement) => {
    const { error } = await supabase
      .from('broadcast_announcements')
      .update({ is_active: !a.is_active })
      .eq('id', a.id);
    if (error) toast.error('Failed to update');
    else { toast.success(a.is_active ? 'Deactivated' : 'Activated'); fetchAnnouncements(); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this announcement?')) return;
    const { error } = await supabase.from('broadcast_announcements').delete().eq('id', id);
    if (error) toast.error('Failed to delete');
    else { toast.success('Deleted'); fetchAnnouncements(); }
  };

  const setF = (patch: Partial<TargetFilters>) => {
    setFilters((p) => ({ ...p, ...patch }));
    setAudienceCount(null);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Megaphone className="h-5 w-5" /> Broadcast Announcements
              </CardTitle>
              <CardDescription>Target by tier, location, founding/HBCU status, signup recency</CardDescription>
            </div>
            <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
              <DialogTrigger asChild>
                <Button><Plus className="h-4 w-4 mr-2" />New Announcement</Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editingAnnouncement ? 'Edit' : 'Create'} Announcement</DialogTitle>
                  <DialogDescription>Use filters to narrow down who sees this announcement.</DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Title</label>
                    <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Message</label>
                    <Textarea rows={3} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Message" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Type</label>
                      <Select value={announcementType} onValueChange={setAnnouncementType}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="info">Info</SelectItem>
                          <SelectItem value="warning">Warning</SelectItem>
                          <SelectItem value="alert">Alert</SelectItem>
                          <SelectItem value="success">Success</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Audience Label</label>
                      <Select value={targetAudience} onValueChange={setTargetAudience}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Users</SelectItem>
                          <SelectItem value="customers">Customers</SelectItem>
                          <SelectItem value="businesses">Businesses</SelectItem>
                          <SelectItem value="agents">Sales Agents</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="rounded-lg border border-mansagold/30 bg-mansagold/5 p-4 space-y-3">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <Target className="h-4 w-4 text-mansagold" /> Targeting Filters
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-white/60">User Type</label>
                        <Select value={filters.user_type ?? ANY} onValueChange={(v) => setF({ user_type: v === ANY ? undefined : v })}>
                          <SelectTrigger><SelectValue placeholder="Any" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value={ANY}>Any</SelectItem>
                            <SelectItem value="customer">Customer</SelectItem>
                            <SelectItem value="business">Business</SelectItem>
                            <SelectItem value="agent">Agent</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-xs text-white/60">Subscription Tier</label>
                        <Select value={filters.subscription_tier ?? ANY} onValueChange={(v) => setF({ subscription_tier: v === ANY ? undefined : v })}>
                          <SelectTrigger><SelectValue placeholder="Any" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value={ANY}>Any</SelectItem>
                            <SelectItem value="free">Free</SelectItem>
                            <SelectItem value="founding">Founding</SelectItem>
                            <SelectItem value="premium">Premium</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-xs text-white/60">City</label>
                        <Input value={filters.city ?? ''} onChange={(e) => setF({ city: e.target.value || undefined })} placeholder="e.g. Chicago" />
                      </div>
                      <div>
                        <label className="text-xs text-white/60">State</label>
                        <Input value={filters.state ?? ''} onChange={(e) => setF({ state: e.target.value || undefined })} placeholder="e.g. IL" />
                      </div>
                      <div>
                        <label className="text-xs text-white/60">Signed up within (days)</label>
                        <Input type="number" min={0} value={filters.signed_up_within_days ?? ''} onChange={(e) => setF({ signed_up_within_days: e.target.value ? Number(e.target.value) : undefined })} />
                      </div>
                      <div className="flex flex-col justify-end gap-2">
                        <label className="flex items-center gap-2 text-xs">
                          <Switch checked={!!filters.is_founding_member} onCheckedChange={(v) => setF({ is_founding_member: v || undefined })} />
                          Founding members only
                        </label>
                        <label className="flex items-center gap-2 text-xs">
                          <Switch checked={!!filters.is_hbcu_member} onCheckedChange={(v) => setF({ is_hbcu_member: v || undefined })} />
                          HBCU members only
                        </label>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-white/10">
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="h-4 w-4 text-mansagold" />
                        Estimated reach: <span className="font-bold text-mansagold">{audienceCount ?? '—'}</span>
                      </div>
                      <Button variant="outline" size="sm" onClick={estimateAudience} disabled={estimating}>
                        {estimating ? 'Counting…' : 'Estimate Audience'}
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs text-white/60">Priority (0-10)</label>
                      <Input type="number" min={0} max={10} value={priority} onChange={(e) => setPriority(Number(e.target.value))} />
                    </div>
                    <div>
                      <label className="text-xs text-white/60">Starts At</label>
                      <Input type="datetime-local" value={startsAt} onChange={(e) => setStartsAt(e.target.value)} />
                    </div>
                    <div>
                      <label className="text-xs text-white/60">Expires At</label>
                      <Input type="datetime-local" value={expiresAt} onChange={(e) => setExpiresAt(e.target.value)} />
                    </div>
                  </div>
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleSave}>{editingAnnouncement ? 'Update' : 'Create'}</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">Loading...</div>
          ) : announcements.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No announcements yet.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Targeting</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Schedule</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {announcements.map((a) => {
                  const config = typeConfig[a.announcement_type] || typeConfig.info;
                  const Icon = config.icon;
                  const isExpired = a.expires_at && new Date(a.expires_at) < new Date();
                  const isScheduled = new Date(a.starts_at) > new Date();
                  return (
                    <TableRow key={a.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          <div>
                            <div className="font-medium">{a.title}</div>
                            <div className="text-xs text-muted-foreground truncate max-w-xs">{a.message}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell><Badge variant={config.variant}>{a.announcement_type}</Badge></TableCell>
                      <TableCell>
                        <div className="text-xs">
                          <Badge variant="outline" className="mr-1">{a.target_audience}</Badge>
                          <div className="text-muted-foreground mt-1">{summarizeFilters(a.target_filters)}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Switch checked={a.is_active} onCheckedChange={() => toggleActive(a)} />
                          {isExpired && <Badge variant="destructive">Expired</Badge>}
                          {isScheduled && <Badge variant="secondary">Scheduled</Badge>}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-xs">
                          <div>From: {format(new Date(a.starts_at), 'MMM d, HH:mm')}</div>
                          {a.expires_at && <div>To: {format(new Date(a.expires_at), 'MMM d, HH:mm')}</div>}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="icon" onClick={() => openEditDialog(a)}><Pencil className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(a.id)}><Trash2 className="h-4 w-4" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BroadcastAnnouncements;
