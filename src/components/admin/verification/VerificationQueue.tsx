import React, { useState, useEffect } from 'react';
import { fetchVerificationQueue, approveBusinessVerification, rejectBusinessVerification } from '@/lib/api/verification-api';
import { VerificationQueueItem } from '@/lib/types/verification';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle, XCircle, Eye, RefreshCw } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const VerificationQueue: React.FC = () => {
  const [queue, setQueue] = useState<VerificationQueueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<VerificationQueueItem | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isRejectOpen, setIsRejectOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [filter, setFilter] = useState('pending');

  useEffect(() => {
    loadQueue();
  }, []);

  const loadQueue = async () => {
    setLoading(true);
    const data = await fetchVerificationQueue();
    setQueue(data);
    setLoading(false);
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
          onClick={loadQueue}
          className="bg-mansagold hover:bg-mansagold/90 text-mansablue"
        >
          <RefreshCw className="h-4 w-4 mr-2" /> Refresh
        </Button>
      </div>
      
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
