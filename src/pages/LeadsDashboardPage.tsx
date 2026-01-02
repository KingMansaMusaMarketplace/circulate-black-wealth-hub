import { useState, useMemo, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useExternalLeads } from '@/hooks/use-external-leads';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  ArrowLeft,
  Users,
  Mail,
  CheckCircle,
  Clock,
  Trash2,
  Search,
  Globe,
  ExternalLink,
  Loader2,
  UserPlus,
  TrendingUp,
  Sparkles,
  MousePointerClick,
  Star,
  Send,
} from 'lucide-react';
import { B2BExternalLead } from '@/types/b2b-external';
import { format } from 'date-fns';

export default function LeadsDashboardPage() {
  const { user } = useAuth();
  const { 
    leads, 
    loading, 
    invitingLeadId, 
    bulkInviting,
    sendInvitation, 
    sendBulkInvitations,
    deleteLead,
    deleteMultipleLeads,
    getLeadStats,
    calculateLeadScore,
  } = useExternalLeads();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [bulkInviteModalOpen, setBulkInviteModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<B2BExternalLead | null>(null);
  const [selectedLeadIds, setSelectedLeadIds] = useState<string[]>([]);
  const [personalMessage, setPersonalMessage] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'score'>('score');

  const stats = getLeadStats();

  // Filter and sort leads
  const processedLeads = useMemo(() => {
    let filtered = leads.filter(lead =>
      lead.business_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.location?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Add calculated score
    const withScores = filtered.map(lead => ({
      ...lead,
      calculatedScore: calculateLeadScore(lead),
    }));

    // Sort
    if (sortBy === 'score') {
      withScores.sort((a, b) => b.calculatedScore - a.calculatedScore);
    } else {
      withScores.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    return withScores;
  }, [leads, searchQuery, sortBy, calculateLeadScore]);

  const eligibleForBulkInvite = useMemo(() => {
    return processedLeads.filter(l => 
      selectedLeadIds.includes(l.id) && 
      !l.is_invited && 
      l.contact_info?.email
    );
  }, [processedLeads, selectedLeadIds]);

  const handleSelectAll = () => {
    if (selectedLeadIds.length === processedLeads.length) {
      setSelectedLeadIds([]);
    } else {
      setSelectedLeadIds(processedLeads.map(l => l.id));
    }
  };

  const handleSelectLead = (leadId: string) => {
    setSelectedLeadIds(prev => 
      prev.includes(leadId) 
        ? prev.filter(id => id !== leadId)
        : [...prev, leadId]
    );
  };

  const handleOpenInviteModal = (lead: B2BExternalLead) => {
    setSelectedLead(lead);
    setPersonalMessage('');
    setInviteModalOpen(true);
  };

  const handleSendInvitation = async () => {
    if (!selectedLead) return;
    const success = await sendInvitation(selectedLead, personalMessage);
    if (success) {
      setInviteModalOpen(false);
      setSelectedLead(null);
    }
  };

  const handleBulkInvite = async () => {
    const result = await sendBulkInvitations(selectedLeadIds, personalMessage);
    if (result.success > 0) {
      setBulkInviteModalOpen(false);
      setSelectedLeadIds([]);
      setPersonalMessage('');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedLeadIds.length === 0) return;
    await deleteMultipleLeads(selectedLeadIds);
    setSelectedLeadIds([]);
  };

  const getScoreColor = useCallback((score: number) => {
    if (score >= 80) return 'text-emerald-400';
    if (score >= 60) return 'text-amber-400';
    if (score >= 40) return 'text-orange-400';
    return 'text-slate-400';
  }, []);

  const getScoreLabel = useCallback((score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Low';
  }, []);

  if (!user) {
    return (
      <div className="dark min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 flex items-center justify-center">
        <Card className="bg-slate-800/50 border-white/10 p-8 text-center">
          <p className="text-slate-300 mb-4">Please sign in to view your leads</p>
          <Link to="/auth">
            <Button className="bg-amber-500 hover:bg-amber-600 text-slate-900">
              Sign In
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Leads Dashboard | MansaMusa</title>
        <meta name="description" content="Manage your discovered B2B supplier leads" />
      </Helmet>

      <div className="dark min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        {/* Header */}
        <header className="border-b border-white/10 bg-slate-900/60 backdrop-blur-xl sticky top-0 z-50">
          <div className="container flex h-14 items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/b2b-marketplace">
                <Button variant="ghost" size="sm" className="text-slate-200 hover:text-white hover:bg-white/10">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Marketplace
                </Button>
              </Link>
              <h1 className="font-semibold text-white">Leads Dashboard</h1>
            </div>
          </div>
        </header>

        <main className="container py-6 max-w-6xl relative z-10">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-white/10">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/20">
                  <Users className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{stats.total}</p>
                  <p className="text-xs text-slate-400">Total Leads</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-white/10">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-500/20">
                  <Clock className="h-5 w-5 text-amber-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{stats.pending}</p>
                  <p className="text-xs text-slate-400">Pending</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-white/10">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-500/20">
                  <Mail className="h-5 w-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{stats.invited}</p>
                  <p className="text-xs text-slate-400">Invited</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-white/10">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-cyan-500/20">
                  <MousePointerClick className="h-5 w-5 text-cyan-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{stats.clicked}</p>
                  <p className="text-xs text-slate-400">Clicked</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-white/10">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/20">
                  <CheckCircle className="h-5 w-5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{stats.converted}</p>
                  <p className="text-xs text-slate-400">Converted</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Actions Bar */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search leads by name, category, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-slate-800/50 border-white/10 text-white placeholder:text-slate-400"
              />
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSortBy(sortBy === 'score' ? 'date' : 'score')}
                className="border-white/10 text-slate-300 hover:bg-white/10"
              >
                <Star className="h-4 w-4 mr-1.5" />
                Sort: {sortBy === 'score' ? 'Score' : 'Date'}
              </Button>

              {selectedLeadIds.length > 0 && (
                <>
                  {eligibleForBulkInvite.length > 0 && (
                    <Button
                      size="sm"
                      onClick={() => setBulkInviteModalOpen(true)}
                      disabled={bulkInviting}
                      className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-900"
                    >
                      <Send className="h-4 w-4 mr-1.5" />
                      Invite ({eligibleForBulkInvite.length})
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={handleBulkDelete}
                  >
                    <Trash2 className="h-4 w-4 mr-1.5" />
                    Delete ({selectedLeadIds.length})
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Select All */}
          {processedLeads.length > 0 && (
            <div className="flex items-center gap-3 mb-4 px-2">
              <Checkbox
                checked={selectedLeadIds.length === processedLeads.length && processedLeads.length > 0}
                onCheckedChange={handleSelectAll}
                className="border-white/20"
              />
              <span className="text-sm text-slate-400">
                {selectedLeadIds.length > 0 
                  ? `${selectedLeadIds.length} selected`
                  : 'Select all'
                }
              </span>
            </div>
          )}

          {/* Leads List */}
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
            </div>
          ) : processedLeads.length === 0 ? (
            <Card className="bg-slate-800/30 border-white/10">
              <CardContent className="py-16 text-center">
                <Globe className="h-12 w-12 text-slate-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">No leads yet</h3>
                <p className="text-slate-400 mb-6">
                  Discover Black-owned suppliers using web search in the B2B Marketplace
                </p>
                <Link to="/b2b-marketplace">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Start Discovering
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {processedLeads.map((lead) => (
                <Card 
                  key={lead.id} 
                  className={`bg-slate-800/30 border-white/10 hover:border-white/20 transition-all ${
                    lead.is_invited ? 'border-l-4 border-l-purple-500' : ''
                  } ${selectedLeadIds.includes(lead.id) ? 'ring-1 ring-blue-500/50' : ''}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Checkbox
                        checked={selectedLeadIds.includes(lead.id)}
                        onCheckedChange={() => handleSelectLead(lead.id)}
                        className="mt-1 border-white/20"
                      />
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <h3 className="font-semibold text-white truncate">{lead.business_name}</h3>
                              
                              {/* Lead Score Badge */}
                              <Badge className={`${getScoreColor(lead.calculatedScore)} bg-transparent border-current text-xs`}>
                                <Star className="h-3 w-3 mr-1 fill-current" />
                                {lead.calculatedScore.toFixed(0)} - {getScoreLabel(lead.calculatedScore)}
                              </Badge>

                              {lead.is_invited && (
                                <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 text-xs">
                                  <Mail className="h-3 w-3 mr-1" />
                                  Invited
                                </Badge>
                              )}
                              {lead.invitation_clicked_at && (
                                <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-500/30 text-xs">
                                  <MousePointerClick className="h-3 w-3 mr-1" />
                                  Clicked
                                </Badge>
                              )}
                              {lead.is_converted && (
                                <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-xs">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Joined
                                </Badge>
                              )}
                            </div>
                            
                            <p className="text-sm text-slate-400 line-clamp-1 mb-2">
                              {lead.business_description}
                            </p>

                            {/* Score Progress Bar */}
                            <div className="mb-2">
                              <Progress 
                                value={lead.calculatedScore} 
                                className="h-1.5 bg-slate-700"
                              />
                            </div>

                            <div className="flex flex-wrap gap-3 text-xs text-slate-500">
                              {lead.category && (
                                <span className="flex items-center gap-1">
                                  <TrendingUp className="h-3 w-3" />
                                  {lead.category}
                                </span>
                              )}
                              {lead.location && (
                                <span>{lead.location}</span>
                              )}
                              {lead.website_url && (
                                <a 
                                  href={lead.website_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-1 text-blue-400 hover:text-blue-300"
                                >
                                  <ExternalLink className="h-3 w-3" />
                                  Website
                                </a>
                              )}
                              <span>
                                Found {format(new Date(lead.created_at), 'MMM d, yyyy')}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {!lead.is_invited && lead.contact_info?.email && (
                              <Button
                                size="sm"
                                onClick={() => handleOpenInviteModal(lead)}
                                disabled={invitingLeadId === lead.id}
                                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-900"
                              >
                                {invitingLeadId === lead.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <>
                                    <UserPlus className="h-4 w-4 mr-1.5" />
                                    Invite
                                  </>
                                )}
                              </Button>
                            )}
                            {lead.is_invited && !lead.is_converted && (
                              <span className="text-xs text-slate-500">
                                Invited {lead.invited_at && format(new Date(lead.invited_at), 'MMM d')}
                              </span>
                            )}
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => deleteLead(lead.id)}
                              className="text-slate-400 hover:text-red-400 hover:bg-red-500/10"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Single Invite Modal */}
      <Dialog open={inviteModalOpen} onOpenChange={setInviteModalOpen}>
        <DialogContent className="bg-slate-900 border-white/10 text-white">
          <DialogHeader>
            <DialogTitle className="text-white">Invite {selectedLead?.business_name}</DialogTitle>
            <DialogDescription className="text-slate-400">
              Send an email invitation to join the Mansa Musa B2B Marketplace
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <p className="text-sm text-slate-400 mb-1">Sending to:</p>
              <p className="text-white font-medium">{selectedLead?.contact_info?.email}</p>
            </div>

            <div>
              <label className="text-sm text-slate-400 block mb-2">
                Personal message (optional)
              </label>
              <Textarea
                value={personalMessage}
                onChange={(e) => setPersonalMessage(e.target.value)}
                placeholder="Add a personal note about why you think they'd be a great fit..."
                className="bg-slate-800/50 border-white/10 text-white placeholder:text-slate-500 min-h-[100px]"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setInviteModalOpen(false)}
              className="text-slate-400 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSendInvitation}
              disabled={invitingLeadId !== null}
              className="bg-amber-500 hover:bg-amber-600 text-slate-900"
            >
              {invitingLeadId ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Mail className="h-4 w-4 mr-2" />
              )}
              Send Invitation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk Invite Modal */}
      <Dialog open={bulkInviteModalOpen} onOpenChange={setBulkInviteModalOpen}>
        <DialogContent className="bg-slate-900 border-white/10 text-white">
          <DialogHeader>
            <DialogTitle className="text-white">Send Bulk Invitations</DialogTitle>
            <DialogDescription className="text-slate-400">
              Send invitations to {eligibleForBulkInvite.length} selected businesses
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="bg-slate-800/50 rounded-lg p-3 max-h-32 overflow-y-auto">
              {eligibleForBulkInvite.map(lead => (
                <div key={lead.id} className="text-sm text-slate-300 py-1">
                  {lead.business_name} - {lead.contact_info?.email}
                </div>
              ))}
            </div>

            <div>
              <label className="text-sm text-slate-400 block mb-2">
                Personal message (optional - same for all)
              </label>
              <Textarea
                value={personalMessage}
                onChange={(e) => setPersonalMessage(e.target.value)}
                placeholder="Add a personal note..."
                className="bg-slate-800/50 border-white/10 text-white placeholder:text-slate-500 min-h-[80px]"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setBulkInviteModalOpen(false)}
              className="text-slate-400 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              onClick={handleBulkInvite}
              disabled={bulkInviting}
              className="bg-amber-500 hover:bg-amber-600 text-slate-900"
            >
              {bulkInviting ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Send className="h-4 w-4 mr-2" />
              )}
              Send {eligibleForBulkInvite.length} Invitations
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
