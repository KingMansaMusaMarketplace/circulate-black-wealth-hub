import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/auth';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Car, ShieldCheck, Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import DocumentUploader from '@/components/noir/driver-apply/DocumentUploader';
import {
  REQUIRED_DOCUMENTS, STATUS_COLORS, DriverApplicationStatus,
} from '@/lib/api/noir-driver-api';

const DriverApplyPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [driver, setDriver] = useState<any>(null);
  const [documents, setDocuments] = useState<any[]>([]);
  const [form, setForm] = useState<any>({
    full_name: '', phone: '', email: '',
    date_of_birth: '', address_line1: '', address_city: '',
    address_state: '', address_zip: '',
    drivers_license_number: '', drivers_license_state: '', drivers_license_expires_at: '',
    vehicle_make: '', vehicle_model: '', vehicle_year: '', vehicle_color: '',
    vehicle_vin: '', license_plate: '',
    vehicle_registration_expires_at: '',
    insurance_policy_number: '', insurance_expires_at: '',
    agreement: false,
  });

  useEffect(() => {
    if (!user) { navigate('/login?redirect=/noir/drive/apply'); return; }
    loadDriver();
  }, [user]);

  const loadDriver = async () => {
    if (!user) return;
    setLoading(true);
    const { data: d } = await (supabase as any)
      .from('noir_drivers')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (d) {
      setDriver(d);
      setForm((f: any) => ({
        ...f,
        ...Object.fromEntries(Object.entries(d).filter(([, v]) => v !== null && v !== undefined)),
        agreement: !!d.agreement_accepted_at,
      }));
      const { data: docs } = await (supabase as any)
        .from('noir_driver_documents')
        .select('*')
        .eq('driver_id', d.id)
        .order('uploaded_at', { ascending: false });
      setDocuments(docs || []);
    } else {
      setForm((f: any) => ({ ...f, email: user.email || '', full_name: user.user_metadata?.full_name || '' }));
    }
    setLoading(false);
  };

  const upsertDriver = async () => {
    if (!user) return null;
    const payload = {
      user_id: user.id,
      full_name: form.full_name,
      phone: form.phone || null,
      email: form.email || null,
      date_of_birth: form.date_of_birth || null,
      address_line1: form.address_line1 || null,
      address_city: form.address_city || null,
      address_state: form.address_state || null,
      address_zip: form.address_zip || null,
      drivers_license_number: form.drivers_license_number || null,
      drivers_license_state: form.drivers_license_state || null,
      drivers_license_expires_at: form.drivers_license_expires_at || null,
      vehicle_make: form.vehicle_make || null,
      vehicle_model: form.vehicle_model || null,
      vehicle_year: form.vehicle_year ? Number(form.vehicle_year) : null,
      vehicle_color: form.vehicle_color || null,
      vehicle_vin: form.vehicle_vin || null,
      license_plate: form.license_plate || null,
      vehicle_registration_expires_at: form.vehicle_registration_expires_at || null,
      insurance_policy_number: form.insurance_policy_number || null,
      insurance_expires_at: form.insurance_expires_at || null,
    };

    if (driver) {
      const { data, error } = await (supabase as any)
        .from('noir_drivers')
        .update(payload)
        .eq('id', driver.id)
        .select()
        .single();
      if (error) throw error;
      return data;
    } else {
      const { data, error } = await (supabase as any)
        .from('noir_drivers')
        .insert(payload)
        .select()
        .single();
      if (error) throw error;
      return data;
    }
  };

  const saveProgress = async () => {
    setSaving(true);
    try {
      const d = await upsertDriver();
      setDriver(d);
      toast.success('Saved. You can come back anytime to finish.');
    } catch (e: any) {
      toast.error(e.message);
    } finally { setSaving(false); }
  };

  const submitApplication = async () => {
    if (!form.agreement) { toast.error('Please accept the driver agreement first.'); return; }
    const required = ['full_name', 'phone', 'date_of_birth', 'address_line1', 'address_city',
      'address_state', 'address_zip', 'drivers_license_number', 'drivers_license_state',
      'drivers_license_expires_at', 'vehicle_make', 'vehicle_model', 'vehicle_year',
      'vehicle_vin', 'license_plate', 'insurance_policy_number', 'insurance_expires_at',
      'vehicle_registration_expires_at'];
    const missing = required.filter(k => !form[k]);
    if (missing.length) { toast.error(`Please fill in all required fields (${missing.length} missing).`); return; }
    const docTypes = new Set(documents.map(d => d.document_type));
    const missingDocs = REQUIRED_DOCUMENTS.filter(t => !docTypes.has(t));
    if (missingDocs.length) { toast.error(`Please upload all required documents (${missingDocs.length} missing).`); return; }

    setSaving(true);
    try {
      const d = await upsertDriver();
      const { error } = await (supabase as any)
        .from('noir_drivers')
        .update({
          application_status: 'submitted',
          submitted_at: new Date().toISOString(),
          agreement_accepted_at: new Date().toISOString(),
        })
        .eq('id', d.id);
      if (error) throw error;
      toast.success('Application submitted! Our team will review within 3–5 business days.');
      loadDriver();
    } catch (e: any) {
      toast.error(e.message);
    } finally { setSaving(false); }
  };

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-mansagold" />
    </div>
  );

  const status: DriverApplicationStatus = driver?.application_status || 'draft';
  const isLocked = ['submitted', 'under_review', 'approved'].includes(status);
  const docByType: Record<string, any> = Object.fromEntries(documents.map(d => [d.document_type, d]));

  return (
    <div className="min-h-screen bg-black text-white">
      <Helmet>
        <title>Become a Noire Driver — Apply Now | 1325.AI</title>
        <meta name="description" content="Apply to drive with Noire Rideshare. Upload your documents and start earning with the community." />
      </Helmet>

      <div className="max-w-3xl mx-auto px-4 py-12 space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-mansagold/10 border border-mansagold/30">
            <Car className="h-4 w-4 text-mansagold" />
            <span className="text-mansagold text-sm font-medium">Noire Rideshare</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold">Become a Driver</h1>
          <p className="text-white/60">Join the community-owned rideshare. Apply once, drive whenever you want.</p>
        </div>

        {driver && (
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-5 w-5 text-mansagold" />
                <div>
                  <div className="text-sm text-white/60">Application status</div>
                  <Badge className={STATUS_COLORS[status]}>{status.replace('_', ' ')}</Badge>
                </div>
              </div>
              {driver.rejection_reason && status === 'rejected' && (
                <div className="text-right max-w-sm">
                  <div className="text-xs text-red-300 font-medium flex items-center gap-1 justify-end">
                    <AlertCircle className="h-3 w-3" /> Reason
                  </div>
                  <div className="text-xs text-white/70 mt-1">{driver.rejection_reason}</div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {status === 'approved' && (
          <Card className="bg-green-500/10 border-green-500/30">
            <CardContent className="p-6 text-center space-y-2">
              <CheckIcon /> 
              <h3 className="text-xl font-bold text-green-300">You're approved!</h3>
              <p className="text-white/70 text-sm">Head to the driver dashboard to go online and start accepting rides.</p>
              <Button onClick={() => navigate('/noir')} className="bg-mansagold text-slate-900 hover:bg-mansagold/90 mt-2">
                Open Driver Dashboard
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Personal info */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader><CardTitle className="text-white text-lg">1. Personal Information</CardTitle></CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-4">
            <Field label="Full Legal Name *" v={form.full_name} onChange={v => setForm({ ...form, full_name: v })} disabled={isLocked} />
            <Field label="Phone *" v={form.phone} onChange={v => setForm({ ...form, phone: v })} disabled={isLocked} />
            <Field label="Email" v={form.email} onChange={v => setForm({ ...form, email: v })} disabled />
            <Field label="Date of Birth *" type="date" v={form.date_of_birth} onChange={v => setForm({ ...form, date_of_birth: v })} disabled={isLocked} />
            <Field label="Street Address *" v={form.address_line1} onChange={v => setForm({ ...form, address_line1: v })} disabled={isLocked} className="md:col-span-2" />
            <Field label="City *" v={form.address_city} onChange={v => setForm({ ...form, address_city: v })} disabled={isLocked} />
            <Field label="State *" v={form.address_state} onChange={v => setForm({ ...form, address_state: v })} disabled={isLocked} />
            <Field label="ZIP *" v={form.address_zip} onChange={v => setForm({ ...form, address_zip: v })} disabled={isLocked} />
          </CardContent>
        </Card>

        {/* License */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white text-lg">2. Driver's License</CardTitle>
            <CardDescription>Must be valid and not expired.</CardDescription>
          </CardHeader>
          <CardContent className="grid md:grid-cols-3 gap-4">
            <Field label="License Number *" v={form.drivers_license_number} onChange={v => setForm({ ...form, drivers_license_number: v })} disabled={isLocked} />
            <Field label="State *" v={form.drivers_license_state} onChange={v => setForm({ ...form, drivers_license_state: v })} disabled={isLocked} />
            <Field label="Expires *" type="date" v={form.drivers_license_expires_at} onChange={v => setForm({ ...form, drivers_license_expires_at: v })} disabled={isLocked} />
          </CardContent>
        </Card>

        {/* Vehicle */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white text-lg">3. Vehicle</CardTitle>
            <CardDescription>Vehicle must be 10 years old or newer with 4 doors.</CardDescription>
          </CardHeader>
          <CardContent className="grid md:grid-cols-3 gap-4">
            <Field label="Make *" v={form.vehicle_make} onChange={v => setForm({ ...form, vehicle_make: v })} disabled={isLocked} />
            <Field label="Model *" v={form.vehicle_model} onChange={v => setForm({ ...form, vehicle_model: v })} disabled={isLocked} />
            <Field label="Year *" type="number" v={form.vehicle_year} onChange={v => setForm({ ...form, vehicle_year: v })} disabled={isLocked} />
            <Field label="Color" v={form.vehicle_color} onChange={v => setForm({ ...form, vehicle_color: v })} disabled={isLocked} />
            <Field label="VIN *" v={form.vehicle_vin} onChange={v => setForm({ ...form, vehicle_vin: v })} disabled={isLocked} />
            <Field label="License Plate *" v={form.license_plate} onChange={v => setForm({ ...form, license_plate: v })} disabled={isLocked} />
            <Field label="Registration Expires *" type="date" v={form.vehicle_registration_expires_at} onChange={v => setForm({ ...form, vehicle_registration_expires_at: v })} disabled={isLocked} />
          </CardContent>
        </Card>

        {/* Insurance */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white text-lg">4. Insurance</CardTitle>
            <CardDescription>Must include rideshare or commercial coverage.</CardDescription>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-4">
            <Field label="Policy Number *" v={form.insurance_policy_number} onChange={v => setForm({ ...form, insurance_policy_number: v })} disabled={isLocked} />
            <Field label="Expires *" type="date" v={form.insurance_expires_at} onChange={v => setForm({ ...form, insurance_expires_at: v })} disabled={isLocked} />
          </CardContent>
        </Card>

        {/* Documents */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white text-lg">5. Documents</CardTitle>
            <CardDescription>Photos or PDFs, max 10MB each. Clear and unedited.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {!driver ? (
              <div className="text-center py-8 text-white/50 text-sm">
                Save your information above first, then come back to upload documents.
              </div>
            ) : REQUIRED_DOCUMENTS.map(type => (
              <DocumentUploader
                key={type}
                userId={user!.id}
                driverId={driver.id}
                documentType={type}
                existingUrl={docByType[type]?.file_url}
                reviewStatus={docByType[type]?.review_status}
                onUploaded={loadDriver}
              />
            ))}
          </CardContent>
        </Card>

        {/* Agreement & submit */}
        {!isLocked && (
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-start gap-3">
                <Checkbox
                  id="agree"
                  checked={form.agreement}
                  onCheckedChange={(v) => setForm({ ...form, agreement: !!v })}
                />
                <Label htmlFor="agree" className="text-sm text-white/80 leading-relaxed cursor-pointer">
                  I confirm all information is accurate, I authorize a background and driving-record check,
                  and I agree to the Noire Rideshare driver terms and community standards.
                </Label>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button variant="outline" onClick={saveProgress} disabled={saving} className="flex-1">
                  {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Save Progress
                </Button>
                <Button
                  onClick={submitApplication}
                  disabled={saving || !driver}
                  className="flex-1 bg-mansagold text-slate-900 hover:bg-mansagold/90"
                >
                  Submit Application
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

const Field: React.FC<{ label: string; v: any; onChange: (v: string) => void; type?: string; disabled?: boolean; className?: string; }> = ({ label, v, onChange, type = 'text', disabled, className }) => (
  <div className={className}>
    <Label className="text-white/70 text-xs">{label}</Label>
    <Input
      type={type}
      value={v ?? ''}
      onChange={e => onChange(e.target.value)}
      disabled={disabled}
      className="bg-white/5 border-white/10 text-white mt-1"
    />
  </div>
);

const CheckIcon = () => (
  <div className="mx-auto w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
    <ShieldCheck className="h-6 w-6 text-green-300" />
  </div>
);

export default DriverApplyPage;
