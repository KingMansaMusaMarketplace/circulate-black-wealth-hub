import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Plus, Mail, Phone, Calendar, Copy, CheckCircle2, Clock, DollarSign, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import LeaseLegalFooter from "@/components/stays/lease/LeaseLegalFooter";

interface Listing {
  id: string;
  title: string;
  city: string;
  state: string;
  monthly_rent: number;
  is_active: boolean;
  created_at: string;
}

interface Inquiry {
  id: string;
  property_id: string;
  tenant_name: string;
  tenant_email: string;
  tenant_phone: string | null;
  desired_move_in: string | null;
  message: string | null;
  status: string;
  created_at: string;
}

interface Agreement {
  id: string;
  property_id: string;
  tenant_name: string;
  tenant_email: string;
  lease_start_date: string;
  lease_end_date: string | null;
  monthly_rent: number;
  status: string;
  landlord_confirmed_at: string | null;
  tenant_confirmed_at: string | null;
  fee_charged_at: string | null;
  tenant_confirm_token: string | null;
  refund_eligible_until: string | null;
  created_at: string;
}

const HostLeaseDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [listings, setListings] = useState<Listing[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [agreements, setAgreements] = useState<Agreement[]>([]);
  const [loading, setLoading] = useState(true);
  const [markLeasedFor, setMarkLeasedFor] = useState<Listing | null>(null);
  const [form, setForm] = useState({
    tenant_name: "", tenant_email: "",
    lease_start_date: "", lease_end_date: "",
    monthly_rent: 0, inquiry_id: "" as string | "",
  });
  const [saving, setSaving] = useState(false);
  const [payingId, setPayingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data: props } = await supabase
      .from("vacation_properties")
      .select("id, title, city, state, monthly_rent, is_active, created_at")
      .eq("host_id", user.id)
      .eq("listing_mode", "yearly_lease")
      .order("created_at", { ascending: false });
    const propIds = (props || []).map(p => p.id);
    setListings((props as any) || []);

    if (propIds.length > 0) {
      const [{ data: inq }, { data: agrs }] = await Promise.all([
        supabase.from("lease_inquiries").select("*").in("property_id", propIds).order("created_at", { ascending: false }),
        supabase.from("lease_agreements").select("*").in("property_id", propIds).order("created_at", { ascending: false }),
      ]);
      setInquiries((inq as any) || []);
      setAgreements((agrs as any) || []);
    } else {
      setInquiries([]);
      setAgreements([]);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => { load(); }, [load]);

  const openMarkLeased = (listing: Listing, inquiry?: Inquiry) => {
    setMarkLeasedFor(listing);
    setForm({
      tenant_name: inquiry?.tenant_name || "",
      tenant_email: inquiry?.tenant_email || "",
      lease_start_date: inquiry?.desired_move_in || new Date().toISOString().slice(0, 10),
      lease_end_date: "",
      monthly_rent: listing.monthly_rent,
      inquiry_id: inquiry?.id || "",
    });
  };

  const submitMarkLeased = async () => {
    if (!user || !markLeasedFor) return;
    if (!form.tenant_name || !form.tenant_email || !form.lease_start_date || !form.monthly_rent) {
      toast.error("Fill in tenant name, email, start date, and monthly rent");
      return;
    }
    setSaving(true);
    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from("lease_agreements")
      .insert({
        property_id: markLeasedFor.id,
        landlord_id: user.id,
        inquiry_id: form.inquiry_id || null,
        tenant_name: form.tenant_name,
        tenant_email: form.tenant_email,
        lease_start_date: form.lease_start_date,
        lease_end_date: form.lease_end_date || null,
        monthly_rent: Number(form.monthly_rent),
        status: "pending_tenant_confirm",
        landlord_confirmed_at: now,
      } as any)
      .select()
      .single();
    setSaving(false);
    if (error || !data) { toast.error(error?.message || "Failed to create lease record"); return; }

    toast.success("Lease created. Share the confirmation link with your tenant.");
    setMarkLeasedFor(null);
    load();
  };

  const copyTenantLink = (a: Agreement) => {
    const url = `${window.location.origin}/stays/tenant/confirm-lease/${a.tenant_confirm_token}`;
    navigator.clipboard.writeText(url);
    toast.success("Tenant confirmation link copied!");
  };

  const payFee = async (a: Agreement) => {
    setPayingId(a.id);
    try {
      const { data, error } = await supabase.functions.invoke("charge-lease-success-fee", {
        body: { leaseAgreementId: a.id },
      });
      if (error) throw error;
      if (data?.url) window.location.href = data.url;
      else throw new Error("No checkout URL returned");
    } catch (e: any) {
      toast.error(e.message || "Failed to start payment");
    } finally {
      setPayingId(null);
    }
  };

  const statusBadge = (s: string) => {
    const map: Record<string, { label: string; cls: string; Icon: any }> = {
      pending_tenant_confirm: { label: "Waiting on tenant", cls: "bg-yellow-500/20 text-yellow-300 border-yellow-500/40", Icon: Clock },
      pending_landlord_confirm: { label: "Waiting on you", cls: "bg-orange-500/20 text-orange-300 border-orange-500/40", Icon: Clock },
      confirmed: { label: "Confirmed — pay $99", cls: "bg-green-500/20 text-green-300 border-green-500/40", Icon: CheckCircle2 },
      paid: { label: "Paid", cls: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40", Icon: CheckCircle2 },
      refunded: { label: "Refunded", cls: "bg-white/10 text-white/70 border-white/20", Icon: DollarSign },
      cancelled: { label: "Cancelled", cls: "bg-red-500/20 text-red-300 border-red-500/40", Icon: Clock },
    };
    const c = map[s] || { label: s, cls: "bg-white/10 text-white/80 border-white/20", Icon: Clock };
    const Icon = c.Icon;
    return <Badge variant="outline" className={`${c.cls} gap-1`}><Icon className="w-3 h-3" />{c.label}</Badge>;
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-black text-white p-10">
        <p>Please sign in to view your lease dashboard.</p>
        <Button asChild className="mt-4 bg-mansagold text-black hover:bg-mansagold/90"><Link to="/login">Sign in</Link></Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Helmet><title>My Lease Listings — Mansa Stays</title></Helmet>

      <section className="max-w-6xl mx-auto p-4 md:p-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">My Lease Listings</h1>
            <p className="text-white/80 mt-2">Manage inquiries, mark leases as signed, and pay the $99 success fee.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10 min-h-[48px]">
              <Link to="/stays/host/lease/bulk-upload">Bulk upload CSV</Link>
            </Button>
            <Button asChild size="lg" className="bg-mansagold text-black hover:bg-mansagold/90 font-bold min-h-[48px]">
              <Link to="/stays/host/lease/new"><Plus className="w-4 h-4 mr-1" />New Listing</Link>
            </Button>
          </div>
        </div>

        {loading ? (
          <p className="text-white/70">Loading…</p>
        ) : listings.length === 0 ? (
          <Card className="bg-white/10 border-white/20 p-8 text-center">
            <p className="text-white/90 mb-4">You don't have any lease listings yet.</p>
            <Button asChild className="bg-mansagold text-black hover:bg-mansagold/90 font-bold"><Link to="/stays/host/lease/new">Create your first listing</Link></Button>
          </Card>
        ) : (
          <div className="space-y-6">
            {listings.map((l) => {
              const myInquiries = inquiries.filter(i => i.property_id === l.id);
              const myAgreements = agreements.filter(a => a.property_id === l.id);
              return (
                <Card key={l.id} className="bg-white/10 border-white/20 p-6">
                  {/* Backfill nudge: prompt host to confirm category for older listings (pre-2026-05-18) */}
                  {new Date(l.created_at) < new Date("2026-05-18") && (
                    <div className="mb-4 p-3 rounded-md bg-yellow-500/15 border border-yellow-500/40 text-yellow-100 text-sm flex items-center justify-between gap-3 flex-wrap">
                      <span>Pick a property type (House, Condo, Loft…) so renters can find this listing.</span>
                      <Button asChild size="sm" className="bg-yellow-500 text-black hover:bg-yellow-500/90 font-bold">
                        <Link to={`/stays/lease/${l.id}`}>Update now</Link>
                      </Button>
                    </div>
                  )}
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 mb-4">
                    <div>
                      <h2 className="text-xl font-bold text-white">{l.title}</h2>
                      <p className="text-white/70 text-sm">{l.city}, {l.state} · ${Number(l.monthly_rent).toLocaleString()}/mo</p>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      <Button asChild variant="outline" size="sm" className="border-white/30 text-white hover:bg-white/10"><Link to={`/stays/lease/${l.id}`}><ExternalLink className="w-3 h-3 mr-1" />View public page</Link></Button>
                      <Button onClick={() => openMarkLeased(l)} size="sm" className="bg-mansagold text-black hover:bg-mansagold/90 font-bold"><CheckCircle2 className="w-4 h-4 mr-1" />Mark as Leased</Button>
                    </div>
                  </div>

                  {/* Inquiries */}
                  <div className="mt-4">
                    <h3 className="text-sm font-semibold text-white/90 mb-2">Inquiries ({myInquiries.length})</h3>
                    {myInquiries.length === 0 ? (
                      <p className="text-white/60 text-sm">No inquiries yet.</p>
                    ) : (
                      <div className="space-y-2">
                        {myInquiries.map(i => (
                          <div key={i.id} className="flex items-start justify-between gap-3 bg-white/5 border border-white/15 rounded p-3">
                            <div className="text-sm">
                              <p className="font-medium text-white">{i.tenant_name}</p>
                              <p className="text-white/70 flex items-center gap-2 mt-1"><Mail className="w-3 h-3" /><a href={`mailto:${i.tenant_email}`} className="underline">{i.tenant_email}</a></p>
                              {i.tenant_phone && <p className="text-white/70 flex items-center gap-2"><Phone className="w-3 h-3" />{i.tenant_phone}</p>}
                              {i.desired_move_in && <p className="text-white/70 flex items-center gap-2"><Calendar className="w-3 h-3" />Wants in by {i.desired_move_in}</p>}
                              {i.message && <p className="text-white/80 mt-2 italic">"{i.message}"</p>}
                            </div>
                            <Button onClick={() => openMarkLeased(l, i)} size="sm" variant="outline" className="border-mansagold/60 text-mansagold hover:bg-mansagold/20 shrink-0">Mark Leased</Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Agreements */}
                  {myAgreements.length > 0 && (
                    <div className="mt-6 border-t border-white/15 pt-4">
                      <h3 className="text-sm font-semibold text-white/90 mb-2">Lease Agreements</h3>
                      <div className="space-y-2">
                        {myAgreements.map(a => (
                          <div key={a.id} className="bg-white/5 border border-white/15 rounded p-3">
                            <div className="flex items-start justify-between gap-3 flex-wrap">
                              <div className="text-sm">
                                <p className="font-medium text-white">{a.tenant_name} <span className="text-white/60 font-normal">· {a.tenant_email}</span></p>
                                <p className="text-white/70 mt-1">Start: {a.lease_start_date} · ${Number(a.monthly_rent).toLocaleString()}/mo</p>
                                <div className="mt-2">{statusBadge(a.status)}</div>
                              </div>
                              <div className="flex flex-col gap-2 items-end">
                                {a.status === "pending_tenant_confirm" && a.tenant_confirm_token && (
                                  <Button onClick={() => copyTenantLink(a)} size="sm" variant="outline" className="border-white/30 text-white hover:bg-white/10"><Copy className="w-3 h-3 mr-1" />Copy tenant link</Button>
                                )}
                                {a.status === "confirmed" && !a.fee_charged_at && (
                                  <Button onClick={() => payFee(a)} disabled={payingId === a.id} size="sm" className="bg-mansagold text-black hover:bg-mansagold/90 font-bold">
                                    <DollarSign className="w-4 h-4 mr-1" />{payingId === a.id ? "Loading…" : "Pay $99 success fee"}
                                  </Button>
                                )}
                                {a.fee_charged_at && a.refund_eligible_until && new Date(a.refund_eligible_until) > new Date() && (
                                  <p className="text-xs text-white/60">Refundable until {new Date(a.refund_eligible_until).toLocaleDateString()}</p>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        )}

        <LeaseLegalFooter />
      </section>

      {/* Mark as Leased dialog */}
      <Dialog open={!!markLeasedFor} onOpenChange={(o) => !o && setMarkLeasedFor(null)}>
        <DialogContent className="bg-black border-white/20 text-white">
          <DialogHeader>
            <DialogTitle>Mark as Leased — {markLeasedFor?.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <p className="text-sm text-white/80">
              We'll create a pending lease record and give you a link to send your tenant. Once they click it and confirm in-app,
              you'll be charged the $99 success fee (full refund within 7 days).
            </p>
            <Input placeholder="Tenant full name *" value={form.tenant_name} onChange={(e) => setForm({ ...form, tenant_name: e.target.value })} className="bg-white/10 border-white/30 text-white placeholder:text-white/60" />
            <Input type="email" placeholder="Tenant email *" value={form.tenant_email} onChange={(e) => setForm({ ...form, tenant_email: e.target.value })} className="bg-white/10 border-white/30 text-white placeholder:text-white/60" />
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-white/70 mb-1 block">Lease start *</label>
                <Input type="date" value={form.lease_start_date} onChange={(e) => setForm({ ...form, lease_start_date: e.target.value })} className="bg-white/10 border-white/30 text-white" />
              </div>
              <div>
                <label className="text-xs text-white/70 mb-1 block">Lease end (optional)</label>
                <Input type="date" value={form.lease_end_date} onChange={(e) => setForm({ ...form, lease_end_date: e.target.value })} className="bg-white/10 border-white/30 text-white" />
              </div>
            </div>
            <Input type="number" placeholder="Monthly rent ($) *" value={form.monthly_rent || ""} onChange={(e) => setForm({ ...form, monthly_rent: +e.target.value })} className="bg-white/10 border-white/30 text-white placeholder:text-white/60" />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setMarkLeasedFor(null)} className="border-white/30 text-white hover:bg-white/10">Cancel</Button>
            <Button onClick={submitMarkLeased} disabled={saving} className="bg-mansagold text-black hover:bg-mansagold/90 font-bold">
              {saving ? "Creating…" : "Create lease record"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HostLeaseDashboardPage;
