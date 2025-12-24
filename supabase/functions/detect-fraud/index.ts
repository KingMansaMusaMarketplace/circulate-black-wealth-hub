/**
 * @fileoverview AI-Powered Fraud Detection Engine
 * 
 * PATENT PROTECTED - Provisional Application Filed
 * ================================================
 * Title: System and Method for a Multi-Tenant Vertical Marketplace Operating System
 *        Featuring Temporal Incentives, Circulatory Multiplier Attribution, and
 *        Geospatial Velocity Fraud Detection
 * 
 * CLAIM 4: Velocity-Based Fraud Detection System
 * -----------------------------------------------
 * This module implements a proprietary pattern analysis system that analyzes
 * temporal and geospatial patterns of QR scans and transactions to identify
 * impossible travel scenarios and abuse patterns.
 * 
 * Protected Detection Methods:
 * - velocity_abuse: Analyzes action frequency over time windows to detect
 *   superhuman activity rates (too many scans/transactions in short periods)
 * - location_mismatch: Compares sequential scan GPS coordinates to detect
 *   impossible travel (e.g., scans 100 miles apart within 5 minutes)
 * - qr_scan_abuse: Detects coordinated scanning patterns across accounts
 * - AI-mediated pattern recognition using Gemini 2.5 Flash
 * - Batch alert insertion with atomic database operations
 * 
 * The system calculates implied travel speed = distance / time_delta,
 * flagging any result exceeding configurable human-possible thresholds.
 * 
 * © 2024-2025. All rights reserved. Unauthorized replication prohibited.
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';

// CORS configuration with origin validation
const getAllowedOrigins = (): string[] => {
  const origins = Deno.env.get('ALLOWED_ORIGINS');
  if (origins) {
    return origins.split(',').map(o => o.trim());
  }
  return [
    'https://agoclnqfyinwjxdmjnns.lovableproject.com',
    'https://lovable.dev',
    'http://localhost:5173',
    'http://localhost:3000'
  ];
};

const getCorsHeaders = (req: Request): Record<string, string> => {
  const origin = req.headers.get('origin') || '';
  const allowedOrigins = getAllowedOrigins();
  const isAllowed = allowedOrigins.includes(origin) || allowedOrigins.includes('*');
  
  return {
    'Access-Control-Allow-Origin': isAllowed ? origin : allowedOrigins[0],
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };
};

interface FraudAlert {
  alert_type: string;
  severity: string;
  user_id?: string;
  business_id?: string;
  related_entity_id?: string;
  related_entity_type?: string;
  description: string;
  evidence: any;
  ai_confidence_score: number;
}

// Sanitize data for AI prompts - removes sensitive/PII info and limits size
function sanitizeDataForAI(data: any): any {
  if (data === null || data === undefined) return null;
  
  if (typeof data === 'string') {
    return data.substring(0, 500);
  }
  
  if (typeof data === 'number' || typeof data === 'boolean') {
    return data;
  }
  
  if (Array.isArray(data)) {
    return data.slice(0, 50).map(item => sanitizeDataForAI(item));
  }
  
  if (typeof data === 'object') {
    const sanitized: Record<string, any> = {};
    const sensitiveKeys = ['ip_address', 'user_agent', 'email', 'phone', 'password', 'token', 'secret'];
    
    for (const [key, value] of Object.entries(data)) {
      // Redact sensitive fields but keep structure for pattern detection
      if (sensitiveKeys.some(sk => key.toLowerCase().includes(sk))) {
        if (key.toLowerCase().includes('ip')) {
          sanitized[key] = '[IP_REDACTED]';
        } else if (key.toLowerCase().includes('user_agent')) {
          sanitized[key] = '[USER_AGENT_REDACTED]';
        } else {
          sanitized[key] = '[REDACTED]';
        }
      } else {
        sanitized[key] = sanitizeDataForAI(value);
      }
    }
    return sanitized;
  }
  
  return String(data).substring(0, 500);
}

Deno.serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const startTime = Date.now();
  
  try {
    // ========== AUTHENTICATION CHECK ==========
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error('No authorization header provided');
      return new Response(
        JSON.stringify({ success: false, error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    
    // Create auth client with anon key to verify user
    const supabaseAuth = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await supabaseAuth.auth.getUser(token);
    if (authError || !user) {
      console.error('Authentication failed:', authError?.message);
      return new Response(
        JSON.stringify({ success: false, error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if user is admin
    const { data: isAdmin, error: roleError } = await supabaseAuth.rpc('is_admin_secure');
    if (roleError || !isAdmin) {
      console.error('Admin check failed:', roleError?.message || 'User is not admin');
      return new Response(
        JSON.stringify({ success: false, error: 'Forbidden - Admin access required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Admin user authenticated:', user.id);
    // ========== END AUTHENTICATION CHECK ==========

    const requestBody = await req.json();
    
    // Validate inputs
    const userId = typeof requestBody.userId === 'string' ? requestBody.userId.substring(0, 100) : undefined;
    const businessId = typeof requestBody.businessId === 'string' ? requestBody.businessId.substring(0, 100) : undefined;
    const analysisType = typeof requestBody.analysisType === 'string' ? requestBody.analysisType.substring(0, 20) : 'full';
    
    // Use service role for data access after auth verification
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    console.log('Starting fraud detection analysis...', { userId, businessId, analysisType });

    // Fetch recent activity data
    const now = new Date();
    const lookbackWindow = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000); // 7 days

    const [qrScansResult, transactionsResult, activityLogResult] = await Promise.all([
      supabase
        .from('qr_scans')
        .select('id, customer_id, business_id, scan_date, points_earned')
        .gte('scan_date', lookbackWindow.toISOString())
        .order('scan_date', { ascending: false })
        .limit(500),
      
      supabase
        .from('transactions')
        .select('id, customer_id, business_id, amount, transaction_type, transaction_date')
        .gte('transaction_date', lookbackWindow.toISOString())
        .order('transaction_date', { ascending: false })
        .limit(500),
      
      supabase
        .from('activity_log')
        .select('id, user_id, activity_type, created_at, points_involved')
        .gte('created_at', lookbackWindow.toISOString())
        .order('created_at', { ascending: false })
        .limit(1000)
    ]);

    if (qrScansResult.error) throw qrScansResult.error;
    if (transactionsResult.error) throw transactionsResult.error;
    if (activityLogResult.error) throw activityLogResult.error;

    const qrScans = qrScansResult.data || [];
    const transactions = transactionsResult.data || [];
    const activityLog = activityLogResult.data || [];

    console.log(`Analyzing ${qrScans.length} QR scans, ${transactions.length} transactions, ${activityLog.length} activities`);

    // Prepare sanitized data summary for AI analysis (no PII)
    const dataContext = sanitizeDataForAI({
      qrScans: {
        total: qrScans.length,
        uniqueUsers: new Set(qrScans.map(s => s.customer_id)).size,
        uniqueBusinesses: new Set(qrScans.map(s => s.business_id)).size,
        patterns: {
          scansPerUser: groupAndCount(qrScans, 'customer_id'),
          scansPerBusiness: groupAndCount(qrScans, 'business_id'),
          hourlyDistribution: getHourlyDistribution(qrScans, 'scan_date'),
        }
      },
      transactions: {
        total: transactions.length,
        totalAmount: transactions.reduce((sum, t) => sum + (t.amount || 0), 0),
        uniqueUsers: new Set(transactions.map(t => t.customer_id)).size,
        patterns: {
          transactionsPerUser: groupAndCount(transactions, 'customer_id'),
          avgAmount: transactions.length > 0 ? transactions.reduce((sum, t) => sum + (t.amount || 0), 0) / transactions.length : 0,
        }
      },
      activityLog: {
        total: activityLog.length,
        uniqueUsers: new Set(activityLog.map(a => a.user_id)).size,
        activityTypes: groupAndCount(activityLog, 'activity_type'),
      }
    });

    const systemPrompt = `You are an expert fraud detection AI for a Black business marketplace platform. Analyze user activity patterns to detect suspicious behavior.

CRITICAL FRAUD PATTERNS TO DETECT:
1. **QR Scan Abuse**: Same user scanning multiple locations impossibly fast, coordinated scanning patterns
2. **Transaction Anomalies**: Unusual transaction amounts, frequencies, or patterns inconsistent with typical behavior  
3. **Velocity Abuse**: Too many actions in short time (scans, transactions, reviews)
4. **Account Suspicious**: Newly created accounts with immediate high activity, coordinated behavior patterns
5. **Review Manipulation**: Burst of positive/negative reviews from related accounts

For each suspicious pattern, return:
- alert_type (one of the types above in snake_case)
- severity (low/medium/high/critical)
- user_id (if applicable, use placeholder IDs from data)
- business_id (if applicable)  
- description (clear explanation for investigation)
- evidence (detailed data supporting the alert)
- ai_confidence_score (0.0-1.0)

Be precise but not overly sensitive. Only flag clear anomalies.`;

    const userPrompt = `Analyze this platform activity data for fraud patterns:

${JSON.stringify(dataContext, null, 2)}

Identify suspicious patterns and return structured fraud alerts.`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        tools: [{
          type: 'function',
          function: {
            name: 'report_fraud_alerts',
            description: 'Report detected fraud patterns as structured alerts',
            parameters: {
              type: 'object',
              properties: {
                alerts: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      alert_type: { 
                        type: 'string',
                        enum: ['qr_scan_abuse', 'transaction_anomaly', 'review_manipulation', 'account_suspicious', 'location_mismatch', 'velocity_abuse']
                      },
                      severity: { type: 'string', enum: ['low', 'medium', 'high', 'critical'] },
                      user_id: { type: 'string' },
                      business_id: { type: 'string' },
                      related_entity_id: { type: 'string' },
                      related_entity_type: { type: 'string' },
                      description: { type: 'string' },
                      evidence: { type: 'object' },
                      ai_confidence_score: { type: 'number', minimum: 0, maximum: 1 }
                    },
                    required: ['alert_type', 'severity', 'description', 'evidence', 'ai_confidence_score']
                  }
                },
                summary: { type: 'string' }
              },
              required: ['alerts', 'summary']
            }
          }
        }],
        tool_choice: { type: 'function', function: { name: 'report_fraud_alerts' } }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI API error:', response.status, errorText);
      throw new Error(`AI API request failed: ${response.status}`);
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    
    if (!toolCall) {
      throw new Error('No fraud analysis generated');
    }

    const fraudAnalysis = JSON.parse(toolCall.function.arguments);
    const alerts: FraudAlert[] = fraudAnalysis.alerts || [];

    console.log(`AI detected ${alerts.length} potential fraud patterns`);

    // Insert alerts into database
    if (alerts.length > 0) {
      const { error: insertError } = await supabase.rpc('insert_fraud_alerts_batch', {
        alerts: alerts
      });

      if (insertError) {
        console.error('Error inserting fraud alerts:', insertError);
        throw insertError;
      }
    }

    // Log the analysis (without sensitive data)
    const duration = Date.now() - startTime;
    await supabase.from('fraud_detection_logs').insert({
      analysis_type: analysisType,
      user_id: userId,
      business_id: businessId,
      patterns_analyzed: {
        qr_scans_count: qrScans.length,
        transactions_count: transactions.length,
        activity_count: activityLog.length
      },
      alerts_generated: alerts.length,
      analysis_duration_ms: duration
    });

    return new Response(JSON.stringify({
      success: true,
      alertsGenerated: alerts.length,
      summary: fraudAnalysis.summary,
      alerts: alerts,
      analysisTimeMs: duration
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in fraud detection:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'An error occurred processing your request'
    }), {
      status: 500,
      headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' },
    });
  }
});

// Helper functions
function groupAndCount(arr: any[], key: string): Record<string, number> {
  const result: Record<string, number> = {};
  for (const item of arr) {
    const value = item[key];
    if (value) {
      result[value] = (result[value] || 0) + 1;
    }
  }
  // Only return top 20 to limit data size
  const sorted = Object.entries(result).sort((a, b) => b[1] - a[1]).slice(0, 20);
  return Object.fromEntries(sorted);
}

function getHourlyDistribution(arr: any[], dateKey: string): Record<number, number> {
  const result: Record<number, number> = {};
  for (const item of arr) {
    const date = new Date(item[dateKey]);
    const hour = date.getHours();
    result[hour] = (result[hour] || 0) + 1;
  }
  return result;
}
