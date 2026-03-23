import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, DollarSign, ExternalLink, Calendar, Target, Sparkles } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface GrantMatch {
  id: string;
  grant_name: string;
  grant_provider: string;
  grant_url: string | null;
  amount_min: number | null;
  amount_max: number | null;
  deadline: string | null;
  eligibility_summary: string | null;
  match_score: number;
  match_reasons: string[];
  ai_application_tips: string | null;
  status: string;
  created_at: string;
}

interface Props {
  businessId: string;
}

export const KaylaGrantMatcher: React.FC<Props> = ({ businessId }) => {
  const [grants, setGrants] = useState<GrantMatch[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    fetchGrants();
  }, [businessId]);

  const fetchGrants = async () => {
    const { data } = await supabase
      .from('kayla_grant_matches')
      .select('*')
      .eq('business_id', businessId)
      .order('match_score', { ascending: false });
    if (data) setGrants(data as unknown as GrantMatch[]);
    setFetching(false);
  };

  const searchGrants = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('kayla-grant-matcher', {
        body: { businessId },
      });
      if (error) throw error;
      toast.success(`Found ${data.grants?.length || 0} grant opportunities!`);
      await fetchGrants();
    } catch (err: any) {
      toast.error(err.message || 'Failed to search grants');
    } finally {
      setLoading(false);
    }
  };

  const formatAmount = (min: number | null, max: number | null) => {
    if (!min && !max) return 'Varies';
    if (min && max) return `$${min.toLocaleString()} – $${max.toLocaleString()}`;
    if (max) return `Up to $${max.toLocaleString()}`;
    return `From $${min!.toLocaleString()}`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30';
    if (score >= 60) return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30';
    return 'text-blue-400 bg-blue-400/10 border-blue-400/30';
  };

  if (fetching) {
    return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-yellow-400" /></div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-emerald-400" />
            Grant & Funding Matcher
          </h3>
          <p className="text-sm text-white/50">AI-matched funding opportunities for your business</p>
        </div>
        <Button
          onClick={searchGrants}
          disabled={loading}
          className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-400 hover:to-teal-400"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Sparkles className="h-4 w-4 mr-2" />}
          {loading ? 'Searching...' : 'Find Grants'}
        </Button>
      </div>

      {grants.length === 0 ? (
        <Card className="bg-slate-800/40 border-white/10">
          <CardContent className="p-8 text-center">
            <DollarSign className="h-12 w-12 text-emerald-400/40 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-white mb-1">No grants discovered yet</h3>
            <p className="text-sm text-white/50">Click "Find Grants" to have Kayla search for funding opportunities.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {grants.map((grant) => (
            <Card key={grant.id} className="bg-slate-800/40 border-white/10 hover:border-emerald-400/30 transition-all">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="text-base font-semibold text-white">{grant.grant_name}</h4>
                      <Badge variant="outline" className={`text-xs ${getScoreColor(grant.match_score)}`}>
                        {grant.match_score}% Match
                      </Badge>
                    </div>
                    <p className="text-sm text-white/60 mb-1">{grant.grant_provider}</p>
                    <div className="flex items-center gap-4 text-xs text-white/50 mb-2">
                      <span className="flex items-center gap-1">
                        <DollarSign className="h-3 w-3" />
                        {formatAmount(grant.amount_min, grant.amount_max)}
                      </span>
                      {grant.deadline && (
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Deadline: {new Date(grant.deadline).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    {grant.eligibility_summary && (
                      <p className="text-sm text-white/50 mb-2">{grant.eligibility_summary}</p>
                    )}
                    {grant.match_reasons && grant.match_reasons.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {grant.match_reasons.map((reason, i) => (
                          <Badge key={i} variant="outline" className="text-xs border-white/10 text-white/60">
                            <Target className="h-3 w-3 mr-1" /> {reason}
                          </Badge>
                        ))}
                      </div>
                    )}
                    {grant.ai_application_tips && (
                      <div className="bg-yellow-400/5 border border-yellow-400/10 rounded-lg p-3 mt-2">
                        <p className="text-xs text-yellow-400/80 font-medium mb-1">💡 Kayla's Tips</p>
                        <p className="text-xs text-white/60">{grant.ai_application_tips}</p>
                      </div>
                    )}
                  </div>
                  {grant.grant_url && grant.grant_url !== '#' && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-emerald-400 hover:text-emerald-300"
                      onClick={() => window.open(grant.grant_url!, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
