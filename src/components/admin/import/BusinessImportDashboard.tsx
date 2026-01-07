import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Upload, FileText, Mail, Users, TrendingUp, CheckCircle, 
  XCircle, Clock, Send, Eye, MousePointer, Building2, 
  RefreshCw, Plus, Settings, Download, Play, Sparkles, Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useBusinessImport } from '@/hooks/use-business-import';
import { CSVUploader } from './CSVUploader';
import { BulkInvitationCampaign } from './BulkInvitationCampaign';
import { AIBusinessDiscovery } from './AIBusinessDiscovery';
import { LeadValidation } from './LeadValidation';
import { ManualLeadEntry } from './ManualLeadEntry';

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

      <Tabs defaultValue="jobs" className="space-y-4">
        <TabsList className="bg-white/5">
          <TabsTrigger value="jobs">Import Jobs</TabsTrigger>
          <TabsTrigger value="campaigns">Outreach Campaigns</TabsTrigger>
        </TabsList>

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

      {/* CSV Uploader Modal */}
      {showUploader && (
        <CSVUploader onClose={() => setShowUploader(false)} />
      )}

      {/* AI Business Discovery Modal */}
      {showAIDiscovery && (
        <AIBusinessDiscovery onClose={() => setShowAIDiscovery(false)} />
      )}

      {/* Campaign Creator Modal */}
      {showCampaignCreator && (
        <BulkInvitationCampaign onClose={() => setShowCampaignCreator(false)} />
      )}

      {/* Lead Validation Modal */}
      {showValidation && (
        <LeadValidation onClose={() => setShowValidation(false)} />
      )}

      {/* Manual Lead Entry Modal */}
      {showManualEntry && (
        <ManualLeadEntry onClose={() => setShowManualEntry(false)} />
      )}
    </div>
  );
};
