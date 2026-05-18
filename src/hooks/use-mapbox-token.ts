import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

let cached: string | null = null;
let inflight: Promise<string> | null = null;

export const useMapboxToken = () => {
  const [token, setToken] = useState<string | null>(cached);
  const [loading, setLoading] = useState(!cached);

  useEffect(() => {
    if (cached) return;
    if (!inflight) {
      inflight = supabase.functions
        .invoke("get-mapbox-token")
        .then((res: any) => {
          const t = (res?.data?.token as string) || "";
          cached = t;
          return t;
        })
        .catch(() => "");
    }
    inflight.then((t) => {
      setToken(t);
      setLoading(false);
    });
  }, []);

  return { token, loading };
};
