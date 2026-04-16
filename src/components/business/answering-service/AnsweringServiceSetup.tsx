
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Plus, Trash2, Save, Power, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { FaqEntry, BusinessHours } from '@/hooks/use-answering-config';
import AIFAQGenerator from '@/components/business/AIFAQGenerator';

interface AnsweringServiceSetupProps {
  businessId: string;
  config: ReturnType<typeof import('@/hooks/use-answering-config').useAnsweringConfig>;
}

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const DAY_LABELS: Record<string, string> = {
  monday: 'Mon', tuesday: 'Tue', wednesday: 'Wed', thursday: 'Thu',
  friday: 'Fri', saturday: 'Sat', sunday: 'Sun',
};

const DEFAULT_HOURS: BusinessHours = {
  monday: { open: '09:00', close: '17:00' },
  tuesday: { open: '09:00', close: '17:00' },
  wednesday: { open: '09:00', close: '17:00' },
  thursday: { open: '09:00', close: '17:00' },
  friday: { open: '09:00', close: '17:00' },
  saturday: null,
  sunday: null,
};

export function AnsweringServiceSetup({ businessId, config }: AnsweringServiceSetupProps) {
  const [greeting, setGreeting] = useState('Thanks for reaching out! How can I help you today?');
  const [hours, setHours] = useState<BusinessHours>(DEFAULT_HOURS);
  const [faqs, setFaqs] = useState<FaqEntry[]>([{ question: '', answer: '' }]);
  const [forwardingNumber, setForwardingNumber] = useState('');

  useEffect(() => {
    if (config.config) {
      setGreeting(config.config.greeting_message);
      setHours(config.config.business_hours || DEFAULT_HOURS);
      setFaqs(
        Array.isArray(config.config.faq_entries) && config.config.faq_entries.length > 0
          ? (config.config.faq_entries as FaqEntry[])
          : [{ question: '', answer: '' }]
      );
      setForwardingNumber(config.config.forwarding_number || '');
    }
  }, [config.config]);

  const handleSave = () => {
    const validFaqs = faqs.filter(f => f.question.trim() && f.answer.trim());
    config.save({
      greeting_message: greeting,
      business_hours: hours,
      faq_entries: validFaqs as any,
      forwarding_number: forwardingNumber || null,
    });
  };

  const toggleDay = (day: string) => {
    setHours(prev => ({
      ...prev,
      [day]: prev[day] ? null : { open: '09:00', close: '17:00' },
    }));
  };

  const updateHours = (day: string, field: 'open' | 'close', value: string) => {
    setHours(prev => ({
      ...prev,
      [day]: prev[day] ? { ...prev[day]!, [field]: value } : { open: '09:00', close: '17:00' },
    }));
  };

  const addFaq = () => setFaqs(prev => [...prev, { question: '', answer: '' }]);
  const removeFaq = (index: number) => setFaqs(prev => prev.filter((_, i) => i !== index));
  const updateFaq = (index: number, field: 'question' | 'answer', value: string) => {
    setFaqs(prev => prev.map((f, i) => (i === index ? { ...f, [field]: value } : f)));
  };

  if (config.isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Service Toggle */}
      <Card>
        <CardContent className="flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <Power className={`h-5 w-5 ${config.config?.is_active ? 'text-green-500' : 'text-muted-foreground'}`} />
            <div>
              <p className="font-medium">Answering Service</p>
              <p className="text-sm text-muted-foreground">
                {config.config?.is_active ? 'Active — Kayla is handling messages' : 'Inactive — enable to start'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={config.config?.is_active ? 'default' : 'secondary'}>
              {config.config?.is_active ? 'ON' : 'OFF'}
            </Badge>
            <Switch
              checked={config.config?.is_active || false}
              onCheckedChange={(checked) => config.toggle(checked)}
              disabled={!config.config || config.isToggling}
            />
          </div>
        </CardContent>
      </Card>

      {/* Greeting Message */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Greeting Message</CardTitle>
          <CardDescription>The first message customers receive when they text your business</CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={greeting}
            onChange={(e) => setGreeting(e.target.value)}
            placeholder="Thanks for reaching out! How can I help you today?"
            rows={3}
          />
        </CardContent>
      </Card>

      {/* Business Hours */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Business Hours</CardTitle>
          <CardDescription>Kayla will let callers know when you're closed</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {DAYS.map((day) => (
              <div key={day} className="flex items-center gap-4">
                <div className="w-12">
                  <span className="text-sm font-medium">{DAY_LABELS[day]}</span>
                </div>
                <Switch
                  checked={!!hours[day]}
                  onCheckedChange={() => toggleDay(day)}
                />
                {hours[day] ? (
                  <div className="flex items-center gap-2">
                    <Input
                      type="time"
                      value={hours[day]!.open}
                      onChange={(e) => updateHours(day, 'open', e.target.value)}
                      className="w-32"
                    />
                    <span className="text-muted-foreground">to</span>
                    <Input
                      type="time"
                      value={hours[day]!.close}
                      onChange={(e) => updateHours(day, 'close', e.target.value)}
                      className="w-32"
                    />
                  </div>
                ) : (
                  <span className="text-sm text-muted-foreground">Closed</span>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI FAQ Generator */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">AI-Powered FAQ Generator</CardTitle>
          <CardDescription>Let AI generate FAQ entries from your business info and customer reviews</CardDescription>
        </CardHeader>
        <CardContent>
          <AIFAQGenerator
            businessId={businessId}
            existingFaqs={faqs.filter(f => f.question.trim() || f.answer.trim())}
            onSave={(newFaqs) => setFaqs(newFaqs)}
          />
        </CardContent>
      </Card>

      {/* FAQ Builder */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">FAQ Entries</CardTitle>
          <CardDescription>Common questions Kayla should answer automatically</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-start">
                <Label className="text-sm font-medium">Question #{index + 1}</Label>
                {faqs.length > 1 && (
                  <Button variant="ghost" size="icon" onClick={() => removeFaq(index)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                )}
              </div>
              <Input
                placeholder="e.g. What are your hours?"
                value={faq.question}
                onChange={(e) => updateFaq(index, 'question', e.target.value)}
              />
              <Textarea
                placeholder="e.g. We're open Monday-Friday 9AM-5PM CST"
                value={faq.answer}
                onChange={(e) => updateFaq(index, 'answer', e.target.value)}
                rows={2}
              />
            </div>
          ))}
          <Button variant="outline" onClick={addFaq} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add FAQ
          </Button>
        </CardContent>
      </Card>

      {/* Forwarding Number */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Call Forwarding</CardTitle>
          <CardDescription>Number to forward calls when Kayla can't answer</CardDescription>
        </CardHeader>
        <CardContent>
          <Input
            type="tel"
            placeholder="+1 (312) 555-0100"
            value={forwardingNumber}
            onChange={(e) => setForwardingNumber(e.target.value)}
          />
        </CardContent>
      </Card>

      {/* Save Button */}
      <Button onClick={handleSave} disabled={config.isSaving} className="w-full bg-mansablue hover:bg-mansablue-dark">
        {config.isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
        Save Configuration
      </Button>
    </div>
  );
}
