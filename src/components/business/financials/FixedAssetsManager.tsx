import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Plus, Building } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { Badge } from "@/components/ui/badge";

interface FixedAssetsManagerProps {
  businessId: string;
}

export const FixedAssetsManager: React.FC<FixedAssetsManagerProps> = ({ businessId }) => {
  const [loading, setLoading] = useState(true);
  const [assets, setAssets] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    asset_name: '',
    asset_category: '',
    purchase_date: format(new Date(), 'yyyy-MM-dd'),
    purchase_price: '',
    salvage_value: '0',
    useful_life_years: '5',
    depreciation_method: 'straight_line'
  });
  const { toast } = useToast();

  useEffect(() => {
    loadAssets();
  }, [businessId]);

  const loadAssets = async () => {
    try {
      const { data, error } = await supabase
        .from('fixed_assets')
        .select('*')
        .eq('business_id', businessId)
        .eq('is_disposed', false)
        .order('purchase_date', { ascending: false });

      if (error) throw error;

      // Calculate current depreciation for each asset
      const assetsWithDepreciation = (data || []).map(asset => {
        const purchaseDate = new Date(asset.purchase_date);
        const today = new Date();
        const yearsElapsed = (today.getTime() - purchaseDate.getTime()) / (1000 * 60 * 60 * 24 * 365);
        const cappedYears = Math.min(yearsElapsed, asset.useful_life_years);
        
        let totalDepreciation = 0;
        if (asset.depreciation_method === 'straight_line') {
          const annualDepreciation = (asset.purchase_price - asset.salvage_value) / asset.useful_life_years;
          totalDepreciation = annualDepreciation * cappedYears;
        } else {
          // Declining balance
          totalDepreciation = asset.purchase_price * (1 - Math.pow(1 - (2 / asset.useful_life_years), cappedYears));
        }
        
        totalDepreciation = Math.min(totalDepreciation, asset.purchase_price - asset.salvage_value);
        const bookValue = asset.purchase_price - totalDepreciation;

        return {
          ...asset,
          current_depreciation: totalDepreciation,
          book_value: bookValue
        };
      });

      setAssets(assetsWithDepreciation);
    } catch (error) {
      console.error('Error loading assets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const purchasePrice = parseFloat(formData.purchase_price);
      const bookValue = purchasePrice; // Initial book value equals purchase price

      const { error } = await supabase.from('fixed_assets').insert({
        business_id: businessId,
        asset_name: formData.asset_name,
        asset_category: formData.asset_category,
        purchase_date: formData.purchase_date,
        purchase_price: purchasePrice,
        salvage_value: parseFloat(formData.salvage_value),
        useful_life_years: parseInt(formData.useful_life_years),
        depreciation_method: formData.depreciation_method,
        current_book_value: bookValue
      });

      if (error) throw error;

      toast({ title: 'Success', description: 'Asset added successfully' });
      setIsDialogOpen(false);
      setFormData({
        asset_name: '',
        asset_category: '',
        purchase_date: format(new Date(), 'yyyy-MM-dd'),
        purchase_price: '',
        salvage_value: '0',
        useful_life_years: '5',
        depreciation_method: 'straight_line'
      });
      loadAssets();
    } catch (error) {
      console.error('Error adding asset:', error);
      toast({ title: 'Error', description: 'Failed to add asset', variant: 'destructive' });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const totalPurchaseValue = assets.reduce((sum, a) => sum + Number(a.purchase_price), 0);
  const totalDepreciation = assets.reduce((sum, a) => sum + a.current_depreciation, 0);
  const totalBookValue = assets.reduce((sum, a) => sum + a.book_value, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold flex items-center gap-2">
            <Building className="h-6 w-6" />
            Fixed Assets & Depreciation
          </h3>
          <p className="text-muted-foreground">Track and depreciate long-term assets</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Asset
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Fixed Asset</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Asset Name</Label>
                <Input
                  value={formData.asset_name}
                  onChange={(e) => setFormData({ ...formData, asset_name: e.target.value })}
                  placeholder="Office Laptop"
                  required
                />
              </div>
              <div>
                <Label>Category</Label>
                <Input
                  value={formData.asset_category}
                  onChange={(e) => setFormData({ ...formData, asset_category: e.target.value })}
                  placeholder="Equipment, Furniture, Vehicles"
                  required
                />
              </div>
              <div>
                <Label>Purchase Date</Label>
                <Input
                  type="date"
                  value={formData.purchase_date}
                  onChange={(e) => setFormData({ ...formData, purchase_date: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label>Purchase Price</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.purchase_price}
                  onChange={(e) => setFormData({ ...formData, purchase_price: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label>Salvage Value</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.salvage_value}
                  onChange={(e) => setFormData({ ...formData, salvage_value: e.target.value })}
                />
              </div>
              <div>
                <Label>Useful Life (Years)</Label>
                <Input
                  type="number"
                  value={formData.useful_life_years}
                  onChange={(e) => setFormData({ ...formData, useful_life_years: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label>Depreciation Method</Label>
                <Select value={formData.depreciation_method} onValueChange={(value) => setFormData({ ...formData, depreciation_method: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="straight_line">Straight Line</SelectItem>
                    <SelectItem value="declining_balance">Declining Balance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full">Add Asset</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Purchase Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalPurchaseValue.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Accumulated Depreciation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">${totalDepreciation.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Current Book Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${totalBookValue.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      {assets.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-lg font-medium mb-2">No fixed assets</p>
            <p className="text-muted-foreground mb-4">Add assets to track depreciation</p>
            <Button onClick={() => setIsDialogOpen(true)}>Add Asset</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {assets.map((asset) => (
            <Card key={asset.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold">{asset.asset_name}</h4>
                      <Badge variant="outline">{asset.asset_category}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Purchased {format(new Date(asset.purchase_date), 'MMM d, yyyy')} • {asset.useful_life_years} year life
                    </p>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Purchase Price</p>
                        <p className="font-medium">${Number(asset.purchase_price).toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Depreciation</p>
                        <p className="font-medium text-orange-600">${asset.current_depreciation.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Book Value</p>
                        <p className="font-medium text-green-600">${asset.book_value.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
