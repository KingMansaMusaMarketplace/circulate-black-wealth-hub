import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle, XCircle, Building2, Calendar, DollarSign } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface CorporateSubscription {
  id: string;
  user_id: string;
  company_name: string;
  tier: string;
  status: string;
  approval_status: string;
  stripe_subscription_id: string | null;
  stripe_customer_id: string | null;
  website_url: string | null;
  logo_url: string | null;
  created_at: string;
  approved_at: string | null;
  rejected_at: string | null;
  rejection_reason: string | null;
  admin_notes: string | null;
}

const CorporateSponsorshipApprovals: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState<CorporateSubscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubscription, setSelectedSubscription] = useState<CorporateSubscription | null>(null);
  const [isApproveOpen, setIsApproveOpen] = useState(false);
  const [isRejectOpen, setIsRejectOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');

  useEffect(() => {
    loadSubscriptions();
  }, [filterStatus]);

  const loadSubscriptions = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('corporate_subscriptions')
        .select('*')
        .order('created_at', { ascending: false });

      if (filterStatus !== 'all') {
        query = query.eq('approval_status', filterStatus);
      }

      const { data, error } = await query;

      if (error) throw error;
      setSubscriptions(data || []);
    } catch (error: any) {
      toast.error('Failed to load subscriptions: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!selectedSubscription) return;

    setActionLoading(true);
    try {
      const { data, error } = await supabase.rpc('approve_corporate_subscription', {
        p_subscription_id: selectedSubscription.id,
        p_admin_notes: adminNotes || null,
      });

      if (error) throw error;

      if (data?.success) {
        toast.success('Corporate sponsorship approved successfully');
        
        // Get user email and send welcome email
        try {
          const { data: userData, error: userError } = await supabase
            .from('profiles')
            .select('email')
            .eq('id', selectedSubscription.user_id)
            .single();

          if (!userError && userData?.email) {
            await supabase.functions.invoke('send-corporate-welcome', {
              body: {
                email: userData.email,
                companyName: selectedSubscription.company_name,
                tier: selectedSubscription.tier,
              }
            });
            console.log('Welcome email sent to sponsor');
          }
        } catch (emailError) {
          console.error('Failed to send welcome email:', emailError);
          // Don't fail the approval if email fails
        }
        
        setIsApproveOpen(false);
        setAdminNotes('');
        loadSubscriptions();
      } else {
        throw new Error(data?.error || 'Failed to approve subscription');
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!selectedSubscription || !rejectionReason.trim()) {
      toast.error('Rejection reason is required');
      return;
    }

    setActionLoading(true);
    try {
      const { data, error } = await supabase.rpc('reject_corporate_subscription', {
        p_subscription_id: selectedSubscription.id,
        p_rejection_reason: rejectionReason,
        p_admin_notes: adminNotes || null,
      });

      if (error) throw error;

      if (data?.success) {
        toast.success('Corporate sponsorship rejected');
        
        // Get user email and send rejection email
        try {
          const { data: userData, error: userError } = await supabase
            .from('profiles')
            .select('email')
            .eq('id', selectedSubscription.user_id)
            .single();

          if (!userError && userData?.email) {
            await supabase.functions.invoke('send-sponsor-rejection', {
              body: {
                email: userData.email,
                companyName: selectedSubscription.company_name,
                reason: rejectionReason,
              }
            });
            console.log('Rejection email sent to applicant');
          }
        } catch (emailError) {
          console.error('Failed to send rejection email:', emailError);
          // Don't fail the rejection if email fails
        }
        
        setIsRejectOpen(false);
        setRejectionReason('');
        setAdminNotes('');
        loadSubscriptions();
      } else {
        throw new Error(data?.error || 'Failed to reject subscription');
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setActionLoading(false);
    }
  };

  const getTierBadge = (tier: string) => {
    const colors: Record<string, string> = {
      bronze: 'bg-orange-100 text-orange-800',
      silver: 'bg-gray-100 text-gray-800',
      gold: 'bg-yellow-100 text-yellow-800',
      platinum: 'bg-purple-100 text-purple-800',
    };
    return <Badge className={colors[tier] || 'bg-gray-100'}>{tier.toUpperCase()}</Badge>;
  };

  const getApprovalStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
    };
    return <Badge className={colors[status] || 'bg-gray-100'}>{status.toUpperCase()}</Badge>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-mansablue" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Corporate Sponsorship Approvals
              </CardTitle>
              <CardDescription>Review and manage corporate sponsorship applications</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant={filterStatus === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('all')}
              >
                All ({subscriptions.length})
              </Button>
              <Button
                variant={filterStatus === 'pending' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('pending')}
              >
                Pending
              </Button>
              <Button
                variant={filterStatus === 'approved' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('approved')}
              >
                Approved
              </Button>
              <Button
                variant={filterStatus === 'rejected' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('rejected')}
              >
                Rejected
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {subscriptions.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No {filterStatus !== 'all' && filterStatus} sponsorships found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Company</TableHead>
                    <TableHead>Tier</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Approval Status</TableHead>
                    <TableHead>Applied Date</TableHead>
                    <TableHead>Stripe</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subscriptions.map((subscription) => (
                    <TableRow key={subscription.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {subscription.logo_url ? (
                            <img
                              src={subscription.logo_url}
                              alt={subscription.company_name}
                              className="h-10 w-10 rounded object-cover"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded bg-gray-100 flex items-center justify-center">
                              <Building2 className="h-5 w-5 text-gray-400" />
                            </div>
                          )}
                          <div>
                            <div className="font-medium">{subscription.company_name}</div>
                            {subscription.website_url && (
                              <a
                                href={subscription.website_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-blue-600 hover:underline"
                              >
                                {subscription.website_url}
                              </a>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getTierBadge(subscription.tier)}</TableCell>
                      <TableCell>
                        <Badge variant={subscription.status === 'active' ? 'default' : 'secondary'}>
                          {subscription.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{getApprovalStatusBadge(subscription.approval_status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <Calendar className="h-3 w-3" />
                          {format(new Date(subscription.created_at), 'MMM d, yyyy')}
                        </div>
                      </TableCell>
                      <TableCell>
                        {subscription.stripe_subscription_id ? (
                          <Badge variant="outline" className="gap-1">
                            <DollarSign className="h-3 w-3" />
                            Connected
                          </Badge>
                        ) : (
                          <span className="text-xs text-gray-400">No Stripe</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {subscription.approval_status === 'pending' && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="default"
                              onClick={() => {
                                setSelectedSubscription(subscription);
                                setIsApproveOpen(true);
                              }}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => {
                                setSelectedSubscription(subscription);
                                setIsRejectOpen(true);
                              }}
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                          </div>
                        )}
                        {subscription.approval_status === 'approved' && subscription.approved_at && (
                          <span className="text-xs text-green-600">
                            Approved {format(new Date(subscription.approved_at), 'MMM d, yyyy')}
                          </span>
                        )}
                        {subscription.approval_status === 'rejected' && (
                          <div className="text-xs text-red-600">
                            <div>Rejected</div>
                            {subscription.rejection_reason && (
                              <div className="mt-1 text-gray-500 max-w-xs truncate">
                                {subscription.rejection_reason}
                              </div>
                            )}
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Approve Dialog */}
      <Dialog open={isApproveOpen} onOpenChange={setIsApproveOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Corporate Sponsorship</DialogTitle>
            <DialogDescription>
              Approve {selectedSubscription?.company_name}'s {selectedSubscription?.tier} tier sponsorship
              application?
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Admin Notes (Optional)</label>
              <Textarea
                placeholder="Add any internal notes about this approval..."
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsApproveOpen(false)} disabled={actionLoading}>
              Cancel
            </Button>
            <Button onClick={handleApprove} disabled={actionLoading}>
              {actionLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Approving...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Approve
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={isRejectOpen} onOpenChange={setIsRejectOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Corporate Sponsorship</DialogTitle>
            <DialogDescription>
              Reject {selectedSubscription?.company_name}'s {selectedSubscription?.tier} tier sponsorship
              application. This action will cancel their subscription.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-red-600">Rejection Reason (Required) *</label>
              <Textarea
                placeholder="Explain why this application is being rejected..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={3}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Admin Notes (Optional)</label>
              <Textarea
                placeholder="Add any internal notes..."
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                rows={2}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRejectOpen(false)} disabled={actionLoading}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleReject} disabled={actionLoading || !rejectionReason.trim()}>
              {actionLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Rejecting...
                </>
              ) : (
                <>
                  <XCircle className="mr-2 h-4 w-4" />
                  Reject
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CorporateSponsorshipApprovals;
