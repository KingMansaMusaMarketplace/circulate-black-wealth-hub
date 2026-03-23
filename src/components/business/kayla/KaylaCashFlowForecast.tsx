import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, TrendingUp, TrendingDown, AlertTriangle, Lightbulb, Sparkles, BarChart3 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Forecast {
  id: string;
  forecast_period: string;
  projected_revenue: number;
  projected_expenses: number;
  projected_net: number;
  confidence_level: number;
  risk_factors: string[];
  opportunities: string[];
  ai_summary: string;
  created_at: string;
}

interface Props {
  businessId: string;
}

export const KaylaCashFlowForecast: React.FC<Props> = ({ businessId }) => {
  const [forecasts, setForecasts] = useState<Forecast[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => { fetchForecasts(); }, [businessId]);

  const fetchForecasts = async () => {
    const { data } = await supabase
      .from('kayla_cashflow_forecasts')
      .select('*')
      .eq('business_id', businessId)
      .order('created_at', { ascending: false })
      .limit(3);
    if (data) setForecasts(data as unknown as Forecast[]);
    setFetching(false);
  };

  const generateForecast = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('kayla-cashflow-forecast', {
        body: { businessId },
      });
      if (error) throw error;
      toast.success('Cash flow forecast generated!');
      await fetchForecasts();
    } catch (err: any) {
      toast.error(err.message || 'Failed to generate forecast');
    } finally {
      setLoading(false);
    }
  };

  const fmt = (n: number) => `$${Math.abs(n).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

  if (fetching) {
    return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-yellow-400" /></div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-blue-400" />
            Cash Flow Forecast
          </h3>
          <p className="text-sm text-white/50">AI-powered 3-month financial projections</p>
        </div>
        <Button
          onClick={generateForecast}
          disabled={loading}
          className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-400 hover:to-indigo-400"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Sparkles className="h-4 w-4 mr-2" />}
          {loading ? 'Analyzing...' : 'Generate Forecast'}
        </Button>
      </div>

      {forecasts.length === 0 ? (
        <Card className="bg-slate-800/40 border-white/10">
          <CardContent className="p-8 text-center">
            <BarChart3 className="h-12 w-12 text-blue-400/40 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-white mb-1">No forecasts yet</h3>
            <p className="text-sm text-white/50">Click "Generate Forecast" to have Kayla analyze your cash flow trends.</p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {forecasts.map((f) => (
              <Card key={f.id} className="bg-slate-800/40 border-white/10">
                <CardContent className="p-4">
                  <h4 className="text-sm font-medium text-white/70 mb-3">{f.forecast_period}</h4>

                  <div className="space-y-2 mb-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-white/50">Revenue</span>
                      <span className="text-sm font-semibold text-emerald-400 flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" /> {fmt(f.projected_revenue)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-white/50">Expenses</span>
                      <span className="text-sm font-semibold text-red-400 flex items-center gap-1">
                        <TrendingDown className="h-3 w-3" /> {fmt(f.projected_expenses)}
                      </span>
                    </div>
                    <div className="border-t border-white/10 pt-2 flex justify-between items-center">
                      <span className="text-xs text-white/70 font-medium">Net</span>
                      <span className={`text-sm font-bold ${f.projected_net >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {f.projected_net >= 0 ? '+' : '-'}{fmt(f.projected_net)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex-1 bg-slate-700/50 rounded-full h-2">
                      <div
                        className="bg-blue-400 h-2 rounded-full transition-all"
                        style={{ width: `${f.confidence_level}%` }}
                      />
                    </div>
                    <span className="text-xs text-white/50">{f.confidence_level}%</span>
                  </div>

                  {f.ai_summary && (
                    <p className="text-xs text-white/50 italic">{f.ai_summary}</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {forecasts[0] && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {forecasts[0].risk_factors && forecasts[0].risk_factors.length > 0 && (
                <Card className="bg-red-900/10 border-red-400/20">
                  <CardContent className="p-4">
                    <h4 className="text-sm font-medium text-red-400 flex items-center gap-2 mb-2">
                      <AlertTriangle className="h-4 w-4" /> Risk Factors
                    </h4>
                    <ul className="space-y-1">
                      {forecasts[0].risk_factors.map((r, i) => (
                        <li key={i} className="text-xs text-white/60 flex items-start gap-2">
                          <span className="text-red-400 mt-0.5">•</span> {r}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
              {forecasts[0].opportunities && forecasts[0].opportunities.length > 0 && (
                <Card className="bg-emerald-900/10 border-emerald-400/20">
                  <CardContent className="p-4">
                    <h4 className="text-sm font-medium text-emerald-400 flex items-center gap-2 mb-2">
                      <Lightbulb className="h-4 w-4" /> Opportunities
                    </h4>
                    <ul className="space-y-1">
                      {forecasts[0].opportunities.map((o, i) => (
                        <li key={i} className="text-xs text-white/60 flex items-start gap-2">
                          <span className="text-emerald-400 mt-0.5">•</span> {o}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};
