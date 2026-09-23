import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import CampaignRecipientsDialog from "@/components/admin/CampaignRecipientsDialog";

type Stats = { eligible: number; unsubscribed: number; waves: Record<string, { sent: number; failed: number }> };
const WAVE_NAMES: Record<number, string> = { 1: "Launch (Oct 1)", 2: "Reminder (mid-Nov)", 3: "Last chance (~Dec 15)" };

export default function AdminHolidayCampaignPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [wave, setWave] = useState(1);
  const [testTo, setTestTo] = useState("");
  const [batch, setBatch] = useState(100);
  const [busy, setBusy] = useState<string | null>(null);

  const call = async (body: Record<string, unknown>) => {
    const { data, error } = await supabase.functions.invoke("send-holiday-campaign", { body });
    if (error || data?.error) throw new Error(data?.error || error?.message);
    return data;
  };
  const load = () => call({ action: "stats" }).then(setStats).catch((e) => toast.error(e.message));
  useEffect(() => { load(); }, []);

  const sendTest = async () => {
    setBusy("test");
    try { await call({ action: "test", wave, to: testTo }); toast.success(`Test sent to ${testTo}`); }
    catch (e) { toast.error((e as Error).message); } finally { setBusy(null); }
  };
  const sendBatch = async () => {
    if (!window.confirm(`Send wave ${wave} to up to ${batch} businesses now?`)) return;
    setBusy("batch");
    try {
      const r = await call({ action: "send_batch", wave, limit: batch, confirm: "SEND" });
      toast[r.stopped ? "error" : "success"](
        r.stopped ? `Stopped for safety: ${r.failed} failed, ${r.sent} sent.` : `Sent ${r.sent}, failed ${r.failed}.`,
      );
      load();
    } catch (e) { toast.error((e as Error).message); } finally { setBusy(null); }
  };

  return (
    <main className="mx-auto max-w-3xl space-y-6 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-bold">Holiday Special email campaign</h1>
        <CampaignRecipientsDialog source={{ kind: 'holiday' }} title="Holiday Special" triggerClassName="" />
      </div>
      <p className="text-muted-foreground">Pro at $149/mo locked forever · sign-ups Oct 1 – Dec 31. Send in daily batches to protect deliverability.</p>

      <Card>
        <CardHeader><CardTitle>Numbers</CardTitle></CardHeader>
        <CardContent className="grid gap-2 text-base">
          {!stats ? <Loader2 className="animate-spin" /> : (
            <>
              <div>Businesses with an email you can reach: <strong>{stats.eligible.toLocaleString()}</strong></div>
              <div>Unsubscribed (all emails): <strong>{stats.unsubscribed.toLocaleString()}</strong></div>
              {[1, 2, 3].map((w) => (
                <div key={w}>{WAVE_NAMES[w]}: {stats.waves?.[w]?.sent ?? 0} sent, {stats.waves?.[w]?.failed ?? 0} failed</div>
              ))}
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Send</CardTitle></CardHeader>
        <CardContent className="space-y-5">
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3].map((w) => (
              <Button key={w} variant={wave === w ? "default" : "outline"} onClick={() => setWave(w)}>{WAVE_NAMES[w]}</Button>
            ))}
          </div>
          <div className="flex gap-2">
            <Input placeholder="your@email.com" value={testTo} onChange={(e) => setTestTo(e.target.value)} />
            <Button onClick={sendTest} disabled={!!busy}>{busy === "test" && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Send test to me</Button>
          </div>
          <div className="flex items-center gap-2">
            <Input type="number" min={1} max={200} value={batch} onChange={(e) => setBatch(Number(e.target.value))} className="w-28" />
            <Button variant="destructive" onClick={sendBatch} disabled={!!busy}>
              {busy === "batch" && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Send batch to businesses
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">Max 200 per click. Nobody gets the same wave twice. Sending stops automatically if more than 5% fail.</p>
        </CardContent>
      </Card>
    </main>
  );
}
