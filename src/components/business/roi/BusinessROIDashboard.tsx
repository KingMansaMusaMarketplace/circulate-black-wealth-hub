import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, TrendingUp, Users, DollarSign, ScanLine, CheckCircle2, Clock, ShieldAlert } from "lucide-react";
import CashierPinSettings from "./CashierPinSettings";

type Period = "7d" | "30d" | "90d" | "all";

interface Visit {
  id: string;
  reported_amount: number;
  discount_percentage: number;
  status: string;
  created_at: string;
  customer_id: string;
}

interface PaidTxn {
  id: string;
  amount: number;
  created_at: string;
  customer_id: string;
}

interface BusinessROIDashboardProps {
  businessId: string;
}

const periodToDate = (p: Period): Date => {
  const d = new Date();
  if (p === "7d") d.setDate(d.getDate() - 7);
  else if (p === "30d") d.setDate(d.getDate() - 30);
  else if (p === "90d") d.setDate(d.getDate() - 90);
  else d.setFullYear(2020);
  return d;
};

const BusinessROIDashboard: React.FC<BusinessROIDashboardProps> = ({ businessId }) => {
  const [period, setPeriod] = useState<Period>("30d");
  const [visits, setVisits] = useState<Visit[]>([]);
  const [paidTxns, setPaidTxns] = useState<PaidTxn[]>([]);
  const [scanCount, setScanCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!businessId) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      const since = periodToDate(period).toISOString();
      const [visitsRes, txnRes, scanRes] = await Promise.all([
        supabase
          .from("tracked_visits")
          .select("id, reported_amount, discount_percentage, status, created_at, customer_id")
          .eq("business_id", businessId)
          .gte("created_at", since)
          .order("created_at", { ascending: false }),
        supabase
          .from("transactions")
          .select("id, amount, created_at, customer_id")
          .eq("business_id", businessId)
          .eq("transaction_type", "qr_scan")
          .gte("created_at", since),
        supabase
          .from("qr_scans")
          .select("id", { count: "exact", head: true })
          .eq("business_id", businessId)
          .gte("scan_date", since),
      ]);
      if (cancelled) return;

      if (visitsRes.error) toast.error("Failed to load visits");
      if (txnRes.error) console.warn("txn fetch error", txnRes.error);

      setVisits((visitsRes.data as Visit[]) || []);
      setPaidTxns((txnRes.data as PaidTxn[]) || []);
      setScanCount(scanRes.count || 0);
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [businessId, period]);

  const metrics = useMemo(() => {
    const confirmed = visits.filter((v) => v.status === "confirmed");
    const pending = visits.filter((v) => v.status === "pending");
    const trackedRevenue = confirmed.reduce(
      (sum, v) => sum + Number(v.reported_amount) * (1 - v.discount_percentage / 100),
      0
    );
    const pendingRevenue = pending.reduce(
      (sum, v) => sum + Number(v.reported_amount) * (1 - v.discount_percentage / 100),
      0
    );
    const paidRevenue = paidTxns.reduce((sum, t) => sum + Number(t.amount), 0);
    const totalCustomers = new Set([
      ...visits.map((v) => v.customer_id),
      ...paidTxns.map((t) => t.customer_id),
    ]).size;
    const totalRevenue = trackedRevenue + paidRevenue;
    return {
      trackedRevenue,
      pendingRevenue,
      paidRevenue,
      totalRevenue,
      totalCustomers,
      confirmedCount: confirmed.length,
      pendingCount: pending.length,
    };
  }, [visits, paidTxns]);

  const confirmVisit = async (id: string) => {
    const { error } = await supabase
      .from("tracked_visits")
      .update({
        status: "confirmed",
        confirmed_at: new Date().toISOString(),
        confirmed_by_method: "business_owner",
      })
      .eq("id", id);
    if (error) {
      toast.error("Failed to confirm");
      return;
    }
    toast.success("Visit confirmed");
    setVisits((prev) =>
      prev.map((v) => (v.id === id ? { ...v, status: "confirmed" } : v))
    );
  };

  const disputeVisit = async (id: string) => {
    const { error } = await supabase
      .from("tracked_visits")
      .update({ status: "disputed" })
      .eq("id", id);
    if (error) {
      toast.error("Failed to dispute");
      return;
    }
    toast.success("Visit marked as disputed");
    setVisits((prev) =>
      prev.map((v) => (v.id === id ? { ...v, status: "disputed" } : v))
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-2xl font-bold">ROI from 1325.AI</h2>
          <p className="text-sm text-muted-foreground">
            Revenue and customers we've sent to your business.
          </p>
        </div>
        <Tabs value={period} onValueChange={(v) => setPeriod(v as Period)}>
          <TabsList>
            <TabsTrigger value="7d">7d</TabsTrigger>
            <TabsTrigger value="30d">30d</TabsTrigger>
            <TabsTrigger value="90d">90d</TabsTrigger>
            <TabsTrigger value="all">All</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              icon={<DollarSign className="h-4 w-4" />}
              label="Total Revenue Sent"
              value={`$${metrics.totalRevenue.toFixed(2)}`}
              hint={`$${metrics.paidRevenue.toFixed(2)} paid · $${metrics.trackedRevenue.toFixed(2)} tracked`}
            />
            <MetricCard
              icon={<Users className="h-4 w-4" />}
              label="Customers Sent"
              value={metrics.totalCustomers.toString()}
            />
            <MetricCard
              icon={<ScanLine className="h-4 w-4" />}
              label="QR Scans"
              value={scanCount.toString()}
            />
            <MetricCard
              icon={<Clock className="h-4 w-4" />}
              label="Pending Confirmations"
              value={metrics.pendingCount.toString()}
              hint={`$${metrics.pendingRevenue.toFixed(2)} unconfirmed`}
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <TrendingUp className="h-4 w-4" /> Recent Tracked Visits
              </CardTitle>
            </CardHeader>
            <CardContent>
              {visits.length === 0 ? (
                <p className="text-sm text-muted-foreground py-6 text-center">
                  No tracked visits yet for this period.
                </p>
              ) : (
                <div className="space-y-2">
                  {visits.slice(0, 20).map((v) => {
                    const finalAmt = Number(v.reported_amount) * (1 - v.discount_percentage / 100);
                    return (
                      <div
                        key={v.id}
                        className="flex items-center justify-between gap-3 rounded-md border p-3 text-sm"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {v.status === "confirmed" ? (
                            <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                          ) : v.status === "disputed" ? (
                            <ShieldAlert className="h-4 w-4 text-destructive shrink-0" />
                          ) : (
                            <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
                          )}
                          <div className="min-w-0">
                            <div className="font-medium">${finalAmt.toFixed(2)}</div>
                            <div className="text-xs text-muted-foreground">
                              {new Date(v.created_at).toLocaleString()}
                              {v.discount_percentage > 0 && ` · ${v.discount_percentage}% off`}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <Badge
                            variant={
                              v.status === "confirmed"
                                ? "default"
                                : v.status === "disputed"
                                ? "destructive"
                                : "secondary"
                            }
                          >
                            {v.status}
                          </Badge>
                          {v.status === "pending" && (
                            <>
                              <Button size="sm" variant="outline" onClick={() => confirmVisit(v.id)}>
                                Confirm
                              </Button>
                              <Button size="sm" variant="ghost" onClick={() => disputeVisit(v.id)}>
                                Dispute
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          <CashierPinSettings businessId={businessId} />
        </>
      )}
    </div>
  );
};

const MetricCard = ({
  icon,
  label,
  value,
  hint,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  hint?: string;
}) => (
  <Card>
    <CardContent className="pt-6">
      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
        {icon}
        {label}
      </div>
      <div className="text-2xl font-bold">{value}</div>
      {hint && <div className="text-[11px] text-muted-foreground mt-1">{hint}</div>}
    </CardContent>
  </Card>
);

export default BusinessROIDashboard;
