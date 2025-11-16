import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Clock } from 'lucide-react';
import { format } from 'date-fns';

interface AccountsReceivableAgingProps {
  businessId: string;
}

interface AgingBucket {
  range: string;
  count: number;
  amount: number;
  invoices: any[];
}

export const AccountsReceivableAging: React.FC<AccountsReceivableAgingProps> = ({ businessId }) => {
  const [loading, setLoading] = useState(true);
  const [agingData, setAgingData] = useState<AgingBucket[]>([]);
  const [totalOutstanding, setTotalOutstanding] = useState(0);

  useEffect(() => {
    loadAgingData();
  }, [businessId]);

  const loadAgingData = async () => {
    try {
      const { data: invoices, error } = await supabase
        .from('invoices')
        .select('*')
        .eq('business_id', businessId)
        .neq('status', 'paid')
        .order('due_date', { ascending: true });

      if (error) throw error;

      const now = new Date();
      const buckets: AgingBucket[] = [
        { range: 'Current (0-30 days)', count: 0, amount: 0, invoices: [] },
        { range: '31-60 days', count: 0, amount: 0, invoices: [] },
        { range: '61-90 days', count: 0, amount: 0, invoices: [] },
        { range: '90+ days', count: 0, amount: 0, invoices: [] }
      ];

      let total = 0;

      invoices?.forEach((invoice) => {
        const dueDate = new Date(invoice.due_date);
        const daysOverdue = Math.floor((now.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
        const amount = Number(invoice.total_amount);
        total += amount;

        if (daysOverdue <= 30) {
          buckets[0].count++;
          buckets[0].amount += amount;
          buckets[0].invoices.push(invoice);
        } else if (daysOverdue <= 60) {
          buckets[1].count++;
          buckets[1].amount += amount;
          buckets[1].invoices.push(invoice);
        } else if (daysOverdue <= 90) {
          buckets[2].count++;
          buckets[2].amount += amount;
          buckets[2].invoices.push(invoice);
        } else {
          buckets[3].count++;
          buckets[3].amount += amount;
          buckets[3].invoices.push(invoice);
        }
      });

      setAgingData(buckets);
      setTotalOutstanding(total);
    } catch (error) {
      console.error('Error loading aging data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Accounts Receivable Aging
        </CardTitle>
        <CardDescription>Track outstanding invoices by age</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="p-4 bg-primary/10 rounded-lg">
            <p className="text-sm text-muted-foreground">Total Outstanding</p>
            <p className="text-3xl font-bold">${totalOutstanding.toFixed(2)}</p>
          </div>

          {agingData.map((bucket, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold">{bucket.range}</h3>
                <span className="text-sm text-muted-foreground">{bucket.count} invoice(s)</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="text-2xl font-bold">${bucket.amount.toFixed(2)}</div>
                <div className="text-sm text-muted-foreground">
                  {totalOutstanding > 0 ? ((bucket.amount / totalOutstanding) * 100).toFixed(1) : 0}%
                </div>
              </div>
              {bucket.invoices.length > 0 && (
                <div className="mt-3 space-y-1">
                  {bucket.invoices.slice(0, 3).map((invoice) => (
                    <div key={invoice.id} className="text-xs text-muted-foreground flex justify-between">
                      <span>{invoice.invoice_number} - {invoice.customer_name}</span>
                      <span>${Number(invoice.total_amount).toFixed(2)}</span>
                    </div>
                  ))}
                  {bucket.invoices.length > 3 && (
                    <div className="text-xs text-muted-foreground">
                      +{bucket.invoices.length - 3} more
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
