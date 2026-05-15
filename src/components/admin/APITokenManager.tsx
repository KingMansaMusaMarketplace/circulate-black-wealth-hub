import React, { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Key, Plus, Trash2, Copy, RefreshCw, AlertTriangle, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

const SCOPE_OPTIONS = [
  'read:businesses', 'read:listings', 'read:loyalty', 'read:profiles',
  'read:analytics', 'write:webhooks', 'admin:full',
];

interface TokenRow {
  id: string;
  name: string;
  description: string | null;
  token_prefix: string;
  scopes: string[];
  last_used_at: string | null;
  last_used_ip: string | null;
  expires_at: string | null;
  revoked_at: string | null;
  use_count: number;
  created_at: string;
}

const APITokenManager: React.FC = () => {
  const [rows, setRows] = useState<TokenRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [scopes, setScopes] = useState<string[]>([]);
  const [expiresInDays, setExpiresInDays] = useState('90');
  const [creating, setCreating] = useState(false);
  const [newToken, setNewToken] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from('admin_api_tokens').select('*')
      .order('created_at', { ascending: false }).limit(100);
    if (error) toast.error(error.message);
    setRows((data || []) as TokenRow[]);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const resetForm = () => { setName(''); setDescription(''); setScopes([]); setExpiresInDays('90'); };

  const toggleScope = (s: string) => {
    setScopes((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]);
  };

  const createToken = async () => {
    if (!name.trim() || scopes.length === 0) { toast.error('Name and at least one scope required'); return; }
    setCreating(true);
    try {
      const { data, error } = await supabase.functions.invoke('admin-create-api-token', {
        body: {
          name: name.trim(),
          description: description.trim() || null,
          scopes,
          expires_in_days: Number(expiresInDays) || 0,
        },
      });
      if (error) throw error;
      const token = (data as { token?: string })?.token;
      if (!token) throw new Error('No token returned');
      setNewToken(token);
      resetForm();
      load();
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setCreating(false);
    }
  };

  const revokeToken = async (id: string) => {
    if (!confirm('Revoke this token? It cannot be undone.')) return;
    const { error } = await supabase.from('admin_api_tokens').update({ revoked_at: new Date().toISOString() }).eq('id', id);
    if (error) { toast.error(error.message); return; }
    toast.success('Token revoked'); load();
  };

  const deleteToken = async (id: string) => {
    if (!confirm('Permanently delete this token record?')) return;
    const { error } = await supabase.from('admin_api_tokens').delete().eq('id', id);
    if (error) { toast.error(error.message); return; }
    load();
  };

  const isExpired = (t: TokenRow) =>
    t.expires_at !== null && new Date(t.expires_at).getTime() < Date.now();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2"><Key className="h-5 w-5" /> API Token Manager</CardTitle>
          <CardDescription>Issue scoped tokens for external integrations. Tokens are shown once.</CardDescription>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={load} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </Button>
          <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) { resetForm(); setNewToken(null); } }}>
            <DialogTrigger asChild><Button size="sm"><Plus className="h-4 w-4 mr-2" /> New Token</Button></DialogTrigger>
            <DialogContent className="max-w-lg">
              {newToken ? (
                <>
                  <DialogHeader>
                    <DialogTitle>Token Created</DialogTitle>
                    <DialogDescription>Copy this token now — it will not be shown again.</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-3">
                    <div className="rounded border bg-muted p-3 font-mono text-xs break-all">{newToken}</div>
                    <Button onClick={() => { navigator.clipboard.writeText(newToken); toast.success('Copied'); }}>
                      <Copy className="h-4 w-4 mr-2" /> Copy to clipboard
                    </Button>
                    <div className="flex items-start gap-2 rounded bg-yellow-500/10 border border-yellow-500/30 p-3 text-xs">
                      <AlertTriangle className="h-4 w-4 shrink-0 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                      <span>Store this securely. We only keep its hash — once you close this dialog, we cannot show it again.</span>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={() => { setDialogOpen(false); setNewToken(null); }}>Done</Button>
                  </DialogFooter>
                </>
              ) : (
                <>
                  <DialogHeader>
                    <DialogTitle>Create API Token</DialogTitle>
                    <DialogDescription>Give it a clear name and only the scopes it needs.</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-3">
                    <Input placeholder="Token name (e.g. Partner CRM)" value={name} onChange={(e) => setName(e.target.value)} />
                    <Textarea placeholder="Description (optional)" value={description} onChange={(e) => setDescription(e.target.value)} rows={2} />
                    <div>
                      <div className="text-xs font-medium mb-2">Scopes</div>
                      <div className="grid grid-cols-2 gap-2 rounded border p-2">
                        {SCOPE_OPTIONS.map((s) => (
                          <label key={s} className="flex items-center gap-2 text-xs">
                            <input type="checkbox" checked={scopes.includes(s)} onChange={() => toggleScope(s)} />
                            <code>{s}</code>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-medium mb-1">Expires in (days, 0 = never)</div>
                      <Input type="number" min="0" max="3650" value={expiresInDays} onChange={(e) => setExpiresInDays(e.target.value)} />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="ghost" onClick={() => setDialogOpen(false)}>Cancel</Button>
                    <Button onClick={createToken} disabled={creating}>
                      {creating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />} Generate
                    </Button>
                  </DialogFooter>
                </>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {rows.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground text-sm">No tokens yet.</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Prefix</TableHead>
                <TableHead>Scopes</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Used</TableHead>
                <TableHead>Expires</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((t) => {
                const expired = isExpired(t);
                const revoked = !!t.revoked_at;
                return (
                  <TableRow key={t.id}>
                    <TableCell className="text-sm font-medium">
                      {t.name}
                      {t.description && <div className="text-xs text-muted-foreground truncate max-w-[200px]">{t.description}</div>}
                    </TableCell>
                    <TableCell className="text-xs font-mono">{t.token_prefix}…</TableCell>
                    <TableCell className="text-xs">
                      <div className="flex flex-wrap gap-1">
                        {t.scopes.slice(0, 3).map((s) => <Badge key={s} variant="outline" className="text-[10px]">{s}</Badge>)}
                        {t.scopes.length > 3 && <Badge variant="outline" className="text-[10px]">+{t.scopes.length - 3}</Badge>}
                      </div>
                    </TableCell>
                    <TableCell>
                      {revoked ? <Badge variant="destructive">Revoked</Badge>
                        : expired ? <Badge variant="outline">Expired</Badge>
                        : <Badge variant="default">Active</Badge>}
                    </TableCell>
                    <TableCell className="text-xs">
                      {t.last_used_at ? format(new Date(t.last_used_at), 'MMM d, p') : 'Never'}
                      {t.use_count > 0 && <div className="text-muted-foreground">{t.use_count} uses</div>}
                    </TableCell>
                    <TableCell className="text-xs">
                      {t.expires_at ? format(new Date(t.expires_at), 'MMM d, yyyy') : 'Never'}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        {!revoked && (
                          <Button variant="ghost" size="sm" onClick={() => revokeToken(t.id)}>Revoke</Button>
                        )}
                        <Button variant="ghost" size="sm" onClick={() => deleteToken(t.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
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
  );
};

export default APITokenManager;
