import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface StripeStatus {
  connected: boolean;
  chargesEnabled: boolean;
  loading: boolean;
}

export const useBusinessStripeStatus = (businessId?: string): StripeStatus => {
  const [state, setState] = useState<StripeStatus>({
    connected: false,
    chargesEnabled: false,
    loading: true,
  });

  useEffect(() => {
    if (!businessId) {
      setState({ connected: false, chargesEnabled: false, loading: false });
      return;
    }
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from("business_payment_accounts")
        .select("stripe_account_id, charges_enabled")
        .eq("business_id", businessId)
        .maybeSingle();
      if (cancelled) return;
      if (error || !data) {
        setState({ connected: false, chargesEnabled: false, loading: false });
        return;
      }
      setState({
        connected: !!data.stripe_account_id,
        chargesEnabled: !!data.charges_enabled,
        loading: false,
      });
    })();
    return () => { cancelled = true; };
  }, [businessId]);

  return state;
};
