import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Row {
  agent_name: string;
  test_score: number | null;
  tests_run: number;
  last_tested: string | null;
  approvals: number;
  rejections: number;
  handoffs: number;
}

const FLAG_BELOW = 70;

/** Each Agentic AI Employee's own test score, owner approvals and teamwork. */
export const AgentScorecard: React.FC = () => {
  const [rows, setRows] = useState<Row[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (supabase as any).rpc('get_agent_scorecard').then(({ data, error }: any) => {
      if (error) setError(error.message);
      else setRows(data || []);
    });
  }, []);

  return (
    <Card className="bg-white/10 border-white/20 p-5 mt-8">
      <h2 className="text-lg font-bold text-white flex items-center gap-2">
        <Users className="h-5 w-5 text-mansagold" /> Each Agentic AI Employee's report card
      </h2>
      <p className="text-base text-white/80 mt-1 mb-4 max-w-2xl">
        Test score comes from each employee's own questions in the scoreboard run. Approvals and rejections come from real owners. Below {FLAG_BELOW} is flagged.
      </p>
      {error && <p className="text-white/70">{error}</p>}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-white">
          <thead className="text-white/60">
            <tr>
              <th className="py-2 pr-3">Employee</th>
              <th className="py-2 pr-3">Test score</th>
              <th className="py-2 pr-3">Owner approved</th>
              <th className="py-2 pr-3">Owner rejected</th>
              <th className="py-2 pr-3">Handoffs</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const low = r.test_score !== null && r.test_score < FLAG_BELOW;
              return (
                <tr key={r.agent_name} className="border-t border-white/10">
                  <td className="py-2 pr-3 font-semibold">{r.agent_name}</td>
                  <td className="py-2 pr-3">
                    {r.test_score === null ? <span className="text-white/50">Not tested yet</span> : (
                      <Badge className={low ? 'bg-destructive text-destructive-foreground' : 'bg-mansagold text-black'}>
                        {r.test_score}{low ? ' · needs work' : ''}
                      </Badge>
                    )}
                  </td>
                  <td className="py-2 pr-3">{r.approvals}</td>
                  <td className="py-2 pr-3">{r.rejections}</td>
                  <td className="py-2 pr-3">{r.handoffs}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default AgentScorecard;
