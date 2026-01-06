import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

// Public-safe external lead interface (excludes PII fields)
export interface ExternalLead {
  id: string;
  business_name: string;
  business_description: string | null;
  category: string | null;
  city: string | null;
  state: string | null;
  location: string | null;
  website_url: string | null;
  confidence_score: number | null;
  data_quality_score: number | null;
  is_converted: boolean | null;
  created_at: string;
}

export const useClaimBusiness = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [claimingId, setClaimingId] = useState<string | null>(null);

  // Fetch all visible external leads for directory display using public-safe view
  const { data: externalLeads, isLoading: leadsLoading } = useQuery({
    queryKey: ['external-leads-directory'],
    queryFn: async () => {
      // Use RPC function to get public-safe lead data (excludes PII)
      const { data, error } = await supabase
        .rpc('get_public_external_leads', { p_limit: 50 });

      if (error) throw error;
      return (data || []) as ExternalLead[];
    },
  });

  // Generate claim token for a lead
  const generateClaimToken = useMutation({
    mutationFn: async (leadId: string) => {
      setClaimingId(leadId);
      
      const { data, error } = await supabase
        .rpc('generate_claim_token', { lead_id: leadId });

      if (error) throw error;
      return { token: data, leadId };
    },
    onSuccess: (data) => {
      // Generate the claim URL
      const claimUrl = `${window.location.origin}/claim-business?token=${data.token}`;
      
      toast.success('Claim link generated!', {
        description: 'Share this link with the business owner to let them claim their listing.',
        action: {
          label: 'Copy Link',
          onClick: () => {
            navigator.clipboard.writeText(claimUrl);
            toast.success('Link copied to clipboard!');
          }
        }
      });
      
      queryClient.invalidateQueries({ queryKey: ['external-leads-directory'] });
    },
    onError: (error) => {
      console.error('Error generating claim token:', error);
      toast.error('Failed to generate claim link');
    },
    onSettled: () => {
      setClaimingId(null);
    }
  });

  // Claim a business with token
  const claimBusiness = useMutation({
    mutationFn: async (token: string) => {
      if (!user) throw new Error('Must be logged in to claim a business');

      const { data, error } = await supabase
        .rpc('claim_business_lead', { 
          p_token: token, 
          p_user_id: user.id 
        });

      if (error) throw error;
      return data as { success: boolean; lead_id?: string; business_name?: string; error?: string };
    },
    onSuccess: (data) => {
      if (data.success) {
        toast.success(`Successfully claimed ${data.business_name}!`, {
          description: 'You can now manage this business listing.'
        });
        queryClient.invalidateQueries({ queryKey: ['external-leads-directory'] });
      } else {
        toast.error(data.error || 'Failed to claim business');
      }
    },
    onError: (error) => {
      console.error('Error claiming business:', error);
      toast.error('Failed to claim business');
    }
  });

  // Start claim process (for business owners clicking "Claim This Business")
  const initiateClaim = async (leadId: string) => {
    if (!user) {
      toast.error('Please sign in to claim your business');
      return null;
    }

    return generateClaimToken.mutateAsync(leadId);
  };

  return {
    externalLeads: externalLeads || [],
    leadsLoading,
    initiateClaim,
    claimBusiness: claimBusiness.mutate,
    claimingId,
    isGeneratingToken: generateClaimToken.isPending,
    isClaiming: claimBusiness.isPending,
  };
};
