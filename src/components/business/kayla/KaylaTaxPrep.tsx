import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Receipt, Loader2, DollarSign, Calendar, FileText } from 'lucide-react';
import { toast } from 'sonner';

interface Props { businessId: string; }

export const KaylaTaxPrep: React.FC<Props> = ({ businessId }) => {
  const [taxData, setTaxData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const currentYear = new Date().getFullYear();

  useEffect(() => { fetchTaxPrep(); }, [businessId]);

  const fetchTaxPrep = async () => {
    const { data } = await supabase
      .from('kayla_tax_prep')
      .select('*')
      .eq('business_id', businessId)
      .eq('tax_year', currentYear)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    setTaxData(data);
    setLoading(false);
  };

  const generateTaxPrep = async () => {
    setGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('kayla-tax-prep', {
        body: { business_id: businessId, tax_year: currentYear },
      });
      if (error) throw error;
      setTaxData({ ...data, deductions_found: data.deductions, quarterly_estimates: data.quarterly_estimates, ai_summary: data.ai_summary, estimated_revenue: data.revenue, estimated_expenses: data.expenses, estimated_tax_liability: data.net_income * 0.25 });
      toast.success('Tax preparation analysis complete!');
      fetchTaxPrep();
    } catch { toast.error('Failed to generate tax analysis'); }
    setGenerating(false);
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-yellow-400" /></div>;

  const deductions = (taxData?.deductions_found as any[]) || [];
  const quarters = (taxData?.quarterly_estimates as any[]) || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Receipt className="h-5 w-5 text-yellow-400" /> Tax Prep Assistant ({currentYear})
        </h3>
        <Button size="sm" onClick={generateTaxPrep} disabled={generating} className="bg-yellow-600 hover:bg-yellow-700 text-black">
          {generating ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <FileText className="h-4 w-4 mr-1" />}
          {taxData ? 'Refresh' : 'Generate'} Analysis
        </Button>
      </div>

      {taxData ? (
        <>
          {/* Financial overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-slate-800/40 border-white/10">
              <CardContent className="p-4 text-center">
                <p className="text-xl font-bold text-emerald-400">${(taxData.estimated_revenue || 0).toLocaleString()}</p>
                <p className="text-xs text-white/60">Revenue</p>
              </CardContent>
            </Card>
            <Card className="bg-slate-800/40 border-white/10">
              <CardContent className="p-4 text-center">
                <p className="text-xl font-bold text-red-400">${(taxData.estimated_expenses || 0).toLocaleString()}</p>
                <p className="text-xs text-white/60">Expenses</p>
              </CardContent>
            </Card>
            <Card className="bg-slate-800/40 border-white/10">
              <CardContent className="p-4 text-center">
                <p className="text-xl font-bold text-blue-400">${((taxData.estimated_revenue || 0) - (taxData.estimated_expenses || 0)).toLocaleString()}</p>
                <p className="text-xs text-white/60">Net Income</p>
              </CardContent>
            </Card>
            <Card className="bg-slate-800/40 border-white/10">
              <CardContent className="p-4 text-center">
                <p className="text-xl font-bold text-amber-400">${(taxData.estimated_tax_liability || 0).toLocaleString()}</p>
                <p className="text-xs text-white/60">Est. Tax</p>
              </CardContent>
            </Card>
          </div>

          {/* AI Summary */}
          {taxData.ai_summary && (
            <Card className="bg-yellow-900/20 border-yellow-400/20">
              <CardContent className="p-4">
                <p className="text-sm text-white/80 whitespace-pre-line">{taxData.ai_summary}</p>
              </CardContent>
            </Card>
          )}

          {/* Deductions */}
          {deductions.length > 0 && (
            <Card className="bg-slate-800/40 border-white/10">
              <CardHeader className="pb-2"><CardTitle className="text-sm text-white flex items-center gap-2"><DollarSign className="h-4 w-4 text-emerald-400" /> Potential Deductions</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {deductions.map((d: any, i: number) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-slate-900/30 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-white">{d.name}</p>
                      <p className="text-xs text-white/50">{d.description}</p>
                    </div>
                    <Badge className="bg-emerald-900/40 text-emerald-400 border-emerald-400/30">${d.amount?.toLocaleString()}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Quarterly Estimates */}
          {quarters.length > 0 && (
            <Card className="bg-slate-800/40 border-white/10">
              <CardHeader className="pb-2"><CardTitle className="text-sm text-white flex items-center gap-2"><Calendar className="h-4 w-4 text-blue-400" /> Quarterly Estimates</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {quarters.map((q: any, i: number) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-slate-900/30 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-white">{q.quarter}</p>
                      <p className="text-xs text-white/50">Due: {q.due_date}</p>
                    </div>
                    <p className="text-sm font-bold text-white">${q.amount?.toLocaleString()}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          <p className="text-xs text-white/30 italic">⚠️ This is AI-generated guidance, not professional tax advice. Consult a CPA for filing.</p>
        </>
      ) : (
        <Card className="bg-slate-800/40 border-white/10">
          <CardContent className="p-8 text-center">
            <Receipt className="h-12 w-12 text-yellow-400/40 mx-auto mb-3" />
            <p className="text-white/60 text-sm">Click "Generate Analysis" to get AI-powered tax prep guidance, deduction discovery, and quarterly estimates.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
