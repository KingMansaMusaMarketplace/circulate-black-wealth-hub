import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Loader2, DollarSign, TrendingUp, TrendingDown, Plus, Sparkles, Tag } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { AgentFeedbackButtons } from '@/components/ai/AgentFeedbackButtons';

interface PriceRec {
  id: string;
  product_or_service: string;
  current_price: number | null;
  recommended_price: number | null;
  price_change_percent: number | null;
  reasoning: string | null;
  competitor_range: string | null;
  confidence_score: number;
  status: string;
  created_at: string;
}

interface ProductInput {
  name: string;
  price: string;
}

interface Props {
  businessId: string;
}

export const KaylaPriceOptimizer: React.FC<Props> = ({ businessId }) => {
  const [recommendations, setRecommendations] = useState<PriceRec[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [products, setProducts] = useState<ProductInput[]>([{ name: '', price: '' }]);

  useEffect(() => { fetchRecs(); }, [businessId]);

  const fetchRecs = async () => {
    const { data } = await supabase
      .from('kayla_price_recommendations')
      .select('*')
      .eq('business_id', businessId)
      .order('created_at', { ascending: false });
    if (data) setRecommendations(data as unknown as PriceRec[]);
    setFetching(false);
  };

  const addProduct = () => setProducts([...products, { name: '', price: '' }]);

  const updateProduct = (index: number, field: 'name' | 'price', value: string) => {
    const updated = [...products];
    updated[index][field] = value;
    setProducts(updated);
  };

  const optimize = async () => {
    setLoading(true);
    try {
      const validProducts = products.filter(p => p.name.trim()).map(p => ({
        name: p.name,
        price: parseFloat(p.price) || 0,
      }));

      const { data, error } = await supabase.functions.invoke('kayla-price-optimizer', {
        body: { businessId, products: validProducts },
      });
      if (error) throw error;
      toast.success(`Generated ${data.recommendations?.length || 0} price recommendations!`);
      await fetchRecs();
    } catch (err: any) {
      toast.error(err.message || 'Failed to optimize prices');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    await supabase
      .from('kayla_price_recommendations')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id);
    setRecommendations(prev => prev.map(r => r.id === id ? { ...r, status } : r));
    toast.success(`Price recommendation ${status}`);
  };

  if (fetching) {
    return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-yellow-400" /></div>;
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Tag className="h-5 w-5 text-purple-400" />
          Price Optimizer
        </h3>
        <p className="text-sm text-white/50">AI-powered pricing strategy recommendations</p>
      </div>

      {/* Input Section */}
      <Card className="bg-slate-800/40 border-white/10">
        <CardContent className="p-4 space-y-3">
          <p className="text-sm text-white/70">Enter your products/services (optional — Kayla can suggest for your category):</p>
          {products.map((p, i) => (
            <div key={i} className="flex gap-2">
              <Input
                placeholder="Product/service name"
                value={p.name}
                onChange={(e) => updateProduct(i, 'name', e.target.value)}
                className="bg-slate-700/50 border-white/10 text-white"
              />
              <Input
                placeholder="Current price"
                value={p.price}
                onChange={(e) => updateProduct(i, 'price', e.target.value)}
                className="bg-slate-700/50 border-white/10 text-white w-32"
                type="number"
              />
            </div>
          ))}
          <div className="flex gap-2">
            <Button size="sm" variant="ghost" onClick={addProduct} className="text-white/50">
              <Plus className="h-4 w-4 mr-1" /> Add Product
            </Button>
            <Button
              onClick={optimize}
              disabled={loading}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-400 hover:to-pink-400 ml-auto"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Sparkles className="h-4 w-4 mr-2" />}
              {loading ? 'Analyzing...' : 'Optimize Prices'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {recommendations.length > 0 && (
        <div className="grid gap-3">
          {recommendations.map((rec) => (
            <Card key={rec.id} className="bg-slate-800/40 border-white/10">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-semibold text-white">{rec.product_or_service}</h4>
                      <Badge variant="outline" className={`text-xs ${rec.status === 'implemented' ? 'border-emerald-400/30 text-emerald-400' : rec.status === 'accepted' ? 'border-blue-400/30 text-blue-400' : 'border-white/20 text-white/60'}`}>
                        {rec.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm mb-2">
                      {rec.current_price != null && (
                        <span className="text-white/50">Current: <span className="text-white">${rec.current_price}</span></span>
                      )}
                      {rec.recommended_price != null && (
                        <span className="text-white/50">
                          Suggested: <span className="text-emerald-400 font-semibold">${rec.recommended_price}</span>
                        </span>
                      )}
                      {rec.price_change_percent != null && (
                        <span className={`flex items-center gap-1 text-xs ${rec.price_change_percent >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                          {rec.price_change_percent >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                          {rec.price_change_percent >= 0 ? '+' : ''}{rec.price_change_percent.toFixed(1)}%
                        </span>
                      )}
                    </div>
                    {rec.reasoning && <p className="text-xs text-white/50 mb-1">{rec.reasoning}</p>}
                    {rec.competitor_range && (
                      <p className="text-xs text-white/40">Market range: {rec.competitor_range}</p>
                    )}
                  </div>
                  {rec.status === 'pending' && (
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost" className="text-emerald-400 text-xs" onClick={() => updateStatus(rec.id, 'accepted')}>Accept</Button>
                      <Button size="sm" variant="ghost" className="text-red-400 text-xs" onClick={() => updateStatus(rec.id, 'rejected')}>Reject</Button>
                    </div>
                  )}
                </div>
                <div className="mt-3">
                  <AgentFeedbackButtons
                    agentName="kayla-price-optimizer"
                    decisionType="price_recommendation"
                    businessId={businessId}
                    decisionPayload={{ rec_id: rec.id, product: rec.product_or_service, recommended_price: rec.recommended_price }}
                    compact
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
