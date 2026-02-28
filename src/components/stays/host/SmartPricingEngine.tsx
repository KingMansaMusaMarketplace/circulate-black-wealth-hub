import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { format } from 'date-fns';
import {
  TrendingUp,
  TrendingDown,
  Zap,
  Check,
  X,
  RefreshCw,
  DollarSign,
  BarChart3,
  ArrowRight,
  Sparkles,
  Info,
} from 'lucide-react';

interface PricingFactor {
  name: string;
  impact: number;
  description: string;
}

interface Recommendation {
  id: string;
  property_id: string;
  current_nightly_rate: number;
  recommended_nightly_rate: number;
  confidence_score: number;
  reason: string;
  factors: PricingFactor[];
  applies_from: string;
  applies_to: string;
  status: string;
}

interface SmartPricingEngineProps {
  properties: { id: string; title: string; base_nightly_rate: number }[];
}

const SmartPricingEngine: React.FC<SmartPricingEngineProps> = ({ properties }) => {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    if (user) fetchRecommendations();
  }, [user]);

  const fetchRecommendations = async () => {
    try {
      const { data, error } = await supabase
        .from('pricing_recommendations')
        .select('*')
        .eq('status', 'pending')
        .order('applies_from', { ascending: true });

      if (error) throw error;
      setRecommendations((data as any[]) || []);
    } catch (err) {
      console.error('Error fetching recommendations:', err);
    } finally {
      setLoading(false);
    }
  };

  const generateRecommendations = async () => {
    setGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-pricing-recommendations');
      if (error) throw error;
      if (!data.success) throw new Error(data.error);

      toast.success(`Generated ${data.count} pricing recommendations!`);
      await fetchRecommendations();
    } catch (err) {
      console.error('Error generating recommendations:', err);
      toast.error('Failed to generate recommendations');
    } finally {
      setGenerating(false);
    }
  };

  const handleAccept = async (rec: Recommendation) => {
    try {
      // Update recommendation status
      await supabase
        .from('pricing_recommendations')
        .update({ status: 'accepted', accepted_at: new Date().toISOString() })
        .eq('id', rec.id);

      // Update the property's nightly rate
      await supabase
        .from('vacation_properties')
        .update({ base_nightly_rate: rec.recommended_nightly_rate })
        .eq('id', rec.property_id);

      setRecommendations(prev => prev.filter(r => r.id !== rec.id));
      toast.success(`Price updated to $${rec.recommended_nightly_rate}/night`);
    } catch (err) {
      console.error('Error accepting recommendation:', err);
      toast.error('Failed to apply price change');
    }
  };

  const handleDismiss = async (rec: Recommendation) => {
    try {
      await supabase
        .from('pricing_recommendations')
        .update({ status: 'dismissed', dismissed_at: new Date().toISOString() })
        .eq('id', rec.id);

      setRecommendations(prev => prev.filter(r => r.id !== rec.id));
      toast.info('Recommendation dismissed');
    } catch (err) {
      console.error('Error dismissing recommendation:', err);
    }
  };

  const getPropertyName = (propertyId: string) => {
    return properties.find(p => p.id === propertyId)?.title || 'Property';
  };

  const getPriceChange = (current: number, recommended: number) => {
    const diff = recommended - current;
    const percent = Math.round((diff / current) * 100);
    return { diff, percent, isIncrease: diff > 0 };
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => <Skeleton key={i} className="h-40" />)}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-mansagold/20 rounded-lg">
                <Sparkles className="w-6 h-6 text-mansagold" />
              </div>
              <div>
                <CardTitle className="text-white">Smart Pricing Engine</CardTitle>
                <CardDescription className="text-slate-400">
                  AI-powered pricing recommendations based on seasonality, demand, and property quality
                </CardDescription>
              </div>
            </div>
            <Button
              onClick={generateRecommendations}
              disabled={generating || properties.length === 0}
              className="bg-mansagold hover:bg-mansagold/90 text-black"
            >
              {generating ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Zap className="w-4 h-4 mr-2" />
              )}
              {generating ? 'Analyzing...' : 'Generate Recommendations'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-slate-700/50 rounded-lg">
              <p className="text-2xl font-bold text-white">{properties.length}</p>
              <p className="text-xs text-slate-400">Active Properties</p>
            </div>
            <div className="text-center p-3 bg-slate-700/50 rounded-lg">
              <p className="text-2xl font-bold text-mansagold">{recommendations.length}</p>
              <p className="text-xs text-slate-400">Pending Suggestions</p>
            </div>
            <div className="text-center p-3 bg-slate-700/50 rounded-lg">
              <p className="text-2xl font-bold text-green-400">
                {recommendations.length > 0
                  ? `+$${recommendations.reduce((sum, r) => sum + Math.max(0, r.recommended_nightly_rate - r.current_nightly_rate), 0)}`
                  : '$0'}
              </p>
              <p className="text-xs text-slate-400">Potential Uplift/night</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      {recommendations.length === 0 ? (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BarChart3 className="w-12 h-12 text-slate-500 mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">No recommendations yet</h3>
            <p className="text-slate-400 text-center mb-4">
              Click "Generate Recommendations" to analyze your properties and get smart pricing suggestions
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {recommendations.map((rec) => {
            const { diff, percent, isIncrease } = getPriceChange(rec.current_nightly_rate, rec.recommended_nightly_rate);
            const isExpanded = expandedId === rec.id;

            return (
              <Card key={rec.id} className="bg-slate-800/50 border-slate-700 overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    {/* Property & Date */}
                    <div className="flex-1">
                      <h3 className="font-semibold text-white">{getPropertyName(rec.property_id)}</h3>
                      <p className="text-sm text-slate-400">
                        {format(new Date(rec.applies_from), 'MMM d')} – {format(new Date(rec.applies_to), 'MMM d, yyyy')}
                      </p>
                    </div>

                    {/* Price Change */}
                    <div className="flex items-center gap-3">
                      <div className="text-center">
                        <p className="text-xs text-slate-500">Current</p>
                        <p className="text-lg font-bold text-slate-400">${rec.current_nightly_rate}</p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-slate-500" />
                      <div className="text-center">
                        <p className="text-xs text-slate-500">Suggested</p>
                        <p className={`text-lg font-bold ${isIncrease ? 'text-green-400' : 'text-amber-400'}`}>
                          ${rec.recommended_nightly_rate}
                        </p>
                      </div>
                      <Badge className={isIncrease ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-amber-500/20 text-amber-400 border-amber-500/30'}>
                        {isIncrease ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                        {isIncrease ? '+' : ''}{percent}%
                      </Badge>
                    </div>

                    {/* Confidence */}
                    <div className="text-center">
                      <p className="text-xs text-slate-500">Confidence</p>
                      <p className="text-lg font-bold text-mansagold">{Math.round(rec.confidence_score * 100)}%</p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleAccept(rec)}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        <Check className="w-4 h-4 mr-1" />
                        Apply
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDismiss(rec)}
                        className="text-slate-400 hover:text-white"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setExpandedId(isExpanded ? null : rec.id)}
                        className="text-slate-400 hover:text-white"
                      >
                        <Info className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Reason */}
                  <p className="text-sm text-slate-300 mt-3">{rec.reason}</p>

                  {/* Expanded Factors */}
                  {isExpanded && rec.factors && (
                    <div className="mt-4 pt-4 border-t border-slate-700">
                      <h4 className="text-sm font-semibold text-white mb-3">Pricing Factors</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {(rec.factors as unknown as PricingFactor[]).map((factor, idx) => (
                          <div key={idx} className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-lg">
                            <div className={`text-sm font-bold ${factor.impact > 0 ? 'text-green-400' : 'text-amber-400'}`}>
                              {factor.impact > 0 ? '+' : ''}{factor.impact}%
                            </div>
                            <div>
                              <p className="text-sm font-medium text-white">{factor.name}</p>
                              <p className="text-xs text-slate-400">{factor.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SmartPricingEngine;
