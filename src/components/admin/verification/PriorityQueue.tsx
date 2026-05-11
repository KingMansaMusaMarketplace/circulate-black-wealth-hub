import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, Zap, Clock, AlertTriangle, RefreshCw } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface PriorityRow {
  id: string;
  business_id: string;
  verification_status: string;
  priority_tier: string;
  priority_paid_at: string | null;
  priority_sla_deadline: string | null;
  created_at: string;
  business?: { business_name: string | null; email: string | null } | null;
}

const tierBadge = (tier: string) =>
  tier === 'same_day' ? (
    <Badge className="bg-mansagold text-black hover:bg-mansagold gap-1"><Zap className="h-3 w-3" />Same-Day</Badge>
  ) : (
    <Badge variant="secondary" className="gap-1"><Clock className="h-3 w-3" />Priority</Badge>
  );

const slaBadge = (deadline: string | null) => {
  if (!deadline) return <Badge variant="outline">—</Badge>;
  const d = new Date(deadline);
  const now = Date.now();
  const ms = d.getTime() - now;
  if (ms < 0) return <Badge variant="destructive" className="gap-1"><AlertTriangle className="h-3 w-3" />Breached</Badge>;
  if (ms < 60 * 60 * 1000) return <Badge className="bg-amber-500 hover:bg-amber-500 text-black">{`Due in ${Math.round(ms / 60000)}m`}</Badge>;
  return <Badge variant="outline">{`Due ${formatDistanceToNow(d, { addSuffix: true })}`}</Badge>;
};

const PriorityQueue: React.FC = () => {
  const [rows, setRows] = useState<PriorityRow[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('business_verifications')
      .select('id, business_id, verification_status, priority_tier, priority_paid_at, priority_sla_deadline, created_at, businesses!business_verifications_business_id_fkey(business_name, email)')
      .neq('priority_tier', 'standard')
      .eq('verification_status', 'pending')
      .order('priority_sla_deadline', { ascending: true, nullsFirst: false });
    setRows(((data ?? []) as any[]).map((r) => ({ ...r, business: r.businesses })));
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-mansagold" /> Priority Queue
        </CardTitle>
        <Button variant="outline" size="sm" onClick={load} disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center p-8"><Loader2 className="h-6 w-6 animate-spin" /></div>
        ) : rows.length === 0 ? (
          <p className="text-sm text-muted-foreground p-4 text-center">No priority verifications waiting.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Business</TableHead>
                <TableHead>Tier</TableHead>
                <TableHead>SLA</TableHead>
                <TableHead>Paid</TableHead>
                <TableHead>Submitted</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.id} className={r.priority_sla_deadline && new Date(r.priority_sla_deadline) < new Date() ? 'bg-destructive/5' : ''}>
                  <TableCell>
                    <div className="font-medium">{r.business?.business_name ?? r.business_id.slice(0, 8)}</div>
                    <div className="text-xs text-muted-foreground">{r.business?.email}</div>
                  </TableCell>
                  <TableCell>{tierBadge(r.priority_tier)}</TableCell>
                  <TableCell>{slaBadge(r.priority_sla_deadline)}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {r.priority_paid_at ? formatDistanceToNow(new Date(r.priority_paid_at), { addSuffix: true }) : '—'}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(r.created_at), { addSuffix: true })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default PriorityQueue;
