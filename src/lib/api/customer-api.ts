import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export interface CustomerProfile {
  id: string;
  user_id: string;
  email: string;
  full_name: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  avatar_url?: string;
  date_of_birth?: string;
  loyalty_points: number;
  total_scans: number;
  total_purchases: number;
  created_at: string;
  updated_at: string;
  user_type: string;
  is_hbcu_member: boolean;
  hbcu_verification_status: 'pending' | 'approved' | 'rejected';
  hbcu_institution?: string;
  graduation_year?: number;
}

// Get customer profile by user ID
export const getCustomerProfile = async (userId: string): Promise<CustomerProfile | null> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .eq('user_type', 'customer')
      .single();
    
    if (error) throw error;
    
    return {
      ...data,
      user_id: data.id,
      loyalty_points: 0, // Default values for missing properties
      total_scans: 0,
      total_purchases: 0
    } as CustomerProfile;
  } catch (error: any) {
    console.error('Error fetching customer profile:', error.message);
    return null;
  }
};

// Export alias for compatibility
export const fetchCustomerProfile = getCustomerProfile;

// Update customer profile
export const updateCustomerProfile = async (
  userId: string, 
  updates: Partial<CustomerProfile>
): Promise<{ success: boolean; profile?: CustomerProfile; error?: any }> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
    
    if (error) throw error;
    
    toast.success('Profile updated successfully!');
    return { 
      success: true, 
      profile: {
        ...data,
        user_id: data.id,
        loyalty_points: 0,
        total_scans: 0,
        total_purchases: 0
      } as CustomerProfile 
    };
  } catch (error: any) {
    console.error('Error updating customer profile:', error.message);
    toast.error('Failed to update profile: ' + error.message);
    return { success: false, error };
  }
};

// Export alias for compatibility
export const saveCustomerProfile = async (profile: CustomerProfile) => {
  return updateCustomerProfile(profile.user_id, profile);
};

// Get customer loyalty stats
export const getCustomerLoyaltyStats = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('qr_scans')
      .select('points_awarded, scan_date')
      .eq('customer_id', userId)
      .order('scan_date', { ascending: false });
    
    if (error) throw error;
    
    const totalPoints = data?.reduce((sum, scan) => sum + (scan.points_awarded || 0), 0) || 0;
    const totalScans = data?.length || 0;
    
    return {
      totalPoints,
      totalScans,
      recentScans: data?.slice(0, 10) || []
    };
  } catch (error: any) {
    console.error('Error fetching loyalty stats:', error.message);
    return {
      totalPoints: 0,
      totalScans: 0,
      recentScans: []
    };
  }
};

// Get customer's favorite businesses
export const getCustomerFavoriteBusinesses = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('qr_scans')
      .select(`
        business_id,
        businesses!inner(
          id,
          business_name,
          logo_url,
          category
        )
      `)
      .eq('customer_id', userId);
    
    if (error) throw error;
    
    // Group by business and count visits
    const businessCounts = data?.reduce((acc: any, scan: any) => {
      const businessId = scan.business_id;
      if (!acc[businessId]) {
        acc[businessId] = {
          business: scan.businesses,
          visitCount: 0
        };
      }
      acc[businessId].visitCount++;
      return acc;
    }, {});
    
    // Convert to array and sort by visit count
    const favorites = Object.values(businessCounts || {})
      .sort((a: any, b: any) => b.visitCount - a.visitCount)
      .slice(0, 5);
    
    return favorites;
  } catch (error: any) {
    console.error('Error fetching favorite businesses:', error.message);
    return [];
  }
};

// ========== CRM FUNCTIONS ==========

export interface Customer {
  id: string;
  business_id: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  company?: string;
  job_title?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  country?: string;
  customer_status: 'lead' | 'active' | 'inactive' | 'vip';
  lifecycle_stage: 'lead' | 'prospect' | 'customer' | 'evangelist' | 'churned';
  source?: string;
  lifetime_value: number;
  total_purchases: number;
  last_purchase_date?: string;
  last_contact_date?: string;
  next_followup_date?: string;
  birthday?: string;
  anniversary?: string;
  notes?: string;
  custom_fields?: Record<string, any>;
  created_at: string;
  updated_at: string;
  created_by?: string;
  tags?: CustomerTag[];
}

export interface CustomerInteraction {
  id: string;
  customer_id: string;
  business_id: string;
  interaction_type: 'call' | 'email' | 'meeting' | 'note' | 'purchase' | 'support' | 'other';
  subject: string;
  description?: string;
  interaction_date: string;
  duration_minutes?: number;
  outcome?: string;
  followup_required: boolean;
  followup_date?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface CustomerTag {
  id: string;
  customer_id: string;
  tag: string;
  created_at: string;
}

// Get all customers for a business
export const getCustomers = async (businessId: string) => {
  const { data, error } = await supabase
    .from('customers')
    .select(`
      *,
      tags:customer_tags(*)
    `)
    .eq('business_id', businessId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Customer[];
};

// Get single customer with full details
export const getCustomer = async (customerId: string) => {
  const { data, error } = await supabase
    .from('customers')
    .select(`
      *,
      tags:customer_tags(*)
    `)
    .eq('id', customerId)
    .single();

  if (error) throw error;
  return data as Customer;
};

// Create customer
export const createCustomer = async (customer: Omit<Customer, 'id' | 'created_at' | 'updated_at' | 'lifetime_value' | 'total_purchases'>) => {
  const { data, error } = await supabase
    .from('customers')
    .insert(customer)
    .select()
    .single();

  if (error) throw error;
  toast.success('Customer created successfully!');
  return data as Customer;
};

// Update customer
export const updateCustomer = async (customerId: string, updates: Partial<Customer>) => {
  const { data, error } = await supabase
    .from('customers')
    .update(updates)
    .eq('id', customerId)
    .select()
    .single();

  if (error) throw error;
  toast.success('Customer updated successfully!');
  return data as Customer;
};

// Delete customer
export const deleteCustomer = async (customerId: string) => {
  const { error } = await supabase
    .from('customers')
    .delete()
    .eq('id', customerId);

  if (error) throw error;
  toast.success('Customer deleted successfully!');
};

// Get customer interactions
export const getCustomerInteractions = async (customerId: string) => {
  const { data, error } = await supabase
    .from('customer_interactions')
    .select('*')
    .eq('customer_id', customerId)
    .order('interaction_date', { ascending: false });

  if (error) throw error;
  return data as CustomerInteraction[];
};

// Create interaction
export const createInteraction = async (interaction: Omit<CustomerInteraction, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('customer_interactions')
    .insert(interaction)
    .select()
    .single();

  if (error) throw error;
  
  // Update last_contact_date on customer
  await supabase
    .from('customers')
    .update({ last_contact_date: interaction.interaction_date })
    .eq('id', interaction.customer_id);

  toast.success('Interaction logged successfully!');
  return data as CustomerInteraction;
};

// Add tag to customer
export const addCustomerTag = async (customerId: string, tag: string) => {
  const { data, error } = await supabase
    .from('customer_tags')
    .insert({ customer_id: customerId, tag })
    .select()
    .single();

  if (error) throw error;
  return data as CustomerTag;
};

// Remove tag from customer
export const removeCustomerTag = async (tagId: string) => {
  const { error } = await supabase
    .from('customer_tags')
    .delete()
    .eq('id', tagId);

  if (error) throw error;
};

// Get customer purchase history (from invoices)
export const getCustomerPurchaseHistory = async (customerId: string) => {
  const { data, error } = await supabase
    .from('invoices')
    .select('*')
    .eq('customer_id', customerId)
    .order('invoice_date', { ascending: false});

  if (error) throw error;
  return data;
};

// Get CRM analytics
export const getCRMAnalytics = async (businessId: string) => {
  const { data: customers, error } = await supabase
    .from('customers')
    .select('*')
    .eq('business_id', businessId);

  if (error) throw error;

  const totalCustomers = customers?.length || 0;
  const activeCustomers = customers?.filter(c => c.customer_status === 'active').length || 0;
  const vipCustomers = customers?.filter(c => c.customer_status === 'vip').length || 0;
  const leads = customers?.filter(c => c.lifecycle_stage === 'lead').length || 0;
  const totalLifetimeValue = customers?.reduce((sum, c) => sum + (parseFloat(c.lifetime_value as any) || 0), 0) || 0;
  const avgLifetimeValue = totalCustomers > 0 ? totalLifetimeValue / totalCustomers : 0;

  return {
    totalCustomers,
    activeCustomers,
    vipCustomers,
    leads,
    totalLifetimeValue,
    avgLifetimeValue
  };
};
