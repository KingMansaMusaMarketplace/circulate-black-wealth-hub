export type TechnicalPartnerStatus = 'pending' | 'active' | 'suspended';

export interface TechnicalPartner {
  id: string;
  developer_id: string;
  partner_id: string | null;
  status: TechnicalPartnerStatus;
  revenue_share_percent: number;
  total_app_referrals: number;
  total_app_earnings: number;
  app_name: string | null;
  app_url: string | null;
  approved_at: string | null;
  approved_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface AppBusinessAttribution {
  id: string;
  developer_id: string;
  business_id: string;
  app_name: string;
  attribution_source: string | null;
  api_calls_generated: number;
  earnings_attributed: number;
  first_api_call_at: string | null;
  created_at: string;
}

export interface PartnerReferredBusiness {
  id: string;
  business_name: string;
  category: string | null;
  city: string | null;
  state: string | null;
  average_rating: number | null;
  review_count: number | null;
  partner_id: string;
  referring_directory: string;
  partner_tier: string;
  joined_at: string | null;
}

export interface EcosystemCrossStats {
  active_partners: number;
  active_developers: number;
  technical_partners: number;
  partner_referred_businesses: number;
  app_attributed_businesses: number;
  total_partner_earnings: number;
  total_technical_partner_earnings: number;
}

export interface DeveloperEcosystemData {
  appsUsingPartnerData: number;
  businessesAvailable: number;
  apiCallsFromPartnerData: number;
  partnerNetworks: number;
  technicalPartnerStatus: TechnicalPartnerStatus | null;
  technicalPartnerEarnings: number;
}

export interface PartnerDeveloperImpact {
  appsUsingReferrals: number;
  apiCallsGenerated: number;
  additionalEarnings: number;
  isTechnicalPartner: boolean;
  technicalPartnerStatus: TechnicalPartnerStatus | null;
}
