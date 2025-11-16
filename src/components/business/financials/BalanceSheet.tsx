import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Building2 } from 'lucide-react';
import { format } from 'date-fns';

interface BalanceSheetProps {
  businessId: string;
}

export const BalanceSheet: React.FC<BalanceSheetProps> = ({ businessId }) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    loadBalanceSheet();
  }, [businessId]);

  const loadBalanceSheet = async () => {
    try {
      // Fetch bank accounts (assets)
      const { data: bankAccounts } = await supabase
        .from('bank_accounts')
        .select('*')
        .eq('business_id', businessId)
        .eq('is_active', true);

      // Fetch fixed assets
      const { data: fixedAssets } = await supabase
        .from('fixed_assets')
        .select('*')
        .eq('business_id', businessId)
        .eq('is_disposed', false);

      // Fetch accounts receivable (unpaid invoices)
      const { data: receivables } = await supabase
        .from('invoices')
        .select('total_amount')
        .eq('business_id', businessId)
        .neq('status', 'paid');

      // Fetch accounts payable (unpaid expenses)
      const { data: payables } = await supabase
        .from('expenses')
        .select('amount')
        .eq('business_id', businessId);

      // Calculate totals
      const cashAssets = bankAccounts?.reduce((sum, acc) => sum + Number(acc.current_balance), 0) || 0;
      const accountsReceivable = receivables?.reduce((sum, inv) => sum + Number(inv.total_amount), 0) || 0;
      const fixedAssetsValue = fixedAssets?.reduce((sum, asset) => {
        const bookValue = Number(asset.purchase_price) - Number(asset.accumulated_depreciation);
        return sum + bookValue;
      }, 0) || 0;
      
      const totalAssets = cashAssets + accountsReceivable + fixedAssetsValue;

      // For simplicity, we'll estimate liabilities as a portion of total expenses
      const totalExpenses = payables?.reduce((sum, exp) => sum + Number(exp.amount), 0) || 0;
      const estimatedLiabilities = totalExpenses * 0.3; // Rough estimate
      
      const equity = totalAssets - estimatedLiabilities;

      setData({
        assets: {
          current: {
            cash: cashAssets,
            accountsReceivable: accountsReceivable,
            total: cashAssets + accountsReceivable
          },
          fixed: {
            fixedAssets: fixedAssetsValue,
            total: fixedAssetsValue
          },
          total: totalAssets
        },
        liabilities: {
          current: {
            accountsPayable: estimatedLiabilities,
            total: estimatedLiabilities
          },
          total: estimatedLiabilities
        },
        equity: {
          retainedEarnings: equity,
          total: equity
        },
        asOf: new Date()
      });
    } catch (error) {
      console.error('Error loading balance sheet:', error);
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

  if (!data) {
    return <div className="text-center py-12">No balance sheet data available</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold flex items-center gap-2">
          <Building2 className="h-6 w-6" />
          Balance Sheet
        </h3>
        <p className="text-muted-foreground">As of {format(data.asOf, 'MMMM d, yyyy')}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Assets */}
        <Card>
          <CardHeader>
            <CardTitle>Assets</CardTitle>
            <CardDescription>What the business owns</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Current Assets</h4>
              <div className="space-y-1 pl-4">
                <div className="flex justify-between text-sm">
                  <span>Cash & Bank</span>
                  <span className="font-medium">${data.assets.current.cash.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Accounts Receivable</span>
                  <span className="font-medium">${data.assets.current.accountsReceivable.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-semibold border-t pt-1">
                  <span>Total Current Assets</span>
                  <span>${data.assets.current.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Fixed Assets</h4>
              <div className="space-y-1 pl-4">
                <div className="flex justify-between text-sm">
                  <span>Property & Equipment</span>
                  <span className="font-medium">${data.assets.fixed.fixedAssets.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-semibold border-t pt-1">
                  <span>Total Fixed Assets</span>
                  <span>${data.assets.fixed.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="border-t-2 pt-2">
              <div className="flex justify-between font-bold">
                <span>TOTAL ASSETS</span>
                <span className="text-lg">${data.assets.total.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Liabilities & Equity */}
        <Card>
          <CardHeader>
            <CardTitle>Liabilities & Equity</CardTitle>
            <CardDescription>What the business owes and owns</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Current Liabilities</h4>
              <div className="space-y-1 pl-4">
                <div className="flex justify-between text-sm">
                  <span>Accounts Payable</span>
                  <span className="font-medium">${data.liabilities.current.accountsPayable.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-semibold border-t pt-1">
                  <span>Total Liabilities</span>
                  <span>${data.liabilities.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Equity</h4>
              <div className="space-y-1 pl-4">
                <div className="flex justify-between text-sm">
                  <span>Retained Earnings</span>
                  <span className="font-medium">${data.equity.retainedEarnings.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-semibold border-t pt-1">
                  <span>Total Equity</span>
                  <span>${data.equity.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="border-t-2 pt-2">
              <div className="flex justify-between font-bold">
                <span>TOTAL LIABILITIES & EQUITY</span>
                <span className="text-lg">${(data.liabilities.total + data.equity.total).toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
