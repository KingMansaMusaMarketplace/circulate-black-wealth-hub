import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, DollarSign, Building2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';

interface ImpactStats {
  totalBusinesses: number;
  totalTransactions: number;
  totalValue: number;
  totalCustomers: number;
}

export const ImpactCounter: React.FC = () => {
  const [stats, setStats] = useState<ImpactStats>({
    totalBusinesses: 0,
    totalTransactions: 0,
    totalValue: 0,
    totalCustomers: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImpactStats = async () => {
      try {
        // Fetch total verified businesses
        const { count: businessCount } = await supabase
          .from('businesses')
          .select('*', { count: 'exact', head: true })
          .eq('is_verified', true);

        // Fetch total transactions
        const { count: transactionCount } = await supabase
          .from('transactions')
          .select('*', { count: 'exact', head: true });

        // Fetch total transaction value
        const { data: transactionData } = await supabase
          .from('transactions')
          .select('amount');

        const totalValue = transactionData?.reduce((sum, t) => sum + (t.amount || 0), 0) || 0;

        // Fetch total unique customers
        const { data: customerData } = await supabase
          .from('transactions')
          .select('customer_id');

        const uniqueCustomers = new Set(customerData?.map(t => t.customer_id)).size;

        setStats({
          totalBusinesses: businessCount || 0,
          totalTransactions: transactionCount || 0,
          totalValue: totalValue,
          totalCustomers: uniqueCustomers || 0
        });
      } catch (error) {
        console.error('Error fetching impact stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchImpactStats();
  }, []);

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(1)}K`;
    }
    return `$${value.toFixed(0)}`;
  };

  const formatNumber = (value: number) => {
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return value.toString();
  };

  const hasData = stats.totalBusinesses > 0 || stats.totalTransactions > 0;

  if (loading) {
    return (
      <div className="py-16 bg-gradient-to-r from-green-500/20 to-blue-500/20 backdrop-blur-sm border-y-4 border-white/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Real-Time Community Impact
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="bg-white/10 border-white/20 animate-pulse">
                <CardContent className="p-6">
                  <div className="h-12 w-12 bg-white/20 rounded-full mb-4 mx-auto" />
                  <div className="h-8 bg-white/20 rounded mb-2" />
                  <div className="h-4 bg-white/20 rounded w-2/3 mx-auto" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16 bg-gradient-to-r from-green-500/20 to-blue-500/20 backdrop-blur-sm border-y-4 border-white/30 shadow-xl">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 drop-shadow-lg">
            🌟 Real-Time Community Impact 🌟
          </h2>
          <p className="text-white/90 text-base md:text-lg font-medium">
            {hasData 
              ? "Together, we're building economic power" 
              : "Be the first to make an impact! Join our growing community."
            }
          </p>
          {!hasData && (
            <div className="mt-4 inline-block bg-yellow-500/20 backdrop-blur-sm border-2 border-yellow-300/50 rounded-lg px-6 py-3">
              <p className="text-yellow-100 font-semibold text-sm">
                📊 Impact stats will appear here as the community grows
              </p>
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/15 transition-all">
            <CardContent className="p-6 text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-green-500/20 p-3 rounded-full">
                  <Building2 className="h-8 w-8 text-green-300" />
                </div>
              </div>
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                {formatNumber(stats.totalBusinesses)}
              </div>
              <div className="text-sm text-white/80">
                Black-Owned Businesses
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/15 transition-all">
            <CardContent className="p-6 text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-blue-500/20 p-3 rounded-full">
                  <Users className="h-8 w-8 text-blue-300" />
                </div>
              </div>
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                {formatNumber(stats.totalCustomers)}
              </div>
              <div className="text-sm text-white/80">
                Active Customers
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/15 transition-all">
            <CardContent className="p-6 text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-purple-500/20 p-3 rounded-full">
                  <TrendingUp className="h-8 w-8 text-purple-300" />
                </div>
              </div>
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                {formatNumber(stats.totalTransactions)}
              </div>
              <div className="text-sm text-white/80">
                Total Transactions
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/15 transition-all">
            <CardContent className="p-6 text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-yellow-500/20 p-3 rounded-full">
                  <DollarSign className="h-8 w-8 text-yellow-300" />
                </div>
              </div>
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                {formatCurrency(stats.totalValue)}
              </div>
              <div className="text-sm text-white/80">
                Economic Impact
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center">
          <p className="text-white/90 text-sm md:text-base font-medium drop-shadow">
            {hasData 
              ? "Updated in real-time • Every transaction strengthens our community" 
              : "Start your journey today and watch your impact grow!"
            }
          </p>
        </div>
      </div>
    </div>
  );
};
