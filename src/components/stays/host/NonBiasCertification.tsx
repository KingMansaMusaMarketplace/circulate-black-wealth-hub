import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  CheckCircle,
  BookOpen,
  Heart,
  Users,
  Award,
  Loader2,
  ChevronRight,
  Lock,
} from 'lucide-react';

interface CertificationData {
  id?: string;
  status: string;
  training_module_1_completed: boolean;
  training_module_2_completed: boolean;
  training_module_3_completed: boolean;
  training_completed_at: string | null;
  pledge_accepted: boolean;
  pledge_accepted_at: string | null;
  certified_at: string | null;
}

const TRAINING_MODULES = [
  {
    id: 1,
    title: 'Understanding Bias in Hospitality',
    description: 'Learn about implicit and explicit bias in the short-term rental industry and how it affects travelers.',
    icon: BookOpen,
    duration: '15 min',
    content: [
      'Discrimination in vacation rentals affects millions of travelers annually.',
      'Studies show that guests with "Black-sounding" names are 16% less likely to be accepted as guests.',
      'Understanding your own biases is the first step toward creating a welcoming space for all.',
      'The "Non-Bias" certification sets a new standard for inclusive hospitality.',
    ],
  },
  {
    id: 2,
    title: 'Inclusive Hosting Practices',
    description: 'Practical guidelines for creating a welcoming experience for every guest, regardless of background.',
    icon: Heart,
    duration: '20 min',
    content: [
      'Accept or decline bookings based solely on property fit, not guest identity.',
      'Use inclusive language in your listing descriptions and communication.',
      'Ensure your property is welcoming with diverse representation in decor and amenities.',
      'Provide culturally-aware local recommendations and welcome materials.',
      'Respond to all inquiries within the same timeframe regardless of guest profile.',
    ],
  },
  {
    id: 3,
    title: 'Community Standards & Accountability',
    description: 'Our community guidelines and how we hold hosts accountable for maintaining non-bias standards.',
    icon: Users,
    duration: '10 min',
    content: [
      'Mansa Stays reviews guest feedback for signs of discriminatory behavior.',
      'Certified hosts maintain their status through consistent positive reviews.',
      'Violations result in investigation and potential loss of certification.',
      'Certified hosts get priority listing placement and the Non-Bias badge.',
      'Annual recertification ensures ongoing commitment to inclusive hosting.',
    ],
  },
];

const PLEDGE_TEXT = `I pledge to welcome every guest equally, regardless of race, ethnicity, gender, sexual orientation, religion, age, or disability. I will evaluate booking requests based solely on the suitability of my property for the guest's needs. I commit to providing a safe, respectful, and inclusive environment for all travelers. I understand that violating this pledge may result in the revocation of my Non-Bias Certification.`;

const NonBiasCertification: React.FC = () => {
  const { user } = useAuth();
  const [certification, setCertification] = useState<CertificationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeModule, setActiveModule] = useState<number | null>(null);
  const [pledgeChecked, setPledgeChecked] = useState(false);

  const fetchCertification = useCallback(async () => {
    if (!user) return;
    try {
      const { data } = await supabase
        .from('non_bias_certifications')
        .select('*')
        .eq('host_id', user.id)
        .maybeSingle();
      if (data) setCertification(data as any);
    } catch (err) {
      console.error('Error fetching certification:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchCertification();
  }, [fetchCertification]);

  const startCertification = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const { data, error } = await supabase
        .from('non_bias_certifications')
        .insert({ host_id: user.id, status: 'in_progress' })
        .select()
        .single();
      if (error) throw error;
      setCertification(data as any);
      setActiveModule(1);
      toast.success('Certification started! Complete all 3 modules.');
    } catch (err: any) {
      toast.error('Failed to start certification');
    } finally {
      setSaving(false);
    }
  };

  const completeModule = async (moduleId: number) => {
    if (!user || !certification) return;
    setSaving(true);
    try {
      const field = `training_module_${moduleId}_completed` as keyof CertificationData;
      const updates: any = { [field]: true };

      const updatedCert = { ...certification, [field]: true };
      const allCompleted =
        updatedCert.training_module_1_completed &&
        updatedCert.training_module_2_completed &&
        updatedCert.training_module_3_completed;

      if (allCompleted) {
        updates.training_completed_at = new Date().toISOString();
        updates.status = 'training_complete';
      }

      const { error } = await supabase
        .from('non_bias_certifications')
        .update(updates)
        .eq('host_id', user.id);
      if (error) throw error;

      setCertification({ ...updatedCert, ...updates });
      toast.success(`Module ${moduleId} completed!`);
      
      if (moduleId < 3) {
        setActiveModule(moduleId + 1);
      } else {
        setActiveModule(null);
      }
    } catch (err: any) {
      toast.error('Failed to save progress');
    } finally {
      setSaving(false);
    }
  };

  const acceptPledge = async () => {
    if (!user || !certification || !pledgeChecked) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from('non_bias_certifications')
        .update({
          pledge_accepted: true,
          pledge_accepted_at: new Date().toISOString(),
          pledge_text: PLEDGE_TEXT,
          status: 'certified',
          certified_at: new Date().toISOString(),
          expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        })
        .eq('host_id', user.id);
      if (error) throw error;

      setCertification(prev => prev ? {
        ...prev,
        pledge_accepted: true,
        pledge_accepted_at: new Date().toISOString(),
        status: 'certified',
        certified_at: new Date().toISOString(),
      } : null);
      toast.success('🎉 Congratulations! You are now Non-Bias Certified!');
    } catch (err: any) {
      toast.error('Failed to accept pledge');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-mansagold" />
      </div>
    );
  }

  // Already certified
  if (certification?.status === 'certified') {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
        <Card className="border-green-500/50 bg-green-500/10 overflow-hidden">
          <CardContent className="p-8 text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
              <Award className="w-10 h-10 text-green-400" />
            </div>
            <Badge className="bg-green-500 text-white text-lg px-4 py-1 mb-4">
              <Shield className="w-4 h-4 mr-1" />
              Non-Bias Certified
            </Badge>
            <h2 className="text-2xl font-bold text-white mb-2">You're Certified!</h2>
            <p className="text-white/60 max-w-md mx-auto">
              Your Non-Bias certification badge is displayed on all your property listings,
              showing guests that you're committed to inclusive hospitality.
            </p>
            <p className="text-white/40 text-sm mt-4">
              Certified on {new Date(certification.certified_at!).toLocaleDateString()}
            </p>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  // Not started
  if (!certification || certification.status === 'not_started') {
    return (
      <Card className="border-white/10 bg-slate-800/50">
        <CardContent className="p-8 text-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-mansagold/20 flex items-center justify-center">
            <Shield className="w-10 h-10 text-mansagold" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Non-Bias Certification</h2>
          <p className="text-white/60 max-w-lg mx-auto mb-6">
            Stand out as a host committed to welcoming every guest equally.
            Complete our training program and take the Non-Bias pledge to earn
            your certification badge.
          </p>
          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto mb-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-mansagold">3</div>
              <div className="text-xs text-white/50">Modules</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-mansagold">45</div>
              <div className="text-xs text-white/50">Minutes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-mansagold">1yr</div>
              <div className="text-xs text-white/50">Validity</div>
            </div>
          </div>
          <Button
            onClick={startCertification}
            disabled={saving}
            className="bg-mansagold hover:bg-mansagold/90 text-black font-semibold px-8"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Start Certification
          </Button>
        </CardContent>
      </Card>
    );
  }

  // In progress - show training modules
  const completedModules = [
    certification.training_module_1_completed,
    certification.training_module_2_completed,
    certification.training_module_3_completed,
  ].filter(Boolean).length;

  const trainingDone = certification.status === 'training_complete';

  return (
    <div className="space-y-6">
      {/* Progress header */}
      <Card className="border-white/10 bg-slate-800/50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">Non-Bias Certification</h2>
            <Badge variant="outline" className="text-mansagold border-mansagold/50">
              {completedModules}/3 Modules
            </Badge>
          </div>
          <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-mansagold rounded-full transition-all"
              style={{ width: `${trainingDone ? (certification.pledge_accepted ? 100 : 85) : (completedModules / 3) * 75}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Training Modules */}
      <div className="space-y-4">
        {TRAINING_MODULES.map((mod) => {
          const isCompleted = certification[`training_module_${mod.id}_completed` as keyof CertificationData] as boolean;
          const isActive = activeModule === mod.id;
          const isLocked = mod.id > 1 && !certification[`training_module_${mod.id - 1}_completed` as keyof CertificationData];

          return (
            <Card
              key={mod.id}
              className={`border-white/10 transition-all cursor-pointer ${
                isCompleted
                  ? 'bg-green-500/10 border-green-500/30'
                  : isActive
                  ? 'bg-mansagold/10 border-mansagold/30'
                  : isLocked
                  ? 'bg-slate-900/50 opacity-60'
                  : 'bg-slate-800/50 hover:border-white/20'
              }`}
              onClick={() => !isLocked && !isCompleted && setActiveModule(isActive ? null : mod.id)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${isCompleted ? 'bg-green-500/20' : 'bg-mansagold/20'}`}>
                      {isCompleted ? (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      ) : isLocked ? (
                        <Lock className="w-5 h-5 text-white/30" />
                      ) : (
                        <mod.icon className="w-5 h-5 text-mansagold" />
                      )}
                    </div>
                    <div>
                      <CardTitle className="text-base text-white">
                        Module {mod.id}: {mod.title}
                      </CardTitle>
                      <p className="text-white/50 text-sm">{mod.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-white/40">{mod.duration}</span>
                    {!isCompleted && !isLocked && (
                      <ChevronRight className={`w-4 h-4 text-white/40 transition-transform ${isActive ? 'rotate-90' : ''}`} />
                    )}
                  </div>
                </div>
              </CardHeader>

              <AnimatePresence>
                {isActive && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <CardContent className="pt-0">
                      <div className="space-y-3 mb-4 pl-12">
                        {mod.content.map((point, i) => (
                          <div key={i} className="flex items-start gap-2 text-sm text-white/70">
                            <div className="w-1.5 h-1.5 rounded-full bg-mansagold mt-2 flex-shrink-0" />
                            <p>{point}</p>
                          </div>
                        ))}
                      </div>
                      <div className="pl-12">
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            completeModule(mod.id);
                          }}
                          disabled={saving}
                          className="bg-mansagold hover:bg-mansagold/90 text-black"
                        >
                          {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                          Complete Module {mod.id}
                        </Button>
                      </div>
                    </CardContent>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          );
        })}
      </div>

      {/* Pledge Section - only after all modules complete */}
      {trainingDone && !certification.pledge_accepted && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="border-mansagold/50 bg-mansagold/5">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-mansagold" />
                Non-Bias Pledge
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-slate-900/50 rounded-lg p-4 border border-white/10">
                <p className="text-white/80 text-sm leading-relaxed italic">
                  "{PLEDGE_TEXT}"
                </p>
              </div>
              <div className="flex items-start gap-3">
                <Checkbox
                  id="pledge"
                  checked={pledgeChecked}
                  onCheckedChange={(v) => setPledgeChecked(v === true)}
                  className="mt-1 border-mansagold data-[state=checked]:bg-mansagold data-[state=checked]:border-mansagold"
                />
                <label htmlFor="pledge" className="text-sm text-white/70 cursor-pointer">
                  I have read and agree to the Non-Bias Pledge. I understand this certification
                  is valid for one year and requires maintaining inclusive hosting standards.
                </label>
              </div>
              <Button
                onClick={acceptPledge}
                disabled={!pledgeChecked || saving}
                className="w-full bg-mansagold hover:bg-mansagold/90 text-black font-semibold"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : (
                  <Award className="w-4 h-4 mr-2" />
                )}
                Accept Pledge & Get Certified
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default NonBiasCertification;
