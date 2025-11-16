import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import DashboardLayout from '@/components/dashboard/layout/DashboardLayout';
import { DollarSign, TrendingUp, TrendingDown, Receipt, FileText, PieChart } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import CashFlowChart from '@/components/business/finances/CashFlowChart';
import ProfitLossCard from '@/components/business/finances/ProfitLossCard';
import ExpenseCategoriesChart from '@/components/business/finances/ExpenseCategoriesChart';
import RevenueTrendsChart from '@/components/business/finances/RevenueTrendsChart';
import InvoiceStatusTracker from '@/components/business/finances/InvoiceStatusTracker';
import { Skeleton } from '@/components/ui/skeleton';

interface FinancialData {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  monthlyRevenue: { month: string; amount: number }[];
  monthlyExpenses: { month: string; amount: number }[];
  expensesByCategory: { category: string; amount: number }[];
  invoiceStats: {
    paid: number;
    unpaid: number;
    overdue: number;
  };
}

const BusinessFinancesPage: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [financialData, setFinancialData] = useState<FinancialData | null>(null);
  const [businessId, setBusinessId] = useState<string | null>(null);

  useEffect(() => {
    loadFinancialData();
  }, [user]);

  const loadFinancialData = async () => {
    try {
      setLoading(true);

      // Get user's business
      const { data: businesses, error: bizError } = await supabase
        .from('businesses')
        .select('id')
        .eq('owner_id', user?.id)
        .single();

      if (bizError) throw bizError;
      if (!businesses) {
        toast.error('No business found for your account');
        return;
      }

      setBusinessId(businesses.id);

      // Fetch all financial data in parallel
      const [bookingsData, expensesData, invoicesData] = await Promise.all([
        supabase
          .from('bookings')
          .select('amount, business_amount, created_at, status')
          .eq('business_id', businesses.id)
          .eq('status', 'completed'),
        
        supabase
          .from('expenses')
          .select('amount, category, expense_date')
          .eq('business_id', businesses.id),
        
        supabase
          .from('invoices')
          .select('total_amount, status, due_date, paid_date, created_at')
          .eq('business_id', businesses.id)
      ]);

      // Process revenue from bookings
      const revenue = bookingsData.data || [];
      const totalRevenue = revenue.reduce((sum, booking) => sum + Number(booking.business_amount || booking.amount), 0);

      // Process expenses
      const expenses = expensesData.data || [];
      const totalExpenses = expenses.reduce((sum, exp) => sum + Number(exp.amount), 0);

      // Calculate net profit
      const netProfit = totalRevenue - totalExpenses;

      // Process monthly revenue
      const monthlyRevenueMap = new Map<string, number>();
      revenue.forEach(booking => {
        const month = new Date(booking.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        const current = monthlyRevenueMap.get(month) || 0;
        monthlyRevenueMap.set(month, current + Number(booking.business_amount || booking.amount));
      });

      // Process monthly expenses
      const monthlyExpensesMap = new Map<string, number>();
      expenses.forEach(expense => {
        const month = new Date(expense.expense_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        const current = monthlyExpensesMap.get(month) || 0;
        monthlyExpensesMap.set(month, current + Number(expense.amount));
      });

      // Process expenses by category
      const categoryMap = new Map<string, number>();
      expenses.forEach(expense => {
        const category = expense.category || 'Uncategorized';
        const current = categoryMap.get(category) || 0;
        categoryMap.set(category, current + Number(expense.amount));
      });

      // Process invoice stats
      const invoices = invoicesData.data || [];
      const now = new Date();
      const invoiceStats = {
        paid: invoices.filter(inv => inv.status === 'paid').length,
        unpaid: invoices.filter(inv => inv.status === 'pending').length,
        overdue: invoices.filter(inv => inv.status === 'pending' && new Date(inv.due_date) < now).length,
      };

      setFinancialData({
        totalRevenue,
        totalExpenses,
        netProfit,
        monthlyRevenue: Array.from(monthlyRevenueMap.entries())
          .map(([month, amount]) => ({ month, amount }))
          .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime()),
        monthlyExpenses: Array.from(monthlyExpensesMap.entries())
          .map(([month, amount]) => ({ month, amount }))
          .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime()),
        expensesByCategory: Array.from(categoryMap.entries())
          .map(([category, amount]) => ({ category, amount }))
          .sort((a, b) => b.amount - a.amount),
        invoiceStats
      });
    } catch (error) {
      console.error('Error loading financial data:', error);
      toast.error('Failed to load financial data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Business Finances" icon={<DollarSign className="mr-2 h-6 w-6" />}>
        <div className="space-y-6">
          <Skeleton className="h-32 w-full" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Skeleton className="h-40" />
            <Skeleton className="h-40" />
            <Skeleton className="h-40" />
          </div>
          <Skeleton className="h-96 w-full" />
        </div>
      </DashboardLayout>
    );
  }

  if (!financialData) {
    return (
      <DashboardLayout title="Business Finances" icon={<DollarSign className="mr-2 h-6 w-6" />}>
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">No financial data available yet</p>
          </CardContent>
        </Card>
      </DashboardLayout>
    );
  }

  const profitMargin = financialData.totalRevenue > 0 
    ? ((financialData.netProfit / financialData.totalRevenue) * 100).toFixed(1)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-green-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-[32rem] h-[32rem] bg-emerald-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/3 w-72 h-72 bg-teal-400/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <DashboardLayout title="Business Finances" icon={<DollarSign className="mr-2 h-6 w-6" />}>
        <div className="space-y-6 relative z-10">
          {/* Enhanced Header */}
          <div className="mb-10 animate-fade-in">
            <div className="relative inline-block w-full">
              <div className="absolute inset-0 bg-gradient-to-r from-green-400/30 via-emerald-400/30 to-teal-400/30 rounded-3xl blur-2xl"></div>
              <div className="relative bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border-0 overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500"></div>
                <div className="pt-2">
                  <h2 className="text-4xl font-bold mb-3 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
                    Business <span className="text-yellow-500">Finances</span> 💰
                  </h2>
                  <p className="text-gray-700 text-lg font-medium">
                    Track your revenue, expenses, and financial health 📊
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
          {/* Header with Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <Card className="relative overflow-hidden border-0 shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-green-400/10 to-emerald-400/10"></div>
              <CardHeader className="pb-2 relative z-10">
                <CardDescription className="text-gray-600 font-medium">Total Revenue 💵</CardDescription>
                <CardTitle className="text-3xl text-green-600 flex items-center font-bold">
                  <TrendingUp className="h-6 w-6 mr-2" />
                  ${financialData.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <p className="text-sm text-gray-600 font-medium">From completed bookings</p>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-0 shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-red-400/10 to-rose-400/10"></div>
              <CardHeader className="pb-2 relative z-10">
                <CardDescription className="text-gray-600 font-medium">Total Expenses 📉</CardDescription>
                <CardTitle className="text-3xl text-red-600 flex items-center font-bold">
                  <TrendingDown className="h-6 w-6 mr-2" />
                  ${financialData.totalExpenses.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <p className="text-sm text-gray-600 font-medium">Business operating costs</p>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-0 shadow-xl">
              <div className={`absolute inset-0 bg-gradient-to-br ${financialData.netProfit >= 0 ? 'from-emerald-400/10 to-teal-400/10' : 'from-red-400/10 to-orange-400/10'}`}></div>
              <CardHeader className="pb-2 relative z-10">
                <CardDescription className="text-gray-600 font-medium">Net Profit 💎</CardDescription>
                <CardTitle className={`text-3xl flex items-center font-bold ${financialData.netProfit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                  <DollarSign className="h-6 w-6 mr-2" />
                  ${Math.abs(financialData.netProfit).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <p className="text-sm text-gray-600 font-medium">Profit margin: {profitMargin}%</p>
              </CardContent>
            </Card>
          </div>

        {/* Tabs for Different Views */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="cash-flow">Cash Flow</TabsTrigger>
            <TabsTrigger value="expenses">Expenses</TabsTrigger>
            <TabsTrigger value="invoices">Invoices</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <ProfitLossCard data={financialData} />
              <RevenueTrendsChart data={financialData.monthlyRevenue} />
            </div>
          </TabsContent>

          <TabsContent value="cash-flow" className="space-y-4">
            <CashFlowChart 
              revenueData={financialData.monthlyRevenue}
              expensesData={financialData.monthlyExpenses}
            />
          </TabsContent>

          <TabsContent value="expenses" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <ExpenseCategoriesChart data={financialData.expensesByCategory} />
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Receipt className="h-5 w-5 mr-2" />
                    Expense Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {financialData.expensesByCategory.slice(0, 5).map((item, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm font-medium">{item.category}</span>
                      <span className="text-sm text-muted-foreground">
                        ${item.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="invoices" className="space-y-4">
            <InvoiceStatusTracker 
              stats={financialData.invoiceStats}
              businessId={businessId}
            />
          </TabsContent>
        </Tabs>
        </div>
        </div>
      </DashboardLayout>
    </div>
  );
};

export default BusinessFinancesPage;
