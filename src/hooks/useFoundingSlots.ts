import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { FOUNDING_MEMBER_SLOT_CAP } from "@/lib/constants/founding-member";

export interface FoundingSlotsState {
  claimed: number;
  remaining: number;
  isFull: boolean;
  loading: boolean;
}

const POLL_MS = 60_000;

export const useFoundingSlots = (): FoundingSlotsState => {
  const [claimed, setClaimed] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const fetchCount = async () => {
      const { count, error } = await supabase
        .from("founding_member_slots")
        .select("*", { count: "exact", head: true });
      if (cancelled) return;
      if (!error && typeof count === "number") {
        setClaimed(count);
      }
      setLoading(false);
    };

    fetchCount();
    const interval = setInterval(fetchCount, POLL_MS);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  const remaining = Math.max(0, FOUNDING_MEMBER_SLOT_CAP - claimed);
  return {
    claimed,
    remaining,
    isFull: remaining === 0,
    loading,
  };
};
