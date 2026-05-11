import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Receipt } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { startOfMonth } from 'date-fns';

interface PlatformFeesCardProps {
  businessId: string;
}

export default function PlatformFeesCard({ businessId }: PlatformFeesCardProps) {
  const { data } = useQuery({
    queryKey: ['platform-fees-this-month', businessId],
    queryFn: async () => {
      const monthStart = startOfMonth(new Date()).toISOString();
      const { data: rows } = await supabase
        .from('platform_transactions')
        .select('amount_platform_fee, amount_total, platform_fee_percentage')
        .eq('business_id', businessId)
        .eq('status', 'succeeded')
        .gte('created_at', monthStart);
      const fees = (rows ?? []).reduce((s, r: any) => s + Number(r.amount_platform_fee || 0), 0);
      const volume = (rows ?? []).reduce((s, r: any) => s + Number(r.amount_total || 0), 0);
      const rate = rows?.[0]?.platform_fee_percentage ?? null;
      return { fees, volume, count: rows?.length ?? 0, rate };
    },
  });

  return (
    <Card className="bg-slate-900/40 backdrop-blur-xl border-white/10">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-white">Platform Fees This Month</CardTitle>
        <Receipt className="h-4 w-4 text-yellow-400" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-white">${(data?.fees ?? 0).toFixed(2)}</div>
        <p className="text-xs text-white/70">
          {data?.count ?? 0} QR payments · ${(data?.volume ?? 0).toFixed(0)} volume
          {data?.rate != null && ` · ${Number(data.rate).toFixed(2)}%`}
        </p>
      </CardContent>
    </Card>
  );
}
