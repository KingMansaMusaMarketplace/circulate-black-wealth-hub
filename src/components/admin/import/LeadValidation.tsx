import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, CheckCircle, XCircle, AlertTriangle, Loader2, 
  Globe, Phone, BarChart3, RefreshCw, Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

interface LeadValidationProps {
  onClose: () => void;
}

interface LeadWithValidation {
  id: string;
  business_name: string;
  website_url: string | null;
  phone_number: string | null;
  owner_email: string | null;
  validation_status: string | null;
  website_valid: boolean | null;
  phone_valid: boolean | null;
  data_quality_score: number | null;
  last_validated_at: string | null;
  validation_notes: string | null;
}

export const LeadValidation: React.FC<LeadValidationProps> = ({ onClose }) => {
  const queryClient = useQueryClient();
  const [isValidating, setIsValidating] = useState(false);
  const [validationProgress, setValidationProgress] = useState(0);

  // Fetch leads with validation data
  const { data: leads, isLoading, refetch } = useQuery({
    queryKey: ['leads-validation'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('b2b_external_leads')
        .select('id, business_name, website_url, phone_number, owner_email, validation_status, website_valid, phone_valid, data_quality_score, last_validated_at, validation_notes')
        .eq('is_converted', false)
        .order('data_quality_score', { ascending: false, nullsFirst: false });

      if (error) throw error;
      return data as LeadWithValidation[];
    },
  });

  // Calculate stats
  const stats = leads ? {
    total: leads.length,
    pending: leads.filter(l => !l.validation_status || l.validation_status === 'pending').length,
    validated: leads.filter(l => l.validation_status === 'validated').length,
    websiteValid: leads.filter(l => l.website_valid === true).length,
    websiteInvalid: leads.filter(l => l.website_valid === false).length,
    phoneValid: leads.filter(l => l.phone_valid === true).length,
    phoneInvalid: leads.filter(l => l.phone_valid === false).length,
    avgQuality: leads.filter(l => l.data_quality_score !== null).length > 0
      ? Math.round(leads.filter(l => l.data_quality_score !== null).reduce((sum, l) => sum + (l.data_quality_score || 0), 0) / leads.filter(l => l.data_quality_score !== null).length)
      : 0,
  } : null;

  const handleValidateAll = async () => {
    setIsValidating(true);
    setValidationProgress(10);
    toast.info('Starting validation... This may take a minute.');

    try {
      setValidationProgress(30);

      // Direct fetch with longer timeout (2 minutes) to avoid client's 15s default
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 120000); // 2 minute timeout

      const response = await fetch(`${supabaseUrl}/functions/v1/validate-business-leads`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseKey}`,
          'apikey': supabaseKey,
        },
        body: JSON.stringify({ validate_all: true }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      setValidationProgress(90);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Validation failed: ${errorText}`);
      }

      const data = await response.json();

      if (data.validated > 0) {
        toast.success(`Validated ${data.validated} leads successfully!`);
      } else {
        toast.info('No pending leads to validate');
      }

      await refetch();
      queryClient.invalidateQueries({ queryKey: ['external-leads'] });
    } catch (error: any) {
      console.error('Validation error:', error);
      if (error?.name === 'AbortError') {
        toast.error('Validation timed out. Please try again or refresh.');
      } else {
        toast.error(`Failed to validate leads: ${error.message}`);
      }
    } finally {
      setIsValidating(false);
      setValidationProgress(100);
    }
  };

  const getQualityColor = (score: number | null) => {
    if (score === null) return 'text-gray-400';
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    if (score >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  const getQualityBg = (score: number | null) => {
    if (score === null) return 'bg-gray-500/20';
    if (score >= 80) return 'bg-green-500/20';
    if (score >= 60) return 'bg-yellow-500/20';
    if (score >= 40) return 'bg-orange-500/20';
    return 'bg-red-500/20';
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-hidden bg-slate-900 border-white/10 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-amber-400" />
            Lead Validation
          </DialogTitle>
          <DialogDescription className="text-blue-200">
            Validate business websites and phone numbers to ensure data quality
          </DialogDescription>
        </DialogHeader>

        {/* Stats Overview */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-3">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-blue-400" />
                  <div>
                    <p className="text-lg font-bold text-white">{stats.avgQuality}%</p>
                    <p className="text-xs text-blue-200">Avg Quality</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-3">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-green-400" />
                  <div>
                    <p className="text-lg font-bold text-white">
                      {stats.websiteValid}/{stats.websiteValid + stats.websiteInvalid}
                    </p>
                    <p className="text-xs text-blue-200">Valid Websites</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-3">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-purple-400" />
                  <div>
                    <p className="text-lg font-bold text-white">
                      {stats.phoneValid}/{stats.phoneValid + stats.phoneInvalid}
                    </p>
                    <p className="text-xs text-blue-200">Valid Phones</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-3">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-400" />
                  <div>
                    <p className="text-lg font-bold text-white">{stats.pending}</p>
                    <p className="text-xs text-blue-200">Pending</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Action Button */}
        <div className="flex items-center justify-between py-2">
          <p className="text-sm text-blue-200">
            {stats?.pending || 0} leads awaiting validation
          </p>
          <Button
            onClick={handleValidateAll}
            disabled={isValidating || (stats?.pending === 0)}
            className="bg-gradient-to-r from-amber-500 to-orange-500"
          >
            {isValidating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Validating...
              </>
            ) : (
              <>
                <Shield className="w-4 h-4 mr-2" />
                Validate All Pending
              </>
            )}
          </Button>
        </div>

        {isValidating && (
          <div className="space-y-2">
            <Progress value={validationProgress} className="h-2" />
            <p className="text-xs text-blue-300 text-center">
              Checking websites and phone numbers...
            </p>
          </div>
        )}

        {/* Leads List */}
        <ScrollArea className="h-[400px] pr-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
            </div>
          ) : leads && leads.length > 0 ? (
            <div className="space-y-2">
              {leads.map((lead) => (
                <motion.div
                  key={lead.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-white truncate">{lead.business_name}</p>
                    {/* Contact Info */}
                    <div className="flex items-center gap-4 mt-1 text-xs text-blue-200">
                      {lead.owner_email && (
                        <span className="truncate max-w-[180px]" title={lead.owner_email}>
                          ✉️ {lead.owner_email}
                        </span>
                      )}
                      {lead.phone_number && (
                        <span>📞 {lead.phone_number}</span>
                      )}
                      {lead.website_url && (
                        <a 
                          href={lead.website_url.startsWith('http') ? lead.website_url : `https://${lead.website_url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-cyan-400 hover:underline truncate max-w-[150px]"
                          title={lead.website_url}
                        >
                          🌐 {lead.website_url.replace(/^https?:\/\//, '')}
                        </a>
                      )}
                    </div>
                    {/* Validation Status */}
                    <div className="flex items-center gap-3 mt-1 text-xs">
                      {/* Website Status */}
                      {lead.website_url && (
                        <span className={`flex items-center gap-1 ${
                          lead.website_valid === true ? 'text-green-400' :
                          lead.website_valid === false ? 'text-red-400' :
                          'text-gray-400'
                        }`}>
                          <Globe className="w-3 h-3" />
                          {lead.website_valid === true ? 'Valid' :
                           lead.website_valid === false ? 'Invalid' :
                           'Not checked'}
                        </span>
                      )}
                      {/* Phone Status */}
                      {lead.phone_number && (
                        <span className={`flex items-center gap-1 ${
                          lead.phone_valid === true ? 'text-green-400' :
                          lead.phone_valid === false ? 'text-red-400' :
                          'text-gray-400'
                        }`}>
                          <Phone className="w-3 h-3" />
                          {lead.phone_valid === true ? 'Valid' :
                           lead.phone_valid === false ? 'Invalid' :
                           'Not checked'}
                        </span>
                      )}
                      {/* Validation Notes */}
                      {lead.validation_notes && (
                        <span className="text-orange-400 truncate max-w-[200px]">
                          {lead.validation_notes}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {/* Quality Score */}
                    <div className={`px-2 py-1 rounded ${getQualityBg(lead.data_quality_score)}`}>
                      <span className={`text-sm font-bold ${getQualityColor(lead.data_quality_score)}`}>
                        {lead.data_quality_score !== null ? `${lead.data_quality_score}%` : '—'}
                      </span>
                    </div>
                    {/* Status Badge */}
                    <Badge className={
                      lead.validation_status === 'validated' ? 'bg-green-500/20 text-green-400' :
                      lead.validation_status === 'validating' ? 'bg-blue-500/20 text-blue-400' :
                      lead.validation_status === 'failed' ? 'bg-red-500/20 text-red-400' :
                      'bg-gray-500/20 text-gray-400'
                    }>
                      {lead.validation_status || 'Pending'}
                    </Badge>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Shield className="w-12 h-12 mx-auto mb-4 text-blue-300 opacity-50" />
              <p className="text-blue-200">No leads to validate</p>
            </div>
          )}
        </ScrollArea>

        <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
          <Button variant="outline" onClick={onClose} className="border-white/20">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
