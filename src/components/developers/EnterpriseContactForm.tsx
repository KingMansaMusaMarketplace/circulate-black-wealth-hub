import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Building2, Mail, Phone, Calendar, Check, Loader2, MessageSquare, Users, Globe } from 'lucide-react';
import { toast } from 'sonner';
import { z } from 'zod';

const enterpriseFormSchema = z.object({
  companyName: z.string().min(2, 'Company name is required'),
  contactName: z.string().min(2, 'Contact name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().optional(),
  companySize: z.string().min(1, 'Please select company size'),
  estimatedVolume: z.string().min(1, 'Please select estimated API volume'),
  primaryUseCase: z.string().min(10, 'Please describe your use case'),
  apisInterested: z.array(z.string()).min(1, 'Please select at least one API'),
});

type EnterpriseFormData = z.infer<typeof enterpriseFormSchema>;

const EnterpriseContactForm: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedApis, setSelectedApis] = useState<string[]>([]);
  const [formData, setFormData] = useState<Partial<EnterpriseFormData>>({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    companySize: '',
    estimatedVolume: '',
    primaryUseCase: '',
    apisInterested: [],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const apis = [
    { id: 'cmal', name: 'CMAL Engine', description: 'Economic impact calculations' },
    { id: 'voice', name: 'Voice AI Bridge', description: 'Real-time voice AI' },
    { id: 'susu', name: 'Susu Protocol', description: 'ROSCA savings circles' },
    { id: 'fraud', name: 'Fraud Detection', description: 'Security & fraud prevention' },
  ];

  const companySizes = [
    { value: '1-10', label: '1-10 employees' },
    { value: '11-50', label: '11-50 employees' },
    { value: '51-200', label: '51-200 employees' },
    { value: '201-500', label: '201-500 employees' },
    { value: '500+', label: '500+ employees' },
  ];

  const volumeOptions = [
    { value: '100k-500k', label: '100K - 500K calls/month' },
    { value: '500k-1m', label: '500K - 1M calls/month' },
    { value: '1m-5m', label: '1M - 5M calls/month' },
    { value: '5m+', label: '5M+ calls/month' },
  ];

  const toggleApi = (apiId: string) => {
    setSelectedApis((prev) =>
      prev.includes(apiId) ? prev.filter((id) => id !== apiId) : [...prev, apiId]
    );
    setFormData((prev) => ({
      ...prev,
      apisInterested: selectedApis.includes(apiId)
        ? selectedApis.filter((id) => id !== apiId)
        : [...selectedApis, apiId],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const dataToValidate = {
      ...formData,
      apisInterested: selectedApis,
    };

    const result = enterpriseFormSchema.safeParse(dataToValidate);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0].toString()] = err.message;
        }
      });
      setErrors(fieldErrors);
      toast.error('Please fix the errors in the form');
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSubmitted(true);
    toast.success('Your enterprise inquiry has been submitted!');
  };

  if (isSubmitted) {
    return (
      <Card className="glass-card border-mansagold/30 bg-gradient-to-br from-mansagold/5 to-transparent">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4 border border-emerald-500/30">
            <Check className="h-8 w-8 text-emerald-400" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">Thank You!</h3>
          <p className="text-white/70 mb-6">
            Our enterprise team will reach out within 24 hours to discuss your needs.
          </p>
          <div className="bg-slate-900/50 rounded-lg p-4 border border-white/10">
            <p className="text-white/60 text-sm">
              In the meantime, feel free to explore our{' '}
              <a href="/developers/docs" className="text-mansablue hover:underline">
                API documentation
              </a>{' '}
              or try the{' '}
              <a href="/developers/docs" className="text-mansablue hover:underline">
                interactive playground
              </a>
              .
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card border-mansagold/30 bg-gradient-to-br from-mansagold/5 to-transparent">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-mansagold/20 rounded-lg border border-mansagold/30">
            <Building2 className="h-6 w-6 text-mansagold" />
          </div>
          <div>
            <CardTitle className="text-white text-xl">Enterprise Inquiry</CardTitle>
            <CardDescription className="text-white/60">
              Let's discuss custom solutions for your organization
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Company & Contact Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="companyName" className="text-white/80">
                Company Name *
              </Label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                <Input
                  id="companyName"
                  value={formData.companyName}
                  onChange={(e) => setFormData((prev) => ({ ...prev, companyName: e.target.value }))}
                  className="bg-slate-900/80 border-white/20 text-white pl-10"
                  placeholder="Acme Corporation"
                />
              </div>
              {errors.companyName && <p className="text-red-400 text-xs">{errors.companyName}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactName" className="text-white/80">
                Your Name *
              </Label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                <Input
                  id="contactName"
                  value={formData.contactName}
                  onChange={(e) => setFormData((prev) => ({ ...prev, contactName: e.target.value }))}
                  className="bg-slate-900/80 border-white/20 text-white pl-10"
                  placeholder="John Smith"
                />
              </div>
              {errors.contactName && <p className="text-red-400 text-xs">{errors.contactName}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-white/80">
                Work Email *
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                  className="bg-slate-900/80 border-white/20 text-white pl-10"
                  placeholder="john@company.com"
                />
              </div>
              {errors.email && <p className="text-red-400 text-xs">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-white/80">
                Phone (Optional)
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                  className="bg-slate-900/80 border-white/20 text-white pl-10"
                  placeholder="+1 (555) 000-0000"
                />
              </div>
            </div>
          </div>

          {/* Company Size & Volume */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-white/80">Company Size *</Label>
              <Select
                value={formData.companySize}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, companySize: value }))}
              >
                <SelectTrigger className="bg-slate-900/80 border-white/20 text-white">
                  <SelectValue placeholder="Select company size" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-white/20">
                  {companySizes.map((size) => (
                    <SelectItem key={size.value} value={size.value} className="text-white hover:bg-white/10">
                      {size.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.companySize && <p className="text-red-400 text-xs">{errors.companySize}</p>}
            </div>

            <div className="space-y-2">
              <Label className="text-white/80">Estimated Monthly API Volume *</Label>
              <Select
                value={formData.estimatedVolume}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, estimatedVolume: value }))}
              >
                <SelectTrigger className="bg-slate-900/80 border-white/20 text-white">
                  <SelectValue placeholder="Select expected volume" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-white/20">
                  {volumeOptions.map((vol) => (
                    <SelectItem key={vol.value} value={vol.value} className="text-white hover:bg-white/10">
                      {vol.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.estimatedVolume && <p className="text-red-400 text-xs">{errors.estimatedVolume}</p>}
            </div>
          </div>

          {/* APIs Interested */}
          <div className="space-y-3">
            <Label className="text-white/80">Which APIs are you interested in? *</Label>
            <div className="grid grid-cols-2 gap-3">
              {apis.map((api) => (
                <button
                  key={api.id}
                  type="button"
                  onClick={() => toggleApi(api.id)}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    selectedApis.includes(api.id)
                      ? 'bg-mansablue/20 border-mansablue text-white'
                      : 'bg-slate-900/50 border-white/10 text-white/70 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">{api.name}</span>
                    {selectedApis.includes(api.id) && <Check className="h-4 w-4 text-mansablue" />}
                  </div>
                  <p className="text-xs text-white/50 mt-1">{api.description}</p>
                </button>
              ))}
            </div>
            {errors.apisInterested && <p className="text-red-400 text-xs">{errors.apisInterested}</p>}
          </div>

          {/* Use Case */}
          <div className="space-y-2">
            <Label htmlFor="primaryUseCase" className="text-white/80">
              Tell us about your use case *
            </Label>
            <div className="relative">
              <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-white/40" />
              <Textarea
                id="primaryUseCase"
                value={formData.primaryUseCase}
                onChange={(e) => setFormData((prev) => ({ ...prev, primaryUseCase: e.target.value }))}
                className="bg-slate-900/80 border-white/20 text-white pl-10 min-h-[100px] resize-none"
                placeholder="Describe your platform, expected use cases, and any specific requirements..."
              />
            </div>
            {errors.primaryUseCase && <p className="text-red-400 text-xs">{errors.primaryUseCase}</p>}
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-mansagold hover:bg-mansagold-dark text-mansablue-dark font-bold"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Calendar className="h-4 w-4 mr-2" />
                Request Enterprise Demo
              </>
            )}
          </Button>

          <p className="text-white/40 text-xs text-center">
            By submitting, you agree to our Terms of Service and Privacy Policy.
            <br />
            We typically respond within 24 business hours.
          </p>
        </form>
      </CardContent>
    </Card>
  );
};

export default EnterpriseContactForm;
