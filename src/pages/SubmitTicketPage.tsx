import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Ticket, Send, ArrowLeft, HelpCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

const CATEGORIES = [
  { value: 'general', label: 'General Inquiry' },
  { value: 'technical', label: 'Technical Issue' },
  { value: 'billing', label: 'Billing Question' },
  { value: 'account', label: 'Account Help' },
  { value: 'feature', label: 'Feature Request' },
  { value: 'bug', label: 'Bug Report' }
];

const PRIORITIES = [
  { value: 'low', label: 'Low - General question' },
  { value: 'medium', label: 'Medium - Some impact' },
  { value: 'high', label: 'High - Significant issue' },
  { value: 'urgent', label: 'Urgent - Critical problem' }
];

export default function SubmitTicketPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    subject: '',
    description: '',
    category: 'general',
    priority: 'medium'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please log in to submit a ticket');
      navigate('/login');
      return;
    }

    if (!formData.subject.trim() || !formData.description.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      // Generate ticket number
      const ticketNumber = `TKT-${Date.now().toString(36).toUpperCase()}`;

      const { error } = await supabase
        .from('support_tickets')
        .insert({
          user_id: user.id,
          ticket_number: ticketNumber,
          subject: formData.subject,
          description: formData.description,
          category: formData.category,
          priority: formData.priority,
          status: 'open'
        });

      if (error) throw error;

      toast.success('Ticket submitted successfully! We\'ll get back to you soon.');
      navigate('/my-tickets');
    } catch (error: any) {
      console.error('Error submitting ticket:', error);
      toast.error('Failed to submit ticket: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/30 rounded-full blur-3xl animate-float" />
      <div className="absolute top-40 right-20 w-96 h-96 bg-yellow-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />

      <div className="container mx-auto p-6 max-w-2xl relative z-10">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="text-white hover:bg-white/10 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <Card className="bg-white/5 border-white/10">
          <CardHeader className="border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-yellow-500/20 rounded-lg">
                <Ticket className="h-6 w-6 text-yellow-400" />
              </div>
              <div>
                <CardTitle className="text-white">Submit a Support Ticket</CardTitle>
                <CardDescription className="text-blue-200/70">
                  Describe your issue and we'll help you resolve it
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="mb-6 p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <div className="flex items-start gap-3">
                <HelpCircle className="h-5 w-5 text-blue-400 mt-0.5" />
                <div>
                  <p className="text-sm text-blue-200">
                    Before submitting a ticket, check our{' '}
                    <Link to="/knowledge-base" className="text-yellow-400 hover:underline">
                      Knowledge Base
                    </Link>
                    {' '}for quick answers to common questions.
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label className="text-white">Subject *</Label>
                <Input
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="Brief summary of your issue"
                  className="bg-white/5 border-white/20 text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-white">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger className="bg-white/5 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Priority</Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value) => setFormData({ ...formData, priority: value })}
                  >
                    <SelectTrigger className="bg-white/5 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PRIORITIES.map((p) => (
                        <SelectItem key={p.value} value={p.value}>
                          {p.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-white">Description *</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Please describe your issue in detail. Include any relevant information like error messages, steps to reproduce, etc."
                  className="bg-white/5 border-white/20 text-white min-h-[150px]"
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-slate-900 font-semibold h-12"
              >
                {isSubmitting ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-slate-900" />
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Submit Ticket
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
