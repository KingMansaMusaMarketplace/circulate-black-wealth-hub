import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Plus, Trash2, Percent } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';

interface TaxRatesManagerProps {
  businessId: string;
}

interface TaxRate {
  id: string;
  tax_name: string;
  tax_rate: number;
  is_default: boolean;
}

export const TaxRatesManager: React.FC<TaxRatesManagerProps> = ({ businessId }) => {
  const [loading, setLoading] = useState(true);
  const [taxRates, setTaxRates] = useState<TaxRate[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    tax_name: '',
    tax_rate: '',
    is_default: false
  });
  const { toast } = useToast();

  useEffect(() => {
    loadTaxRates();
  }, [businessId]);

  const loadTaxRates = async () => {
    try {
      const { data, error } = await supabase
        .from('business_tax_rates')
        .select('*')
        .eq('business_id', businessId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTaxRates(data || []);
    } catch (error) {
      console.error('Error loading tax rates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const rate = parseFloat(formData.tax_rate);
      if (isNaN(rate) || rate < 0 || rate > 100) {
        toast({
          title: 'Invalid Rate',
          description: 'Tax rate must be between 0 and 100',
          variant: 'destructive'
        });
        return;
      }

      const { error } = await supabase.from('business_tax_rates').insert({
        business_id: businessId,
        tax_name: formData.tax_name,
        tax_rate: rate,
        is_default: formData.is_default
      });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Tax rate added successfully',
      });

      setIsDialogOpen(false);
      setFormData({ tax_name: '', tax_rate: '', is_default: false });
      loadTaxRates();
    } catch (error) {
      console.error('Error adding tax rate:', error);
      toast({
        title: 'Error',
        description: 'Failed to add tax rate',
        variant: 'destructive'
      });
    }
  };

  const deleteTaxRate = async (id: string) => {
    try {
      const { error } = await supabase
        .from('business_tax_rates')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Tax rate deleted successfully',
      });

      loadTaxRates();
    } catch (error) {
      console.error('Error deleting tax rate:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete tax rate',
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
              <Percent className="h-5 w-5" />
              Tax Rates
            </CardTitle>
            <CardDescription>Configure tax rates for invoices</CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Tax Rate
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Tax Rate</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="tax_name">Tax Name</Label>
                  <Input
                    id="tax_name"
                    value={formData.tax_name}
                    onChange={(e) => setFormData({ ...formData, tax_name: e.target.value })}
                    placeholder="e.g., Sales Tax, VAT"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="tax_rate">Tax Rate (%)</Label>
                  <Input
                    id="tax_rate"
                    type="number"
                    step="0.01"
                    value={formData.tax_rate}
                    onChange={(e) => setFormData({ ...formData, tax_rate: e.target.value })}
                    placeholder="e.g., 8.5"
                    required
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_default"
                    checked={formData.is_default}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_default: checked })}
                  />
                  <Label htmlFor="is_default">Set as default tax rate</Label>
                </div>
                <Button type="submit" className="w-full">Add Tax Rate</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {taxRates.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">No tax rates configured</p>
        ) : (
          <div className="space-y-2">
            {taxRates.map((rate) => (
              <div key={rate.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">{rate.tax_name}</p>
                  <p className="text-sm text-muted-foreground">{rate.tax_rate}%</p>
                </div>
                <div className="flex items-center gap-2">
                  {rate.is_default && (
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">Default</span>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteTaxRate(rate.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
