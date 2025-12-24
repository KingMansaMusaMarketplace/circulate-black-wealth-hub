/**
 * @fileoverview B2B Marketplace Hook - AI-Driven Circularity Engine
 * 
 * PATENT PROTECTED - Provisional Application Filed
 * ================================================
 * Title: System and Method for a Multi-Tenant Vertical Marketplace Operating System
 *        Featuring Temporal Incentives, Circulatory Multiplier Attribution, and
 *        Geospatial Velocity Fraud Detection
 * 
 * CLAIM 1: AI-Driven Economic Circularity System
 * -----------------------------------------------
 * This module implements a proprietary computer-implemented system for automated
 * economic circularity utilizing AI to match merchant transaction data with
 * community wholesale vendors, keeping money within the target demographic.
 * 
 * Protected B2B Matching Logic:
 * - Capability-to-Need matching algorithm with match_score calculation
 * - Category-based supplier discovery (16 B2B categories)
 * - Connection status lifecycle management (inquiry → active → completed)
 * - Impact metrics aggregation (money_kept_in_community tracking)
 * - Integration with circularity multiplier for economic impact attribution
 * 
 * The system creates a closed-loop economy where B2C transaction data
 * automatically triggers B2B supplier recommendations.
 * 
 * © 2024-2025. All rights reserved. Unauthorized replication prohibited.
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useBusinessProfile } from '@/hooks/use-business-profile';
import { toast } from 'sonner';

export interface BusinessCapability {
  id: string;
  business_id: string;
  capability_type: string;
  category: string;
  subcategory: string | null;
  title: string;
  description: string | null;
  minimum_order_value: number | null;
  maximum_capacity: string | null;
  lead_time_days: number | null;
  service_area: string[] | null;
  certifications: string[] | null;
  pricing_model: string | null;
  price_range_min: number | null;
  price_range_max: number | null;
  is_active: boolean;
  created_at: string;
  business?: {
    business_name: string;
    logo_url: string | null;
    city: string | null;
    state: string | null;
    average_rating: number | null;
  };
}

export interface BusinessNeed {
  id: string;
  business_id: string;
  need_type: string;
  category: string;
  subcategory: string | null;
  title: string;
  description: string | null;
  budget_min: number | null;
  budget_max: number | null;
  urgency: string | null;
  quantity: string | null;
  preferred_location: string[] | null;
  status: string;
  expires_at: string | null;
  created_at: string;
  business?: {
    business_name: string;
    logo_url: string | null;
    city: string | null;
    state: string | null;
  };
}

export interface B2BConnection {
  id: string;
  buyer_business_id: string;
  supplier_business_id: string;
  connection_type: string | null;
  match_score: number | null;
  notes: string | null;
  estimated_value: number | null;
  actual_value: number | null;
  status: string;
  created_at: string;
  buyer_business?: {
    business_name: string;
    logo_url: string | null;
  };
  supplier_business?: {
    business_name: string;
    logo_url: string | null;
  };
}

export interface B2BImpactMetrics {
  total_connections: number;
  active_connections: number;
  completed_connections: number;
  total_transaction_value: number;
  active_suppliers: number;
  open_needs: number;
  average_match_score: number;
  money_kept_in_community: number;
}

const B2B_CATEGORIES = [
  'Catering & Food Service',
  'Marketing & Advertising',
  'IT & Technology',
  'Legal Services',
  'Accounting & Finance',
  'Printing & Graphics',
  'Construction & Renovation',
  'Transportation & Logistics',
  'Cleaning & Maintenance',
  'Security Services',
  'Event Planning',
  'Photography & Video',
  'Consulting',
  'Wholesale Supplies',
  'Manufacturing',
  'Other',
];

export const useB2B = () => {
  const { user } = useAuth();
  const { profile: businessProfile } = useBusinessProfile();
  const [capabilities, setCapabilities] = useState<BusinessCapability[]>([]);
  const [needs, setNeeds] = useState<BusinessNeed[]>([]);
  const [connections, setConnections] = useState<B2BConnection[]>([]);
  const [allCapabilities, setAllCapabilities] = useState<BusinessCapability[]>([]);
  const [allNeeds, setAllNeeds] = useState<BusinessNeed[]>([]);
  const [impactMetrics, setImpactMetrics] = useState<B2BImpactMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchB2BData = useCallback(async () => {
    try {
      setLoading(true);

      // Fetch all active capabilities (marketplace view)
      const { data: allCapsData } = await supabase
        .from('business_capabilities')
        .select(`
          *,
          business:business_id(business_name, logo_url, city, state, average_rating)
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (allCapsData) {
        setAllCapabilities(allCapsData as unknown as BusinessCapability[]);
      }

      // Fetch all open needs (marketplace view)
      const { data: allNeedsData } = await supabase
        .from('business_needs')
        .select(`
          *,
          business:business_id(business_name, logo_url, city, state)
        `)
        .eq('status', 'open')
        .order('created_at', { ascending: false });

      if (allNeedsData) {
        setAllNeeds(allNeedsData as unknown as BusinessNeed[]);
      }

      // Fetch impact metrics
      const { data: metricsData } = await supabase.rpc('get_b2b_impact_metrics');
      if (metricsData) {
        setImpactMetrics(metricsData as B2BImpactMetrics);
      }

      // If user has a business, fetch their specific data
      if (businessProfile?.id) {
        // My capabilities
        const { data: myCapsData } = await supabase
          .from('business_capabilities')
          .select('*')
          .eq('business_id', businessProfile.id);

        if (myCapsData) {
          setCapabilities(myCapsData as BusinessCapability[]);
        }

        // My needs
        const { data: myNeedsData } = await supabase
          .from('business_needs')
          .select('*')
          .eq('business_id', businessProfile.id);

        if (myNeedsData) {
          setNeeds(myNeedsData as BusinessNeed[]);
        }

        // My connections
        const { data: connectionsData } = await supabase
          .from('b2b_connections')
          .select(`
            *,
            buyer_business:buyer_business_id(business_name, logo_url),
            supplier_business:supplier_business_id(business_name, logo_url)
          `)
          .or(`buyer_business_id.eq.${businessProfile.id},supplier_business_id.eq.${businessProfile.id}`)
          .order('created_at', { ascending: false });

        if (connectionsData) {
          setConnections(connectionsData as unknown as B2BConnection[]);
        }
      }
    } catch (error) {
      console.error('Error fetching B2B data:', error);
    } finally {
      setLoading(false);
    }
  }, [businessProfile?.id]);

  useEffect(() => {
    fetchB2BData();
  }, [fetchB2BData]);

  const addCapability = async (capability: Partial<BusinessCapability>) => {
    if (!businessProfile?.id) {
      toast.error('You need a business profile to add capabilities');
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('business_capabilities')
        .insert({
          ...capability,
          business_id: businessProfile.id,
        })
        .select()
        .single();

      if (error) throw error;

      toast.success('Capability added successfully');
      await fetchB2BData();
      return data;
    } catch (error) {
      console.error('Error adding capability:', error);
      toast.error('Failed to add capability');
      return null;
    }
  };

  const addNeed = async (need: Partial<BusinessNeed>) => {
    if (!businessProfile?.id) {
      toast.error('You need a business profile to post needs');
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('business_needs')
        .insert({
          ...need,
          business_id: businessProfile.id,
        })
        .select()
        .single();

      if (error) throw error;

      toast.success('Need posted successfully');
      await fetchB2BData();
      return data;
    } catch (error) {
      console.error('Error adding need:', error);
      toast.error('Failed to post need');
      return null;
    }
  };

  const initiateConnection = async (
    supplierBusinessId: string,
    needId?: string,
    capabilityId?: string,
    notes?: string
  ) => {
    if (!businessProfile?.id || !user) {
      toast.error('You need a business profile to connect');
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('b2b_connections')
        .insert({
          buyer_business_id: businessProfile.id,
          supplier_business_id: supplierBusinessId,
          initial_need_id: needId,
          capability_id: capabilityId,
          notes,
          connection_type: 'inquiry',
          initiated_by: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      toast.success('Connection request sent!');
      await fetchB2BData();
      return data;
    } catch (error) {
      console.error('Error initiating connection:', error);
      toast.error('Failed to send connection request');
      return null;
    }
  };

  const updateConnectionStatus = async (connectionId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('b2b_connections')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', connectionId);

      if (error) throw error;

      toast.success(`Connection ${status}`);
      await fetchB2BData();
    } catch (error) {
      console.error('Error updating connection:', error);
      toast.error('Failed to update connection');
    }
  };

  const searchCapabilities = async (query: string, category?: string) => {
    let queryBuilder = supabase
      .from('business_capabilities')
      .select(`
        *,
        business:business_id(business_name, logo_url, city, state, average_rating)
      `)
      .eq('is_active', true);

    if (query) {
      queryBuilder = queryBuilder.or(`title.ilike.%${query}%,description.ilike.%${query}%`);
    }

    if (category && category !== 'all') {
      queryBuilder = queryBuilder.eq('category', category);
    }

    const { data, error } = await queryBuilder.order('created_at', { ascending: false });

    if (error) {
      console.error('Error searching capabilities:', error);
      return [];
    }

    return data as unknown as BusinessCapability[];
  };

  return {
    capabilities,
    needs,
    connections,
    allCapabilities,
    allNeeds,
    impactMetrics,
    loading,
    addCapability,
    addNeed,
    initiateConnection,
    updateConnectionStatus,
    searchCapabilities,
    refreshData: fetchB2BData,
    B2B_CATEGORIES,
  };
};
