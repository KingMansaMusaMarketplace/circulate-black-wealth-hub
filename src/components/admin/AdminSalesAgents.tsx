import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Search, UserCheck, CheckCircle, XCircle, Clock, RefreshCw, Eye, DollarSign, TrendingUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface SalesAgent {
  id: string;
  user_id: string;
  referral_code: string;
  commission_rate: number;
  tier: string;
  is_active: boolean;
  total_earnings: number;
  lifetime_referrals: number;
  created_at: string;
}

interface Application {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  phone: string | null;
  application_status: string;
  test_score: number | null;
  test_passed: boolean | null;
  application_date: string;
  why_join: string | null;
  business_experience: string | null;
  marketing_ideas: string | null;
  notes: string | null;
}

const AdminSalesAgents: React.FC = () => {
  const [agents, setAgents] = useState<SalesAgent[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [agentsRes, applicationsRes] = await Promise.all([
        supabase.from('sales_agents')
          .select('id, user_id, referral_code, commission_rate, tier, is_active, total_earnings, lifetime_referrals, created_at')
          .order('created_at', { ascending: false }),
        supabase.from('sales_agent_applications')
          .select('id, user_id, full_name, email, phone, application_status, test_score, test_passed, application_date, why_join, business_experience, marketing_ideas, notes')
          .order('application_date', { ascending: false }),
      ]);

      if (agentsRes.error) throw agentsRes.error;
      if (applicationsRes.error) throw applicationsRes.error;

      setAgents(agentsRes.data || []);
      setApplications(applicationsRes.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to fetch sales agent data');
    } finally {
      setLoading(false);
    }
  };

  const handleApplicationReview = async (applicationId: string, status: 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('sales_agent_applications')
        .update({
          application_status: status,
          notes: reviewNotes,
          reviewed_at: new Date().toISOString(),
        })
        .eq('id', applicationId);

      if (error) throw error;

      if (status === 'approved') {
        const application = applications.find(a => a.id === applicationId);
        if (application) {
          const referralCode = `AGENT${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
          
          const { error: agentError } = await supabase
            .from('sales_agents')
            .insert({
              user_id: application.user_id,
              referral_code: referralCode,
              commission_rate: 10.0,
              tier: 'bronze',
              is_active: true,
            });

          if (agentError) throw agentError;

          // Update user role
          await supabase.rpc('secure_change_user_role', {
            target_user_id: application.user_id,
            new_role: 'sales_agent',
            reason: 'Application approved'
          });
        }
      }

      toast.success(`Application ${status === 'approved' ? 'approved' : 'rejected'} successfully`);
      setSelectedApplication(null);
      setReviewNotes('');
      fetchData();
    } catch (error) {
      console.error('Error reviewing application:', error);
      toast.error('Failed to review application');
    }
  };

  const pendingApplications = applications.filter(a => a.application_status === 'pending');

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'platinum': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'gold': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'silver': return 'bg-gray-400/20 text-gray-300 border-gray-400/30';
      default: return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Pending Applications Alert */}
      {pendingApplications.length > 0 && (
        <Card className="backdrop-blur-xl bg-orange-500/10 border-orange-500/30">
          <CardHeader>
            <CardTitle className="text-orange-400 flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Pending Applications ({pendingApplications.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {pendingApplications.map((application) => (
              <div
                key={application.id}
                className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
              >
                <div>
                  <p className="text-white font-medium">{application.full_name}</p>
                  <p className="text-blue-300 text-sm">
                    {application.email} {application.phone && `• ${application.phone}`}
                  </p>
                  <p className="text-blue-300/70 text-xs">
                    Applied: {format(new Date(application.application_date), 'MMM d, yyyy')}
                    {application.test_passed !== null && (
                      <span className={application.test_passed ? ' • Test Passed' : ' • Test Failed'}>
                        {application.test_score !== null && ` (${application.test_score}%)`}
                      </span>
                    )}
                  </p>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedApplication(application)}
                      className="border-orange-500/30 text-orange-400 hover:bg-orange-500/20"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Review
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-slate-900 border-white/10 text-white max-w-2xl">
                    <DialogHeader>
                      <DialogTitle className="text-yellow-400">Review Application</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-blue-300 text-sm">Full Name</p>
                          <p className="text-white font-medium">{application.full_name}</p>
                        </div>
                        <div>
                          <p className="text-blue-300 text-sm">Email</p>
                          <p className="text-white">{application.email}</p>
                        </div>
                        <div>
                          <p className="text-blue-300 text-sm">Phone</p>
                          <p className="text-white">{application.phone || 'Not provided'}</p>
                        </div>
                        <div>
                          <p className="text-blue-300 text-sm">Applied</p>
                          <p className="text-white">{format(new Date(application.application_date), 'MMM d, yyyy')}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 pt-2 border-t border-white/10">
                        <div>
                          <p className="text-blue-300 text-sm">Test Score</p>
                          <p className="text-white">
                            {application.test_score !== null ? `${application.test_score}%` : 'Not taken'}
                          </p>
                        </div>
                        <div>
                          <p className="text-blue-300 text-sm">Test Status</p>
                          <Badge className={application.test_passed 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'bg-red-500/20 text-red-400'
                          }>
                            {application.test_passed ? 'Passed' : application.test_passed === false ? 'Failed' : 'Pending'}
                          </Badge>
                        </div>
                      </div>

                      {application.why_join && (
                        <div>
                          <p className="text-blue-300 text-sm">Why they want to join</p>
                          <p className="text-white bg-white/5 p-3 rounded mt-1">{application.why_join}</p>
                        </div>
                      )}

                      {application.business_experience && (
                        <div>
                          <p className="text-blue-300 text-sm">Business Experience</p>
                          <p className="text-white bg-white/5 p-3 rounded mt-1">{application.business_experience}</p>
                        </div>
                      )}

                      {application.marketing_ideas && (
                        <div>
                          <p className="text-blue-300 text-sm">Marketing Ideas</p>
                          <p className="text-white bg-white/5 p-3 rounded mt-1">{application.marketing_ideas}</p>
                        </div>
                      )}

                      <div>
                        <label className="text-blue-300 text-sm">Review Notes</label>
                        <Textarea
                          value={reviewNotes}
                          onChange={(e) => setReviewNotes(e.target.value)}
                          placeholder="Add notes about this application..."
                          className="bg-white/5 border-white/10 text-white mt-1"
                        />
                      </div>

                      <div className="flex gap-3 pt-4">
                        <Button
                          onClick={() => handleApplicationReview(application.id, 'approved')}
                          className="flex-1 bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Approve
                        </Button>
                        <Button
                          onClick={() => handleApplicationReview(application.id, 'rejected')}
                          variant="destructive"
                          className="flex-1"
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card className="backdrop-blur-xl bg-white/5 border-white/10">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-300" />
              <Input
                placeholder="Search by referral code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-blue-300"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48 bg-white/5 border-white/10 text-white">
                <SelectValue placeholder="Filter by tier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tiers</SelectItem>
                <SelectItem value="platinum">Platinum</SelectItem>
                <SelectItem value="gold">Gold</SelectItem>
                <SelectItem value="silver">Silver</SelectItem>
                <SelectItem value="bronze">Bronze</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={fetchData} variant="outline" className="border-white/10 text-blue-200 hover:bg-white/10">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Active Agents */}
      <Card className="backdrop-blur-xl bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <UserCheck className="h-5 w-5 text-yellow-400" />
            Active Sales Agents ({agents.filter(a => a.is_active).length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-white/5 rounded-lg animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {agents.filter(a => a.is_active).map((agent) => (
                <div
                  key={agent.id}
                  className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10 gap-4"
                >
                  <div>
                    <p className="text-white font-medium font-mono">{agent.referral_code}</p>
                    <p className="text-blue-300 text-sm">
                      {agent.lifetime_referrals} referrals • {agent.commission_rate}% commission
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={getTierColor(agent.tier)}>
                      {agent.tier.charAt(0).toUpperCase() + agent.tier.slice(1)}
                    </Badge>
                    <div className="flex items-center gap-1 text-green-400">
                      <DollarSign className="h-4 w-4" />
                      <span>${Number(agent.total_earnings).toFixed(2)}</span>
                    </div>
                    <div className="flex items-center gap-1 text-blue-400">
                      <TrendingUp className="h-4 w-4" />
                      <span>{agent.lifetime_referrals}</span>
                    </div>
                  </div>
                </div>
              ))}
              {agents.filter(a => a.is_active).length === 0 && (
                <div className="text-center py-8 text-blue-300">
                  No active sales agents found
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSalesAgents;
