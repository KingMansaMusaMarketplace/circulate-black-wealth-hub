import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, Search, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface Props {
  lists: string[];
  activeList: string;
  onDone?: () => void;
}

interface RunResult {
  processed: number;
  updated: number;
  emails_found: number;
  names_found: number;
  phones_found: number;
  failed: number;
}

/**
 * Kayla's contact-finder robot for the Outreach CRM.
 * Scrapes each organization's website and fills in missing owner name,
 * email and phone — never overwriting what's already there.
 */
const OutreachContactFinder: React.FC<Props> = ({ lists, activeList, onDone }) => {
  const [running, setRunning] = useState(false);
  const [batch, setBatch] = useState('25');
  const [listName, setListName] = useState<string>(activeList === 'all' ? 'all' : activeList);
  const [last, setLast] = useState<RunResult | null>(null);

  const run = async () => {
    setRunning(true);
    setLast(null);
    try {
      const { data, error } = await supabase.functions.invoke('enrich-outreach-contacts', {
        body: {
          limit: Number(batch),
          ...(listName !== 'all' ? { list_name: listName } : {}),
        },
      });
      if (error) throw error;
      setLast(data as RunResult);
      const d = data as RunResult;
      toast.success(
        `Kayla checked ${d.processed} websites — found ${d.emails_found} emails, ${d.names_found} names, ${d.phones_found} phones.`
      );
      onDone?.();
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : 'Contact finder failed');
    } finally {
      setRunning(false);
    }
  };

  return (
    <Card className="bg-slate-800/60 backdrop-blur-xl border-mansagold/30">
      <CardHeader className="pb-3">
        <CardTitle className="text-base text-mansagold flex items-center gap-2">
          <Sparkles className="h-4 w-4" /> Kayla Contact Finder
        </CardTitle>
        <p className="text-sm text-blue-200/70">
          Kayla visits each organization's website and fills in the missing owner name, email
          address and phone number. She never overwrites anything you already have.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap items-end gap-3">
          <div className="space-y-1">
            <span className="text-xs text-blue-200/70">List</span>
            <Select value={listName} onValueChange={setListName}>
              <SelectTrigger className="w-[240px] bg-slate-900 border-white/20 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 text-white border-white/20">
                <SelectItem value="all">All lists</SelectItem>
                {lists.map((l) => (
                  <SelectItem key={l} value={l}>
                    {l}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <span className="text-xs text-blue-200/70">Organizations per run</span>
            <Select value={batch} onValueChange={setBatch}>
              <SelectTrigger className="w-[160px] bg-slate-900 border-white/20 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 text-white border-white/20">
                {['10', '25', '50'].map((n) => (
                  <SelectItem key={n} value={n}>
                    {n}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            onClick={run}
            disabled={running}
            className="bg-gradient-to-r from-mansagold to-amber-500 text-slate-900 font-semibold"
          >
            {running ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Kayla is researching…
              </>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" /> Find missing contacts
              </>
            )}
          </Button>
        </div>

        {last && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-center">
            {[
              ['Websites checked', last.processed],
              ['Records updated', last.updated],
              ['Emails found', last.emails_found],
              ['Names found', last.names_found],
              ['Phones found', last.phones_found],
            ].map(([label, value]) => (
              <div key={label as string} className="rounded-lg border border-white/10 bg-slate-900/60 p-3">
                <div className="text-xl font-bold text-white">{value as number}</div>
                <div className="text-[11px] text-blue-200/70 mt-1">{label as string}</div>
              </div>
            ))}
          </div>
        )}

        <p className="text-xs text-blue-200/50">
          Tip: run one list at a time. Each pass takes about a minute per 25 organizations, and you
          can run it as many times as you like — Kayla skips rows that are already complete.
        </p>
      </CardContent>
    </Card>
  );
};

export default OutreachContactFinder;
