import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ImageIcon, Loader2, RefreshCw, StopCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const STOCK_FILTER =
  'banner_url.ilike.%unsplash%,logo_url.ilike.%unsplash%,logo_url.ilike.%placehold%,banner_url.ilike.%placehold%,banner_url.ilike.%placeholder%,logo_url.ilike.%placeholder%,logo_url.is.null,banner_url.is.null';

const BATCH_SIZE = 20;

const PhotoBackfillCard: React.FC = () => {
  const [remaining, setRemaining] = useState<number | null>(null);
  const [running, setRunning] = useState(false);
  const [updated, setUpdated] = useState(0);
  const [processed, setProcessed] = useState(0);
  const [notFound, setNotFound] = useState(0);
  const stopRef = useRef(false);

  const loadRemaining = useCallback(async () => {
    const { count } = await supabase
      .from('businesses')
      .select('id', { count: 'exact', head: true })
      .not('website', 'is', null)
      .neq('website', '')
      .or(STOCK_FILTER);
    setRemaining(count ?? 0);
  }, []);

  useEffect(() => {
    loadRemaining();
  }, [loadRemaining]);

  const stop = () => {
    stopRef.current = true;
  };

  const run = async () => {
    setRunning(true);
    stopRef.current = false;
    setUpdated(0);
    setProcessed(0);
    setNotFound(0);

    const attempted = new Set<string>();
    let offset = 0;
    const MAX_BATCHES = 500;

    try {
      for (let i = 0; i < MAX_BATCHES && !stopRef.current; i++) {
        const { data: batch, error: batchErr } = await supabase
          .from('businesses')
          .select('id')
          .not('website', 'is', null)
          .neq('website', '')
          .or(STOCK_FILTER)
          .order('id', { ascending: true })
          .range(offset, offset + BATCH_SIZE - 1);

        if (batchErr) throw batchErr;
        if (!batch?.length) {
          toast.success('All listings with a website have been checked.');
          break;
        }

        // Never re-send a listing we already tried in this run
        const ids = batch.map((b: any) => b.id).filter((id: string) => !attempted.has(id));
        if (!ids.length) {
          offset += BATCH_SIZE;
          continue;
        }
        ids.forEach((id: string) => attempted.add(id));

        const { data, error } = await supabase.functions.invoke('bulk-refresh-business-branding', {
          body: { ids },
        });
        if (error) throw error;

        const results: any[] = data?.results ?? [];
        const updatedCount = results.filter((r) => r.status === 'updated').length;
        setProcessed((p) => p + results.length);
        setUpdated((u) => u + updatedCount);
        setNotFound((n) => n + (results.length - updatedCount));

        // Rows we couldn't fix still match the filter, so step past them
        offset += ids.length - updatedCount;

        if (i === MAX_BATCHES - 1) {
          toast.info('Reached this run\'s safety limit. Press "Pull real photos" again to continue.');
        }
      }
    } catch (e: any) {
      toast.error(e?.message || 'Photo backfill failed');
    } finally {
      setRunning(false);
      stopRef.current = false;
      loadRemaining();
    }
  };

  const pct = processed > 0 && remaining ? Math.min(100, Math.round((processed / remaining) * 100)) : 0;


  return (
    <Card className="bg-slate-900/60 border-white/10">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <ImageIcon className="h-4 w-4 text-mansagold" /> Real Photo Backfill (already-approved listings)
        </CardTitle>
        <div className="flex items-center gap-2">
          {running ? (
            <Button size="sm" variant="destructive" onClick={stop}>
              <StopCircle className="h-4 w-4 mr-1" /> Stop
            </Button>
          ) : (
            <Button
              size="sm"
              variant="outline"
              onClick={run}
              className="border-white/10 text-white hover:bg-white/10"
            >
              <RefreshCw className="h-4 w-4 mr-1" /> Pull real photos
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3 text-sm text-white/70">
        <p>
          Visits each listing's own website and replaces stock/placeholder art with their real logo and banner.
          Listings with no usable image keep what they have.
        </p>
        <div className="flex flex-wrap gap-4">
          <span>
            Still on stock art:{' '}
            <strong className="text-white">{remaining === null ? '…' : remaining.toLocaleString()}</strong>
          </span>
          <span>
            Checked this run: <strong className="text-white">{processed.toLocaleString()}</strong>
          </span>
          <span>
            Real photos found: <strong className="text-emerald-400">{updated.toLocaleString()}</strong>
          </span>
          <span>
            Nothing usable: <strong className="text-white/60">{notFound.toLocaleString()}</strong>
          </span>
        </div>
        {running && (
          <div className="space-y-2">
            <Progress value={pct} className="h-2" />
            <p className="flex items-center gap-2 text-xs text-white/50">
              <Loader2 className="h-3 w-3 animate-spin" /> Working through listings in batches of {BATCH_SIZE}. You can
              leave this page open — press Stop any time.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PhotoBackfillCard;
