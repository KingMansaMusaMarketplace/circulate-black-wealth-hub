import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { VacationProperty } from '@/types/vacation-rental';
import { toast } from 'sonner';
import { Camera, Calendar, Clock, CheckCircle, Loader2, Crown, Send } from 'lucide-react';

interface ProfessionalPhotographyRequestProps {
  properties: VacationProperty[];
}

interface PhotoRequest {
  id: string;
  property_id: string;
  status: string;
  preferred_date: string | null;
  preferred_time_slot: string | null;
  notes: string | null;
  photographer_name: string | null;
  scheduled_date: string | null;
  created_at: string;
}

const TIME_SLOTS = [
  { value: 'morning', label: 'Morning (9am - 12pm)' },
  { value: 'afternoon', label: 'Afternoon (12pm - 4pm)' },
  { value: 'golden_hour', label: 'Golden Hour (4pm - 7pm)' },
];

const ProfessionalPhotographyRequest: React.FC<ProfessionalPhotographyRequestProps> = ({ properties }) => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<PhotoRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const [selectedProperty, setSelectedProperty] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (user) fetchRequests();
  }, [user]);

  const fetchRequests = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('photography_requests')
        .select('*')
        .eq('host_id', user.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      setRequests((data as any[]) || []);
    } catch (err) {
      console.error('Error fetching photo requests:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!user || !selectedProperty) {
      toast.error('Please select a property');
      return;
    }
    setSubmitting(true);
    try {
      const { error } = await supabase.from('photography_requests').insert({
        host_id: user.id,
        property_id: selectedProperty,
        preferred_date: preferredDate || null,
        preferred_time_slot: timeSlot || null,
        notes: notes || null,
      } as any);
      if (error) throw error;
      toast.success('Photography request submitted! Our team will contact you within 48 hours.');
      setShowForm(false);
      setSelectedProperty('');
      setPreferredDate('');
      setTimeSlot('');
      setNotes('');
      fetchRequests();
    } catch (err) {
      console.error('Error submitting request:', err);
      toast.error('Failed to submit request');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': return <Badge className="bg-yellow-500/20 text-yellow-400">Pending</Badge>;
      case 'scheduled': return <Badge className="bg-blue-500/20 text-blue-400">Scheduled</Badge>;
      case 'completed': return <Badge className="bg-green-500/20 text-green-400">Completed</Badge>;
      case 'cancelled': return <Badge variant="destructive">Cancelled</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPropertyTitle = (propertyId: string) =>
    properties.find(p => p.id === propertyId)?.title || 'Unknown Property';

  if (properties.length === 0) {
    return (
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Camera className="w-12 h-12 text-slate-500 mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">No properties yet</h3>
          <p className="text-slate-400 text-center">Add a property first to request professional photography</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card className="bg-gradient-to-r from-mansagold/20 to-amber-900/20 border-mansagold/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Camera className="w-5 h-5 text-mansagold" />
            Professional Photography
            <Crown className="w-4 h-4 text-mansagold" />
          </CardTitle>
          <CardDescription className="text-slate-300">
            Premium hosts get professional photography included. Our photographers capture your property
            at its best — listings with pro photos get <strong className="text-mansagold">2x more bookings</strong>.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!showForm && (
            <Button
              onClick={() => setShowForm(true)}
              className="bg-mansagold hover:bg-mansagold/90 text-black"
            >
              <Camera className="w-4 h-4 mr-2" />
              Request a Photoshoot
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Request Form */}
      {showForm && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white text-lg">Schedule Your Photoshoot</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-white">Property *</Label>
              <Select value={selectedProperty} onValueChange={setSelectedProperty}>
                <SelectTrigger className="bg-slate-900 border-slate-600 text-white">
                  <SelectValue placeholder="Select a property" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  {properties.map(p => (
                    <SelectItem key={p.id} value={p.id} className="text-white">{p.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-white flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> Preferred Date
                </Label>
                <Input
                  type="date"
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="bg-slate-900 border-slate-600 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Preferred Time
                </Label>
                <Select value={timeSlot} onValueChange={setTimeSlot}>
                  <SelectTrigger className="bg-slate-900 border-slate-600 text-white">
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    {TIME_SLOTS.map(s => (
                      <SelectItem key={s.value} value={s.value} className="text-white">{s.label}</SelectItem>
              ))}

                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-white">Additional Notes</Label>
              <Textarea
                placeholder="Any specific areas to highlight, staging preferences, or access instructions..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="bg-slate-900 border-slate-600 text-white placeholder:text-slate-500"
                rows={3}
              />
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleSubmit}
                disabled={submitting || !selectedProperty}
                className="bg-mansagold hover:bg-mansagold/90 text-black"
              >
                {submitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
                Submit Request
              </Button>
              <Button variant="outline" onClick={() => setShowForm(false)} className="border-slate-600 text-white">
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Existing Requests */}
      {requests.length > 0 && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white text-lg">Your Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {requests.map(req => (
                <div key={req.id} className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg border border-slate-700">
                  <div>
                    <p className="text-white font-medium text-sm">{getPropertyTitle(req.property_id)}</p>
                    <p className="text-xs text-slate-400">
                      Requested {new Date(req.created_at).toLocaleDateString()}
                      {req.preferred_date && ` • Preferred: ${new Date(req.preferred_date).toLocaleDateString()}`}
                    </p>
                    {req.photographer_name && (
                      <p className="text-xs text-mansagold mt-1">📸 {req.photographer_name}</p>
                    )}
                  </div>
                  {getStatusBadge(req.status)}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProfessionalPhotographyRequest;
