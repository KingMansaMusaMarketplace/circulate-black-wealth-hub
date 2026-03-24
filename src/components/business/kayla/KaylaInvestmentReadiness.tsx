import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, Loader2, Target, CheckCircle2, XCircle, Lightbulb, Download } from 'lucide-react';
import { toast } from 'sonner';
import jsPDF from 'jspdf';

interface Props { businessId: string; }

export const KaylaInvestmentReadiness: React.FC<Props> = ({ businessId }) => {
  const [assessment, setAssessment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => { fetchAssessment(); }, [businessId]);

  const fetchAssessment = async () => {
    const { data } = await supabase
      .from('kayla_investment_readiness')
      .select('*')
      .eq('business_id', businessId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    setAssessment(data);
    setLoading(false);
  };

  const generateAssessment = async () => {
    setGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('kayla-investment-readiness', {
        body: { business_id: businessId },
      });
      if (error) throw error;
      setAssessment(data);
      toast.success('Investment readiness assessment complete!');
      fetchAssessment();
    } catch { toast.error('Assessment failed'); }
    setGenerating(false);
  };

  const getScoreColor = (score: number) => score >= 70 ? 'text-emerald-400' : score >= 40 ? 'text-amber-400' : 'text-red-400';
  const getProgressColor = (score: number) => score >= 70 ? 'bg-emerald-500' : score >= 40 ? 'bg-amber-500' : 'bg-red-500';

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-yellow-400" /></div>;

  const dimensions = assessment ? [
    { label: 'Financial Health', score: assessment.financial_health_score },
    { label: 'Market Position', score: assessment.market_position_score },
    { label: 'Team Readiness', score: assessment.team_readiness_score },
    { label: 'Documentation', score: assessment.documentation_score },
    { label: 'Growth Trajectory', score: assessment.growth_trajectory_score },
  ] : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-yellow-400" /> Investment Readiness Score
        </h3>
        <Button size="sm" onClick={generateAssessment} disabled={generating} className="bg-yellow-600 hover:bg-yellow-700 text-black">
          {generating ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Target className="h-4 w-4 mr-1" />}
          {assessment ? 'Reassess' : 'Run Assessment'}
        </Button>
      </div>

      {assessment ? (
        <>
          {/* Overall score */}
          <Card className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 border-white/10">
            <CardContent className="p-6 text-center">
              <p className={`text-5xl font-bold ${getScoreColor(assessment.overall_score)}`}>{assessment.overall_score}</p>
              <p className="text-sm text-white/60 mt-1">Overall Investment Readiness</p>
              <div className="mt-3">
                <Progress value={assessment.overall_score} className="h-2" />
              </div>
            </CardContent>
          </Card>

          {/* Dimension scores */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {dimensions.map(d => (
              <Card key={d.label} className="bg-slate-800/40 border-white/10">
                <CardContent className="p-3 text-center">
                  <p className={`text-2xl font-bold ${getScoreColor(d.score)}`}>{d.score}</p>
                  <p className="text-xs text-white/50 mt-1">{d.label}</p>
                  <div className="mt-2 h-1 bg-slate-700 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${getProgressColor(d.score)}`} style={{ width: `${d.score}%` }} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Investor fit */}
          {assessment.investor_type_fit?.length > 0 && (
            <Card className="bg-slate-800/40 border-white/10">
              <CardHeader className="pb-2"><CardTitle className="text-sm text-white">Best Investor Fit</CardTitle></CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {assessment.investor_type_fit.map((t: string, i: number) => (
                  <Badge key={i} className="bg-purple-900/40 text-purple-300 border-purple-400/30">{t}</Badge>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Strengths & Weaknesses */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-emerald-900/10 border-emerald-400/20">
              <CardHeader className="pb-2"><CardTitle className="text-sm text-emerald-400 flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> Strengths</CardTitle></CardHeader>
              <CardContent className="space-y-1">
                {(assessment.strengths as string[])?.map((s, i) => (
                  <p key={i} className="text-sm text-white/70">✓ {s}</p>
                ))}
              </CardContent>
            </Card>
            <Card className="bg-red-900/10 border-red-400/20">
              <CardHeader className="pb-2"><CardTitle className="text-sm text-red-400 flex items-center gap-2"><XCircle className="h-4 w-4" /> Weaknesses</CardTitle></CardHeader>
              <CardContent className="space-y-1">
                {(assessment.weaknesses as string[])?.map((w, i) => (
                  <p key={i} className="text-sm text-white/70">• {w}</p>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Recommendations */}
          {(assessment.recommendations as string[])?.length > 0 && (
            <Card className="bg-yellow-900/10 border-yellow-400/20">
              <CardHeader className="pb-2"><CardTitle className="text-sm text-yellow-400 flex items-center gap-2"><Lightbulb className="h-4 w-4" /> Recommendations</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {(assessment.recommendations as string[]).map((r, i) => (
                  <p key={i} className="text-sm text-white/70">{i + 1}. {r}</p>
                ))}
              </CardContent>
            </Card>
          )}

          {/* AI Assessment */}
          {assessment.ai_assessment && (
            <Card className="bg-slate-800/40 border-white/10">
              <CardContent className="p-4">
                <p className="text-sm text-white/70 whitespace-pre-line">{assessment.ai_assessment}</p>
              </CardContent>
            </Card>
          )}
        </>
      ) : (
        <Card className="bg-slate-800/40 border-white/10">
          <CardContent className="p-8 text-center">
            <TrendingUp className="h-12 w-12 text-yellow-400/40 mx-auto mb-3" />
            <p className="text-white/60 text-sm">Run an investment readiness assessment to see how prepared your business is for funding opportunities.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
