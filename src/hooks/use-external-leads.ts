import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { B2BExternalLead, DiscoveredBusiness } from '@/types/b2b-external';

export function useExternalLeads() {
  const { user } = useAuth();
  const [leads, setLeads] = useState<B2BExternalLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [invitingLeadId, setInvitingLeadId] = useState<string | null>(null);

  const fetchLeads = useCallback(async () => {
    if (!user) {
      setLeads([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('b2b_external_leads')
        .select('*')
        .eq('discovered_by_user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Map the data to match our interface (handle JSONB properly)
      const mappedLeads = (data || []).map(lead => ({
        ...lead,
        contact_info: typeof lead.contact_info === 'object' ? lead.contact_info : {},
      })) as B2BExternalLead[];
      
      setLeads(mappedLeads);
    } catch (error) {
      console.error('Error fetching leads:', error);
      toast.error('Failed to load leads');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const sendInvitation = async (lead: B2BExternalLead, personalMessage?: string) => {
    if (!user) {
      toast.error('Please sign in to send invitations');
      return false;
    }

    const email = lead.contact_info?.email;
    if (!email) {
      toast.error('No email address available for this lead');
      return false;
    }

    setInvitingLeadId(lead.id);

    try {
      // Get inviter profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user.id)
        .single();

      // Get inviter business if they have one
      const { data: business } = await supabase
        .from('businesses')
        .select('business_name')
        .eq('owner_id', user.id)
        .single();

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-b2b-invitation`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            businessName: lead.business_name,
            businessEmail: email,
            inviterName: profile?.full_name || 'A Mansa Musa member',
            inviterBusinessName: business?.business_name,
            category: lead.category || 'business services',
            personalMessage,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to send invitation');
      }

      // Update lead as invited
      await supabase
        .from('b2b_external_leads')
        .update({
          is_invited: true,
          invited_at: new Date().toISOString(),
        })
        .eq('id', lead.id);

      toast.success(`Invitation sent to ${lead.business_name}!`);
      await fetchLeads();
      return true;
    } catch (error) {
      console.error('Error sending invitation:', error);
      const message = error instanceof Error ? error.message : 'Failed to send invitation';
      toast.error(message);
      return false;
    } finally {
      setInvitingLeadId(null);
    }
  };

  const deleteLead = async (leadId: string) => {
    try {
      const { error } = await supabase
        .from('b2b_external_leads')
        .delete()
        .eq('id', leadId);

      if (error) throw error;

      toast.success('Lead removed');
      setLeads(prev => prev.filter(l => l.id !== leadId));
    } catch (error) {
      console.error('Error deleting lead:', error);
      toast.error('Failed to remove lead');
    }
  };

  const getLeadStats = () => {
    const total = leads.length;
    const invited = leads.filter(l => l.is_invited).length;
    const converted = leads.filter(l => l.is_converted).length;
    const pending = total - invited;

    return { total, invited, converted, pending };
  };

  return {
    leads,
    loading,
    invitingLeadId,
    fetchLeads,
    sendInvitation,
    deleteLead,
    getLeadStats,
  };
}
