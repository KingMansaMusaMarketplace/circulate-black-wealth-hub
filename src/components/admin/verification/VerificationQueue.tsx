import React, { useState, useEffect } from 'react';
import { fetchVerificationQueue, approveBusinessVerification, rejectBusinessVerification } from '@/lib/api/verification-api';
import { VerificationQueueItem } from '@/lib/types/verification';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle, XCircle, Eye, RefreshCw, Building2 } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

interface RegisteredBusiness {
  id: string;
  business_name: string;
  email: string | null;
  category: string | null;
  city: string | null;
  state: string | null;
  is_verified: boolean;
  created_at: string;
  owner_id: string;
  subscription_status: string | null;
  has_verification: boolean;
}

interface PendingBusinessUser {
  id: string;
  email: string | null;
  full_name: string | null;
  phone: string | null;
  created_at: string;
}

const VerificationQueue: React.FC = () => {
  const [queue, setQueue] = useState<VerificationQueueItem[]>([]);
  const [businesses, setBusinesses] = useState<RegisteredBusiness[]>([]);
  const [pendingUsers, setPendingUsers] = useState<PendingBusinessUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [businessesLoading, setBusinessesLoading] = useState(true);
  const [pendingUsersLoading, setPendingUsersLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<VerificationQueueItem | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isRejectOpen, setIsRejectOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [filter, setFilter] = useState('pending');
  const [activeTab, setActiveTab] = useState('businesses');

  useEffect(() => {
    loadQueue();
    loadBusinesses();
    loadPendingBusinessUsers();
  }, []);

  const loadQueue = async () => {
    setLoading(true);
    const data = await fetchVerificationQueue();
    setQueue(data);
    setLoading(false);
  };

  const loadBusinesses = async () => {
    setBusinessesLoading(true);
    try {
      const { data, error } = await supabase
        .from('businesses')
        .select(`
          id,
          business_name,
          email,
          category,
          city,
          state,
          is_verified,
          created_at,
          owner_id,
          subscription_status,
          business_verifications(id)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedData: RegisteredBusiness[] = (data || []).map(b => ({
        id: b.id,
        business_name: b.business_name,
        email: b.email,
        category: b.category,
        city: b.city,
        state: b.state,
        is_verified: b.is_verified || false,
        created_at: b.created_at,
        owner_id: b.owner_id,
        subscription_status: b.subscription_status,
        has_verification: Array.isArray(b.business_verifications) && b.business_verifications.length > 0
      }));

      setBusinesses(formattedData);
    } catch (error) {
      console.error('Error loading businesses:', error);
    } finally {
      setBusinessesLoading(false);
    }
  };

  const loadPendingBusinessUsers = async () => {
    setPendingUsersLoading(true);
    try {
      // Get all business owner IDs
      const { data: businessOwners } = await supabase
        .from('businesses')
        .select('owner_id');
      
      const ownerIds = (businessOwners || []).map(b => b.owner_id);

      // Get profiles with user_type = 'business' that don't have a business record
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, full_name, phone, created_at')
        .eq('user_type', 'business')
        .not('id', 'in', ownerIds.length > 0 ? `(${ownerIds.join(',')})` : '(00000000-0000-0000-0000-000000000000)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPendingUsers(data || []);
    } catch (error) {
      console.error('Error loading pending business users:', error);
    } finally {
      setPendingUsersLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    setActionLoading(true);
    const success = await approveBusinessVerification(id);
    if (success) {
      await loadQueue();
      setIsViewOpen(false);
    }
    setActionLoading(false);
  };

  const handleReject = async () => {
    if (!selectedItem || !rejectionReason.trim()) return;
    
    setActionLoading(true);
    const success = await rejectBusinessVerification(selectedItem.verification_id, rejectionReason);
    if (success) {
      await loadQueue();
      setIsRejectOpen(false);
      setRejectionReason('');
    }
    setActionLoading(false);
  };

  const filteredQueue = queue.filter(item => {
    if (filter === 'all') return true;
    return item.verification_status === filter;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Business Verification Queue</h2>
        <Button 
          onClick={() => { loadQueue(); loadBusinesses(); loadPendingBusinessUsers(); }}
          className="bg-mansagold hover:bg-mansagold/90 text-mansablue"
        >
          <RefreshCw className="h-4 w-4 mr-2" /> Refresh
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-white/10">
          <TabsTrigger value="pending-setup" className="data-[state=active]:bg-mansagold data-[state=active]:text-mansablue">
            Pending Setup ({pendingUsers.length})
          </TabsTrigger>
          <TabsTrigger value="businesses" className="data-[state=active]:bg-mansagold data-[state=active]:text-mansablue">
            <Building2 className="h-4 w-4 mr-2" />
            All Businesses ({businesses.length})
          </TabsTrigger>
          <TabsTrigger value="verification" className="data-[state=active]:bg-mansagold data-[state=active]:text-mansablue">
            Verification Requests ({queue.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending-setup">
          <Card className="backdrop-blur-xl bg-white/10 border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Pending Business Setup</CardTitle>
              <CardDescription className="text-white/60">Users who signed up as business but haven't created their business profile yet</CardDescription>
            </CardHeader>
            <CardContent>
              {pendingUsersLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-mansagold" />
                </div>
              ) : pendingUsers.length === 0 ? (
                <div className="text-center py-8 text-white/60">
                  All business users have completed their setup
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-white/20">
                        <TableHead className="text-white/70">Full Name</TableHead>
                        <TableHead className="text-white/70">Email</TableHead>
                        <TableHead className="text-white/70">Phone</TableHead>
                        <TableHead className="text-white/70">Signed Up</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pendingUsers.map((user) => (
                        <TableRow key={user.id} className="border-white/10">
                          <TableCell className="font-medium text-white">{user.full_name || 'N/A'}</TableCell>
                          <TableCell className="text-white/80">{user.email || 'N/A'}</TableCell>
                          <TableCell className="text-white/80">{user.phone || 'N/A'}</TableCell>
                          <TableCell className="text-white/80">
                            {format(new Date(user.created_at), 'MMM d, yyyy h:mm a')}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="businesses">
          <Card className="backdrop-blur-xl bg-white/10 border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Registered Businesses</CardTitle>
              <CardDescription className="text-white/60">All businesses that have signed up on the platform</CardDescription>
            </CardHeader>
            <CardContent>
              {businessesLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-mansagold" />
                </div>
              ) : businesses.length === 0 ? (
                <div className="text-center py-8 text-white/60">
                  No businesses registered yet
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-white/20">
                        <TableHead className="text-white/70">Business Name</TableHead>
                        <TableHead className="text-white/70">Email</TableHead>
                        <TableHead className="text-white/70">Category</TableHead>
                        <TableHead className="text-white/70">Location</TableHead>
                        <TableHead className="text-white/70">Verified</TableHead>
                        <TableHead className="text-white/70">Verification Status</TableHead>
                        <TableHead className="text-white/70">Registered</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {businesses.map((business) => (
                        <TableRow key={business.id} className="border-white/10">
                          <TableCell className="font-medium text-white">{business.business_name}</TableCell>
                          <TableCell className="text-white/80">{business.email || 'N/A'}</TableCell>
                          <TableCell className="text-white/80">{business.category || 'N/A'}</TableCell>
                          <TableCell className="text-white/80">
                            {business.city && business.state ? `${business.city}, ${business.state}` : 'N/A'}
                          </TableCell>
                          <TableCell>
                            {business.is_verified ? (
                              <Badge className="bg-green-500/20 text-green-300 border-green-500/30">Verified</Badge>
                            ) : (
                              <Badge className="bg-gray-500/20 text-gray-300 border-gray-500/30">Not Verified</Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            {business.has_verification ? (
                              <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">Submitted</Badge>
                            ) : (
                              <Badge className="bg-orange-500/20 text-orange-300 border-orange-500/30">Not Submitted</Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-white/80">
                            {format(new Date(business.created_at), 'MMM d, yyyy')}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="verification">
          <div className="flex flex-wrap gap-3 pb-4">
            {['pending', 'approved', 'rejected', 'all'].map((status) => (
              <Button 
                key={status}
                variant={filter === status ? 'default' : 'outline'}
                onClick={() => setFilter(status)}
                className={filter === status 
                  ? 'bg-mansagold hover:bg-mansagold/90 text-mansablue' 
                  : 'border-white/20 text-white/70 hover:bg-white/10 hover:text-white'
                }
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Button>
            ))}
          </div>
      
      <Card className="backdrop-blur-xl bg-white/10 border-white/20">
        <CardHeader>
          <CardTitle className="text-white">Verification Requests</CardTitle>
          <CardDescription className="text-white/60">Review and manage business verification requests</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-mansagold" />
            </div>
          ) : filteredQueue.length === 0 ? (
            <div className="text-center py-8 text-white/60">
              No {filter !== 'all' ? filter : ''} verification requests to display
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/20">
                    <TableHead className="text-white/70">Business</TableHead>
                    <TableHead className="text-white/70">Owner</TableHead>
                    <TableHead className="text-white/70">Ownership %</TableHead>
                    <TableHead className="text-white/70">Status</TableHead>
                    <TableHead className="text-white/70">Submitted</TableHead>
                    <TableHead className="text-white/70">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredQueue.map((item) => (
                    <TableRow key={item.verification_id} className="border-white/10">
                      <TableCell className="font-medium text-white">{item.business_name}</TableCell>
                      <TableCell className="text-white/80">{item.owner_name || 'Unknown'}</TableCell>
                      <TableCell className="text-white/80">{item.ownership_percentage ?? 'N/A'}</TableCell>
                      <TableCell>
                        {item.verification_status === 'pending' && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-500/20 text-orange-300 border border-orange-500/30">
                            Pending
                          </span>
                        )}
                        {item.verification_status === 'approved' && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/20 text-green-300 border border-green-500/30">
                            Approved
                          </span>
                        )}
                        {item.verification_status === 'rejected' && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/20 text-red-300 border border-red-500/30">
                            Rejected
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-white/80">{new Date(item.submitted_at).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => {
                            setSelectedItem(item);
                            setIsViewOpen(true);
                          }}
                          className="border-mansagold/50 text-mansagold hover:bg-mansagold/20"
                        >
                          <Eye className="h-4 w-4 mr-1" /> View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
        </TabsContent>
      </Tabs>
      
      {/* View Verification Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-3xl backdrop-blur-xl bg-mansablue/95 border-white/20">
          <DialogHeader>
            <DialogTitle className="text-white">Verification Request</DialogTitle>
            <DialogDescription className="text-white/60">
              Review the business verification details
            </DialogDescription>
          </DialogHeader>
          
          {selectedItem && (
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-lg font-medium text-white">Business Information</h3>
                  <div className="mt-2 space-y-2 text-white/80">
                    <div>
                      <span className="font-medium text-white">Name:</span> {selectedItem.business_name}
                    </div>
                    <div>
                      <span className="font-medium text-white">Email:</span> {selectedItem.business_email}
                    </div>
                    <div>
                      <span className="font-medium text-white">Owner:</span> {selectedItem.owner_name || 'Unknown'}
                    </div>
                    <div>
                      <span className="font-medium text-white">Black Ownership:</span> {selectedItem.ownership_percentage}%
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-white">Verification Status</h3>
                  <div className="mt-2 space-y-2 text-white/80">
                    <div>
                      <span className="font-medium text-white">Current Status:</span> 
                      <span className={`ml-2 capitalize ${
                        selectedItem.verification_status === 'pending' ? 'text-orange-400' :
                        selectedItem.verification_status === 'approved' ? 'text-green-400' :
                        'text-red-400'
                      }`}>
                        {selectedItem.verification_status}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-white">Submitted:</span> {new Date(selectedItem.submitted_at).toLocaleDateString()}
                    </div>
                    {selectedItem.verified_at && (
                      <div>
                        <span className="font-medium text-white">
                          {selectedItem.verification_status === 'approved' ? 'Approved' : 'Rejected'}:
                        </span> {new Date(selectedItem.verified_at).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-white">Documents</h3>
                <p className="text-sm text-white/60 mb-2">
                  These documents have been submitted for verification.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {['Business Registration', 'Ownership Proof', 'Address Verification'].map((doc) => (
                    <Card key={doc} className="backdrop-blur-xl bg-white/10 border-white/20">
                      <CardHeader className="p-4">
                        <CardTitle className="text-md text-white">{doc}</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <Button variant="outline" className="w-full border-white/20 text-white/70 hover:bg-white/10">
                          View Document
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
              
              {selectedItem.verification_status === 'pending' && (
                <div className="flex justify-between pt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsViewOpen(false);
                      setIsRejectOpen(true);
                    }}
                    className="border-red-500/50 text-red-400 hover:bg-red-500/20"
                  >
                    <XCircle className="h-4 w-4 mr-2" /> Reject
                  </Button>
                  
                  <Button
                    onClick={() => handleApprove(selectedItem.verification_id)}
                    disabled={actionLoading}
                    className="bg-mansagold hover:bg-mansagold/90 text-mansablue"
                  >
                    {actionLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Processing...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" /> Approve
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Reject Dialog */}
      <Dialog open={isRejectOpen} onOpenChange={setIsRejectOpen}>
        <DialogContent className="backdrop-blur-xl bg-mansablue/95 border-white/20">
          <DialogHeader>
            <DialogTitle className="text-white">Reject Verification</DialogTitle>
            <DialogDescription className="text-white/60">
              Please provide a reason for rejecting this verification request.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <Textarea
              placeholder="Enter rejection reason"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              rows={4}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
            />
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsRejectOpen(false)}
              disabled={actionLoading}
              className="border-white/20 text-white/70 hover:bg-white/10"
            >
              Cancel
            </Button>
            
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={actionLoading || !rejectionReason.trim()}
              className="bg-red-500 hover:bg-red-600"
            >
              {actionLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Processing...
                </>
              ) : (
                'Reject Verification'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VerificationQueue;
