import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Search, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Props {
  businessId: string;
}

interface AuditResult {
  score: number;
  issues: { category: string; description: string; severity: string }[];
  recommendations: string[];
}

export const KaylaSEOAudit: React.FC<Props> = ({ businessId }) => {
  const [result, setResult] = useState<AuditResult | null>(null);
  const [loading, setLoading] = useState(false);

  const runAudit = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('kayla-seo-audit', {
        body: { businessId },
      });
      if (error) throw error;
      setResult(data);
      toast.success('SEO audit complete!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to run audit');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Search className="h-5 w-5 text-cyan-400" />
            SEO & Listing Audit
          </h3>
          <p className="text-sm text-white/50">AI analysis of your listing quality</p>
        </div>
        <Button
          onClick={runAudit}
          disabled={loading}
          className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Sparkles className="h-4 w-4 mr-2" />}
          {loading ? 'Auditing...' : 'Run Audit'}
        </Button>
      </div>

      {!result ? (
        <Card className="bg-slate-800/40 border-white/10">
          <CardContent className="p-8 text-center">
            <Search className="h-12 w-12 text-cyan-400/40 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-white mb-1">No audit yet</h3>
            <p className="text-sm text-white/50">Run an SEO audit to get actionable improvements.</p>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card className="bg-slate-800/40 border-white/10">
            <CardContent className="p-6 text-center">
              <p className={`text-5xl font-bold ${getScoreColor(result.score)}`}>{result.score}</p>
              <p className="text-sm text-white/50 mt-1">SEO Score</p>
            </CardContent>
          </Card>

          {result.issues && result.issues.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-white/70">Issues Found</h4>
              {result.issues.map((issue, i) => (
                <Card key={i} className="bg-slate-800/40 border-white/10">
                  <CardContent className="p-3 flex items-start gap-3">
                    <AlertCircle className={`h-4 w-4 mt-0.5 ${issue.severity === 'high' ? 'text-red-400' : 'text-yellow-400'}`} />
                    <div>
                      <Badge variant="outline" className="text-xs border-white/10 text-white/50 mb-1">{issue.category}</Badge>
                      <p className="text-sm text-white/70">{issue.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {result.recommendations && result.recommendations.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-white/70">Recommendations</h4>
              {result.recommendations.map((rec, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-white/60">
                  <CheckCircle className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" />
                  <span>{rec}</span>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};
