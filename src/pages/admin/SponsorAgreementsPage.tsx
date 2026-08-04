import React, { useCallback, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { toast } from 'sonner';
import { Loader2, RefreshCw, Send, ExternalLink, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { formatUsd } from '@/lib/sponsorship/agreementTerms';

interface Agreement {
  id: string;
  tier_name: string;
  tier_key: string;
  annual_amount_cents: number;
  installment_amount_cents: number;
  payment_schedule: string;
  company_name: string;
  company_website: string | null;
  billing_address: string;
  contact_name: string;
  contact_title: string | null;
  contact_email: string;
  contact_phone: string | null;
  po_number: string | null;
  category_exclusivity: boolean;
  signer_name: string;
  signer_title: string | null;
  signature_typed_name: string;
  agreement_version: string;
  signed_at: string;
  ip_address: string | null;
  user_agent: string | null;
  status: string;
  stripe_invoice_url: string | null;
  stripe_invoice_number: string | null;
  invoice_sent_at: string | null;
  paid_at: string | null;
  admin_notes: string | null;
}

const STATUS_VARIANT: Record<string, 'default' | 'secondary' | 'outline' | 'destructive'> = {
  signed: 'secondary',
  invoice_draft: 'outline',
  invoice_sent: 'default',
  paid: 'default',
  cancelled: 'destructive',
};

const STATUS_LABEL: Record<string, string> = {
  signed: 'Signed',
  invoice_draft: 'Invoice drafted',
  invoice_sent: 'Invoice sent',
  paid: 'Paid',
  cancelled: 'Cancelled',
};

const SponsorAgreementsPage: React.FC = () => {
  const [rows, setRows] = useState<Agreement[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [selected, setSelected] = useState<Agreement | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('sponsor_agreements')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      console.error('Failed to load sponsor agreements:', error);
      toast.error('Could not load sponsorship agreements.');
    } else {
      setRows((data as unknown as Agreement[]) || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const act = async (id: string, action: 'send' | 'sync') => {
    setBusyId(id);
    try {
      const { data, error } = await supabase.functions.invoke('send-sponsor-invoice', {
        body: { agreement_id: id, action },
      });
      if (error) throw error;
      if ((data as any)?.error) throw new Error(String((data as any).error));
      toast.success(action === 'send' ? 'Invoice sent to the sponsor.' : 'Payment status refreshed.');
      await load();
    } catch (err) {
      console.error('Invoice action failed:', err);
      toast.error('That did not work. Check the function logs and try again.');
    } finally {
      setBusyId(null);
    }
  };

  const totalSigned = rows.reduce((sum, r) => sum + (r.annual_amount_cents || 0), 0);
  const totalPaid = rows
    .filter((r) => r.status === 'paid')
    .reduce((sum, r) => sum + (r.installment_amount_cents || 0), 0);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Helmet>
        <title>Sponsor Agreements | 1325.AI Admin</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>

      <main className="container mx-auto px-4 py-10">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold sm:text-3xl">Sponsor agreements</h1>
            <p className="mt-1 text-muted-foreground">
              Signed sponsorship agreements, invoices, and payment status.
            </p>
          </div>
          <Button variant="outline" onClick={load} disabled={loading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-border bg-card p-5">
            <p className="text-sm text-muted-foreground">Agreements signed</p>
            <p className="mt-1 text-2xl font-semibold">{rows.length}</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-5">
            <p className="text-sm text-muted-foreground">Annual value committed</p>
            <p className="mt-1 text-2xl font-semibold">{formatUsd(totalSigned)}</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-5">
            <p className="text-sm text-muted-foreground">Collected</p>
            <p className="mt-1 text-2xl font-semibold">{formatUsd(totalPaid)}</p>
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sponsor</TableHead>
                <TableHead>Tier</TableHead>
                <TableHead>Installment</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Signed</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading && (
                <TableRow>
                  <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">
                    <Loader2 className="mx-auto h-5 w-5 animate-spin" />
                  </TableCell>
                </TableRow>
              )}
              {!loading && rows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">
                    No sponsorship agreements signed yet.
                  </TableCell>
                </TableRow>
              )}
              {rows.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>
                    <button
                      type="button"
                      className="text-left font-medium underline-offset-2 hover:underline"
                      onClick={() => setSelected(r)}
                    >
                      {r.company_name}
                    </button>
                    <div className="text-xs text-muted-foreground">{r.contact_email}</div>
                  </TableCell>
                  <TableCell>
                    <div>{r.tier_name}</div>
                    <div className="text-xs text-muted-foreground">
                      {formatUsd(r.annual_amount_cents)} / yr
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>{formatUsd(r.installment_amount_cents)}</div>
                    <div className="text-xs text-muted-foreground">{r.payment_schedule}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={STATUS_VARIANT[r.status] || 'secondary'}>
                      {STATUS_LABEL[r.status] || r.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(r.signed_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap justify-end gap-2">
                      {r.status !== 'paid' && r.status !== 'cancelled' && (
                        <Button
                          size="sm"
                          variant={r.invoice_sent_at ? 'outline' : 'default'}
                          disabled={busyId === r.id}
                          onClick={() => act(r.id, 'send')}
                        >
                          {busyId === r.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <>
                              <Send className="mr-2 h-4 w-4" />
                              {r.invoice_sent_at ? 'Resend' : 'Send invoice'}
                            </>
                          )}
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        disabled={busyId === r.id}
                        onClick={() => act(r.id, 'sync')}
                      >
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Check payment
                      </Button>
                      {r.stripe_invoice_url && (
                        <Button size="sm" variant="ghost" asChild>
                          <a href={r.stripe_invoice_url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Invoice
                          </a>
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </main>

      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Signature record</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-3 text-sm">
              {[
                ['Organization', selected.company_name],
                ['Website', selected.company_website || '—'],
                ['Tier', `${selected.tier_name} — ${formatUsd(selected.annual_amount_cents)} / yr`],
                [
                  'Payment schedule',
                  `${selected.payment_schedule} — ${formatUsd(selected.installment_amount_cents)} per installment`,
                ],
                ['Billing address', selected.billing_address],
                [
                  'Billing contact',
                  `${selected.contact_name}${selected.contact_title ? `, ${selected.contact_title}` : ''} (${selected.contact_email}${selected.contact_phone ? `, ${selected.contact_phone}` : ''})`,
                ],
                ['PO number', selected.po_number || '—'],
                ['Category exclusivity', selected.category_exclusivity ? 'Requested' : 'Not requested'],
                [
                  'Authorized signer',
                  `${selected.signer_name}${selected.signer_title ? `, ${selected.signer_title}` : ''}`,
                ],
                ['Typed signature', selected.signature_typed_name],
                ['Signed at', new Date(selected.signed_at).toLocaleString()],
                ['Agreement version', selected.agreement_version],
                ['IP address', selected.ip_address || '—'],
                ['Browser', selected.user_agent || '—'],
                ['Invoice number', selected.stripe_invoice_number || '—'],
                ['Invoice sent', selected.invoice_sent_at ? new Date(selected.invoice_sent_at).toLocaleString() : '—'],
                ['Paid at', selected.paid_at ? new Date(selected.paid_at).toLocaleString() : '—'],
                ['Record ID', selected.id],
              ].map(([label, value]) => (
                <div key={label as string} className="grid grid-cols-3 gap-3 border-b border-border pb-2">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="col-span-2 break-words">{value as string}</span>
                </div>
              ))}
              <Button variant="outline" className="mt-4" onClick={() => window.print()}>
                <Printer className="mr-2 h-4 w-4" />
                Print / save as PDF
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SponsorAgreementsPage;
