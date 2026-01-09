import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Star, Mail, Phone, Globe, ExternalLink, TrendingUp, Zap } from 'lucide-react';
import { toast } from 'sonner';

interface PriorityLead {
  id: string;
  business_name: string;
  business_description: string | null;
  category: string | null;
  city: string | null;
  state: string | null;
  owner_email: string | null;
  phone_number: string | null;
  website_url: string | null;
  lead_score: number | null;
  data_quality_score: number | null;
  email_status: string;
  claim_status: string | null;
}

export const PriorityLeadsTab: React.FC = () => {
  // Fetch high-priority leads (score >= 70 or have complete contact info)
  const { data: priorityLeads, isLoading, refetch } = useQuery({
    queryKey: ['priority-leads'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('b2b_external_leads')
        .select('id, business_name, business_description, category, city, state, owner_email, phone_number, website_url, lead_score, data_quality_score, email_status, claim_status')
        .or('lead_score.gte.70,and(owner_email.neq.null,phone_number.neq.null)')
        .eq('is_converted', false)
        .neq('claim_status', 'claimed')
        .order('lead_score', { ascending: false, nullsFirst: false })
        .limit(50);

      if (error) throw error;
      return data as PriorityLead[];
    },
    staleTime: 60000,
  });

  const markAsPriority = async (leadId: string) => {
    const { error } = await supabase
      .from('b2b_external_leads')
      .update({ priority_rank: 'high' })
      .eq('id', leadId);
    
    if (error) {
      toast.error('Failed to mark as priority');
    } else {
      toast.success('Lead marked as priority');
      refetch();
    }
  };

  const getScoreColor = (score: number | null) => {
    if (!score) return 'bg-gray-500/20 text-gray-400';
    if (score >= 80) return 'bg-green-500/20 text-green-400';
    if (score >= 70) return 'bg-yellow-500/20 text-yellow-400';
    return 'bg-orange-500/20 text-orange-400';
  };

  if (isLoading) {
    return (
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-400" />
            Priority Leads
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/5 border-white/10">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-white flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-400" />
              Priority Leads
              <Badge className="bg-yellow-500/20 text-yellow-400 ml-2">
                {priorityLeads?.length || 0} hot leads
              </Badge>
            </CardTitle>
            <CardDescription className="text-blue-200">
              High-scoring leads with complete contact info - reach out first!
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="border-white/20 text-blue-200"
          >
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {!priorityLeads || priorityLeads.length === 0 ? (
          <div className="text-center py-12">
            <Star className="w-12 h-12 mx-auto mb-4 text-yellow-400 opacity-50" />
            <p className="text-blue-200">No priority leads found</p>
            <p className="text-sm text-blue-300">Import more leads or run AI Discovery to find high-value prospects</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[600px] overflow-y-auto">
            {priorityLeads.map((lead) => (
              <div
                key={lead.id}
                className="p-4 bg-white/5 rounded-lg border border-white/10 hover:border-yellow-400/30 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-white truncate">{lead.business_name}</h4>
                      <Badge className={getScoreColor(lead.lead_score)}>
                        <TrendingUp className="w-3 h-3 mr-1" />
                        {lead.lead_score || 'N/A'}
                      </Badge>
                      {lead.claim_status === 'pending' && (
                        <Badge className="bg-blue-500/20 text-blue-400">Claim Pending</Badge>
                      )}
                    </div>
                    
                    {lead.business_description && (
                      <p className="text-sm text-blue-200 line-clamp-2 mb-2">
                        {lead.business_description}
                      </p>
                    )}
                    
                    <div className="flex flex-wrap items-center gap-3 text-xs text-blue-300">
                      {lead.category && (
                        <Badge variant="outline" className="border-amber-400/40 text-amber-400">
                          {lead.category}
                        </Badge>
                      )}
                      {(lead.city || lead.state) && (
                        <span>{[lead.city, lead.state].filter(Boolean).join(', ')}</span>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-4 mt-3">
                      {lead.owner_email && (
                        <a
                          href={`mailto:${lead.owner_email}`}
                          className="flex items-center gap-1 text-sm text-green-400 hover:text-green-300"
                        >
                          <Mail className="w-4 h-4" />
                          {lead.owner_email}
                        </a>
                      )}
                      {lead.phone_number && (
                        <a
                          href={`tel:${lead.phone_number}`}
                          className="flex items-center gap-1 text-sm text-cyan-400 hover:text-cyan-300"
                        >
                          <Phone className="w-4 h-4" />
                          {lead.phone_number}
                        </a>
                      )}
                      {lead.website_url && (
                        <a
                          href={lead.website_url.startsWith('http') ? lead.website_url : `https://${lead.website_url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-sm text-purple-400 hover:text-purple-300"
                        >
                          <Globe className="w-4 h-4" />
                          Website
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-yellow-500 to-orange-500"
                      onClick={() => markAsPriority(lead.id)}
                    >
                      <Zap className="w-4 h-4 mr-1" />
                      Prioritize
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
