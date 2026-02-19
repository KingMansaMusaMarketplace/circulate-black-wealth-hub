import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Sparkles, ChevronLeft, Loader2 } from 'lucide-react';

const CATEGORIES = [
  { value: 'food', label: 'Food & Drink' },
  { value: 'arts', label: 'Arts & Culture' },
  { value: 'outdoor', label: 'Outdoors' },
  { value: 'music', label: 'Music' },
  { value: 'photography', label: 'Photography' },
  { value: 'sports', label: 'Sports & Fitness' },
  { value: 'other', label: 'Other' },
];

const CreateExperiencePage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'other',
    city: '',
    state: '',
    price_per_person: '',
    max_guests: '10',
    duration_hours: '2',
    languages: 'English',
  });

  const update = (field: string, value: string) =>
    setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please log in to create an experience');
      return;
    }
    if (!form.title || !form.city || !form.price_per_person) {
      toast.error('Please fill in all required fields');
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase.from('stays_experiences').insert({
        host_user_id: user.id,
        title: form.title,
        description: form.description,
        category: form.category,
        city: form.city,
        state: form.state,
        price_per_person: parseFloat(form.price_per_person),
        max_guests: parseInt(form.max_guests),
        duration_hours: parseFloat(form.duration_hours),
        languages: form.languages.split(',').map(l => l.trim()),
        is_active: true,
      });

      if (error) throw error;
      toast.success('Experience created!');
      navigate('/stays/experiences');
    } catch (err) {
      console.error('Error creating experience:', err);
      toast.error('Failed to create experience');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 px-4 py-12">
      <Helmet>
        <title>Host an Experience | Mansa Stays</title>
      </Helmet>

      <div className="max-w-2xl mx-auto">
        <Button
          variant="ghost"
          className="text-white hover:bg-white/10 mb-6"
          onClick={() => navigate('/stays/experiences')}
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back to Experiences
        </Button>

        <Card className="bg-slate-800/60 border-mansagold/30">
          <div className="h-1 bg-gradient-to-r from-transparent via-mansagold to-transparent rounded-t-xl" />
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2 text-2xl">
              <Sparkles className="w-6 h-6 text-mansagold" />
              Host an Experience
            </CardTitle>
            <p className="text-slate-400 text-sm">
              Share your passion. Earn extra income. Connect with guests.
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label className="text-slate-300">Title *</Label>
                <Input
                  placeholder="e.g. Soul Food Cooking Class"
                  value={form.title}
                  onChange={e => update('title', e.target.value)}
                  className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label className="text-slate-300">Description</Label>
                <Textarea
                  placeholder="Tell guests what makes your experience special..."
                  value={form.description}
                  onChange={e => update('description', e.target.value)}
                  className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 resize-none"
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-slate-300">Category</Label>
                <Select value={form.category} onValueChange={v => update('category', v)}>
                  <SelectTrigger className="bg-slate-900 border-slate-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    {CATEGORIES.map(c => (
                      <SelectItem key={c.value} value={c.value} className="text-white">
                        {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-slate-300">City *</Label>
                  <Input
                    placeholder="Atlanta"
                    value={form.city}
                    onChange={e => update('city', e.target.value)}
                    className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">State</Label>
                  <Input
                    placeholder="GA"
                    value={form.state}
                    onChange={e => update('state', e.target.value)}
                    className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="text-slate-300">Price / Person ($) *</Label>
                  <Input
                    type="number"
                    min="1"
                    placeholder="75"
                    value={form.price_per_person}
                    onChange={e => update('price_per_person', e.target.value)}
                    className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">Max Guests</Label>
                  <Input
                    type="number"
                    min="1"
                    max="100"
                    value={form.max_guests}
                    onChange={e => update('max_guests', e.target.value)}
                    className="bg-slate-900 border-slate-700 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">Duration (hrs)</Label>
                  <Input
                    type="number"
                    min="0.5"
                    step="0.5"
                    value={form.duration_hours}
                    onChange={e => update('duration_hours', e.target.value)}
                    className="bg-slate-900 border-slate-700 text-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-slate-300">Languages (comma-separated)</Label>
                <Input
                  placeholder="English, Spanish"
                  value={form.languages}
                  onChange={e => update('languages', e.target.value)}
                  className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500"
                />
              </div>

              <Button
                type="submit"
                disabled={saving}
                className="w-full bg-mansagold hover:bg-mansagold/90 text-black font-bold"
              >
                {saving ? (
                  <><Loader2 className="w-4 h-4 animate-spin mr-2" />Creating...</>
                ) : (
                  'Create Experience'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateExperiencePage;
