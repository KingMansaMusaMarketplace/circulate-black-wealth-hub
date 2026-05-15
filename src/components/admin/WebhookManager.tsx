import React, { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Plus, Trash2, Send, Webhook, RefreshCw, Copy, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

const EVENT_TYPES = [
  '*', 'business.created', 'business.verified', 'listing.published',
  'qr.scanned', 'subscription.created', 'subscription.cancelled',
  'user.signed_up', 'broadcast.published',
];

interface WebhookRow {
  id: string;
  name: string;
  url: string;
  event_types: string[];
  signing_secret: string;
  is_active: boolean;
  description: string | null;
  last_delivery_at: string | null;
  last_delivery_status: number | null;
  failure_count: number;
  created_at: string;
}

interface DeliveryRow {
  id: string;
  webhook_id: string;
  event_type: string;
  response_status: number | null;
  latency_ms: number | null;
  error_message: string | null;
  delivered_at: string;
}

const generateSecret = () => {
  const buf = new Uint8Array(24);
  crypto.getRandomValues(buf);
  return 'whsec_' + Array.from(buf).map((b) => b.toString(16).padStart(2, '0')).join('');
};

const WebhookManager: React.FC = () => {
  const [hooks, setHooks] = useState<WebhookRow[]>([]);
  const [deliveries, setDeliveries] = useState<DeliveryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [pingingId, setPingingId] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
  const [secret, setSecret] = useState(generateSecret());

  const load = useCallback(async () => {
    setLoading(true);
    const [{ data: h }, { data: d }] = await Promise.all([
      supabase.from('admin_webhooks').select('*').order('created_at', { ascending: false }),
      supabase.from('admin_webhook_deliveries').select('*').order('delivered_at', { ascending: false }).limit(50),
    ]);
    setHooks((h || []) as WebhookRow[]);
    setDeliveries((d || []) as DeliveryRow[]);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const resetForm = () => {
    setName(''); setUrl(''); setDescription(''); setSelectedEvents([]); setSecret(generateSecret());
  };

  const toggleEvent = (e: string) => {
    setSelectedEvents((prev) => prev.includes(e) ? prev.filter((x) => x !== e) : [...prev, e]);
  };

  const createHook = async () => {
    if (!name.trim() || !url.trim() || selectedEvents.length === 0) {
      toast.error('Name, URL and at least one event are required');
      return;
    }
    try {
      new URL(url);
    } catch {
      toast.error('Invalid URL');
      return;
    }
    const { error } = await supabase.from('admin_webhooks').insert({
      name: name.trim(), url: url.trim(), description: description.trim() || null,
      event_types: selectedEvents, signing_secret: secret, is_active: true,
    });
    if (error) { toast.error(error.message); return; }
    toast.success('Webhook created');
    setDialogOpen(false); resetForm(); load();
  };

  const toggleActive = async (h: WebhookRow) => {
    const { error } = await supabase.from('admin_webhooks').update({ is_active: !h.is_active }).eq('id', h.id);
    if (error) { toast.error(error.message); return; }
    load();
  };

  const deleteHook = async (id: string) => {
    if (!confirm('Delete this webhook? Delivery history will also be removed.')) return;
    const { error } = await supabase.from('admin_webhooks').delete().eq('id', id);
    if (error) { toast.error(error.message); return; }
    toast.success('Webhook deleted'); load();
  };

  const sendTest = async (id: string) => {
    setPingingId(id);
    try {
      const { data, error } = await supabase.functions.invoke('dispatch-webhook', {
        body: { event_type: 'webhook.test', webhook_id: id, payload: { hello: 'world', sent_at: new Date().toISOString() } },
      });
      if (error) throw error;
      const r = (data as any)?.results?.[0];
      if (r?.ok) toast.success(`Ping delivered (HTTP ${r.status}, ${r.latency_ms}ms)`);
      else toast.error(`Ping failed (HTTP ${r?.status ?? 'n/a'})`);
      load();
    } catch (e) {
      toast.error(`Ping failed: ${(e as Error).message}`);
    } finally {
      setPingingId(null);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2"><Webhook className="h-5 w-5" /> Webhook Manager</CardTitle>
          <CardDescription>Send platform events to your external systems with HMAC-signed payloads.</CardDescription>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={load} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </Button>
          <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) resetForm(); }}>
            <DialogTrigger asChild><Button size="sm"><Plus className="h-4 w-4 mr-2" /> New Webhook</Button></DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Create Webhook</DialogTitle>
                <DialogDescription>Choose which events trigger this endpoint.</DialogDescription>
              </DialogHeader>
              <div className="space-y-3">
                <Input placeholder="Name (e.g. Slack notifier)" value={name} onChange={(e) => setName(e.target.value)} />
                <Input placeholder="https://example.com/webhook" value={url} onChange={(e) => setUrl(e.target.value)} />
                <Textarea placeholder="Description (optional)" value={description} onChange={(e) => setDescription(e.target.value)} rows={2} />
                <div>
                  <div className="text-xs font-medium mb-2">Events</div>
                  <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto rounded border p-2">
                    {EVENT_TYPES.map((e) => (
                      <label key={e} className="flex items-center gap-2 text-xs">
                        <input type="checkbox" checked={selectedEvents.includes(e)} onChange={() => toggleEvent(e)} />
                        <code>{e}</code>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-medium mb-1">Signing secret (auto-generated)</div>
                  <div className="flex gap-2">
                    <Input value={secret} readOnly className="font-mono text-xs" />
                    <Button variant="outline" size="sm" onClick={() => { navigator.clipboard.writeText(secret); toast.success('Copied'); }}>
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="ghost" onClick={() => setDialogOpen(false)}>Cancel</Button>
                <Button onClick={createHook}>Create</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="endpoints">
          <TabsList>
            <TabsTrigger value="endpoints">Endpoints ({hooks.length})</TabsTrigger>
            <TabsTrigger value="deliveries">Recent Deliveries ({deliveries.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="endpoints" className="mt-4">
            {hooks.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground text-sm">No webhooks yet.</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>URL</TableHead>
                    <TableHead>Events</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Delivery</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {hooks.map((h) => (
                    <TableRow key={h.id}>
                      <TableCell className="text-sm font-medium">{h.name}</TableCell>
                      <TableCell className="text-xs font-mono max-w-[200px] truncate" title={h.url}>{h.url}</TableCell>
                      <TableCell className="text-xs">{h.event_types.length}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Switch checked={h.is_active} onCheckedChange={() => toggleActive(h)} />
                          {h.failure_count > 0 && <Badge variant="destructive" className="text-xs">{h.failure_count} fails</Badge>}
                        </div>
                      </TableCell>
                      <TableCell className="text-xs">
                        {h.last_delivery_at ? (
                          <div className="flex items-center gap-1">
                            {h.last_delivery_status && h.last_delivery_status >= 200 && h.last_delivery_status < 300
                              ? <CheckCircle className="h-3 w-3 text-emerald-500" />
                              : <XCircle className="h-3 w-3 text-destructive" />}
                            {format(new Date(h.last_delivery_at), 'MMM d, p')}
                          </div>
                        ) : '—'}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="sm" onClick={() => sendTest(h.id)} disabled={pingingId === h.id}>
                            {pingingId === h.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => deleteHook(h.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </TabsContent>

          <TabsContent value="deliveries" className="mt-4">
            {deliveries.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground text-sm">No deliveries yet.</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Time</TableHead>
                    <TableHead>Event</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Latency</TableHead>
                    <TableHead>Error</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {deliveries.map((d) => (
                    <TableRow key={d.id}>
                      <TableCell className="text-xs whitespace-nowrap">{format(new Date(d.delivered_at), 'MMM d, p')}</TableCell>
                      <TableCell className="text-xs"><code>{d.event_type}</code></TableCell>
                      <TableCell>
                        <Badge variant={d.response_status && d.response_status < 300 ? 'default' : 'destructive'}>
                          {d.response_status ?? 'err'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs">{d.latency_ms ?? '—'}ms</TableCell>
                      <TableCell className="text-xs max-w-[300px] truncate" title={d.error_message || ''}>{d.error_message || '—'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default WebhookManager;
