import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, ExternalLink, CheckCircle2, X, ShieldCheck, Ban, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import {
  DOCUMENT_LABELS, STATUS_COLORS, DriverApplicationStatus,
  adminUpdateDriverStatus, reviewDocument, getSignedDocUrl, REJECTION_REASONS,
} from '@/lib/api/noir-driver-api';

interface Props {
  driverId: string | null;
  open: boolean;
  onClose: () => void;
  onChanged: () => void;
}

const DriverDetailDrawer: React.FC<Props> = ({ driverId, open, onClose, onChanged }) => {
  const [loading, setLoading] = useState(false);
  const [driver, setDriver] = useState<any>(null);
  const [documents, setDocuments] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [showReject, setShowReject] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [adminNotes, setAdminNotes] = useState('');

  useEffect(() => {
    if (open && driverId) load();
  }, [open, driverId]);

  const load = async () => {
    if (!driverId) return;
    setLoading(true);
    const [d, docs, hist] = await Promise.all([
      (supabase as any).from('noir_drivers').select('*').eq('id', driverId).single(),
      (supabase as any).from('noir_driver_documents').select('*').eq('driver_id', driverId).order('uploaded_at', { ascending: false }),
      (supabase as any).from('noir_driver_status_history').select('*').eq('driver_id', driverId).order('changed_at', { ascending: false }),
    ]);
    setDriver(d.data);
    setAdminNotes(d.data?.admin_notes || '');
    setDocuments(docs.data || []);
    setHistory(hist.data || []);
    setLoading(false);
  };

  const handleStatus = async (status: DriverApplicationStatus, reason?: string) => {
    if (!driverId) return;
    try {
      await adminUpdateDriverStatus(driverId, status, reason, adminNotes);
      toast.success(`Status changed to ${status.replace('_', ' ')}`);
      setShowReject(false); setRejectReason('');
      load(); onChanged();
    } catch (e: any) { toast.error(e.message); }
  };

  const handleDocReview = async (docId: string, status: 'approved' | 'rejected') => {
    try {
      await reviewDocument(docId, status, status === 'rejected' ? 'Please re-upload a clearer copy' : undefined);
      toast.success(`Document ${status}`);
      load();
    } catch (e: any) { toast.error(e.message); }
  };

  const openDoc = async (doc: any) => {
    const url = doc.file_path ? await getSignedDocUrl(doc.file_path) : doc.file_url;
    if (url) window.open(url, '_blank');
  };

  if (!driver && !loading) return null;

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent className="bg-slate-900 border-white/10 text-white w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-white flex items-center gap-2">
            Driver Application
            {driver && <Badge className={STATUS_COLORS[driver.application_status as DriverApplicationStatus]}>
              {driver.application_status?.replace('_', ' ')}
            </Badge>}
          </SheetTitle>
        </SheetHeader>

        {loading || !driver ? (
          <div className="flex items-center justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-mansagold" /></div>
        ) : (
          <div className="space-y-6 mt-4">
            {/* Personal */}
            <Section title="Personal">
              <Row k="Name" v={driver.full_name} />
              <Row k="Email" v={driver.email} />
              <Row k="Phone" v={driver.phone} />
              <Row k="DOB" v={driver.date_of_birth} />
              <Row k="Address" v={[driver.address_line1, driver.address_city, driver.address_state, driver.address_zip].filter(Boolean).join(', ')} />
            </Section>

            <Section title="License">
              <Row k="Number" v={driver.drivers_license_number} />
              <Row k="State" v={driver.drivers_license_state} />
              <Row k="Expires" v={driver.drivers_license_expires_at} warn={isExpiringSoon(driver.drivers_license_expires_at)} />
            </Section>

            <Section title="Vehicle">
              <Row k="Vehicle" v={[driver.vehicle_year, driver.vehicle_color, driver.vehicle_make, driver.vehicle_model].filter(Boolean).join(' ')} />
              <Row k="VIN" v={driver.vehicle_vin} />
              <Row k="Plate" v={driver.license_plate} />
              <Row k="Registration Expires" v={driver.vehicle_registration_expires_at} warn={isExpiringSoon(driver.vehicle_registration_expires_at)} />
            </Section>

            <Section title="Insurance">
              <Row k="Policy #" v={driver.insurance_policy_number} />
              <Row k="Expires" v={driver.insurance_expires_at} warn={isExpiringSoon(driver.insurance_expires_at)} />
            </Section>

            {/* Documents */}
            <Section title={`Documents (${documents.length})`}>
              {documents.length === 0 ? (
                <div className="text-white/40 text-sm">No documents uploaded yet.</div>
              ) : documents.map(doc => (
                <div key={doc.id} className="flex items-center justify-between gap-2 py-2 border-b border-white/5">
                  <div className="min-w-0">
                    <div className="text-sm text-white">{DOCUMENT_LABELS[doc.document_type as keyof typeof DOCUMENT_LABELS] || doc.document_type}</div>
                    <div className="text-xs text-white/50">{new Date(doc.uploaded_at).toLocaleDateString()}</div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Badge variant="outline" className={
                      doc.review_status === 'approved' ? 'bg-green-500/20 text-green-300 border-green-500/30' :
                      doc.review_status === 'rejected' ? 'bg-red-500/20 text-red-300 border-red-500/30' :
                      'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
                    }>{doc.review_status}</Badge>
                    <Button size="sm" variant="ghost" onClick={() => openDoc(doc)} className="h-7 w-7 p-0"><ExternalLink className="h-3 w-3" /></Button>
                    <Button size="sm" variant="ghost" onClick={() => handleDocReview(doc.id, 'approved')} className="h-7 w-7 p-0 text-green-300"><CheckCircle2 className="h-3 w-3" /></Button>
                    <Button size="sm" variant="ghost" onClick={() => handleDocReview(doc.id, 'rejected')} className="h-7 w-7 p-0 text-red-300"><X className="h-3 w-3" /></Button>
                  </div>
                </div>
              ))}
            </Section>

            {/* Admin notes */}
            <Section title="Admin Notes">
              <Textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Internal notes (only visible to admins)"
                className="bg-white/5 border-white/10 text-white"
                rows={3}
              />
            </Section>

            {/* Status history */}
            <Section title="Status History">
              {history.length === 0 ? (
                <div className="text-white/40 text-sm">No status changes yet.</div>
              ) : history.map((h: any) => (
                <div key={h.id} className="text-xs text-white/60 py-1 border-b border-white/5">
                  <span className="text-white">{h.from_status || '—'} → {h.to_status}</span>
                  <span className="text-white/40 ml-2">{new Date(h.changed_at).toLocaleString()}</span>
                  {h.reason && <div className="text-white/50 mt-0.5">{h.reason}</div>}
                </div>
              ))}
            </Section>

            {/* Reject form */}
            {showReject && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 space-y-2">
                <div className="text-sm text-white font-medium">Reject application — choose a reason</div>
                <div className="space-y-1">
                  {REJECTION_REASONS.map(r => (
                    <button key={r} onClick={() => setRejectReason(r)}
                      className={`block w-full text-left text-xs px-2 py-1 rounded ${rejectReason === r ? 'bg-red-500/30 text-white' : 'text-white/60 hover:bg-white/5'}`}>
                      {r}
                    </button>
                  ))}
                </div>
                <Textarea value={rejectReason} onChange={e => setRejectReason(e.target.value)} placeholder="Or write a custom reason..." className="bg-white/5 border-white/10 text-white text-sm" rows={2} />
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost" onClick={() => setShowReject(false)}>Cancel</Button>
                  <Button size="sm" className="bg-red-500 hover:bg-red-600 text-white" onClick={() => handleStatus('rejected', rejectReason)} disabled={!rejectReason}>Reject</Button>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="grid grid-cols-2 gap-2 sticky bottom-0 bg-slate-900 pt-2 pb-1">
              {driver.application_status !== 'under_review' && driver.application_status !== 'approved' && (
                <Button variant="outline" onClick={() => handleStatus('under_review')} className="text-blue-300">
                  <RefreshCw className="h-4 w-4 mr-1" /> Mark Under Review
                </Button>
              )}
              {driver.application_status !== 'approved' && (
                <Button onClick={() => handleStatus('approved')} className="bg-green-500 hover:bg-green-600 text-white">
                  <ShieldCheck className="h-4 w-4 mr-1" /> Approve
                </Button>
              )}
              {driver.application_status !== 'rejected' && (
                <Button variant="outline" onClick={() => setShowReject(true)} className="text-red-300">
                  <X className="h-4 w-4 mr-1" /> Reject
                </Button>
              )}
              {driver.application_status === 'approved' && (
                <Button variant="outline" onClick={() => handleStatus('suspended', 'Admin suspended')} className="text-orange-300">
                  <Ban className="h-4 w-4 mr-1" /> Suspend
                </Button>
              )}
              {driver.application_status === 'suspended' && (
                <Button onClick={() => handleStatus('approved')} className="bg-green-500 hover:bg-green-600 text-white">
                  <CheckCircle2 className="h-4 w-4 mr-1" /> Reactivate
                </Button>
              )}
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="space-y-2">
    <div className="text-mansagold text-xs uppercase tracking-wide font-semibold">{title}</div>
    <div className="space-y-1">{children}</div>
  </div>
);

const Row: React.FC<{ k: string; v: any; warn?: boolean }> = ({ k, v, warn }) => (
  <div className="flex justify-between text-sm py-1 border-b border-white/5">
    <span className="text-white/50">{k}</span>
    <span className={`text-right ${warn ? 'text-orange-300 font-semibold' : 'text-white'}`}>
      {v || '—'} {warn && '⚠'}
    </span>
  </div>
);

const isExpiringSoon = (date: string | null) => {
  if (!date) return false;
  const d = new Date(date).getTime();
  const now = Date.now();
  return d < now + 30 * 24 * 60 * 60 * 1000;
};

export default DriverDetailDrawer;
