import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Database, Download, Loader2, Plus, Trash2, RefreshCw, Shield, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';

const AVAILABLE_TABLES = [
  'profiles',
  'businesses',
  'business_listings',
  'loyalty_points',
  'qr_scans',
  'broadcast_announcements',
  'user_roles',
  'subscriptions',
  'investor_access_log',
  'nda_signatures',
  'security_audit_log',
];

interface BackupRow {
  id: string;
  created_by: string | null;
  status: string;
  backup_type: string;
  tables_included: string[];
  row_counts: Record<string, number>;
  size_bytes: number | null;
  storage_path: string | null;
  error_message: string | null;
  notes: string | null;
  started_at: string;
  completed_at: string | null;
  created_at: string;
}

const statusVariant = (s: string): 'default' | 'secondary' | 'destructive' | 'outline' => {
  if (s === 'completed') return 'default';
  if (s === 'failed') return 'destructive';
  if (s === 'running' || s === 'pending') return 'secondary';
  return 'outline';
};

const formatBytes = (n: number | null) => {
  if (!n) return '—';
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1024 / 1024).toFixed(2)} MB`;
};

const BackupRestorePanel: React.FC = () => {
  const [rows, setRows] = useState<BackupRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTables, setSelectedTables] = useState<string[]>(AVAILABLE_TABLES);
  const [notes, setNotes] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('admin_backups')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);
    if (error) toast.error(`Failed to load backups: ${error.message}`);
    setRows((data || []) as BackupRow[]);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const toggleTable = (t: string) => {
    setSelectedTables((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t],
    );
  };

  const createBackup = async () => {
    if (selectedTables.length === 0) {
      toast.error('Select at least one table');
      return;
    }
    setCreating(true);
    try {
      const { error } = await supabase.functions.invoke('admin-backup-create', {
        body: { tables: selectedTables, notes: notes.trim() || null },
      });
      if (error) throw error;
      toast.success('Backup created successfully');
      setDialogOpen(false);
      setNotes('');
      load();
    } catch (e) {
      toast.error(`Backup failed: ${(e as Error).message}`);
    } finally {
      setCreating(false);
    }
  };

  const downloadBackup = async (id: string) => {
    setDownloadingId(id);
    try {
      const { data, error } = await supabase.functions.invoke('admin-backup-download', {
        body: { backup_id: id },
      });
      if (error) throw error;
      const url = (data as { url?: string })?.url;
      if (!url) throw new Error('No signed URL returned');
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch (e) {
      toast.error(`Download failed: ${(e as Error).message}`);
    } finally {
      setDownloadingId(null);
    }
  };

  const deleteBackup = async (row: BackupRow) => {
    if (!confirm('Delete this backup? This removes the database record and the file.')) return;
    try {
      if (row.storage_path) {
        await supabase.storage.from('admin-backups').remove([row.storage_path]);
      }
      const { error } = await supabase.from('admin_backups').delete().eq('id', row.id);
      if (error) throw error;
      toast.success('Backup deleted');
      load();
    } catch (e) {
      toast.error(`Delete failed: ${(e as Error).message}`);
    }
  };

  const completed = rows.filter((r) => r.status === 'completed').length;
  const totalBytes = rows.reduce((acc, r) => acc + (r.size_bytes || 0), 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Backups</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rows.length}</div>
            <p className="text-xs text-muted-foreground">{completed} completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Storage</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatBytes(totalBytes)}</div>
            <p className="text-xs text-muted-foreground">across all backups</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Last Backup</CardTitle>
            <RefreshCw className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">
              {rows[0] ? format(new Date(rows[0].created_at), 'MMM d, p') : '—'}
            </div>
            <p className="text-xs text-muted-foreground">
              {rows[0]?.status || 'no backups yet'}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Backup History</CardTitle>
            <CardDescription>Manual snapshots of selected database tables.</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={load} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  New Backup
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>Create Backup</DialogTitle>
                  <DialogDescription>
                    Select tables to include. The snapshot is stored privately and only admins can access it.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto rounded border p-3">
                    {AVAILABLE_TABLES.map((t) => (
                      <label key={t} className="flex items-center gap-2 text-sm">
                        <Checkbox
                          checked={selectedTables.includes(t)}
                          onCheckedChange={() => toggleTable(t)}
                        />
                        <span className="font-mono text-xs">{t}</span>
                      </label>
                    ))}
                  </div>
                  <Textarea
                    placeholder="Notes (optional)"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    maxLength={500}
                    rows={2}
                  />
                  <div className="flex items-start gap-2 rounded bg-yellow-500/10 border border-yellow-500/30 p-3 text-xs">
                    <AlertTriangle className="h-4 w-4 shrink-0 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                    <span>Each table is capped at 50,000 rows per backup. Larger tables will be truncated.</span>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="ghost" onClick={() => setDialogOpen(false)}>Cancel</Button>
                  <Button onClick={createBackup} disabled={creating}>
                    {creating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    Create Backup
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-12 text-center text-muted-foreground">
              <Loader2 className="h-6 w-6 animate-spin mx-auto" />
            </div>
          ) : rows.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              No backups yet. Click "New Backup" to create one.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Created</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Tables</TableHead>
                  <TableHead>Rows</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((r) => {
                  const totalRows = Object.values(r.row_counts || {}).reduce((a, b) => a + b, 0);
                  return (
                    <TableRow key={r.id}>
                      <TableCell className="whitespace-nowrap text-xs">
                        {format(new Date(r.created_at), 'MMM d, yyyy p')}
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusVariant(r.status)}>{r.status}</Badge>
                        {r.error_message && (
                          <div className="text-xs text-destructive mt-1 max-w-[200px] truncate" title={r.error_message}>
                            {r.error_message}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-xs">{r.tables_included.length}</TableCell>
                      <TableCell className="text-xs">{totalRows.toLocaleString()}</TableCell>
                      <TableCell className="text-xs">{formatBytes(r.size_bytes)}</TableCell>
                      <TableCell className="text-xs max-w-[200px] truncate" title={r.notes || ''}>
                        {r.notes || '—'}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => downloadBackup(r.id)}
                            disabled={r.status !== 'completed' || downloadingId === r.id}
                          >
                            {downloadingId === r.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Download className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteBackup(r)}
                          >
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
    </div>
  );
};

export default BackupRestorePanel;
