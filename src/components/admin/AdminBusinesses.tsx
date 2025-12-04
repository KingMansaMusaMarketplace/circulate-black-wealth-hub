import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Search, Building2, CheckCircle, XCircle, Clock, RefreshCw, Eye, FileText } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface Business {
  id: string;
  business_name: string;
  category: string | null;
  city: string | null;
  state: string | null;
  is_verified: boolean;
  created_at: string;
  owner_id: string;
}

interface Verification {
  id: string;
  business_id: string;
  verification_status: string;
  submitted_at: string;
  admin_notes: string | null;
  rejection_reason: string | null;
  registration_document_url: string | null;
  ownership_document_url: string | null;
  address_document_url: string | null;
}

const AdminBusinesses: React.FC = () => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [verifications, setVerifications] = useState<Verification[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedVerification, setSelectedVerification] = useState<Verification | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [businessesRes, verificationsRes] = await Promise.all([
        supabase.from('businesses').select('*').order('created_at', { ascending: false }),
        supabase.from('business_verifications').select('*').order('submitted_at', { ascending: false }),
      ]);

      if (businessesRes.error) throw businessesRes.error;
      if (verificationsRes.error) throw verificationsRes.error;

      setBusinesses(businessesRes.data || []);
      setVerifications(verificationsRes.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to fetch businesses');
    } finally {
      setLoading(false);
    }
  };

  const handleVerification = async (verificationId: string, status: 'approved' | 'rejected') => {
    try {
      const verification = verifications.find(v => v.id === verificationId);
      if (!verification) return;

      const { error: verificationError } = await supabase
        .from('business_verifications')
        .update({
          verification_status: status,
          admin_notes: adminNotes,
          rejection_reason: status === 'rejected' ? rejectionReason : null,
          verified_at: status === 'approved' ? new Date().toISOString() : null,
        })
        .eq('id', verificationId);

      if (verificationError) throw verificationError;

      if (status === 'approved') {
        const { error: businessError } = await supabase
          .from('businesses')
          .update({ is_verified: true })
          .eq('id', verification.business_id);

        if (businessError) throw businessError;
      }

      toast.success(`Business ${status === 'approved' ? 'approved' : 'rejected'} successfully`);
      setSelectedVerification(null);
      setAdminNotes('');
      setRejectionReason('');
      fetchData();
    } catch (error) {
      console.error('Error updating verification:', error);
      toast.error('Failed to update verification');
    }
  };

  const filteredBusinesses = businesses.filter(business => {
    const matchesSearch = business.business_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = 
      statusFilter === 'all' || 
      (statusFilter === 'verified' && business.is_verified) ||
      (statusFilter === 'unverified' && !business.is_verified);
    return matchesSearch && matchesStatus;
  });

  const pendingVerifications = verifications.filter(v => v.verification_status === 'pending');

  return (
    <div className="space-y-6">
      {/* Pending Verifications Alert */}
      {pendingVerifications.length > 0 && (
        <Card className="backdrop-blur-xl bg-yellow-500/10 border-yellow-500/30">
          <CardHeader>
            <CardTitle className="text-yellow-400 flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Pending Verifications ({pendingVerifications.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {pendingVerifications.map((verification) => {
              const business = businesses.find(b => b.id === verification.business_id);
              return (
                <div
                  key={verification.id}
                  className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                >
                  <div>
                    <p className="text-white font-medium">{business?.business_name || 'Unknown Business'}</p>
                    <p className="text-blue-300 text-sm">
                      Submitted: {format(new Date(verification.submitted_at), 'MMM d, yyyy')}
                    </p>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedVerification(verification)}
                        className="border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/20"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Review
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-slate-900 border-white/10 text-white max-w-2xl">
                      <DialogHeader>
                        <DialogTitle className="text-yellow-400">Review Verification</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-blue-300 text-sm">Business Name</p>
                            <p className="text-white">{business?.business_name}</p>
                          </div>
                          <div>
                            <p className="text-blue-300 text-sm">Category</p>
                            <p className="text-white">{business?.category || 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-blue-300 text-sm">Location</p>
                            <p className="text-white">{business?.city}, {business?.state}</p>
                          </div>
                          <div>
                            <p className="text-blue-300 text-sm">Submitted</p>
                            <p className="text-white">{format(new Date(verification.submitted_at), 'PPP')}</p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <p className="text-blue-300 text-sm">Documents</p>
                          <div className="flex flex-wrap gap-2">
                            {verification.registration_document_url && (
                              <a
                                href={verification.registration_document_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 px-3 py-1 bg-blue-500/20 text-blue-400 rounded text-sm hover:bg-blue-500/30"
                              >
                                <FileText className="h-3 w-3" />
                                Registration
                              </a>
                            )}
                            {verification.ownership_document_url && (
                              <a
                                href={verification.ownership_document_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 px-3 py-1 bg-blue-500/20 text-blue-400 rounded text-sm hover:bg-blue-500/30"
                              >
                                <FileText className="h-3 w-3" />
                                Ownership
                              </a>
                            )}
                            {verification.address_document_url && (
                              <a
                                href={verification.address_document_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 px-3 py-1 bg-blue-500/20 text-blue-400 rounded text-sm hover:bg-blue-500/30"
                              >
                                <FileText className="h-3 w-3" />
                                Address
                              </a>
                            )}
                          </div>
                        </div>

                        <div>
                          <label className="text-blue-300 text-sm">Admin Notes</label>
                          <Textarea
                            value={adminNotes}
                            onChange={(e) => setAdminNotes(e.target.value)}
                            placeholder="Add notes about this verification..."
                            className="bg-white/5 border-white/10 text-white mt-1"
                          />
                        </div>

                        <div>
                          <label className="text-blue-300 text-sm">Rejection Reason (if rejecting)</label>
                          <Textarea
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            placeholder="Explain why the verification is being rejected..."
                            className="bg-white/5 border-white/10 text-white mt-1"
                          />
                        </div>

                        <div className="flex gap-3 pt-4">
                          <Button
                            onClick={() => handleVerification(verification.id, 'approved')}
                            className="flex-1 bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Approve
                          </Button>
                          <Button
                            onClick={() => handleVerification(verification.id, 'rejected')}
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
              );
            })}
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
                placeholder="Search businesses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-blue-300"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48 bg-white/5 border-white/10 text-white">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Businesses</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="unverified">Unverified</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={fetchData} variant="outline" className="border-white/10 text-blue-200 hover:bg-white/10">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Businesses List */}
      <Card className="backdrop-blur-xl bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Building2 className="h-5 w-5 text-yellow-400" />
            All Businesses ({filteredBusinesses.length})
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
              {filteredBusinesses.map((business) => (
                <div
                  key={business.id}
                  className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10 gap-4"
                >
                  <div>
                    <p className="text-white font-medium">{business.business_name}</p>
                    <p className="text-blue-300 text-sm">
                      {business.category} • {business.city}, {business.state}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={business.is_verified 
                      ? 'bg-green-500/20 text-green-400 border-green-500/30'
                      : 'bg-gray-500/20 text-gray-400 border-gray-500/30'
                    }>
                      {business.is_verified ? (
                        <><CheckCircle className="h-3 w-3 mr-1" /> Verified</>
                      ) : (
                        <><Clock className="h-3 w-3 mr-1" /> Unverified</>
                      )}
                    </Badge>
                    <p className="text-blue-300 text-sm">
                      {format(new Date(business.created_at), 'MMM d, yyyy')}
                    </p>
                  </div>
                </div>
              ))}
              {filteredBusinesses.length === 0 && (
                <div className="text-center py-8 text-blue-300">
                  No businesses found matching your criteria
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminBusinesses;
