import { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { clearPendingLeadClaim, readPendingLeadClaim, submitLeadClaimRequest } from '@/lib/lead-claim';

/** After sign-up or sign-in, files the saved claim request once, then forgets it. */
const PendingLeadClaimSubmitter = () => {
  const { user } = useAuth();
  const busy = useRef(false);

  useEffect(() => {
    if (!user || busy.current) return;
    const pending = readPendingLeadClaim();
    if (!pending) return;
    // Only file for an account that signed in after the claim was chosen; an older session is someone else's context.
    const signedInAt = user.last_sign_in_at ? Date.parse(user.last_sign_in_at) : 0;
    if (!signedInAt || signedInAt < pending.at) { clearPendingLeadClaim(); return; }
    busy.current = true;
    submitLeadClaimRequest(pending.leadId, user.id)
      .then(() => {
        clearPendingLeadClaim();
        toast.success('Claim submitted — our team will verify you shortly.', {
          description: pending.name ? `Listing: ${pending.name}` : undefined,
          duration: 8000,
        });
      })
      .catch((e) => console.error('Claim request failed', e))
      .finally(() => { busy.current = false; });
  }, [user]);

  return null;
};

export default PendingLeadClaimSubmitter;
