import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Package, AlertTriangle, Plus, Loader2, TrendingDown, Store } from 'lucide-react';
import { toast } from 'sonner';

interface Props { businessId: string; }

export const KaylaInventoryManager: React.FC<Props> = ({ businessId }) => {
  const [items, setItems] = useState<any[]>([]);
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [newItem, setNewItem] = useState({ item_name: '', category: '', current_stock: 0, min_stock_level: 5, unit_cost: 0, supplier_name: '' });

  useEffect(() => { fetchData(); }, [businessId]);

  const fetchData = async () => {
    const [itemsRes, vendorsRes] = await Promise.all([
      supabase.from('kayla_inventory_items').select('*').eq('business_id', businessId).eq('status', 'active').order('created_at', { ascending: false }),
      supabase.from('kayla_vendor_recommendations').select('*').eq('business_id', businessId).order('created_at', { ascending: false }).limit(10),
    ]);
    setItems(itemsRes.data || []);
    setVendors(vendorsRes.data || []);
    setLoading(false);
  };

  const addItem = async () => {
    if (!newItem.item_name) return toast.error('Item name is required');
    const { error } = await supabase.from('kayla_inventory_items').insert({ ...newItem, business_id: businessId });
    if (error) return toast.error('Failed to add item');
    toast.success('Item added!');
    setNewItem({ item_name: '', category: '', current_stock: 0, min_stock_level: 5, unit_cost: 0, supplier_name: '' });
    setShowAdd(false);
    fetchData();
  };

  const analyzeInventory = async () => {
    setAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke('kayla-inventory-manager', {
        body: { business_id: businessId, action: 'analyze' },
      });
      if (error) throw error;
      toast.success(`Analysis complete! ${data.low_stock_count} items need reordering.`);
      fetchData();
    } catch { toast.error('Analysis failed'); }
    setAnalyzing(false);
  };

  const lowStock = items.filter(i => i.current_stock <= i.min_stock_level);

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-yellow-400" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Package className="h-5 w-5 text-yellow-400" /> Inventory & Vendors
        </h3>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => setShowAdd(!showAdd)} className="border-white/20 text-white hover:bg-white/10">
            <Plus className="h-4 w-4 mr-1" /> Add Item
          </Button>
          <Button size="sm" onClick={analyzeInventory} disabled={analyzing} className="bg-yellow-600 hover:bg-yellow-700 text-black">
            {analyzing ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
            Analyze
          </Button>
        </div>
      </div>

      {showAdd && (
        <Card className="bg-slate-800/60 border-white/10">
          <CardContent className="p-4 grid grid-cols-2 md:grid-cols-3 gap-3">
            <Input placeholder="Item name *" value={newItem.item_name} onChange={e => setNewItem({ ...newItem, item_name: e.target.value })} className="bg-slate-900/50 border-white/10 text-white" />
            <Input placeholder="Category" value={newItem.category} onChange={e => setNewItem({ ...newItem, category: e.target.value })} className="bg-slate-900/50 border-white/10 text-white" />
            <Input type="number" placeholder="Current Stock" value={newItem.current_stock || ''} onChange={e => setNewItem({ ...newItem, current_stock: +e.target.value })} className="bg-slate-900/50 border-white/10 text-white" />
            <Input type="number" placeholder="Min Stock" value={newItem.min_stock_level || ''} onChange={e => setNewItem({ ...newItem, min_stock_level: +e.target.value })} className="bg-slate-900/50 border-white/10 text-white" />
            <Input type="number" placeholder="Unit Cost ($)" value={newItem.unit_cost || ''} onChange={e => setNewItem({ ...newItem, unit_cost: +e.target.value })} className="bg-slate-900/50 border-white/10 text-white" />
            <Input placeholder="Supplier Name" value={newItem.supplier_name} onChange={e => setNewItem({ ...newItem, supplier_name: e.target.value })} className="bg-slate-900/50 border-white/10 text-white" />
            <Button onClick={addItem} className="col-span-2 md:col-span-3 bg-emerald-600 hover:bg-emerald-700">Save Item</Button>
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-slate-800/40 border-white/10">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-white">{items.length}</p>
            <p className="text-xs text-white/60">Total Items</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/40 border-white/10">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-red-400">{lowStock.length}</p>
            <p className="text-xs text-white/60">Low Stock</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/40 border-white/10">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-emerald-400">${items.reduce((s, i) => s + (i.current_stock * i.unit_cost), 0).toFixed(0)}</p>
            <p className="text-xs text-white/60">Inventory Value</p>
          </CardContent>
        </Card>
      </div>

      {/* Low stock alerts */}
      {lowStock.length > 0 && (
        <Card className="bg-red-900/20 border-red-400/30">
          <CardHeader className="pb-2"><CardTitle className="text-sm text-red-400 flex items-center gap-2"><AlertTriangle className="h-4 w-4" /> Low Stock Alerts</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {lowStock.map(item => (
              <div key={item.id} className="flex items-center justify-between bg-slate-900/40 p-3 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-white">{item.item_name}</p>
                  <p className="text-xs text-white/50">{item.supplier_name || 'No supplier'}</p>
                </div>
                <Badge variant="destructive">{item.current_stock} / {item.min_stock_level} min</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Inventory list */}
      {items.length > 0 && (
        <Card className="bg-slate-800/40 border-white/10">
          <CardHeader className="pb-2"><CardTitle className="text-sm text-white">All Items</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {items.map(item => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-slate-900/30 rounded-lg">
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">{item.item_name}</p>
                  <p className="text-xs text-white/40">{item.category} • ${item.unit_cost}/unit</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-white">{item.current_stock} in stock</p>
                  {item.ai_notes && <p className="text-xs text-yellow-400/70">{item.ai_notes}</p>}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Vendor recommendations */}
      {vendors.length > 0 && (
        <Card className="bg-slate-800/40 border-white/10">
          <CardHeader className="pb-2"><CardTitle className="text-sm text-white flex items-center gap-2"><Store className="h-4 w-4 text-yellow-400" /> AI Vendor Recommendations</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {vendors.map(v => (
              <div key={v.id} className="p-3 bg-slate-900/30 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium text-white">{v.vendor_name}</p>
                  <Badge className="bg-emerald-900/40 text-emerald-400 border-emerald-400/30">Save ~${v.estimated_savings}</Badge>
                </div>
                <p className="text-xs text-white/50">{v.recommendation_reason}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {items.length === 0 && !showAdd && (
        <Card className="bg-slate-800/40 border-white/10">
          <CardContent className="p-8 text-center">
            <Package className="h-12 w-12 text-yellow-400/40 mx-auto mb-3" />
            <p className="text-white/60 text-sm">Add inventory items to get AI-powered reorder alerts and vendor recommendations.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
