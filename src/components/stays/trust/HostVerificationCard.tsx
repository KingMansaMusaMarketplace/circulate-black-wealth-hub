import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Shield, 
  ShieldCheck, 
  UserCheck, 
  MapPin, 
  FileCheck, 
  Upload, 
  CheckCircle,
  Clock,
  XCircle,
  ChevronRight,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { VerificationBadge, VerificationType } from './VerificationBadge';

interface VerificationRequest {
  id: string;
  verification_type: string;
  status: string;
  submitted_at: string;
  rejection_reason?: string;
}

const VERIFICATION_STEPS = [
  {
    type: 'identity' as VerificationType,
    icon: UserCheck,
    title: 'Identity Verification',
    description: 'Verify your identity with a government-issued ID',
    benefits: ['Build trust with guests', 'Verified badge on listings', 'Priority in search results'],
  },
  {
    type: 'address' as VerificationType,
    icon: MapPin,
    title: 'Address Verification',
    description: 'Confirm your physical address',
    benefits: ['Additional trust indicator', 'Required for Superhost status'],
  },
  {
    type: 'background_check' as VerificationType,
    icon: FileCheck,
    title: 'Background Check',
    description: 'Optional background screening',
    benefits: ['Maximum guest confidence', 'Premium listing placement'],
  },
];

export const HostVerificationCard: React.FC = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<VerificationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedType, setSelectedType] = useState<VerificationType | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      fetchVerificationStatus();
    }
  }, [user]);

  const fetchVerificationStatus = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('host_verification_requests')
        .select('*')
        .eq('host_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (error) {
      console.error('Error fetching verification status:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStepStatus = (type: VerificationType) => {
    const request = requests.find(r => r.verification_type === type);
    if (!request) return 'not_started';
    return request.status;
  };

  const handleStartVerification = (type: VerificationType) => {
    setSelectedType(type);
    setShowDialog(true);
  };

  const handleSubmitVerification = async () => {
    if (!user || !selectedType) return;

    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('host_verification_requests')
        .insert({
          host_id: user.id,
          verification_type: selectedType,
          status: 'pending',
        });

      if (error) throw error;

      toast.success('Verification request submitted! We\'ll review it within 24-48 hours.');
      setShowDialog(false);
      fetchVerificationStatus();
    } catch (error: any) {
      console.error('Error submitting verification:', error);
      toast.error('Failed to submit verification request');
    } finally {
      setSubmitting(false);
    }
  };

  // Calculate overall verification progress
  const approvedCount = requests.filter(r => r.status === 'approved').length;
  const progress = (approvedCount / VERIFICATION_STEPS.length) * 100;

  if (loading) {
    return (
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="py-8">
          <div className="flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-mansagold" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white flex items-center gap-2">
                <Shield className="w-5 h-5 text-mansagold" />
                Host Verification
              </CardTitle>
              <CardDescription className="text-slate-400">
                Build trust with guests by verifying your identity
              </CardDescription>
            </div>
            {approvedCount === VERIFICATION_STEPS.length && (
              <Badge className="bg-mansagold text-black">
                <ShieldCheck className="w-3 h-3 mr-1" />
                Fully Verified
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">Verification Progress</span>
              <span className="text-white font-medium">{approvedCount}/{VERIFICATION_STEPS.length}</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Verification Steps */}
          <div className="space-y-3">
            {VERIFICATION_STEPS.map((step) => {
              const status = getStepStatus(step.type);
              const Icon = step.icon;

              return (
                <div
                  key={step.type}
                  className={cn(
                    'p-4 rounded-lg border transition-colors',
                    status === 'approved'
                      ? 'bg-green-500/10 border-green-500/30'
                      : status === 'pending'
                      ? 'bg-yellow-500/10 border-yellow-500/30'
                      : status === 'rejected'
                      ? 'bg-red-500/10 border-red-500/30'
                      : 'bg-slate-900/50 border-slate-700 hover:border-slate-600'
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        'w-10 h-10 rounded-full flex items-center justify-center',
                        status === 'approved'
                          ? 'bg-green-500/20'
                          : status === 'pending'
                          ? 'bg-yellow-500/20'
                          : 'bg-slate-800'
                      )}>
                        {status === 'approved' ? (
                          <CheckCircle className="w-5 h-5 text-green-400" />
                        ) : status === 'pending' ? (
                          <Clock className="w-5 h-5 text-yellow-400" />
                        ) : status === 'rejected' ? (
                          <XCircle className="w-5 h-5 text-red-400" />
                        ) : (
                          <Icon className="w-5 h-5 text-slate-400" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-white">{step.title}</p>
                        <p className="text-sm text-slate-400">{step.description}</p>
                      </div>
                    </div>

                    {status === 'not_started' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStartVerification(step.type)}
                        className="border-mansagold/50 text-mansagold hover:bg-mansagold/10"
                      >
                        Start
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    )}

                    {status === 'pending' && (
                      <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-400">
                        <Clock className="w-3 h-3 mr-1" />
                        Under Review
                      </Badge>
                    )}

                    {status === 'approved' && (
                      <VerificationBadge type={step.type} size="sm" />
                    )}

                    {status === 'rejected' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStartVerification(step.type)}
                        className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                      >
                        Retry
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Verification Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-mansagold" />
              {selectedType && VERIFICATION_STEPS.find(s => s.type === selectedType)?.title}
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              Complete verification to build trust with your guests
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {selectedType === 'identity' && (
              <>
                <div className="space-y-2">
                  <Label className="text-white">ID Document Type</Label>
                  <select className="w-full p-2 rounded-md bg-slate-800 border border-slate-700 text-white">
                    <option value="drivers_license">Driver's License</option>
                    <option value="passport">Passport</option>
                    <option value="national_id">National ID Card</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Upload ID Document</Label>
                  <div className="border-2 border-dashed border-slate-700 rounded-lg p-6 text-center hover:border-mansagold/50 transition-colors cursor-pointer">
                    <Upload className="w-8 h-8 mx-auto mb-2 text-slate-500" />
                    <p className="text-sm text-slate-400">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      PNG, JPG up to 10MB
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Upload Selfie with ID</Label>
                  <div className="border-2 border-dashed border-slate-700 rounded-lg p-6 text-center hover:border-mansagold/50 transition-colors cursor-pointer">
                    <Upload className="w-8 h-8 mx-auto mb-2 text-slate-500" />
                    <p className="text-sm text-slate-400">
                      Take a photo holding your ID
                    </p>
                  </div>
                </div>
              </>
            )}

            {selectedType === 'address' && (
              <div className="space-y-2">
                <Label className="text-white">Upload Address Proof</Label>
                <p className="text-sm text-slate-400 mb-2">
                  Utility bill, bank statement, or government document showing your address
                </p>
                <div className="border-2 border-dashed border-slate-700 rounded-lg p-6 text-center hover:border-mansagold/50 transition-colors cursor-pointer">
                  <Upload className="w-8 h-8 mx-auto mb-2 text-slate-500" />
                  <p className="text-sm text-slate-400">
                    Click to upload or drag and drop
                  </p>
                </div>
              </div>
            )}

            {selectedType === 'background_check' && (
              <div className="space-y-4">
                <p className="text-slate-300">
                  We partner with trusted third-party services to conduct background checks.
                  By proceeding, you agree to share your information for this purpose.
                </p>
                <div className="bg-slate-800 rounded-lg p-4 space-y-2">
                  <p className="text-sm text-slate-400">Background check includes:</p>
                  <ul className="text-sm text-slate-300 space-y-1">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      Criminal record check
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      Sex offender registry check
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      Global watchlist check
                    </li>
                  </ul>
                </div>
              </div>
            )}

            <div className="bg-mansagold/10 border border-mansagold/30 rounded-lg p-3">
              <p className="text-sm text-mansagold flex items-start gap-2">
                <Shield className="w-4 h-4 mt-0.5 flex-shrink-0" />
                Your documents are encrypted and only used for verification purposes.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="ghost"
              onClick={() => setShowDialog(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmitVerification}
              disabled={submitting}
              className="flex-1 bg-mansagold text-black hover:bg-mansagold/90"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit for Review'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default HostVerificationCard;
