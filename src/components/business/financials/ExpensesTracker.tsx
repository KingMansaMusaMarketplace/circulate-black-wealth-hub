import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { validateExpense } from '@/lib/validation/financial-validation';
import { ZodError } from 'zod';

interface ExpensesTrackerProps {
  businessId: string;
}

const EXPENSE_CATEGORIES = [
  'Rent', 'Utilities', 'Supplies', 'Marketing', 'Salaries', 
  'Insurance', 'Equipment', 'Software', 'Professional Services', 'Other'
];

export const ExpensesTracker: React.FC<ExpensesTrackerProps> = ({ businessId }) => {
  const [loading, setLoading] = useState(true);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    description: '',
    expense_date: format(new Date(), 'yyyy-MM-dd')
  });
  const { toast } = useToast();

  useEffect(() => {
    loadExpenses();
  }, [businessId]);

  const loadExpenses = async () => {
    try {
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .eq('business_id', businessId)
        .order('expense_date', { ascending: false });

      if (error) throw error;
      setExpenses(data || []);
    } catch (error) {
      console.error('Error loading expenses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // SECURITY: Validate all input data before database operation
      const validatedData = validateExpense({
        business_id: businessId,
        amount: formData.amount,
        category: formData.category,
        description: formData.description || undefined,
        expense_date: formData.expense_date
      });

      const { error } = await supabase.from('expenses').insert({
        business_id: validatedData.business_id,
        amount: validatedData.amount,
        category: validatedData.category,
        description: validatedData.description,
        expense_date: validatedData.expense_date.toISOString().split('T')[0]
      });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Expense added successfully',
      });

      setIsDialogOpen(false);
      setFormData({
        amount: '',
        category: '',
        description: '',
        expense_date: format(new Date(), 'yyyy-MM-dd')
      });
      loadExpenses();
    } catch (error) {
      console.error('Error adding expense:', error);
      
      if (error instanceof ZodError) {
        // Show specific validation errors
        const firstError = error.errors[0];
        toast({
          title: 'Validation Error',
          description: firstError.message,
          variant: 'destructive'
        });
      } else {
        toast({
          title: 'Error',
          description: 'Failed to add expense',
          variant: 'destructive'
        });
      }
    }
  };

  const deleteExpense = async (id: string) => {
    try {
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Expense deleted successfully',
      });
      loadExpenses();
    } catch (error) {
      console.error('Error deleting expense:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete expense',
        variant: 'destructive'
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold">Expense Tracker</h3>
          <p className="text-muted-foreground">Track your business expenses</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Expense
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Expense</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  required
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="0.00"
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                  required
                >
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
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description"
                />
              </div>
              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  required
                  value={formData.expense_date}
                  onChange={(e) => setFormData({ ...formData, expense_date: e.target.value })}
                />
              </div>
              <Button type="submit" className="w-full">Add Expense</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Total Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">${totalExpenses.toFixed(2)}</p>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {expenses.map((expense) => (
          <Card key={expense.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h4 className="font-semibold">{expense.category}</h4>
                    <span className="text-sm text-muted-foreground">
                      {format(new Date(expense.expense_date), 'MMM dd, yyyy')}
                    </span>
                  </div>
                  {expense.description && (
                    <p className="text-sm text-muted-foreground">{expense.description}</p>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  <p className="text-xl font-bold">${Number(expense.amount).toFixed(2)}</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteExpense(expense.id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};