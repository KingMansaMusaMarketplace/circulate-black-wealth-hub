import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Plus, TrendingUp, TrendingDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { Progress } from "@/components/ui/progress";

interface BudgetVsActualProps {
  businessId: string;
}

const EXPENSE_CATEGORIES = [
  'Rent', 'Utilities', 'Supplies', 'Marketing', 'Salaries',
  'Insurance', 'Equipment', 'Software', 'Professional Services', 'Other'
];

export const BudgetVsActual: React.FC<BudgetVsActualProps> = ({ businessId }) => {
  const [loading, setLoading] = useState(true);
  const [budgets, setBudgets] = useState<any[]>([]);
  const [comparisons, setComparisons] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    budget_name: '',
    category: '',
    amount: '',
    period_type: 'monthly',
    start_date: format(new Date(), 'yyyy-MM-dd')
  });
  const { toast } = useToast();

  useEffect(() => {
    loadBudgets();
  }, [businessId]);

  const loadBudgets = async () => {
    try {
      const { data: budgetsData, error: budgetsError } = await supabase
        .from('budgets')
        .select('*')
        .eq('business_id', businessId)
        .eq('is_active', true)
        .order('category');

      if (budgetsError) throw budgetsError;

      // For each budget, get actual expenses
      const comparisonsData = await Promise.all((budgetsData || []).map(async (budget) => {
        const { data: actualExpenses } = await supabase
          .from('expenses')
          .select('amount')
          .eq('business_id', businessId)
          .eq('category', budget.category)
          .gte('expense_date', budget.start_date)
          .lte('expense_date', budget.end_date);

        const actualAmount = actualExpenses?.reduce((sum, e) => sum + Number(e.amount), 0) || 0;
        const budgetAmount = Number(budget.amount);
        const variance = budgetAmount - actualAmount;
        const percentUsed = budgetAmount > 0 ? (actualAmount / budgetAmount) * 100 : 0;

        return {
          ...budget,
          actualAmount,
          variance,
          percentUsed
        };
      }));

      setBudgets(budgetsData || []);
      setComparisons(comparisonsData);
    } catch (error) {
      console.error('Error loading budgets:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateEndDate = (startDate: string, periodType: string) => {
    const start = new Date(startDate);
    let end = new Date(start);

    switch (periodType) {
      case 'monthly':
        end.setMonth(end.getMonth() + 1);
        break;
      case 'quarterly':
        end.setMonth(end.getMonth() + 3);
        break;
      case 'yearly':
        end.setFullYear(end.getFullYear() + 1);
        break;
    }

    return end.toISOString().split('T')[0];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const endDate = calculateEndDate(formData.start_date, formData.period_type);

      const { error } = await supabase.from('budgets').insert({
        business_id: businessId,
        budget_name: formData.budget_name,
        category: formData.category,
        amount: parseFloat(formData.amount),
        period_type: formData.period_type,
        start_date: formData.start_date,
        end_date: endDate
      });

      if (error) throw error;

      toast({ title: 'Success', description: 'Budget created successfully' });
      setIsDialogOpen(false);
      setFormData({
        budget_name: '',
        category: '',
        amount: '',
        period_type: 'monthly',
        start_date: format(new Date(), 'yyyy-MM-dd')
      });
      loadBudgets();
    } catch (error) {
      console.error('Error creating budget:', error);
      toast({ title: 'Error', description: 'Failed to create budget', variant: 'destructive' });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const totalBudget = comparisons.reduce((sum, c) => sum + Number(c.amount), 0);
  const totalActual = comparisons.reduce((sum, c) => sum + c.actualAmount, 0);
  const totalVariance = totalBudget - totalActual;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold">Budget vs Actual</h3>
          <p className="text-muted-foreground">Compare your budgets with actual spending</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Budget
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Budget</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Budget Name</Label>
                <Input
                  value={formData.budget_name}
                  onChange={(e) => setFormData({ ...formData, budget_name: e.target.value })}
                  placeholder="Q1 Marketing Budget"
                  required
                />
              </div>
              <div>
                <Label>Category</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {EXPENSE_CATEGORIES.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Amount</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label>Period Type</Label>
                <Select value={formData.period_type} onValueChange={(value) => setFormData({ ...formData, period_type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Start Date</Label>
                <Input
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  required
                />
              </div>
              <Button type="submit" className="w-full">Create Budget</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {budgets.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-lg font-medium mb-2">No budgets created</p>
            <p className="text-muted-foreground mb-4">Create your first budget to track spending</p>
            <Button onClick={() => setIsDialogOpen(true)}>Create Budget</Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${totalBudget.toFixed(2)}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Total Actual</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${totalActual.toFixed(2)}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Variance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold flex items-center gap-1 ${totalVariance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {totalVariance >= 0 ? <TrendingDown className="h-5 w-5" /> : <TrendingUp className="h-5 w-5" />}
                  ${Math.abs(totalVariance).toFixed(2)}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-3">
            {comparisons.map((comparison) => (
              <Card key={comparison.id}>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold">{comparison.budget_name}</h4>
                        <p className="text-sm text-muted-foreground capitalize">{comparison.category} • {comparison.period_type}</p>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold ${comparison.variance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {comparison.variance >= 0 ? 'Under' : 'Over'} by ${Math.abs(comparison.variance).toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Budget: ${Number(comparison.amount).toFixed(2)}</span>
                        <span>Actual: ${comparison.actualAmount.toFixed(2)}</span>
                      </div>
                      <Progress value={Math.min(comparison.percentUsed, 100)} className="h-2" />
                      <p className="text-xs text-muted-foreground mt-1">
                        {comparison.percentUsed.toFixed(1)}% used
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
