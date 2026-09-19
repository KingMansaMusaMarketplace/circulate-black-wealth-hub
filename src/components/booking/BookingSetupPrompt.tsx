import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarCheck, Clock, ListChecks, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

interface BookingSetupPromptProps {
  businessId: string;
}

/**
 * Shown on the business Bookings screen when the owner hasn't finished
 * setting bookings up — no services listed and/or no opening hours saved.
 */
export function BookingSetupPrompt({ businessId }: BookingSetupPromptProps) {
  const [hasServices, setHasServices] = useState<boolean | null>(null);
  const [hasHours, setHasHours] = useState<boolean | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function check() {
      const [{ count: serviceCount }, { count: hourCount }] = await Promise.all([
        supabase
          .from('business_services')
          .select('id', { count: 'exact', head: true })
          .eq('business_id', businessId)
          .eq('is_active', true),
        supabase
          .from('business_availability')
          .select('id', { count: 'exact', head: true })
          .eq('business_id', businessId)
          .eq('is_available', true),
      ]);

      if (cancelled) return;
      setHasServices((serviceCount ?? 0) > 0);
      setHasHours((hourCount ?? 0) > 0);
    }

    if (businessId) check();
    return () => {
      cancelled = true;
    };
  }, [businessId]);

  if (hasServices === null || hasHours === null) return null;
  if (hasServices && hasHours) return null;

  return (
    <div className="mb-6 rounded-2xl border border-mansagold/25 bg-mansagold/[0.06] p-5">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-mansagold/15">
          <CalendarCheck className="h-5 w-5 text-mansagold" />
        </div>
        <div className="flex-1">
          <h3 className="text-base font-semibold text-white">Turn on bookings — about two minutes</h3>
          <p className="mt-1 text-sm text-white/70">
            Customers can already ask you for a time, but adding your services and hours lets them
            book and pay without waiting on you.
          </p>

          <div className="mt-4 space-y-2">
            {!hasServices && (
              <div className="flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-black/20 px-3 py-2">
                <span className="flex items-center gap-2 text-sm text-white/85">
                  <ListChecks className="h-4 w-4 text-mansagold" />
                  Add what you offer and what it costs
                </span>
                <Button asChild size="sm" className="bg-mansagold font-semibold text-black hover:bg-mansagold/90">
                  <Link to="/business/profile?tab=services">
                    Add services <ArrowRight className="ml-1 h-3.5 w-3.5" />
                  </Link>
                </Button>
              </div>
            )}

            {!hasHours && (
              <div className="flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-black/20 px-3 py-2">
                <span className="flex items-center gap-2 text-sm text-white/85">
                  <Clock className="h-4 w-4 text-mansagold" />
                  Set the days and times you're open
                </span>
                <Button asChild size="sm" className="bg-mansagold font-semibold text-black hover:bg-mansagold/90">
                  <Link to="/business/profile?tab=availability">
                    Set hours <ArrowRight className="ml-1 h-3.5 w-3.5" />
                  </Link>
                </Button>
              </div>
            )}
          </div>

          {!hasHours && (
            <p className="mt-3 text-xs text-white/50">
              Until you set hours, customers see standard hours (Mon–Fri 9am–5pm, Sat 10am–2pm) and
              their time comes to you as a request to confirm.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default BookingSetupPrompt;
