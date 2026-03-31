import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Eye, Search, Shield, AlertTriangle, ThumbsUp, ThumbsDown, Minus,
  ExternalLink, RefreshCw, Send, Check, X, Globe, Settings, Bell
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useBusinessProfile } from '@/hooks/use-business-profile';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

interface Mention {
  id: string;
  source_url: string;
  source_domain: string;
  title: string;
  snippet: string;
  mention_type: string;
  sentiment: string;
  sentiment_score: number;
  is_negative: boolean;
  drafted_response: string;
  owner_response: string | null;
  response_status: string;
  is_read: boolean;
  is_dismissed: boolean;
  discovered_at: string;
}

const SENTIMENT_CONFIG = {
  positive: { icon: ThumbsUp, color: 'text-green-400', bg: 'bg-green-500/20', border: 'border-green-500/30', label: 'Positive' },
  neutral: { icon: Minus, color: 'text-blue-400', bg: 'bg-blue-500/20', border: 'border-blue-500/30', label: 'Neutral' },
  negative: { icon: ThumbsDown, color: 'text-red-400', bg: 'bg-red-500/20', border: 'border-red-500/30', label: 'Negative' },
};

const TYPE_LABELS: Record<string, string> = {
  review: '⭐ Review',
  news: '📰 News',
  blog: '📝 Blog',
  social: '📱 Social',
  forum: '💬 Forum',
  directory: '📁 Directory',
};

const KaylaReputationMonitor: React.FC = () => {
  const { profile } = useBusinessProfile();
  const [mentions, setMentions] = useState<Mention[]>([]);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [filter, setFilter] = useState<'all' | 'negative' | 'positive' | 'unread'>('all');
  const [editingResponse, setEditingResponse] = useState<string | null>(null);
  const [responseText, setResponseText] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [keywords, setKeywords] = useState('');

  const businessId = profile?.id;

  const fetchMentions = useCallback(async () => {
    if (!businessId) return;
    try {
      const { data, error } = await supabase
        .from('reputation_mentions')
        .select('*')
        .eq('business_id', businessId)
        .eq('is_dismissed', false)
        .order('discovered_at', { ascending: false })
        .limit(50);

      if (!error && data) {
        setMentions(data as any);
      }
    } catch (err) {
      console.error('Error fetching mentions:', err);
    } finally {
      setLoading(false);
    }
  }, [businessId]);

  useEffect(() => { fetchMentions(); }, [fetchMentions]);

  const runScan = async () => {
    if (!businessId) return;
    setScanning(true);
    try {
      const { data, error } = await supabase.functions.invoke('kayla-reputation-monitor', {
        body: { business_id: businessId },
      });

      if (error) throw error;

      toast.success(`Scan complete: ${data.new_mentions} new mentions found`, {
        description: data.negative_alerts > 0
          ? `⚠️ ${data.negative_alerts} negative mention(s) require attention`
          : 'No negative mentions detected 🎉',
      });

      await fetchMentions();
    } catch (err) {
      console.error('Scan error:', err);
      toast.error('Failed to run reputation scan');
    } finally {
      setScanning(false);
    }
  };

  const markAsRead = async (mentionId: string) => {
    await supabase
      .from('reputation_mentions')
      .update({ is_read: true })
      .eq('id', mentionId);
    setMentions(prev => prev.map(m => m.id === mentionId ? { ...m, is_read: true } : m));
  };

  const dismissMention = async (mentionId: string) => {
    await supabase
      .from('reputation_mentions')
      .update({ is_dismissed: true })
      .eq('id', mentionId);
    setMentions(prev => prev.filter(m => m.id !== mentionId));
    toast.success('Mention dismissed');
  };

  const saveResponse = async (mentionId: string) => {
    await supabase
      .from('reputation_mentions')
      .update({ owner_response: responseText, response_status: 'drafted' })
      .eq('id', mentionId);
    setMentions(prev =>
      prev.map(m => m.id === mentionId ? { ...m, owner_response: responseText, response_status: 'drafted' } : m)
    );
    setEditingResponse(null);
    setResponseText('');
    toast.success('Response saved');
  };

  const filteredMentions = mentions.filter(m => {
    if (filter === 'negative') return m.is_negative;
    if (filter === 'positive') return m.sentiment === 'positive';
    if (filter === 'unread') return !m.is_read;
    return true;
  });

  const stats = {
    total: mentions.length,
    negative: mentions.filter(m => m.is_negative).length,
    positive: mentions.filter(m => m.sentiment === 'positive').length,
    unread: mentions.filter(m => !m.is_read).length,
    avgSentiment: mentions.length > 0
      ? (mentions.reduce((sum, m) => sum + (m.sentiment_score || 0.5), 0) / mentions.length)
      : 0.5,
  };

  if (!businessId) {
    return (
      <Card className="bg-slate-900/40 border-white/10">
        <CardContent className="p-6 text-center text-blue-300">
          Please set up your business profile first.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <Card className="bg-slate-900/40 backdrop-blur-xl border-white/10">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-white">
                <Eye className="h-5 w-5 text-yellow-400" />
                AI Reputation Monitor
              </CardTitle>
              <CardDescription className="text-blue-300">
                Kayla scans the web 24/7 for mentions of your business
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSettings(!showSettings)}
                className="text-blue-300 hover:text-white"
              >
                <Settings className="h-4 w-4" />
              </Button>
              <Button
                onClick={runScan}
                disabled={scanning}
                className="bg-gradient-to-r from-yellow-500 to-amber-600 text-slate-900 font-semibold"
              >
                {scanning ? (
                  <><RefreshCw className="h-4 w-4 mr-2 animate-spin" /> Scanning...</>
                ) : (
                  <><Search className="h-4 w-4 mr-2" /> Scan Now</>
                )}
              </Button>
            </div>
          </div>
        </CardHeader>

        {/* Settings panel */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <CardContent className="border-t border-white/10 pt-4 space-y-3">
                <div>
                  <label className="text-sm text-blue-200 mb-1 block">Custom Keywords (comma separated)</label>
                  <Input
                    value={keywords}
                    onChange={e => setKeywords(e.target.value)}
                    placeholder="owner name, brand nickname, product name"
                    className="bg-slate-800/50 border-white/10 text-white"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <Switch defaultChecked />
                  <span className="text-sm text-blue-200">Alert me on negative mentions</span>
                </div>
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: 'Total Mentions', value: stats.total, icon: Globe, color: 'text-blue-400' },
          { label: 'Negative', value: stats.negative, icon: AlertTriangle, color: 'text-red-400' },
          { label: 'Positive', value: stats.positive, icon: ThumbsUp, color: 'text-green-400' },
          { label: 'Unread', value: stats.unread, icon: Bell, color: 'text-yellow-400' },
          { label: 'Avg Sentiment', value: `${(stats.avgSentiment * 100).toFixed(0)}%`, icon: Shield, color: 'text-purple-400' },
        ].map(({ label, value, icon: Icon, color }) => (
          <Card key={label} className="bg-slate-800/50 border-white/10">
            <CardContent className="p-3 text-center">
              <Icon className={`h-4 w-4 mx-auto mb-1 ${color}`} />
              <p className="text-lg font-bold text-white">{value}</p>
              <p className="text-[10px] text-blue-400">{label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filter tabs + Mentions list */}
      <Card className="bg-slate-900/40 backdrop-blur-xl border-white/10">
        <CardContent className="p-4">
          <Tabs value={filter} onValueChange={v => setFilter(v as any)}>
            <TabsList className="bg-slate-800/50 border border-white/10 mb-4">
              <TabsTrigger value="all">All ({stats.total})</TabsTrigger>
              <TabsTrigger value="negative">🔴 Negative ({stats.negative})</TabsTrigger>
              <TabsTrigger value="positive">🟢 Positive ({stats.positive})</TabsTrigger>
              <TabsTrigger value="unread">Unread ({stats.unread})</TabsTrigger>
            </TabsList>

            <div className="space-y-3">
              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="animate-pulse h-24 bg-slate-700/50 rounded-lg" />
                  ))}
                </div>
              ) : filteredMentions.length === 0 ? (
                <div className="text-center py-8">
                  <Search className="h-8 w-8 text-blue-400 mx-auto mb-3 opacity-50" />
                  <p className="text-blue-300 text-sm">
                    {mentions.length === 0
                      ? 'No mentions found yet. Click "Scan Now" to search the web!'
                      : 'No mentions match this filter.'}
                  </p>
                </div>
              ) : (
                <AnimatePresence>
                  {filteredMentions.map((mention, idx) => {
                    const sentimentCfg = SENTIMENT_CONFIG[mention.sentiment as keyof typeof SENTIMENT_CONFIG] || SENTIMENT_CONFIG.neutral;
                    const SentimentIcon = sentimentCfg.icon;

                    return (
                      <motion.div
                        key={mention.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ delay: idx * 0.03 }}
                        className={`p-3 rounded-lg border ${sentimentCfg.border} ${sentimentCfg.bg} ${!mention.is_read ? 'ring-1 ring-yellow-400/30' : ''}`}
                        onClick={() => !mention.is_read && markAsRead(mention.id)}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            {/* Title + badges */}
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <SentimentIcon className={`h-4 w-4 ${sentimentCfg.color} flex-shrink-0`} />
                              <h4 className="text-sm font-medium text-white truncate">
                                {mention.title || 'Untitled Mention'}
                              </h4>
                              <Badge variant="outline" className="text-[10px] border-white/20 text-blue-300">
                                {TYPE_LABELS[mention.mention_type] || mention.mention_type}
                              </Badge>
                              {!mention.is_read && (
                                <Badge className="bg-yellow-500 text-slate-900 text-[10px]">New</Badge>
                              )}
                            </div>

                            {/* Snippet */}
                            <p className="text-xs text-blue-200 line-clamp-2 mb-2">
                              {mention.snippet}
                            </p>

                            {/* Source + date */}
                            <div className="flex items-center gap-3 text-[10px] text-blue-400">
                              <a
                                href={mention.source_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 hover:text-yellow-400 transition-colors"
                                onClick={e => e.stopPropagation()}
                              >
                                <ExternalLink className="h-3 w-3" />
                                {mention.source_domain}
                              </a>
                              <span>
                                {new Date(mention.discovered_at).toLocaleDateString()}
                              </span>
                              <span className={sentimentCfg.color}>
                                {(mention.sentiment_score * 100).toFixed(0)}% sentiment
                              </span>
                            </div>

                            {/* AI Drafted Response */}
                            {mention.drafted_response && editingResponse !== mention.id && (
                              <div className="mt-2 p-2 bg-slate-800/50 rounded border border-white/5">
                                <p className="text-[10px] text-yellow-400 font-medium mb-1">💡 Kayla's Drafted Response:</p>
                                <p className="text-xs text-blue-200 italic">"{mention.drafted_response}"</p>
                                <div className="flex gap-2 mt-2">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-6 text-[10px] text-green-400 hover:text-green-300"
                                    onClick={e => {
                                      e.stopPropagation();
                                      setEditingResponse(mention.id);
                                      setResponseText(mention.owner_response || mention.drafted_response);
                                    }}
                                  >
                                    <Send className="h-3 w-3 mr-1" /> Edit & Use
                                  </Button>
                                </div>
                              </div>
                            )}

                            {/* Edit response */}
                            {editingResponse === mention.id && (
                              <div className="mt-2 space-y-2" onClick={e => e.stopPropagation()}>
                                <Textarea
                                  value={responseText}
                                  onChange={e => setResponseText(e.target.value)}
                                  className="bg-slate-800 border-white/10 text-white text-xs min-h-[60px]"
                                  placeholder="Edit your response..."
                                />
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    className="h-6 text-[10px] bg-green-600 hover:bg-green-500"
                                    onClick={() => saveResponse(mention.id)}
                                  >
                                    <Check className="h-3 w-3 mr-1" /> Save
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-6 text-[10px]"
                                    onClick={() => setEditingResponse(null)}
                                  >
                                    Cancel
                                  </Button>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Dismiss button */}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-blue-400 hover:text-red-400 h-6 w-6 p-0 flex-shrink-0"
                            onClick={e => { e.stopPropagation(); dismissMention(mention.id); }}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              )}
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default KaylaReputationMonitor;
