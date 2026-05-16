import { supabase } from '@/integrations/supabase/client';

export type HotelPartnerStatus = 'pending' | 'active' | 'suspended' | 'rejected';

export interface HotelPartner {
  id: string;
  hotel_name: string;
  address_line1: string | null;
  address_city: string | null;
  address_state: string | null;
  address_zip: string | null;
  contact_name: string;
  contact_email: string;
  contact_phone: string | null;
  website_url: string | null;
  notes: string | null;
  status: HotelPartnerStatus;
  billing_terms: string;
  commission_rate: number;
  approved_at: string | null;
  rejection_reason: string | null;
  created_at: string;
}

export interface HotelPartnerApplication {
  hotel_name: string;
  address_line1?: string;
  address_city?: string;
  address_state?: string;
  address_zip?: string;
  contact_name: string;
  contact_email: string;
  contact_phone?: string;
  website_url?: string;
  notes?: string;
}

export async function submitHotelPartnerApplication(app: HotelPartnerApplication) {
  return supabase.from('noir_hotel_partners').insert({ ...app, status: 'pending' as const });
}

export async function listHotelPartners() {
  return supabase
    .from('noir_hotel_partners')
    .select('*')
    .order('created_at', { ascending: false });
}

export async function updateHotelPartnerStatus(
  id: string,
  status: HotelPartnerStatus,
  rejection_reason?: string,
) {
  const patch: Record<string, unknown> = { status };
  if (status === 'active') {
    patch.approved_at = new Date().toISOString();
  }
  if (status === 'rejected' && rejection_reason) {
    patch.rejection_reason = rejection_reason;
  }
  return supabase.from('noir_hotel_partners').update(patch).eq('id', id);
}

export async function listActiveHotelPartners() {
  return supabase
    .from('noir_hotel_partners')
    .select('id, hotel_name, address_city, address_state')
    .eq('status', 'active')
    .order('hotel_name');
}

export async function getMyConciergeMemberships(userId: string) {
  return supabase
    .from('noir_concierge_users')
    .select('id, role, hotel_partner_id, is_active')
    .eq('user_id', userId)
    .eq('is_active', true);
}

export const HOTEL_STATUS_COLORS: Record<HotelPartnerStatus, string> = {
  pending: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  active: 'bg-green-500/20 text-green-300 border-green-500/30',
  suspended: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
  rejected: 'bg-red-500/20 text-red-300 border-red-500/30',
};
