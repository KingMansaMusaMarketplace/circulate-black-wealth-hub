import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

// =============================================
// KNOWLEDGE BASE
// =============================================

export interface KnowledgeBaseArticle {
  id: string;
  business_id?: string;
  title: string;
  content: string;
  category: string;
  is_published: boolean;
  view_count: number;
  helpful_count: number;
  not_helpful_count: number;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export const getKnowledgeBaseArticles = async (
  businessId?: string,
  publishedOnly = true
): Promise<KnowledgeBaseArticle[]> => {
  let query = supabase
    .from('knowledge_base_articles')
    .select('*')
    .order('created_at', { ascending: false });

  if (businessId) {
    query = query.or(`business_id.eq.${businessId},business_id.is.null`);
  }

  if (publishedOnly) {
    query = query.eq('is_published', true);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data as KnowledgeBaseArticle[];
};

export const getKnowledgeBaseArticle = async (articleId: string): Promise<KnowledgeBaseArticle> => {
  const { data, error } = await supabase
    .from('knowledge_base_articles')
    .select('*')
    .eq('id', articleId)
    .single();

  if (error) throw error;

  // Increment view count
  await supabase
    .from('knowledge_base_articles')
    .update({ view_count: (data.view_count || 0) + 1 })
    .eq('id', articleId);

  return data as KnowledgeBaseArticle;
};

export const searchKnowledgeBase = async (
  query: string,
  businessId?: string
): Promise<KnowledgeBaseArticle[]> => {
  let dbQuery = supabase
    .from('knowledge_base_articles')
    .select('*')
    .eq('is_published', true)
    .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
    .order('helpful_count', { ascending: false })
    .limit(10);

  if (businessId) {
    dbQuery = dbQuery.or(`business_id.eq.${businessId},business_id.is.null`);
  }

  const { data, error } = await dbQuery;
  if (error) throw error;
  return data as KnowledgeBaseArticle[];
};

export const createKnowledgeBaseArticle = async (
  article: Omit<KnowledgeBaseArticle, 'id' | 'created_at' | 'updated_at' | 'view_count' | 'helpful_count' | 'not_helpful_count'>
): Promise<KnowledgeBaseArticle> => {
  const { data, error } = await supabase
    .from('knowledge_base_articles')
    .insert(article)
    .select()
    .single();

  if (error) throw error;
  toast.success('Article created successfully!');
  return data as KnowledgeBaseArticle;
};

export const updateKnowledgeBaseArticle = async (
  articleId: string,
  updates: Partial<KnowledgeBaseArticle>
): Promise<KnowledgeBaseArticle> => {
  const { data, error } = await supabase
    .from('knowledge_base_articles')
    .update(updates)
    .eq('id', articleId)
    .select()
    .single();

  if (error) throw error;
  toast.success('Article updated successfully!');
  return data as KnowledgeBaseArticle;
};

export const deleteKnowledgeBaseArticle = async (articleId: string): Promise<void> => {
  const { error } = await supabase
    .from('knowledge_base_articles')
    .delete()
    .eq('id', articleId);

  if (error) throw error;
  toast.success('Article deleted successfully!');
};

export const markArticleHelpful = async (articleId: string, helpful: boolean): Promise<void> => {
  const { data: article } = await supabase
    .from('knowledge_base_articles')
    .select('helpful_count, not_helpful_count')
    .eq('id', articleId)
    .single();

  if (article) {
    await supabase
      .from('knowledge_base_articles')
      .update({
        helpful_count: helpful ? (article.helpful_count || 0) + 1 : article.helpful_count,
        not_helpful_count: !helpful ? (article.not_helpful_count || 0) + 1 : article.not_helpful_count
      })
      .eq('id', articleId);
  }
};

// =============================================
// SLA POLICIES
// =============================================

export interface SLAPolicy {
  id: string;
  business_id?: string;
  name: string;
  priority: string;
  first_response_hours: number;
  resolution_hours: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const getSLAPolicies = async (businessId?: string): Promise<SLAPolicy[]> => {
  let query = supabase
    .from('sla_policies')
    .select('*')
    .eq('is_active', true)
    .order('priority');

  if (businessId) {
    query = query.or(`business_id.eq.${businessId},business_id.is.null`);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data as SLAPolicy[];
};

export const createSLAPolicy = async (
  policy: Omit<SLAPolicy, 'id' | 'created_at' | 'updated_at'>
): Promise<SLAPolicy> => {
  const { data, error } = await supabase
    .from('sla_policies')
    .insert(policy)
    .select()
    .single();

  if (error) throw error;
  toast.success('SLA policy created successfully!');
  return data as SLAPolicy;
};

export const updateSLAPolicy = async (
  policyId: string,
  updates: Partial<SLAPolicy>
): Promise<SLAPolicy> => {
  const { data, error } = await supabase
    .from('sla_policies')
    .update(updates)
    .eq('id', policyId)
    .select()
    .single();

  if (error) throw error;
  toast.success('SLA policy updated successfully!');
  return data as SLAPolicy;
};

export const deleteSLAPolicy = async (policyId: string): Promise<void> => {
  const { error } = await supabase
    .from('sla_policies')
    .delete()
    .eq('id', policyId);

  if (error) throw error;
  toast.success('SLA policy deleted successfully!');
};

// Check if ticket is within SLA
export const checkSLAStatus = (
  ticketCreatedAt: string,
  priority: string,
  policies: SLAPolicy[]
): { withinFirstResponse: boolean; withinResolution: boolean; urgency: 'ok' | 'warning' | 'breach' } => {
  const policy = policies.find(p => p.priority === priority);
  if (!policy) {
    return { withinFirstResponse: true, withinResolution: true, urgency: 'ok' };
  }

  const now = new Date();
  const created = new Date(ticketCreatedAt);
  const hoursElapsed = (now.getTime() - created.getTime()) / (1000 * 60 * 60);

  const withinFirstResponse = hoursElapsed <= policy.first_response_hours;
  const withinResolution = hoursElapsed <= policy.resolution_hours;

  let urgency: 'ok' | 'warning' | 'breach' = 'ok';
  if (!withinResolution) {
    urgency = 'breach';
  } else if (hoursElapsed >= policy.resolution_hours * 0.75) {
    urgency = 'warning';
  }

  return { withinFirstResponse, withinResolution, urgency };
};

// =============================================
// CANNED RESPONSES
// =============================================

export interface CannedResponse {
  id: string;
  business_id?: string;
  title: string;
  content: string;
  category: string;
  shortcut?: string;
  usage_count: number;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export const getCannedResponses = async (businessId?: string): Promise<CannedResponse[]> => {
  let query = supabase
    .from('canned_responses')
    .select('*')
    .order('usage_count', { ascending: false });

  if (businessId) {
    query = query.or(`business_id.eq.${businessId},business_id.is.null`);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data as CannedResponse[];
};

export const createCannedResponse = async (
  response: Omit<CannedResponse, 'id' | 'created_at' | 'updated_at' | 'usage_count'>
): Promise<CannedResponse> => {
  const { data, error } = await supabase
    .from('canned_responses')
    .insert(response)
    .select()
    .single();

  if (error) throw error;
  toast.success('Canned response created successfully!');
  return data as CannedResponse;
};

export const updateCannedResponse = async (
  responseId: string,
  updates: Partial<CannedResponse>
): Promise<CannedResponse> => {
  const { data, error } = await supabase
    .from('canned_responses')
    .update(updates)
    .eq('id', responseId)
    .select()
    .single();

  if (error) throw error;
  toast.success('Canned response updated successfully!');
  return data as CannedResponse;
};

export const deleteCannedResponse = async (responseId: string): Promise<void> => {
  const { error } = await supabase
    .from('canned_responses')
    .delete()
    .eq('id', responseId);

  if (error) throw error;
  toast.success('Canned response deleted successfully!');
};

export const useCannedResponse = async (responseId: string): Promise<CannedResponse> => {
  const { data, error } = await supabase
    .from('canned_responses')
    .select('*')
    .eq('id', responseId)
    .single();

  if (error) throw error;

  // Increment usage count
  await supabase
    .from('canned_responses')
    .update({ usage_count: (data.usage_count || 0) + 1 })
    .eq('id', responseId);

  return data as CannedResponse;
};

// =============================================
// CATEGORIES
// =============================================

export const KB_CATEGORIES = [
  'general',
  'getting-started',
  'account',
  'billing',
  'features',
  'troubleshooting',
  'integrations',
  'api'
];

export const CANNED_RESPONSE_CATEGORIES = [
  'greeting',
  'closing',
  'technical',
  'billing',
  'general',
  'escalation'
];
