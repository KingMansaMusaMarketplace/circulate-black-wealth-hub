import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface FoundersCount {
  count: number;
  limit: number;
  remaining: number;
  isAvailable: boolean;
  loading: boolean;
}

export const useFoundersCount = (): FoundersCount => {
  const [data, setData] = useState<FoundersCount>({
    count: 0,
    limit: 100,
    remaining: 100,
    isAvailable: true,
    loading: true,
  });

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const { data: result, error } = await supabase.functions.invoke('founders-count');
        if (cancelled) return;
        if (error) throw error;

        setData({
          count: result?.count ?? 0,
          limit: result?.limit ?? 100,
          remaining: result?.remaining ?? 100,
          isAvailable: result?.isAvailable ?? true,
          loading: false,
        });
      } catch (err) {
        console.error('[useFoundersCount] failed:', err);
        if (!cancelled) {
          setData((prev) => ({ ...prev, loading: false }));
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return data;
};
