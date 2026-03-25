import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, Check, ArrowRight, X, Search, BarChart3,
  MessageSquare, Camera, Clock, Share2, ChevronRight,
  Zap, Shield, TrendingUp, Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';

interface KaylaWelcomeOnboardingProps {
  businessId: string;
  businessName?: string;
  onComplete?: () => void;
  onDismiss?: () => void;
}

interface SEOAuditResult {
  score: number;
  issues: string[];
  wins: string[];
  suggestions: string[];
}

type OnboardingPhase = 'greeting' | 'profile-check' | 'first-win' | 'next-steps';

const KaylaWelcomeOnboarding: React.FC<KaylaWelcomeOnboardingProps> = ({
  businessId,
  businessName = 'your business',
  onComplete,
  onDismiss,
}) => {
  const { user } = useAuth();
  const [phase, setPhase] = useState<OnboardingPhase>('greeting');
  const [isVisible, setIsVisible] = useState(true);
  const [typedText, setTypedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [seoAudit, setSeoAudit] = useState<SEOAuditResult | null>(null);
  const [isAuditing, setIsAuditing] = useState(false);
  const [profileCompleteness, setProfileCompleteness] = useState(0);
  const [missingFields, setMissingFields] = useState<string[]>([]);

  const firstName = user?.user_metadata?.full_name?.split(' ')[0] ||
    user?.email?.split('@')[0] || 'there';

  const greetingMessage = `Hey ${firstName}! 👋 I'm Kayla, your AI business concierge. I'm here to make sure your first 5 minutes count. Let me take a quick look at your profile and deliver your first win — a free SEO & visibility audit. Ready?`;

  // Typewriter effect for greeting
  useEffect(() => {
    if (phase !== 'greeting') return;
    let i = 0;
    setIsTyping(true);
    const interval = setInterval(() => {
      if (i < greetingMessage.length) {
        setTypedText(greetingMessage.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, 25);
    return () => clearInterval(interval);
  }, [phase]);

  // Check if dismissed
  useEffect(() => {
    const dismissed = localStorage.getItem(`kayla-onboarding-${businessId}`);
    if (dismissed === 'complete' || dismissed === 'dismissed') {
      setIsVisible(false);
    }
  }, [businessId]);

  // Profile completeness check
  const checkProfile = useCallback(async () => {
    if (!businessId) return;
    try {
      const { data, error } = await supabase
        .from('businesses')
        .select('business_name, description, category, address, city, state, phone, email, logo_url, hours, website')
        .eq('id', businessId)
        .maybeSingle();

      if (error || !data) return;

      const fields = [
        { key: 'description', label: 'Business description' },
        { key: 'category', label: 'Business category' },
        { key: 'address', label: 'Street address' },
        { key: 'city', label: 'City' },
        { key: 'phone', label: 'Phone number' },
        { key: 'logo_url', label: 'Logo or photo' },
        { key: 'hours', label: 'Business hours' },
        { key: 'website', label: 'Website URL' },
      ];

      const missing: string[] = [];
      let filled = 0;
      fields.forEach(f => {
        const val = data[f.key as keyof typeof data];
        if (val && (typeof val !== 'object' || Object.keys(val).length > 0)) {
          filled++;
        } else {
          missing.push(f.label);
        }
      });

      // business_name always exists
      setProfileCompleteness(Math.round(((filled + 1) / (fields.length + 1)) * 100));
      setMissingFields(missing);
    } catch (err) {
      console.error('Profile check error:', err);
    }
  }, [businessId]);

  // Run instant SEO audit (client-side analysis)
  const runSEOAudit = useCallback(async () => {
    setIsAuditing(true);
    try {
      const { data, error } = await supabase
        .from('businesses')
        .select('business_name, description, category, address, city, state, phone, email, logo_url, hours, website, tags')
        .eq('id', businessId)
        .maybeSingle();

      if (error || !data) {
        throw new Error('Could not load business data');
      }

      // Simulate SEO analysis based on profile completeness
      const wins: string[] = [];
      const issues: string[] = [];
      const suggestions: string[] = [];
      let score = 30; // Base score for being listed

      if (data.business_name) { wins.push('✅ Business name is set'); score += 10; }
      if (data.description && data.description.length > 50) {
        wins.push('✅ Description is detailed (' + data.description.length + ' chars)');
        score += 15;
      } else if (data.description) {
        issues.push('⚠️ Description is too short — aim for 150+ characters');
        suggestions.push('Add more detail about your services, specialties, and what makes you unique');
        score += 5;
      } else {
        issues.push('❌ No business description — this is critical for search visibility');
        suggestions.push('Add a compelling description with keywords customers would search for');
      }

      if (data.category) { wins.push('✅ Category is set for directory search'); score += 10; }
      else { issues.push('❌ No category — customers can\'t find you by service type'); }

      if (data.city && data.state) { wins.push('✅ Location data helps local search'); score += 10; }
      else { issues.push('⚠️ Missing location — limits local discovery'); }

      if (data.logo_url) { wins.push('✅ Logo uploaded — builds trust'); score += 5; }
      else { suggestions.push('Upload a logo — listings with images get 2x more clicks'); }

      if (data.phone) { wins.push('✅ Phone number listed'); score += 5; }
      if (data.website) { wins.push('✅ Website linked'); score += 5; }
      else { suggestions.push('Add your website URL for better credibility'); }

      if (data.hours && typeof data.hours === 'object' && Object.keys(data.hours).length > 0) {
        wins.push('✅ Business hours set');
        score += 5;
      } else {
        suggestions.push('Set your business hours — helps customers plan visits');
      }

      score = Math.min(score, 100);

      setSeoAudit({ score, wins, issues, suggestions });

      // Celebrate if score is decent
      if (score >= 70) {
        confetti({ particleCount: 60, spread: 50, origin: { y: 0.7 } });
      }
    } catch (err) {
      console.error('SEO audit error:', err);
      toast.error('Could not complete audit — please try again');
    } finally {
      setIsAuditing(false);
    }
  }, [businessId]);

  const handleGetStarted = async () => {
    setPhase('profile-check');
    await checkProfile();
  };

  const handleRunAudit = async () => {
    setPhase('first-win');
    await runSEOAudit();
  };

  const handleContinue = () => {
    setPhase('next-steps');
  };

  const handleComplete = () => {
    localStorage.setItem(`kayla-onboarding-${businessId}`, 'complete');
    setIsVisible(false);
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    toast.success('🎉 You\'re all set! Kayla is working for you 24/7.');
    onComplete?.();
  };

  const handleDismiss = () => {
    localStorage.setItem(`kayla-onboarding-${businessId}`, 'dismissed');
    setIsVisible(false);
    onDismiss?.();
  };

  if (!isVisible) return null;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400';
    if (score >= 60) return 'text-amber-400';
    return 'text-red-400';
  };

  const getScoreGradient = (score: number) => {
    if (score >= 80) return 'from-emerald-500 to-green-400';
    if (score >= 60) return 'from-amber-500 to-yellow-400';
    return 'from-red-500 to-orange-400';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 30, scale: 0.95 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="bg-gradient-to-br from-slate-900 via-[#0a1628] to-slate-900 rounded-2xl border border-mansagold/30 overflow-hidden shadow-2xl shadow-mansagold/10"
    >
      {/* Header — Kayla branding */}
      <div className="px-6 py-4 bg-gradient-to-r from-mansagold/20 via-amber-500/10 to-transparent border-b border-mansagold/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-mansagold to-amber-500 flex items-center justify-center shadow-lg shadow-mansagold/30">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-400 rounded-full border-2 border-slate-900 animate-pulse" />
            </div>
            <div>
              <h3 className="text-white font-bold font-playfair text-lg">Kayla</h3>
              <p className="text-mansagold/80 text-xs font-medium tracking-wide">AI BUSINESS CONCIERGE • ONLINE</p>
            </div>
          </div>
          <button onClick={handleDismiss} className="text-white/40 hover:text-white/80 transition-colors p-1">
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-5">
        <AnimatePresence mode="wait">
          {/* Phase 1: Greeting */}
          {phase === 'greeting' && (
            <motion.div
              key="greeting"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, x: -20 }}
            >
              {/* Chat bubble */}
              <div className="bg-white/5 rounded-2xl rounded-tl-sm p-5 border border-white/10 mb-5">
                <p className="text-blue-100 text-sm leading-relaxed">
                  {typedText}
                  {isTyping && <span className="inline-block w-0.5 h-4 bg-mansagold ml-1 animate-pulse" />}
                </p>
              </div>

              {!isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Button
                    onClick={handleGetStarted}
                    className="w-full bg-gradient-to-r from-mansagold to-amber-500 hover:from-amber-500 hover:to-mansagold text-slate-900 font-bold py-5 text-base rounded-xl shadow-lg shadow-mansagold/25 transition-all hover:scale-[1.02]"
                  >
                    Let's Go, Kayla!
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Phase 2: Profile Check */}
          {phase === 'profile-check' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="bg-white/5 rounded-2xl rounded-tl-sm p-5 border border-white/10">
                <p className="text-blue-100 text-sm leading-relaxed mb-3">
                  {profileCompleteness >= 80
                    ? `Your profile is looking great at ${profileCompleteness}%! Let me run your SEO audit now. 🔥`
                    : profileCompleteness >= 50
                    ? `Your profile is ${profileCompleteness}% complete — solid start! Let me show you what to prioritize. First, let's see your visibility score.`
                    : `Your profile is ${profileCompleteness}% complete. Don't worry — I'll help you fix the gaps. Let me run a quick audit so you can see your biggest wins.`}
                </p>
              </div>

              {/* Profile Strength Meter */}
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white/70 text-sm font-medium">Profile Strength</span>
                  <span className={`font-bold text-sm ${getScoreColor(profileCompleteness)}`}>
                    {profileCompleteness}%
                  </span>
                </div>
                <Progress value={profileCompleteness} className="h-2.5" />

                {missingFields.length > 0 && (
                  <div className="mt-3 space-y-1.5">
                    <p className="text-white/50 text-xs font-medium uppercase tracking-wide">Missing:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {missingFields.slice(0, 4).map(f => (
                        <Badge key={f} variant="outline" className="text-xs border-amber-500/30 text-amber-300/80 bg-amber-500/10">
                          {f}
                        </Badge>
                      ))}
                      {missingFields.length > 4 && (
                        <Badge variant="outline" className="text-xs border-white/20 text-white/50">
                          +{missingFields.length - 4} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <Button
                onClick={handleRunAudit}
                className="w-full bg-gradient-to-r from-mansagold to-amber-500 hover:from-amber-500 hover:to-mansagold text-slate-900 font-bold py-5 text-base rounded-xl shadow-lg shadow-mansagold/25"
              >
                <Search className="w-5 h-5 mr-2" />
                Run My Free SEO Audit
              </Button>
            </motion.div>
          )}

          {/* Phase 3: First Win — SEO Audit */}
          {phase === 'first-win' && (
            <motion.div
              key="audit"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              {isAuditing ? (
                <div className="text-center py-8">
                  <div className="relative w-16 h-16 mx-auto mb-4">
                    <div className="absolute inset-0 rounded-full border-4 border-mansagold/20" />
                    <div className="absolute inset-0 rounded-full border-4 border-t-mansagold animate-spin" />
                    <Search className="absolute inset-0 m-auto w-6 h-6 text-mansagold" />
                  </div>
                  <p className="text-white font-medium">Kayla is auditing {businessName}...</p>
                  <p className="text-white/50 text-sm mt-1">Checking SEO, visibility, and search ranking factors</p>
                </div>
              ) : seoAudit ? (
                <>
                  {/* Score Hero */}
                  <div className="text-center py-4">
                    <p className="text-white/60 text-sm mb-2 uppercase tracking-wide font-medium">Your Visibility Score</p>
                    <div className={`text-6xl font-bold font-playfair bg-gradient-to-r ${getScoreGradient(seoAudit.score)} bg-clip-text text-transparent`}>
                      {seoAudit.score}
                    </div>
                    <p className="text-white/40 text-sm mt-1">out of 100</p>
                  </div>

                  {/* Results */}
                  <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                    {seoAudit.wins.length > 0 && (
                      <Card className="bg-emerald-500/10 border-emerald-500/20">
                        <CardContent className="p-4 space-y-1.5">
                          <p className="text-emerald-400 text-xs font-bold uppercase tracking-wide">What's Working</p>
                          {seoAudit.wins.map((w, i) => (
                            <p key={i} className="text-emerald-200/80 text-sm">{w}</p>
                          ))}
                        </CardContent>
                      </Card>
                    )}

                    {seoAudit.issues.length > 0 && (
                      <Card className="bg-red-500/10 border-red-500/20">
                        <CardContent className="p-4 space-y-1.5">
                          <p className="text-red-400 text-xs font-bold uppercase tracking-wide">Needs Attention</p>
                          {seoAudit.issues.map((issue, i) => (
                            <p key={i} className="text-red-200/80 text-sm">{issue}</p>
                          ))}
                        </CardContent>
                      </Card>
                    )}

                    {seoAudit.suggestions.length > 0 && (
                      <Card className="bg-amber-500/10 border-amber-500/20">
                        <CardContent className="p-4 space-y-1.5">
                          <p className="text-amber-400 text-xs font-bold uppercase tracking-wide">Kayla's Suggestions</p>
                          {seoAudit.suggestions.map((s, i) => (
                            <p key={i} className="text-amber-200/80 text-sm flex items-start gap-2">
                              <Zap className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                              {s}
                            </p>
                          ))}
                        </CardContent>
                      </Card>
                    )}
                  </div>

                  <div className="bg-white/5 rounded-2xl rounded-tl-sm p-4 border border-white/10">
                    <p className="text-blue-100 text-sm">
                      {seoAudit.score >= 80
                        ? 'Impressive work! Your listing is well-optimized. Let me show you what else I can do for you. 🚀'
                        : seoAudit.score >= 50
                        ? 'Good foundation! Fix those issues and I\'ll re-audit automatically. Let me show you what else I do for you every day. 💪'
                        : 'No worries — I\'ll help you fix each of these. Let me show you the tools I run for you 24/7. 🔧'}
                    </p>
                  </div>

                  <Button
                    onClick={handleContinue}
                    className="w-full bg-gradient-to-r from-mansagold to-amber-500 hover:from-amber-500 hover:to-mansagold text-slate-900 font-bold py-5 text-base rounded-xl"
                  >
                    What Else Can You Do, Kayla?
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </Button>
                </>
              ) : null}
            </motion.div>
          )}

          {/* Phase 4: Next Steps — What Kayla Does */}
          {phase === 'next-steps' && (
            <motion.div
              key="next"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <div className="bg-white/5 rounded-2xl rounded-tl-sm p-4 border border-white/10">
                <p className="text-blue-100 text-sm">
                  Here's what I'm already doing for {businessName} — on autopilot, 24/7. No extra work from you. 💎
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: MessageSquare, label: 'Review Responses', desc: 'Auto-drafting replies', color: 'text-blue-400', bg: 'bg-blue-500/10' },
                  { icon: BarChart3, label: 'SEO Monitoring', desc: 'Weekly visibility audits', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
                  { icon: TrendingUp, label: 'Growth Insights', desc: 'Customer trends & tips', color: 'text-amber-400', bg: 'bg-amber-500/10' },
                  { icon: Shield, label: 'Brand Protection', desc: 'Listing health checks', color: 'text-purple-400', bg: 'bg-purple-500/10' },
                  { icon: Star, label: 'Social Content', desc: 'Post ideas for you', color: 'text-pink-400', bg: 'bg-pink-500/10' },
                  { icon: Search, label: 'B2B Matching', desc: 'Find partners & vendors', color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
                ].map(item => (
                  <div key={item.label} className={`${item.bg} rounded-xl p-3 border border-white/5`}>
                    <item.icon className={`w-5 h-5 ${item.color} mb-2`} />
                    <p className="text-white text-xs font-bold">{item.label}</p>
                    <p className="text-white/50 text-[11px]">{item.desc}</p>
                  </div>
                ))}
              </div>

              <Button
                onClick={handleComplete}
                className="w-full bg-gradient-to-r from-emerald-500 to-green-400 hover:from-emerald-600 hover:to-green-500 text-white font-bold py-5 text-base rounded-xl shadow-lg shadow-emerald-500/25"
              >
                <Check className="w-5 h-5 mr-2" />
                Got It — Let's Grow!
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Phase indicator */}
      <div className="px-6 pb-4">
        <div className="flex justify-center gap-2">
          {(['greeting', 'profile-check', 'first-win', 'next-steps'] as OnboardingPhase[]).map((p, i) => (
            <div
              key={p}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                p === phase ? 'w-8 bg-mansagold' : i < ['greeting', 'profile-check', 'first-win', 'next-steps'].indexOf(phase) ? 'w-4 bg-mansagold/50' : 'w-4 bg-white/10'
              }`}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default KaylaWelcomeOnboarding;
