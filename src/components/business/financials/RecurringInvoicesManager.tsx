import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Plus, Calendar, Pause, Play, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { Switch } from '@/components/ui/switch';

interface RecurringInvoicesManagerProps {
  businessId: string;
}

interface RecurringInvoice {
  id: string;
  customer_name: string;
  customer_email: string;
  frequency: string;
  next_invoice_date: string;
  total_amount: number;
  is_active: boolean;
  last_generated_at: string | null;
}

export const RecurringInvoicesManager: React.FC<RecurringInvoicesManagerProps> = ({ businessId }) => {
  const [loading, setLoading] = useState(true);
  const [recurringInvoices, setRecurringInvoices] = useState<RecurringInvoice[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    frequency: 'monthly',
    next_invoice_date: format(new Date(), 'yyyy-MM-dd'),
    amount: '',
    description: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    loadRecurringInvoices();
  }, [businessId]);

  const loadRecurringInvoices = async () => {
    try {
      const { data, error } = await supabase
        .from('recurring_invoices')
        .select('*')
        .eq('business_id', businessId)
        .order('next_invoice_date', { ascending: true });

      if (error) throw error;
      setRecurringInvoices(data || []);
    } catch (error) {
      console.error('Error loading recurring invoices:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const amount = parseFloat(formData.amount);
      if (isNaN(amount) || amount <= 0) {
        toast({
          title: 'Invalid Amount',
          description: 'Please enter a valid amount',
          variant: 'destructive'
        });
        return;
      }

      const lineItems = [{
        description: formData.description || 'Service',
        quantity: 1,
        unit_price: amount,
        total: amount
      }];

      const { error } = await supabase.from('recurring_invoices').insert({
        business_id: businessId,
        customer_name: formData.customer_name,
        customer_email: formData.customer_email,
        frequency: formData.frequency,
        next_invoice_date: formData.next_invoice_date,
        subtotal: amount,
        tax_rate: 0,
        tax_amount: 0,
        total_amount: amount,
        line_items: lineItems,
        is_active: true
      });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Recurring invoice created successfully',
      });

      setIsDialogOpen(false);
      setFormData({
        customer_name: '',
        customer_email: '',
        frequency: 'monthly',
        next_invoice_date: format(new Date(), 'yyyy-MM-dd'),
        amount: '',
        description: ''
      });
      loadRecurringInvoices();
    } catch (error) {
      console.error('Error creating recurring invoice:', error);
      toast({
        title: 'Error',
        description: 'Failed to create recurring invoice',
        variant: 'destructive'
      });
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('recurring_invoices')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: `Recurring invoice ${!currentStatus ? 'activated' : 'paused'}`,
      });

      loadRecurringInvoices();
    } catch (error) {
      console.error('Error toggling recurring invoice:', error);
      toast({
        title: 'Error',
        description: 'Failed to update recurring invoice',
        variant: 'destructive'
      });
    }
  };

  const deleteRecurringInvoice = async (id: string) => {
    try {
      const { error } = await supabase
        .from('recurring_invoices')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Recurring invoice deleted',
      });

      loadRecurringInvoices();
    } catch (error) {
      console.error('Error deleting recurring invoice:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete recurring invoice',
        variant: 'destructive'
      });
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
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Recurring Invoices
            </CardTitle>
            <CardDescription>Automate invoice generation</CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Recurring Invoice
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Recurring Invoice</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="customer_name">Customer Name</Label>
                  <Input
                    id="customer_name"
                    value={formData.customer_name}
                    onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="customer_email">Customer Email</Label>
                  <Input
                    id="customer_email"
                    type="email"
                    value={formData.customer_email}
                    onChange={(e) => setFormData({ ...formData, customer_email: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="frequency">Frequency</Label>
                  <Select value={formData.frequency} onValueChange={(value) => setFormData({ ...formData, frequency: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="next_invoice_date">Next Invoice Date</Label>
                  <Input
                    id="next_invoice_date"
                    type="date"
                    value={formData.next_invoice_date}
                    onChange={(e) => setFormData({ ...formData, next_invoice_date: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Optional"
                  />
                </div>
                <Button type="submit" className="w-full">Create</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {recurringInvoices.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">No recurring invoices set up</p>
        ) : (
          <div className="space-y-3">
            {recurringInvoices.map((invoice) => (
              <div key={invoice.id} className={`p-4 border rounded-lg ${!invoice.is_active && 'opacity-50'}`}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium">{invoice.customer_name}</p>
                    <p className="text-sm text-muted-foreground">{invoice.customer_email}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleActive(invoice.id, invoice.is_active)}
                    >
                      {invoice.is_active ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteRecurringInvoice(invoice.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="capitalize">{invoice.frequency}</span>
                  <span className="font-semibold">${Number(invoice.total_amount).toFixed(2)}</span>
                </div>
                <div className="mt-2 text-xs text-muted-foreground">
                  Next: {format(new Date(invoice.next_invoice_date), 'MMM d, yyyy')}
                  {invoice.last_generated_at && (
                    <span className="ml-2">
                      Last: {format(new Date(invoice.last_generated_at), 'MMM d, yyyy')}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
