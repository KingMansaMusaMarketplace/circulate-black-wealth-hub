import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileText, Loader2, Download, Copy } from 'lucide-react';
import { toast } from 'sonner';

interface Props { businessId: string; }

const templateTypes = [
  { value: 'nda', label: 'Non-Disclosure Agreement' },
  { value: 'service_agreement', label: 'Service Agreement' },
  { value: 'privacy_policy', label: 'Privacy Policy' },
  { value: 'terms_of_service', label: 'Terms of Service' },
  { value: 'independent_contractor', label: 'Independent Contractor Agreement' },
  { value: 'refund_policy', label: 'Refund & Cancellation Policy' },
  { value: 'partnership_agreement', label: 'Partnership Agreement' },
  { value: 'employee_handbook', label: 'Employee Handbook Summary' },
];

export const KaylaLegalTemplates: React.FC<Props> = ({ businessId }) => {
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [selectedType, setSelectedType] = useState('');
  const [viewingTemplate, setViewingTemplate] = useState<any>(null);

  useEffect(() => { fetchTemplates(); }, [businessId]);

  const fetchTemplates = async () => {
    const { data } = await supabase
      .from('kayla_legal_templates')
      .select('*')
      .eq('business_id', businessId)
      .order('created_at', { ascending: false });
    setTemplates(data || []);
    setLoading(false);
  };

  const generateTemplate = async () => {
    if (!selectedType) return toast.error('Select a template type');
    setGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('kayla-legal-templates', {
        body: { business_id: businessId, template_type: selectedType },
      });
      if (error) throw error;
      toast.success('Template generated!');
      setSelectedType('');
      fetchTemplates();
      setViewingTemplate(data);
    } catch { toast.error('Failed to generate template'); }
    setGenerating(false);
  };

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success('Copied to clipboard!');
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-yellow-400" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <FileText className="h-5 w-5 text-yellow-400" /> Legal Templates
        </h3>
      </div>

      {/* Generator */}
      <Card className="bg-slate-800/40 border-white/10">
        <CardContent className="p-4 flex gap-3 items-end">
          <div className="flex-1">
            <p className="text-xs text-white/50 mb-2">Select a template type to generate</p>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="bg-slate-900/50 border-white/10 text-white">
                <SelectValue placeholder="Choose template type..." />
              </SelectTrigger>
              <SelectContent>
                {templateTypes.map(t => (
                  <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={generateTemplate} disabled={generating || !selectedType} className="bg-yellow-600 hover:bg-yellow-700 text-black">
            {generating ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <FileText className="h-4 w-4 mr-1" />}
            Generate
          </Button>
        </CardContent>
      </Card>

      {/* Viewing template */}
      {viewingTemplate && (
        <Card className="bg-slate-800/60 border-yellow-400/20">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm text-white">{viewingTemplate.template_name}</CardTitle>
              <div className="flex gap-2">
                <Button size="sm" variant="ghost" onClick={() => copyToClipboard(viewingTemplate.content)} className="text-white/60 hover:text-white">
                  <Copy className="h-4 w-4 mr-1" /> Copy
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setViewingTemplate(null)} className="text-white/40">Close</Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px]">
              <pre className="text-sm text-white/80 whitespace-pre-wrap font-sans leading-relaxed">{viewingTemplate.content}</pre>
            </ScrollArea>
            {viewingTemplate.variables?.length > 0 && (
              <div className="mt-4 pt-4 border-t border-white/10">
                <p className="text-xs text-white/50 mb-2">Customizable Fields:</p>
                <div className="flex flex-wrap gap-2">
                  {viewingTemplate.variables.map((v: any, i: number) => (
                    <Badge key={i} variant="outline" className="border-yellow-400/30 text-yellow-400/70 text-xs">[{v.name}]</Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Saved templates */}
      {templates.length > 0 && !viewingTemplate && (
        <Card className="bg-slate-800/40 border-white/10">
          <CardHeader className="pb-2"><CardTitle className="text-sm text-white">Your Templates ({templates.length})</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {templates.map(t => (
              <div key={t.id} className="flex items-center justify-between p-3 bg-slate-900/30 rounded-lg cursor-pointer hover:bg-slate-900/50 transition-colors" onClick={() => setViewingTemplate(t)}>
                <div>
                  <p className="text-sm font-medium text-white">{t.template_name}</p>
                  <p className="text-xs text-white/40">{templateTypes.find(tt => tt.value === t.template_type)?.label || t.template_type} • {new Date(t.created_at).toLocaleDateString()}</p>
                </div>
                <Badge variant="outline" className="border-white/20 text-white/50 text-xs">{t.status}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {templates.length === 0 && !viewingTemplate && (
        <Card className="bg-slate-800/40 border-white/10">
          <CardContent className="p-8 text-center">
            <FileText className="h-12 w-12 text-yellow-400/40 mx-auto mb-3" />
            <p className="text-white/60 text-sm">Generate legal templates customized for your business — NDAs, service agreements, privacy policies, and more.</p>
            <p className="text-xs text-white/30 mt-2 italic">⚠️ Templates are AI-generated and should be reviewed by legal counsel before use.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
