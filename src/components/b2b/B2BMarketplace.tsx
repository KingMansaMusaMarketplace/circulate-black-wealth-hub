import { useState } from 'react';
import { useB2B } from '@/hooks/use-b2b';
import { B2BImpactCard } from './B2BImpactCard';
import { SupplierCard } from './SupplierCard';
import { NeedCard } from './NeedCard';
import { ExternalLeadCard } from './ExternalLeadCard';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Search, Filter, Plus, Loader2, Globe, Sparkles, ExternalLink } from 'lucide-react';
import { ConnectionRequestModal } from './ConnectionRequestModal';
import { BusinessCapability, BusinessNeed } from '@/hooks/use-b2b';
import { DiscoveredBusiness } from '@/types/b2b-external';

export function B2BMarketplace() {
  const { 
    allCapabilities, 
    allNeeds, 
    impactMetrics, 
    loading, 
    initiateConnection,
    B2B_CATEGORIES,
    // Web search
    webSearchResults,
    webSearchCitations,
    webSearchLoading,
    searchWebSuppliers,
    saveExternalLead,
    clearWebSearch,
  } = useB2B();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<BusinessCapability | BusinessNeed | null>(null);
  const [modalType, setModalType] = useState<'capability' | 'need' | null>(null);
  const [webSearchEnabled, setWebSearchEnabled] = useState(false);
  const [savingLeadId, setSavingLeadId] = useState<string | null>(null);

  const filteredCapabilities = allCapabilities.filter(cap => {
    const matchesSearch = !searchQuery || 
      cap.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cap.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || cap.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredNeeds = allNeeds.filter(need => {
    const matchesSearch = !searchQuery || 
      need.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      need.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || need.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleConnect = (item: BusinessCapability | BusinessNeed, type: 'capability' | 'need') => {
    setSelectedItem(item);
    setModalType(type);
  };

  const handleSubmitConnection = async (notes: string) => {
    if (!selectedItem) return;
    
    if (modalType === 'capability') {
      await initiateConnection(
        (selectedItem as BusinessCapability).business_id,
        undefined,
        selectedItem.id,
        notes
      );
    } else {
      await initiateConnection(
        (selectedItem as BusinessNeed).business_id,
        selectedItem.id,
        undefined,
        notes
      );
    }
    
    setSelectedItem(null);
    setModalType(null);
  };

  const handleSearch = () => {
    if (webSearchEnabled && searchQuery.trim().length >= 3) {
      searchWebSuppliers(searchQuery, selectedCategory);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSaveLead = async (business: DiscoveredBusiness) => {
    setSavingLeadId(business.name);
    await saveExternalLead(business, searchQuery);
    setSavingLeadId(null);
  };

  const handleWebSearchToggle = (enabled: boolean) => {
    setWebSearchEnabled(enabled);
    if (!enabled) {
      clearWebSearch();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-amber-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Impact Metrics */}
      {impactMetrics && <B2BImpactCard metrics={impactMetrics} />}

      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search suppliers or needs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="pl-10 bg-slate-800/50 border-white/10 text-white placeholder:text-slate-400 focus:border-amber-500/50 focus:ring-amber-500/20"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-[200px] bg-slate-800/50 border-white/10 text-white">
              <Filter className="h-4 w-4 mr-2 text-slate-400" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-white/10">
              <SelectItem value="all" className="text-white hover:bg-white/10">All Categories</SelectItem>
              {B2B_CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat} className="text-white hover:bg-white/10">{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Web Search Toggle */}
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-950/50 to-slate-900/50 rounded-xl border border-blue-500/20">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/20">
              <Globe className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <Label htmlFor="web-search" className="text-white font-medium cursor-pointer">
                Expand Search to Web
              </Label>
              <p className="text-xs text-slate-400 mt-0.5">
                Use AI to discover Black-owned suppliers beyond our platform
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {webSearchEnabled && searchQuery.trim().length >= 3 && (
              <Button
                size="sm"
                onClick={handleSearch}
                disabled={webSearchLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {webSearchLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-1.5" />
                    Search Web
                  </>
                )}
              </Button>
            )}
            <Switch
              id="web-search"
              checked={webSearchEnabled}
              onCheckedChange={handleWebSearchToggle}
              className="data-[state=checked]:bg-blue-600"
            />
          </div>
        </div>
      </div>

      {/* Web Search Results Section */}
      {webSearchEnabled && (webSearchResults.length > 0 || webSearchLoading) && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-blue-400" />
              <h3 className="text-lg font-semibold text-white">
                Web Discovery Results
              </h3>
              <span className="px-2 py-0.5 text-xs bg-blue-500/20 text-blue-300 rounded-full">
                AI-Powered
              </span>
            </div>
            {webSearchCitations.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="text-slate-400 hover:text-white"
                onClick={() => window.open(webSearchCitations[0], '_blank')}
              >
                <ExternalLink className="h-4 w-4 mr-1.5" />
                View Sources ({webSearchCitations.length})
              </Button>
            )}
          </div>

          {webSearchLoading ? (
            <div className="flex items-center justify-center py-12 bg-slate-800/30 backdrop-blur-sm rounded-xl border border-blue-500/10">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-400 mx-auto mb-3" />
                <p className="text-slate-300">Searching the web for Black-owned suppliers...</p>
                <p className="text-xs text-slate-500 mt-1">Powered by Perplexity AI</p>
              </div>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {webSearchResults.map((business, index) => (
                <ExternalLeadCard
                  key={`${business.name}-${index}`}
                  business={business}
                  onSaveLead={handleSaveLead}
                  isSaving={savingLeadId === business.name}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Divider between web results and platform results */}
      {webSearchEnabled && webSearchResults.length > 0 && (
        <div className="relative py-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="px-4 text-sm text-slate-400 bg-slate-900">
              Platform Suppliers
            </span>
          </div>
        </div>
      )}

      {/* Main Content */}
      <Tabs defaultValue="suppliers" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 bg-slate-800/50 border border-white/10 p-1">
          <TabsTrigger 
            value="suppliers"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-amber-600 data-[state=active]:text-slate-900 text-slate-300"
          >
            Suppliers ({filteredCapabilities.length})
          </TabsTrigger>
          <TabsTrigger 
            value="needs"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-amber-600 data-[state=active]:text-slate-900 text-slate-300"
          >
            Business Needs ({filteredNeeds.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="suppliers" className="space-y-4">
          {filteredCapabilities.length === 0 ? (
            <div className="text-center py-12 bg-slate-800/30 backdrop-blur-sm rounded-xl border border-white/10">
              <p className="text-slate-400 mb-4">No suppliers found matching your criteria</p>
              {!webSearchEnabled && (
                <p className="text-sm text-slate-500 mb-4">
                  Try enabling "Expand Search to Web" to discover suppliers beyond our platform
                </p>
              )}
              <Button variant="outline" className="border-amber-500/50 text-amber-400 hover:bg-amber-500/10 hover:text-amber-300">
                <Plus className="h-4 w-4 mr-2" />
                List Your Business as a Supplier
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredCapabilities.map((capability) => (
                <SupplierCard
                  key={capability.id}
                  capability={capability}
                  onConnect={() => handleConnect(capability, 'capability')}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="needs" className="space-y-4">
          {filteredNeeds.length === 0 ? (
            <div className="text-center py-12 bg-slate-800/30 backdrop-blur-sm rounded-xl border border-white/10">
              <p className="text-slate-400 mb-4">No open business needs found</p>
              <Button variant="outline" className="border-amber-500/50 text-amber-400 hover:bg-amber-500/10 hover:text-amber-300">
                <Plus className="h-4 w-4 mr-2" />
                Post What You Need
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredNeeds.map((need) => (
                <NeedCard
                  key={need.id}
                  need={need}
                  onConnect={() => handleConnect(need, 'need')}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Connection Request Modal */}
      <ConnectionRequestModal
        isOpen={!!selectedItem && !!modalType}
        onClose={() => {
          setSelectedItem(null);
          setModalType(null);
        }}
        onSubmit={handleSubmitConnection}
        itemTitle={selectedItem?.title || ''}
        businessName={
          (selectedItem as any)?.business?.business_name || 'Business'
        }
      />
    </div>
  );
}
