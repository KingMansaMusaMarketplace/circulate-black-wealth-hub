import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Lock, CheckCircle } from 'lucide-react';
import { z } from 'zod';

const requestSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  company: z.string().optional(),
  role: z.string().optional(),
  reason: z.string().min(20, 'Please provide more detail about why you need access (at least 20 characters)'),
});

type DocumentType = 'partnership_guide' | 'investor_analysis';

interface AccessRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentType: DocumentType;
}

const documentInfo: Record<DocumentType, { title: string; description: string }> = {
  partnership_guide: {
    title: 'Partnership Guide',
    description: 'Contains detailed partnership opportunities, pricing structures, and strategic collaboration frameworks.',
  },
  investor_analysis: {
    title: 'Investor Analysis',
    description: 'Includes financial projections, market analysis, and investment opportunity details.',
  },
};

export function AccessRequestModal({ isOpen, onClose, documentType }: AccessRequestModalProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    company: '',
    role: '',
    reason: '',
  });

  const info = documentInfo[documentType];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validate form
    const result = requestSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach(err => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.functions.invoke('send-media-kit-request', {
        body: {
          ...formData,
          documentType,
        },
      });

      if (error) throw error;

      if (data.success) {
        setIsSubmitted(true);
        toast({
          title: "Request Submitted",
          description: "We'll review your request and get back to you within 1-2 business days.",
        });
      } else {
        throw new Error(data.error || 'Failed to submit request');
      }
    } catch (error: any) {
      console.error('Error submitting request:', error);
      toast({
        title: "Submission Failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({ fullName: '', email: '', company: '', role: '', reason: '' });
    setErrors({});
    setIsSubmitted(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] bg-slate-900 border-mansagold/30 text-white">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-mansagold/20 flex items-center justify-center">
              <Lock className="w-5 h-5 text-mansagold" />
            </div>
            <div>
              <DialogTitle className="text-xl text-white">Request Access</DialogTitle>
              <DialogDescription className="text-slate-400">
                {info.title}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {isSubmitted ? (
          <div className="py-8 text-center">
            <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Request Submitted!</h3>
            <p className="text-slate-400 mb-6">
              We'll review your request and email you within 1-2 business days.
            </p>
            <Button onClick={handleClose} className="bg-mansagold hover:bg-mansagold/90 text-black">
              Close
            </Button>
          </div>
        ) : (
          <>
            <p className="text-sm text-slate-400 mb-4">
              {info.description}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-white">Full Name *</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="John Smith"
                    className="bg-white/10 border-white/20 text-white placeholder:text-slate-500"
                    disabled={isSubmitting}
                  />
                  {errors.fullName && <p className="text-red-400 text-xs">{errors.fullName}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white">Email *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@company.com"
                    className="bg-white/10 border-white/20 text-white placeholder:text-slate-500"
                    disabled={isSubmitting}
                  />
                  {errors.email && <p className="text-red-400 text-xs">{errors.email}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company" className="text-white">Company</Label>
                  <Input
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="Company name"
                    className="bg-white/10 border-white/20 text-white placeholder:text-slate-500"
                    disabled={isSubmitting}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role" className="text-white">Role / Title</Label>
                  <Input
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    placeholder="Marketing Director"
                    className="bg-white/10 border-white/20 text-white placeholder:text-slate-500"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reason" className="text-white">Why do you need access? *</Label>
                <Textarea
                  id="reason"
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  placeholder="Please describe your interest and how you plan to use this information..."
                  className="bg-white/10 border-white/20 text-white placeholder:text-slate-500 min-h-[100px]"
                  disabled={isSubmitting}
                />
                {errors.reason && <p className="text-red-400 text-xs">{errors.reason}</p>}
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleClose}
                  className="border-white/20 text-white hover:bg-white/10"
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="bg-mansagold hover:bg-mansagold/90 text-black font-semibold"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Request'
                  )}
                </Button>
              </div>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
