import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

const TenantConfirmLeasePage: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const { user } = useAuth();
  const [agreement, setAgreement] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    (async () => {
      if (!token) return;
      const { data } = await supabase
        .from("lease_agreements")
        .select("*, vacation_properties(title, city, state, monthly_rent)")
        .eq("tenant_confirm_token", token)
        .maybeSingle();
      setAgreement(data);
      setLoading(false);
    })();
  }, [token]);

  const confirmLease = async () => {
    if (!user) { toast.error("Please sign in to confirm"); return; }
    setConfirming(true);
    const now = new Date().toISOString();
    const newStatus = agreement.landlord_confirmed_at ? "confirmed" : "pending_landlord_confirm";
    const updates: any = {
      tenant_id: user.id,
      tenant_confirmed_at: now,
      status: newStatus,
    };
    if (newStatus === "confirmed") updates.confirmed_at = now;
    const { error } = await supabase
      .from("lease_agreements")
      .update(updates)
      .eq("id", agreement.id);
    setConfirming(false);
    if (error) toast.error(error.message);
    else { toast.success("Lease confirmed! Welcome home."); setAgreement({ ...agreement, ...updates }); }
  };

  if (loading) return <div className="min-h-screen bg-black text-white p-10">Loading…</div>;
  if (!agreement) return <div className="min-h-screen bg-black text-white p-10">Invalid or expired confirmation link.</div>;

  const p = agreement.vacation_properties;

  return (
    <div className="min-h-screen bg-black text-white">
      <Helmet><title>Confirm your lease — Mansa Stays</title></Helmet>
      <section className="max-w-2xl mx-auto p-4 md:p-10">
        <h1 className="text-3xl font-bold">Confirm your lease</h1>
        <Card className="bg-white/5 border-white/10 p-6 mt-6 space-y-3">
          <p className="text-white/70">Property</p>
          <p className="text-xl font-semibold">{p?.title}</p>
          <p className="text-white/60">{p?.city}, {p?.state}</p>
          <div className="border-t border-white/10 pt-3 mt-3 text-sm space-y-1">
            <p><span className="text-white/50">Monthly rent:</span> ${Number(agreement.monthly_rent).toLocaleString()}</p>
            <p><span className="text-white/50">Lease start:</span> {agreement.lease_start_date}</p>
            <p><span className="text-white/50">Tenant on file:</span> {agreement.tenant_name} ({agreement.tenant_email})</p>
            <p><span className="text-white/50">Status:</span> {agreement.status}</p>
          </div>

          {agreement.tenant_confirmed_at ? (
            <div className="bg-green-500/10 border border-green-500/30 rounded p-3 text-green-300 text-sm">
              You confirmed this lease on {new Date(agreement.tenant_confirmed_at).toLocaleString()}.
              {agreement.status === "confirmed" && " The lease is fully confirmed by both parties."}
            </div>
          ) : (
            <>
              <p className="text-xs text-white/60">
                By confirming, you acknowledge you have agreed to lease this property from the landlord at the terms above.
                Mansa Stays is not a real estate broker and does not handle lease signing, escrow, or deposits.
              </p>
              <Button onClick={confirmLease} disabled={confirming} className="bg-mansagold text-black hover:bg-mansagold/90 w-full">
                {confirming ? "Confirming…" : "Confirm I leased this property"}
              </Button>
            </>
          )}
        </Card>
      </section>
    </div>
  );
};

export default TenantConfirmLeasePage;
