import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Plus, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { Badge } from "@/components/ui/badge";

interface BankReconciliationProps {
  businessId: string;
}

export const BankReconciliation: React.FC<BankReconciliationProps> = ({ businessId }) => {
  const [loading, setLoading] = useState(true);
  const [bankAccounts, setBankAccounts] = useState<any[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<string>('');
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAddAccountOpen, setIsAddAccountOpen] = useState(false);
  const [formData, setFormData] = useState({
    transaction_date: format(new Date(), 'yyyy-MM-dd'),
    description: '',
    amount: '',
    transaction_type: 'debit'
  });
  const [accountForm, setAccountForm] = useState({
    account_name: '',
    account_type: 'checking',
    bank_name: '',
    account_number_last4: '',
    current_balance: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    loadBankAccounts();
  }, [businessId]);

  useEffect(() => {
    if (selectedAccount) {
      loadTransactions();
    }
  }, [selectedAccount]);

  const loadBankAccounts = async () => {
    try {
      const { data, error } = await supabase
        .from('bank_accounts')
        .select('*')
        .eq('business_id', businessId)
        .eq('is_active', true);

      if (error) throw error;
      setBankAccounts(data || []);
      if (data && data.length > 0 && !selectedAccount) {
        setSelectedAccount(data[0].id);
      }
    } catch (error) {
      console.error('Error loading bank accounts:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadTransactions = async () => {
    try {
      const { data, error } = await supabase
        .from('bank_transactions')
        .select('*')
        .eq('bank_account_id', selectedAccount)
        .order('transaction_date', { ascending: false })
        .limit(50);

      if (error) throw error;
      setTransactions(data || []);
    } catch (error) {
      console.error('Error loading transactions:', error);
    }
  };

  const handleAddAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from('bank_accounts').insert({
        business_id: businessId,
        account_name: accountForm.account_name,
        account_type: accountForm.account_type,
        bank_name: accountForm.bank_name,
        account_number_last4: accountForm.account_number_last4,
        current_balance: parseFloat(accountForm.current_balance)
      });

      if (error) throw error;

      toast({ title: 'Success', description: 'Bank account added' });
      setIsAddAccountOpen(false);
      setAccountForm({
        account_name: '',
        account_type: 'checking',
        bank_name: '',
        account_number_last4: '',
        current_balance: ''
      });
      loadBankAccounts();
    } catch (error) {
      console.error('Error adding account:', error);
      toast({ title: 'Error', description: 'Failed to add account', variant: 'destructive' });
    }
  };

  const handleAddTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from('bank_transactions').insert({
        bank_account_id: selectedAccount,
        business_id: businessId,
        transaction_date: formData.transaction_date,
        description: formData.description,
        amount: parseFloat(formData.amount),
        transaction_type: formData.transaction_type
      });

      if (error) throw error;

      toast({ title: 'Success', description: 'Transaction added' });
      setIsDialogOpen(false);
      setFormData({
        transaction_date: format(new Date(), 'yyyy-MM-dd'),
        description: '',
        amount: '',
        transaction_type: 'debit'
      });
      loadTransactions();
    } catch (error) {
      console.error('Error adding transaction:', error);
      toast({ title: 'Error', description: 'Failed to add transaction', variant: 'destructive' });
    }
  };

  const toggleReconcile = async (transactionId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('bank_transactions')
        .update({
          is_reconciled: !currentStatus,
          reconciled_at: !currentStatus ? new Date().toISOString() : null
        })
        .eq('id', transactionId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: `Transaction ${!currentStatus ? 'reconciled' : 'unreconciled'}`
      });
      loadTransactions();
    } catch (error) {
      console.error('Error updating transaction:', error);
      toast({ title: 'Error', description: 'Failed to update transaction', variant: 'destructive' });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const reconciledCount = transactions.filter(t => t.is_reconciled).length;
  const unreconciledCount = transactions.length - reconciledCount;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold">Bank Reconciliation</h3>
          <p className="text-muted-foreground">Match bank statements with your records</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isAddAccountOpen} onOpenChange={setIsAddAccountOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">Add Bank Account</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Bank Account</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddAccount} className="space-y-4">
                <div>
                  <Label>Account Name</Label>
                  <Input
                    value={accountForm.account_name}
                    onChange={(e) => setAccountForm({ ...accountForm, account_name: e.target.value })}
                    placeholder="Business Checking"
                    required
                  />
                </div>
                <div>
                  <Label>Account Type</Label>
                  <Select value={accountForm.account_type} onValueChange={(value) => setAccountForm({ ...accountForm, account_type: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="checking">Checking</SelectItem>
                      <SelectItem value="savings">Savings</SelectItem>
                      <SelectItem value="credit_card">Credit Card</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Bank Name</Label>
                  <Input
                    value={accountForm.bank_name}
                    onChange={(e) => setAccountForm({ ...accountForm, bank_name: e.target.value })}
                    placeholder="Chase Bank"
                  />
                </div>
                <div>
                  <Label>Last 4 Digits</Label>
                  <Input
                    value={accountForm.account_number_last4}
                    onChange={(e) => setAccountForm({ ...accountForm, account_number_last4: e.target.value })}
                    placeholder="1234"
                    maxLength={4}
                  />
                </div>
                <div>
                  <Label>Current Balance</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={accountForm.current_balance}
                    onChange={(e) => setAccountForm({ ...accountForm, current_balance: e.target.value })}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">Add Account</Button>
              </form>
            </DialogContent>
          </Dialog>
          {bankAccounts.length > 0 && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Transaction
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Bank Transaction</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddTransaction} className="space-y-4">
                  <div>
                    <Label>Date</Label>
                    <Input
                      type="date"
                      value={formData.transaction_date}
                      onChange={(e) => setFormData({ ...formData, transaction_date: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Input
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      required
                    />
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
                    <Label>Type</Label>
                    <Select value={formData.transaction_type} onValueChange={(value) => setFormData({ ...formData, transaction_type: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="debit">Debit (Money Out)</SelectItem>
                        <SelectItem value="credit">Credit (Money In)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button type="submit" className="w-full">Add Transaction</Button>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      {bankAccounts.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg font-medium mb-2">No bank accounts</p>
            <p className="text-muted-foreground mb-4">Add a bank account to start reconciling</p>
            <Button onClick={() => setIsAddAccountOpen(true)}>Add Bank Account</Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="flex gap-4 items-center">
            <Select value={selectedAccount} onValueChange={setSelectedAccount}>
              <SelectTrigger className="w-[300px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {bankAccounts.map((account) => (
                  <SelectItem key={account.id} value={account.id}>
                    {account.account_name} - ${Number(account.current_balance).toFixed(2)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex gap-4 text-sm">
              <span className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4 text-green-600" />
                {reconciledCount} Reconciled
              </span>
              <span className="flex items-center gap-1">
                <XCircle className="h-4 w-4 text-orange-600" />
                {unreconciledCount} Pending
              </span>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Transactions</CardTitle>
              <CardDescription>Click to reconcile transactions</CardDescription>
            </CardHeader>
            <CardContent>
              {transactions.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">No transactions yet</p>
              ) : (
                <div className="space-y-2">
                  {transactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className={`p-3 border rounded-lg cursor-pointer hover:bg-accent/50 transition-colors ${
                        transaction.is_reconciled ? 'bg-green-50 border-green-200' : ''
                      }`}
                      onClick={() => toggleReconcile(transaction.id, transaction.is_reconciled)}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{transaction.description}</p>
                            <Badge variant={transaction.transaction_type === 'credit' ? 'default' : 'secondary'}>
                              {transaction.transaction_type}
                            </Badge>
                            {transaction.is_reconciled && (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(transaction.transaction_date), 'MMM d, yyyy')}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className={`font-semibold ${
                            transaction.transaction_type === 'credit' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {transaction.transaction_type === 'credit' ? '+' : '-'}${Number(transaction.amount).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};
