
import React, { useState, useEffect } from 'react';
import { fetchVerificationQueue, approveBusinessVerification, rejectBusinessVerification } from '@/lib/api/verification-api';
import { VerificationQueueItem } from '@/lib/types/verification';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle, XCircle, Eye } from 'lucide-react';
import { Input } from '@/components/ui/input';
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
        <h2 className="text-2xl font-bold">Business Verification Queue</h2>
        <Button onClick={loadQueue}>Refresh</Button>
      </div>
      
      <div className="flex space-x-4 pb-4">
        <Button 
          variant={filter === 'pending' ? 'default' : 'outline'}
          onClick={() => setFilter('pending')}
        >
          Pending
        </Button>
        <Button 
          variant={filter === 'approved' ? 'default' : 'outline'}
          onClick={() => setFilter('approved')}
        >
          Approved
        </Button>
        <Button 
          variant={filter === 'rejected' ? 'default' : 'outline'}
          onClick={() => setFilter('rejected')}
        >
          Rejected
        </Button>
        <Button 
          variant={filter === 'all' ? 'default' : 'outline'}
          onClick={() => setFilter('all')}
        >
          All
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Verification Requests</CardTitle>
          <CardDescription>Review and manage business verification requests</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-mansablue" />
            </div>
          ) : filteredQueue.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No {filter !== 'all' ? filter : ''} verification requests to display
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Business</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Ownership %</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredQueue.map((item) => (
                    <TableRow key={item.verification_id}>
                      <TableCell className="font-medium">{item.business_name}</TableCell>
                      <TableCell>{item.owner_name || 'Unknown'}</TableCell>
                      <TableCell>{item.ownership_percentage ?? 'N/A'}</TableCell>
                      <TableCell>
                        {item.verification_status === 'pending' && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            Pending
                          </span>
                        )}
                        {item.verification_status === 'approved' && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Approved
                          </span>
                        )}
                        {item.verification_status === 'rejected' && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            Rejected
                          </span>
                        )}
                      </TableCell>
                      <TableCell>{new Date(item.submitted_at).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => {
                            setSelectedItem(item);
                            setIsViewOpen(true);
                          }}
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
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Verification Request</DialogTitle>
            <DialogDescription>
              Review the business verification details
            </DialogDescription>
          </DialogHeader>
          
          {selectedItem && (
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-lg font-medium">Business Information</h3>
                  <div className="mt-2 space-y-2">
                    <div>
                      <span className="font-medium">Name:</span> {selectedItem.business_name}
                    </div>
                    <div>
                      <span className="font-medium">Email:</span> {selectedItem.business_email}
                    </div>
                    <div>
                      <span className="font-medium">Owner:</span> {selectedItem.owner_name || 'Unknown'}
                    </div>
                    <div>
                      <span className="font-medium">Black Ownership:</span> {selectedItem.ownership_percentage}%
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium">Verification Status</h3>
                  <div className="mt-2 space-y-2">
                    <div>
                      <span className="font-medium">Current Status:</span> 
                      <span className={`ml-2 capitalize ${
                        selectedItem.verification_status === 'pending' ? 'text-yellow-600' :
                        selectedItem.verification_status === 'approved' ? 'text-green-600' :
                        'text-red-600'
                      }`}>
                        {selectedItem.verification_status}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium">Submitted:</span> {new Date(selectedItem.submitted_at).toLocaleDateString()}
                    </div>
                    {selectedItem.verified_at && (
                      <div>
                        <span className="font-medium">
                          {selectedItem.verification_status === 'approved' ? 'Approved' : 'Rejected'}:
                        </span> {new Date(selectedItem.verified_at).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium">Documents</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  These documents have been submitted for verification.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* This would normally link to actual documents, but this is a placeholder */}
                  <Card>
                    <CardHeader className="p-4">
                      <CardTitle className="text-md">Business Registration</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <Button variant="outline" className="w-full">
                        View Document
                      </Button>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="p-4">
                      <CardTitle className="text-md">Ownership Proof</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <Button variant="outline" className="w-full">
                        View Document
                      </Button>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="p-4">
                      <CardTitle className="text-md">Address Verification</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <Button variant="outline" className="w-full">
                        View Document
                      </Button>
                    </CardContent>
                  </Card>
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
                  >
                    <XCircle className="h-4 w-4 mr-2" /> Reject
                  </Button>
                  
                  <Button
                    onClick={() => handleApprove(selectedItem.verification_id)}
                    disabled={actionLoading}
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Verification</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this verification request.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <Textarea
              placeholder="Enter rejection reason"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              rows={4}
            />
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsRejectOpen(false)}
              disabled={actionLoading}
            >
              Cancel
            </Button>
            
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={actionLoading || !rejectionReason.trim()}
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
