import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, Sparkles, Building2, Globe, MapPin, Mail, 
  Phone, ExternalLink, Plus, Check, Loader2, X 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';

interface AIBusinessDiscoveryProps {
  onClose: () => void;
}

interface DiscoveredBusiness {
  name: string;
  description: string;
  category: string;
  location?: string;
  website?: string;
  contact?: {
    email?: string;
    phone?: string;
    linkedin?: string;
  };
  confidence: number;
}

export const AIBusinessDiscovery: React.FC<AIBusinessDiscoveryProps> = ({ onClose }) => {
  const queryClient = useQueryClient();
  const [step, setStep] = useState<'search' | 'results' | 'importing'>('search');
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [businesses, setBusinesses] = useState<DiscoveredBusiness[]>([]);
  const [selectedBusinesses, setSelectedBusinesses] = useState<Set<number>>(new Set());
  const [citations, setCitations] = useState<string[]>([]);
  const [isImporting, setIsImporting] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) {
      toast.error('Please enter a search query');
      return;
    }

    setIsSearching(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('b2b-web-search', {
        body: {
          query: query.trim(),
          category: category.trim() || undefined,
          location: location.trim() || undefined,
          limit: 15,
        },
      });

      if (error) throw error;

      if (data.businesses && data.businesses.length > 0) {
        setBusinesses(data.businesses);
        setCitations(data.citations || []);
        // Select all by default
        setSelectedBusinesses(new Set(data.businesses.map((_: DiscoveredBusiness, i: number) => i)));
        setStep('results');
        toast.success(`Found ${data.businesses.length} Black-owned businesses!`);
      } else {
        toast.info('No businesses found. Try a different search query.');
      }
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Failed to search for businesses. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const toggleSelection = (index: number) => {
    setSelectedBusinesses(prev => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const selectAll = () => {
    setSelectedBusinesses(new Set(businesses.map((_, i) => i)));
  };

  const deselectAll = () => {
    setSelectedBusinesses(new Set());
  };

  const handleImport = async () => {
    if (selectedBusinesses.size === 0) {
      toast.error('Please select at least one business to import');
      return;
    }

    setIsImporting(true);
    setStep('importing');

    try {
      const selectedList = businesses.filter((_, i) => selectedBusinesses.has(i));
      
      const leads = selectedList.map(b => ({
        business_name: b.name,
        business_description: b.description,
        category: b.category,
        location: b.location,
        website_url: b.website,
        owner_email: b.contact?.email || null,
        phone_number: b.contact?.phone || null,
        source_query: `ai_discovery: ${query}`,
        confidence_score: b.confidence,
        source_citations: citations.slice(0, 5),
      }));

      const { error } = await supabase
        .from('b2b_external_leads')
        .insert(leads);

      if (error) throw error;

      toast.success(`Successfully imported ${leads.length} businesses!`);
      queryClient.invalidateQueries({ queryKey: ['lead-stats'] });
      queryClient.invalidateQueries({ queryKey: ['external-leads'] });
      onClose();
    } catch (error) {
      console.error('Import error:', error);
      toast.error('Failed to import businesses');
      setStep('results');
    } finally {
      setIsImporting(false);
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'bg-green-500/20 text-green-400';
    if (confidence >= 0.6) return 'bg-yellow-500/20 text-yellow-400';
    return 'bg-orange-500/20 text-orange-400';
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto bg-slate-900 border-white/10 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-400" />
            AI Business Discovery
          </DialogTitle>
          <DialogDescription className="text-blue-200">
            Use AI to search the web and discover Black-owned businesses to add to your leads database.
          </DialogDescription>
        </DialogHeader>

        {step === 'search' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <div className="p-4 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-400/30 rounded-lg">
              <p className="text-sm text-purple-200">
                <Sparkles className="w-4 h-4 inline mr-2" />
                Powered by Perplexity AI - searches across Black business directories, 
                NMSDC certified businesses, Chamber of Commerce listings, and more.
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-white">What type of businesses are you looking for?</Label>
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="e.g., catering services, IT consulting, construction contractors..."
                  className="bg-white/5 border-white/20 text-white placeholder:text-blue-300/50"
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-blue-200">Category (optional)</Label>
                  <Input
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="e.g., Food & Beverage"
                    className="bg-white/5 border-white/20 text-white placeholder:text-blue-300/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-blue-200">Location (optional)</Label>
                  <Input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g., Atlanta, GA or nationwide"
                    className="bg-white/5 border-white/20 text-white placeholder:text-blue-300/50"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
              <Button variant="outline" onClick={onClose} className="border-white/20">
                Cancel
              </Button>
              <Button
                onClick={handleSearch}
                disabled={isSearching || !query.trim()}
                className="bg-gradient-to-r from-purple-500 to-blue-500"
              >
                {isSearching ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4 mr-2" />
                    Discover Businesses
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        )}

        {step === 'results' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge className="bg-green-500/20 text-green-400">
                  {businesses.length} businesses found
                </Badge>
                <span className="text-sm text-blue-200">
                  {selectedBusinesses.size} selected
                </span>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={selectAll}
                  className="text-blue-200 hover:text-white"
                >
                  Select All
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={deselectAll}
                  className="text-blue-200 hover:text-white"
                >
                  Deselect All
                </Button>
              </div>
            </div>

            <div className="max-h-[400px] overflow-y-auto space-y-3 pr-2">
              {businesses.map((business, index) => (
                <Card
                  key={index}
                  className={`bg-white/5 border transition-colors cursor-pointer ${
                    selectedBusinesses.has(index)
                      ? 'border-purple-400/50 bg-purple-500/10'
                      : 'border-white/10 hover:border-white/20'
                  }`}
                  onClick={() => toggleSelection(index)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Checkbox
                        checked={selectedBusinesses.has(index)}
                        onCheckedChange={() => toggleSelection(index)}
                        className="mt-1"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h4 className="font-medium text-white flex items-center gap-2">
                              <Building2 className="w-4 h-4 text-purple-400" />
                              {business.name}
                            </h4>
                            <p className="text-sm text-blue-200 mt-1 line-clamp-2">
                              {business.description}
                            </p>
                          </div>
                          <Badge className={getConfidenceColor(business.confidence)}>
                            {Math.round(business.confidence * 100)}%
                          </Badge>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-blue-300">
                          <Badge variant="outline" className="border-white/20">
                            {business.category}
                          </Badge>
                          {business.location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {business.location}
                            </span>
                          )}
                          {business.website && (
                            <a
                              href={business.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="flex items-center gap-1 text-purple-400 hover:text-purple-300"
                            >
                              <Globe className="w-3 h-3" />
                              Website
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                          {business.contact?.email && (
                            <span className="flex items-center gap-1">
                              <Mail className="w-3 h-3" />
                              {business.contact.email}
                            </span>
                          )}
                          {business.contact?.phone && (
                            <span className="flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              {business.contact.phone}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {citations.length > 0 && (
              <div className="p-3 bg-white/5 rounded-lg">
                <p className="text-xs text-blue-300 mb-2">Sources:</p>
                <div className="flex flex-wrap gap-2">
                  {citations.slice(0, 5).map((citation, i) => (
                    <a
                      key={i}
                      href={citation}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-purple-400 hover:text-purple-300 truncate max-w-[200px]"
                    >
                      {new URL(citation).hostname}
                    </a>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-between gap-3 pt-4 border-t border-white/10">
              <Button
                variant="outline"
                onClick={() => setStep('search')}
                className="border-white/20"
              >
                ← New Search
              </Button>
              <div className="flex gap-3">
                <Button variant="outline" onClick={onClose} className="border-white/20">
                  Cancel
                </Button>
                <Button
                  onClick={handleImport}
                  disabled={selectedBusinesses.size === 0}
                  className="bg-gradient-to-r from-green-500 to-emerald-500"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Import {selectedBusinesses.size} Business{selectedBusinesses.size !== 1 ? 'es' : ''}
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {step === 'importing' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-green-400 animate-spin" />
            </div>
            <p className="text-lg font-medium text-white mb-2">Importing Businesses</p>
            <p className="text-sm text-blue-200">
              Adding {selectedBusinesses.size} businesses to your leads database...
            </p>
          </motion.div>
        )}
      </DialogContent>
    </Dialog>
  );
};
