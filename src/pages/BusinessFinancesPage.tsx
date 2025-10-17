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
    <DashboardLayout title="Business Finances" icon={<DollarSign className="mr-2 h-6 w-6" />}>
      <div className="space-y-6">
        {/* Header with Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Revenue</CardDescription>
              <CardTitle className="text-3xl text-green-600 flex items-center">
                <TrendingUp className="h-6 w-6 mr-2" />
                ${financialData.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">From completed bookings</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Expenses</CardDescription>
              <CardTitle className="text-3xl text-red-600 flex items-center">
                <TrendingDown className="h-6 w-6 mr-2" />
                ${financialData.totalExpenses.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Business operating costs</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Net Profit</CardDescription>
              <CardTitle className={`text-3xl flex items-center ${financialData.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                <DollarSign className="h-6 w-6 mr-2" />
                ${Math.abs(financialData.netProfit).toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Profit margin: {profitMargin}%</p>
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
    </DashboardLayout>
  );
};

export default BusinessFinancesPage;
