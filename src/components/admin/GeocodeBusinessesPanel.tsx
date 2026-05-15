import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { MapPin, Loader2 } from 'lucide-react';

interface GeocodeResult {
  scanned: number;
  updated: number;
  skipped_no_address: number;
  failed: number;
}

export const GeocodeBusinessesPanel: React.FC = () => {
  const [batchSize, setBatchSize] = useState(100);
  const [running, setRunning] = useState(false);
  const [last, setLast] = useState<GeocodeResult | null>(null);
  const [totals, setTotals] = useState<GeocodeResult>({
    scanned: 0,
    updated: 0,
    skipped_no_address: 0,
    failed: 0,
  });

  const runBatch = async () => {
    setRunning(true);
    try {
      const { data, error } = await supabase.functions.invoke('geocode-businesses', {
        body: { limit: batchSize },
      });
      if (error) throw error;
      const result = data as GeocodeResult;
      setLast(result);
      setTotals((t) => ({
        scanned: t.scanned + result.scanned,
        updated: t.updated + result.updated,
        skipped_no_address: t.skipped_no_address + result.skipped_no_address,
        failed: t.failed + result.failed,
      }));
      toast.success(`Geocoded ${result.updated}/${result.scanned}`);
    } catch (e: any) {
      toast.error(`Geocoding failed: ${e.message ?? e}`);
    } finally {
      setRunning(false);
    }
  };

  return (
    <Card className="bg-slate-900/60 border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <MapPin className="w-5 h-5 text-mansagold" />
          Geocode Businesses (Mapbox)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-slate-300">
          Fills latitude/longitude for live businesses missing map coordinates.
          Run repeatedly until "scanned" returns 0.
        </p>

        <div className="flex items-end gap-3">
          <div className="space-y-1">
            <Label className="text-slate-200">Batch size (max 500)</Label>
            <Input
              type="number"
              min={1}
              max={500}
              value={batchSize}
              onChange={(e) => setBatchSize(Number(e.target.value))}
              className="w-32 bg-slate-800 border-slate-600 text-white"
            />
          </div>
          <Button onClick={runBatch} disabled={running} className="bg-mansagold hover:bg-mansagold/90 text-black">
            {running ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
            {running ? 'Geocoding…' : 'Run Batch'}
          </Button>
        </div>

        {last && (
          <div className="text-sm text-slate-300 grid grid-cols-2 gap-2">
            <div>Last batch scanned: <strong className="text-white">{last.scanned}</strong></div>
            <div>Last batch updated: <strong className="text-emerald-400">{last.updated}</strong></div>
            <div>Last batch skipped (no address): <strong>{last.skipped_no_address}</strong></div>
            <div>Last batch failed: <strong className="text-red-400">{last.failed}</strong></div>
          </div>
        )}

        <div className="border-t border-slate-700 pt-3 text-sm text-slate-300 grid grid-cols-2 gap-2">
          <div>Session totals scanned: <strong className="text-white">{totals.scanned}</strong></div>
          <div>Session totals updated: <strong className="text-emerald-400">{totals.updated}</strong></div>
          <div>Session totals skipped: <strong>{totals.skipped_no_address}</strong></div>
          <div>Session totals failed: <strong className="text-red-400">{totals.failed}</strong></div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GeocodeBusinessesPanel;
