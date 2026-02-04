import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Phone, Mail, Clock, CheckCircle, XCircle, PhoneCall, 
  ExternalLink, RefreshCw, Gift, MessageSquare, Calendar,
  PhoneOff, ThumbsUp, ThumbsDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface FreeListing {
  id: string;
  business_name: string;
  website_url: string | null;
  owner_email: string | null;
  phone_number: string | null;
  city: string | null;
  state: string | null;
  category: string | null;
  call_status: string | null;
  call_notes: string | null;
  called_at: string | null;
  created_at: string | null;
  is_converted: boolean | null;
}

type CallStatus = 'not_called' | 'called_interested' | 'called_converted' | 'declined' | 'no_answer' | 'callback_scheduled';

const CALL_STATUS_OPTIONS: { value: CallStatus; label: string; icon: React.ReactNode; color: string }[] = [
  { value: 'not_called', label: 'Not Called', icon: <Phone className="w-3 h-3" />, color: 'bg-gray-500/20 text-gray-400' },
  { value: 'called_interested', label: 'Interested', icon: <ThumbsUp className="w-3 h-3" />, color: 'bg-blue-500/20 text-blue-400' },
  { value: 'called_converted', label: 'Converted ($50)', icon: <CheckCircle className="w-3 h-3" />, color: 'bg-green-500/20 text-green-400' },
  { value: 'declined', label: 'Declined', icon: <ThumbsDown className="w-3 h-3" />, color: 'bg-red-500/20 text-red-400' },
  { value: 'no_answer', label: 'No Answer', icon: <PhoneOff className="w-3 h-3" />, color: 'bg-yellow-500/20 text-yellow-400' },
  { value: 'callback_scheduled', label: 'Callback Scheduled', icon: <Calendar className="w-3 h-3" />, color: 'bg-purple-500/20 text-purple-400' },
];

export const FreeOutreachTab: React.FC = () => {
  const [listings, setListings] = useState<FreeListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedListing, setSelectedListing] = useState<FreeListing | null>(null);
  const [callNotes, setCallNotes] = useState('');
  const [newStatus, setNewStatus] = useState<CallStatus>('not_called');
  const [isUpdating, setIsUpdating] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const fetchListings = async () => {
    try {
      let query = supabase
        .from('b2b_external_leads')
        .select('id, business_name, website_url, owner_email, phone_number, city, state, category, call_status, call_notes, called_at, created_at, is_converted')
        .eq('listing_type', 'free')
        .order('created_at', { ascending: false });

      if (filterStatus !== 'all') {
        query = query.eq('call_status', filterStatus);
      }

      const { data, error } = await query;

      if (error) throw error;
      setListings(data || []);
    } catch (error) {
      console.error('Error fetching free listings:', error);
      toast.error('Failed to load free listings');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, [filterStatus]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchListings();
  };

  const openCallDialog = (listing: FreeListing) => {
    setSelectedListing(listing);
    setNewStatus((listing.call_status as CallStatus) || 'not_called');
    setCallNotes(listing.call_notes || '');
  };

  const updateCallStatus = async () => {
    if (!selectedListing) return;
    
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('b2b_external_leads')
        .update({ 
          call_status: newStatus,
          call_notes: callNotes,
          called_at: new Date().toISOString()
        })
        .eq('id', selectedListing.id);

      if (error) throw error;
      
      toast.success('Call status updated!');
      setSelectedListing(null);
      fetchListings();
    } catch (error) {
      console.error('Error updating call status:', error);
      toast.error('Failed to update status');
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusBadge = (status: string | null) => {
    const statusOption = CALL_STATUS_OPTIONS.find(s => s.value === status) || CALL_STATUS_OPTIONS[0];
    return (
      <Badge className={`${statusOption.color} border-0`}>
        {statusOption.icon}
        <span className="ml-1">{statusOption.label}</span>
      </Badge>
    );
  };

  const stats = {
    total: listings.length,
    notCalled: listings.filter(l => !l.call_status || l.call_status === 'not_called').length,
    interested: listings.filter(l => l.call_status === 'called_interested').length,
    converted: listings.filter(l => l.call_status === 'called_converted').length,
    declined: listings.filter(l => l.call_status === 'declined').length,
    noAnswer: listings.filter(l => l.call_status === 'no_answer').length,
    callback: listings.filter(l => l.call_status === 'callback_scheduled').length,
  };

  if (isLoading) {
    return (
      <Card className="bg-white/5 border-white/10">
        <CardContent className="p-8">
          <div className="flex items-center justify-center gap-3">
            <RefreshCw className="w-5 h-5 animate-spin text-blue-400" />
            <span className="text-blue-200">Loading free listings...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <CardTitle className="text-white flex items-center gap-2">
                <Gift className="w-5 h-5 text-emerald-400" />
                Free Listings Outreach
              </CardTitle>
              <CardDescription className="text-blue-200">
                Call these businesses to convert to $50/year paid listings
              </CardDescription>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              {/* Stats */}
              <div className="flex gap-2 text-xs flex-wrap">
                <span className="text-gray-400">{stats.notCalled} to call</span>
                <span className="text-white/30">•</span>
                <span className="text-blue-400">{stats.interested} interested</span>
                <span className="text-white/30">•</span>
                <span className="text-green-400">{stats.converted} converted</span>
                <span className="text-white/30">•</span>
                <span className="text-yellow-400">{stats.noAnswer} no answer</span>
              </div>
              
              {/* Filter */}
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[160px] bg-white/5 border-white/20 text-white">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {CALL_STATUS_OPTIONS.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="sm"
                className="border-white/20 text-blue-200"
                onClick={handleRefresh}
                disabled={isRefreshing}
              >
                <RefreshCw className={`w-4 h-4 mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {listings.length === 0 ? (
            <div className="text-center py-12">
              <Gift className="w-12 h-12 mx-auto mb-4 text-emerald-400 opacity-50" />
              <p className="text-blue-200">No free listings found</p>
              <p className="text-sm text-blue-300 mt-1">
                Import businesses with listing_type = 'free' to see them here
              </p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {listings.map((listing, index) => (
                <motion.div
                  key={listing.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10 hover:border-white/20 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="p-2 rounded-lg bg-emerald-500/20">
                      <Gift className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-white font-medium truncate">
                          {listing.business_name}
                        </p>
                        {listing.website_url && (
                          <a 
                            href={listing.website_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 flex-shrink-0"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-sm text-blue-300 flex-wrap">
                        {listing.phone_number && (
                          <a href={`tel:${listing.phone_number}`} className="flex items-center gap-1 hover:text-emerald-400">
                            <Phone className="w-3 h-3" />
                            {listing.phone_number}
                          </a>
                        )}
                        {listing.owner_email && (
                          <a href={`mailto:${listing.owner_email}`} className="flex items-center gap-1 hover:text-emerald-400">
                            <Mail className="w-3 h-3" />
                            {listing.owner_email}
                          </a>
                        )}
                        {(listing.city || listing.state) && (
                          <span className="text-blue-400">
                            {[listing.city, listing.state].filter(Boolean).join(', ')}
                          </span>
                        )}
                      </div>
                      {listing.call_notes && (
                        <p className="text-xs text-slate-400 mt-1 truncate flex items-center gap-1">
                          <MessageSquare className="w-3 h-3" />
                          {listing.call_notes}
                        </p>
                      )}
                      {listing.called_at && (
                        <p className="text-xs text-slate-500 mt-0.5">
                          Last called: {format(new Date(listing.called_at), 'MMM d, h:mm a')}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    {getStatusBadge(listing.call_status)}
                    
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-emerald-500/50 text-emerald-300 hover:bg-emerald-500/10"
                      onClick={() => openCallDialog(listing)}
                    >
                      <PhoneCall className="w-4 h-4 mr-1" />
                      Update
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Call Status Dialog */}
      <Dialog open={!!selectedListing} onOpenChange={() => setSelectedListing(null)}>
        <DialogContent className="bg-slate-900 border-white/10 text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <PhoneCall className="w-5 h-5 text-emerald-400" />
              Update Call Status
            </DialogTitle>
            <DialogDescription className="text-blue-200">
              {selectedListing?.business_name}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Quick contact info */}
            {selectedListing && (
              <div className="flex gap-4 text-sm">
                {selectedListing.phone_number && (
                  <a 
                    href={`tel:${selectedListing.phone_number}`}
                    className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300"
                  >
                    <Phone className="w-4 h-4" />
                    {selectedListing.phone_number}
                  </a>
                )}
                {selectedListing.owner_email && (
                  <a 
                    href={`mailto:${selectedListing.owner_email}`}
                    className="flex items-center gap-1.5 text-blue-400 hover:text-blue-300"
                  >
                    <Mail className="w-4 h-4" />
                    {selectedListing.owner_email}
                  </a>
                )}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm text-blue-200">Call Status</label>
              <Select value={newStatus} onValueChange={(v) => setNewStatus(v as CallStatus)}>
                <SelectTrigger className="bg-white/5 border-white/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CALL_STATUS_OPTIONS.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        {option.icon}
                        {option.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-blue-200">Call Notes</label>
              <Textarea
                value={callNotes}
                onChange={(e) => setCallNotes(e.target.value)}
                placeholder="e.g., Spoke with owner, will pay next week..."
                className="bg-white/5 border-white/20 text-white min-h-[100px]"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setSelectedListing(null)}
              className="border-white/20 text-blue-200"
            >
              Cancel
            </Button>
            <Button
              onClick={updateCallStatus}
              disabled={isUpdating}
              className="bg-gradient-to-r from-emerald-500 to-teal-500"
            >
              {isUpdating ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-1 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Save Status
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FreeOutreachTab;
