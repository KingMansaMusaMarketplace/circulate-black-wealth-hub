/**
 * Types for B2B External Lead Discovery
 * Perplexity-powered web search results
 */

export interface ExternalLeadContact {
  email?: string;
  phone?: string;
  linkedin?: string;
}

export interface DiscoveredBusiness {
  name: string;
  description: string;
  category: string;
  location?: string;
  website?: string;
  contact?: ExternalLeadContact;
  confidence: number;
}

export interface WebSearchResponse {
  businesses: DiscoveredBusiness[];
  citations: string[];
  query: string;
  searchedAt: string;
}

export interface B2BExternalLead {
  id: string;
  discovered_by_user_id: string | null;
  discovered_by_business_id: string | null;
  source_query: string;
  business_name: string;
  business_description: string | null;
  category: string | null;
  contact_info: ExternalLeadContact;
  website_url: string | null;
  location: string | null;
  source_citations: string[];
  is_invited: boolean;
  invited_at: string | null;
  is_converted: boolean;
  converted_business_id: string | null;
  confidence_score: number | null;
  lead_score: number | null;
  invitation_clicked_at: string | null;
  invitation_token: string | null;
  created_at: string;
  updated_at: string;
}
