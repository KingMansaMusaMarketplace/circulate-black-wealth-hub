import React, { useState, useCallback } from 'react';
import { Globe, Loader2, Save, X, CheckCircle, AlertCircle, Building2, Phone, Mail, MapPin, Clock, ExternalLink, RefreshCw, Check, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ExtractedBusinessData {
  name: string;
  description: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  category: string;
  website: string;
  logoUrl: string;
  hours: string;
  socialLinks: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
  };
}

type URLStatus = 'pending' | 'processing' | 'completed' | 'failed';

interface URLItem {
  id: string;
  url: string;
  status: URLStatus;
  data?: ExtractedBusinessData;
  error?: string;
  selected: boolean;
}

interface URLBusinessImportProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const BATCH_SIZE = 3;
const BATCH_DELAY_MS = 500;

export const URLBusinessImport: React.FC<URLBusinessImportProps> = ({ isOpen, onClose, onSuccess }) => {
  const [urlInput, setUrlInput] = useState('');
  const [urlItems, setUrlItems] = useState<URLItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Parse URLs from textarea input
  const parseUrls = (input: string): string[] => {
    return input
      .split(/[\n,]/)
      .map(url => url.trim())
      .filter(url => url.length > 0)
      .map(url => {
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
          return `https://${url}`;
        }
        return url;
      });
  };

  // Generate unique ID
  const generateId = () => Math.random().toString(36).substring(2, 9);

  // Scrape a single URL
  const scrapeUrl = async (url: string): Promise<{ success: boolean; data?: ExtractedBusinessData; error?: string }> => {
    try {
      const { data, error: invokeError } = await supabase.functions.invoke('scrape-business-website', {
        body: { url, saveAsDraft: false }
      });

      if (invokeError) {
        return { success: false, error: invokeError.message };
      }

      if (!data.success) {
        return { success: false, error: data.error || 'Failed to extract data' };
      }

      return { success: true, data: data.data };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
    }
  };

  // Process URLs in batches
  const handleExtractAll = async () => {
    const urls = parseUrls(urlInput);
    
    if (urls.length === 0) {
      toast.error('Please enter at least one URL');
      return;
    }

    // Initialize URL items
    const items: URLItem[] = urls.map(url => ({
      id: generateId(),
      url,
      status: 'pending' as URLStatus,
      selected: true
    }));

    setUrlItems(items);
    setIsProcessing(true);

    // Process in batches
    for (let i = 0; i < items.length; i += BATCH_SIZE) {
      const batch = items.slice(i, i + BATCH_SIZE);
      
      // Mark batch as processing
      setUrlItems(prev => prev.map(item => 
        batch.find(b => b.id === item.id) 
          ? { ...item, status: 'processing' as URLStatus } 
          : item
      ));

      // Process batch in parallel
      const results = await Promise.allSettled(
        batch.map(async (item) => {
          const result = await scrapeUrl(item.url);
          return { id: item.id, ...result };
        })
      );

      // Update items with results
      setUrlItems(prev => prev.map(item => {
        const result = results.find((r, idx) => 
          r.status === 'fulfilled' && (r.value as { id: string }).id === item.id
        );
        
        if (result && result.status === 'fulfilled') {
          const value = result.value as { id: string; success: boolean; data?: ExtractedBusinessData; error?: string };
          if (value.success && value.data) {
            return { ...item, status: 'completed' as URLStatus, data: value.data };
          } else {
            return { ...item, status: 'failed' as URLStatus, error: value.error };
          }
        }
        
        // Check rejected promises
        const rejectedIdx = batch.findIndex(b => b.id === item.id);
        if (rejectedIdx !== -1 && results[rejectedIdx]?.status === 'rejected') {
          return { ...item, status: 'failed' as URLStatus, error: 'Request failed' };
        }
        
        return item;
      }));

      // Delay between batches
      if (i + BATCH_SIZE < items.length) {
        await new Promise(resolve => setTimeout(resolve, BATCH_DELAY_MS));
      }
    }

    setIsProcessing(false);
    
    const successCount = urlItems.filter(i => i.status === 'completed').length;
    if (successCount > 0) {
      toast.success(`Extracted ${successCount} of ${urls.length} businesses`);
    }
  };

  // Retry a failed URL
  const handleRetry = async (id: string) => {
    const item = urlItems.find(i => i.id === id);
    if (!item) return;

    setUrlItems(prev => prev.map(i => 
      i.id === id ? { ...i, status: 'processing' as URLStatus, error: undefined } : i
    ));

    const result = await scrapeUrl(item.url);

    setUrlItems(prev => prev.map(i => {
      if (i.id === id) {
        if (result.success && result.data) {
          return { ...i, status: 'completed' as URLStatus, data: result.data };
        } else {
          return { ...i, status: 'failed' as URLStatus, error: result.error };
        }
      }
      return i;
    }));
  };

  // Toggle selection
  const toggleSelection = (id: string) => {
    setUrlItems(prev => prev.map(i => 
      i.id === id ? { ...i, selected: !i.selected } : i
    ));
  };

  // Select/deselect all
  const toggleSelectAll = () => {
    const completedItems = urlItems.filter(i => i.status === 'completed');
    const allSelected = completedItems.every(i => i.selected);
    
    setUrlItems(prev => prev.map(i => 
      i.status === 'completed' ? { ...i, selected: !allSelected } : i
    ));
  };

  // Remove an item
  const removeItem = (id: string) => {
    setUrlItems(prev => prev.filter(i => i.id !== id));
  };

  // Update editable data for an item
  const updateItemData = (id: string, field: keyof ExtractedBusinessData, value: string) => {
    setUrlItems(prev => prev.map(i => {
      if (i.id === id && i.data) {
        return { ...i, data: { ...i.data, [field]: value } };
      }
      return i;
    }));
  };

  // Save selected items as drafts
  const handleSaveAllAsDrafts = async () => {
    const selectedItems = urlItems.filter(i => i.selected && i.status === 'completed' && i.data);
    
    if (selectedItems.length === 0) {
      toast.error('No businesses selected to save');
      return;
    }

    setIsSaving(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('You must be logged in to save');
      }

      const businessesToInsert = selectedItems.map(item => ({
        owner_id: user.id,
        name: item.data!.name || 'Untitled Business',
        business_name: item.data!.name || 'Untitled Business',
        description: item.data!.description,
        phone: item.data!.phone,
        email: item.data!.email,
        address: item.data!.address,
        city: item.data!.city,
        state: item.data!.state,
        zip_code: item.data!.zipCode,
        category: item.data!.category || 'Other',
        website: item.data!.website,
        logo_url: item.data!.logoUrl,
        banner_url: item.data!.logoUrl,
        listing_status: 'draft',
        is_verified: false,
      }));

      const { error: insertError } = await supabase
        .from('businesses')
        .insert(businessesToInsert);

      if (insertError) {
        throw new Error(insertError.message);
      }

      toast.success(`${selectedItems.length} businesses saved as drafts!`);
      onSuccess?.();
      handleClose();
    } catch (err) {
      console.error('Save error:', err);
      const message = err instanceof Error ? err.message : 'Failed to save businesses';
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    setUrlInput('');
    setUrlItems([]);
    setEditingId(null);
    onClose();
  };

  // Calculate progress
  const processedCount = urlItems.filter(i => i.status === 'completed' || i.status === 'failed').length;
  const totalCount = urlItems.length;
  const progressPercent = totalCount > 0 ? (processedCount / totalCount) * 100 : 0;
  const completedItems = urlItems.filter(i => i.status === 'completed');
  const selectedCount = completedItems.filter(i => i.selected).length;

  // Get status badge styling
  const getStatusBadge = (status: URLStatus) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-slate-500/20 text-slate-300 border-slate-500/30">Queued</Badge>;
      case 'processing':
        return <Badge variant="outline" className="bg-blue-500/20 text-blue-300 border-blue-500/30 flex items-center gap-1"><Loader2 className="w-3 h-3 animate-spin" />Processing</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-green-500/20 text-green-300 border-green-500/30 flex items-center gap-1"><CheckCircle className="w-3 h-3" />Done</Badge>;
      case 'failed':
        return <Badge variant="outline" className="bg-red-500/20 text-red-300 border-red-500/30 flex items-center gap-1"><AlertCircle className="w-3 h-3" />Failed</Badge>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col bg-slate-900 border-white/10">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <Globe className="w-5 h-5 text-blue-400" />
            Batch Import from URLs
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col gap-4">
          {/* URL Input Section */}
          {urlItems.length === 0 && (
            <Card className="bg-white/5 border-white/10">
              <CardContent className="pt-6 space-y-4">
                <div>
                  <Label className="text-blue-200 mb-2 block">Website URLs (one per line)</Label>
                  <Textarea
                    placeholder="https://example1.com&#10;https://example2.com&#10;https://example3.com"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50 min-h-[120px] font-mono text-sm"
                  />
                  <p className="text-xs text-blue-300 mt-2">
                    Paste multiple URLs, one per line. We'll extract data from all of them in parallel.
                  </p>
                </div>
                <div className="flex justify-end">
                  <Button
                    onClick={handleExtractAll}
                    disabled={!urlInput.trim()}
                    className="bg-gradient-to-r from-blue-500 to-cyan-500"
                  >
                    <Globe className="w-4 h-4 mr-2" />
                    Extract All ({parseUrls(urlInput).length} URLs)
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Processing Progress */}
          {urlItems.length > 0 && isProcessing && (
            <Card className="bg-white/5 border-white/10">
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-blue-200">Processing URLs...</span>
                    <span className="text-white font-medium">{processedCount} / {totalCount}</span>
                  </div>
                  <Progress value={progressPercent} className="h-2" />
                </div>
              </CardContent>
            </Card>
          )}

          {/* URL List with Status */}
          {urlItems.length > 0 && (
            <ScrollArea className="flex-1 -mx-6 px-6">
              <div className="space-y-3">
                {/* Header with Select All */}
                {completedItems.length > 0 && !isProcessing && (
                  <div className="flex items-center justify-between py-2 border-b border-white/10">
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={completedItems.length > 0 && completedItems.every(i => i.selected)}
                        onCheckedChange={toggleSelectAll}
                        className="border-white/30 data-[state=checked]:bg-blue-500"
                      />
                      <span className="text-sm text-blue-200">
                        {selectedCount} of {completedItems.length} selected
                      </span>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setUrlItems([]);
                        setUrlInput('');
                      }}
                      className="border-white/20 text-white hover:bg-white/10"
                    >
                      Start Over
                    </Button>
                  </div>
                )}

                {/* URL Items */}
                {urlItems.map((item) => (
                  <Card 
                    key={item.id} 
                    className={`bg-white/5 border-white/10 ${
                      item.status === 'completed' && item.selected ? 'ring-1 ring-blue-500/50' : ''
                    }`}
                  >
                    <CardContent className="py-4">
                      {/* URL Header Row */}
                      <div className="flex items-center gap-3">
                        {item.status === 'completed' && (
                          <Checkbox
                            checked={item.selected}
                            onCheckedChange={() => toggleSelection(item.id)}
                            className="border-white/30 data-[state=checked]:bg-blue-500"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-white font-medium truncate">{item.url}</p>
                          {item.error && (
                            <p className="text-xs text-red-400 mt-1">{item.error}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(item.status)}
                          {item.status === 'failed' && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleRetry(item.id)}
                              className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                            >
                              <RefreshCw className="w-4 h-4" />
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removeItem(item.id)}
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Extracted Data Preview/Edit */}
                      {item.status === 'completed' && item.data && (
                        <div className="mt-4 pt-4 border-t border-white/10">
                          {editingId === item.id ? (
                            // Edit Mode
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label className="text-xs text-blue-200">Business Name</Label>
                                  <Input
                                    value={item.data.name}
                                    onChange={(e) => updateItemData(item.id, 'name', e.target.value)}
                                    className="mt-1 bg-white/10 border-white/20 text-white text-sm"
                                  />
                                </div>
                                <div>
                                  <Label className="text-xs text-blue-200">Category</Label>
                                  <Input
                                    value={item.data.category}
                                    onChange={(e) => updateItemData(item.id, 'category', e.target.value)}
                                    className="mt-1 bg-white/10 border-white/20 text-white text-sm"
                                  />
                                </div>
                              </div>
                              <div>
                                <Label className="text-xs text-blue-200">Description</Label>
                                <Textarea
                                  value={item.data.description}
                                  onChange={(e) => updateItemData(item.id, 'description', e.target.value)}
                                  className="mt-1 bg-white/10 border-white/20 text-white text-sm min-h-[60px]"
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label className="text-xs text-blue-200">Phone</Label>
                                  <Input
                                    value={item.data.phone}
                                    onChange={(e) => updateItemData(item.id, 'phone', e.target.value)}
                                    className="mt-1 bg-white/10 border-white/20 text-white text-sm"
                                  />
                                </div>
                                <div>
                                  <Label className="text-xs text-blue-200">Email</Label>
                                  <Input
                                    value={item.data.email}
                                    onChange={(e) => updateItemData(item.id, 'email', e.target.value)}
                                    className="mt-1 bg-white/10 border-white/20 text-white text-sm"
                                  />
                                </div>
                              </div>
                              <div className="grid grid-cols-3 gap-4">
                                <div>
                                  <Label className="text-xs text-blue-200">City</Label>
                                  <Input
                                    value={item.data.city}
                                    onChange={(e) => updateItemData(item.id, 'city', e.target.value)}
                                    className="mt-1 bg-white/10 border-white/20 text-white text-sm"
                                  />
                                </div>
                                <div>
                                  <Label className="text-xs text-blue-200">State</Label>
                                  <Input
                                    value={item.data.state}
                                    onChange={(e) => updateItemData(item.id, 'state', e.target.value)}
                                    className="mt-1 bg-white/10 border-white/20 text-white text-sm"
                                  />
                                </div>
                                <div>
                                  <Label className="text-xs text-blue-200">ZIP</Label>
                                  <Input
                                    value={item.data.zipCode}
                                    onChange={(e) => updateItemData(item.id, 'zipCode', e.target.value)}
                                    className="mt-1 bg-white/10 border-white/20 text-white text-sm"
                                  />
                                </div>
                              </div>
                              <Button
                                size="sm"
                                onClick={() => setEditingId(null)}
                                className="bg-blue-500 hover:bg-blue-600"
                              >
                                <Check className="w-4 h-4 mr-1" />
                                Done Editing
                              </Button>
                            </div>
                          ) : (
                            // Preview Mode
                            <div className="flex items-start gap-4">
                              {item.data.logoUrl && (
                                <img 
                                  src={item.data.logoUrl} 
                                  alt="" 
                                  className="w-12 h-12 rounded-lg object-cover border border-white/10"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).style.display = 'none';
                                  }}
                                />
                              )}
                              <div className="flex-1 min-w-0">
                                <h4 className="text-white font-medium">{item.data.name || 'Untitled'}</h4>
                                <p className="text-xs text-blue-300 mt-0.5">{item.data.category}</p>
                                {item.data.description && (
                                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">{item.data.description}</p>
                                )}
                                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-slate-400">
                                  {item.data.phone && (
                                    <span className="flex items-center gap-1">
                                      <Phone className="w-3 h-3" />
                                      {item.data.phone}
                                    </span>
                                  )}
                                  {item.data.email && (
                                    <span className="flex items-center gap-1">
                                      <Mail className="w-3 h-3" />
                                      {item.data.email}
                                    </span>
                                  )}
                                  {item.data.city && (
                                    <span className="flex items-center gap-1">
                                      <MapPin className="w-3 h-3" />
                                      {item.data.city}, {item.data.state}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setEditingId(item.id)}
                                className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                              >
                                Edit
                              </Button>
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex justify-between items-center pt-4 border-t border-white/10 mt-4">
          <Button
            variant="outline"
            onClick={handleClose}
            className="border-white/20 text-white"
          >
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          
          {completedItems.length > 0 && !isProcessing && (
            <Button
              onClick={handleSaveAllAsDrafts}
              disabled={isSaving || selectedCount === 0}
              className="bg-gradient-to-r from-green-500 to-emerald-500"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save {selectedCount} as Drafts
                </>
              )}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default URLBusinessImport;
