
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, MessageSquare, TrendingUp, AlertTriangle, 
  Star, Search, Users, ChevronRight, X, CheckCircle2,
  Clock, Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

interface KaylaAlert {
  id: string;
  type: 'review' | 'seo' | 'competitor' | 'opportunity' | 'milestone' | 'action';
  title: string;
  description: string;
  timestamp: string;
  priority: 'high' | 'medium' | 'low';
  actionLabel?: string;
  actionRoute?: string;
  dismissed?: boolean;
}

interface KaylaProactiveAlertsProps {
  businessId: string;
  businessName: string;
}

const alertIcons: Record<string, React.ElementType> = {
  review: MessageSquare,
  seo: Search,
  competitor: TrendingUp,
  opportunity: Star,
  milestone: CheckCircle2,
  action: AlertTriangle,
};

const alertColors: Record<string, string> = {
  review: 'from-blue-500/20 to-blue-600/10 border-blue-500/30',
  seo: 'from-emerald-500/20 to-emerald-600/10 border-emerald-500/30',
  competitor: 'from-orange-500/20 to-orange-600/10 border-orange-500/30',
  opportunity: 'from-mansagold/20 to-amber-600/10 border-mansagold/30',
  milestone: 'from-purple-500/20 to-purple-600/10 border-purple-500/30',
  action: 'from-red-500/20 to-red-600/10 border-red-500/30',
};

const alertIconColors: Record<string, string> = {
  review: 'text-blue-400',
  seo: 'text-emerald-400',
  competitor: 'text-orange-400',
  opportunity: 'text-mansagold',
  milestone: 'text-purple-400',
  action: 'text-red-400',
};

const KaylaProactiveAlerts: React.FC<KaylaProactiveAlertsProps> = ({ businessId, businessName }) => {
  const [alerts, setAlerts] = useState<KaylaAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(true);

  useEffect(() => {
    generateAlerts();
  }, [businessId]);

  const generateAlerts = async () => {
    setLoading(true);
    try {
      const generatedAlerts: KaylaAlert[] = [];
      const now = new Date();

      // Check for recent reviews
      const { data: reviews, error: reviewError } = await supabase
        .from('reviews')
        .select('id, rating, comment, created_at')
        .eq('business_id', businessId)
        .gte('created_at', new Date(now.getTime() - 48 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: false })
        .limit(5);

      if (!reviewError && reviews && reviews.length > 0) {
        const unreplied = reviews.filter(r => r.comment);
        if (unreplied.length > 0) {
          generatedAlerts.push({
            id: 'review-alert-' + now.getTime(),
            type: 'review',
            title: `${unreplied.length} new review${unreplied.length > 1 ? 's' : ''} received`,
            description: `Kayla has drafted AI responses for ${unreplied.length} review${unreplied.length > 1 ? 's' : ''}. Review and approve them to keep your response rate high.`,
            timestamp: reviews[0].created_at,
            priority: 'high',
            actionLabel: 'View Draft Responses',
            actionRoute: '/business-dashboard?tab=reviews',
          });
        }
      }

      // Check business profile completeness for SEO
      const { data: profile } = await supabase
        .from('businesses')
        .select('description, category, city, state, logo_url, website_url, phone, email')
        .eq('id', businessId)
        .single();

      if (profile) {
        const missing: string[] = [];
        if (!profile.description || profile.description.length < 100) missing.push('detailed description');
        if (!profile.website_url) missing.push('website URL');
        if (!profile.logo_url) missing.push('business logo');
        if (!profile.phone) missing.push('phone number');

        if (missing.length > 0) {
          generatedAlerts.push({
            id: 'seo-alert-' + now.getTime(),
            type: 'seo',
            title: 'Visibility Score can improve',
            description: `Adding your ${missing.slice(0, 2).join(' and ')} could boost your search visibility by up to ${missing.length * 12}%.`,
            timestamp: now.toISOString(),
            priority: missing.length >= 3 ? 'high' : 'medium',
            actionLabel: 'Optimize Profile',
            actionRoute: '/business-dashboard?tab=overview',
          });
        }
      }

      // Check B2B opportunities
      const { data: b2bMatches } = await supabase
        .from('b2b_connections')
        .select('id, status, created_at')
        .or(`buyer_business_id.eq.${businessId},supplier_business_id.eq.${businessId}`)
        .eq('status', 'pending')
        .limit(5);

      if (b2bMatches && b2bMatches.length > 0) {
        generatedAlerts.push({
          id: 'b2b-alert-' + now.getTime(),
          type: 'opportunity',
          title: `${b2bMatches.length} B2B connection${b2bMatches.length > 1 ? 's' : ''} waiting`,
          description: `Kayla found potential business partners that match your services. Accepting connections can increase revenue by 15-30%.`,
          timestamp: now.toISOString(),
          priority: 'medium',
          actionLabel: 'View Matches',
        });
      }

      // Check QR code scan activity
      const { count: recentScans } = await supabase
        .from('qr_scans')
        .select('*', { count: 'exact', head: true })
        .eq('business_id', businessId)
        .gte('scanned_at', new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString());

      if (recentScans && recentScans > 10) {
        generatedAlerts.push({
          id: 'milestone-' + now.getTime(),
          type: 'milestone',
          title: `🎉 ${recentScans} QR scans this week!`,
          description: `Your QR code engagement is up! Consider creating a special offer to convert scanners into customers.`,
          timestamp: now.toISOString(),
          priority: 'low',
        });
      }

      // Always show a "Kayla is working" alert
      generatedAlerts.push({
        id: 'kayla-status-' + now.getTime(),
        type: 'action',
        title: 'Kayla is monitoring your business 24/7',
        description: `Auto-optimizing SEO, tracking competitor activity, and managing review responses for ${businessName}.`,
        timestamp: now.toISOString(),
        priority: 'low',
      });

      setAlerts(generatedAlerts.sort((a, b) => {
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }));
    } catch (error) {
      console.error('Error generating Kayla alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  const dismissAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(a => a.id !== alertId));
  };

  const highPriorityCount = alerts.filter(a => a.priority === 'high').length;

  if (loading) {
    return (
      <div className="bg-slate-900/40 backdrop-blur-xl rounded-2xl border border-mansagold/20 p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-mansagold/20 flex items-center justify-center animate-pulse">
            <Sparkles className="w-5 h-5 text-mansagold" />
          </div>
          <div>
            <p className="text-white font-semibold text-sm">Kayla is analyzing your business...</p>
            <p className="text-blue-200/50 text-xs">Checking reviews, SEO, opportunities</p>
          </div>
        </div>
      </div>
    );
  }

  if (alerts.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-900/60 backdrop-blur-2xl rounded-2xl border border-mansagold/20 overflow-hidden"
    >
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-5 hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-mansagold/30 to-amber-600/20 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-mansagold" />
          </div>
          <div className="text-left">
            <div className="flex items-center gap-2">
              <h3 className="text-white font-bold text-sm font-playfair">Kayla's Daily Briefing</h3>
              {highPriorityCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-red-500/20 border border-red-500/30 text-red-400 text-xs font-bold">
                  {highPriorityCount} urgent
                </span>
              )}
            </div>
            <p className="text-blue-200/50 text-xs flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Last updated {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>
        <ChevronRight className={`w-5 h-5 text-blue-200/40 transition-transform duration-300 ${expanded ? 'rotate-90' : ''}`} />
      </button>

      {/* Alerts */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-white/10"
          >
            <div className="p-4 space-y-3">
              {alerts.map((alert, index) => {
                const Icon = alertIcons[alert.type] || Zap;
                return (
                  <motion.div
                    key={alert.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.05 }}
                    className={`relative flex items-start gap-3 p-4 rounded-xl bg-gradient-to-r ${alertColors[alert.type]} border backdrop-blur-sm group`}
                  >
                    <div className={`flex-shrink-0 mt-0.5 ${alertIconColors[alert.type]}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-semibold text-sm">{alert.title}</p>
                      <p className="text-blue-200/60 text-xs mt-1 leading-relaxed">{alert.description}</p>
                      {alert.actionLabel && (
                        <button className="mt-2 text-xs font-semibold text-mansagold hover:text-mansagold-light inline-flex items-center gap-1 transition-colors">
                          {alert.actionLabel}
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); dismissAlert(alert.id); }}
                      className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-blue-200/40 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default KaylaProactiveAlerts;
