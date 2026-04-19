import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { format, differenceInDays } from 'date-fns';
import {
  Mail,
  Phone,
  MapPin,
  Building2,
  User,
  Briefcase,
  Globe,
  CreditCard,
  Calendar,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Receipt,
  TrendingUp,
} from 'lucide-react';

interface Props {
  sponsorId: string;
  userId: string | null;
  companyName: string;
  tier: string;
  websiteUrl: string | null;
  createdAt: string;
}

interface SponsorIntake {
  contact_name: string | null;
  contact_title: string | null;
  email: string | null;
  phone: string | null;
  company_address: string | null;
  company_city: string | null;
  company_state: string | null;
  company_zip_code: string | null;
  company_website: string | null;
  industry: string | null;
  company_size: string | null;
}

interface BillingData {
  hasStripe: boolean;
  totalPaid: number;
  subscription: {
    status: string;
    current_period_start: number;
    current_period_end: number;
    cancel_at_period_end: boolean;
    canceled_at: number | null;
  } | null;
  invoices: Array<{
    id: string;
    number: string | null;
    status: string;
    amount_paid: number;
    currency: string;
    created: number;
    paid_at: number | null;
    hosted_invoice_url: string | null;
    invoice_pdf: string | null;
  }>;
}

const formatMoney = (amountCents: number, currency = 'usd') =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
    minimumFractionDigits: amountCents % 100 === 0 ? 0 : 2,
  }).format(amountCents / 100);

export default function SponsorOverviewHeader({
  sponsorId,
  userId,
  companyName,
  tier,
  websiteUrl,
  createdAt,
}: Props) {
  // Pull contact intake details
  const { data: intake } = useQuery({
    queryKey: ['sponsor-intake', userId],
    queryFn: async () => {
      if (!userId) return null;
      const { data } = await supabase
        .from('sponsors')
        .select(
          'contact_name, contact_title, email, phone, company_address, company_city, company_state, company_zip_code, company_website, industry, company_size'
        )
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      return data as SponsorIntake | null;
    },
    enabled: !!userId,
  });

  // Pull live billing data from Stripe
  const { data: billing, isLoading: billingLoading } = useQuery({
    queryKey: ['sponsor-billing', sponsorId],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('get-sponsor-billing', {
        body: { sponsorId },
      });
      if (error) throw error;
      return data as BillingData;
    },
  });

  const lastInvoice = billing?.invoices?.[0];
  const renewalDate = billing?.subscription?.current_period_end
    ? new Date(billing.subscription.current_period_end * 1000)
    : null;
  const daysUntilRenewal = renewalDate ? differenceInDays(renewalDate, new Date()) : null;

  const fullAddress = [
    intake?.company_address,
    intake?.company_city,
    intake?.company_state,
    intake?.company_zip_code,
  ]
    .filter(Boolean)
    .join(', ');

  const subStatusColor: Record<string, string> = {
    active: 'bg-green-500/10 text-green-600 border-green-500/20',
    trialing: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    past_due: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
    canceled: 'bg-red-500/10 text-red-600 border-red-500/20',
    unpaid: 'bg-red-500/10 text-red-600 border-red-500/20',
  };

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {/* Contact info */}
      <Card className="md:col-span-1">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Building2 className="h-4 w-4 text-muted-foreground" />
            Contact Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          {intake?.contact_name && (
            <div className="flex items-start gap-2">
              <User className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
              <div>
                <div className="font-medium">{intake.contact_name}</div>
                {intake.contact_title && (
                  <div className="text-xs text-muted-foreground">{intake.contact_title}</div>
                )}
              </div>
            </div>
          )}
          {intake?.email && (
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
              <a
                href={`mailto:${intake.email}`}
                className="text-primary hover:underline truncate"
              >
                {intake.email}
              </a>
            </div>
          )}
          {intake?.phone && (
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
              <a href={`tel:${intake.phone}`} className="text-primary hover:underline">
                {intake.phone}
              </a>
            </div>
          )}
          {(intake?.company_website || websiteUrl) && (
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-muted-foreground shrink-0" />
              <a
                href={intake?.company_website || websiteUrl || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline truncate"
              >
                {(intake?.company_website || websiteUrl || '').replace(/^https?:\/\//, '')}
              </a>
            </div>
          )}
          {fullAddress && (
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
              <span className="text-muted-foreground">{fullAddress}</span>
            </div>
          )}
          {(intake?.industry || intake?.company_size) && (
            <>
              <Separator />
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Briefcase className="h-3 w-3" />
                {intake.industry}
                {intake.industry && intake.company_size && ' • '}
                {intake.company_size}
              </div>
            </>
          )}
          {!intake && (
            <p className="text-xs text-muted-foreground italic">
              No intake form on file. Contact info collected via Stripe checkout.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Billing summary */}
      <Card className="md:col-span-1">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-muted-foreground" />
            Billing & Subscription
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          {billingLoading ? (
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded animate-pulse" />
              <div className="h-4 bg-muted rounded w-2/3 animate-pulse" />
            </div>
          ) : !billing?.hasStripe ? (
            <p className="text-xs text-muted-foreground italic">
              No Stripe customer linked yet (manual / demo sponsor).
            </p>
          ) : (
            <>
              {billing.subscription && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <Badge
                    variant="outline"
                    className={subStatusColor[billing.subscription.status] || ''}
                  >
                    {billing.subscription.status}
                  </Badge>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-1">
                  <TrendingUp className="h-3.5 w-3.5" />
                  Lifetime paid
                </span>
                <span className="font-semibold text-base">
                  {formatMoney(billing.totalPaid, lastInvoice?.currency || 'usd')}
                </span>
              </div>
              {lastInvoice && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Last payment</span>
                  <div className="text-right">
                    <div className="font-medium">
                      {formatMoney(lastInvoice.amount_paid, lastInvoice.currency)}
                    </div>
                    {lastInvoice.paid_at && (
                      <div className="text-xs text-muted-foreground">
                        {format(new Date(lastInvoice.paid_at * 1000), 'MMM d, yyyy')}
                      </div>
                    )}
                  </div>
                </div>
              )}
              {renewalDate && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    Renews
                  </span>
                  <div className="text-right">
                    <div className="font-medium">
                      {format(renewalDate, 'MMM d, yyyy')}
                    </div>
                    {daysUntilRenewal !== null && (
                      <div
                        className={`text-xs ${
                          daysUntilRenewal <= 14
                            ? 'text-yellow-600'
                            : 'text-muted-foreground'
                        }`}
                      >
                        in {daysUntilRenewal} days
                      </div>
                    )}
                  </div>
                </div>
              )}
              {billing.subscription?.cancel_at_period_end && (
                <div className="flex items-center gap-2 text-xs text-yellow-600 bg-yellow-500/10 rounded-md p-2">
                  <AlertCircle className="h-3.5 w-3.5" />
                  Will cancel at period end
                </div>
              )}
            </>
          )}
          <Separator />
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Sponsor since</span>
            <span>{format(new Date(createdAt), 'MMM d, yyyy')}</span>
          </div>
        </CardContent>
      </Card>

      {/* Recent invoices */}
      <Card className="md:col-span-1">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Receipt className="h-4 w-4 text-muted-foreground" />
            Recent Invoices
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          {billingLoading ? (
            <>
              <div className="h-10 bg-muted rounded animate-pulse" />
              <div className="h-10 bg-muted rounded animate-pulse" />
            </>
          ) : !billing?.invoices?.length ? (
            <p className="text-xs text-muted-foreground italic">No invoices yet.</p>
          ) : (
            <>
              {billing.invoices.slice(0, 5).map((inv) => (
                <div
                  key={inv.id}
                  className="flex items-center justify-between gap-2 p-2 rounded-md hover:bg-muted/50"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      {inv.status === 'paid' ? (
                        <CheckCircle2 className="h-3.5 w-3.5 text-green-600 shrink-0" />
                      ) : (
                        <AlertCircle className="h-3.5 w-3.5 text-yellow-600 shrink-0" />
                      )}
                      <span className="font-medium truncate">
                        {formatMoney(inv.amount_paid || 0, inv.currency)}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground ml-5">
                      {inv.paid_at
                        ? format(new Date(inv.paid_at * 1000), 'MMM d, yyyy')
                        : format(new Date(inv.created * 1000), 'MMM d, yyyy')}
                      {' · '}
                      <span className="capitalize">{inv.status}</span>
                    </div>
                  </div>
                  {inv.hosted_invoice_url && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 shrink-0"
                      asChild
                    >
                      <a
                        href={inv.hosted_invoice_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </Button>
                  )}
                </div>
              ))}
              {billing.invoices.length > 5 && (
                <p className="text-xs text-center text-muted-foreground pt-1">
                  +{billing.invoices.length - 5} more
                </p>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
