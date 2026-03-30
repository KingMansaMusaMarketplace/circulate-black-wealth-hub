import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Upload, FileText, AlertTriangle, MessageSquare, Loader2, Send, Trash2, Eye, Clock } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ReactMarkdown from 'react-markdown';

interface DocumentRecord {
  id: string;
  business_id: string;
  file_name: string;
  file_path: string;
  file_size: number | null;
  mime_type: string | null;
  document_type: string | null;
  extracted_fields: Record<string, unknown>;
  ocr_text: string | null;
  expiration_date: string | null;
  processing_status: string;
  processing_error: string | null;
  created_at: string;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const DOCUMENT_TYPES = [
  { value: 'license', label: 'Business License' },
  { value: 'permit', label: 'Permit' },
  { value: 'contract', label: 'Contract' },
  { value: 'insurance', label: 'Insurance' },
  { value: 'tax', label: 'Tax Document' },
  { value: 'certificate', label: 'Certificate' },
  { value: 'other', label: 'Other' },
];

const KaylaRecordsManagement: React.FC = () => {
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [businesses, setBusinesses] = useState<{ id: string; name: string }[]>([]);
  const [selectedBusiness, setSelectedBusiness] = useState<string>('');
  const [selectedDocType, setSelectedDocType] = useState<string>('other');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchBusinesses();
  }, []);

  useEffect(() => {
    if (selectedBusiness) fetchDocuments();
  }, [selectedBusiness]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const fetchBusinesses = async () => {
    const { data } = await supabase
      .from('businesses')
      .select('id, name')
      .order('name')
      .limit(100);
    if (data && data.length > 0) {
      setBusinesses(data);
      setSelectedBusiness(data[0].id);
    }
    setLoading(false);
  };

  const fetchDocuments = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('document_records')
      .select('*')
      .eq('business_id', selectedBusiness)
      .order('created_at', { ascending: false });
    if (error) {
      console.error('Error fetching documents:', error);
      toast.error('Failed to load documents');
    } else {
      setDocuments((data as unknown as DocumentRecord[]) || []);
    }
    setLoading(false);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedBusiness) return;

    setUploading(true);
    try {
      const filePath = `${selectedBusiness}/${Date.now()}_${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from('business_documents')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Create document record
      const { data: doc, error: insertErr } = await supabase
        .from('document_records')
        .insert({
          business_id: selectedBusiness,
          uploaded_by: (await supabase.auth.getUser()).data.user?.id,
          file_name: file.name,
          file_path: filePath,
          file_size: file.size,
          mime_type: file.type,
          document_type: selectedDocType,
          processing_status: 'pending',
        } as any)
        .select()
        .single();

      if (insertErr) throw insertErr;

      toast.success('Document uploaded! Processing with AI...');
      fetchDocuments();

      // Trigger processing
      const { data: session } = await supabase.auth.getSession();
      const response = await supabase.functions.invoke('kayla-records-processor', {
        body: { action: 'process', documentId: (doc as any).id, businessId: selectedBusiness },
      });

      if (response.error) {
        console.error('Processing error:', response.error);
        toast.error('Document processing failed');
      } else {
        toast.success('Document processed successfully!');
        fetchDocuments();
      }
    } catch (err: any) {
      console.error('Upload error:', err);
      toast.error(err.message || 'Upload failed');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDelete = async (doc: DocumentRecord) => {
    if (!confirm(`Delete "${doc.file_name}"?`)) return;
    
    await supabase.storage.from('business_documents').remove([doc.file_path]);
    await supabase.from('document_records').delete().eq('id', doc.id);
    toast.success('Document deleted');
    fetchDocuments();
  };

  const sendChatMessage = async () => {
    if (!chatInput.trim() || !selectedBusiness || chatLoading) return;
    
    const userMsg: ChatMessage = { role: 'user', content: chatInput };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setChatLoading(true);

    try {
      const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/kayla-records-chat`;
      const { data: session } = await supabase.auth.getSession();
      
      const resp = await fetch(CHAT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.session?.access_token}`,
        },
        body: JSON.stringify({
          question: chatInput,
          businessId: selectedBusiness,
          conversationHistory: chatMessages,
        }),
      });

      if (!resp.ok || !resp.body) {
        if (resp.status === 429) { toast.error('Rate limited. Try again shortly.'); setChatLoading(false); return; }
        if (resp.status === 402) { toast.error('AI credits exhausted.'); setChatLoading(false); return; }
        throw new Error('Stream failed');
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let assistantContent = '';
      let textBuffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf('\n')) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);
          if (line.endsWith('\r')) line = line.slice(0, -1);
          if (!line.startsWith('data: ')) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === '[DONE]') break;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              assistantContent += content;
              setChatMessages(prev => {
                const last = prev[prev.length - 1];
                if (last?.role === 'assistant') {
                  return prev.map((m, i) => i === prev.length - 1 ? { ...m, content: assistantContent } : m);
                }
                return [...prev, { role: 'assistant', content: assistantContent }];
              });
            }
          } catch { /* partial JSON */ }
        }
      }
    } catch (err) {
      console.error('Chat error:', err);
      toast.error('Failed to get response');
    } finally {
      setChatLoading(false);
    }
  };

  const expiringDocs = documents.filter(d => {
    if (!d.expiration_date) return false;
    const days = differenceInDays(new Date(d.expiration_date), new Date());
    return days <= 30 && days >= 0;
  });

  const expiredDocs = documents.filter(d => {
    if (!d.expiration_date) return false;
    return differenceInDays(new Date(d.expiration_date), new Date()) < 0;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed': return <Badge className="bg-green-500/20 text-green-400">Processed</Badge>;
      case 'processing': return <Badge className="bg-yellow-500/20 text-yellow-400">Processing</Badge>;
      case 'failed': return <Badge variant="destructive">Failed</Badge>;
      default: return <Badge variant="secondary">Pending</Badge>;
    }
  };

  const getExpiryBadge = (date: string | null) => {
    if (!date) return null;
    const days = differenceInDays(new Date(date), new Date());
    if (days < 0) return <Badge variant="destructive">Expired {Math.abs(days)}d ago</Badge>;
    if (days <= 7) return <Badge className="bg-red-500/20 text-red-400">Expires in {days}d</Badge>;
    if (days <= 30) return <Badge className="bg-yellow-500/20 text-yellow-400">Expires in {days}d</Badge>;
    return <Badge className="bg-green-500/20 text-green-400">Valid ({days}d)</Badge>;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Records Management — Service #19
          </CardTitle>
          <CardDescription>
            Upload, OCR, track expirations, and ask Kayla about your business documents
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Select value={selectedBusiness} onValueChange={setSelectedBusiness}>
              <SelectTrigger className="w-[300px]">
                <SelectValue placeholder="Select business" />
              </SelectTrigger>
              <SelectContent>
                {businesses.map(b => (
                  <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Alert Cards */}
      {(expiredDocs.length > 0 || expiringDocs.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {expiredDocs.length > 0 && (
            <Card className="border-destructive/50">
              <CardHeader className="py-3">
                <CardTitle className="text-sm flex items-center gap-2 text-destructive">
                  <AlertTriangle className="h-4 w-4" />
                  {expiredDocs.length} Expired Document{expiredDocs.length > 1 ? 's' : ''}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                {expiredDocs.map(d => (
                  <p key={d.id} className="text-xs text-muted-foreground">{d.file_name} — expired {format(new Date(d.expiration_date!), 'MMM d, yyyy')}</p>
                ))}
              </CardContent>
            </Card>
          )}
          {expiringDocs.length > 0 && (
            <Card className="border-yellow-500/50">
              <CardHeader className="py-3">
                <CardTitle className="text-sm flex items-center gap-2 text-yellow-500">
                  <Clock className="h-4 w-4" />
                  {expiringDocs.length} Expiring Soon
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                {expiringDocs.map(d => (
                  <p key={d.id} className="text-xs text-muted-foreground">{d.file_name} — expires {format(new Date(d.expiration_date!), 'MMM d, yyyy')}</p>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      )}

      <Tabs defaultValue="documents" className="space-y-4">
        <TabsList>
          <TabsTrigger value="documents" className="flex items-center gap-1">
            <FileText className="h-3 w-3" /> Documents
          </TabsTrigger>
          <TabsTrigger value="chat" className="flex items-center gap-1">
            <MessageSquare className="h-3 w-3" /> Ask Kayla
          </TabsTrigger>
        </TabsList>

        <TabsContent value="documents" className="space-y-4">
          {/* Upload Section */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4 flex-wrap">
                <Select value={selectedDocType} onValueChange={setSelectedDocType}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DOCUMENT_TYPES.map(t => (
                      <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                  onChange={handleUpload}
                  className="hidden"
                />
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading || !selectedBusiness}
                >
                  {uploading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Upload className="h-4 w-4 mr-2" />}
                  {uploading ? 'Processing...' : 'Upload Document'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Document List */}
          {loading ? (
            <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
          ) : documents.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No documents uploaded yet. Upload your first business document above.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              {documents.map(doc => (
                <Card key={doc.id} className="hover:bg-accent/5 transition-colors">
                  <CardContent className="py-3 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <FileText className="h-5 w-5 text-muted-foreground shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{doc.file_name}</p>
                        <p className="text-xs text-muted-foreground">
                          {doc.document_type || 'unknown'} • {format(new Date(doc.created_at), 'MMM d, yyyy')}
                          {doc.file_size && ` • ${(doc.file_size / 1024).toFixed(0)}KB`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {getExpiryBadge(doc.expiration_date)}
                      {getStatusBadge(doc.processing_status)}
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(doc)}>
                        <Trash2 className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="chat">
          <Card className="h-[500px] flex flex-col">
            <CardHeader className="py-3 border-b">
              <CardTitle className="text-sm">Ask Kayla About Your Documents</CardTitle>
            </CardHeader>
            <ScrollArea className="flex-1 p-4">
              {chatMessages.length === 0 && (
                <div className="text-center text-muted-foreground py-12">
                  <MessageSquare className="h-10 w-10 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">Ask Kayla anything about your documents</p>
                  <div className="mt-3 space-y-1">
                    <p className="text-xs opacity-70">"When does my business license expire?"</p>
                    <p className="text-xs opacity-70">"Summarize my insurance coverage"</p>
                    <p className="text-xs opacity-70">"What documents am I missing?"</p>
                  </div>
                </div>
              )}
              {chatMessages.map((msg, i) => (
                <div key={i} className={`mb-3 flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                    msg.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}>
                    {msg.role === 'assistant' ? (
                      <div className="prose prose-sm dark:prose-invert max-w-none">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    ) : msg.content}
                  </div>
                </div>
              ))}
              {chatLoading && chatMessages[chatMessages.length - 1]?.role !== 'assistant' && (
                <div className="flex justify-start mb-3">
                  <div className="bg-muted rounded-lg px-3 py-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </ScrollArea>
            <div className="p-3 border-t flex gap-2">
              <Input
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                placeholder="Ask about your documents..."
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendChatMessage()}
                disabled={chatLoading}
              />
              <Button onClick={sendChatMessage} disabled={chatLoading || !chatInput.trim()} size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default KaylaRecordsManagement;
