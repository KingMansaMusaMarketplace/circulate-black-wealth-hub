import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface FoundingMember {
  id: string;
  name: string;
  category: string;
  logo_url: string | null;
  founding_order: number;
  founding_joined_at: string;
  city: string | null;
  state: string | null;
}

export interface FoundingSponsor {
  company_name: string;
  tier: string;
  logo_url: string | null;
  website_url: string | null;
  created_at: string;
}

export const useFoundingMembers = () => {
  const [members, setMembers] = useState<FoundingMember[]>([]);
  const [sponsors, setSponsors] = useState<FoundingSponsor[]>([]);
  const [loading, setLoading] = useState(true);
  const [spotsRemaining, setSpotsRemaining] = useState(100);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch founding businesses
        const { data: businessData, error: businessError } = await supabase
          .from('businesses')
          .select('id, name, category, logo_url, founding_order, founding_joined_at, city, state')
          .eq('is_founding_member', true)
          .eq('is_verified', true)
          .order('founding_order', { ascending: true })
          .limit(100);

        if (businessError) {
          console.error('Error fetching founding members:', businessError);
        } else {
          setMembers(businessData as FoundingMember[]);
          setSpotsRemaining(Math.max(0, 100 - (businessData?.length || 0)));
        }

        // Fetch founding sponsors
        const { data: sponsorData, error: sponsorError } = await supabase
          .from('corporate_subscriptions')
          .select('company_name, tier, logo_url, website_url, created_at')
          .eq('is_founding_sponsor', true)
          .eq('status', 'active')
          .order('created_at', { ascending: true });

        if (sponsorError) {
          console.error('Error fetching founding sponsors:', sponsorError);
        } else {
          setSponsors(sponsorData as FoundingSponsor[]);
        }
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { members, sponsors, loading, spotsRemaining };
};
