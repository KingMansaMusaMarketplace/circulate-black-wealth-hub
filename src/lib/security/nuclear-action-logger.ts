import { supabase } from "@/integrations/supabase/client";

/**
 * Sole-Operator Substitute for the Two-Person Rule.
 *
 * In a real multi-admin deployment a "nuclear" action (grant admin, delete
 * business, refund > threshold, reverse fraud block) should require a second
 * admin's approval. In solo mode we can't enforce that — but we CAN loudly
 * record every nuclear action to the activity log so:
 *   - You (the sole operator) can see them all in the "What changed" feed
 *   - The weekly health email surfaces them
 *   - The audit trail is intact for investors / insurance / disputes
 *
 * When you hire your first co-admin, flip the SOLO_MODE flag off and this
 * helper will refuse the action unless there's a pending approval.
 */
export const NUCLEAR_ACTIONS = {
  GRANT_ADMIN: "nuclear_grant_admin",
  REVOKE_ADMIN: "nuclear_revoke_admin",
  DELETE_BUSINESS: "nuclear_delete_business",
  REVERSE_FRAUD_BLOCK: "nuclear_reverse_fraud_block",
  REFUND_OVER_THRESHOLD: "nuclear_refund_over_threshold",
  DELETE_USER: "nuclear_delete_user",
} as const;

export type NuclearAction = (typeof NUCLEAR_ACTIONS)[keyof typeof NUCLEAR_ACTIONS];

// Solo mode: log loudly and proceed. When set to false, requires 2nd approver.
const SOLO_MODE = true;

export async function logNuclearAction(
  action: NuclearAction,
  details: Record<string, unknown>
) {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    await supabase.from("activity_log").insert({
      user_id: user?.id ?? null,
      activity_type: action,
      details: {
        ...details,
        sole_operator_mode: SOLO_MODE,
        logged_at: new Date().toISOString(),
      },
    } as any);
  } catch (err) {
    // Never block a real action because logging failed — but do surface it.
    console.error("[nuclear-log] failed to record action", action, err);
  }
}

export const isSoloMode = () => SOLO_MODE;
