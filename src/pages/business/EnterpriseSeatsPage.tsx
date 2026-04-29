import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Users, Minus, Plus, Loader2, ExternalLink } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface SeatInfo {
  subscription_id: string;
  seat_count: number;
  base_price_usd: number;
  per_seat_usd: number;
  monthly_total_usd: number;
  current_period_end: string;
  status: string;
}

const EnterpriseSeatsPage: React.FC = () => {
  const [info, setInfo] = useState<SeatInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [seats, setSeats] = useState<number>(1);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase.functions.invoke('enterprise-seats', {
        method: 'GET',
      });
      if (error) throw error;
      setInfo(data as SeatInfo);
      setSeats((data as SeatInfo).seat_count || 1);
    } catch (e: any) {
      setError(e?.message ?? 'Failed to load seat info');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const updateSeats = async () => {
    if (seats < 1 || seats > 500) {
      toast.error('Seat count must be between 1 and 500');
      return;
    }
    setSaving(true);
    try {
      const { data, error } = await supabase.functions.invoke('enterprise-seats', {
        body: { seatCount: seats },
      });
      if (error) throw error;
      toast.success(`Seats updated. New monthly total: $${(data as any).monthly_total_usd}/mo`);
      await load();
    } catch (e: any) {
      toast.error(e?.message ?? 'Failed to update seats');
    } finally {
      setSaving(false);
    }
  };

  const openPortal = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('customer-portal', {});
      if (error) throw error;
      const url = (data as any)?.url;
      if (url) window.open(url, '_blank');
    } catch (e: any) {
      toast.error(e?.message ?? 'Could not open billing portal');
    }
  };

  const projectedTotal = info ? info.base_price_usd + seats * info.per_seat_usd : 0;

  return (
    <div className="dark min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4 sm:p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Enterprise Seats</h1>
          <p className="text-muted-foreground mt-1">
            Manage your team's seat count. Changes are prorated and billed on your next invoice.
          </p>
        </div>

        {loading ? (
          <Card>
            <CardContent className="py-12 flex justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </CardContent>
          </Card>
        ) : error ? (
          <Card className="border-destructive/40">
            <CardHeader>
              <CardTitle className="text-destructive">Unable to load Enterprise subscription</CardTitle>
              <CardDescription>{error}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={load} variant="outline">Retry</Button>
            </CardContent>
          </Card>
        ) : info ? (
          <>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Current plan
                </CardTitle>
                <CardDescription>
                  Status: <span className="font-medium capitalize">{info.status}</span> · Renews{' '}
                  {new Date(info.current_period_end).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent className="grid sm:grid-cols-3 gap-4">
                <Stat label="Base" value={`$${info.base_price_usd}/mo`} />
                <Stat label="Per seat" value={`$${info.per_seat_usd}/user/mo`} />
                <Stat label="Current seats" value={String(info.seat_count)} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Adjust seats</CardTitle>
                <CardDescription>1–500 seats. Prorated immediately.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-end gap-3">
                  <div className="flex-1">
                    <Label htmlFor="seats">Seats</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => setSeats((s) => Math.max(1, s - 1))}
                        disabled={saving || seats <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Input
                        id="seats"
                        type="number"
                        min={1}
                        max={500}
                        value={seats}
                        onChange={(e) => setSeats(Math.max(1, Math.min(500, Number(e.target.value) || 1)))}
                        className="w-24 text-center"
                        disabled={saving}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => setSeats((s) => Math.min(500, s + 1))}
                        disabled={saving || seats >= 500}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="rounded-md border bg-muted/30 p-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Base</span>
                    <span>${info.base_price_usd}.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      {seats} × ${info.per_seat_usd} per seat
                    </span>
                    <span>${seats * info.per_seat_usd}.00</span>
                  </div>
                  <div className="flex justify-between border-t mt-2 pt-2 font-semibold">
                    <span>New monthly total</span>
                    <span>${projectedTotal}.00/mo</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button onClick={updateSeats} disabled={saving || seats === info.seat_count}>
                    {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                    Update seats
                  </Button>
                  <Button variant="outline" onClick={openPortal}>
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Manage billing
                  </Button>
                </div>
              </CardContent>
            </Card>
          </>
        ) : null}
      </div>
    </div>
  );
};

const Stat: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="rounded-md border p-3">
    <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
    <div className="text-lg font-semibold mt-1">{value}</div>
  </div>
);

export default EnterpriseSeatsPage;
