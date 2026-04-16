import React, { useState } from 'react';
import { Sparkles, Loader2, Trash2, Plus, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface FAQEntry {
  question: string;
  answer: string;
}

interface AIFAQGeneratorProps {
  businessId: string;
  existingFaqs?: FAQEntry[];
  onSave: (faqs: FAQEntry[]) => void;
}

const AIFAQGenerator: React.FC<AIFAQGeneratorProps> = ({ businessId, existingFaqs = [], onSave }) => {
  const [faqs, setFaqs] = useState<FAQEntry[]>(existingFaqs);
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const generateFAQs = async () => {
    setGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-faq-generator', {
        body: { business_id: businessId },
      });

      if (error) throw error;

      if (data?.faqs && Array.isArray(data.faqs)) {
        setFaqs(data.faqs);
        toast({ title: 'FAQs Generated', description: `${data.faqs.length} FAQ entries created. Review and save them.` });
      } else {
        toast({ title: 'No FAQs Generated', description: 'Could not generate FAQs. Try again later.', variant: 'destructive' });
      }
    } catch (e: any) {
      console.error('FAQ generation error:', e);
      const msg = e?.message || 'Failed to generate FAQs';
      toast({ title: 'Error', description: msg, variant: 'destructive' });
    } finally {
      setGenerating(false);
    }
  };

  const updateFaq = (index: number, field: 'question' | 'answer', value: string) => {
    setFaqs(prev => prev.map((f, i) => (i === index ? { ...f, [field]: value } : f)));
  };

  const removeFaq = (index: number) => {
    setFaqs(prev => prev.filter((_, i) => i !== index));
  };

  const addFaq = () => {
    setFaqs(prev => [...prev, { question: '', answer: '' }]);
  };

  const handleSave = async () => {
    const validFaqs = faqs.filter(f => f.question.trim() && f.answer.trim());
    if (validFaqs.length === 0) {
      toast({ title: 'No valid FAQs', description: 'Add at least one FAQ with both question and answer.', variant: 'destructive' });
      return;
    }
    setSaving(true);
    try {
      onSave(validFaqs);
      toast({ title: 'FAQs Saved', description: `${validFaqs.length} FAQ entries saved successfully.` });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-foreground">AI FAQ Generator</h3>
        </div>
        <Button onClick={generateFAQs} disabled={generating} variant="outline" size="sm">
          {generating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Sparkles className="h-4 w-4 mr-2" />}
          {generating ? 'Generating...' : faqs.length > 0 ? 'Regenerate' : 'Generate FAQs'}
        </Button>
      </div>

      {faqs.length === 0 && !generating && (
        <p className="text-sm text-muted-foreground py-4 text-center">
          Click "Generate FAQs" to create FAQ entries from your business info and customer reviews.
        </p>
      )}

      {faqs.length > 0 && (
        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div key={index} className="p-3 rounded-lg border bg-card space-y-2">
              <div className="flex items-start gap-2">
                <span className="text-xs font-bold text-muted-foreground mt-2.5 shrink-0">Q{index + 1}</span>
                <Input
                  value={faq.question}
                  onChange={(e) => updateFaq(index, 'question', e.target.value)}
                  placeholder="Question..."
                  className="text-sm font-medium"
                />
                <Button variant="ghost" size="icon" onClick={() => removeFaq(index)} className="shrink-0 h-9 w-9 text-destructive hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-xs font-bold text-muted-foreground mt-2.5 shrink-0">A{index + 1}</span>
                <Textarea
                  value={faq.answer}
                  onChange={(e) => updateFaq(index, 'answer', e.target.value)}
                  placeholder="Answer..."
                  className="text-sm min-h-[60px]"
                  rows={2}
                />
              </div>
            </div>
          ))}

          <div className="flex gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={addFaq}>
              <Plus className="h-4 w-4 mr-1" /> Add FAQ
            </Button>
            <Button size="sm" onClick={handleSave} disabled={saving} className="ml-auto">
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
              Save FAQs
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIFAQGenerator;
