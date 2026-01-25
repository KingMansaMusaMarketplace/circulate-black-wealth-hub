import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { 
  Building2, 
  Globe, 
  Mail, 
  Phone, 
  CheckCircle, 
  XCircle, 
  Clock,
  ExternalLink,
  Search,
  Users
} from 'lucide-react';
import { format } from 'date-fns';

interface PartnerApplication {
  id: string;
  user_id: string;
  directory_name: string;
  directory_url: string | null;
  contact_email: string;
  contact_phone: string | null;
  description: string | null;
  status: 'pending' | 'active' | 'suspended' | 'inactive';
  tier: 'founding' | 'premium' | 'standard';
  created_at: string;
  approved_at: string | null;
  approved_by: string | null;
}

const PartnerApplicationsManager: React.FC = () => {
  const [applications, setApplications] = useState<PartnerApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<PartnerApplication | null>(null);
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [selectedTier, setSelectedTier] = useState<'founding' | 'premium' | 'standard'>('standard');
  const [rejectionReason, setRejectionReason] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('directory_partners')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setApplications(data || []);
    } catch (error: any) {
      console.error('Error fetching applications:', error);
      toast.error('Failed to load partner applications');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!selectedApp) return;

    try {
      setProcessing(true);
      const { data: { user } } = await supabase.auth.getUser();

      // Update the partner status
      const { error } = await supabase
        .from('directory_partners')
        .update({
          status: 'active',
          tier: selectedTier,
          approved_at: new Date().toISOString(),
          approved_by: user?.id,
        })
        .eq('id', selectedApp.id);

      if (error) throw error;

      // Send approval notification email
      await supabase.functions.invoke('send-partner-notification', {
        body: {
          type: 'approval',
          partnerId: selectedApp.id,
          partnerEmail: selectedApp.contact_email,
          partnerName: selectedApp.directory_name,
          tier: selectedTier,
        },
      });

      toast.success('Partner approved successfully!');
      setShowApproveDialog(false);
      setSelectedApp(null);
      fetchApplications();
    } catch (error: any) {
      console.error('Error approving partner:', error);
      toast.error('Failed to approve partner');
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!selectedApp) return;

    try {
      setProcessing(true);

      // Update the partner status
      const { error } = await supabase
        .from('directory_partners')
        .update({
          status: 'inactive',
        })
        .eq('id', selectedApp.id);

      if (error) throw error;

      // Send rejection notification email
      await supabase.functions.invoke('send-partner-notification', {
        body: {
          type: 'rejection',
          partnerId: selectedApp.id,
          partnerEmail: selectedApp.contact_email,
          partnerName: selectedApp.directory_name,
          reason: rejectionReason,
        },
      });

      toast.success('Application rejected');
      setShowRejectDialog(false);
      setSelectedApp(null);
      setRejectionReason('');
      fetchApplications();
    } catch (error: any) {
      console.error('Error rejecting application:', error);
      toast.error('Failed to reject application');
    } finally {
      setProcessing(false);
    }
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = 
      app.directory_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.contact_email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || app.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const pendingCount = applications.filter(a => a.status === 'pending').length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="text-amber-400 border-amber-400/50"><Clock className="h-3 w-3 mr-1" /> Pending</Badge>;
      case 'active':
        return <Badge variant="outline" className="text-green-400 border-green-400/50"><CheckCircle className="h-3 w-3 mr-1" /> Active</Badge>;
      case 'suspended':
        return <Badge variant="outline" className="text-red-400 border-red-400/50"><XCircle className="h-3 w-3 mr-1" /> Suspended</Badge>;
      case 'inactive':
        return <Badge variant="outline" className="text-slate-400 border-slate-400/50">Inactive</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTierBadge = (tier: string) => {
    switch (tier) {
      case 'founding':
        return <Badge className="bg-amber-500/20 text-amber-400 border-amber-400/50">Founding</Badge>;
      case 'premium':
        return <Badge className="bg-purple-500/20 text-purple-400 border-purple-400/50">Premium</Badge>;
      case 'standard':
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-400/50">Standard</Badge>;
      default:
        return <Badge>{tier}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <Users className="h-5 w-5 text-amber-400" />
            Partner Applications
          </h2>
          <p className="text-slate-400 text-sm">
            Review and manage directory partner applications
          </p>
        </div>
        {pendingCount > 0 && (
          <Badge className="bg-amber-500/20 text-amber-400 border-amber-400/50 px-4 py-2">
            {pendingCount} pending review
          </Badge>
        )}
      </div>

      {/* Filters */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="pt-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-900/50 border-slate-600"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[180px] bg-slate-900/50 border-slate-600">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Applications Table */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-400"></div>
            </div>
          ) : filteredApplications.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No applications found</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-slate-700">
                  <TableHead>Directory</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Tier</TableHead>
                  <TableHead>Applied</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredApplications.map((app) => (
                  <TableRow key={app.id} className="border-slate-700">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-slate-400" />
                        <div>
                          <p className="font-medium text-white">{app.directory_name}</p>
                          {app.directory_url && (
                            <a 
                              href={app.directory_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1"
                            >
                              Visit site <ExternalLink className="h-3 w-3" />
                            </a>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p className="text-slate-300">{app.contact_email}</p>
                        {app.contact_phone && (
                          <p className="text-slate-400 text-xs">{app.contact_phone}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(app.status)}</TableCell>
                    <TableCell>{getTierBadge(app.tier)}</TableCell>
                    <TableCell className="text-slate-400 text-sm">
                      {format(new Date(app.created_at), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell className="text-right">
                      {app.status === 'pending' && (
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-green-400 border-green-400/50 hover:bg-green-400/10"
                            onClick={() => {
                              setSelectedApp(app);
                              setShowApproveDialog(true);
                            }}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-400 border-red-400/50 hover:bg-red-400/10"
                            onClick={() => {
                              setSelectedApp(app);
                              setShowRejectDialog(true);
                            }}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Approve Dialog */}
      <Dialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <DialogContent className="bg-slate-800 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-white">Approve Partner Application</DialogTitle>
            <DialogDescription>
              Approve {selectedApp?.directory_name} as a directory partner.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm text-slate-300 mb-2 block">Select Partner Tier</label>
              <Select value={selectedTier} onValueChange={(v) => setSelectedTier(v as any)}>
                <SelectTrigger className="bg-slate-900/50 border-slate-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="founding">
                    <div className="flex items-center gap-2">
                      <span className="text-amber-400">Founding</span>
                      <span className="text-xs text-slate-400">- 15% + $25/signup</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="premium">
                    <div className="flex items-center gap-2">
                      <span className="text-purple-400">Premium</span>
                      <span className="text-xs text-slate-400">- 12% + $20/signup</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="standard">
                    <div className="flex items-center gap-2">
                      <span className="text-blue-400">Standard</span>
                      <span className="text-xs text-slate-400">- 10% + $15/signup</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowApproveDialog(false)}
              className="border-slate-600"
            >
              Cancel
            </Button>
            <Button
              onClick={handleApprove}
              disabled={processing}
              className="bg-green-600 hover:bg-green-700"
            >
              {processing ? 'Approving...' : 'Approve Partner'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent className="bg-slate-800 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-white">Reject Application</DialogTitle>
            <DialogDescription>
              Reject the application from {selectedApp?.directory_name}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm text-slate-300 mb-2 block">Rejection Reason (optional)</label>
              <Textarea
                placeholder="Provide a reason for rejection..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="bg-slate-900/50 border-slate-600"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowRejectDialog(false)}
              className="border-slate-600"
            >
              Cancel
            </Button>
            <Button
              onClick={handleReject}
              disabled={processing}
              variant="destructive"
            >
              {processing ? 'Rejecting...' : 'Reject Application'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PartnerApplicationsManager;
