import React, { useState, lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import { 
  Upload, FileText, Mail, Users, TrendingUp, CheckCircle, 
  XCircle, Clock, Send, Eye, MousePointer, Building2, 
  RefreshCw, Plus, Settings, Download, Play, Sparkles, Shield, Star, Calendar, Zap, Globe
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { useBusinessImport } from '@/hooks/use-business-import';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Lazy load modals and tabs since they're not needed on initial render
const CSVUploader = lazy(() => import('./CSVUploader').then(m => ({ default: m.CSVUploader })));
const BulkInvitationCampaign = lazy(() => import('./BulkInvitationCampaign').then(m => ({ default: m.BulkInvitationCampaign })));
const AIBusinessDiscovery = lazy(() => import('./AIBusinessDiscovery').then(m => ({ default: m.AIBusinessDiscovery })));
const LeadValidation = lazy(() => import('./LeadValidation').then(m => ({ default: m.LeadValidation })));
const ManualLeadEntry = lazy(() => import('./ManualLeadEntry').then(m => ({ default: m.ManualLeadEntry })));
const PriorityLeadsTab = lazy(() => import('./PriorityLeadsTab').then(m => ({ default: m.PriorityLeadsTab })));
const ScheduledSearchesTab = lazy(() => import('./ScheduledSearchesTab').then(m => ({ default: m.ScheduledSearchesTab })));
const URLBusinessImport = lazy(() => import('./URLBusinessImport').then(m => ({ default: m.URLBusinessImport })));

// Loading skeleton for stats cards
const StatsLoadingSkeleton = () => (
  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
    {[...Array(6)].map((_, i) => (
      <Card key={i} className="bg-white/5 border-white/10">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-12" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
);

export const BusinessImportDashboard: React.FC = () => {
  const { 
    jobs, 
    campaigns, 
    leadStats, 
    isLoading,
    startCampaign,
    startingCampaign,
  } = useBusinessImport();

  const [showUploader, setShowUploader] = useState(false);
  const [showCampaignCreator, setShowCampaignCreator] = useState(false);
  const [showAIDiscovery, setShowAIDiscovery] = useState(false);
  const [showValidation, setShowValidation] = useState(false);
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [showURLImport, setShowURLImport] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isEnriching, setIsEnriching] = useState(false);
  const [isFindingEmails, setIsFindingEmails] = useState(false);

  // Auto-enrich all new leads
  const autoEnrichLeads = async () => {
    setIsEnriching(true);
    try {
      const { data, error } = await supabase.functions.invoke('auto-enrich-leads', {
        body: { enrich_all_new: true, limit: 100 },
      });

      if (error) throw error;

      toast.success(`Enriched ${data.enriched} leads: ${data.high_priority} high-priority found!`);
    } catch (error) {
      console.error('Enrichment error:', error);
      toast.error('Failed to enrich leads');
    } finally {
      setIsEnriching(false);
    }
  };

  // Find missing emails using Firecrawl
  const findMissingEmails = async () => {
    setIsFindingEmails(true);
    try {
      const { data, error } = await supabase.functions.invoke('enrich-lead-emails', {
        body: { enrich_missing_only: true, limit: 20 },
      });

      if (error) throw error;

      if (data.emails_found > 0) {
        toast.success(`Found ${data.emails_found} new emails from ${data.enriched} websites!`);
      } else {
        toast.info(`Checked ${data.enriched} websites, no new emails found`);
      }
    } catch (error) {
      console.error('Email finding error:', error);
      toast.error('Failed to find emails');
    } finally {
      setIsFindingEmails(false);
    }
  };

  const exportAllLeads = async () => {
    setIsExporting(true);
    try {
      // Fetch all leads from the database
      const { data, error } = await supabase
        .from('b2b_external_leads')
        .select('business_name, owner_email, city, state, category, phone_number, website_url, owner_name, business_description, validation_status, is_invited, is_converted, created_at')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (!data || data.length === 0) {
        toast.error('No leads to export');
        return;
      }

      // Convert to CSV
      const headers = ['business_name', 'owner_email', 'city', 'state', 'category', 'phone_number', 'website_url', 'owner_name', 'business_description', 'validation_status', 'is_invited', 'is_converted', 'created_at'];
      const csvContent = [
        headers.join(','),
        ...data.map(row => 
          headers.map(header => {
            const value = row[header as keyof typeof row];
            // Handle null/undefined values and escape quotes
            if (value === null || value === undefined) return '';
            const stringValue = String(value);
            // Escape quotes and wrap in quotes if contains comma, quote, or newline
            if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
              return `"${stringValue.replace(/"/g, '""')}"`;
            }
            return stringValue;
          }).join(',')
        )
      ].join('\n');

      // Create and download the file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `business_leads_export_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success(`Exported ${data.length} leads successfully`);
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export leads');
    } finally {
      setIsExporting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500/20 text-green-400';
      case 'processing': return 'bg-blue-500/20 text-blue-400';
      case 'pending': return 'bg-yellow-500/20 text-yellow-400';
      case 'failed': return 'bg-red-500/20 text-red-400';
      case 'sending': return 'bg-purple-500/20 text-purple-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  // Conversion funnel data
  const funnelData = leadStats ? [
    { label: 'Total Leads', value: leadStats.total, icon: Building2, color: 'bg-blue-500' },
    { label: 'Emails Sent', value: leadStats.sent, icon: Send, color: 'bg-purple-500' },
    { label: 'Opened', value: leadStats.opened, icon: Eye, color: 'bg-cyan-500' },
    { label: 'Clicked', value: leadStats.clicked, icon: MousePointer, color: 'bg-yellow-500' },
    { label: 'Claimed', value: leadStats.claimed, icon: CheckCircle, color: 'bg-green-500' },
    { label: 'Converted', value: leadStats.converted, icon: TrendingUp, color: 'bg-emerald-500' },
  ] : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Business Import Engine</h1>
          <p className="text-blue-200">Import and reach out to Black-owned businesses at scale</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button 
            variant="outline" 
            className="border-green-500/50 text-green-300 hover:bg-green-500/10"
            onClick={exportAllLeads}
            disabled={isExporting}
          >
            <Download className="w-4 h-4 mr-2" />
            {isExporting ? 'Exporting...' : 'Export All Leads'}
          </Button>
          <a 
            href="/templates/business_leads_template.csv" 
            download="business_leads_template.csv"
          >
            <Button 
              variant="outline" 
              className="border-white/20 text-blue-200"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Template
            </Button>
          </a>
          <Button 
            variant="outline" 
            className="border-white/20 text-blue-200"
            onClick={() => setShowUploader(true)}
          >
            <Upload className="w-4 h-4 mr-2" />
            Import CSV
          </Button>
          <Button 
            className="bg-gradient-to-r from-teal-500 to-cyan-500"
            onClick={() => setShowURLImport(true)}
          >
            <Globe className="w-4 h-4 mr-2" />
            Import from URL
          </Button>
          <Button
            variant="outline" 
            className="border-green-500/50 text-green-300 hover:bg-green-500/10"
            onClick={() => setShowManualEntry(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Lead
          </Button>
          <Button 
            className="bg-gradient-to-r from-purple-500 to-pink-500"
            onClick={() => setShowAIDiscovery(true)}
          >
            <Sparkles className="w-4 h-4 mr-2" />
            AI Discovery
          </Button>
          <Button 
            variant="outline"
            className="border-cyan-500/50 text-cyan-300 hover:bg-cyan-500/10"
            onClick={autoEnrichLeads}
            disabled={isEnriching}
          >
            <Zap className="w-4 h-4 mr-2" />
            {isEnriching ? 'Enriching...' : 'Auto-Enrich'}
          </Button>
          <Button 
            variant="outline"
            className="border-emerald-500/50 text-emerald-300 hover:bg-emerald-500/10"
            onClick={findMissingEmails}
            disabled={isFindingEmails}
          >
            <Mail className="w-4 h-4 mr-2" />
            {isFindingEmails ? 'Finding...' : 'Find Missing Emails'}
          </Button>
          <Button 
            className="bg-gradient-to-r from-amber-500 to-orange-500"
            onClick={() => setShowValidation(true)}
          >
            <Shield className="w-4 h-4 mr-2" />
            Validate Leads
          </Button>
          <Button 
            className="bg-gradient-to-r from-blue-500 to-cyan-500"
            onClick={() => setShowCampaignCreator(true)}
          >
            <Mail className="w-4 h-4 mr-2" />
            New Campaign
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      {!leadStats ? (
        <StatsLoadingSkeleton />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {funnelData.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="bg-white/5 border-white/10">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${item.color}`}>
                      <item.icon className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-white">{item.value.toLocaleString()}</p>
                      <p className="text-xs text-blue-200">{item.label}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Conversion Funnel Visualization */}
      {leadStats && leadStats.total > 0 && (
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-400" />
              Conversion Funnel
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {funnelData.slice(1).map((item, index) => {
                const prevValue = funnelData[index].value;
                const conversionRate = prevValue > 0 ? (item.value / prevValue * 100) : 0;
                const overallRate = leadStats.total > 0 ? (item.value / leadStats.total * 100) : 0;
                
                return (
                  <div key={item.label} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-blue-200">{item.label}</span>
                      <div className="flex items-center gap-4">
                        <span className="text-white font-medium">{item.value.toLocaleString()}</span>
                        <span className="text-xs text-blue-300">
                          {conversionRate.toFixed(1)}% from prev
                        </span>
                      </div>
                    </div>
                    <Progress value={overallRate} className="h-2 bg-white/10" />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="priority" className="space-y-4">
        <TabsList className="bg-white/5">
          <TabsTrigger value="priority" className="data-[state=active]:bg-yellow-500/20">
            <Star className="w-4 h-4 mr-1" />
            Priority Leads
          </TabsTrigger>
          <TabsTrigger value="scheduled">
            <Calendar className="w-4 h-4 mr-1" />
            Scheduled
          </TabsTrigger>
          <TabsTrigger value="jobs">Import Jobs</TabsTrigger>
          <TabsTrigger value="campaigns">Outreach Campaigns</TabsTrigger>
        </TabsList>

        <TabsContent value="priority">
          <Suspense fallback={<Skeleton className="h-64 w-full" />}>
            <PriorityLeadsTab />
          </Suspense>
        </TabsContent>

        <TabsContent value="scheduled">
          <Suspense fallback={<Skeleton className="h-64 w-full" />}>
            <ScheduledSearchesTab />
          </Suspense>
        </TabsContent>

        <TabsContent value="jobs">
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white">Recent Import Jobs</CardTitle>
                  <CardDescription className="text-blue-200">
                    Track your CSV imports and data processing
                  </CardDescription>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-white/20 text-blue-200"
                  onClick={() => setShowUploader(true)}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  New Import
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {jobs.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 mx-auto mb-4 text-blue-300 opacity-50" />
                  <p className="text-blue-200">No import jobs yet</p>
                  <p className="text-sm text-blue-300">Upload a CSV to get started</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {jobs.map((job) => (
                    <div 
                      key={job.id} 
                      className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-lg ${
                          job.status === 'completed' ? 'bg-green-500/20' :
                          job.status === 'processing' ? 'bg-blue-500/20' :
                          job.status === 'failed' ? 'bg-red-500/20' :
                          'bg-yellow-500/20'
                        }`}>
                          {job.status === 'completed' ? <CheckCircle className="w-5 h-5 text-green-400" /> :
                           job.status === 'processing' ? <RefreshCw className="w-5 h-5 text-blue-400 animate-spin" /> :
                           job.status === 'failed' ? <XCircle className="w-5 h-5 text-red-400" /> :
                           <Clock className="w-5 h-5 text-yellow-400" />}
                        </div>
                        <div>
                          <p className="font-medium text-white">{job.job_name || 'Untitled Import'}</p>
                          <p className="text-sm text-blue-200">
                            {new Date(job.created_at).toLocaleDateString()} • 
                            {job.businesses_imported} imported, {job.duplicates_skipped} skipped
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {job.status === 'processing' && (
                          <div className="w-32">
                            <Progress value={job.progress_percent} className="h-2" />
                          </div>
                        )}
                        <Badge className={getStatusColor(job.status)}>
                          {job.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="campaigns">
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white">Outreach Campaigns</CardTitle>
                  <CardDescription className="text-blue-200">
                    Bulk email campaigns to invite businesses
                  </CardDescription>
                </div>
                <Button 
                  className="bg-gradient-to-r from-purple-500 to-blue-500"
                  onClick={() => setShowCampaignCreator(true)}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  New Campaign
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {campaigns.length === 0 ? (
                <div className="text-center py-12">
                  <Mail className="w-12 h-12 mx-auto mb-4 text-blue-300 opacity-50" />
                  <p className="text-blue-200">No campaigns yet</p>
                  <p className="text-sm text-blue-300">Create a campaign to start inviting businesses</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {campaigns.map((campaign) => (
                    <div 
                      key={campaign.id} 
                      className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-lg ${
                          campaign.status === 'completed' ? 'bg-green-500/20' :
                          campaign.status === 'sending' ? 'bg-purple-500/20' :
                          campaign.status === 'scheduled' ? 'bg-blue-500/20' :
                          'bg-gray-500/20'
                        }`}>
                          <Mail className={`w-5 h-5 ${
                            campaign.status === 'completed' ? 'text-green-400' :
                            campaign.status === 'sending' ? 'text-purple-400' :
                            campaign.status === 'scheduled' ? 'text-blue-400' :
                            'text-gray-400'
                          }`} />
                        </div>
                        <div>
                          <p className="font-medium text-white">{campaign.name}</p>
                          <p className="text-sm text-blue-200">
                            {campaign.sent_count}/{campaign.total_targets} sent • 
                            {campaign.opened_count} opened • 
                            {campaign.claimed_count} claimed
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="text-sm text-white font-medium">
                            {campaign.total_targets > 0 
                              ? ((campaign.claimed_count / campaign.total_targets) * 100).toFixed(1) 
                              : 0}%
                          </p>
                          <p className="text-xs text-blue-300">Claim Rate</p>
                        </div>
                        {campaign.status === 'draft' && (
                          <Button
                            size="sm"
                            onClick={() => startCampaign(campaign.id)}
                            disabled={startingCampaign}
                            className="bg-gradient-to-r from-green-500 to-emerald-500"
                          >
                            <Play className="w-4 h-4 mr-1" />
                            {startingCampaign ? 'Starting...' : 'Start'}
                          </Button>
                        )}
                        <Badge className={getStatusColor(campaign.status)}>
                          {campaign.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Lazy-loaded modals */}
      <Suspense fallback={null}>
        {showUploader && <CSVUploader onClose={() => setShowUploader(false)} />}
        {showAIDiscovery && <AIBusinessDiscovery onClose={() => setShowAIDiscovery(false)} />}
        {showCampaignCreator && <BulkInvitationCampaign onClose={() => setShowCampaignCreator(false)} />}
        {showValidation && <LeadValidation onClose={() => setShowValidation(false)} />}
        {showManualEntry && <ManualLeadEntry onClose={() => setShowManualEntry(false)} />}
        {showURLImport && <URLBusinessImport isOpen={showURLImport} onClose={() => setShowURLImport(false)} />}
      </Suspense>
    </div>
  );
};
