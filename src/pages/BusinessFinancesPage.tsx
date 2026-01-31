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
import { FinancialsTab } from '@/components/business/financials/FinancialsTab';
import { Building2, Calculator, TrendingUp as TrendingUpIcon, Wallet, BookOpen, Repeat, Shield, FileBarChart } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
  const [activeTab, setActiveTab] = useState<string>('overview');

  useEffect(() => {
    loadFinancialData();
  }, [user]);

  const loadFinancialData = async () => {
    try {
      setLoading(true);

      // Get user's business
      const { data: businessList, error: bizError } = await supabase
        .from('businesses')
        .select('id')
        .eq('owner_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(1);

      if (bizError) throw bizError;
      const businesses = businessList && businessList.length > 0 ? businessList[0] : null;
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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-20 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 left-20 w-[32rem] h-[32rem] bg-yellow-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-1/2 left-1/3 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
        </div>

        <DashboardLayout title="Business Finances" icon={<DollarSign className="mr-2 h-6 w-6" />}>
          <div className="space-y-6 relative z-10">
            <Skeleton className="h-32 w-full" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Skeleton className="h-40" />
              <Skeleton className="h-40" />
              <Skeleton className="h-40" />
            </div>
            <Skeleton className="h-96 w-full" />
          </div>
        </DashboardLayout>
      </div>
    );
  }

  if (!financialData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-20 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 left-20 w-[32rem] h-[32rem] bg-yellow-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-1/2 left-1/3 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
        </div>

        <DashboardLayout title="Business Finances" icon={<DollarSign className="mr-2 h-6 w-6" />}>
          <div className="relative z-10 space-y-8">
            {/* Enhanced Empty State Header */}
            <div className="animate-fade-in">
              <div className="relative inline-block w-full">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/30 via-yellow-500/20 to-purple-500/30 rounded-3xl blur-2xl"></div>
                <Card className="relative bg-slate-900/40 backdrop-blur-xl border-white/10 shadow-2xl">
                  <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-500 via-yellow-500 to-purple-500"></div>
                  <CardContent className="p-12 text-center">
                    <DollarSign className="w-20 h-20 mx-auto mb-6 text-yellow-400" />
                    <h3 className="text-3xl font-bold mb-3 text-white">
                      Welcome to Your Financial Dashboard! 💰
                    </h3>
                    <p className="text-white/70 text-lg mb-4">
                      Start tracking your revenue and expenses to see beautiful financial insights! 📊✨
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Quick Action Cards */}
            <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <h3 className="text-2xl font-bold mb-4 text-white">Quick Actions 🎯</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <Button
                  onClick={() => setActiveTab('invoices')}
                  className="h-auto p-0 border-0 bg-transparent hover:bg-transparent"
                >
                  <Card className="relative overflow-hidden bg-slate-900/40 backdrop-blur-xl border-white/10 shadow-xl hover:shadow-2xl transition-all cursor-pointer group w-full">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 group-hover:from-blue-500/20 group-hover:to-cyan-500/20 transition-all"></div>
                    <CardContent className="p-6 relative z-10 text-center">
                      <Receipt className="w-12 h-12 mx-auto mb-3 text-blue-400" />
                      <h4 className="font-bold text-lg mb-2 text-white">Create Invoice 📄</h4>
                      <p className="text-sm text-white/70">Set up billing</p>
                    </CardContent>
                  </Card>
                </Button>

                <Button
                  onClick={() => setActiveTab('expenses')}
                  className="h-auto p-0 border-0 bg-transparent hover:bg-transparent"
                >
                  <Card className="relative overflow-hidden bg-slate-900/40 backdrop-blur-xl border-white/10 shadow-xl hover:shadow-2xl transition-all cursor-pointer group w-full">
                    <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-rose-500/10 group-hover:from-red-500/20 group-hover:to-rose-500/20 transition-all"></div>
                    <CardContent className="p-6 relative z-10 text-center">
                      <TrendingDown className="w-12 h-12 mx-auto mb-3 text-red-400" />
                      <h4 className="font-bold text-lg mb-2 text-white">Log Expense 📉</h4>
                      <p className="text-sm text-white/70">Track business costs</p>
                    </CardContent>
                  </Card>
                </Button>

                <Button
                  onClick={() => setActiveTab('reconciliation')}
                  className="h-auto p-0 border-0 bg-transparent hover:bg-transparent"
                >
                  <Card className="relative overflow-hidden bg-slate-900/40 backdrop-blur-xl border-white/10 shadow-xl hover:shadow-2xl transition-all cursor-pointer group w-full">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-400/10 to-pink-400/10 group-hover:from-purple-400/20 group-hover:to-pink-400/20 transition-all"></div>
                    <CardContent className="p-6 relative z-10 text-center">
                      <Building2 className="w-12 h-12 mx-auto mb-3 text-purple-400" />
                      <h4 className="font-bold text-lg mb-2 text-white">Bank Reconciliation 🏦</h4>
                      <p className="text-sm text-white/70">Match transactions</p>
                    </CardContent>
                  </Card>
                </Button>

                <Button
                  onClick={() => setActiveTab('budget')}
                  className="h-auto p-0 border-0 bg-transparent hover:bg-transparent"
                >
                  <Card className="relative overflow-hidden bg-slate-900/40 backdrop-blur-xl border-white/10 shadow-xl hover:shadow-2xl transition-all cursor-pointer group w-full">
                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 to-orange-400/10 group-hover:from-yellow-400/20 group-hover:to-orange-400/20 transition-all"></div>
                    <CardContent className="p-6 relative z-10 text-center">
                      <Calculator className="w-12 h-12 mx-auto mb-3 text-yellow-400" />
                      <h4 className="font-bold text-lg mb-2 text-white">Budget Planning 💰</h4>
                      <p className="text-sm text-white/70">Set spending limits</p>
                    </CardContent>
                  </Card>
                </Button>
              </div>

              {/* Additional Action Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Button
                  onClick={() => setActiveTab('pl-reports')}
                  className="h-auto p-0 border-0 bg-transparent hover:bg-transparent"
                >
                  <Card className="relative overflow-hidden bg-slate-900/40 backdrop-blur-xl border-white/10 shadow-xl hover:shadow-2xl transition-all cursor-pointer group w-full">
                    <div className="absolute inset-0 bg-gradient-to-br from-green-400/10 to-emerald-400/10 group-hover:from-green-400/20 group-hover:to-emerald-400/20 transition-all"></div>
                    <CardContent className="p-6 relative z-10 text-center">
                      <TrendingUpIcon className="w-12 h-12 mx-auto mb-3 text-green-400" />
                      <h4 className="font-bold text-lg mb-2 text-white">P&L Reports 📊</h4>
                      <p className="text-sm text-white/70">Profit & loss analysis</p>
                    </CardContent>
                  </Card>
                </Button>

                <Button
                  onClick={() => setActiveTab('cashflow')}
                  className="h-auto p-0 border-0 bg-transparent hover:bg-transparent"
                >
                  <Card className="relative overflow-hidden bg-slate-900/40 backdrop-blur-xl border-white/10 shadow-xl hover:shadow-2xl transition-all cursor-pointer group w-full">
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/10 to-blue-400/10 group-hover:from-cyan-400/20 group-hover:to-blue-400/20 transition-all"></div>
                    <CardContent className="p-6 relative z-10 text-center">
                      <Wallet className="w-12 h-12 mx-auto mb-3 text-cyan-400" />
                      <h4 className="font-bold text-lg mb-2 text-white">Cash Flow 💸</h4>
                      <p className="text-sm text-white/70">Monitor liquidity</p>
                    </CardContent>
                  </Card>
                </Button>

                <Button
                  onClick={() => setActiveTab('balance-sheet')}
                  className="h-auto p-0 border-0 bg-transparent hover:bg-transparent"
                >
                  <Card className="relative overflow-hidden bg-slate-900/40 backdrop-blur-xl border-white/10 shadow-xl hover:shadow-2xl transition-all cursor-pointer group w-full">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-400/10 to-purple-400/10 group-hover:from-indigo-400/20 group-hover:to-purple-400/20 transition-all"></div>
                    <CardContent className="p-6 relative z-10 text-center">
                      <BookOpen className="w-12 h-12 mx-auto mb-3 text-indigo-400" />
                      <h4 className="font-bold text-lg mb-2 text-white">Balance Sheet 📚</h4>
                      <p className="text-sm text-white/70">Assets & liabilities</p>
                    </CardContent>
                  </Card>
                </Button>

                <Button
                  onClick={() => setActiveTab('taxes')}
                  className="h-auto p-0 border-0 bg-transparent hover:bg-transparent"
                >
                  <Card className="relative overflow-hidden bg-slate-900/40 backdrop-blur-xl border-white/10 shadow-xl hover:shadow-2xl transition-all cursor-pointer group w-full">
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-400/10 to-yellow-400/10 group-hover:from-amber-400/20 group-hover:to-yellow-400/20 transition-all"></div>
                    <CardContent className="p-6 relative z-10 text-center">
                      <Shield className="w-12 h-12 mx-auto mb-3 text-amber-400" />
                      <h4 className="font-bold text-lg mb-2 text-white">Tax Settings 🛡️</h4>
                      <p className="text-sm text-white/70">Manage tax rates</p>
                    </CardContent>
                  </Card>
                </Button>

                <Button
                  onClick={() => setActiveTab('receivables')}
                  className="h-auto p-0 border-0 bg-transparent hover:bg-transparent"
                >
                  <Card className="relative overflow-hidden bg-slate-900/40 backdrop-blur-xl border-white/10 shadow-xl hover:shadow-2xl transition-all cursor-pointer group w-full">
                    <div className="absolute inset-0 bg-gradient-to-br from-rose-400/10 to-pink-400/10 group-hover:from-rose-400/20 group-hover:to-pink-400/20 transition-all"></div>
                    <CardContent className="p-6 relative z-10 text-center">
                      <FileText className="w-12 h-12 mx-auto mb-3 text-rose-400" />
                      <h4 className="font-bold text-lg mb-2 text-white">Accounts Receivable 💳</h4>
                      <p className="text-sm text-white/70">Track outstanding payments</p>
                    </CardContent>
                  </Card>
                </Button>

                <Button
                  onClick={() => setActiveTab('recurring')}
                  className="h-auto p-0 border-0 bg-transparent hover:bg-transparent"
                >
                  <Card className="relative overflow-hidden bg-slate-900/40 backdrop-blur-xl border-white/10 shadow-xl hover:shadow-2xl transition-all cursor-pointer group w-full">
                    <div className="absolute inset-0 bg-gradient-to-br from-teal-400/10 to-cyan-400/10 group-hover:from-teal-400/20 group-hover:to-cyan-400/20 transition-all"></div>
                    <CardContent className="p-6 relative z-10 text-center">
                      <Repeat className="w-12 h-12 mx-auto mb-3 text-teal-400" />
                      <h4 className="font-bold text-lg mb-2 text-white">Recurring Invoices 🔄</h4>
                      <p className="text-sm text-white/70">Automate billing</p>
                    </CardContent>
                  </Card>
                </Button>

                <Button
                  onClick={() => setActiveTab('assets')}
                  className="h-auto p-0 border-0 bg-transparent hover:bg-transparent"
                >
                  <Card className="relative overflow-hidden bg-slate-900/40 backdrop-blur-xl border-white/10 shadow-xl hover:shadow-2xl transition-all cursor-pointer group w-full">
                    <div className="absolute inset-0 bg-gradient-to-br from-violet-400/10 to-purple-400/10 group-hover:from-violet-400/20 group-hover:to-purple-400/20 transition-all"></div>
                    <CardContent className="p-6 relative z-10 text-center">
                      <Building2 className="w-12 h-12 mx-auto mb-3 text-violet-400" />
                      <h4 className="font-bold text-lg mb-2 text-white">Fixed Assets 🏢</h4>
                      <p className="text-sm text-white/70">Manage property & equipment</p>
                    </CardContent>
                  </Card>
                </Button>

                <Button
                  onClick={() => setActiveTab('audit')}
                  className="h-auto p-0 border-0 bg-transparent hover:bg-transparent"
                >
                  <Card className="relative overflow-hidden bg-slate-900/40 backdrop-blur-xl border-white/10 shadow-xl hover:shadow-2xl transition-all cursor-pointer group w-full">
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-400/10 to-gray-400/10 group-hover:from-slate-400/20 group-hover:to-gray-400/20 transition-all"></div>
                    <CardContent className="p-6 relative z-10 text-center">
                      <FileBarChart className="w-12 h-12 mx-auto mb-3 text-slate-400" />
                      <h4 className="font-bold text-lg mb-2 text-white">Audit Log 📝</h4>
                      <p className="text-sm text-white/70">Track all changes</p>
                    </CardContent>
                  </Card>
                </Button>
              </div>
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Getting Started Checklist */}
              <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <h3 className="text-2xl font-bold mb-4 text-white">Getting Started ✅</h3>
                <Card className="bg-slate-900/40 backdrop-blur-xl border-white/10 shadow-xl">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/30 hover:bg-slate-800/40 transition-all cursor-pointer border border-white/10">
                      <div className="w-6 h-6 rounded-full border-2 border-white/30 flex items-center justify-center">
                        <div className="w-3 h-3 rounded-full bg-green-400"></div>
                      </div>
                      <span className="text-white font-medium">Set up your business profile</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/30 hover:bg-slate-800/40 transition-all cursor-pointer border border-white/10">
                      <div className="w-6 h-6 rounded-full border-2 border-white/30"></div>
                      <span className="text-white/70">Record your first transaction</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/30 hover:bg-slate-800/40 transition-all cursor-pointer border border-white/10">
                      <div className="w-6 h-6 rounded-full border-2 border-white/30"></div>
                      <span className="text-white/70">Add expense categories</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/30 hover:bg-slate-800/40 transition-all cursor-pointer border border-white/10">
                      <div className="w-6 h-6 rounded-full border-2 border-white/30"></div>
                      <span className="text-white/70">Configure tax settings</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/30 hover:bg-slate-800/40 transition-all cursor-pointer border border-white/10">
                      <div className="w-6 h-6 rounded-full border-2 border-white/30"></div>
                      <span className="text-white/70">Connect payment methods</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Financial Tips Widget */}
              <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
                <h3 className="text-2xl font-bold mb-4 text-white">Financial Tips 💡</h3>
                <Card className="bg-slate-900/40 backdrop-blur-xl border-white/10 shadow-xl">
                  <CardContent className="p-6 space-y-4">
                    <div className="p-4 rounded-lg bg-white/80 backdrop-blur-sm border-l-4 border-amber-500">
                      <p className="text-gray-800 font-medium">💰 Track every expense, no matter how small</p>
                      <p className="text-sm text-gray-600 mt-2">Small expenses add up quickly. Recording everything helps you understand true costs.</p>
                    </div>
                    <div className="p-4 rounded-lg bg-white/80 backdrop-blur-sm border-l-4 border-emerald-500">
                      <p className="text-gray-800 font-medium">📊 Review your finances weekly</p>
                      <p className="text-sm text-gray-600 mt-2">Regular check-ins help you spot trends and make timely adjustments.</p>
                    </div>
                    <div className="p-4 rounded-lg bg-white/80 backdrop-blur-sm border-l-4 border-blue-500">
                      <p className="text-gray-800 font-medium">🎯 Aim for 20%+ profit margins</p>
                      <p className="text-sm text-gray-600 mt-2">Healthy margins ensure business sustainability and growth.</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Financial Health Preview */}
            <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <h3 className="text-2xl font-bold mb-4 text-white">Preview: What You'll See 📊</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-slate-900/40 backdrop-blur-xl border-white/10 shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-lg text-white">Cash Flow Chart 💸</CardTitle>
                    <CardDescription className="text-white/70">Track money in vs. money out</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-48 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-lg flex items-center justify-center border border-white/10">
                      <div className="text-center">
                        <PieChart className="w-16 h-16 mx-auto mb-2 text-emerald-400" />
                        <p className="text-sm text-white/70">Sample chart appears here</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-900/40 backdrop-blur-xl border-white/10 shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-lg text-white">Expense Breakdown 📉</CardTitle>
                    <CardDescription className="text-white/70">See where your money goes</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-48 bg-gradient-to-br from-red-500/20 to-rose-500/20 rounded-lg flex items-center justify-center border border-white/10">
                      <div className="text-center">
                        <PieChart className="w-16 h-16 mx-auto mb-2 text-red-400" />
                        <p className="text-sm text-white/70">Category breakdown appears here</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Demo Mode Toggle */}
            <div className="animate-fade-in text-center" style={{ animationDelay: '0.5s' }}>
              <Card className="bg-slate-900/40 backdrop-blur-xl border-white/10 shadow-xl inline-block">
                <CardContent className="p-6">
                  <h4 className="text-xl font-bold mb-3 text-white">Want to explore? 🎭</h4>
                  <p className="text-white/70 mb-4">Try the dashboard with sample data to see all features in action!</p>
                  <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-yellow-500 text-white font-bold rounded-lg hover:shadow-xl transition-all transform hover:scale-105">
                    Show Demo Data ✨
                  </button>
                </CardContent>
              </Card>
            </div>
          </div>
        </DashboardLayout>
      </div>
    );
  }

  const profitMargin = financialData.totalRevenue > 0 
    ? ((financialData.netProfit / financialData.totalRevenue) * 100).toFixed(1)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 left-20 w-[32rem] h-[32rem] bg-yellow-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/3 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      <DashboardLayout title="Business Finances" icon={<DollarSign className="mr-2 h-6 w-6" />}>
        <div className="space-y-6 relative z-10">
          {/* Enhanced Header */}
          <div className="mb-10 animate-fade-in">
            <div className="relative inline-block w-full">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/30 via-yellow-500/20 to-purple-500/30 rounded-3xl blur-2xl"></div>
              <div className="relative bg-slate-900/40 backdrop-blur-xl border-white/10 rounded-3xl p-8 shadow-2xl overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-500 via-yellow-500 to-purple-500"></div>
                <div className="pt-2">
                  <h2 className="text-4xl font-bold mb-3 text-white">
                    Business <span className="text-yellow-400">Finances</span> 💰
                  </h2>
                  <p className="text-white/70 text-lg font-medium">
                    Track your revenue, expenses, and financial health 📊
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
          {/* Header with Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <Card className="relative overflow-hidden bg-slate-900/40 backdrop-blur-xl border-white/10 shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10"></div>
              <CardHeader className="pb-2 relative z-10">
                <CardDescription className="text-white/70 font-medium">Total Revenue 💵</CardDescription>
                <CardTitle className="text-3xl text-green-400 flex items-center font-bold">
                  <TrendingUp className="h-6 w-6 mr-2" />
                  ${financialData.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <p className="text-sm text-white/60 font-medium">From completed bookings</p>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden bg-slate-900/40 backdrop-blur-xl border-white/10 shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-rose-500/10"></div>
              <CardHeader className="pb-2 relative z-10">
                <CardDescription className="text-white/70 font-medium">Total Expenses 📉</CardDescription>
                <CardTitle className="text-3xl text-red-400 flex items-center font-bold">
                  <TrendingDown className="h-6 w-6 mr-2" />
                  ${financialData.totalExpenses.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <p className="text-sm text-white/60 font-medium">Business operating costs</p>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden bg-slate-900/40 backdrop-blur-xl border-white/10 shadow-xl">
              <div className={`absolute inset-0 bg-gradient-to-br ${financialData.netProfit >= 0 ? 'from-emerald-500/10 to-teal-500/10' : 'from-red-500/10 to-orange-500/10'}`}></div>
              <CardHeader className="pb-2 relative z-10">
                <CardDescription className="text-white/70 font-medium">Net Profit 💎</CardDescription>
                <CardTitle className={`text-3xl flex items-center font-bold ${financialData.netProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  <DollarSign className="h-6 w-6 mr-2" />
                  ${Math.abs(financialData.netProfit).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <p className="text-sm text-white/60 font-medium">Profit margin: {profitMargin}%</p>
              </CardContent>
            </Card>
          </div>

        {/* Tabs for Different Views */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="cash-flow">Cash Flow</TabsTrigger>
            <TabsTrigger value="expenses">Expenses</TabsTrigger>
            <TabsTrigger value="invoices">Invoices</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <ProfitLossCard 
                data={{
                  totalRevenue: financialData.totalRevenue,
                  totalExpenses: financialData.totalExpenses,
                  netProfit: financialData.netProfit
                }}
              />
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

          {/* Full Accounting System Tabs */}
          <TabsContent value="pl-reports">
            <FinancialsTab businessId={businessId} defaultTab="pl-reports" />
          </TabsContent>
          <TabsContent value="balance-sheet">
            <FinancialsTab businessId={businessId} defaultTab="balance-sheet" />
          </TabsContent>
          <TabsContent value="cashflow">
            <FinancialsTab businessId={businessId} defaultTab="cashflow" />
          </TabsContent>
          <TabsContent value="reconciliation">
            <FinancialsTab businessId={businessId} defaultTab="reconciliation" />
          </TabsContent>
          <TabsContent value="budget">
            <FinancialsTab businessId={businessId} defaultTab="budget" />
          </TabsContent>
          <TabsContent value="taxes">
            <FinancialsTab businessId={businessId} defaultTab="taxes" />
          </TabsContent>
          <TabsContent value="receivables">
            <FinancialsTab businessId={businessId} defaultTab="receivables" />
          </TabsContent>
          <TabsContent value="recurring">
            <FinancialsTab businessId={businessId} defaultTab="recurring" />
          </TabsContent>
          <TabsContent value="assets">
            <FinancialsTab businessId={businessId} defaultTab="assets" />
          </TabsContent>
          <TabsContent value="audit">
            <FinancialsTab businessId={businessId} defaultTab="audit" />
          </TabsContent>
        </Tabs>
        </div>
        </div>
      </DashboardLayout>
    </div>
  );
};

export default BusinessFinancesPage;
