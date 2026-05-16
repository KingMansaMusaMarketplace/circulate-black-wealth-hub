import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, Check, X, Pause, Play } from 'lucide-react';
import { toast } from 'sonner';
import {
  HotelPartner,
  listHotelPartners,
  updateHotelPartnerStatus,
  HOTEL_STATUS_COLORS,
  HotelPartnerStatus,
} from '@/lib/api/noir-hotel-partners-api';

const HotelPartnersTab: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [partners, setPartners] = useState<HotelPartner[]>([]);

  const reload = async () => {
    setLoading(true);
    const { data, error } = await listHotelPartners();
    if (error) toast.error(error.message);
    setPartners((data as HotelPartner[] | null) ?? []);
    setLoading(false);
  };

  useEffect(() => { reload(); }, []);

  const setStatus = async (p: HotelPartner, status: HotelPartnerStatus) => {
    let reason: string | undefined;
    if (status === 'rejected') {
      reason = window.prompt('Reason for rejection (shown to applicant)?') ?? undefined;
      if (!reason) return;
    }
    const { error } = await updateHotelPartnerStatus(p.id, status, reason);
    if (error) return toast.error(error.message);
    toast.success(`Hotel marked ${status}`);
    reload();
  };

  if (loading) return <div className="py-12 flex justify-center"><Loader2 className="h-6 w-6 animate-spin text-mansagold" /></div>;

  const pending = partners.filter(p => p.status === 'pending');
  const others = partners.filter(p => p.status !== 'pending');

  return (
    <div className="space-y-4">
      <div className="text-xs text-white/50">
        Hotel partners apply via /noir/hotels. Approve to activate their concierge account access.
      </div>

      {pending.length > 0 && (
        <Card className="bg-yellow-500/5 border-yellow-500/20">
          <CardContent className="p-0">
            <div className="px-4 py-2 text-sm font-semibold text-yellow-300 border-b border-yellow-500/20">
              {pending.length} pending application{pending.length === 1 ? '' : 's'}
            </div>
            <Table>
              <TableHeader><TableRow className="border-white/10">
                <TableHead className="text-white/70">Hotel</TableHead>
                <TableHead className="text-white/70">Contact</TableHead>
                <TableHead className="text-white/70">Submitted</TableHead>
                <TableHead className="text-white/70 text-right">Actions</TableHead>
              </TableRow></TableHeader>
              <TableBody>
                {pending.map(p => (
                  <TableRow key={p.id} className="border-white/10">
                    <TableCell>
                      <div className="text-white font-medium">{p.hotel_name}</div>
                      <div className="text-xs text-white/50">{[p.address_city, p.address_state].filter(Boolean).join(', ')}</div>
                      {p.notes && <div className="text-xs text-white/40 mt-1 max-w-md">{p.notes}</div>}
                    </TableCell>
                    <TableCell className="text-sm">
                      <div className="text-white">{p.contact_name}</div>
                      <div className="text-white/50 text-xs">{p.contact_email}</div>
                      {p.contact_phone && <div className="text-white/50 text-xs">{p.contact_phone}</div>}
                    </TableCell>
                    <TableCell className="text-xs text-white/50">{new Date(p.created_at).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button size="sm" onClick={() => setStatus(p, 'active')} className="bg-green-500/20 text-green-300 hover:bg-green-500/30 border border-green-500/30">
                        <Check className="h-4 w-4 mr-1" /> Approve
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => setStatus(p, 'rejected')} className="text-red-300 hover:bg-red-500/10">
                        <X className="h-4 w-4 mr-1" /> Reject
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <Card className="bg-white/5 border-white/10">
        <CardContent className="p-0">
          <Table>
            <TableHeader><TableRow className="border-white/10">
              <TableHead className="text-white/70">Hotel</TableHead>
              <TableHead className="text-white/70">Status</TableHead>
              <TableHead className="text-white/70">Billing</TableHead>
              <TableHead className="text-white/70">Approved</TableHead>
              <TableHead className="text-white/70 text-right">Actions</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {others.length === 0 ? (
                <TableRow><TableCell colSpan={5} className="text-center text-white/50 py-8">No partners yet.</TableCell></TableRow>
              ) : others.map(p => (
                <TableRow key={p.id} className="border-white/10">
                  <TableCell>
                    <div className="text-white font-medium">{p.hotel_name}</div>
                    <div className="text-xs text-white/50">{p.contact_email}</div>
                  </TableCell>
                  <TableCell>
                    <Badge className={HOTEL_STATUS_COLORS[p.status]}>{p.status}</Badge>
                  </TableCell>
                  <TableCell className="text-white/70 text-sm capitalize">{p.billing_terms.replace('_', ' ')}</TableCell>
                  <TableCell className="text-xs text-white/50">{p.approved_at ? new Date(p.approved_at).toLocaleDateString() : '—'}</TableCell>
                  <TableCell className="text-right">
                    {p.status === 'active' && (
                      <Button size="sm" variant="ghost" onClick={() => setStatus(p, 'suspended')} className="text-orange-300 hover:bg-orange-500/10">
                        <Pause className="h-4 w-4 mr-1" /> Suspend
                      </Button>
                    )}
                    {p.status === 'suspended' && (
                      <Button size="sm" variant="ghost" onClick={() => setStatus(p, 'active')} className="text-green-300 hover:bg-green-500/10">
                        <Play className="h-4 w-4 mr-1" /> Reactivate
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default HotelPartnersTab;
