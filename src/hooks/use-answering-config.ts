
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface FaqEntry {
  question: string;
  answer: string;
}

export interface BusinessHours {
  [day: string]: { open: string; close: string } | null;
}

export interface AnsweringConfig {
  id: string;
  business_id: string;
  owner_id: string;
  greeting_message: string;
  business_hours: BusinessHours;
  faq_entries: FaqEntry[];
  forwarding_number: string | null;
  is_active: boolean;
  voice_id: string | null;
  max_call_duration_seconds: number;
  twilio_phone_number: string | null;
  created_at: string;
  updated_at: string;
}

export function useAnsweringConfig(businessId: string) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['answering-config', businessId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('business_answering_config')
        .select('*')
        .eq('business_id', businessId)
        .maybeSingle();

      if (error) throw error;
      return data as AnsweringConfig | null;
    },
    enabled: !!businessId && !!user,
  });

  const saveMutation = useMutation({
    mutationFn: async (configData: Partial<AnsweringConfig>) => {
      if (!user) throw new Error('Not authenticated');

      const payload = {
        ...configData,
        business_id: businessId,
        owner_id: user.id,
      };

      if (query.data?.id) {
        const { data, error } = await supabase
          .from('business_answering_config')
          .update(payload)
          .eq('id', query.data.id)
          .select()
          .single();
        if (error) throw error;
        return data;
      } else {
        const { data, error } = await supabase
          .from('business_answering_config')
          .insert(payload)
          .select()
          .single();
        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['answering-config', businessId] });
      toast.success('Answering service configuration saved');
    },
    onError: (error: Error) => {
      toast.error(`Failed to save: ${error.message}`);
    },
  });

  const toggleMutation = useMutation({
    mutationFn: async (isActive: boolean) => {
      if (!query.data?.id) throw new Error('No configuration found. Please set up the service first.');
      const { error } = await supabase
        .from('business_answering_config')
        .update({ is_active: isActive })
        .eq('id', query.data.id);
      if (error) throw error;
    },
    onSuccess: (_, isActive) => {
      queryClient.invalidateQueries({ queryKey: ['answering-config', businessId] });
      toast.success(isActive ? 'Answering service activated' : 'Answering service deactivated');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  return {
    config: query.data,
    isLoading: query.isLoading,
    save: saveMutation.mutate,
    isSaving: saveMutation.isPending,
    toggle: toggleMutation.mutate,
    isToggling: toggleMutation.isPending,
  };
}
