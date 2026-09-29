import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { History, Loader2 } from 'lucide-react';

type Decision = {
  id: string;
  business_name: string | null;
  decision: string;
  reviewer_email: string | null;
  created_at: string;
};

const LABEL: Record<string, string> = { approved: 'Approved', rejected: 'Rejected', sent_back: 'Sent back', undone: 'Approval undone' };
const TONE: Record<string, string> = {
  approved: 'bg-green-500/20 text-green-300 border-green-500/40',
  rejected: 'bg-red-500/20 text-red-300 border-red-500/40',
  sent_back: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40',
};

/** Permanent record of review decisions. Reviewers see their own; admins see everyone's. */
export const ReviewDecisionsLog: React.FC<{ isAdmin: boolean; refreshKey?: number }> = ({ isAdmin, refreshKey }) => {
  const [rows, setRows] = useState<Decision[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data } = await (supabase as any)
        .from('review_decisions')
        .select('id,business_name,decision,reviewer_email,created_at')
        .order('created_at', { ascending: false })
        .limit(1000);
      setRows((data ?? []) as Decision[]);
      setLoading(false);
    })();
  }, [refreshKey]);

  const totals = rows.reduce<Record<string, Record<string, number>>>((acc, r) => {
    const who = r.reviewer_email || 'unknown';
    acc[who] ??= { approved: 0, rejected: 0, sent_back: 0 };
    acc[who][r.decision] = (acc[who][r.decision] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <Card className="bg-slate-900/60 border-white/10">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <History className="h-5 w-5 text-mansagold" />
          {isAdmin ? 'All review decisions' : 'My decisions'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <div className="flex items-center text-white/95"><Loader2 className="h-4 w-4 mr-2 animate-spin" />Loading…</div>
        ) : rows.length === 0 ? (
          <p className="text-white/95">No decisions recorded yet.</p>
        ) : (
          <>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {Object.entries(totals).map(([who, t]) => (
                <div key={who} className="rounded bg-black/30 p-3 text-sm">
                  <div className="text-white font-medium truncate">{who}</div>
                  <div className="text-white/95">
                    {t.approved} approved · {t.rejected} rejected · {t.sent_back} sent back
                  </div>
                </div>
              ))}
            </div>
            <div className="max-h-[420px] overflow-y-auto space-y-1 pr-1">
              {rows.map(r => (
                <div key={r.id} className="flex items-center gap-3 rounded bg-white/5 px-3 py-2 text-sm">
                  <Badge className={TONE[r.decision] ?? ''}>{LABEL[r.decision] ?? r.decision}</Badge>
                  <span className="text-white flex-1 truncate">{r.business_name}</span>
                  {isAdmin && <span className="text-white/95 truncate hidden sm:inline">{r.reviewer_email}</span>}
                  <span className="text-white/95 shrink-0">{new Date(r.created_at).toLocaleString()}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ReviewDecisionsLog;
